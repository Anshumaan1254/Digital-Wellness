import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Section } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { Marquee } from "@/components/ui/marquee";
import { FEEDBACK_STUDIES, NEEDS } from "@/data/content";

export const metadata: Metadata = {
  title: "Student needs",
  description: "The published research we used to identify what students need from digital wellness tools, and what real users say about these tools.",
};

const AUDIENCE = [
  { title: "Who this hub is for", body: "Secondary-school and university students, roughly 13 to 24, who use a phone and a laptop for study and want calmer, safer habits without spending money." },
  { title: "How we identified needs", body: "We had no budget for a large survey, so we reviewed ten published sources — national surveys, a phone-tracking study and peer-reviewed experiments — and grouped what they found into needs." },
  { title: "How we turned needs into the hub", body: "Each need maps to a category of tools, a filter in the comparison, a question in the tool finder, or one of the three setup guides." },
];

export default function ResearchPage() {
  return (
    <>
      <PageHeader eyebrow="Audience & needs" title="What students actually need from their tech">
        Before choosing any tools, we looked at what researchers have learned about students, screens, sleep, focus and
        privacy. Every number below links to its source.
      </PageHeader>

      <div aria-hidden className="border-y border-border bg-[#0d1d2b] py-3">
        <Marquee pauseOnHover className="[--duration:60s]">
          {NEEDS.map((n) => (
            <span key={n.id} className="mx-6 whitespace-nowrap text-sm text-mist">
              <span className="text-dawn">◆</span> {n.need}
            </span>
          ))}
        </Marquee>
      </div>

      <Section>
        <div className="grid gap-12 md:grid-cols-3 md:gap-10">
          {AUDIENCE.map((a, i) => (
            <div key={a.title} className="border-t border-white/15 pt-6">
              <p className="font-serif text-5xl text-lake/50">{i + 1}</p>
              <h2 className="mt-4 font-serif text-2xl">{a.title}</h2>
              <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{a.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="needs" title="Ten sources, ten needs" intro="Paraphrased findings, with a short word-for-word quote from each source so you can check our reading.">
        <ol className="border-t border-white/10">
          {NEEDS.map((n, i) => (
            <li key={n.id} className="border-b border-white/10">
              <Reveal className="grid gap-x-12 gap-y-5 py-14 lg:grid-cols-[6rem_1.2fr_1fr]">
                <p aria-hidden className="font-serif text-5xl text-dawn/70">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-mist">
                    {n.type === "peer-reviewed" ? "Peer-reviewed study" : n.type === "survey" ? "Survey" : "Report"} · {n.year} ·{" "}
                    {n.publisher_or_authors.split(" (")[0].split(",")[0]}
                  </p>
                  <h3 className="mt-3 font-serif text-[clamp(1.5rem,2.6vw,2.2rem)] leading-[1.15]">{n.keyFinding}</h3>
                  <p className="mt-4 text-sm text-muted-foreground">
                    <span className="text-foreground">Who was studied:</span> {n.population}
                  </p>
                </div>
                <div className="lg:pt-8">
                  <blockquote className="border-l-2 border-lake/50 pl-5 text-lg italic leading-relaxed text-[#cfdbe5]">&ldquo;{n.quote}&rdquo;</blockquote>
                  <p className="mt-6 text-sm">
                    <span className="font-medium text-lake">What students need: </span>
                    {n.need}
                  </p>
                  <a href={n.url} rel="noopener" className="mt-4 inline-block text-sm text-lake underline underline-offset-4 hover:text-dawn">
                    Source: {n.title}
                  </a>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="user-feedback-research"
        title="What real users say about these tools"
        intro={
          <>
            Alongside our own simulated usability test (see the{" "}
            <Link href="/evidence/feedback" className="inline-link">
              feedback record
            </Link>
            ), we used studies that analysed real users&apos; reviews and experiences of digital-wellbeing apps. Their themes
            shaped our cautions and the tool finder.
          </>
        }
      >
        <div className="space-y-6">
          {FEEDBACK_STUDIES.map((s) => (
            <article key={s.id} className="rounded-3xl border border-border bg-card p-6 sm:p-8">
              <h3 className="font-serif text-2xl leading-snug">{s.title}</h3>
              <p className="mt-1 text-sm text-mist">
                {s.authors} · {s.venue} · {s.year}
              </p>
              <p className="mt-3 text-muted-foreground">
                <span className="text-foreground">Method:</span> {s.method}
              </p>
              <ul className="mt-5 grid gap-3 md:grid-cols-2">
                {s.themes.map((t) => (
                  <li key={t.theme} className="rounded-2xl bg-[#0f1e2d] p-4">
                    <p className="font-medium text-dawn">{t.theme}</p>
                    <p className="mt-1 text-sm">{t.detail}</p>
                    <p className="mt-2 text-sm italic text-muted-foreground">&ldquo;{t.quoteOrFigure}&rdquo;</p>
                  </li>
                ))}
              </ul>
              <a href={s.url} rel="noopener" className="mt-4 inline-block text-sm text-lake underline underline-offset-4 hover:text-dawn">
                Read the paper: {s.title}
              </a>
            </article>
          ))}
        </div>
      </Section>

      <Section id="design" title="How this changed our hub">
        <ul className="grid gap-4 md:grid-cols-2">
          {[
            ["Users find limits \"not restrictive enough\" but strict locks frustrating", "The tool finder asks how firm you want a tool to be, and every result lists a caution."],
            ["Tracking alone rarely reduces use", "We pair every built-in dashboard with an action: timers, schedules or blocks."],
            ["Notifications cost attention even when ignored", "The phone guide sets up scheduled summaries, Focus mode and Bedtime mode."],
            ["Teens worry about personal data but share it anyway", "A privacy category, a privacy column in every comparison, and a 15-minute check-up guide."],
          ].map(([finding, change]) => (
            <li key={finding} className="rounded-3xl border border-border bg-card p-6">
              <p className="text-sm text-muted-foreground">Finding</p>
              <p className="font-medium">{finding}</p>
              <p className="mt-3 text-sm text-muted-foreground">What we did</p>
              <p>{change}</p>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
