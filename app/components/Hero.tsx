'use client';

import { useEffect, useState } from 'react';
import HeroMotion from './HeroMotion';

// Live delivery count is fetched at RUNTIME in the browser, never at build.
// This is mandatory: next.config.js sets output:'export' (static export),
// which has no request-time render phase. Any server-side/build-time fetch
// to the internal-only ledger host resolves during `next build`, where the
// CI sandbox has no network route -> the build throws. A client fetch keeps
// the count live (the page is served inside the internal network that can
// reach the host) while leaving the build free of network I/O.

const STATS_ENDPOINT =
  process.env.NEXT_PUBLIC_LEDGER_STATS_URL ?? '/api/delivery/stats';

type CountState =
  | { status: 'loading' }
  | { status: 'ready'; count: number }
  | { status: 'error' };

function formatCount(n: number): string {
  return new Intl.NumberFormat('en-US').format(n);
}

export default function Hero() {
  const [state, setState] = useState<CountState>({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const res = await fetch(STATS_ENDPOINT, {
          signal: controller.signal,
          cache: 'no-store',
        });
        if (!res.ok) {
          throw new Error(`stats endpoint returned ${res.status}`);
        }
        const data: unknown = await res.json();
        const count =
          typeof (data as { count?: unknown })?.count === 'number'
            ? (data as { count: number }).count
            : Number.NaN;
        if (!Number.isFinite(count)) {
          throw new Error('stats endpoint returned a non-numeric count');
        }
        setState({ status: 'ready', count });
      } catch (err) {
        if ((err as { name?: string })?.name === 'AbortError') return;
        setState({ status: 'error' });
      }
    }

    void load();
    return () => controller.abort();
  }, []);

  let countLabel: string;
  if (state.status === 'ready') {
    countLabel = formatCount(state.count);
  } else if (state.status === 'error') {
    countLabel = '\u2014'; // em dash placeholder on failure
  } else {
    countLabel = '\u2026'; // ellipsis while loading
  }

  return (
    <HeroMotion>
      <p className="hero-count">
        <span
          className="hero-count-number"
          aria-live="polite"
          aria-busy={state.status === 'loading'}
          data-status={state.status}
        >
          {countLabel}
        </span>{' '}
        <span className="hero-count-label">deliveries logged</span>
      </p>
    </HeroMotion>
  );
}
