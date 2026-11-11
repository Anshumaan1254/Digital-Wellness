import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { PageHeader, Section } from "@/components/site/PageHeader";
import { EvidenceNav } from "@/components/site/EvidenceNav";
import linkRecord from "@/data/link-test-record.json";
import a11yJson from "@/data/a11y-results.json";
import { RESOURCES } from "@/data/resources";
import { GUIDES } from "@/data/content";
import { SITE } from "@/data/site";

const a11y = a11yJson as unknown as { generatedAt: string | null; pages: unknown[] };

export const metadata: Metadata = {
  title: "Project evidence",
  description: "Everything submitted for the Digital Wellness Resource Hub project: comparison, sources and dates, guides, link test, accessibility checklist, feedback, revisions, report and presentation.",
};

export default function EvidencePage() {
  const totalSources = RESOURCES.reduce((n, r) => n + r.sources.length, 0);
  const s = linkRecord.summary;
  const axePages = a11y.pages as { violations?: unknown[] }[];
  const items = [
    { href: "/", title: "Website", body: "The live hub you are looking at, built with Next.js, React, Three.js, Node and MongoDB." },
    { href: "/resources?view=table", title: "Resource comparison", body: `${RESOURCES.length} tools in 4 categories, compared on purpose, devices, cost, privacy, accessibility and limitations.` },
    { href: "/evidence/sources", title: "Source links and dates checked", body: `${totalSources} official sources with quotes, all checked on ${SITE.checkedLabel}.` },
    { href: "/guides", title: "Three setup guides", body: GUIDES.map((g) => g.title).join(" · ") },
    {
      href: "/evidence/link-test",
      title: "Link test record",
      body: `${s.external.total} external links tested on ${linkRecord.summary.generatedAt.slice(0, 10)}${s.internal.total ? ` plus ${s.internal.total} internal pages` : ""}.`,
    },
    {
      href: "/evidence/accessibility",
      title: "Accessibility checklist",
      body: a11y.generatedAt ? `Automated axe-core audit of ${axePages.length} pages plus a manual checklist.` : "Manual checklist; automated audit pending.",
    },
    { href: "/evidence/feedback", title: "Anonymised user feedback", body: "A usability test by 5 AI agents playing students (34 problems, 31 fixed), published user-feedback research, and live anonymous responses." },
    { href: "/evidence/revisions", title: "Revisions", body: "What we changed, and why — mostly corrections found by checking official sources." },
    { href: "/evidence/report", title: "Report", body: "How we planned, built, tested and revised the hub, and what we would do next." },
  ];

  return (
    <>
      <PageHeader eyebrow="Project evidence" title="How we built and checked this hub">
        This section collects everything the project brief asks for, in one place, so a teacher or classmate can check
        our work.
      </PageHeader>
      <EvidenceNav current="/evidence" />
      <Section>
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <li key={it.title}>
              <Link href={it.href} className="group flex h-full flex-col rounded-3xl border border-border bg-card p-6 hover:border-lake/40">
                <h2 className="font-serif text-2xl">{it.title}</h2>
                <p className="mt-2 flex-1 text-muted-foreground">{it.body}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-lake group-hover:text-dawn">
                  Open {it.title.toLowerCase()} <ArrowRight aria-hidden className="h-4 w-4" />
                </span>
              </Link>
            </li>
          ))}
          <li>
            <a
              href="/Digital-Wellness-Hub-presentation.pptx"
              download
              className="group flex h-full flex-col rounded-3xl border border-dawn/30 bg-dawn/10 p-6 hover:bg-dawn/15"
            >
              <h2 className="font-serif text-2xl">Presentation</h2>
              <p className="mt-2 flex-1 text-muted-foreground">The slide deck we use to present the project (PowerPoint).</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-dawn">
                <Download aria-hidden className="h-4 w-4" /> Download the presentation (.pptx)
              </span>
            </a>
          </li>
        </ul>
      </Section>
    </>
  );
}
