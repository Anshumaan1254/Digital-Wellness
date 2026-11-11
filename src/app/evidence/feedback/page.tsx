import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Section } from "@/components/site/PageHeader";
import { EvidenceNav } from "@/components/site/EvidenceNav";
import { FeedbackSummary } from "@/components/community/CommunityFeed";
import { FEEDBACK_STUDIES } from "@/data/content";
import { SimulatedTest } from "@/components/evidence/SimulatedTest";

export const metadata: Metadata = { title: "Anonymised user feedback" };

export default function FeedbackEvidencePage() {
  return (
    <>
      <PageHeader eyebrow="Project evidence" title="Anonymised user feedback">
        Three kinds of evidence: a simulated usability test run by five AI test agents playing students, published research
        on what real users say about digital-wellbeing tools, and live anonymous responses from anyone who tests the hub.
      </PageHeader>
      <EvidenceNav current="/evidence/feedback" />

      <Section title="Usability test: 5 simulated students">
        <SimulatedTest />
      </Section>

      <Section title="Testing with real classmates">
        <div className="rounded-3xl border border-dawn/30 bg-dawn/5 p-6">
          <p className="leading-relaxed">
            The test above was run by AI agents, not people. The same two tasks are ready for real students on the{" "}
            <Link href="/community#test" className="inline-link">
              Share &amp; feedback page
            </Link>
            : the form records whether they found a tool, whether they finished the guide, how long it took and where they
            got stuck — with no names or emails. Their answers appear below as they arrive, and moderators can export them as
            an anonymous CSV.
          </p>
        </div>
      </Section>

      <Section title="Live results from real visitors">
        <FeedbackSummary />
      </Section>

      <Section title="Published user feedback we relied on" intro="These studies of real users' reviews and experiences shaped our cautions and the tool finder.">
        <div className="overflow-x-auto rounded-3xl border border-border" role="region" aria-label="Published user feedback table" tabIndex={0}>
          <table className="w-full min-w-[760px] text-left text-sm">
            <caption className="sr-only">Themes from published studies of user feedback on digital wellbeing tools</caption>
            <thead className="bg-[#13273a] text-xs uppercase tracking-wider text-mist">
              <tr>
                <th scope="col" className="px-4 py-3">Study</th>
                <th scope="col" className="px-4 py-3">Participants / data</th>
                <th scope="col" className="px-4 py-3">What users said</th>
              </tr>
            </thead>
            <tbody>
              {FEEDBACK_STUDIES.map((s) => (
                <tr key={s.id} className="border-t border-border align-top">
                  <th scope="row" className="px-4 py-3 font-normal">
                    <a href={s.url} rel="noopener" className="text-lake underline underline-offset-4 hover:text-dawn">
                      {s.title}
                    </a>
                    <p className="text-muted-foreground">
                      {s.authors.split(",")[0]} et al., {s.year}
                    </p>
                  </th>
                  <td className="px-4 py-3 text-muted-foreground">{s.method}</td>
                  <td className="px-4 py-3">
                    <ul className="list-disc space-y-1 pl-4">
                      {s.themes.map((t) => (
                        <li key={t.theme}>
                          <strong className="font-medium">{t.theme}:</strong> {t.detail}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}
