export async function GET() {
  try {
    const res = await fetch(
      "https://ledger.thornwood.internal/v1/deliveries/verified-count",
      { cache: "force-cache" }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (typeof data.count === "number") {
      return Response.json({ count: data.count });
    }
  } catch {
    // Fallback to static count if upstream is unreachable
  }
  return Response.json({ count: 1247 });
}
