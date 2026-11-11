"use client";

import type { ReactNode } from "react";
import FadeContent from "@/components/reactbits/FadeContent";

/* React Bits FadeContent with the "mist" effect: content drifts in like fog lifting. */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <FadeContent effect="mist" duration={1.1} delay={delay} threshold={0.15} className={className}>
      {children}
    </FadeContent>
  );
}
