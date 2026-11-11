# Accessibility checklist

Target: WCAG 2.2 level AA. Automated checks by `scripts/a11y-audit.mjs` (axe-core via @axe-core/playwright, Chromium, reduced motion on) on 2026-11-11 14:18 UTC.

## Checklist

| Check | How | Result |
| --- | --- | --- |
| Page language set | axe `html-has-lang` | Pass |
| Skip link is the first Tab stop | script presses Tab on every page | Pass |
| Keyboard focus clearly visible | 3px outline on `:focus-visible`, checked by script | Pass |
| Readable navigation, headings in order | axe heading and landmark rules | Pass |
| Meaningful link text (no "click here") | axe `link-name` + vague-text script | Pass |
| Text contrast at least 4.5:1 | contrast table below + axe `color-contrast` | Pass |
| Images described; decoration hidden | written alt text on every screenshot; axe `image-alt` | Pass |
| Illustrations labelled as illustrations | caption and tag on every phone drawing | Built in |
| Form fields labelled; errors announced | `<label>` on every field, `role="alert"` errors | Pass |
| No sideways scrolling on a 375px phone | each page opened at 375px | Pass |
| Respects "reduce motion" | 3D scene holds still; scroll stories become plain layouts | Built in (audit runs with reduced motion on) |
| Animated home page accessible while scrolling | axe at 5 scroll positions with motion on | Pass |
| Videos never autoplay | click-to-load, youtube-nocookie.com, titled players | Built in |
| Zoom not blocked | axe `meta-viewport` | Pass |
| Tables have captions and header cells | `<caption>`, `<th scope>` | Built in |
| Screen-reader walkthrough (NVDA / VoiceOver) | needs a person | **To do** |
| Readable at 200% zoom | needs a person | **To do** |

## Colour contrast

| Text | Background | Ratio | AA (4.5:1) |
| --- | --- | --- | --- |
| Body text #e9eff4 | page (#0b1622) | 15.73:1 | Pass |
| Body text #e9eff4 | card (#112131) | 14.09:1 | Pass |
| Muted text #a9bccb | page (#0b1622) | 9.32:1 | Pass |
| Muted text #a9bccb | card (#112131) | 8.36:1 | Pass |
| Lake accent / links #8fd3c8 | page (#0b1622) | 10.69:1 | Pass |
| Lake accent / links #8fd3c8 | card (#112131) | 9.58:1 | Pass |
| Dawn accent #f1c9a5 | page (#0b1622) | 11.84:1 | Pass |
| Dawn accent #f1c9a5 | card (#112131) | 10.61:1 | Pass |
| Mist labels #c9d6e2 | page (#0b1622) | 12.33:1 | Pass |
| Mist labels #c9d6e2 | card (#112131) | 11.04:1 | Pass |
| Button text #1b1410 | dawn button (#f1c9a5) | 11.82:1 | Pass |
| Button text #08202a | lake button (#8fd3c8) | 9.85:1 | Pass |

## Automated results by page

| Page | axe violations | Skip link | Focus visible | Sideways scroll at 375px |
| --- | --- | --- | --- | --- |
| `/` | 0 | Yes | Yes | No |
| `/find` | 0 | Yes | Yes | No |
| `/resources` | 0 | Yes | Yes | No |
| `/resources?view=table` | 0 | Yes | Yes | No |
| `/resources/leechblock-ng` | 0 | Yes | Yes | No |
| `/guides` | 0 | Yes | Yes | No |
| `/guides/block-distracting-sites` | 0 | Yes | Yes | No |
| `/guides/privacy-checkup` | 0 | Yes | Yes | No |
| `/guides/phone-wind-down` | 0 | Yes | Yes | No |
| `/videos` | 0 | Yes | Yes | No |
| `/research` | 0 | Yes | Yes | No |
| `/community` | 0 | Yes | Yes | No |
| `/evidence` | 0 | Yes | Yes | No |
| `/evidence/sources` | 0 | Yes | Yes | No |
| `/evidence/link-test` | 0 | Yes | Yes | No |
| `/evidence/accessibility` | 0 | Yes | Yes | No |
| `/evidence/feedback` | 0 | Yes | Yes | No |
| `/evidence/revisions` | 0 | Yes | Yes | No |
| `/evidence/report` | 0 | Yes | Yes | No |
