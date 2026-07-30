export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const body = JSON.stringify({
      sha: process.env.VERCEL_GIT_COMMIT_SHA || '82443f6',
      deployedAt: new Date().toISOString(),
    });
    return new Response(body, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(
      JSON.stringify({ sha: '82443f6', error: 'version-unavailable' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
