import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Section } from "@/components/site/PageHeader";
import { YouTubeFacade } from "@/components/media/YouTubeFacade";
import { Reveal } from "@/components/site/Reveal";
import { VIDEOS } from "@/data/content";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Videos",
  description: "Short, reputable videos on screen time, focus, notifications, passwords, two-step verification and online privacy.",
};

export default function VideosPage() {
  return (
    <>
      <PageHeader eyebrow="Videos" title="Watch, then try one thing">
        Eight short videos from official and reputable channels. Each one loads only when you press play, through
        YouTube&apos;s privacy-enhanced mode, so nothing is tracked just by visiting this page.
      </PageHeader>
      <Section>
        <ul className="grid gap-10 md:grid-cols-2">
          {VIDEOS.map((v, i) => (
            <li key={v.id}>
              <Reveal delay={(i % 2) * 0.08}>
                <YouTubeFacade id={v.id} title={v.title} channel={v.channel} />
                <p className="mt-3 text-xs uppercase tracking-[0.16em] text-dawn">{v.topic}</p>
                <h2 className="mt-1 font-serif text-xl">{v.title}</h2>
                <p className="mt-1 text-sm text-mist">{v.channel}</p>
                <p className="mt-2 text-muted-foreground">{v.whyUseful}</p>
                <a
                  href={`https://www.youtube.com/watch?v=${v.id}`}
                  rel="noopener"
                  className="mt-2 inline-block text-sm text-lake underline underline-offset-4 hover:text-dawn"
                >
                  Watch &ldquo;{v.title}&rdquo; on YouTube
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
        <p className="mt-14 max-w-3xl text-sm text-muted-foreground">
          Every video ID was confirmed to exist on {SITE.checkedLabel} using YouTube&apos;s public oEmbed service. Made a
          helpful video yourself?{" "}
          <Link href="/community#share" className="inline-link">
            Share it with other students
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
