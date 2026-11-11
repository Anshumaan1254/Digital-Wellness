"use client";

import { useEffect, useState } from "react";
import InkRidges from "@/components/ui/ink-ridges";

declare global {
  interface Window {
    __dwLoaderDone?: boolean;
  }
}

/*
 * The home page hero: 21st.dev's Ink Ridges, a sumi-e mountain range painted
 * in the site's moonlit ink on the page's own dark background. It waits for
 * the intro loader to lift so the brush-in is actually seen, and on narrow
 * screens the moon moves up and shrinks so it never sits behind the headline.
 */
export function InkHero() {
  const [narrow, setNarrow] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (window.__dwLoaderDone || document.documentElement.classList.contains("dw-loader-seen")) {
      setReady(true);
      return;
    }
    const go = () => setReady(true);
    window.addEventListener("dw:loader-done", go, { once: true });
    const fallback = window.setTimeout(go, 3500);
    return () => {
      window.removeEventListener("dw:loader-done", go);
      window.clearTimeout(fallback);
    };
  }, []);

  if (!ready) return <div aria-hidden className="h-full w-full bg-background" />;

  return (
    <InkRidges
      className="h-full w-full bg-background"
      inkColor="#a3b0cf"
      seed={7}
      layers={5}
      horizon={0.5}
      mist={0.65}
      drift={0.04}
      parallax={0.025}
      paintIn={3000}
      sunPosition={narrow ? [0.86, 0.86] : [0.78, 0.8]}
      sunSize={narrow ? 0.03 : 0.06}
      glow={0.35}
      clouds={0.3}
      birds={4}
      birdsEvery={16}
      grain={0.22}
      scrollDepth={0.35}
    />
  );
}
