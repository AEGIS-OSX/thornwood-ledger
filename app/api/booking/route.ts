import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Rate limiting
//
// IMPORTANT: no network client is constructed at module scope. A previous
// version called Redis.fromEnv() at the top level; when Upstash env vars are
// absent (the default on this deployment) that constructor throws at import
// time and crashes the entire route module for every request. Here the limiter
// is resolved lazily inside the handler and always has a working in-memory
// fallback, so the route runs whether or not Redis is provisioned.
// ---------------------------------------------------------------------------

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

type Hit = { count: number; resetAt: number };

// Module-level map is process-local. Adequate as a fail-safe fallback; on a
// single serverless instance it enforces the window, and it never throws.
const memoryHits: Map<string, Hit> = new Map();

function memoryRateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const existing = memoryHits.get(ip);

  if (!existing || now >= existing.resetAt) {
    memoryHits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }

  if (existing.count >= MAX_REQUESTS) {
    return { allowed: false, retryAfter: Math.ceil((existing.resetAt - now) / 1000) };
  }

  existing.count += 1;
  memoryHits.set(ip, existing);
  return { allowed: true, retryAfter: 0 };
}

// Opportunistically use Upstash if BOTH env vars are present. Import and client
// construction are wrapped so any failure degrades to the in-memory limiter
// rather than crashing the route.
async function rateLimit(ip: string): Promise<{ allowed: boolean; retryAfter: number }> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return memoryRateLimit(ip);
  }

  try {
    const { Redis } = await import("@upstash/redis");
    const redis = new Redis({ url, token });
    const key = `booking:ratelimit:${ip}`;
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, Math.ceil(WINDOW_MS / 1000));
    }
    if (count > MAX_REQUESTS) {
      const ttl = await redis.ttl(key);
      return { allowed: false, retryAfter: ttl > 0 ? ttl : Math.ceil(WINDOW_MS / 1000) };
    }
    return { allowed: true, retryAfter: 0 };
  } catch {
    // Any Redis failure (network, auth, missing package) falls back safely.
    return memoryRateLimit(ip);
  }
}

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[0-9()\-\s]{7,20}$/;

type FieldErrors = Record<string, string>;

function validate(body: unknown): { ok: true; data: { name: string; coopName: string; email: string; phone: string | null } } | { ok: false; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const b = (body ?? {}) as Record<string, unknown>;

  const name = typeof b.name === "string" ? b.name.trim() : "";
  const coopName = typeof b.coopName === "string" ? b.coopName.trim() : "";
  const email = typeof b.email === "string" ? b.email.trim() : "";
  const phoneRaw = typeof b.phone === "string" ? b.phone.trim() : "";

  if (!name) errors.name = "Name is required.";
  else if (name.length > 100) errors.name = "Name must be 100 characters or fewer.";

  if (!coopName) errors.coopName = "Co-op name is required.";
  else if (coopName.length > 100) errors.coopName = "Co-op name must be 100 characters or fewer.";

  if (!email) errors.email = "Email is required.";
  else if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";

  if (phoneRaw && !PHONE_RE.test(phoneRaw)) errors.phone = "Enter a valid phone number.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return { ok: true, data: { name, coopName, email, phone: phoneRaw || null } };
}

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  const ip = clientIp(req);

  const limit = await rateLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const result = validate(body);
  if (!result.ok) {
    return NextResponse.json({ error: "Validation failed.", fields: result.errors }, { status: 422 });
  }

  // Persistence: forward to Supabase REST if configured; otherwise log so the
  // request is never silently dropped. Never throws at module scope.
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const record = {
    name: result.data.name,
    coop_name: result.data.coopName,
    email: result.data.email,
    phone: result.data.phone,
    created_at: new Date().toISOString(),
  };

  if (supabaseUrl && supabaseKey) {
    try {
      const resp = await fetch(`${supabaseUrl}/rest/v1/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify(record),
      });
      if (!resp.ok) {
        const detail = await resp.text().catch(() => "");
        console.error("[booking] Supabase persist failed", resp.status, detail);
        return NextResponse.json({ error: "Could not save your booking. Please try again." }, { status: 502 });
      }
    } catch (err) {
      console.error("[booking] Supabase request error", err);
      return NextResponse.json({ error: "Could not save your booking. Please try again." }, { status: 502 });
    }
  } else {
    // No storage provisioned: log the lead so it is not lost, and still succeed.
    console.log("[booking] new booking (no storage configured)", record);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function GET() {
  return NextResponse.json(
    { error: "Method Not Allowed" },
    { status: 405, headers: { Allow: "POST" } },
  );
}
