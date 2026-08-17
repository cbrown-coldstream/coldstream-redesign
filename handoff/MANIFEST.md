# Coldstream Exteriors — static site handoff

Build of 2026-08-11. **69 pages · 273 redirect rules.**

This is a complete static site: plain HTML with a real heading structure, no client
framework, no server runtime, no build step on your side. It is designed to be served by
the existing host exactly as it is.

## What is in the package

| File | What it is |
|---|---|
| `coldstream-site-2026-08-11.zip` | The site. Unzip to the web root. Directory-per-URL, so `/cincinnati/` is `cincinnati/index.html`. |
| `htaccess.txt` | The 301 map as an Apache fragment. **Read the placement note at the top of the file.** |
| `MANIFEST.md` | This file. |

## Order of operations — this is the part that matters

The redirects and the pages have to go live together. Each half on its own is worse than
neither:

1. **Upload the site files first**, but do not point the domain at them yet.
2. **Add the htaccess fragment ABOVE the WordPress rewrite block.** If it goes below,
   WordPress answers first and not one of these rules fires.
3. **Cut over.** From this moment the old URLs 301 and the new pages answer.
4. **Submit `/sitemap.xml`** in Search Console and watch Coverage for two weeks.

Publishing the redirects before the pages exist points every one of them at a 404, which
loses the ranking value exactly as a 404 does while looking handled.

## Serving requirements

- **Trailing slashes.** Every canonical URL ends in `/` and every page is an `index.html`
  inside a directory. `DirectoryIndex index.html` must be on. Do not add a rule that
  strips trailing slashes — it would fight the canonicals on every page.
- **No WordPress on these paths.** WordPress must not attempt to route any URL in the
  sitemap. The htaccess fragment sits above its block for this reason.
- **Do not hand-edit the HTML.** It is generated. An edit here is overwritten by the next
  build and diverges from the source of truth in the meantime.
- `robots.txt` is deliberately permissive; page-level control is meta robots on the page.
  Disallowing a noindex URL would stop Google reading the tag that removes it.

## What is indexable, and what is not

**55 of 69 pages are indexable.** That is intentional and is not a
broken build. Everything else carries `<meta name="robots" content="noindex">` because the
content it needs has not been sourced yet, and a thin page that ranks is worse than a page
that waits. The sitemap lists only the indexable set, so the two never contradict.

Indexable today:

- `/`
- `/free-estimate/`
- `/service-areas/`
- `/roofing/`
- `/siding/`
- `/windows/`
- `/gutters/`
- `/commercial-roofing/`
- `/cincinnati/`
- `/cincinnati/about/`
- `/cincinnati/free-estimate/`
- `/cincinnati/roofing/`
- `/cincinnati/roofing/roof-replacement/`
- `/cincinnati/roofing/roof-repair/`
- `/cincinnati/roofing/insurance-storm-damage/`
- `/cincinnati/siding/`
- `/cincinnati/siding/siding-replacement/`
- `/cincinnati/siding/james-hardie-siding/`
- `/cincinnati/siding/vinyl-siding/`
- `/cincinnati/windows/`
- `/cincinnati/gutters/`
- `/cincinnati/commercial-roofing/`
- `/columbus/`
- `/columbus/about/`
- `/columbus/free-estimate/`
- `/columbus/roofing/`
- `/columbus/roofing/roof-replacement/`
- `/columbus/roofing/roof-repair/`
- `/columbus/roofing/insurance-storm-damage/`
- `/columbus/siding/`
- `/columbus/siding/siding-replacement/`
- `/columbus/siding/james-hardie-siding/`
- `/columbus/siding/vinyl-siding/`
- `/columbus/windows/`
- `/columbus/gutters/`
- `/columbus/commercial-roofing/`
- `/st-louis/`
- `/st-louis/about/`
- `/st-louis/free-estimate/`
- `/st-louis/roofing/`
- `/st-louis/roofing/roof-replacement/`
- `/st-louis/roofing/roof-repair/`
- `/st-louis/roofing/insurance-storm-damage/`
- `/st-louis/siding/`
- `/st-louis/siding/siding-replacement/`
- `/st-louis/siding/james-hardie-siding/`
- `/st-louis/siding/vinyl-siding/`
- `/st-louis/windows/`
- `/st-louis/gutters/`
- `/st-louis/commercial-roofing/`
- `/cincinnati/locations/east/`
- `/cincinnati/locations/west/`
- `/st-louis/locations/south/`
- `/st-louis/locations/north/`
- `/columbus/locations/`

