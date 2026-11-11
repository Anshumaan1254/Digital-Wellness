"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, BedDouble, Puzzle, ShieldCheck, Timer } from "lucide-react";
import type { Category, Resource } from "@/data/resources";

const LOOK = {
  "phone-bedtime": { Icon: BedDouble, from: "#2a2550", to: "#0e1a2e", accent: "#c3bdf0", word: "Rest" },
  focus: { Icon: Timer, from: "#123a40", to: "#0b1622", accent: "#8fd3c8", word: "Focus" },
  browser: { Icon: Puzzle, from: "#3a2a2c", to: "#121a28", accent: "#f1c9a5", word: "Filter" },
  privacy: { Icon: ShieldCheck, from: "#1b3326", to: "#0b1622", accent: "#9fd0a6", word: "Protect" },
} as const;

function Panel({ c, tools, className = "" }: { c: Category; tools: Resource[]; className?: string }) {
  const look = LOOK[c.id];
  return (
    <article
      className={`relative flex shrink-0 flex-col justify-between overflow-hidden rounded-[2.5rem] p-8 sm:p-12 ${className}`}
      style={{ background: `radial-gradient(120% 90% at 85% 0%, ${look.from} 0%, ${look.to} 70%)` }}
    >
      <look.Icon aria-hidden className="absolute -right-10 -top-10 h-72 w-72 opacity-[0.07]" style={{ color: look.accent }} strokeWidth={1} />
      <div>
        <p className="font-serif text-[clamp(3.5rem,9vw,8rem)] leading-none" style={{ color: look.accent }}>
          {look.word}
        </p>
        <h3 className="mt-6 max-w-md font-serif text-2xl sm:text-3xl">{c.name}</h3>
        <p className="mt-3 max-w-md text-lg text-muted-foreground">{c.description}</p>
      </div>
      <div>
        <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-lg">
          {tools.map((t) => (
            <li key={t.id}>
              <Link href={`/resources/${t.id}`} className="border-b border-white/20 pb-0.5 hover:border-current" style={{ color: look.accent }}>
                {t.shortName}
              </Link>
            </li>
          ))}
        </ul>
        <Link href={`/resources?category=${c.id}`} className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-dawn">
          Compare {c.short.toLowerCase()} side by side <ArrowRight aria-hidden className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

function Header() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <p className="text-sm uppercase tracking-[0.22em] text-dawn">Four kinds of calm</p>
      <h2 className="mt-3 max-w-3xl font-serif text-[clamp(2.2rem,5vw,4rem)] leading-[1.05]">Start with the problem, not the app.</h2>
    </div>
  );
}

/* Pinned version: its own component so useScroll sees its target from the first mount. */
function PinnedSweep({ categories, resources }: { categories: Category[]; resources: Resource[] }) {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const distance = useRef(0);

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) distance.current = Math.max(0, trackRef.current.scrollWidth - window.innerWidth + 64);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // function form reads the latest measured distance on every scroll frame
  const x = useTransform(scrollYProgress, (p) => -distance.current * Math.min(1, Math.max(0, (p - 0.05) / 0.9)));

  return (
    <section ref={ref} aria-label="Four kinds of calm" className="relative" style={{ height: `${categories.length * 70 + 60}vh` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden pt-16">
        <Header />
        <motion.div ref={trackRef} className="mt-10 flex gap-6 pl-[max(1rem,calc((100vw-80rem)/2+1.5rem))]" style={{ x }}>
          {categories.map((c) => (
            <Panel key={c.id} c={c} tools={resources.filter((r) => r.category === c.id)} className="h-[min(62vh,600px)] w-[min(62vw,760px)]" />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/*
 * Vertical scroll drives a horizontal sweep through the four categories
 * (pinned, like Apple's feature galleries). On small screens and with
 * reduced motion it becomes a normal swipeable row.
 */
export function CategorySweep({ categories, resources }: { categories: Category[]; resources: Resource[] }) {
  const reduce = useReducedMotion();
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (wide && !reduce) return <PinnedSweep categories={categories} resources={resources} />;

  return (
    <section aria-label="Four kinds of calm" className="py-24">
      <Header />
      <div
        className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:px-6 [scrollbar-width:thin]"
        onFocusCapture={(e) => (e.target as HTMLElement).scrollIntoView({ block: "nearest", inline: "center" })}
      >
        {categories.map((c) => (
          <Panel key={c.id} c={c} tools={resources.filter((r) => r.category === c.id)} className="min-h-[520px] w-[86vw] max-w-[560px] snap-start" />
        ))}
      </div>
    </section>
  );
}
