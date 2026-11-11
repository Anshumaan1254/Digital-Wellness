import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PageHeader, Section } from "@/components/site/PageHeader";
import { EvidenceNav } from "@/components/site/EvidenceNav";

export const metadata: Metadata = { title: "Project report" };

export default function ReportPage() {
  // Read at build time; the same file is submitted as docs/report.md.
  const md = fs.readFileSync(path.join(process.cwd(), "docs", "report.md"), "utf8").replace(/^# .*\n/, "");
  return (
    <>
      <PageHeader eyebrow="Project evidence" title="Project report" />
      <EvidenceNav current="/evidence/report" />
      <Section>
        <article className="prose-calm report">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{md}</ReactMarkdown>
        </article>
      </Section>
    </>
  );
}
