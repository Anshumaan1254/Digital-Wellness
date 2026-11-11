# Digital Wellness Hub

**Live site:** https://digital-wellness-ivory.vercel.app

A calm, student-made guide to choosing and setting up digital wellness tools — screen-time controls, focus apps,
distraction-blocking browser extensions, notification and bedtime routines, and privacy tools.

Built for **Project 3: Digital Wellness Resource Hub**. Instead of a list of links, the hub helps students make an
informed choice:

- **Tool finder** — four questions (goals, devices, budget, strictness) → matches with reasons and cautions.
- **Comparison** — 12 tools in 4 categories, compared on purpose, devices, cost, privacy, accessibility and
  limitations, with honest cost labels and the date each fact was checked.
- **Three setup guides** — LeechBlock NG, a privacy check-up, and a phone wind-down routine.
- **Videos** — 8 reputable videos, loaded only when you press play (youtube-nocookie).
- **Share & feedback** — anonymous feedback and usability-test form; moderated submissions of videos, animations,
  app screens and tips.
- **Project evidence** — sources and dates, link test record, accessibility checklist, feedback, revisions, report.

## Tech

Next.js 15 (App Router) · React 19 · Three.js via React Three Fiber · Node.js API routes · MongoDB · Tailwind CSS 4 ·
Motion · GSAP. UI components from [React Bits](https://reactbits.dev) and libraries listed on
[21st.dev](https://21st.dev) (Kokonut UI Background Paths, Aceternity Timeline, Magic UI Marquee and Border Beam).

## Run it locally

```bash
npm install
# MongoDB (optional — without it, data goes to .data/store.json)
docker run -d --name dw-mongo -p 27017:27017 -v dw-mongo-data:/data/db mongo:7
cp .env.example .env.local      # then set MONGODB_URI=mongodb://127.0.0.1:27017 and an ADMIN_KEY
npm run dev                      # http://localhost:3000
```

## Deploy to Vercel

1. **Database:** create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas). Under *Database
   Access* add a user; under *Network Access* allow `0.0.0.0/0` (Vercel uses changing IPs); copy the connection
   string (`mongodb+srv://…`).
2. **Import:** on [vercel.com/new](https://vercel.com/new) import this GitHub repository. Framework: Next.js (detected
   automatically). No build settings need changing.
3. **Environment variables** (Project → Settings → Environment Variables):
   - `MONGODB_URI` — the Atlas connection string
   - `MONGODB_DB` — `digital_wellness` (optional)
   - `ADMIN_KEY` — a long random string; enables `/admin` moderation and the feedback CSV export
4. **Deploy.** Check `https://<your-site>/api/health` — it should say `"backend":"mongodb"`.

Without `MONGODB_URI` the site still builds and runs, but feedback is stored in a temporary file that Vercel clears.

## Moderation

Open `/admin`, enter the `ADMIN_KEY`, and approve or reject submissions and feedback comments. Nothing a visitor
uploads or writes is shown publicly until it is approved. "Export feedback CSV" downloads anonymous results
(participants numbered P1, P2…).

## Evidence scripts

Run against a running copy of the site (`npm run build && npm start`):

| Script | Produces |
| --- | --- |
| `node scripts/check-links.mjs http://localhost:3000` | `src/data/link-test-record.json` (shown on Evidence › Link test) |
| `node scripts/a11y-audit.mjs http://localhost:3000` | `src/data/a11y-results.json` (Evidence › Accessibility) |
| `node scripts/generate-docs.mjs` | the Markdown evidence files in `docs/` |
| `node scripts/capture-guide-screens.mjs <LeechBlockNG folder>` | guide screenshots in `public/guides/` |
| `node scripts/capture-site-screens.mjs http://localhost:3000 <dir>` | screenshots of the hub for the presentation |

## Evidence for submission

| Item | File |
| --- | --- |
| Report | `docs/report.md` (also at `/evidence/report`) |
| Resource comparison | `docs/resource-comparison.md` |
| Source links and dates checked | `docs/sources-and-dates.md` |
| Three setup guides | `docs/setup-guides.md` |
| Link test record | `docs/link-test-record.md` |
| Accessibility checklist | `docs/accessibility-checklist.md` |
| Anonymised user feedback | `docs/user-feedback.md` |
| Revisions | `docs/revisions.md` |
| Presentation | `public/Digital-Wellness-Hub-presentation.pptx` |

## Data

- `src/data/resources.verified.json` — product facts with official source URLs, quotes and dates checked
- `src/data/resource-meta.json` — categories, cost labels, install links and finder tags
- `src/data/research.json` — student-needs research, user-feedback studies and videos
- `src/data/guides.json` — the three setup guides

Product details were checked on 11 November 2026. Prices and features change — always confirm on the official page.
