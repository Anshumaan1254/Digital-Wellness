/*
 * Builds the written evidence in /docs from the same data the website uses,
 * so the documents and the site can never disagree.
 *
 *   node scripts/generate-docs.mjs
 */
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const root = process.cwd();
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
const write = (name, text) => {
  fs.writeFileSync(path.join(root, "docs", name), text.trim() + "\n");
  console.log("wrote docs/" + name);
};

const resources = read("src/data/resources.verified.json");
const meta = read("src/data/resource-meta.json");
const research = read("src/data/research.json");
const guides = read("src/data/guides.json");
const revisions = read("src/data/revisions.json");
const links = read("src/data/link-test-record.json");
const a11y = read("src/data/a11y-results.json");
const cell = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
const COST = { free: "Free", "free-core": "Free core · paid extras", limited: "Limited free · key features paid" };
const tools = resources.map((r) => ({ ...r, ...meta.resources[r.id] }));
const catName = Object.fromEntries(meta.categories.map((c) => [c.id, c.name]));

/* ---------- resource comparison ---------- */
write(
  "resource-comparison.md",
  `# Resource comparison

Twelve tools compared on the same criteria. All details checked against official sources on ${tools[0].dateChecked}.
Prices are in US dollars as shown on official US pages and may differ by country or app store.

**Cost labels:** *Free* — everything you need costs nothing · *Free core · paid extras* — essentials free, extras paid ·
*Limited free · key features paid* — important features such as scheduling or locking need payment.

${meta.categories
  .map(
    (c) => `## ${c.name}

| Tool | Purpose | Devices | Cost label | Cost detail | Account | Open source | Privacy | Accessibility | Limitations | Checked |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${tools
  .filter((t) => t.category === c.id)
  .map(
    (t) =>
      `| **${cell(t.shortName)}** | ${cell(t.purpose)} | ${cell(t.platforms.join(", "))} | ${COST[t.costTone]} | ${cell(t.costDetail)} | ${cell(t.accountRequired)} | ${t.openSource ? cell(t.licence) : "No"} | ${cell(t.privacyNotes)} | ${cell(t.accessibilityNotes)} | ${cell(t.limitations.join(" · "))} | ${t.dateChecked} |`
  )
  .join("\n")}`
  )
  .join("\n\n")}
`
);

/* ---------- sources and dates ---------- */
write(
  "sources-and-dates.md",
  `# Source links and dates checked

Every product fact on the hub comes from the maker's own website, store listing, help pages or source repository.
Each source below was opened on the date shown; the quote is copied word for word.

${tools
  .map(
    (t) => `## ${t.shortName}

Checked: ${t.dateChecked} · Official site: ${t.officialUrl}

${t.sources.map((s) => `- **${cell(s.what)}** — ${s.url}\n  > ${cell(s.quote)}`).join("\n")}
${t.unverified.length ? `\n**Could not confirm:**\n${t.unverified.map((u) => `- ${u}`).join("\n")}` : ""}`
  )
  .join("\n\n")}

## Research on student needs (checked ${tools[0].dateChecked})

${research.needs.map((n) => `- ${n.publisher_or_authors} (${n.year}). *${n.title}*. ${n.url}\n  > ${cell(n.quote)}`).join("\n")}

## Research on user feedback about these tools

${research.userFeedbackResearch.map((s) => `- ${s.authors} (${s.year}). *${s.title}*. ${s.venue}. ${s.url}`).join("\n")}

## Videos (IDs confirmed with YouTube oEmbed on ${tools[0].dateChecked})

${research.videos.map((v) => `- ${v.title} — ${v.channel} — https://www.youtube.com/watch?v=${v.id}`).join("\n")}
`
);

/* ---------- setup guides ---------- */
write(
  "setup-guides.md",
  `# Setup guides

Three student-written guides. Screenshots were captured in a fresh, signed-out browser with made-up example data,
so they contain no personal information. Phone pictures are labelled illustrations, not screenshots.
Images are in \`public/guides/\`.

${guides
  .map(
    (g, gi) => `## Guide ${gi + 1}: ${g.title}

*Uses:* ${g.tool} · *Time:* about ${g.minutes} minutes · *Difficulty:* ${g.difficulty}
*You'll need:* ${g.devices}

**Why this matters.** ${g.why}

${g.steps
  .map((s, i) => {
    let out = `### Step ${i + 1}${s.platform ? ` (${s.platform})` : ""}: ${s.title}\n\n${s.body}`;
    if (s.tip) out += `\n\n> **Tip:** ${s.tip}`;
    if (s.image?.src) out += `\n\n![${s.image.alt}](../public${s.image.src})\n\n*Screenshot — ${s.image.caption}*`;
    if (s.image?.illustration) out += `\n\n*Illustration (${s.image.illustration}) — ${s.image.caption}*\n\nDescription: ${s.image.alt}`;
    return out;
  })
  .join("\n\n")}

### If something goes wrong

${g.troubleshooting.map((t) => `- **${t.q}** ${t.a}`).join("\n")}

*${g.screenshotNote}*

**Official help used:** ${g.sources.map((s) => `[${s.label}](${s.url})`).join(" · ")}`
  )
  .join("\n\n---\n\n")}
`
);

