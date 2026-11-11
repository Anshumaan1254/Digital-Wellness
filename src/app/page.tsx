import Link from "next/link";
import { ArrowRight, BedDouble, Compass, Puzzle, ShieldCheck, Timer } from "lucide-react";
import BlurText from "@/components/reactbits/BlurText";
import BackgroundPaths from "@/components/kokonutui/background-paths";
import { HeroScene } from "@/components/three/HeroScene";
import { CalmCard } from "@/components/site/CalmCard";
import { Reveal } from "@/components/site/Reveal";
import { Stat } from "@/components/site/Stat";
import { Section } from "@/components/site/PageHeader";
import { YouTubeFacade } from "@/components/media/YouTubeFacade";
import { CATEGORIES, RESOURCES } from "@/data/resources";
import { GUIDES, VIDEOS } from "@/data/content";
import { SITE } from "@/data/site";

const CATEGORY_ICON = {
  "phone-bedtime": BedDouble,
  focus: Timer,
  browser: Puzzle,
  privacy: ShieldCheck,
} as const;

export default function Home() {
  return (
    <>
      <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-16">
        <HeroScene />
        {/* soft scrim so the copy keeps its contrast over the lighter ridges */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-[5] bg-[linear-gradient(90deg,rgba(8,16,30,0.78)_0%,rgba(8,16,30,0.5)_38%,rgba(8,16,30,0)_68%)] max-sm:bg-[linear-gradient(180deg,rgba(8,16,30,0.55)_0%,rgba(8,16,30,0.75)_60%,rgba(8,16,30,0.3)_100%)]"
        />
        <div className="mx-auto w-full max-w-7xl px-4 pb-48 sm:px-6">
          <div className="max-w-2xl">
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-dawn">A calm guide to better tech habits</p>
            <h1 className="font-serif text-[2.6rem] leading-[1.05] text-white sm:text-6xl md:text-7xl">
              <BlurText
                tag="span"
                text="Find the tools that give your attention back."
                delay={90}
                animateBy="words"
                direction="bottom"
                trigger="load"
                className="drop-shadow-[0_2px_18px_rgba(6,12,24,0.6)]"
              />
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#dbe5ee] drop-shadow-[0_1px_8px_rgba(6,12,24,0.8)]">
              Compare {RESOURCES.length} checked tools for screen time, focus, sleep and privacy — with honest prices, the
              devices they run on, and step-by-step setup guides written for students.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/find"
                className="inline-flex items-center gap-2 rounded-full bg-dawn px-6 py-3 font-medium text-[#1b1410] shadow-lg shadow-black/20 transition hover:bg-[#f6d7b9]"
              >
                <Compass aria-hidden className="h-4 w-4" />
                Find a tool for me
              </Link>
              <Link
                href="/resources"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3 font-medium text-white backdrop-blur-sm transition hover:bg-white/10"
              >
                Compare all {RESOURCES.length} tools
                <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
            </div>
            <p className="mt-6 text-sm text-[#c6d3de]">Prices and platforms checked against official pages on {SITE.checkedLabel}.</p>
          </div>
        </div>
      </section>

      <Section
        id="why"
        title="What the research says students need"
        intro={
          <>
            We could not run our own large survey, so we started from published studies of teenagers and university
            students. Four needs came up again and again. <Link className="inline-link" href="/research">Read all ten sources</Link>.
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal>
            <Stat
              value={45}
              suffix="%"
              label="of US teens say they spend too much time on social media — up from 36% in 2022."
              source="Pew Research Center, 2025"
              href="https://www.pewresearch.org/internet/2025/04/22/teens-social-media-and-mental-health/"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <Stat
              value={237}
              label="notifications a day was the median for 11–17-year-olds tracked in one study; a quarter arrived during school."
              source="Common Sense Media, 2023"
              href="https://www.commonsensemedia.org/sites/default/files/research/report/2023-cs-smartphone-research-report_final-for-web.pdf"
            />
          </Reveal>
          <Reveal delay={0.2}>
            <Stat
              value={20}
              suffix=" min"
              label="is how long it can take students to refocus on learning after being distracted."
              source="UNESCO GEM Report, 2023"
              href="https://www.unesco.org/en/articles/smartphones-school-only-when-they-clearly-support-learning"
            />
          </Reveal>
          <Reveal delay={0.3}>
            <Stat
              value={90}
              suffix="%"
              label="of 67 studies linked screen time with shorter or later sleep in school-aged children and teens."
              source="Hale & Guan, Sleep Medicine Reviews, 2015"
              href="https://doi.org/10.1016/j.smrv.2014.07.007"
            />
          </Reveal>
        </div>
      </Section>

      <Section
        id="categories"
        title="Start with what you need"
        intro="Every tool is grouped by the problem it solves, then compared on the same criteria: purpose, devices, cost, privacy, accessibility and limitations."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {CATEGORIES.map((c, i) => {
            const Icon = CATEGORY_ICON[c.id];
            const tools = RESOURCES.filter((r) => r.category === c.id);
            return (
              <Reveal key={c.id} delay={i * 0.08}>
                <CalmCard className="h-full">
                  <div className="flex h-full flex-col">
                    <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-lake/15 text-lake">
                      <Icon aria-hidden className="h-5 w-5" />
                    </span>
                    <h3 className="font-serif text-2xl">{c.name}</h3>
                    <p className="mt-2 text-muted-foreground">{c.description}</p>
                    <p className="mt-4 text-sm text-mist">{tools.map((t) => t.shortName).join(" · ")}</p>
                    <Link
                      href={`/resources?category=${c.id}`}
                      className="relative z-[2] mt-6 inline-flex items-center gap-1.5 self-start text-sm font-medium text-lake hover:text-dawn"
                    >
                      Compare {c.short.toLowerCase()} <ArrowRight aria-hidden className="h-4 w-4" />
                    </Link>
                  </div>
                </CalmCard>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <section aria-labelledby="finder-cta-title" className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <BackgroundPaths
          className="min-h-[380px] rounded-[2.5rem] border border-border bg-[#0d1d2b] text-[#8fd3c8]"
          count={42}
          speed={0.35}
          spread={0.5}
          angle={-6}
        >
          <div className="relative z-10 flex max-w-xl flex-col items-center gap-5 px-6 py-16 text-center">
            <h2 id="finder-cta-title" className="font-serif text-3xl text-foreground sm:text-4xl">
              Not sure where to start?
            </h2>
            <p className="text-lg text-muted-foreground">
              Answer five quick questions about your devices, goals and budget. You will get a short list with the reasons
              each tool fits — and what to watch out for.
            </p>
            <Link
              href="/find"
              className="inline-flex items-center gap-2 rounded-full bg-lake px-6 py-3 font-medium text-[#08202a] transition hover:bg-[#a9e2d9]"
            >
              Take the 1-minute tool finder <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
          </div>
        </BackgroundPaths>
      </section>

      <Section
        id="guides"
        title="Set it up in minutes"
        intro="Three short, tested walkthroughs with screenshots or clearly labelled illustrations — and no personal information in any image."
      >
        <div className="grid gap-5 lg:grid-cols-3">
          {GUIDES.map((g, i) => (
            <Reveal key={g.slug} delay={i * 0.08}>
              <Link
                href={`/guides/${g.slug}`}
                className="group flex h-full flex-col rounded-3xl border border-border bg-card p-6 transition hover:border-lake/40 hover:bg-[#132739]"
              >
                <p className="text-xs uppercase tracking-[0.16em] text-dawn">
                  {g.minutes} minutes · {g.difficulty}
                </p>
                <h3 className="mt-3 font-serif text-2xl leading-snug">{g.title}</h3>
                <p className="mt-3 flex-1 text-muted-foreground">{g.summary}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-lake group-hover:text-dawn">
                  Start the {g.minutes}-minute guide <ArrowRight aria-hidden className="h-4 w-4" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        id="watch"
        title="Watch and learn"
        intro={
          <>
            Short, reputable videos. They only load when you press play, using YouTube&apos;s privacy-enhanced mode.{" "}
            <Link className="inline-link" href="/videos">
              See all {VIDEOS.length} videos
            </Link>
            .
          </>
        }
      >
        <div className="grid gap-6 md:grid-cols-2">
          {VIDEOS.slice(0, 2).map((v) => (
            <Reveal key={v.id}>
              <YouTubeFacade id={v.id} title={v.title} channel={v.channel} />
              <p className="mt-3 text-sm text-muted-foreground">{v.whyUseful}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="share">
        <div className="grid items-center gap-8 rounded-[2.5rem] border border-border bg-gradient-to-br from-[#14283a] to-[#0e1c2a] p-8 sm:p-12 md:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl">Tried one of these? Tell us how it went.</h2>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              Leave anonymous feedback, or share a tip, a short video, an animation or an app screenshot with other
              students. We never ask for your name or email.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
            <Link
              href="/community#feedback"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-dawn px-6 py-3 font-medium text-[#1b1410] hover:bg-[#f6d7b9]"
            >
              Give feedback
            </Link>
            <Link
              href="/community#share"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 font-medium hover:bg-white/5"
            >
              Share a video, tip or app screen
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
