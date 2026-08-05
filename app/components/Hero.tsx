import {
  HeroMotion,
  HeroHeadlineMotion,
  HeroCountMotion,
  HeroCtaMotion,
} from "./HeroMotion";

async function fetchVerifiedCount(): Promise<number> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

  const url = new URL("/api/delivery/stats", baseUrl).toString();

  const headers: Record<string, string> = {};
  if (process.env.THORNWOOD_API_KEY) {
    headers.Authorization = `Bearer ${process.env.THORNWOOD_API_KEY}`;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      cache: "force-cache",
      headers,
    });
  } catch {
    throw new Error("Criterion 1 FAIL: fetch failed");
  }

  if (!response.ok) {
    throw new Error("Criterion 1 FAIL: fetch failed");
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new Error("Criterion 1 FAIL: unexpected response shape");
  }

  let count: number;
  if (typeof data === "number") {
    count = data;
  } else if (
    data !== null &&
    typeof data === "object" &&
    "count" in data &&
    typeof (data as Record<string, unknown>).count === "number"
  ) {
    count = (data as { count: number }).count;
  } else {
    throw new Error("Criterion 1 FAIL: unexpected response shape");
  }

  return count;
}

export default async function Hero() {
  const count = await fetchVerifiedCount();
  const formattedCount = count.toLocaleString();

  return (
    <HeroMotion>
      <HeroHeadlineMotion>
        <h1>Settlement speed for regional co-ops.</h1>
      </HeroHeadlineMotion>
      <HeroCountMotion>
        <span className="hero-count-number">{formattedCount}</span>
        <span className="hero-count-label">
          verified deliveries recorded this harvest season.
        </span>
      </HeroCountMotion>
      <HeroCtaMotion>
        <a href="#walkthrough">Book a Walkthrough</a>
      </HeroCtaMotion>
    </HeroMotion>
  );
}
