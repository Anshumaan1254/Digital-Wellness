# Digital Wellness Resource Hub — Project Report

**Project 3 · Digital Wellness Resource Hub**
Website: deployed on Vercel (link in the README) · Source code: github.com/Anshumaan1254/Digital-Wellness
Information checked: 11 November 2026

## 1. Summary

We built a website that helps students choose and set up practical digital wellness tools. Instead of a list of links, the hub compares twelve tools on the same six criteria, labels costs honestly, shows which devices each tool works on, and recommends tools through a short "tool finder" that explains its reasons and cautions. Three step-by-step setup guides show students exactly what to do, and an anonymous feedback system lets students test the hub and share their own videos, animations, app screenshots and tips.

| What the brief asked for | Where it is |
| --- | --- |
| Website link | The deployed hub (see README) |
| Resource comparison | Compare page (cards and full table) and `docs/resource-comparison.md` |
| Source links and dates checked | Evidence › Sources & dates, every tool page, `docs/sources-and-dates.md` |
| Three setup guides | Setup guides section and `docs/setup-guides.md` |
| Link test record | Evidence › Link test and `docs/link-test-record.md` |
| Accessibility checklist | Evidence › Accessibility and `docs/accessibility-checklist.md` |
| Anonymised user feedback | Evidence › User feedback and `docs/user-feedback.md` |
| Revisions | Evidence › Revisions and `docs/revisions.md` |
| Report and presentation | This report and `Digital-Wellness-Hub-presentation.pptx` |

## 2. Audience and their needs

**Audience.** Secondary-school and university students, roughly 13 to 24, who use a phone and a laptop for study and want calmer, safer habits without spending money.

**How we identified needs.** The brief suggests a short discussion or feedback activity. We did not have time to run a survey before building, so we used published research instead: ten sources from Pew Research Center, Common Sense Media, the OECD, UNESCO, Ofcom and four peer-reviewed studies. We read each source and recorded a short word-for-word quote so our interpretation can be checked. This is secondary research, so it describes students in general rather than our own classmates — the planned user testing (section 7) is how we will check the hub with real students.

**What we found.** Four needs came up repeatedly:

1. **Too much time on social media.** 45% of US teens say they spend too much time on social media, up from 36% in 2022 (Pew, 2025). In a three-week experiment, students limited to 10 minutes per app per day felt less lonely and depressed (Hunt et al., 2018).
2. **Constant interruptions.** Teens in one study received a median of 237 notifications a day, about a quarter during school (Common Sense Media, 2023). Notifications disrupt attention even when ignored (Stothart et al., 2015), and students can take up to 20 minutes to refocus after a distraction (UNESCO, 2023).
3. **Lost sleep.** 90% of 67 studies linked screen time with shorter or later sleep (Hale & Guan, 2015), and 45% of teens say social media hurts their sleep (Pew, 2025).
4. **Privacy and safety.** 52% of UK 13–17-year-olds sometimes avoid apps that ask for personal information, yet 12% always share it despite feeling uncomfortable (Ofcom, 2025).

We also used five studies of how real users react to digital-wellbeing tools. Users find many tools "not restrictive enough" (Monge Roffarello & De Russis, 2019), but strict lock-outs cause frustration (Kim et al., 2019), and tracking alone raises awareness without reducing use (Zimmermann, 2021). These findings shaped the tool finder's "how firm should it be?" question and the "watch out" caution on every recommendation.

## 3. Choosing and comparing resources

**Selection.** We chose twelve tools — within the brief's suggested eight to twelve — across four categories that match the brief's coverage:

| Category | Tools |
| --- | --- |
| Screen time, notifications & bedtime | Apple Screen Time & Focus, Google Digital Wellbeing, f.lux |
| Focus & blocking apps | Forest, Freedom, Cold Turkey Blocker, Super Productivity |
| Browser extensions | LeechBlock NG, Unhook |
| Privacy & digital safety | Bitwarden, Privacy Badger, Have I Been Pwned |

The set deliberately mixes built-in, free, open-source and paid options across iPhone, Android, Windows, Mac, Linux, Chromebook and the main browsers.

**Criteria.** Every tool is compared on the same criteria: purpose, supported devices, cost, privacy requirements (account needed, data collected), accessibility, and limitations — plus whether it is open source, how strict it is, and the date checked.

**Checking official information.** For every price, platform and licence claim we opened the maker's own website, pricing page, help pages, app-store listing or source repository on 11 November 2026, and copied a short quote as proof. In total the comparison cites **83 official sources**. Where we could not confirm something, we say so on the tool's page rather than guess (38 such notes, mostly "no official accessibility statement found").

