"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ProjectImage } from "@/app/components/ProjectImage";
import "./SocialProof.css";

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
    <motion.section
      id="proof"
      className="proof-section"
      {...sectionMotionProps}
    >
      <div className="proof-image-col" aria-hidden="true">
        <ProjectImage id="social_proof" className="proof-image" />
      </div>
      <motion.div
        className="proof-content-col"
        {...contentMotionProps}
      >
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
