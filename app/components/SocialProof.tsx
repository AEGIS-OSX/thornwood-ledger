"use client";

import { useState, useEffect, useRef } from "react";
import { ProjectImage } from "@/app/components/ProjectImage";

export default function SocialProof() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !sectionRef.current) return;
    const el = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const sectionStyle = prefersReducedMotion
    ? { opacity: 1, transform: "none" }
    : {
        opacity: visible ? 1 : 0,
        transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
      };

  const contentStyle = prefersReducedMotion
    ? { opacity: 1, transform: "none" }
    : {
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0px)" : "translateX(24px)",
        transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
      };

  return (
    <section
      id="proof"
      className="proof-section"
      ref={sectionRef}
      style={sectionStyle}
    >
      <div className="proof-image-col">
        <ProjectImage id="social_proof" className="proof-image" />
      </div>
      <div className="proof-content-col" style={contentStyle}>
        <span className="proof-quote-mark" aria-hidden="true">&ldquo;</span>
        <figure className="proof-quote">
          <blockquote className="proof-quote-text">
            Thornwood Ledger cut our settlement processing time by three days. Our members get paid faster, and our office staff isn&apos;t buried in paperwork during the October rush.
          </blockquote>
          <figcaption className="proof-attribution">
            Robert Miller, General Manager, Tri-County Grain Co-op
          </figcaption>
        </figure>
        <p className="proof-support">
          We provide on-site training for scale operators and office staff. Phone support is available 24/7 during harvest.
        </p>
      </div>
    </section>
  );
}
