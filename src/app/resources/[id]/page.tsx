import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { PageHeader, Section } from "@/components/site/PageHeader";
import { CostBadge } from "@/components/site/CostBadge";
import { HelpfulVote } from "@/components/site/HelpfulVote";
import { CATEGORIES, RESOURCES, STRICTNESS_LABEL, getResource } from "@/data/resources";
import { getGuide } from "@/data/content";

export function generateStaticParams() {
  return RESOURCES.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const r = getResource((await params).id);
  return r ? { title: r.shortName, description: r.purpose } : {};
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-border py-4 sm:grid-cols-[180px_1fr] sm:gap-6">
      <dt className="text-sm font-medium text-mist">{label}</dt>
      <dd className="leading-relaxed">{children}</dd>
    </div>
  );
}

export default async function ResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const r = getResource((await params).id);
  if (!r) notFound();
  const category = CATEGORIES.find((c) => c.id === r.category)!;
  const guide = r.guide ? getGuide(r.guide) : null;

  return (
    <>
      <PageHeader eyebrow={category.name} title={r.shortName}>
        <p>{r.purpose}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
          <CostBadge tone={r.costTone} />
          <span>Made by {r.maker}</span>
          <span aria-hidden>·</span>
          <span>Checked {r.dateChecked}</span>
        </div>
      </PageHeader>

      <Section>
        <Link href="/resources" className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft aria-hidden className="h-4 w-4" /> Back to all tools
        </Link>
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <h2 className="font-serif text-2xl">Best for</h2>
            <p className="mt-2 text-lg text-muted-foreground">{r.bestFor}</p>

            <h2 className="mt-10 font-serif text-2xl">Key features</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 marker:text-lake">
              {r.keyFeatures.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>

            <h2 className="mt-10 font-serif text-2xl">Compared on our criteria</h2>
            <dl className="mt-2">
              <Row label="Devices">{r.platforms.join(", ")}</Row>
              <Row label="Cost">{r.costDetail}</Row>
              <Row label="Open source">{r.openSource ? `Yes — ${r.licence}` : "No"}</Row>
              <Row label="Account">{r.accountRequired}</Row>
              <Row label="Privacy">{r.privacyNotes}</Row>
              <Row label="Accessibility">{r.accessibilityNotes}</Row>
              {r.strictness && <Row label="How strict">{STRICTNESS_LABEL[r.strictness]}</Row>}
              <Row label="Limitations">
                <ul className="list-disc space-y-1.5 pl-5 marker:text-dawn">
                  {r.limitations.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              </Row>
            </dl>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6">
              <h2 className="font-serif text-xl">Get it from the official source</h2>
              <ul className="mt-4 space-y-3">
                {r.install.map((l) => (
                  <li key={l.url}>
                    <a href={l.url} className="inline-flex items-start gap-2 text-lake hover:text-dawn" rel="noopener">
                      <ExternalLink aria-hidden className="mt-1 h-4 w-4 shrink-0" />
                      <span className="underline underline-offset-4">{l.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {guide && (
              <Link href={`/guides/${guide.slug}`} className="block rounded-3xl border border-lake/30 bg-lake/10 p-6 hover:bg-lake/15">
                <p className="text-xs uppercase tracking-[0.16em] text-dawn">Step-by-step guide</p>
                <p className="mt-2 font-serif text-xl">{guide.title}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm text-lake">
                  Follow the guide <ArrowRight aria-hidden className="h-4 w-4" />
                </span>
              </Link>
            )}
            <HelpfulVote target={`resource:${r.id}`} label="Was this comparison helpful?" />
          </aside>
        </div>
      </Section>

      <Section
        id="sources"
        title="Where this information comes from"
        intro={`Every claim above was checked on ${r.dateChecked} against these official pages. Quotes are copied word for word.`}
      >
        <ol className="space-y-4">
          {r.sources.map((s, i) => (
            <li key={i} className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm font-medium">{s.what}</p>
              <blockquote className="mt-2 border-l-2 border-lake/50 pl-4 text-sm italic text-muted-foreground">{s.quote}</blockquote>
              <a href={s.url} className="mt-3 inline-block break-all text-sm text-lake underline underline-offset-4 hover:text-dawn" rel="noopener">
                {s.url}
              </a>
            </li>
          ))}
        </ol>
        {r.unverified.length > 0 && (
          <div className="mt-8 rounded-2xl border border-dawn/30 bg-dawn/5 p-5">
            <h3 className="font-sans font-semibold text-dawn">What we could not confirm</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {r.unverified.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
          </div>
        )}
      </Section>
    </>
  );
}
