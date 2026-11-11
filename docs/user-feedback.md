# Anonymised user feedback

## 1. Usability test with 5 simulated students (AI test agents)

> **Simulated user test — 5 AI test agents playing students (not real students).** Run on 2026-11-11.

**Method.** Five AI test agents each played a different student persona based on our audience research. Each one used the live hub in a real (automated) Chromium browser — on a phone-sized screen, laptop screens, or keyboard-only at 200% zoom — to find a suitable tool and follow one setup guide, then sent the anonymous feedback form. They could not install software or change real phone settings, so 'following' a guide meant reading every step, checking pictures against the text and opening every link. They did not read the code.

**Limits.** These were simulations, not real students: no real devices, no Safari, no screen reader, and an AI's judgement of what is confusing. They found real, reproducible problems on the site, but they don't replace testing with classmates.

**Tasks.** (1) Find a tool that suits you using the hub. (2) Follow one setup guide. Then send the anonymous feedback form.

### Results

| Agent | Persona | Set-up | Tool chosen | Found a suitable tool? | Guide followed | Rating |
| --- | --- | --- | --- | --- | --- | --- |
| P1 | 15-year-old secondary student, Android phone only, scrolls late at night, no money | Android phone (390×844) | Google Digital Wellbeing | yes (medium confidence) | phone-wind-down — partly | 4/5 |
| P2 | 19-year-old undergraduate, Windows laptop with Chrome and an iPhone, distracted by YouTube while revising | Windows laptop (1366×768) | LeechBlock NG | yes (high confidence) | block-distracting-sites — partly | 4/5 |
| P3 | 22-year-old postgraduate, MacBook (Safari) and iPhone, reused passwords, prefers open source | MacBook-size screen (1440×900) | Bitwarden | yes (high confidence) | privacy-checkup — partly | 4/5 |
| P4 | 17-year-old on a school Chromebook, keyboard only (motor impairment), 200% zoom, reduce motion on | Keyboard only, 200% zoom | LeechBlock NG | yes (medium confidence) | block-distracting-sites — partly | 4/5 |
| P5 | 20-year-old with exams soon, Windows laptop and Android phone, ignores soft limits, will pay a little | Large laptop screen (1920×1080) | Freedom | yes (medium confidence) | block-distracting-sites — partly | 4/5 |

"Partly" for guides means every step was read, pictures checked and every link opened, but software could not be installed
and phone settings could not be changed in a test browser.

### In their own words

- **P1:** "The quiz was easy and it told me the thing I need is already on my phone and free, which is nice. The guide was mostly clear, but it never told me how to stop myself just turning the timer off again at 1am."
- **P2:** "Honestly, the finder got me to LeechBlock in about a minute, and the screenshots for setting my study hours are spot on. But hitting Back wiped all my answers, and when step 1 said the links were 'below', all I could see was a Firefox page telling me to download Firefox. I nearly gave up there."
- **P3:** "I came in suspicious and left fairly convinced. Every price and licence claim I checked against the official pages was right, and Bitwarden is what I'll set up. But as a Safari and iPhone person, the guide left me to work out the Apple-specific install bits myself, which is exactly where I'd stall."
- **P4:** "The finder got me to LeechBlock, which is exactly what I wanted: free, and it blocks YouTube just during school hours. But every time I pressed Continue I got thrown to the bottom of the page and had to Shift+Tab back up, and the guide tells me to click an icon I can't click."
- **P5:** "Honestly the most upfront site I've used about what's free and what isn't. It told me straight away that the strict lock in Freedom costs money, which is what I needed to know. But once it found me the strict tool, there was no guide for it, and the guide I followed in its place doesn't say whether I could just switch the blocker off."

### What they found and what we changed

34 grouped problems from 49 reports; 31 fixed.

