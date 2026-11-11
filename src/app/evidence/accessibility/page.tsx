import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/site/PageHeader";
import { EvidenceNav } from "@/components/site/EvidenceNav";
import a11yJson from "@/data/a11y-results.json";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Accessibility checklist" };

type PageResult = {
  page: string;
  violations?: { id: string; impact: string; help: string; nodes: number }[];
  skipLinkFirst?: boolean;
  focusVisible?: boolean;
  horizontalScrollAt375?: boolean;
  vagueLinks?: string[];
  imagesMissingAlt?: number;
  error?: string;
};

type Contrast = { text: string; background: string; ratio: number; aaNormal: boolean; aaLarge: boolean };
type MotionCheck = { scrollY: number; violations: { id: string; nodes: number }[] };
const a11y = a11yJson as unknown as { generatedAt: string | null; tool: string; pages: PageResult[]; contrast: Contrast[]; motionChecks?: MotionCheck[] };

type Status = "pass" | "design" | "todo" | "fail" | "pending";

const BADGE: Record<Status, { label: string; cls: string }> = {
  pass: { label: "Pass — automated test", cls: "bg-[#173a36] text-[#a6e6da]" },
  design: { label: "Built in — see how", cls: "bg-[#2a2f45] text-[#cfc9f5]" },
  todo: { label: "To do — needs a person", cls: "bg-[#3e2f24] text-[#f6d3b3]" },
  fail: { label: "Needs fixing", cls: "bg-[#4a2326] text-[#f2a7a0]" },
  pending: { label: "Audit not run yet", cls: "bg-white/10 text-muted-foreground" },
};

