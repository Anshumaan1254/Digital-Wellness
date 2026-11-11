import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/site/PageHeader";
import { ToolFinder } from "@/components/finder/ToolFinder";

export const metadata: Metadata = {
  title: "Find a tool",
  description: "Answer four quick questions and get digital wellness tools that fit your goals, devices and budget — with reasons and cautions.",
};

export default function FindPage() {
  return (
    <>
      <PageHeader eyebrow="Tool finder" title="Find a tool that fits you">
        Four short questions about your goals, devices and budget. You&apos;ll see why each tool matches — and what to
        watch out for — so the choice stays yours.
      </PageHeader>
      <Section>
        <ToolFinder />
      </Section>
    </>
  );
}
