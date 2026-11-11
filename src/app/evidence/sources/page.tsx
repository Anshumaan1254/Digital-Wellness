import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Section } from "@/components/site/PageHeader";
import { EvidenceNav } from "@/components/site/EvidenceNav";
import { RESOURCES } from "@/data/resources";
import { FEEDBACK_STUDIES, NEEDS, VIDEOS } from "@/data/content";
import { SITE } from "@/data/site";

export const metadata: Metadata = { title: "Sources and dates checked" };

export default function SourcesPage() {
  return (
    <>
      <PageHeader eyebrow="Project evidence" title="Source links and dates checked">
        Every product fact on this site comes from the maker&apos;s own website, store listing or help pages, checked on{" "}
        {SITE.checkedLabel}. Research sources were read and quoted on the same day.
      </PageHeader>
      <EvidenceNav current="/evidence/sources" />

      <Section id="tools" title="Tool information">
        <div className="overflow-x-auto rounded-3xl border border-border" role="region" aria-label="Tool sources table, scrolls sideways" tabIndex={0}>
          <table className="w-full min-w-[900px] text-left text-sm">
            <caption className="sr-only">Official sources for each tool, what each confirmed, and the date checked</caption>
            <thead className="bg-[#13273a] text-xs uppercase tracking-wider text-mist">
              <tr>
                <th scope="col" className="px-4 py-3">Tool</th>
                <th scope="col" className="px-4 py-3">What the source confirmed</th>
                <th scope="col" className="px-4 py-3">Official source</th>
                <th scope="col" className="px-4 py-3">Checked</th>
              </tr>
            </thead>
            <tbody>
              {RESOURCES.flatMap((r) =>
                r.sources.map((s, i) => (
                  <tr key={r.id + i} className="border-t border-border align-top">
                    {i === 0 && (
                      <th scope="row" rowSpan={r.sources.length} className="bg-card px-4 py-3 font-medium">
                        <Link href={`/resources/${r.id}#sources`} className="text-lake underline-offset-4 hover:underline">
                          {r.shortName}
                        </Link>
                      </th>
                    )}
                    <td className="px-4 py-3 text-muted-foreground">{s.what}</td>
                    <td className="max-w-[380px] break-all px-4 py-3">
                      <a href={s.url} rel="noopener" className="text-lake underline underline-offset-4 hover:text-dawn">
                        {s.url}
                      </a>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">{r.dateChecked}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="research" title="Research on student needs and user feedback">
        <ul className="space-y-3">
          {[...NEEDS.map((n) => ({ t: n.title, by: n.publisher_or_authors, y: n.year, url: n.url })), ...FEEDBACK_STUDIES.map((s) => ({ t: s.title, by: s.authors, y: s.year, url: s.url }))].map((s) => (
            <li key={s.url} className="rounded-2xl border border-border bg-card p-4 text-sm">
              <p className="font-medium">{s.t}</p>
              <p className="text-muted-foreground">
                {s.by} ({s.y}) · checked {SITE.checkedOn}
              </p>
              <a href={s.url} rel="noopener" className="break-all text-lake underline underline-offset-4 hover:text-dawn">
                {s.url}
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="videos" title="Videos">
        <ul className="space-y-2 text-sm">
          {VIDEOS.map((v) => (
            <li key={v.id}>
              <a href={`https://www.youtube.com/watch?v=${v.id}`} rel="noopener" className="text-lake underline underline-offset-4 hover:text-dawn">
                {v.title}
              </a>{" "}
              <span className="text-muted-foreground">— {v.channel}, confirmed with YouTube oEmbed on {SITE.checkedOn}</span>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
