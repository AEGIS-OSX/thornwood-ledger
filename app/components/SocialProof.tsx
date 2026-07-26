"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ProjectImage } from "@/app/components/ProjectImage";

export default function SocialProof() {
  const shouldReduceMotion = useReducedMotion();

  const sectionMotionProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
      };

  const contentMotionProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, x: 24 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 },
      };

  return (
    <motion.section id="proof" className="proof-section" {...sectionMotionProps}>
      {/* Styles live inline in this file (no companion CSS file) so the import
          can never point at a file that was not committed. */}
      <style>{`
        .proof-section {
          display: flex;
          flex-wrap: wrap;
          background-color: var(--color-surface-dark);
          color: var(--color-paper);
        }
        .proof-image-col {
          flex: 0 0 45%;
          max-width: 45%;
          position: relative;
        }
        .proof-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .proof-content-col {
          flex: 1 1 320px;
          min-width: 320px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: var(--space-8);
        }
        .proof-quote {
          margin: 0;
          border-left: 2px solid var(--color-accent);
          padding-left: var(--space-6);
        }
        .proof-quote-text {
          font-family: var(--font-display);
          font-size: var(--text-3xl);
          font-weight: 500;
          line-height: 1.4;
          color: var(--color-paper);
          margin: 0;
        }
        .proof-attribution {
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 500;
          color: var(--color-paper);
          opacity: 0.75;
          margin-top: var(--space-4);
        }
        .proof-support {
          font-family: var(--font-body);
          font-size: var(--text-sm);
          color: var(--color-paper);
          opacity: 0.6;
          margin-top: var(--space-6);
        }
        @media (max-width: 767px) {
          .proof-image-col {
            display: none;
          }
          .proof-content-col {
            flex: 1 1 100%;
            max-width: 100%;
          }
        }
      `}</style>
      <div className="proof-image-col" aria-hidden="true">
        <ProjectImage id="social_proof" className="proof-image" />
      </div>
      <motion.div className="proof-content-col" {...contentMotionProps}>
        <blockquote className="proof-quote">
          <p className="proof-quote-text">
            Thornwood Ledger cut our settlement processing time by three days. Our members get paid faster, and our office staff isn't buried in paperwork during the October rush.
          </p>
          <footer className="proof-attribution">
            Robert Miller, General Manager, Tri-County Grain Co-op
          </footer>
        </blockquote>
        <p className="proof-support">
          We provide on-site training for scale operators and office staff. Phone support is available 24/7 during harvest.
        </p>
      </motion.div>
    </motion.section>
  );
}
