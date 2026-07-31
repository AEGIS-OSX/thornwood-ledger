"use client";
import { motion, useReducedMotion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1];

export function HeroMotion({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HeroHeadlineMotion({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.h1
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease, delay: 0.06 }}
      className="font-display text-5xl font-semibold tracking-tight text-[var(--color-ink)] lg:text-6xl"
    >
      {children}
    </motion.h1>
  );
}

export function HeroCountMotion({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.28, ease, delay: 0.12 }}
    >
      {children}
    </motion.div>
  );
}

export function HeroCtaMotion({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease, delay: 0.18 }}
    >
      {children}
    </motion.div>
  );
}
