/*
 * Screenshots of the hub itself (for the presentation and visual checks).
 *
 *   node scripts/capture-site-screens.mjs http://localhost:3000 <outDir> [pageFilter]
 */
import fs from "fs";
import path from "path";
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3000";
const out = process.argv[3] ?? "screens";
const filter = process.argv[4];
fs.mkdirSync(out, { recursive: true });

const SHOTS = [
  { name: "home-hero", path: "/", wait: 6000 },
  { name: "home-full", path: "/", full: true, wait: 4000 },
  { name: "find", path: "/find" },
  { name: "find-results", path: "/find", finder: true },
  { name: "resources", path: "/resources", full: true },
  { name: "resources-table", path: "/resources?view=table" },
  { name: "resource-detail", path: "/resources/leechblock-ng", full: true },
  { name: "guide-leechblock", path: "/guides/block-distracting-sites", full: true },
  { name: "guide-phone", path: "/guides/phone-wind-down", full: true },
  { name: "videos", path: "/videos" },
  { name: "research", path: "/research", full: true },
  { name: "community", path: "/community", full: true },
  { name: "evidence", path: "/evidence" },
  { name: "evidence-accessibility", path: "/evidence/accessibility", full: true },
  { name: "evidence-link-test", path: "/evidence/link-test" },
  { name: "evidence-revisions", path: "/evidence/revisions", full: true },
  { name: "mobile-home", path: "/", mobile: true, wait: 5000 },
  { name: "mobile-guide", path: "/guides/privacy-checkup", mobile: true },
];

const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
for (const s of SHOTS) {
  if (filter && !s.name.includes(filter)) continue;
  const ctx = await browser.newContext(
    s.mobile ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }
  );
  const page = await ctx.newPage();
  await page.goto(base + s.path, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(s.wait ?? 2500);
  if (s.finder) {
    await page.getByText("Focus while studying", { exact: true }).click();
    await page.getByText("Block distracting sites", { exact: true }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.waitForTimeout(700);
    await page.getByText("Windows laptop", { exact: true }).click();
    await page.getByText("Android phone", { exact: true }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.waitForTimeout(700);
    await page.getByText("Nothing — free only", { exact: true }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.waitForTimeout(700);
    await page.getByRole("button", { name: "Show my matches" }).click();
    await page.waitForTimeout(1500);
  }
  if (s.full) {
    // let scroll-triggered reveals run before the full-page capture
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1500);
  }
  await page.screenshot({ path: path.join(out, `${s.name}.png`), fullPage: Boolean(s.full) });
  console.log("captured", s.name);
  await ctx.close();
}
await browser.close();
