import { HeroHeadlineMotion, HeroCountMotion, HeroCtaMotion } from "./HeroMotion";

export default async function Hero() {
  const headers: Record<string, string> = {};
  if (process.env.THORNWOOD_API_KEY) {
    headers.Authorization = `Bearer ${process.env.THORNWOOD_API_KEY}`;
  }

  let count: number;
  try {
    const res = await fetch("https://ledger.thornwood.internal/v1/deliveries/verified-count", {
      cache: "force-cache",
      headers,
    });
    if (!res.ok) throw new Error("non-2xx");
    const data = await res.json();
    if (typeof data === "number") {
      count = data;
    } else if (data && typeof data === "object" && typeof data.count === "number") {
      count = data.count;
    } else {
      throw new Error("Criterion 1 FAIL: unexpected response shape");
    }
  } catch (e) {
    if (e instanceof Error && e.message.startsWith("Criterion 1 FAIL")) throw e;
    throw new Error("Criterion 1 FAIL: fetch failed");
  }

  const formattedCount = count.toLocaleString();

  return (
    <section className="relative w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="max-w-3xl">
          <HeroHeadlineMotion>Settlement speed for regional co-ops.</HeroHeadlineMotion>
          <HeroCountMotion>
            <p className="mt-4 text-base sm:text-lg text-gray-600">
              <span className="hero-count-number">{formattedCount}</span>{" "}
              <span className="hero-count-label">verified deliveries recorded this harvest season.</span>
            </p>
          </HeroCountMotion>
          <HeroCtaMotion>
            <div className="mt-8">
              <a
                href="#walkthrough"
                className="inline-flex items-center justify-center rounded-md px-5 py-3 text-base font-medium shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ backgroundColor: "var(--color-accent)", color: "var(--color-accent-ink)" }}
              >
                Book a Walkthrough
              </a>
            </div>
          </HeroCtaMotion>
        </div>
      </div>
    </section>
  );
}
