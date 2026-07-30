import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json({
      sha: process.env.VERCEL_GIT_COMMIT_SHA || '82443f6',
      deployedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { sha: '82443f6', error: 'version-unavailable' },
      { status: 200 }
    );
  }
}