**Honest cost labels.** The brief says not to call a tool free when essential features require payment, so we use three labels:

- **Free** — everything you need costs nothing (e.g. LeechBlock NG, Privacy Badger, built-in phone tools).
- **Free core · paid extras** — the essentials are free; extras cost money (e.g. Bitwarden, Forest).
- **Limited free · key features paid** — important features such as scheduling or locking need payment (Freedom, Cold Turkey Blocker). The tool finder hides these when a student chooses "free only".

Checking official sources changed several things we thought we knew: Bitwarden Premium now costs US$19.80 a year (not US$10), Forest is now free to download on iPhone with an optional subscription, Freedom has a permanent but limited free plan, and Apple renamed Downtime and App Limits in iOS 27. These are recorded in the revisions log.

## 4. Setup guides

We wrote three short guides, each tested against the official help pages:

1. **Block distracting websites during study hours** — LeechBlock NG (5 minutes).
2. **A 15-minute privacy and account check-up** — Have I Been Pwned, Bitwarden and Privacy Badger.
3. **Phone wind-down** — app timers, Bedtime mode and Focus on Android, and Screen Time, Sleep Focus and Scheduled Summary on iPhone (10 minutes).

**Screenshots without personal information.** All screenshots were taken automatically in a fresh, signed-out browser with made-up example settings, so no names, emails, accounts or browsing history can appear. The LeechBlock images show the extension's real options page, opened as a static page with all of its scripts blocked. For the phone guide, real screenshots would have shown notifications and contacts, so we drew simplified settings screens using the exact menu wording from Google's and Apple's help pages, and every one is labelled "Illustration, not a real screenshot". We deleted one screenshot — Have I Been Pwned showed a bot-check page instead of the real site — rather than publish a misleading image.

## 5. Building the hub

**Technology.** Next.js 15 and React 19 (pages and server API routes running on Node.js), Three.js through React Three Fiber for the 3D lake scene, MongoDB for feedback, votes and uploads, and Tailwind CSS. The site is deployed on Vercel. If no database is connected, it still works and stores responses in a temporary file.

**Design.** A calm "blue hour on a mountain lake" theme: a 3D scene of layered ridges reflected in still water, soft mist and a moon path on the water. The home page tells its story as you scroll, in the style of Apple's product pages: the research figures take over the screen one at a time, the four kinds of tool sweep past horizontally, and a phone's screen changes as you scroll through the settings worth turning on. UI components come from React Bits (blur-in headings, scroll-revealed text, the expanding image frame, the finder's stepper, star rating and spotlight cards) and from libraries listed on 21st.dev (Kokonut UI's Background Paths, Aceternity's Timeline, and Magic UI's Marquee and Border Beam).

**Helping students choose.** The tool finder asks four questions — goals, devices, budget, and how strict the tool should be — then shows the best matches with the reasons each fits and the main thing to watch out for. The comparison page filters by category, device, cost and open source, and switches between cards and a full table.

**Videos, feedback and sharing.** Eight videos from TED, Apple Support, Google, CrashCourse, CISA, Computerphile and Common Sense Media load only when a student presses play, through YouTube's privacy-enhanced mode. The Share & feedback page collects anonymous feedback and lets students submit videos (as links), animations, app screenshots and tips.

**Privacy by design.** Forms never ask for a name or email. Anything that looks like an email address, phone number or social-media handle is removed before feedback is saved. Uploaded photos are re-drawn in the browser to strip hidden metadata such as GPS location. Submissions and written comments only appear after a moderator approves them. There are no adverts, no affiliate links and no tracking cookies.

## 6. Accessibility

We designed for WCAG 2.2 AA from the start: a skip link, visible focus outlines, one `h1` per page and headings in order, labels on every form field, alt text on every screenshot, captions and header cells on tables, no sideways scrolling on phones, and a reduced-motion mode in which the 3D scene holds still and all scroll animations are replaced by a simple layout. Every text colour meets the 4.5:1 contrast ratio on its background (the lowest is 8.4:1).

We tested 19 pages with axe-core in a real browser. The first run found invalid list markup, a skipped heading level, step buttons whose spoken names did not match their visible text, one low-contrast label and pages that scrolled sideways on a 375px phone. After fixing them, **all 19 pages report no axe violations** and pass our checks for the skip link, focus visibility, link text and phone width. Two checks still need a person: a full screen-reader run (NVDA or VoiceOver) and reading every page at 200% zoom.

## 7. Testing

**Link test.** A script tests every external link the hub uses and crawls every internal page. Of **114 external links, none are broken**: 98 loaded directly, 8 Apple support pages loaded when re-opened in a real browser, and 7 research DOIs were confirmed through the official DOI registry because the publishers block automated requests. One OECD page blocks automated checks completely and needs a manual click before submission. All **29 internal pages** loaded successfully.