export default function AccessibilityPage() {
  const pages = a11y.pages as PageResult[];
  const ran = Boolean(a11y.generatedAt) && pages.length > 0;
  const ok = pages.filter((p) => !p.error);
  const noRule = (...ids: string[]) => ok.every((p) => !p.violations?.some((v) => ids.includes(v.id)));
  const auto = (cond: boolean): Status => (!ran ? "pending" : cond ? "pass" : "fail");

  const checklist: { item: string; how: string; status: Status }[] = [
    { item: "Page language is set (lang=\"en\")", how: "axe rule html-has-lang on every page.", status: auto(noRule("html-has-lang", "html-lang-valid")) },
    { item: "\"Skip to main content\" is the first Tab stop", how: "Script presses Tab on each page and reads the focused element.", status: auto(ok.every((p) => p.skipLinkFirst)) },
    { item: "Keyboard focus is clearly visible", how: "3px dawn-coloured outline on :focus-visible; script checks the outline on the next Tab stop.", status: auto(ok.every((p) => p.focusVisible)) },
    { item: "Readable navigation and headings in order", how: "One h1 per page, h2 for sections; axe rules heading-order, page-has-heading-one, landmark rules.", status: auto(noRule("heading-order", "page-has-heading-one", "landmark-one-main", "region")) },
    { item: "Meaningful link text (no \"click here\")", how: "axe link-name, plus a script that flags links whose text is only \"here\", \"more\", \"read more\" etc.", status: auto(noRule("link-name") && ok.every((p) => !p.vagueLinks?.length)) },
    { item: "Text contrast meets WCAG AA (4.5:1)", how: "Contrast ratios of every theme colour pair are listed below; axe color-contrast on every page.", status: auto(noRule("color-contrast") && a11y.contrast.every((c) => c.aaNormal)) },
    { item: "Images have descriptions; decorative ones are hidden", how: "Every screenshot has a written alt text; the 3D scene and backgrounds are aria-hidden. axe image-alt.", status: auto(noRule("image-alt", "svg-img-alt", "role-img-alt") && ok.every((p) => !p.imagesMissingAlt)) },
    { item: "Illustrations are labelled as illustrations", how: "Phone drawings carry an \"Illustration\" tag and caption so they are not mistaken for screenshots.", status: "design" },
    { item: "Form fields have labels; errors are announced", how: "Every input has a <label>; errors use role=\"alert\"; success messages use role=\"status\". axe label rules.", status: auto(noRule("label", "select-name", "aria-input-field-name")) },
    { item: "No sideways scrolling on a 375px phone screen", how: "Script resizes each page to 375px and compares page width with the screen.", status: auto(ok.every((p) => !p.horizontalScrollAt375)) },
    { item: "Respects \"reduce motion\"", how: "With reduced motion on, the 3D lake renders one still frame, scroll stories become plain layouts and CSS animations stop. The page audit runs with reduced motion on.", status: "design" },
    {
      item: "Animated home page stays accessible while scrolling",
      how: "axe-core run on the home page with animations on, at five scroll positions, so faded or moving text is also checked.",
      status: auto(Boolean(a11y.motionChecks?.length) && a11y.motionChecks!.every((m) => m.violations.length === 0)),
    },
    { item: "Videos never autoplay and do not track visitors", how: "Videos load only after pressing play, from youtube-nocookie.com, and each player has a title.", status: "design" },
    { item: "Zoom is not blocked", how: "No maximum-scale or user-scalable=no in the viewport. axe meta-viewport.", status: auto(noRule("meta-viewport", "meta-viewport-large")) },
    { item: "Tables have captions and header cells", how: "Comparison, source and link tables use <caption>, <th scope> and a keyboard-scrollable region.", status: "design" },
    { item: "Tested with a real screen reader (NVDA or VoiceOver)", how: "Needs a person: navigate the home page, finder and one guide using only the screen reader, and note problems.", status: "todo" },
    { item: "Tested at 200% browser zoom", how: "Needs a person: zoom to 200% and check every page can still be read and used.", status: "todo" },
  ];

  return (
    <>
      <PageHeader eyebrow="Project evidence" title="Accessibility checklist">
        Automated checks run with <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm">scripts/a11y-audit.mjs</code>{" "}
        ({a11y.tool || "axe-core"}){ran ? ` on ${a11y.generatedAt!.slice(0, 16).replace("T", " ")} UTC` : ""}. Some checks
        still need a person — those are marked honestly as to-do.
      </PageHeader>
      <EvidenceNav current="/evidence/accessibility" />

      <Section title="Checklist">
        <ul className="space-y-3">
          {checklist.map((c) => (
            <li key={c.item} className="grid gap-3 rounded-2xl border border-border bg-card p-5 md:grid-cols-[1fr_auto] md:items-start">
              <div>
                <p className="font-medium">{c.item}</p>
                <p className="mt-1 text-sm text-muted-foreground">{c.how}</p>
              </div>
              <span className={cn("self-start whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium", BADGE[c.status].cls)}>{BADGE[c.status].label}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Colour contrast of the theme" intro="WCAG AA needs at least 4.5:1 for normal text and 3:1 for large text.">
        <div className="overflow-x-auto rounded-3xl border border-border" role="region" aria-label="Contrast table" tabIndex={0}>
          <table className="w-full min-w-[640px] text-left text-sm">
            <caption className="sr-only">Contrast ratio of each text colour on each background</caption>
            <thead className="bg-[#13273a] text-xs uppercase tracking-wider text-mist">
              <tr>
                <th scope="col" className="px-4 py-3">Text colour</th>
                <th scope="col" className="px-4 py-3">Background</th>
                <th scope="col" className="px-4 py-3">Ratio</th>
                <th scope="col" className="px-4 py-3">AA normal text</th>
              </tr>
            </thead>
            <tbody>
              {a11y.contrast.map((c) => (
                <tr key={c.text + c.background} className="border-t border-border">
                  <th scope="row" className="px-4 py-3 font-normal">{c.text}</th>
                  <td className="px-4 py-3">{c.background}</td>
                  <td className="px-4 py-3">{c.ratio}:1</td>
                  <td className="px-4 py-3">{c.aaNormal ? "Pass" : "Fail"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!ran && <p className="mt-4 text-muted-foreground">Run the audit script to fill in this table.</p>}
      </Section>

      {ran && (
        <Section title="Automated results by page">
          <ul className="grid gap-3 md:grid-cols-2">
            {pages.map((p) => (
              <li key={p.page} className="rounded-2xl border border-border bg-card p-4 text-sm">
                <p className="font-mono text-xs text-mist">{p.page}</p>
                {p.error ? (
                  <p className="mt-1 text-destructive">Could not test: {p.error}</p>
                ) : p.violations!.length === 0 ? (
                  <p className="mt-1 text-[#a6e6da]">No axe violations</p>
                ) : (
                  <ul className="mt-1 list-disc pl-5 text-[#f6d3b3]">
                    {p.violations!.map((v) => (
                      <li key={v.id}>
                        {v.help} ({v.impact}, {v.nodes} element{v.nodes > 1 ? "s" : ""})
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
