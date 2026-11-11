"use client";

import { useEffect, useState } from "react";
import GenerativeMountainScene from "@/components/ui/mountain-scene";
import { LogoMark } from "./LogoMark";

const SEEN_KEY = "dw-loader-seen";
type Phase = "show" | "fade" | "gone";

/*
 * Full-screen loader shown once per browser session while the site first
 * starts: the 21st.dev mountain scene in lake teal, then a slow fade.
 * An inline script in the layout hides it before paint on later loads, and
 * with "reduce motion" it shows a still, brief version.
 */
export function SiteLoader() {
  const [phase, setPhase] = useState<Phase>("show");
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // tell the hero it can start painting
    const done = () => {
      window.__dwLoaderDone = true;
      window.dispatchEvent(new Event("dw:loader-done"));
    };
    if (document.documentElement.classList.contains("dw-loader-seen")) {
      setPhase("gone");
      done();
      return;
    }
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setAnimate(!reduce);
    // The page is already rendered on the server, so the loader only needs to
    // cover hydration: a short, fixed moment rather than waiting on every image.
    const minTime = reduce ? 400 : 1800;
    const timers = [
      window.setTimeout(() => {
        setPhase("fade");
        done();
      }, minTime),
      window.setTimeout(() => setPhase("gone"), minTime + 800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      data-site-loader=""
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-[200] overflow-hidden bg-[#0b1622] transition-opacity duration-700 ease-out ${
        phase === "fade" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {animate && <GenerativeMountainScene color="#8fd3c8" />}
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,#0b1622_0%,rgba(11,22,34,0.55)_45%,rgba(11,22,34,0.15)_70%,#0b1622_100%)]" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-5 px-6 text-center">
        <LogoMark className="h-14 w-14" />
        <p className="font-serif text-3xl text-foreground sm:text-4xl">
          Digital Wellness <span className="text-lake">Hub</span>
        </p>
        <p className="text-sm uppercase tracking-[0.24em] text-mist">Take a slow breath</p>
        <span aria-hidden className="mt-2 h-[2px] w-40 overflow-hidden rounded-full bg-white/10">
          <span className="block h-full w-full origin-left animate-[dw-load_1.8s_ease-in-out_forwards] bg-gradient-to-r from-lake to-dawn" />
        </span>
        <span className="sr-only">Loading Digital Wellness Hub</span>
      </div>
    </div>
  );
}