**Functional testing.** We tested the forms and API end to end against a local MongoDB database: valid feedback is saved; feedback without consent is rejected; an email address and phone number typed into a comment were replaced with "[email removed]" and "[number removed]"; uploads of the wrong file type are rejected; an uploaded screenshot stayed hidden from the public until approved and then appeared in the gallery; and the moderation API refuses requests without the admin key. All test records were deleted afterwards so they are not counted as feedback.

**User testing — not yet complete.** The brief asks us to ask three to five students to find a suitable resource and follow one guide. That testing has **not** been done yet, and we have not invented any results. Everything is ready: the Share & feedback page explains the two tasks, and the feedback form records whether each tester found a tool, whether they finished the guide, how long it took and where they got stuck, without names or emails. Results appear live on the Evidence pages, and moderators can export them as an anonymous CSV with participants numbered P1, P2 and so on.

## 8. Revisions

The revisions log on the site lists every change and why it was made. Most came from checking official sources (prices, plan limits and renamed iPhone settings), from our screenshot policy (removing the misleading bot-check screenshot, re-capturing LeechBlock, using labelled illustrations for phones), from the accessibility audit, and from a design review that replaced the original grid of cards on the home page with a scroll-driven story. A final entry is reserved for changes made after student testing.

## 9. Limitations and next steps

- **Run the user test** with three to five students, record their problems, fix them and add the changes to the revisions log.
- **Finish the manual accessibility checks** (screen reader and 200% zoom).
- **Re-check prices regularly.** Several prices are introductory or region-specific (for example Forest Plus is labelled "Early Bird" in the US App Store), and tools change their plans often.
- **Our needs analysis is secondary research.** It describes students in the US and UK in general; a short survey of our own school would make it more specific.
- **Uploads are stored in the database** and limited to 3 MB. A larger hub would use dedicated file storage.

## 10. References

- Common Sense Media (2023). *Constant Companion: A Week in the Life of a Young Person's Smartphone Use.*
- Hale, L., & Guan, S. (2015). Screen time and sleep among school-aged children and adolescents: a systematic literature review. *Sleep Medicine Reviews*, 21, 50–58. https://doi.org/10.1016/j.smrv.2014.07.007
- Hunt, M. G., Marx, R., Lipson, C., & Young, J. (2018). No more FOMO: Limiting social media decreases loneliness and depression. *Journal of Social and Clinical Psychology*, 37(10). https://doi.org/10.1521/jscp.2018.37.10.751
- Kim, J., Jung, H., Ko, M., & Lee, U. (2019). GoalKeeper: Exploring interaction lockout mechanisms for regulating smartphone use. *Proc. ACM IMWUT*. https://doi.org/10.1145/3314403
- Lyngs, U., et al. (2019). Self-control in cyberspace: Applying dual systems theory to a review of digital self-control tools. *CHI '19*. https://doi.org/10.1145/3290605.3300361
- Lyngs, U., et al. (2020). "I just want to hack myself to not get distracted": Evaluating design interventions for self-control on Facebook. *CHI '20*. https://doi.org/10.1145/3313831.3376672
- Monge Roffarello, A., & De Russis, L. (2019). The race towards digital wellbeing: Issues and opportunities. *CHI '19*. https://doi.org/10.1145/3290605.3300616
- OECD (2024). *Managing screen time: How to protect and equip students against distraction* (PISA in Focus No. 124).
- Ofcom (2025). *Children and Parents: Media Use and Attitudes Report 2025.*
- Pew Research Center (2022). *Teens and Cyberbullying 2022.*
- Pew Research Center (2025). *Teens, Social Media and Mental Health.*
- Stothart, C., Mitchum, A., & Yehnert, C. (2015). The attentional cost of receiving a cell phone notification. *Journal of Experimental Psychology: Human Perception and Performance*, 41(4), 893–897. https://doi.org/10.1037/xhp0000100
- UNESCO (2023). *Global Education Monitoring Report 2023: Technology in education — A tool on whose terms?*
- Ward, A. F., Duke, K., Gneezy, A., & Bos, M. W. (2017). Brain drain: The mere presence of one's own smartphone reduces available cognitive capacity. *Journal of the Association for Consumer Research*, 2(2), 140–154. https://doi.org/10.1086/691462
- Zimmermann, L. (2021). "Your screen-time app is keeping track": Consumers are happy to monitor but unlikely to reduce smartphone usage. *Journal of the Association for Consumer Research*. https://doi.org/10.1086/714365

Product information for all twelve tools is cited, with quotes and dates, in `docs/sources-and-dates.md`.
