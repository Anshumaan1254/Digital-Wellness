"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

/*
 * Apple-style hero exit: as you scroll away, the lake slowly pushes in and
 * darkens while the headline lifts and fades.
 */
export function HeroParallax({ scene, children }: { scene: ReactNode; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const dim = useTransform(scrollYProgress, [0, 0.9], [0, 0.75]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section ref={ref} className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-16">
      <motion.div className="absolute inset-0 -z-10" style={reduce ? undefined : { scale: sceneScale }}>
        {scene}
      </motion.div>
      {!reduce && <motion.div aria-hidden className="pointer-events-none absolute inset-0 -z-[4] bg-[#0b1622]" style={{ opacity: dim }} />}
      <motion.div className="w-full" style={reduce ? undefined : { y: textY, opacity: textOpacity }}>
        {children}
      </motion.div>
    </section>
  );
}
