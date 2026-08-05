export default async function Hero() {
  const url = "https://ledger.thornwood.internal/v1/deliveries/verified-count";

  const headers: Record<string, string> = {};
  if (process.env.THORNWOOD_API_KEY) {
    headers.Authorization = `Bearer ${process.env.THORNWOOD_API_KEY}`;
  }

  let response;
  try {
    response = await fetch(url, { cache: "no-store", headers });
    if (!response.ok) {
      throw new Error("Criterion 1 FAIL: fetch failed");
    }
  } catch {
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

  const formattedCount = count.toLocaleString();

  return (
    <section className="hero">
      <h1 className="hero-headline">Settlement speed for regional co-ops.</h1>
      <div className="hero-count">
        <span className="hero-count-number">{formattedCount}</span>
        <span className="hero-count-label">
          verified deliveries recorded this harvest season.
        </span>
      </div>
      <a href="#walkthrough" className="hero-cta">
        Book a Walkthrough
      </a>
    </section>
  );
}
