import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---- validation ----

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type BookingBody = {
  name?: unknown;
  coopName?: unknown;
  email?: unknown;
  phone?: unknown;
};

type FieldErrors = Record<string, string>;

function validate(body: BookingBody): { errors: FieldErrors; data?: { name: string; coopName: string; email: string; phone: string | null } } {
  const errors: FieldErrors = {};

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const coopName = typeof body.coopName === "string" ? body.coopName.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phoneRaw = typeof body.phone === "string" ? body.phone.trim() : "";

  if (!name) errors.name = "Name is required.";
  else if (name.length > 100) errors.name = "Name must be 100 characters or fewer.";

  if (!coopName) errors.coopName = "Co-op name is required.";
  else if (coopName.length > 100) errors.coopName = "Co-op name must be 100 characters or fewer.";

  if (!email) errors.email = "Email is required.";
  else if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";

  if (phoneRaw && !/^[+]?[0-9 ().-]{7,20}$/.test(phoneRaw)) {
    errors.phone = "Enter a valid phone number.";
  }

  if (Object.keys(errors).length > 0) return { errors };

  return {
    errors: {},
    data: { name, coopName, email, phone: phoneRaw || null },
  };
}

// ---- in-memory sliding-window rate limit: 5 req / IP / 60s ----

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

function getRateLimitStore(): Map<string, number[]> {
  const g = globalThis as unknown as { __bookingRate?: Map<string, number[]> };
  if (!g.__bookingRate) g.__bookingRate = new Map<string, number[]>();
  return g.__bookingRate;
}

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

function rateLimit(ip: string): { limited: boolean; retryAfter: number } {
  const store = getRateLimitStore();
  const now = Date.now();
  const hits = (store.get(ip) || []).filter((t) => now - t < WINDOW_MS);

  if (hits.length >= MAX_REQUESTS) {
    const oldest = hits[0];
    const retryAfter = Math.max(1, Math.ceil((WINDOW_MS - (now - oldest)) / 1000));
    store.set(ip, hits);
    return { limited: true, retryAfter };
  }

  hits.push(now);
  store.set(ip, hits);
  return { limited: false, retryAfter: 0 };
}

// ---- handlers ----

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const rl = rateLimit(ip);
  if (rl.limited) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  let body: BookingBody;
  try {
    body = (await req.json()) as BookingBody;
  } catch {
    return NextResponse.json({ errors: { _form: "Invalid JSON body." } }, { status: 422 });
  }

  const { errors, data } = validate(body);
  if (!data) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  // Persistence: no Supabase/Resend credentials confirmed in scope for this repo.
  // Log the validated booking so it is not silently discarded; swap for a real
  // storage layer once a backend target is confirmed with the Founder.
  console.info("[booking] received", {
    coopName: data.coopName,
    email: data.email,
    hasPhone: Boolean(data.phone),
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function GET() {
  return NextResponse.json(
    { error: "Method Not Allowed" },
    { status: 405, headers: { Allow: "POST" } },
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: "Method Not Allowed" },
    { status: 405, headers: { Allow: "POST" } },
  );
}

export async function PATCH() {
  return NextResponse.json(
    { error: "Method Not Allowed" },
    { status: 405, headers: { Allow: "POST" } },
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Method Not Allowed" },
    { status: 405, headers: { Allow: "POST" } },
  );
}