Noindex today (14) — grouped by what each is waiting on:

- **internal team review board — never for publication** — 1 page(s): `/sitemap/`
- **no job photos yet** — 3 page(s): `/cincinnati/gallery/`, `/columbus/gallery/`, `/st-louis/gallery/`
- **no sourced reviews yet** — 3 page(s): `/cincinnati/reviews/`, `/columbus/reviews/`, `/st-louis/reviews/`
- **index built, no posts migrated yet** — 1 page(s): `/blog/`
- **founding year, ownership, crew size, markets-served history — every company-story fact. The page ships with only what is verifiable today.** — 1 page(s): `/about-us/`
- **lender, advertised monthly payment, APR, term and approval criteria. Advertising a specific monthly payment triggers Regulation Z disclosure requirements.** — 1 page(s): `/financing/`
- **the real data practices — analytics, call tracking, CRM, ad pixels, SMS/TCPA consent, retention — then counsel review. Sections with no sourced answer are marked in the page.** — 1 page(s): `/privacy-policy/`
- **counsel review of the warranty, payment and dispute terms before this indexes.** — 1 page(s): `/terms/`
- **never indexed by design** — 2 page(s): `/thank-you/`, `/404.html`

## Pages that do not exist yet, by design

These templates are finished and generate nothing, because each is gated on real material
that has not arrived. They will appear in a later build with no code change:

- **Location pages** — gated on completed-job photos per sub-area.
- **Market galleries** — same job pull. Pending: cincinnati, columbus, st-louis.
- **Market reviews pages** — gated on real, linkable Google reviews. Pending: cincinnati, columbus, st-louis.
- **/blog/** — no content and no owner. Needs per-post traffic and backlink data before any post is folded, kept or killed.

## What we need from you

Three things, and the first is the one blocking a claim we cannot currently make:

1. **The live URL export** — every currently-published URL, one per line. The 301 map
   covers the patterns the audit documented, but *coverage of all 299 folding pages is
   unverified without the actual list*. Drop it in and the generator names every URL no
   rule matches, before cutover rather than after.
2. **Page-level ranking data for the ~25 windows URLs.** They are deliberately unmapped:
   bay, bow, slider and picture windows may each earn their own search, and folding them
   on a guess could retire a page that is quietly earning. They keep 200ing until the data
   says otherwise.
3. **Blog traffic and backlinks per post.** Same reasoning. No blog URL gets a rule from a
   guess — folding a post that carries backlinks throws away the only off-site authority
   the domain has.

## Known gaps in this build

10 factual claims are gated off the site entirely until someone sources them —
the promotion, the financing figures, the BBB accreditation, the years-in-business number
and all customer testimonials. They are absent from the HTML rather than approximated:

- `offer` — the $1,000-off promotion — confirm it is running, and its end date
- `financing` — lender, advertised monthly payment, APR and terms (Reg Z)
- `paymentTerms` — "no payment until complete" — confirm it is policy
- `experience` — founding year, for the "25+ years" claim
- `customersServed` — homes served, for the "3,000+ customers" figure
- `bbb` — accreditation status, rating and profile URL
- `testimonials.national` — real, attributable reviews from the GBP listing
- `testimonials.cincinnati` — real, attributable reviews from the GBP listing
- `testimonials.columbus` — real, attributable reviews from the GBP listing
- `testimonials.st-louis` — real, attributable reviews from the GBP listing

---

Questions on any of the above go back to the Coldstream side, not into an HTML edit.
