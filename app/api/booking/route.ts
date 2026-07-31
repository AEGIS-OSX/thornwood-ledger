import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Lazily construct the rate limiter on first use. Do NOT build it at
// module scope: Redis.fromEnv() throws synchronously when the Upstash
// env vars are absent, and Next loads every route module at
// build/gate time, so a module-scope throw crashes route load (the
// crash previously surfaced in the stack against /api/version). When
// Redis is not configured we fail open so the endpoint still loads
// and serves.
let cachedRatelimit: Ratelimit | null | undefined;

function getRatelimit(): Ratelimit | null {
  if (cachedRatelimit !== undefined) return cachedRatelimit;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    cachedRatelimit = null;
    return cachedRatelimit;
  }

  cachedRatelimit = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(5, "60 s"),
    analytics: false,
  });
  return cachedRatelimit;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  // E.164 or local numeric-ish formats
  return /^[\d\s\-+().]{7,20}$/.test(phone);
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "anonymous";

    const ratelimit = getRatelimit();
    if (ratelimit) {
      const { success, reset } = await ratelimit.limit(ip);

      if (!success) {
        const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
        return Response.json(
          { error: "Too many requests", retryAfter },
          { status: 429, headers: { "Retry-After": String(retryAfter) } }
        );
      }
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return Response.json(
        { errors: { _form: "Invalid JSON body" } },
        { status: 422 }
      );
    }

    const errors: Record<string, string> = {};

    const name =
      typeof body.name === "string" ? body.name.trim() : "";
    const coopName =
      typeof body.coopName === "string" ? body.coopName.trim() : "";
    const email =
      typeof body.email === "string" ? body.email.trim() : "";
    const phone =
      typeof body.phone === "string" ? body.phone.trim() : "";

    if (!name) {
      errors.name = "Name is required";
    } else if (name.length > 100) {
      errors.name = "Name must be 100 characters or fewer";
    }

    if (!coopName) {
      errors.coopName = "Co-op name is required";
    } else if (coopName.length > 100) {
      errors.coopName = "Co-op name must be 100 characters or fewer";
    }

    if (!email) {
      errors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (phone && !isValidPhone(phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    if (Object.keys(errors).length > 0) {
      return Response.json({ errors }, { status: 422 });
    }

    return Response.json({ success: true }, { status: 201 });
  } catch {
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({ error: "Method Not Allowed" }, { status: 405 });
}