/* ---------- link test record ---------- */
const L = links.summary;
const label = { pass: "Pass", "pass-in-browser": "Pass (browser)", "doi-registered": "DOI confirmed", "blocked-automated": "Blocked to scripts", fail: "FAIL" };
write(
  "link-test-record.md",
  `# Link test record

Generated by \`scripts/check-links.mjs\` on ${L.generatedAt.replace("T", " ").slice(0, 16)} UTC.

| | Count |
| --- | --- |
| External links tested | ${L.external.total} |
| Passed directly | ${L.external.pass} |
| Passed when opened in a real browser | ${L.external.passInBrowser ?? 0} |
| Publisher blocked scripts, DOI confirmed by the DOI registry | ${L.external.doiRegistered ?? 0} |
| Blocked to scripts — needs a manual click | ${L.external.blocked} |
| Broken | ${L.external.fail} |
| Internal pages crawled / loaded | ${L.internal.total} / ${L.internal.pass} |

## External links

| Result | HTTP | Link | Used in |
| --- | --- | --- | --- |
${links.external
  .map((r) => `| ${label[r.result] ?? r.result} | ${r.status || r.error || ""}${r.browserStatus ? ` → ${r.browserStatus}` : ""} | ${r.url} | ${cell(r.usedIn.join("; "))} |`)
  .join("\n")}

## Internal pages

${links.internal.map((p) => `- ${p.result === "pass" ? "Pass" : "FAIL"} — \`${p.url}\` (HTTP ${p.status})`).join("\n")}

## Manual checks still needed

${links.external.filter((r) => r.result === "blocked-automated").map((r) => `- [ ] Open ${r.url} in a browser and confirm it loads`).join("\n") || "- None"}
`
);

/* ---------- accessibility ---------- */
const pages = a11y.pages ?? [];
const okPages = pages.filter((p) => !p.error);
write(
  "accessibility-checklist.md",
  `# Accessibility checklist

