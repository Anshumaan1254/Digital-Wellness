"use client";

import type { CSSProperties, ReactNode } from "react";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import { cn } from "@/lib/utils";

/* React Bits SpotlightCard tuned to the lake palette. */
export function CalmCard({
  children,
  className,
  tint = "rgba(143, 211, 200, 0.16)",
}: {
  children: ReactNode;
  className?: string;
  tint?: string;
}) {
  return (
    <SpotlightCard
      className={cn("relative isolate rounded-3xl p-6", className)}
      spotlightColor={tint}
      intensity={0.7}
      softness={0.8}
      grain={0.04}
      style={
        {
          "--spotlight-card-surface": "#112131",
          "--spotlight-card-border": "rgba(200, 222, 238, 0.12)",
        } as CSSProperties
      }
    >
      {children}
    </SpotlightCard>
  );
}