| Severity | Problem | Reported by | What we did |
| --- | --- | --- | --- |
| high | Tool finder lost keyboard focus after each Continue, and new questions or results sat under the sticky header | P4, P1, P2, P3, P5 | Fixed — Focus now moves to each new question (and to the results heading), which scroll into view just below the header. |
| medium | Pressing Back from a tool page wiped all finder answers | P2, P3 | Fixed — Answers are kept in the page address, so Back, refresh and shared links bring the same results back. |
| medium | Finder said '7 tools fit' but only showed 4 | P5, P2 | Fixed — Added a 'Show all matches' button. |
| medium | Result cards said 'Browser' instead of naming Chrome, Windows or Chromebook | P2, P4 | Fixed — Cards list every platform, and the caution names the exact device a tool doesn't cover. |
| medium | Top match had no setup guide (Freedom) | P5 | Fixed — Tools without a guide now point to the closest guide, on the finder and the tool page. |
| medium | Guide step 1 said store links were 'below' and showed a 'Download Firefox' button | P2, P5, P3 | Fixed — Store buttons now sit inside the step, and the caption explains why the button looks different in other browsers. |
| medium | Step 6 didn't say whether the block could simply be switched off | P5 | Fixed — Added how to lock LeechBlock's options and Firefox's add-ons page during blocks, and that a whole-computer blocker is stricter. |
| medium | Guide step 2 only gave mouse instructions | P4 | Fixed — Added a keyboard route to the options page and how to set a keyboard shortcut. |
| medium | Nothing warned that school Chromebooks may block extensions | P4 | Fixed — Added to 'You'll need' and to the troubleshooting list. |
| medium | Screenshots were hard to read at 200% zoom | P4 | Fixed — Every screenshot has an 'Open full size' link. |
| medium | Phone guide: Android users might try the iPhone-only notification step | P1 | Fixed — Each step is now tagged 'Android only' or 'iPhone only', and the iPhone step points Android users to Focus mode. |
| medium | No path to the App limits PIN | P1 | Fixed — Added Settings › Digital Wellbeing › App limits › App limits PIN to step 1 and the troubleshooting answer. |
| medium | No Safari install link for Privacy Badger | P3 | Fixed — Added the Mac App Store link for Safari to the guide and the tool page. |
| medium | No Mac or iPhone setup help for Bitwarden | P3 | Fixed — Added how to get the Safari extension and turn on iPhone AutoFill, and how saving new passwords works. |
| medium | Mobile menu ignored Escape and let focus slip behind it | P4 | Fixed — Escape closes it, focus leaving closes it, and the menu scrolls at high zoom. |
| medium | Focused links in the swipeable card row stayed off-screen | P4 | Fixed — The row now scrolls each focused link into view. |
| low | 'Keep the screen dark' was described wrongly | P1 | Fixed — Now matches Google's wording: it turns off the always-on display. |
| low | Google Play link for a built-in tool looked like you must install it | P1 | Fixed — Link now says it's only needed if Digital Wellbeing isn't already in Settings. |
| low | Mentions of other guides and videos weren't links | P2, P5, P3 | Fixed — They are now links. |
| low | Bitwarden screenshot sat on the wrong step | P3 | Fixed — Moved to the step that uses the password generator. |
| low | Bitwarden's 'watch out' repeated its price | P3 | Fixed — Cautions no longer repeat a price already shown. |
| low | Some Bitwarden claims weren't backed by the quotes shown | P3 | Fixed — Trimmed the claims to what the quotes show and added the 'Zero-knowledge encryption' quote. |
| low | Video previews loaded from YouTube before pressing play | P3 | Fixed — Thumbnails are now fetched by our own server and served from the site, so a visitor's browser contacts nothing on YouTube until they press play. |
| low | Thank-you message after feedback appeared off-screen, focus dropped to the page | P2, P3, P4, P5 | Fixed — The message scrolls into view and receives keyboard focus. |
| low | Feedback numbers didn't update after sending | P1 | Fixed — The summary refreshes as soon as feedback is sent. |
| low | Missing-rating error appeared far below the stars | P1 | Fixed — The error now appears right under the stars. |
| low | Home page: video title overlapped the text after it | P1 | Fixed — The title fades out fully before the next text fades in. |
| low | Headline still blurred in with 'reduce motion' on | P4 | Fixed — With reduce motion, headlines appear straight away. |
| low | Budget question started on 'optional extras are fine' | P1 | Fixed — It now starts on 'free only', so nothing that needs payment appears unless chosen. |
| low | Match reasons didn't name the student's goals | P1 | Fixed — Each reason now names the goals it matches. |
| low | Comparison table had no strictness column | P5 | Fixed — Added a 'How strict' column. |
| low | 'Works on' filter takes one device at a time | P5 | Not changed — the comparison narrows by one device; the tool finder already accepts several devices. |
| low | Freedom's Google Play price isn't shown | P5 | Not changed — Freedom's official pages don't publish it; now listed under 'What we could not confirm'. |
| low | First arrow key on the star rating selects star 1 | P4 | Not changed — this is how the rating component behaves; the rating is still fully usable by keyboard. |

## 2. Testing with real classmates

The same two tasks are ready for real students on the Share & feedback page ("I tested the hub"). No names, emails or IP
addresses are collected, and anything that looks like contact details is removed before saving. A moderator can export
the answers from `/admin` as an anonymous CSV where participants are numbered P1, P2… and attach it here.

## 3. Published user feedback we relied on

### The Race Towards Digital Wellbeing: Issues and Opportunities (2019)

Alberto Monge Roffarello, Luigi De Russis — CHI '19: Proceedings of the 2019 CHI Conference on Human Factors in Computing Systems (ACM). https://doi.org/10.1145/3290605.3300616
*Method:* Reviewed the features of 42 digital wellbeing apps, ran a thematic analysis of 1,128 user reviews of those apps, and ran a 3-week in-the-wild study of the Socialize app with 38 participants (themes below are from the published abstract)

- **Liked, but for specific situations:** Users valued digital wellbeing apps, but mostly for particular use cases rather than as a complete fix. > "digital wellbeing apps are appreciated and useful for some specific situations"
- **Not restrictive enough:** Users felt the limits were too soft to actually change how they used their phones. > "they are perceived as not restrictive enough, thus not effectively helping users to change their behavior with smartphones"
- **No lasting habit change:** The apps did not help users build new long-term habits. > "they do not promote the formation of new habits"

