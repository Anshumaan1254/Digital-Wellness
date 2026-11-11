import type { ReactNode } from "react";
import BlurText from "@/components/reactbits/BlurText";
import { MountainBackdrop } from "./MountainBackdrop";

export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden pb-20 pt-32 sm:pt-36">
      <MountainBackdrop className="absolute inset-x-0 bottom-0 -z-10 h-[260px] w-full sm:h-[320px]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {eyebrow && <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-dawn">{eyebrow}</p>}
        <h1 className="max-w-3xl font-serif text-4xl leading-[1.08] sm:text-5xl md:text-6xl">
          <BlurText tag="span" text={title} delay={70} animateBy="words" direction="bottom" trigger="load" />
        </h1>
        {children && <div className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{children}</div>}
      </div>
    </section>
  );
}

export function Section({
  id,
  title,
  intro,
  children,
  className = "",
}: {
  id?: string;
  title?: string;
  intro?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={id && title ? `${id}-title` : undefined} className={`mx-auto max-w-7xl px-4 py-14 sm:px-6 ${className}`}>
      {title && (
        <h2 id={id ? `${id}-title` : undefined} className="font-serif text-3xl sm:text-4xl">
          {title}
        </h2>
      )}
      {intro && <div className="mt-3 max-w-2xl text-muted-foreground">{intro}</div>}
      <div className={title || intro ? "mt-8" : ""}>{children}</div>
    </section>
  );
}
