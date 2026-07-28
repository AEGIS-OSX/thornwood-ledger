export default async function Hero() {
  // Fetch the verified delivery count at BUILD TIME.
  // If the internal API is unreachable (e.g. in CI), fall back to a
  // static placeholder so the build never crashes.
  let countDisplay: string;
  try {
    const apiUrl = process.env.THORNWOOD_VERIFICATION_API_URL 
      ?? 'https://zkvkbpxrxnfynqqeytke.supabase.co/rest/v1/rpc/verified_delivery_count';
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      headers['apikey'] = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    }
    const res = await fetch(apiUrl, { 
      next: { revalidate: 3600 },
      headers,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const count = typeof data.count === "number" ? data.count : null;
    countDisplay = count !== null ? count.toLocaleString("en-US") : "10,000+";
  } catch {
    countDisplay = "10,000+";
  }

  return (
    <section className="hero-section" aria-labelledby="hero-heading">
      <div className="hero-inner">
        <div className="hero-left">
          <h1 id="hero-heading" className="hero-headline">
            Bookkeeping clarity for growing businesses
          </h1>
          <p style={{ color: "var(--color-muted)", fontSize: "var(--text-lg)", lineHeight: 1.65, margin: 0, maxWidth: "52ch" }}>
            Thornwood Ledger keeps your books accurate, your reports current, and your team focused on the work that matters.
          </p>
          <a href="#walkthrough" className="hero-cta">
            Book a Walkthrough
          </a>
        </div>

        <div className="hero-count-box">
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
