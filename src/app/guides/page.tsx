import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { PageHeader, Section } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { GUIDES } from "@/data/content";

export const metadata: Metadata = {
  title: "Setup guides",
  description: "Short, student-written setup guides for blocking distracting sites, a privacy check-up, and a phone wind-down routine.",
};

export default function GuidesPage() {
  return (
    <>
      <PageHeader eyebrow="Setup guides" title="Short guides you can follow in one sitting">
        Written by students for students: concise steps, real screenshots where we could take them safely, and clearly
        labelled illustrations where a screenshot would have shown personal information.
      </PageHeader>
      <Section>
        <ol className="space-y-6">
          {GUIDES.map((g, i) => (
            <li key={g.slug}>
              <Reveal delay={i * 0.06} className="grid gap-6 rounded-[2rem] border border-border bg-card p-7 md:grid-cols-[auto_1fr_auto] md:items-center">
                <span className="font-serif text-6xl leading-none text-lake/60">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl">{g.title}</h2>
                  <p className="mt-2 max-w-2xl text-muted-foreground">{g.summary}</p>
                  <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-mist">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock aria-hidden className="h-4 w-4" /> About {g.minutes} minutes
                    </span>
                    <span>Uses: {g.tool}</span>
                  </p>
                </div>
                <Link
                  href={`/guides/${g.slug}`}
                  className="inline-flex items-center gap-2 self-start rounded-full bg-lake px-5 py-2.5 font-medium text-[#08202a] hover:bg-[#a9e2d9] md:self-center"
                >
                  Start guide<span className="sr-only">: {g.title}</span> <ArrowRight aria-hidden className="h-4 w-4" />
                </Link>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
