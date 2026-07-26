"use client";

import { useState, useEffect } from "react";

export default function Hero() {
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("https://ledger.thornwood.internal/v1/deliveries/verified-count")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        if (typeof data?.count === "number") {
          setCount(data.count);
        } else {
          setError(true);
        }
      })
      .catch(() => {
        setError(true);
      });
  }, []);

  return (
    <section className="hero-section" aria-labelledby="hero-headline">
      <div className="hero-inner">
        <div className="hero-left">
          <h1 id="hero-headline" className="hero-headline">
            Bookkeeping clarity for growing businesses
          </h1>
          <p className="hero-sub">
            Thornwood Ledger keeps your books accurate, your reports current, and your team focused on the work that matters.
          </p>
          <a href="#walkthrough" className="hero-cta">
            Book a Walkthrough
          </a>
        </div>
        <div className="hero-count-box">
          <span className="hero-count-number" aria-live="polite">
            {error ? "—" : count !== null ? count.toLocaleString() : "—"}
          </span>
          <span className="hero-count-label">
            verified deliveries tracked this month
          </span>
        </div>
      </div>
    </section>
  );
}
