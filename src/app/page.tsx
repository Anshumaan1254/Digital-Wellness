import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import BlurText from "@/components/reactbits/BlurText";
import ScrollReveal from "@/components/reactbits/ScrollReveal";
import ScrollExpand from "@/components/reactbits/ScrollExpand";
import BackgroundPaths from "@/components/kokonutui/background-paths";
import { InkHero } from "@/components/story/InkHero";
import { HeroScene } from "@/components/three/HeroScene";
import { HeroParallax } from "@/components/story/HeroParallax";
import { StatStory } from "@/components/story/StatStory";
import { CategorySweep } from "@/components/story/CategorySweep";
import { PhoneWalkthrough } from "@/components/story/PhoneWalkthrough";
import { GuideRows } from "@/components/story/GuideRows";
import { CATEGORIES, RESOURCES } from "@/data/resources";
import { GUIDES, VIDEOS } from "@/data/content";
import { SITE } from "@/data/site";

const STATS = [
  {
    value: "45%",
    lead: "Too much time",
    label: "of US teens say they spend too much time on social media — up from 36% in 2022.",
    source: "Pew Research Center, 2025",
    href: "https://www.pewresearch.org/internet/2025/04/22/teens-social-media-and-mental-health/",
    tint: "#f1c9a5",
  },
  {
    value: "237",
    lead: "Constant interruptions",
    label: "notifications a day was the median for 11–17-year-olds tracked in one study. A quarter arrived during school.",
    source: "Common Sense Media, 2023",
    href: "https://www.commonsensemedia.org/sites/default/files/research/report/2023-cs-smartphone-research-report_final-for-web.pdf",
    tint: "#8fd3c8",
  },
  {
    value: "20 min",
    lead: "The cost of a distraction",
    label: "is how long it can take a student to refocus on learning after being distracted.",
    source: "UNESCO GEM Report, 2023",
    href: "https://www.unesco.org/en/articles/smartphones-school-only-when-they-clearly-support-learning",
    tint: "#c3bdf0",
  },
  {
    value: "90%",
    lead: "Lost sleep",
    label: "of 67 studies linked screen time with shorter or later sleep in school-aged children and teens.",
    source: "Hale & Guan, Sleep Medicine Reviews, 2015",
    href: "https://doi.org/10.1016/j.smrv.2014.07.007",
    tint: "#9fd0a6",
  },
];

const WALK = [
  {
    variant: "android-app-timer",
    platform: "Android",
    title: "Give your most-used app a daily budget.",
    body: "Settings › Digital Wellbeing › App timers. When time runs out, the app closes and its icon dims until midnight.",
    alt: "Illustration of Android's App timers screen with a 30-minute timer on a video app.",
  },
  {
    variant: "android-bedtime",
    platform: "Android",
    title: "Let bedtime turn the colour off.",
    body: "Bedtime mode can switch your screen to grayscale and keep it dark on a schedule, so late scrolling feels less tempting.",
    alt: "Illustration of Android's Bedtime mode with a 22:30 to 07:00 schedule and Grayscale on.",
  },
  {
    variant: "iphone-allowance",
    platform: "iPhone",
    title: "Set an allowance for social media.",
    body: "Settings › Screen Time › Time Allowances (App Limits on iOS 26 and earlier). Add a passcode if you want it to stick.",
    alt: "Illustration of iPhone Time Allowances with Social Media set to 45 minutes a day.",
  },
  {
    variant: "iphone-sleep",
    platform: "iPhone",
    title: "Wind down before you sleep.",
    body: "A sleep schedule in the Health app starts Sleep Focus up to three hours before bed, holding back everything except the people you choose.",
    alt: "Illustration of iPhone Sleep settings with a 45-minute wind down and only family allowed through.",
  },
];

