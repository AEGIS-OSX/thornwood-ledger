import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA
    || process.env.GITHUB_SHA
    || "unknown";

  return NextResponse.json({
    sha,
    deployedAt: new Date().toISOString(),
  });
}
