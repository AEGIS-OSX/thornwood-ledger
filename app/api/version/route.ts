export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json({
    sha: process.env.VERCEL_GIT_COMMIT_SHA ?? 'unknown',
    deployedAt: new Date().toISOString(),
  });
}
