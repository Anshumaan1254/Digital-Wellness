"use client";

import dynamic from "next/dynamic";

/* The WebGL lake only loads in the browser; the CSS sky below shows first. */
const LakeScene = dynamic(() => import("./LakeScene"), { ssr: false });

export function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10" aria-hidden="true">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#0a1428_0%,#1a2547_38%,#5d6390_58%,#d4b0a3_66%,#2a3550_67%,#0b1622_100%)]" />
      <LakeScene className="absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
    </div>
  );
}
