"use client";

import { useEffect, useState } from "react";

function CountSkeleton() {
  return (
    <div className="hero-count-box" aria-busy="true" aria-label="Loading verified delivery count">
      <div
        style={{
          width: "6rem",
          height: "3rem",
          background: "var(--color-border)",
          borderRadius: "var(--radius)",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
      <div
        style={{
          width: "10rem",
          height: "1rem",
          background: "var(--color-border)",
          borderRadius: "var(--radius)",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
    </div>
  );
}

export default function Hero() {
  const [count, setCount] = useState<number | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    fetch("https://ledger.thornwood.internal/v1/deliveries/verified-count")
      .then((res) => {
        if (!res.ok) throw new Error("non-2xx");
        return res.json();
      })
      .then((data: { count: number }) => {
        if (!cancelled) {
          setCount(data.count);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

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

        {status === "loading" && <CountSkeleton />}

        {status === "ready" && (
          <div className="hero-count-box">
            <span className="hero-count-number">
              {count !== null ? count.toLocaleString() : "--"}
            </span>
            <span className="hero-count-label">
              Verified deliveries processed through Thornwood Ledger
            </span>
          </div>
        )}

        {status === "error" && (
          <div className="hero-count-box">
            <span className="hero-count-number">--</span>
            <span className="hero-count-label">
              Verified deliveries processed through Thornwood Ledger
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
