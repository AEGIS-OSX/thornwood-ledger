// app/components/Hero.tsx
// NO "use client" — this is an async Server Component
import { HeroMotion, HeroHeadlineMotion, HeroCountMotion, HeroCtaMotion } from "./HeroMotion";

async function Hero() {
  // ── CRITERION 1: Build-time fetch ──────────────────────────────────────
  // [SEC TARGET: app/components/Hero.tsx (build-time fetch)]
  // AUTH-002: Use THORNWOOD_API_KEY env var. Never embed in client bundle.
  // IDOR-002: Verify response is scalar (integer/float), not structured object.
  let count: number;

  try {
    const headers: Record<string, string> = {
      "Accept": "application/json",
    };
    if (process.env.THORNWOOD_API_KEY) {
      headers["Authorization"] = `Bearer ${process.env.THORNWOOD_API_KEY}`;
    }

    const res = await fetch(
      "https://ledger.thornwood.internal/v1/deliveries/verified-count",
      {
        headers,
        cache: "force-cache", // static export: bake at build time
      }
    );

    if (!res.ok) {
      throw new Error(`Verified-count API returned ${res.status}`);
    }

    const raw: unknown = await res.json();

    // IDOR-002: Accept only scalar integer/float or an object with a single
    // aggregate field. Reject any response that contains per-co-op or
    // per-member records.
    if (typeof raw === "number" && Number.isFinite(raw)) {
      count = Math.floor(raw);
    } else if (
      typeof raw === "object" &&
      raw !== null &&
      !Array.isArray(raw) &&
      "count" in raw &&
      typeof (raw as Record<string, unknown>).count === "number" &&
      Number.isFinite((raw as Record<string, unknown>).count as number)
    ) {
      // Only the aggregate field — never expose per-record data
      count = Math.floor((raw as Record<string, unknown>).count as number);
    } else {
      throw new Error(
        "Criterion 1 FAIL: API response is not a scalar number or {count: number}. " +
        "Per-record or structured data must not be rendered."
      );
    }
  } catch (err) {
    // Build MUST fail if count cannot be fetched — hardcoded fallback is forbidden.
    throw new Error(
      `Criterion 1 FAIL: Could not fetch verified-delivery count from ` +
      `https://ledger.thornwood.internal/v1/deliveries/verified-count. ` +
      `Error: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  const formattedCount = count.toLocaleString("en-US");

  return (
    <HeroMotion>
      <div className="hero-inner">
        {/* Left column: headline + CTA */}
        <div className="hero-left">
          <HeroHeadlineMotion>
            <h1 className="hero-headline heading-display">
              Settlement speed for regional co-ops.
            </h1>
          </HeroHeadlineMotion>
          <HeroCtaMotion>
            <a href="#walkthrough" className="hero-cta">
              Book a Walkthrough
            </a>
          </HeroCtaMotion>
        </div>

        {/* Right column: verified-delivery count box */}
        <HeroCountMotion>
          <div className="hero-count-box" aria-label="Verified deliveries recorded this harvest season">
            <span className="hero-count-number">{formattedCount}</span>
            <span className="hero-count-label">
              verified deliveries recorded this harvest season.
            </span>
          </div>
        </HeroCountMotion>
      </div>
    </HeroMotion>
  );
}

export default Hero;