Target: WCAG 2.2 level AA. Automated checks by \`scripts/a11y-audit.mjs\` (${a11y.tool}) on ${String(a11y.generatedAt).replace("T", " ").slice(0, 16)} UTC.

## Checklist

| Check | How | Result |
| --- | --- | --- |
| Page language set | axe \`html-has-lang\` | ${okPages.every((p) => !p.violations.some((v) => v.id.startsWith("html-"))) ? "Pass" : "Fail"} |
| Skip link is the first Tab stop | script presses Tab on every page | ${okPages.every((p) => p.skipLinkFirst) ? "Pass" : "Fail"} |
| Keyboard focus clearly visible | 3px outline on \`:focus-visible\`, checked by script | ${okPages.every((p) => p.focusVisible) ? "Pass" : "Fail"} |
| Readable navigation, headings in order | axe heading and landmark rules | ${okPages.every((p) => !p.violations.some((v) => /heading|landmark|region/.test(v.id))) ? "Pass" : "Fail"} |
| Meaningful link text (no "click here") | axe \`link-name\` + vague-text script | ${okPages.every((p) => !p.vagueLinks.length && !p.violations.some((v) => v.id === "link-name")) ? "Pass" : "Fail"} |
| Text contrast at least 4.5:1 | contrast table below + axe \`color-contrast\` | ${a11y.contrast.every((c) => c.aaNormal) && okPages.every((p) => !p.violations.some((v) => v.id === "color-contrast")) ? "Pass" : "Fail"} |
| Images described; decoration hidden | written alt text on every screenshot; axe \`image-alt\` | ${okPages.every((p) => !p.imagesMissingAlt && !p.violations.some((v) => v.id.includes("alt"))) ? "Pass" : "Fail"} |
| Illustrations labelled as illustrations | caption and tag on every phone drawing | Built in |
| Form fields labelled; errors announced | \`<label>\` on every field, \`role="alert"\` errors | ${okPages.every((p) => !p.violations.some((v) => /label|name/.test(v.id))) ? "Pass" : "Fail"} |
| No sideways scrolling on a 375px phone | each page opened at 375px | ${okPages.every((p) => !p.horizontalScrollAt375) ? "Pass" : "Fail"} |
| Respects "reduce motion" | 3D scene holds still; scroll stories become plain layouts | Built in (audit runs with reduced motion on) |
| Animated home page accessible while scrolling | axe at 5 scroll positions with motion on | ${(a11y.motionChecks ?? []).length && a11y.motionChecks.every((m) => !m.violations.length) ? "Pass" : "Fail"} |
| Videos never autoplay | click-to-load, youtube-nocookie.com, titled players | Built in |
| Zoom not blocked | axe \`meta-viewport\` | ${okPages.every((p) => !p.violations.some((v) => v.id.startsWith("meta-viewport"))) ? "Pass" : "Fail"} |
| Tables have captions and header cells | \`<caption>\`, \`<th scope>\` | Built in |
| Screen-reader walkthrough (NVDA / VoiceOver) | needs a person | **To do** |
| Readable at 200% zoom | needs a person | **To do** |

## Colour contrast

| Text | Background | Ratio | AA (4.5:1) |
| --- | --- | --- | --- |
${a11y.contrast.map((c) => `| ${c.text} | ${c.background} | ${c.ratio}:1 | ${c.aaNormal ? "Pass" : "Fail"} |`).join("\n")}

## Automated results by page

| Page | axe violations | Skip link | Focus visible | Sideways scroll at 375px |
| --- | --- | --- | --- | --- |
${pages
  .map((p) =>
    p.error
      ? `| \`${p.page}\` | could not test | | | |`
      : `| \`${p.page}\` | ${p.violations.length ? p.violations.map((v) => `${v.id} (${v.nodes})`).join(", ") : "0"} | ${p.skipLinkFirst ? "Yes" : "No"} | ${p.focusVisible ? "Yes" : "No"} | ${p.horizontalScrollAt375 ? "Yes" : "No"} |`
  )
  .join("\n")}
`
);

/* ---------- user feedback ---------- */
write(
  "user-feedback.md",
  `# Anonymised user feedback

## Our own user testing — status: not yet completed

The brief asks for three to five students to find a suitable resource and follow one guide. **This has not been done
yet, and no results have been invented.** The test is built into the hub:

1. **Task 1 — find a tool.** Use the Tool finder or the Compare page to pick one tool that suits you.
2. **Task 2 — follow one guide.** Follow any of the three setup guides on your own device.
3. **Tell us what happened.** On the Share & feedback page choose "I tested the hub" and record whether you found a
   tool, whether you finished the guide, how long it took, and where you got stuck.

No names, emails or IP addresses are collected; anything that looks like contact details is removed before saving.
Results appear on Evidence › User feedback. A moderator can export them from \`/admin\` as an anonymous CSV where
participants are numbered P1, P2… — attach that CSV here once testing is done.

### Record template

| Participant | Found a tool? | Guide finished? | Minutes | Where they got stuck | What we changed |
| --- | --- | --- | --- | --- | --- |
| P1 | | | | | |
| P2 | | | | | |
| P3 | | | | | |

## Published user feedback we relied on

${research.userFeedbackResearch
  .map(
    (s) => `### ${s.title} (${s.year})

${s.authors} — ${s.venue}. ${s.url}
*Method:* ${s.method}

${s.themes.map((t) => `- **${t.theme}:** ${t.detail} > "${t.quoteOrFigure}"`).join("\n")}`
  )
  .join("\n\n")}
`
);

/* ---------- revisions ---------- */
let gitLog = "";
try {
  gitLog = execSync('git log --reverse --format="- %ad — %s" --date=short', { encoding: "utf8" });
} catch {}
write(
  "revisions.md",
  `# Revisions

## What we changed, and why

${revisions.map((r) => `### ${r.date === "pending" ? "Pending" : r.date} — ${r.title}\n\n**Why:** ${r.trigger}\n\n**What changed:** ${r.change}`).join("\n\n")}

## Commit history

${gitLog.trim()}
`
);
