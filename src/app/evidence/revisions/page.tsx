import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { EvidenceNav } from "@/components/site/EvidenceNav";
import { Timeline } from "@/components/ui/timeline";
import revisions from "@/data/revisions.json";

export const metadata: Metadata = { title: "Revisions" };

const TYPE: Record<string, string> = {
  planning: "Planning",
  accuracy: "Accuracy fix",
  screenshots: "Screenshots",
  content: "Content",
  testing: "Testing",
  pending: "Coming next",
};

export default function RevisionsPage() {
  const groups = revisions.reduce<Record<string, typeof revisions>>((acc, r) => {
    const key = r.date === "pending" ? "After testing" : new Date(r.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    (acc[key] ??= []).push(r);
    return acc;
  }, {});

  return (
    <>
      <PageHeader eyebrow="Project evidence" title="What we changed, and why">
        Most of our revisions came from checking official sources and finding that what we remembered was out of date. A
        full technical history is in the project&apos;s Git commits.
      </PageHeader>
      <EvidenceNav current="/evidence/revisions" />
      <Timeline
        data={Object.entries(groups).map(([title, items]) => ({
          title,
          content: (
            <ul className="space-y-5">
              {items.map((r) => (
                <li key={r.title} className="rounded-3xl border border-border bg-card p-6">
                  <p className="text-xs uppercase tracking-[0.16em] text-dawn">{TYPE[r.type] ?? r.type}</p>
                  <h3 className="mt-1 font-serif text-2xl">{r.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    <span className="text-foreground">Why: </span>
                    {r.trigger}
                  </p>
                  <p className="mt-2 text-sm">
                    <span className="text-muted-foreground">What changed: </span>
                    {r.change}
                  </p>
                </li>
              ))}
            </ul>
          ),
        }))}
      />
    </>
  );
}
