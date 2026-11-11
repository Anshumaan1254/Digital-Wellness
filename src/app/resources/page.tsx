import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader, Section } from "@/components/site/PageHeader";
import { ResourceExplorer } from "@/components/resources/ResourceExplorer";
import { COST_LABEL } from "@/data/resources";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Compare tools",
  description: "Side-by-side comparison of 12 digital wellness tools: purpose, devices, honest cost, privacy, accessibility and limitations.",
};

export default function ResourcesPage() {
  return (
    <>
      <PageHeader eyebrow="Compare" title="Twelve tools, compared the same way">
        Each tool is checked against its official website, store listing or help pages. We record the date we checked,
        and we never call something &ldquo;free&rdquo; if the features you need cost money.
      </PageHeader>
      <Section>
        <Suspense fallback={<p className="text-muted-foreground">Loading filters…</p>}>
          <ResourceExplorer />
        </Suspense>
      </Section>
      <Section id="labels" title="How we label cost">
        <ul className="grid gap-4 md:grid-cols-3">
          {Object.values(COST_LABEL).map((c) => (
            <li key={c.label} className="rounded-2xl border border-border bg-card p-5">
              <p className="font-medium">{c.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{c.hint}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl text-sm text-muted-foreground">
          All details were checked on {SITE.checkedLabel}. Prices are in US dollars as shown on official US pages and may
          differ in your country or app store. Nothing here is sponsored and there are no affiliate links.
        </p>
      </Section>
    </>
  );
}
