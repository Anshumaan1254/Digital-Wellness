import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Lightbulb } from "lucide-react";
import { PageHeader, Section } from "@/components/site/PageHeader";
import { PhoneIllustration } from "@/components/guides/PhoneIllustration";
import { HelpfulVote } from "@/components/site/HelpfulVote";
import { GUIDES, getGuide } from "@/data/content";
import { getResource } from "@/data/resources";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const g = getGuide((await params).slug);
  return g ? { title: g.title, description: g.summary } : {};
}

const SIZES: Record<string, [number, number]> = {
  "/guides/leechblock-firefox-listing.png": [1920, 1290],
  "/guides/leechblock-what-to-block.png": [1854, 734],
  "/guides/leechblock-when-to-block.png": [1854, 692],
  "/guides/leechblock-save.png": [630, 92],
  "/guides/bitwarden-generator.png": [1920, 1290],
  "/guides/privacy-badger-listing.png": [1920, 1290],
};

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const g = getGuide((await params).slug);
  if (!g) notFound();
  const tools = g.resources.map(getResource).filter(Boolean);
  let lastPlatform: string | undefined;

  return (
    <>
      <PageHeader eyebrow={`Setup guide · about ${g.minutes} minutes`} title={g.title}>
        {g.summary}
      </PageHeader>

      <Section>
        <Link href="/guides" className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft aria-hidden className="h-4 w-4" /> All guides
        </Link>

        <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="rounded-3xl border border-border bg-card p-6">
              <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-dawn">Why this matters</h2>
              <p className="mt-2 leading-relaxed">{g.why}</p>
              <p className="mt-4 text-sm text-muted-foreground">
                <strong className="text-foreground">You&apos;ll need:</strong> {g.devices}
              </p>
            </div>

            <ol className="mt-10 space-y-12">
              {g.steps.map((s, i) => {
                const heading = s.platform && s.platform !== lastPlatform ? s.platform : null;
                lastPlatform = s.platform;
                return (
                  <li key={s.title}>
                    {heading && (
                      <h2 className="mb-6 border-b border-border pb-3 font-serif text-3xl text-lake">On {heading}</h2>
                    )}
                    <div className="flex gap-4">
                      <span
                        aria-hidden
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lake/15 font-semibold text-lake"
                      >
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-serif text-2xl leading-snug">
                          <span className="sr-only">Step {i + 1}: </span>
                          {s.title}
                        </h3>
                        <p className="mt-3 max-w-[68ch] leading-relaxed text-[#d6e1ea]">{s.body}</p>
                        {s.tip && (
                          <p className="mt-4 flex max-w-[68ch] gap-2 rounded-2xl bg-dawn/10 p-4 text-sm">
                            <Lightbulb aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-dawn" />
                            <span>{s.tip}</span>
                          </p>
                        )}
                        {s.image && (
                          <figure className="mt-5">
                            {s.image.src ? (
                              <Image
                                src={s.image.src}
                                alt={s.image.alt}
                                width={SIZES[s.image.src]?.[0] ?? 1600}
                                height={SIZES[s.image.src]?.[1] ?? 1000}
                                sizes="(min-width: 1024px) 760px, 100vw"
                                className={`rounded-2xl border border-border bg-white ${
                                  (SIZES[s.image.src]?.[0] ?? 1600) < 800 ? "w-auto max-w-full" : "w-full"
                                }`}
                              />
                            ) : (
                              <PhoneIllustration variant={s.image.illustration!} alt={s.image.alt} />
                            )}
                            <figcaption className="mt-2 text-sm text-muted-foreground">
                              <span className="mr-2 rounded-full border border-border px-2 py-0.5 text-xs uppercase tracking-wider">
                                {s.image.kind === "illustration" ? "Illustration" : "Screenshot"}
                              </span>
                              {s.image.caption}
                            </figcaption>
                          </figure>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>

            <h2 className="mt-16 font-serif text-3xl">If something goes wrong</h2>
            <dl className="mt-5 space-y-4">
              {g.troubleshooting.map((t) => (
                <div key={t.q} className="rounded-2xl border border-border bg-card p-5">
                  <dt className="font-medium">{t.q}</dt>
                  <dd className="mt-1 text-muted-foreground">{t.a}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-10 max-w-[68ch] text-sm text-muted-foreground">{g.screenshotNote}</p>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-border bg-card p-6">
              <h2 className="font-serif text-xl">Tools in this guide</h2>
              <ul className="mt-4 space-y-4">
                {tools.map((t) => (
                  <li key={t!.id}>
                    <Link href={`/resources/${t!.id}`} className="font-medium text-lake hover:text-dawn">
                      {t!.shortName}
                    </Link>
                    <p className="text-sm text-muted-foreground">{t!.costShort}</p>
                    <ul className="mt-2 space-y-1">
                      {t!.install.map((l) => (
                        <li key={l.url}>
                          <a href={l.url} rel="noopener" className="inline-flex items-start gap-1.5 text-sm text-mist underline underline-offset-4 hover:text-foreground">
                            <ExternalLink aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                            {l.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6">
              <h2 className="font-serif text-xl">Official help we used</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {g.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} rel="noopener" className="text-lake underline underline-offset-4 hover:text-dawn">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <HelpfulVote target={`guide:${g.slug}`} label="Did this guide work for you?" />
            <Link
              href={`/community?guide=${g.slug}#feedback`}
              className="block rounded-3xl border border-dawn/30 bg-dawn/10 p-5 text-sm hover:bg-dawn/15"
            >
              <span className="font-medium text-dawn">Tested this guide?</span> Tell us where you got stuck — anonymously.
            </Link>
          </aside>
        </div>
      </Section>
    </>
  );
}
