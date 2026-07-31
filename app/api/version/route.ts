import { NextResponse } from "next/server";

// This endpoint backs the post-merge deploy-verification check
// (garrison / aegis-gate polls it to confirm the live deployment
// matches the merged commit SHA). It must never be statically
// optimized -- force-dynamic guarantees a fresh read on every hit
// instead of a build-time-frozen value baked into the prerendered
// output.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const sha =
    process.env.VERCEL_GIT_COMMIT_SHA ??
    process.env.GIT_COMMIT_SHA ??
    process.env.NEXT_PUBLIC_COMMIT_SHA ??
    "unknown";

  return NextResponse.json(
    {
      sha,
      status: "ok",
      checkedAt: new Date().toISOString(),
    },
    { status: 200 }
  );
}
