# Revisions

## What we changed, and why

### 2026-11-11 — Chose the audience and needs from published research

**Why:** No time or budget for our own survey before building.

**What changed:** Reviewed 10 published sources (Pew, Common Sense Media, OECD, UNESCO, Ofcom and four peer-reviewed studies) and turned each finding into a student need. Each need became a tool category, a filter or a finder question.

### 2026-11-11 — Corrected Bitwarden Premium price

**Why:** Our first draft used the widely quoted price of US$10 a year.

**What changed:** Bitwarden's official pricing page shows Premium at US$19.80 a year (US$1.65/month, announced 21 January 2026). We updated the price and kept the label "Free core · paid extras" because unlimited passwords stay free.

### 2026-11-11 — Forest is no longer a paid iPhone app

**Why:** We remembered Forest as a paid download on iOS.

**What changed:** The App Store now lists Forest as "Free · In-App Purchases" and forestapp.cc says Forest Pro is no longer sold. Relabelled as free with ads plus an optional Forest Plus subscription, with US App Store prices marked "Early Bird".

### 2026-11-11 — Freedom and Cold Turkey labelled "Limited free · key features paid"

**Why:** Both have a free version, but the assignment says not to call a tool free when essential features need payment.

**What changed:** Freedom's free plan has no scheduling or Locked Mode and caps sessions at 2 hours; Cold Turkey's scheduled blocks, app blocking and locking need Pro (US$45 one-time). Both now carry the amber "Limited free" label, and the finder hides them for "free only" budgets.

### 2026-11-11 — Updated iPhone steps for iOS 27 names

**Why:** Apple's iOS 27 guide renames Downtime and App Limits.

**What changed:** The phone guide now uses Screen Time Schedules and Time Allowances, with the older names (Downtime, App Limits) given for iOS 26 and earlier so older tutorials still make sense.

### 2026-11-11 — Removed Have I Been Pwned screenshots

**Why:** Our automated screenshot showed a Cloudflare "verify you are human" page instead of the real site.

**What changed:** We deleted the image rather than publish a misleading screenshot, and described the steps in words instead.

### 2026-11-11 — Re-captured the LeechBlock screenshots

**Why:** The first capture failed because the options form is hidden until the extension's own script runs.

**What changed:** Re-captured the real LeechBlock NG 1.8 options page with all of its scripts blocked (so no downloaded code ran) and example settings typed in. No personal browsing data appears in any image.

### 2026-11-11 — Phone guide uses labelled illustrations

**Why:** Real phone screenshots would show notifications, contacts and app lists.

**What changed:** Drew simplified settings screens using the exact menu wording from Google's and Apple's help pages, and labelled every one "Illustration, not a real screenshot".

### 2026-11-11 — Swapped the Apple video

**Why:** We could not find an official Apple Support overview of Screen Time (only one about passcodes).

**What changed:** Used Apple Support's official "How to use Focus on your iPhone" video instead, which matches our notification-control need. Every video ID was confirmed with YouTube's oEmbed service.

### 2026-11-11 — Link checker made honest about blocked sites

**Why:** Many publisher and DOI links refuse automated requests, which looked like broken links.

**What changed:** The link test now re-opens any failing link in a real browser and records "blocked to scripts" separately from genuinely broken links.

### 2026-11-11 — Fixed every automated accessibility issue

**Why:** Our first axe-core audit flagged invalid list markup on two pages, a skipped heading level, step buttons whose spoken names did not match their visible text, one low-contrast label in an illustration, and pages that scrolled sideways on a 375px phone.

**What changed:** Fixed each one and re-ran the audit: all 19 tested pages now report no axe violations, and every page passes our skip-link, focus, link-text and phone-width checks.

### 2026-11-11 — Home page rebuilt as a scroll story

**Why:** Design review: the first home page told everything through rows of rectangular cards, which felt like a list of links rather than a guide.

**What changed:** Rebuilt it in the style of Apple's product pages: a pinned chapter where each research figure takes over the screen, a horizontal sweep through the four kinds of calm, a phone whose screen changes as you scroll through settings, and an expanding lake frame for the videos. The 3D lake now stops drawing when it is off-screen to save battery, and everything falls back to a simple layout with reduced motion.

### 2026-11-11 — Simulated usability test with 5 AI test agents

**Why:** The brief asks for 3–5 students to find a resource and follow a guide. We ran this first with five AI agents, each playing a student persona from our audience research (Android teen, Windows undergraduate, privacy-minded Mac user, keyboard-only Chromebook user at 200% zoom, and an exam-stressed student who wants strict blocking).

**What changed:** All five found a suitable tool and rated the hub 4/5. Between them they reported 49 problems, which we grouped into 34 and fixed 31 — including the tool finder losing keyboard focus and forgetting answers, hidden matches, missing Safari and iPhone steps, and mouse-only instructions. Three were left unchanged, with reasons, on the feedback evidence page.

### Pending — Testing with real classmates

**Why:** The simulated test used AI agents, not people.

**What changed:** The same two tasks and the anonymous form are ready for real students; anything they find will be added here.

## Commit history

- 2026-11-11 — Initial commit from Create Next App
- 2026-11-11 — Set up calm mountain-lake theme, storage layer and API routes
- 2026-11-11 — Add verified resource data, student-needs research and tool finder logic
- 2026-11-11 — Build all hub pages: finder, comparison, guides, videos, research, community and evidence
- 2026-11-11 — Fix accessibility audit findings and record link and accessibility tests
- 2026-11-11 — Redesign home page as an Apple-style scroll story
- 2026-11-11 — Add report, generated evidence documents and README
- 2026-11-11 — Add presentation, fix cost badge wrapping and refresh lake image
- 2026-11-11 — Ignore simulated user-test working files