export default function Home() {
  return (
    <>
      <HeroParallax scene={<InkHero />}>
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
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#dbe5ee]">
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
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-[#0b1622]/55 px-6 py-3 font-medium text-white transition hover:bg-[#0b1622]/80"
              >
                Compare all {RESOURCES.length} tools
                <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
            </div>
            <p className="mt-6 text-sm text-[#c6d3de]">Prices and platforms checked against official pages on {SITE.checkedLabel}.</p>
          </div>
        </div>
      </HeroParallax>

      <section aria-label="Why this hub exists" className="mx-auto max-w-5xl px-4 pb-10 pt-32 sm:px-6">
        <ScrollReveal
          mode="scrub"
          splitBy="words"
          effect="fade"
          enableBlur
          baseOpacity={0.55}
          blurStrength={4}
          containerClassName="text-center"
          textClassName="!font-serif !font-normal !text-[clamp(2rem,5.2vw,4.4rem)] !leading-[1.12] text-foreground"
        >
          Most of us don&apos;t need less technology. We need it to be quieter, kinder to our sleep, and safer with what we share.
        </ScrollReveal>
        <p className="mx-auto mt-10 max-w-2xl text-center text-lg text-muted-foreground">
          We read ten published studies of teenagers and university students before choosing a single tool. Four findings
          shaped everything on this site. <Link className="inline-link" href="/research">Read the research</Link>.
        </p>
      </section>

      <StatStory stats={STATS} />

      <CategorySweep categories={CATEGORIES} resources={RESOURCES} />

      <PhoneWalkthrough steps={WALK} />

      <section aria-labelledby="finder-cta-title" className="py-10">
        <BackgroundPaths className="min-h-[85vh] bg-transparent text-[#8fd3c8]" count={48} speed={0.3} spread={0.55} angle={-6}>
          <div className="relative z-10 flex max-w-3xl flex-col items-center gap-6 px-6 py-24 text-center">
            <p className="text-sm uppercase tracking-[0.22em] text-dawn">Tool finder</p>
            <h2 id="finder-cta-title" className="font-serif text-[clamp(2.4rem,6vw,5rem)] leading-[1.02] text-foreground">
              Not sure where to start?
            </h2>
            <p className="max-w-xl text-lg text-muted-foreground">
              Four quick questions about your goals, devices and budget. Every match comes with its reasons — and what to
              watch out for.
            </p>
            <Link
              href="/find"
              className="inline-flex items-center gap-2 rounded-full bg-lake px-7 py-3.5 font-medium text-[#08202a] transition hover:bg-[#a9e2d9]"
            >
              Take the 1-minute tool finder <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
          </div>
        </BackgroundPaths>
      </section>

      <section aria-labelledby="watch-title">
        <h2 id="watch-title" className="sr-only">
          Watch and learn
        </h2>
        <ScrollExpand
          src="/media/lake-still.jpg"
          alt=""
          title="Watch, then try one thing."
          scrollHint="Keep scrolling"
          useWindowScroll
          startWidth={46}
          startHeight={52}
          startRadius={32}
          scrollDistance={1}
          holdDistance={0.3}
          overlayScrim={0.55}
        >
          {/* decorative overlay; the same information is repeated in plain text just below */}
          <div aria-hidden="true" className="max-w-2xl text-white">
            <p className="text-sm uppercase tracking-[0.22em] text-dawn">Videos</p>
            <p className="mt-3 font-serif text-[clamp(2rem,4.5vw,3.6rem)] leading-[1.05]">{VIDEOS.length} short talks and how-tos, chosen for students.</p>
            <p className="mt-4 text-lg text-[#dbe5ee]">
              From Adam Alter&apos;s TED talk on why screens make us less happy to Apple&apos;s own guide to Focus. Nothing
              loads from YouTube until you press play.
            </p>
            <Link
              href="/videos"
              tabIndex={-1}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-[#0b1622] hover:bg-[#e9eff4]"
            >
              Watch the videos <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
          </div>
        </ScrollExpand>
        <p className="mx-auto max-w-3xl px-4 pt-12 text-center text-lg text-muted-foreground sm:px-6">
          {VIDEOS.length} short talks and how-tos, from TED, Apple Support, Google, CISA and Common Sense Media.{" "}
          <Link href="/videos" className="inline-link">
            Watch the videos
          </Link>
          .
        </p>
      </section>

      <section aria-labelledby="guides-title" className="mx-auto max-w-7xl px-4 py-32 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-dawn">Setup guides</p>
            <h2 id="guides-title" className="mt-3 font-serif text-[clamp(2.2rem,5vw,4rem)] leading-[1.05]">
              Set it up in one sitting.
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            Short and step-by-step, checked against official help pages — with real screenshots, or clearly labelled illustrations where a screenshot would
            have shown personal information.
          </p>
        </div>
        <div className="mt-14">
          <GuideRows guides={GUIDES} />
        </div>
      </section>

      {/* Closing scene: the Three.js mountain lake at night */}
      <section aria-labelledby="share-title" className="relative isolate min-h-[92svh] overflow-hidden">
        <HeroScene />
        {/* same soft scrim as the hero, so the copy never sits on the moon */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-[5] bg-[linear-gradient(90deg,rgba(8,16,30,0.8)_0%,rgba(8,16,30,0.5)_40%,rgba(8,16,30,0)_70%)] max-sm:bg-[linear-gradient(180deg,rgba(8,16,30,0.6)_0%,rgba(8,16,30,0.75)_55%,rgba(8,16,30,0.2)_100%)]"
        />
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="flex max-w-2xl flex-col items-start pb-[40svh] pt-28">
            <h2 id="share-title" className="font-serif text-[clamp(2.4rem,5.5vw,4.6rem)] leading-[1.04] text-foreground">
              Tried one? Tell the next student how it went.
            </h2>
            <p className="mt-6 max-w-xl text-lg text-[#d6e1ea]">
              Leave anonymous feedback, or share a tip, a short video, an animation or an app screenshot. We never ask for
              your name or email.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/community#feedback"
                className="inline-flex items-center gap-2 rounded-full bg-dawn px-7 py-3.5 font-medium text-[#1b1410] hover:bg-[#f6d7b9]"
              >
                Give feedback
              </Link>
              <Link
                href="/community#share"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-[#0b1622]/60 px-7 py-3.5 font-medium text-foreground hover:bg-[#0b1622]/85"
              >
                Share a video, tip or app screen
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
