"use client";

import CountUp from "@/components/reactbits/CountUp";

export function Stat({
  value,
  prefix,
  suffix,
  display,
  label,
  source,
  href,
}: {
  value?: number;
  prefix?: string;
  suffix?: string;
  display?: string;
  label: string;
  source: string;
  href: string;
}) {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-border bg-card/70 p-6 backdrop-blur-sm">
      <p className="font-serif text-5xl text-dawn">
        {display ?? <CountUp to={value!} prefix={prefix} suffix={suffix} duration={2.2} />}
      </p>
      <p className="mt-3 flex-1 text-[15px] leading-relaxed text-foreground">{label}</p>
      <a href={href} className="mt-4 text-xs text-muted-foreground underline underline-offset-4 hover:text-lake">
        Source: {source}
      </a>
    </div>
  );
}
