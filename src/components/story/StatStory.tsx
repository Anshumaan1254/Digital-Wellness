"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

export type StoryStat = {
  value: string;
  lead: string;
  label: string;
  source: string;
  href: string;
  tint: string;
};

/*
 * A pinned "chapter" like Apple's product pages: the screen holds still
 * while one huge number gives way to the next as you scroll.
 * Screen readers get the same facts as a plain list.
 */
/* Piecewise-linear mapping, evaluated in JS on every scroll frame. */
function interp(p: number, xs: number[], ys: number[]) {
  if (p <= xs[0]) return ys[0];
  for (let i = 1; i < xs.length; i++) {
    if (p <= xs[i]) {
      const t = (p - xs[i - 1]) / (xs[i] - xs[i - 1] || 1);
      return ys[i - 1] + (ys[i] - ys[i - 1]) * t;
    }
  }
  return ys[ys.length - 1];
}

function Layer({ stat, index, count, progress }: { stat: StoryStat; index: number; count: number; progress: MotionValue<number> }) {
  const step = 1 / count;
  const start = index * step;
  const end = start + step;
  const first = index === 0;
  const last = index === count - 1;
  // fade out fully before the next number fades in, so two never overlap
  const opacity = useTransform(progress, (p) =>
    interp(p, [start + 0.005, start + 0.05, end - 0.05, end - 0.005], [first ? 1 : 0, 1, 1, last ? 1 : 0])
  );
  const y = useTransform(progress, (p) => interp(p, [start + 0.005, start + 0.06, end - 0.06, end - 0.005], [first ? 0 : 50, 0, 0, last ? 0 : -50]));
  const scale = useTransform(progress, (p) => interp(p, [start + 0.005, start + 0.08], [first ? 1 : 0.88, 1]));
  return (
    <motion.div aria-hidden className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center" style={{ opacity, y }}>
      <p className="mb-4 text-sm uppercase tracking-[0.22em] text-mist">{stat.lead}</p>
      <motion.p
        className="bg-clip-text font-serif text-[clamp(6rem,22vw,17rem)] leading-[0.9] text-transparent"
        style={{ scale, backgroundImage: `linear-gradient(180deg, #ffffff 10%, ${stat.tint} 95%)` }}
      >
        {stat.value}
      </motion.p>
      <p className="mt-8 max-w-2xl text-[clamp(1.15rem,2.4vw,1.6rem)] leading-snug text-foreground">{stat.label}</p>
      <p className="mt-4 text-sm text-muted-foreground">{stat.source}</p>
    </motion.div>
  );
}

export function StatStory({ stats }: { stats: StoryStat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const bar = useTransform(scrollYProgress, (p) => `${Math.round(p * 100)}%`);

  const list = (
    <ul className={reduce ? "mx-auto grid max-w-5xl gap-16 px-4 py-24 text-center" : "sr-only"}>
      {stats.map((s) => (
        <li key={s.value}>
          <p className="text-sm uppercase tracking-[0.22em] text-mist">{s.lead}</p>
          <p className="font-serif text-8xl text-dawn">{s.value}</p>
          <p className="mx-auto mt-4 max-w-2xl text-xl">{s.label}</p>
          {reduce ? (
            <a href={s.href} className="mt-2 inline-block text-sm text-lake underline underline-offset-4">
              Source: {s.source}
            </a>
          ) : (
            <p>Source: {s.source}</p>
          )}
        </li>
      ))}
    </ul>
  );

  if (reduce) return list;

  return (
    <div ref={ref} className="relative" style={{ height: `${stats.length * 85 + 40}vh` }}>
      {list}
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_45%,#16304a_0%,#0b1622_70%)]" />
        {stats.map((s, i) => (
          <Layer key={s.value} stat={s} index={i} count={stats.length} progress={scrollYProgress} />
        ))}
        <div className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-4 px-4">
          <div aria-hidden className="h-[3px] w-40 overflow-hidden rounded-full bg-white/10">
            <motion.div className="h-full bg-gradient-to-r from-lake to-dawn" style={{ width: bar }} />
          </div>
          <p className="max-w-3xl text-center text-xs text-muted-foreground">
            Sources:{" "}
            {stats.map((s, i) => (
              <span key={s.href}>
                <a href={s.href} className="underline underline-offset-4 hover:text-lake">
                  {s.source}
                </a>
                {i < stats.length - 1 ? " · " : ""}
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}
