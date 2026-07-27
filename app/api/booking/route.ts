import { NextRequest, NextResponse } from "next/server";

// Node runtime: the in-memory rate-limit Map must persist across warm
// invocations. The Edge runtime would give each request a fresh isolate.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Rate limiting: pure in-memory sliding window. No Upstash, no env vars, no
// module-scope side effects that can throw at import time. Max 5 requests per
// IP per 60s. This is intentionally dependency-free so the route loads and
// behaves identically in CI and on Vercel regardless of Redis configuration.
// ---------------------------------------------------------------------------
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

type Bucket = { hits: number[] };
const buckets = new Map<string, Bucket>();

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

// Returns { limited, retryAfter } where retryAfter is whole seconds until the
// oldest in-window hit expires. Prunes expired timestamps on every call.
function rateLimit(ip: string): { limited: boolean; retryAfter: number } {
  const now = Date.now();
  const bucket = buckets.get(ip) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < WINDOW_MS);

  if (bucket.hits.length >= MAX_REQUESTS) {
    const oldest = bucket.hits[0];
    const retryAfter = Math.max(1, Math.ceil((WINDOW_MS - (now - oldest)) / 1000));
    buckets.set(ip, bucket);
    return { limited: true, retryAfter };
  }

  bucket.hits.push(now);
  buckets.set(ip, bucket);

  // Opportunistic cleanup so the Map does not grow unbounded.
  if (buckets.size > 10_000) {
    for (const [key, b] of buckets) {
      b.hits = b.hits.filter((t) => now - t < WINDOW_MS);
      if (b.hits.length === 0) buckets.delete(key);
    }
  }

  return { limited: false, retryAfter: 0 };
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Digits, spaces, dashes, parens, optional leading +. 7-20 chars of content.
const PHONE_RE = /^\+?[0-9\s\-()]{7,20}$/;

type BookingInput = {
  name?: unknown;
  coopName?: unknown;
  email?: unknown;
  phone?: unknown;
};

function validate(body: BookingInput): {
  ok: boolean;
  errors: Record<string, string>;
  data?: { name: string; coopName: string; email: string; phone: string };
} {
  const errors: Record<string, string> = {};

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const coopName = typeof body.coopName === "string" ? body.coopName.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phoneRaw = typeof body.phone === "string" ? body.phone.trim() : "";

  if (!name) errors.name = "Name is required.";
  else if (name.length > 100) errors.name = "Name must be 100 characters or fewer.";

  if (!coopName) errors.coopName = "Coop name is required.";
  else if (coopName.length > 100) errors.coopName = "Coop name must be 100 characters or fewer.";

  if (!email) errors.email = "Email is required.";
  else if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";

  // Phone is optional; validate only if provided.
  if (phoneRaw && !PHONE_RE.test(phoneRaw)) {
    errors.phone = "Enter a valid phone number.";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    errors: {},
    data: { name, coopName, email, phone: phoneRaw },
  };
}

// ---------------------------------------------------------------------------
// POST /api/booking
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const { limited, retryAfter } = rateLimit(ip);
  if (limited) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  let body: BookingInput;
  try {
    body = (await req.json()) as BookingInput;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const result = validate(body);
  if (!result.ok) {
    return NextResponse.json(
      { errors: result.errors },
      { status: 422 }
    );
  }

  // Persistence: no Supabase/Resend credentials are confirmed in scope for
  // this launch, so we log the booking server-side. Swap this block for a DB
  // insert or transactional email once the storage layer is provisioned.
  const booking = { ...result.data!, receivedAt: new Date().toISOString(), ip };
  console.info("[booking] received", JSON.stringify(booking));

  return NextResponse.json(
    { ok: true, message: "Booking request received." },
    { status: 201 }
  );
}

// Any non-POST method returns 405 with an Allow header.
function methodNotAllowed() {
  return NextResponse.json(
    { error: "Method Not Allowed" },
    { status: 405, headers: { Allow: "POST" } }
  );
}

export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
