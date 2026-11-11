import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Section } from "@/components/site/PageHeader";
import { EvidenceNav } from "@/components/site/EvidenceNav";
import { FeedbackSummary } from "@/components/community/CommunityFeed";
import { FEEDBACK_STUDIES } from "@/data/content";

export const metadata: Metadata = { title: "Anonymised user feedback" };

export default function FeedbackEvidencePage() {
  return (
    <>
      <PageHeader eyebrow="Project evidence" title="Anonymised user feedback">
        Two kinds of evidence: published research on what real users say about digital-wellbeing tools, and live,
        anonymous responses from students who test this hub.
      </PageHeader>
      <EvidenceNav current="/evidence/feedback" />

      <Section title="Status of our own user testing">
        <div className="rounded-3xl border border-dawn/30 bg-dawn/5 p-6">
          <p className="leading-relaxed">
            The brief asks us to watch 3–5 students find a resource and follow one guide. That testing{" "}
            <strong>has not been completed yet</strong>, and we have not invented any results. The test is ready:
            participants follow the three tasks on the{" "}
            <Link href="/community#test" className="inline-link">
              Share &amp; feedback page
            </Link>{" "}
            and submit the form, which records whether they found a tool, whether they finished the guide, how long it took
            and where they got stuck — with no names or emails. The live results appear below, and moderators can export
            them as an anonymous CSV (participants are numbered P1, P2…).
          </p>
        </div>
      </Section>

      <Section title="Live results from the hub">
        <FeedbackSummary />
      </Section>

      <Section title="Published user feedback we relied on" intro="Until our own testing is complete, these studies are our main evidence of how students react to these kinds of tools.">
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
