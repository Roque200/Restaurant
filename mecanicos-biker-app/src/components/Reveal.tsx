"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      // Content stays fully opaque even if the reveal never fires (e.g. a
      // visitor lands mid-page from a shared #anchor link and this section
      // is skipped over) — only the position animates, never the visibility.
      initial={{ opacity: 1, y }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09 },
  },
};

// opacity is intentionally omitted from "hidden": items must never render
// invisible if whileInView doesn't fire (deep-linked #anchor loads skip
// intermediate sections entirely, so their IntersectionObserver never runs).
export const staggerItem: Variants = {
  hidden: { opacity: 1, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};
