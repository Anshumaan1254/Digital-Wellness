/*
 * Link test record.
 *
 *   node scripts/check-links.mjs [baseUrl]
 *
 * 1. Collects every external URL the hub links to (official product pages,
 *    install links, research sources, guide sources, videos) and requests it.
 * 2. If a base URL is given (e.g. http://localhost:3000), crawls every page of
 *    the running site and checks each internal link.
 *
 * Links that fail a plain request (many publishers block scripts) are opened
 * again in a real Chromium browser, the way a student would click them.
 *
 * Writes src/data/link-test-record.json, which the Evidence page and
 * docs/link-test-record.md are built from. Nothing is marked as passing
 * unless a request actually succeeded.
 */
import fs from "fs";
import path from "path";
import { chromium } from "playwright";

const root = process.cwd();
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
const resources = read("src/data/resources.verified.json");
const meta = read("src/data/resource-meta.json");
const research = read("src/data/research.json");
const guides = read("src/data/guides.json");
const base = process.argv[2];

const UA = "DigitalWellnessHub-LinkChecker/1.0 (school project; +https://github.com/Anshumaan1254/Digital-Wellness)";

/* url -> set of places it is used */
const external = new Map();
const add = (url, where) => {
  if (!url || !/^https?:\/\//.test(url)) return;
  if (!external.has(url)) external.set(url, new Set());
  external.get(url).add(where);
};

for (const r of resources) {
  add(r.officialUrl, `Tool page: ${r.name} (official site)`);
  for (const s of r.sources) add(s.url, `Tool page: ${r.name} (source)`);
}
for (const [id, m] of Object.entries(meta.resources)) for (const l of m.install) add(l.url, `Install link: ${id}`);
for (const n of research.needs) add(n.url, `Student needs: ${n.title}`);
for (const s of research.userFeedbackResearch) add(s.url, `User feedback research: ${s.title}`);
for (const v of research.videos) add(`https://www.youtube.com/watch?v=${v.id}`, `Videos: ${v.title}`);
for (const g of guides) for (const s of g.sources) add(s.url, `Guide: ${g.title}`);

async function check(url) {
  const started = Date.now();
  for (const method of ["HEAD", "GET"]) {
    try {
      const res = await fetch(url, {
        method,
        redirect: "follow",
        headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8" },
        signal: AbortSignal.timeout(25000),
      });
      // Some servers reject HEAD; retry those with GET.
      if (method === "HEAD" && [400, 403, 404, 405, 429, 500, 501, 503].includes(res.status)) continue;
      return { status: res.status, finalUrl: res.url, ms: Date.now() - started, method };
    } catch (err) {
      if (method === "GET") return { status: 0, error: String(err.cause?.code ?? err.name ?? err), ms: Date.now() - started, method };
    }
  }
}

function verdict(r) {
  if (r.status >= 200 && r.status < 400) return "pass";
  if ([401, 403, 429].includes(r.status) || r.status === 202) return "blocked-automated";
  return "fail";
}

async function pool(items, size, fn) {
  const out = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx]);
      }
    })
  );
  return out;
}

const entries = [...external.entries()];
console.log(`Checking ${entries.length} external links…`);
const externalResults = await pool(entries, 6, async ([url, where]) => {
  const r = await check(url);
  const row = { url, usedIn: [...where], ...r, result: verdict(r), checkedAt: new Date().toISOString() };
  console.log(row.result.padEnd(18), r.status, url);
  return row;
});

/* ---------- second opinion in a real browser ---------- */
const retry = externalResults.filter((r) => r.result !== "pass");
if (retry.length) {
  console.log(`Re-checking ${retry.length} links in Chromium…`);
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  for (const r of retry) {
    const page = await ctx.newPage();
    try {
      const res = await page.goto(r.url, { waitUntil: "domcontentloaded", timeout: 45000 });
      await page.waitForTimeout(1500);
      r.browserStatus = res?.status() ?? 0;
      r.browserTitle = (await page.title()).slice(0, 120);
      const challenge = /just a moment|verify you are human|attention required|access denied/i.test(r.browserTitle);
      if (r.browserStatus >= 200 && r.browserStatus < 400 && !challenge) r.result = "pass-in-browser";
    } catch (err) {
      r.browserError = String(err).slice(0, 120);
    }
    console.log(r.result.padEnd(18), r.browserStatus ?? "-", r.url);
    await page.close();
  }
  await browser.close();
}

/* ---------- internal crawl ---------- */
let internalResults = [];
if (base) {
  const seen = new Set(["/"]);
  const queue = ["/"];
  const pages = [];
  while (queue.length) {
    const p = queue.shift();
    const res = await fetch(base + p, { signal: AbortSignal.timeout(30000) }).catch((e) => ({ status: 0, text: async () => "", e }));
    const html = res.status === 200 ? await res.text() : "";
    pages.push({ url: p, status: res.status, result: res.status === 200 ? "pass" : "fail", checkedAt: new Date().toISOString() });
    for (const m of html.matchAll(/href="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
      const href = m[1];
      if (href.startsWith("/_next") || href.startsWith("/api") || /\.(png|jpg|svg|ico|pptx|pdf|css|js)$/.test(href)) continue;
      if (!seen.has(href)) {
        seen.add(href);
        queue.push(href);
      }
    }
  }
  internalResults = pages;
  console.log(`Crawled ${pages.length} internal pages: ${pages.filter((p) => p.result === "pass").length} OK`);
}

const summary = {
  generatedAt: new Date().toISOString(),
  external: {
    total: externalResults.length,
    pass: externalResults.filter((r) => r.result === "pass").length,
    passInBrowser: externalResults.filter((r) => r.result === "pass-in-browser").length,
    blocked: externalResults.filter((r) => r.result === "blocked-automated").length,
    fail: externalResults.filter((r) => r.result === "fail").length,
  },
  internal: { total: internalResults.length, pass: internalResults.filter((r) => r.result === "pass").length },
};
fs.writeFileSync(
  path.join(root, "src/data/link-test-record.json"),
  JSON.stringify({ summary, external: externalResults, internal: internalResults }, null, 2)
);
console.log(JSON.stringify(summary, null, 2));
