# Building Coldstream Exteriors in WordPress + Bricks

This kit is for the developer rebuilding the site in Bricks. The finished reference build is
live at **https://coldstream-exteriors-staging.netlify.app** — treat it as the spec. Everything
in this kit was extracted from those exact pages, so when the kit and the preview disagree,
nothing has drifted: they can't.

## What's in the kit

| Folder | Contents |
|---|---|
| `content/` | One HTML sheet per page (open `content/index.html` first). SEO fields, full copy in page order, and the page's JSON-LD |
| `design/` | `tokens.css` + `ui-tokens.css` (the CSS custom properties), brand tokens and voice rules as JSON |
| `seo/` | `meta-all-pages.csv`, `redirects-for-redirection-plugin.csv` (380 rules, importable), production `robots.txt`, `llms.txt` |
| `screens/` | Desktop + mobile screenshots of the key templates |

## 1. Global setup in Bricks

**Colors** (Bricks → Settings → Global colors), from `design/brand-tokens.json`:
- Primary `#3A89C7` · Primary deep `#2A6699` · Accent orange `#E8843B`
- Deep dark `#0E1B2A` · Text `#101B26` · Text muted `#5B6B78`
- Mist `#DDE5EB` · Cloud `#F2F6F9` · Paper `#FFFFFF` · Line `#E4EAEF`
- Hero gradient: `linear-gradient(135deg, #2f80c4 0%, #256199 55%, #1c4c78 100%)`

**Typography** (Google Fonts):
- Headings: **Montserrat** — 700, strong 800, hero H1 900. Sentence case. Line-height 1.08,
  letter-spacing −0.01em.
- Body: **Inter** — 400, line-height 1.55, 16px minimum (never smaller on inputs — iOS zooms).
- Eyebrow labels: 0.82rem, uppercase, letter-spacing 0.14em, usually accent orange.

**Easiest token route:** paste `design/tokens.css` + `design/ui-tokens.css` into Bricks' custom
CSS (or enqueue them in the child theme) and reference `var(--cs-…)` from Bricks classes. Then
the WordPress build and the reference share one source of truth for color and type.

**Breakpoints used by the reference:** 820px (nav collapses, card grids become swipe carousels,
mobile action bar appears) and 640px (tighter section padding).

## 2. Structure: 13 templates, not 71 pages

The 71 pages are instances of ~13 layouts. Build each ONCE as a Bricks template and populate
per page from the content sheets:

1. Homepage · 2. Market landing (Cincinnati/Columbus/St. Louis) · 3. National service hub
(roofing/siding/windows/gutters) · 4. Market service hub (12 pages) · 5. National sub-service
· 6. Market sub-service (~21 pages) · 7. Commercial roofing (Cincinnati only) · 8. Storm damage
· 9. About (+3 market about) · 10. Free estimate (+3 market variants) · 11. Service areas ·
12. Utility pages (privacy/terms/financing/thank-you) · 13. Noindex placeholders
(gallery/reviews/blog index)

The `screens/` folder shows desktop and mobile for each major template.

## 3. Behaviour to recreate (all of it is on the preview)

- **Market selector** (top utility bar, every page): three markets + "Other / not sure". On
  NATIONAL pages, choosing a market swaps IN PLACE: every phone number, the partner logos, the
  header nav links (to that market's pages), card links, and a "Showing {Market}" chip; the
  national siding page's section heading swaps to "What a full siding replacement does for a
  {City} home". On MARKET pages the selector navigates to the other market instead.
- **Phone numbers:** Cincinnati (513) 258-0450 · Columbus (614) 812-0811 · St. Louis
  (314) 380-8111 · national (844) 426-8222. One source of truth; a hard-coded number in a
  template is a bug. Every displayed number is also its own tel: link.
- **Mobile action bar** ≤820px: fixed bottom bar — call (market number, swaps with selector) +
  Free Estimate. Replaces the desktop right-edge tab. Never on the estimate pages.
- **Card grids on phones** become horizontal snap carousels (What We Do, service cards,
  why-trust, detail blocks) — next card peeks past the edge. Desktop: normal grids.
- **Carousels/marquees** (reviews, partner logos, project photos): auto-scroll, pause on
  hover/focus, and become static/scrollable when the visitor prefers reduced motion.
- **FAQ** = native accordions. **Estimate form** posts name/phone/ZIP/service → thank-you page.

## 4. SEO requirements (non-negotiable)

- Titles ≤ 60 chars, descriptions ≤ 160 — use `seo/meta-all-pages.csv` verbatim; no two
  indexable pages may share either.
- Every URL ends in a trailing slash and self-canonicals. Pages marked `noindex` in the CSV
  stay noindex until real content lands.
- Import `seo/redirects-for-redirection-plugin.csv` into the Redirection plugin (or equivalent)
  — 380 rules mapping every legacy URL. **The redirects and the new pages go live together.**
- `/blog/` keeps the existing WordPress posts — nothing in this kit touches it.
- Each content sheet ends with the page's JSON-LD; output it on that page (code block or SEO
  plugin). It is one connected graph per page — keep it intact.
- Ship `seo/robots.txt` and `seo/llms.txt` at the site root.

## 5. Copy rules (why the words are the way they are)

From `design/voice-spec.json`: no superlatives, no absolute guarantees, sentence case
headlines. Only three unconditional claims: licensed and insured · free, no-obligation
inspections · 25-year workmanship warranty (never "lifetime"). "Industry-leading warranties"
is an approved exception. **St. Louis pages never mention metal roofing.** No invented
testimonials, ratings, or review counts anywhere — sample reviews are labeled as samples and
get replaced by the real Google pull. Reproduce the copy from the sheets verbatim; it has been
through legal-and-claims review rounds.

## 6. Assets

All images live in the site-files zip (`2-website-files.zip`): `/photos/` (real project photos —
never replace with stock), `/partners/` (manufacturer logos), `/badges/`, logo files at root,
`/video/` (placeholder hero clip), favicons and `og-default.jpg`. Filenames are meaningful —
keep them for traceability.
