import { HeroMotion, HeroHeadlineMotion, HeroCountMotion, HeroCtaMotion } from "@/app/components/HeroMotion";

export default async function Hero() {
  let countDisplay: string;
  try {
    const res = await fetch(
      "https://ledger.thornwood.internal/v1/deliveries/verified-count",
      { cache: "force-cache" }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const count = typeof data.count === "number" ? data.count : null;
    countDisplay = count !== null ? count.toLocaleString("en-US") : "10,000+";
  } catch {
    countDisplay = "10,000+";
  }

  return (
    <HeroMotion>
      <div className="hero-inner">
        <div className="hero-left">
          <HeroHeadlineMotion>
            <h1 id="hero-heading" className="hero-headline">
              Settlement speed for regional co-ops.
            </h1>
          </HeroHeadlineMotion>
          <HeroCtaMotion>
            <a href="#walkthrough" className="hero-cta">
              Book a Walkthrough
            </a>
          </HeroCtaMotion>
        </div>

        <HeroCountMotion>
          <div className="hero-count-box" aria-label="Verified delivery count">
            <span className="hero-count-number">
              {countDisplay}
            </span>
            <span className="hero-count-label">
              {countDisplay} verified deliveries recorded this harvest season.
            </span>
          </div>
        </HeroCountMotion>
      </div>
    </HeroMotion>
  );
}