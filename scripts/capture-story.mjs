/*
 * Captures the home page at a series of scroll positions so the
 * scroll-driven chapters can be checked (and used in the presentation).
 *
 *   node scripts/capture-story.mjs http://localhost:3000 <outDir> [width] [height]
 */
import fs from "fs";
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3000";
const out = process.argv[3] ?? "story";
const width = Number(process.argv[4] ?? 1440);
const height = Number(process.argv[5] ?? 900);
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width, height } });
page.setDefaultTimeout(90000);
await page.goto(base + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(4000);
const total = await page.evaluate(() => document.documentElement.scrollHeight);

for (let y = 0; y < total - height / 2; y += Math.round(height * 0.75)) {
  // scroll in small steps so scroll-linked animations follow, like a person scrolling
  await page.evaluate(async (target) => {
    const start = window.scrollY;
    for (let i = 1; i <= 12; i++) {
      window.scrollTo(0, start + ((target - start) * i) / 12);
      await new Promise((r) => setTimeout(r, 35));
    }
  }, y);
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${out}/y${String(y).padStart(5, "0")}.png` });
}
console.log(`captured ${Math.ceil(total / (height * 0.75))} frames of ${total}px`);
await browser.close();
