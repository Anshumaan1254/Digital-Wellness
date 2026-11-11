import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageHeader, Section } from "@/components/site/PageHeader";
import { FeedbackForm } from "@/components/community/FeedbackForm";
import { SubmissionForm } from "@/components/community/SubmissionForm";
import { FeedbackSummary, SubmissionGallery } from "@/components/community/CommunityFeed";

export const metadata: Metadata = {
  title: "Share & feedback",
  description: "Give anonymous feedback on the hub, take part in a short usability test, or share your own videos, animations, app screens and tips.",
};

export default function CommunityPage() {
  return (
    <>
      <PageHeader eyebrow="Share & feedback" title="Help us make this hub better">
        Your answers are anonymous: we never ask for your name or email, and anything that looks like contact details is
        removed before it is saved.
      </PageHeader>

      <Section id="test" title="Want to help test the hub?" intro="It takes about ten minutes. Afterwards, fill in the form below and choose “I tested the hub”.">
        <ol className="grid gap-4 md:grid-cols-3">
          {[
            ["Find a tool", <>Use the <Link href="/find" className="inline-link">tool finder</Link> or the <Link href="/resources" className="inline-link">comparison</Link> to pick one tool that suits you.</>],
            ["Follow one guide", <>Choose any of the <Link href="/guides" className="inline-link">three setup guides</Link> and try the steps on your own device.</>],
            ["Tell us what happened", "Note where you got stuck, how long it took, and what you would change."],
          ].map(([title, body], i) => (
            <li key={i} className="rounded-3xl border border-border bg-card p-6">
              <p className="font-serif text-4xl text-lake/60">{i + 1}</p>
              <p className="mt-2 font-medium">{title}</p>
              <p className="mt-1 text-muted-foreground">{body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="feedback" title="Anonymous feedback">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <Suspense fallback={<p className="text-muted-foreground">Loading form…</p>}>
            <FeedbackForm />
          </Suspense>
          <div>
            <h3 className="mb-4 font-serif text-2xl">What people have said so far</h3>
            <FeedbackSummary />
            <p className="mt-4 text-sm text-muted-foreground">
              Written comments are shown once a moderator has checked them. Numbers update straight away.
            </p>
          </div>
        </div>
      </Section>

      <Section
        id="share"
        title="Share your video, animation, app screen or tip"
        intro="Made something that helped you or a friend? Share it with other students. Every submission is checked for personal information before it is published."
      >
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <SubmissionForm />
          <div className="space-y-4 text-muted-foreground">
            <h3 className="font-serif text-2xl text-foreground">Before you upload a screenshot</h3>
            <ul className="list-disc space-y-2 pl-5">
              <li>Crop out the status bar, notifications, contact names and profile pictures.</li>
              <li>Turn on Do Not Disturb before you take it, so no messages pop up.</li>
              <li>Use example data, like the sites in our guides, instead of your real history.</li>
              <li>We automatically remove hidden location data from photos and screenshots before they are uploaded.</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section id="gallery" title="Shared by students">
        <SubmissionGallery />
      </Section>
    </>
  );
}
