// app/components/Hero.tsx
export default async function Hero() {
  let countDisplay: string;
  try {
    const res = await fetch(
      "https://ledger.thornwood.internal/v1/deliveries/verified-count",
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const count = typeof data.count === "number" ? data.count : null;
    countDisplay = count !== null ? count.toLocaleString("en-US") : "10,000+";
  } catch {
    countDisplay = "10,000+";
  }

  return (
    <section className="hero-root">
      <div className="hero-inner">
        <div className="hero-content">
          <h1 className="hero-headline">
            Bookkeeping clarity for growing businesses
          </h1>
          <p className="hero-subhead">
            Thornwood Ledger keeps your books accurate, your reports current, and your team focused on the work that matters.
          </p>
          <a href="#walkthrough" className="hero-cta">
            Book a Walkthrough
          </a>
        </div>

        <div className="hero-count" aria-label="Verified delivery count">
          <span className="hero-count-number">
            {countDisplay}
          </span>
          <span className="hero-count-label">
            verified deliveries
          </span>
        </div>
      </div>
    </section>
  );
}
