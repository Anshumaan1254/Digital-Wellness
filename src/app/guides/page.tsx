import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/site/PageHeader";
import { GuideRows } from "@/components/story/GuideRows";
import { GUIDES } from "@/data/content";

export const metadata: Metadata = {
  title: "Setup guides",
  description: "Short, student-written setup guides for blocking distracting sites, a privacy check-up, and a phone wind-down routine.",
};

export default function GuidesPage() {
  return (
    <>
      <PageHeader eyebrow="Setup guides" title="Short guides you can follow in one sitting">
        Written by students for students: concise steps, real screenshots where we could take them safely, and clearly
        labelled illustrations where a screenshot would have shown personal information.
      </PageHeader>
      <Section>
        <GuideRows guides={GUIDES} />
      </Section>
    </>
  );
}
