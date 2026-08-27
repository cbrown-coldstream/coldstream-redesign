# Coldstream Exteriors — website design system

Everything visual on this site derives from the tokens below. If a change is ever needed, change
the token value, not individual pages — every page reads from the same stylesheet.

## ⚠ Two design systems exist. This document is the WEBSITE's.

Coldstream also runs a **social/print** design system (Saira Condensed, all-caps headlines,
heavier orange). It is intentionally different and lives elsewhere. Do not "correct" the website
toward social artwork you may have seen, or vice versa — the mismatch is a decision, not a bug.

## Color

| Token | Value | Used for |
|---|---|---|
| Primary | `#3A89C7` | Buttons, links, icon discs |
| Primary deep | `#2A6699` | Hover states, dense UI, utility bar |
| Accent orange | `#E8843B` | ONE call-to-action per view, eyebrows, star ratings. Never body text, never backgrounds at scale |
| Deep dark | `#0E1B2A` | Footer ground, hero base |
| Hero gradient | `linear-gradient(135deg, #2f80c4 0%, #256199 55%, #1c4c78 100%)` | Hero and dark band backgrounds |
| Sky (on dark) | `#8fc0ea` | Accents on navy grounds |
| Text | `#101B26` | Body copy |
| Text muted | `#5B6B78` | Secondary copy |
| Mist / Cloud / Paper | `#DDE5EB` / `#F2F6F9` / `#FFFFFF` | Section grounds, alternating bands |
| Line | `#E4EAEF` | Borders, dividers |

## Type

- **Display: Montserrat** — weights 700 (headings), 800 (strong), 900 (hero H1). Sentence case,
  line-height 1.08, letter-spacing −0.01em. Google Fonts.
- **Body: Inter** — 400, line-height 1.55. Google Fonts.
- **Eyebrows** (small labels above headings): 0.82rem, uppercase, letter-spacing 0.14em, usually
  accent orange.
- Fallback stacks are in the CSS; nothing breaks if the webfonts fail.

## Voice and claims — the rules the copy obeys

- Only three claims are made unconditionally: **licensed and insured · free, no-obligation
  inspections · 25-year workmanship warranty**. It is a 25-year warranty, never "lifetime".
- No superlatives ("best", "cheapest", "#1") and no absolute guarantees. "Industry-leading
  warranties" is an owner-approved exception and always appears with its substantiation.
- Star ratings, review counts, and financing figures render only from verified data. The sample
  reviews visible today are labeled as samples and are replaced automatically by the real Google
  reviews when that connection is switched on.
- St. Louis pages never mention metal roofing (shingle and low-slope only there). Cincinnati and
  Columbus offer shingle, metal and low-slope.
- Three offices, four phone numbers — Cincinnati (513) 258-0450 · Columbus (614) 812-0811 ·
  St. Louis (314) 380-8111 · national (844) 426-8222. They come from one data file; a hard-coded
  number anywhere is a bug.

## Logos and imagery

- Logo files ship in the site's root (`logo-coldstream-exteriors.jpg`, dark variant) and
  `/partners/` holds manufacturer marks.
- Project photos are real Coldstream jobs only — never stock. Cards showing "Project photo
  pending" are intentional placeholders awaiting real photos.
- The favicon set and social-share image (`og-default.jpg`) are generated from the brand tokens.

## Layout notes

- Max content width ~1140px; sections alternate paper/cloud/navy grounds.
- One orange CTA per view. Hover states go navy, not orange.
- Every animation respects `prefers-reduced-motion` — carousels become static lists.
- Pages pass automated checks for heading order, contrast on the hero, title/description length,
  and structured data. If you edit HTML by hand, those guarantees end — prefer sending changes
  back through Craig.
