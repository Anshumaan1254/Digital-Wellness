import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Guide } from "@/data/content";

/* Large typographic rows instead of cards: number, title, time — and a line between. */
export function GuideRows({ guides }: { guides: Guide[] }) {
  return (
    <ol className="border-t border-white/10">
      {guides.map((g, i) => (
        <li key={g.slug} className="border-b border-white/10">
          <Link
            href={`/guides/${g.slug}`}
            className="group grid items-baseline gap-x-8 gap-y-2 py-10 transition-colors sm:grid-cols-[5rem_1fr_auto] sm:py-12"
          >
            <span aria-hidden className="font-serif text-4xl text-lake/50 transition-colors group-hover:text-dawn sm:text-5xl">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>
              <span className="block font-serif text-[clamp(1.7rem,3.6vw,3rem)] leading-[1.1] transition-transform duration-500 group-hover:translate-x-2">
                {g.title}
              </span>
              <span className="mt-3 block max-w-2xl text-muted-foreground">{g.summary}</span>
            </span>
            <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-mist">
              {g.minutes} min
              <ArrowUpRight aria-hidden className="h-5 w-5 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-dawn" />
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
