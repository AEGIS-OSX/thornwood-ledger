"use client";

import { useState, useEffect } from "react";

function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReduced(mql.matches);

    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return prefersReduced;
}

const transitionStyle =
  "opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1), transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)";

export function HeroMotion({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  const style: React.CSSProperties = reduced
    ? { opacity: 1, transform: "none", transition: "none" }
    : {
        opacity: mounted ? 1 : 0,
        transform: mounted ? "none" : "translateY(18px)",
        transition: transitionStyle,
        transitionDelay: "0ms",
      };

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}

export function HeroHeadlineMotion({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  const style: React.CSSProperties = reduced
    ? { opacity: 1, transform: "none", transition: "none" }
    : {
        opacity: mounted ? 1 : 0,
        transform: mounted ? "none" : "translateY(14px)",
        transition: transitionStyle,
        transitionDelay: "60ms",
      };

  return (
    <h1
      className="font-display text-5xl font-semibold tracking-tight text-[var(--color-ink)] lg:text-6xl"
      style={style}
    >
      {children}
    </h1>
  );
}

export function HeroCountMotion({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  const style: React.CSSProperties = reduced
    ? { opacity: 1, transform: "none", transition: "none" }
    : {
        opacity: mounted ? 1 : 0,
        transform: mounted ? "none" : "scale(0.96)",
        transition: transitionStyle,
        transitionDelay: "120ms",
      };

  return <div style={style}>{children}</div>;
}

export function HeroCtaMotion({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  const style: React.CSSProperties = reduced
    ? { opacity: 1, transform: "none", transition: "none" }
    : {
        opacity: mounted ? 1 : 0,
        transform: mounted ? "none" : "translateY(8px)",
        transition: transitionStyle,
        transitionDelay: "180ms",
      };

  return <div style={style}>{children}</div>;
}
