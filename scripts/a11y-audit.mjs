/*
 * Accessibility audit.
 *
 *   node scripts/a11y-audit.mjs http://localhost:3000
 *
 * For every page: runs axe-core (WCAG 2.0/2.1/2.2 A and AA rules) and a few
 * checks axe cannot do on its own — skip link is the first Tab stop, focus is
 * visible, no horizontal scrolling when opened on a 375px-wide phone, no vague link text. Also
 * computes WCAG contrast ratios for the theme's colour pairs.
 *
 * Writes src/data/a11y-results.json.
 */
import fs from "fs";
import path from "path";
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";

const base = process.argv[2] ?? "http://localhost:3000";
const PAGES = [
  "/",
  "/find",
  "/resources",
  "/resources?view=table",
  "/resources/leechblock-ng",
  "/guides",
  "/guides/block-distracting-sites",
  "/guides/privacy-checkup",
  "/guides/phone-wind-down",
  "/videos",
  "/research",
  "/community",
  "/evidence",
  "/evidence/sources",
  "/evidence/link-test",
  "/evidence/accessibility",
  "/evidence/feedback",
  "/evidence/revisions",
  "/evidence/report",
];

/* ---------- contrast of theme tokens ---------- */
function lum(hex) {
  const c = hex.replace("#", "").match(/../g).map((h) => parseInt(h, 16) / 255);
  const [r, g, b] = c.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100;
};
const BACKGROUNDS = { "page (#0b1622)": "#0b1622", "card (#112131)": "#112131" };
const TEXTS = {
  "Body text #e9eff4": "#e9eff4",
  "Muted text #a9bccb": "#a9bccb",
  "Lake accent / links #8fd3c8": "#8fd3c8",
  "Dawn accent #f1c9a5": "#f1c9a5",
  "Mist labels #c9d6e2": "#c9d6e2",
};
const contrast = [];
for (const [tn, t] of Object.entries(TEXTS))
  for (const [bn, b] of Object.entries(BACKGROUNDS)) {
    const r = ratio(t, b);
    contrast.push({ text: tn, background: bn, ratio: r, aaNormal: r >= 4.5, aaLarge: r >= 3 });
  }
contrast.push({ text: "Button text #1b1410", background: "dawn button (#f1c9a5)", ratio: ratio("#1b1410", "#f1c9a5"), aaNormal: ratio("#1b1410", "#f1c9a5") >= 4.5, aaLarge: true });
contrast.push({ text: "Button text #08202a", background: "lake button (#8fd3c8)", ratio: ratio("#08202a", "#8fd3c8"), aaNormal: ratio("#08202a", "#8fd3c8") >= 4.5, aaLarge: true });

/* ---------- page checks ---------- */
const browser = await chromium.launch();
const results = [];

for (const p of PAGES) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  const row = { page: p };
  try {
    const res = await page.goto(base + p, { waitUntil: "networkidle", timeout: 60000 });
    row.status = res?.status();
    await page.waitForTimeout(800);

    const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"]).analyze();
    row.violations = axe.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      nodes: v.nodes.length,
      example: v.nodes[0]?.target?.join(" "),
    }));
    row.passes = axe.passes.length;

    await page.keyboard.press("Tab");
    row.firstTabStop = await page.evaluate(() => document.activeElement?.textContent?.trim().slice(0, 40));
    row.skipLinkFirst = /skip to main content/i.test(row.firstTabStop ?? "");
    await page.keyboard.press("Tab");
    row.focusVisible = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return false;
      const s = getComputedStyle(el);
      return s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0;
    });

    row.vagueLinks = await page.$$eval("a", (as) => as.map((a) => (a.getAttribute("aria-label") || a.textContent || "").trim()));
    row.vagueLinks = row.vagueLinks.filter((t) => /^(click here|here|read more|learn more|more|link|this)$/i.test(t));

    row.imagesMissingAlt = await page.$$eval("img", (imgs) => imgs.filter((i) => !i.hasAttribute("alt")).length);

    // load the page fresh at phone width, the way a phone would open it
    const phone = await browser.newContext({ viewport: { width: 375, height: 800 }, isMobile: true, reducedMotion: "reduce" });
    const mp = await phone.newPage();
    await mp.goto(base + p, { waitUntil: "networkidle", timeout: 60000 });
    await mp.waitForTimeout(800);
    row.horizontalScrollAt375 = await mp.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    await phone.close();
  } catch (err) {
    row.error = String(err).slice(0, 200);
  }
  results.push(row);
  console.log(
    p.padEnd(34),
    row.error ? `ERROR ${row.error}` : `violations=${row.violations.length} skip=${row.skipLinkFirst} focus=${row.focusVisible} hscroll375=${row.horizontalScrollAt375} vague=${row.vagueLinks.length}`
  );
  if (row.violations?.length) for (const v of row.violations) console.log("   -", v.impact, v.id, v.nodes, v.example);
  await ctx.close();
}
await browser.close();

const out = {
  generatedAt: new Date().toISOString(),
  tool: "axe-core via @axe-core/playwright, Chromium, reduced motion on",
  pages: results,
  contrast,
};
fs.writeFileSync(path.join(process.cwd(), "src/data/a11y-results.json"), JSON.stringify(out, null, 2));