### Self-Control in Cyberspace: Applying Dual Systems Theory to a Review of Digital Self-Control Tools (2019)

Ulrik Lyngs, Kai Lukoff, Petr Slovak, Reuben Binns, Adam Slack, Michael Inzlicht, Max Van Kleek, Nigel Shadbolt — CHI '19: Proceedings of the 2019 CHI Conference on Human Factors in Computing Systems (ACM); open-access version arXiv:1902.00157. https://doi.org/10.1145/3290605.3300361
*Method:* Systematic review of 367 digital self-control apps and browser extensions from the Google Play, Chrome Web and Apple App stores, coding their design features against a dual-systems model of self-regulation

- **Blocking dominates:** Most tools rely on blocking or removing distractions. > "The most frequent feature cluster related to blocking or removing distractions, some variation of which was present in 74% of tools."
- **Blocks are easy to switch off:** Only a small share of tools make it harder to override a block, for example by refusing to stop a session, asking for a password, or adding a delay. > "14% of tools (50) also added friction if the user attempted to remove the blocking"
- **One-strategy tools:** Most tools use a single approach instead of combining blocking, tracking, goals and rewards. > "65% of tools had only one feature cluster at the core of their design"
- **Users want to change their habits (cited survey):** The paper cites a survey by Ko et al. in which most smartphone users felt they overused their devices; this is Ko et al.'s figure, not a finding of Lyngs et al. > "a majority of smartphone users felt they were overusing their devices (64%) and wanted to change their usage habits (60%)"

### 'I Just Want to Hack Myself to Not Get Distracted': Evaluating Design Interventions for Self-Control on Facebook (2020)

Ulrik Lyngs, Kai Lukoff, Petr Slovak, William Seymour, Helena Webb, Marina Jirotka, Jun Zhao, Max Van Kleek, Nigel Shadbolt — CHI '20: Proceedings of the 2020 CHI Conference on Human Factors in Computing Systems (ACM); open-access version arXiv:2001.04180. https://doi.org/10.1145/3313831.3376672
*Method:* 6-week field experiment with 58 university students, each assigned to goal reminders, a removed newsfeed, or a control condition on Facebook. Researchers logged use and ran fortnightly surveys and post-study interviews.

- **Interventions helped students focus:** Both goal reminders and hiding the newsfeed helped students use Facebook more in line with their intentions. > "Both goal reminders and removed newsfeed helped participants stay on task and avoid distraction."
- **Reminders feel annoying:** Students often found pop-up goal prompts irritating. > "goal reminders were often annoying"
- **Fear of missing out:** Hiding content made some students worry they were missing information. > "removing the newsfeed made some fear missing out on information"
- **Blanket blocking is too rigid:** Students wanted flexible blocking, such as blocking only some features or only during lectures. > "some said blocking access altogether was too inflexible to be useful"
- **Few students had tried tools:** Most participants had never used a digital self-control tool for Facebook before the study. > "Most participants (71%) had never used digital self-control tools for Facebook."

### GoalKeeper: Exploring Interaction Lockout Mechanisms for Regulating Smartphone Use (2019)

Jaejeung Kim, Hayoung Jung, Minsam Ko, Uichin Lee — Proceedings of the ACM on Interactive, Mobile, Wearable and Ubiquitous Technologies (IMWUT). https://doi.org/10.1145/3314403
*Method:* Four-week field experiment with 36 participants comparing different strengths of restrictive lockout against non-restrictive warnings for self-set daily phone-use limits

- **Hard limits work better than warnings:** Lockouts that actually stop use reduced phone use more than warnings that can be dismissed. > "restrictive mechanisms are more effective than non-restrictive mechanisms such as warning"
- **Hard limits are frustrating:** Strict lockouts caused stress because users' needs change from situation to situation. > "restrictive mechanisms caused more frustration and pressure to the users, mainly due to diversity of usage contexts and needs"
- **Balance strictness with flexibility:** Designers need to trade effectiveness against flexibility so that users keep using the tool. > "balance the intervention effectiveness for behavioral changes and the flexibility for user acceptability"

### “Your Screen-Time App Is Keeping Track”: Consumers Are Happy to Monitor but Unlikely to Reduce Smartphone Usage (2021)

Laura Zimmermann — Journal of the Association for Consumer Research (University of Chicago Press). https://doi.org/10.1086/714365
*Method:* Longitudinal field study (N=242) of screen-time tracking plus an online experiment (N=139) on preferences for tracking versus restrictive tools

- **Tracking raises awareness, not reduction:** Screen-time dashboards made people more aware of their use but were unlikely to reduce it on their own. > "screen-time tracking improves digital self-awareness but that it is less likely to lead to a reduction of mobile usage"
- **People prefer monitoring over limits:** Many users want to see their usage data but don't want tools that actively restrict them. > "many people want to monitor their smartphone usage but not necessarily control it"
