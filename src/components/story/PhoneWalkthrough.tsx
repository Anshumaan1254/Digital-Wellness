"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { PhoneIllustration } from "@/components/guides/PhoneIllustration";

export type WalkStep = { variant: string; alt: string; platform: string; title: string; body: string };

/*
 * Apple-style feature walkthrough: the phone stays pinned while the
 * steps scroll past, and its screen changes to match the step in view.
 */
export function PhoneWalkthrough({ steps }: { steps: WalkStep[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  const reduce = useReducedMotion();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const current = steps[active];

  return (
    <section aria-labelledby="walk-title" className="relative mx-auto max-w-7xl px-4 py-28 sm:px-6">
      <p className="text-sm uppercase tracking-[0.22em] text-dawn">Already on your phone</p>
      <h2 id="walk-title" className="mt-3 max-w-3xl font-serif text-[clamp(2.2rem,5vw,4rem)] leading-[1.05]">
        The calmest tools cost nothing.
      </h2>
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
        Android and iPhone already include timers, bedtime modes and notification schedules. Scroll to see four settings
        worth turning on tonight.
      </p>

      <div className="mt-16 grid gap-10 md:grid-cols-[1fr_minmax(0,1fr)] md:gap-20">
        <div className="hidden md:block">
          <div className="sticky top-[15vh]">
            <div className="relative mx-auto h-[540px] w-[300px]">
              <div aria-hidden className="absolute -inset-16 rounded-full bg-[radial-gradient(circle,rgba(143,211,200,0.18),transparent_65%)] blur-2xl" />
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current.variant}
                  initial={reduce ? false : { opacity: 0, y: 24, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0, y: -24, scale: 0.97 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <PhoneIllustration variant={current.variant} alt={current.alt} bare />
                </motion.div>
              </AnimatePresence>
            </div>
            <p className="mt-6 text-center text-xs text-muted-foreground">Illustration, not a real screenshot</p>
          </div>
        </div>

        <ol className="space-y-[30vh] md:py-[18vh]">
          {steps.map((s, i) => (
            <li
              key={s.variant}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-index={i}
              className={`transition-opacity duration-500 ${active === i || reduce ? "opacity-100" : "md:opacity-35"}`}
            >
              <p className="text-sm font-medium text-lake">
                {String(i + 1).padStart(2, "0")} · {s.platform}
              </p>
              <h3 className="mt-2 font-serif text-[clamp(1.8rem,3.4vw,2.8rem)] leading-[1.1]">{s.title}</h3>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">{s.body}</p>
              <div className="mt-8 md:hidden">
                <PhoneIllustration variant={s.variant} alt={s.alt} />
              </div>
            </li>
          ))}
        </ol>
      </div>

      <Link
        href="/guides/phone-wind-down"
        className="mt-20 inline-flex items-center gap-2 rounded-full bg-lake px-6 py-3 font-medium text-[#08202a] hover:bg-[#a9e2d9]"
      >
        Follow the full phone wind-down guide <ArrowRight aria-hidden className="h-4 w-4" />
      </Link>
    </section>
  );
}
