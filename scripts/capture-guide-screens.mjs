/*
 * Captures the screenshots used in the setup guides.
 *
 *   node scripts/capture-guide-screens.mjs <path-to-LeechBlockNG-folder>
 *
 * - Uses a fresh, signed-out browser profile, so no personal accounts,
 *   names, emails or history can appear in any image.
 * - The LeechBlock NG options page is opened as a static page with
 *   JavaScript turned off; the example values typed into it are made up.
 * - Web pages are captured exactly as served on the day.
 */
import { chromium } from "playwright";
import path from "path";
import { pathToFileURL } from "url";
import fs from "fs";

const OUT = path.join(process.cwd(), "public", "guides");
fs.mkdirSync(OUT, { recursive: true });
const leechblockDir = process.argv[2];
const only = process.argv[3] ? process.argv[3].split(",") : null;

const browser = await chromium.launch();
const log = [];

async function shot(name, fn, opts = {}) {
  if (only && !only.includes(name)) return;
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 860 },
    deviceScaleFactor: 1.5,
    locale: "en-US",
    colorScheme: "light",
    javaScriptEnabled: opts.js ?? true,
    userAgent: opts.ua,
  });
  const page = await ctx.newPage();
  try {
    await fn(page);
    log.push({ name, ok: true, at: new Date().toISOString() });
    console.log("captured", name);
  } catch (err) {
    log.push({ name, ok: false, error: String(err).slice(0, 200) });
    console.log("FAILED", name, String(err).slice(0, 200));
  } finally {
    await ctx.close();
  }
}

/* ---------- Guide: LeechBlock NG ---------- */
if (leechblockDir) {
  const optionsUrl = pathToFileURL(path.join(leechblockDir, "options.html")).href;
  await shot(
    "leechblock-what-to-block.png",
    async (page) => {
      await page.goto(optionsUrl);
      await page.addStyleTag({ content: "#form{display:block!important} body{background:#fff;padding:12px}" });
      await page.fill("#setName1", "Study hours");
      await page.fill("#sites1", "youtube.com\ninstagram.com\ntiktok.com\nreddit.com");
      await page.locator("fieldset").nth(0).screenshot({ path: path.join(OUT, "leechblock-what-to-block.png") });
    },
    { js: false }
  );
  await shot(
    "leechblock-when-to-block.png",
    async (page) => {
      await page.goto(optionsUrl);
      await page.addStyleTag({ content: "#form{display:block!important} body{background:#fff;padding:12px}" });
      await page.fill("#times1", "0900-1230,1330-1700");
      await page.fill("#limitMins1", "10");
      await page.selectOption("#limitPeriod1", "3600");
      for (const d of [1, 2, 3, 4, 5]) await page.check(`#day${d}1`);
      await page.locator("fieldset").nth(1).screenshot({ path: path.join(OUT, "leechblock-when-to-block.png") });
    },
    { js: false }
  );
  await shot(
    "leechblock-save.png",
    async (page) => {
      await page.goto(optionsUrl);
      await page.addStyleTag({ content: "#form{display:block!important} body{background:#fff;padding:12px}" });
      await page.locator("#saveOptions").scrollIntoViewIfNeeded();
      const box = await page.locator("#saveOptions").boundingBox();
      await page.screenshot({
        path: path.join(OUT, "leechblock-save.png"),
        clip: { x: Math.max(0, box.x - 24), y: Math.max(0, box.y - 20), width: 420, height: box.height + 40 },
      });
    },
    { js: false }
  );
}

/* ---------- Store listings and privacy tools ---------- */
const web = [
  ["leechblock-firefox-listing.png", "https://addons.mozilla.org/en-GB/firefox/addon/leechblock-ng/", 900],
  ["privacy-badger-listing.png", "https://addons.mozilla.org/en-GB/firefox/addon/privacy-badger17/", 900],
  ["bitwarden-generator.png", "https://bitwarden.com/password-generator/", 900],
];
for (const [name, url, height] of web) {
  await shot(name, async (page) => {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(3500);
    // dismiss cookie banners if one is shown
    for (const label of ["Accept all", "Accept All", "Accept", "I agree", "Got it", "Reject all"]) {
      const b = page.getByRole("button", { name: label, exact: true });
      if (await b.first().isVisible().catch(() => false)) {
        await b.first().click().catch(() => {});
        await page.waitForTimeout(600);
        break;
      }
    }
    await page.screenshot({ path: path.join(OUT, name), clip: { x: 0, y: 0, width: 1280, height } });
  });
}


await browser.close();
fs.writeFileSync(path.join(OUT, "capture-log.json"), JSON.stringify(log, null, 2));
