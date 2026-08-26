# Coldstream Exteriors — website rebuild

Read this first. It is the context a new session needs before touching anything.

## What this is

A static rebuild of **coldstreamexteriors.com**, a roofing and exteriors contractor operating in
three metros: **Cincinnati**, **Columbus** and **St. Louis**.

The live site is WordPress with **443 URLs**. An SEO audit found it was mostly the same page
repeated — 100+ neighbourhood pages that were one skeleton with synonyms swapped, four
free-estimate pages, four thank-you pages, six window pages saying the same thing with the noun
changed. Thin duplicate pages compete with each other and none of them wins.

This repo is the consolidation: **67 pages** carrying the same copy, with **273 redirect rules**
pointing every retired URL at whichever page absorbed it. Astro, static output, no client
framework, no server runtime. See `PAGES.md` for the full inventory.

**It is not deployed to production yet.** Staging is
https://coldstream-exteriors-staging.netlify.app, and **nothing on it is in any search index**.
Two layers hold that, and they answer different questions — `netlify.toml` sends
`X-Robots-Tag: noindex, nofollow` on every response, which stops Google and Bing INDEXING it, and a
rewrite in the same file serves `public/robots-staging.txt` (`Disallow: /`) at `/robots.txt` there,
which is what stops GPTBot, ClaudeBot and PerplexityBot READING it. The header alone was not
enough; see DECISIONS §50. Neither is a lock — for genuine privacy the answer is Netlify password
protection. Production is the existing WordPress host — see "The handoff" below.

## The one rule that explains most of the others

**A page that cannot say something only it could say should not be a page — it should be a section
on a page that can.**

Every structural decision follows from that. Sub-services became sections. Neighbourhood pages
became a list on a market page. Location pages only exist where there is real completed work
behind them. When you are tempted to add a page, that is the test.

## Non-negotiables

These are enforced by `npm run verify`, which fails the build. Do not work around them.

1. **Nothing unsourced ships.** Star ratings, review counts, BBB accreditation, financing terms,
   promotions, pricing — all gated in `src/data/claims.js`. Empty means the component does not
   render at all. The live site prints "$11,000–$14,000", "BBB A+", "400+ five-star reviews" and
   "25+ years"; none of it has been signed off, so none of it is here.
2. **Only three claims are always true:** licensed and insured · free, no-obligation inspections ·
   **25-year** workmanship warranty. Not "lifetime" — that is a materially bigger promise.
3. **Banned words** come from `brand/voice-spec.json` and include "guarantee" as an absolute
   promise, "cheapest", superlatives. The check greps the built HTML.
4. **Three addresses and four phone numbers exist.** They live in `src/data/markets.js`. A
   hard-coded number in a template is the bug this structure exists to prevent.
5. **Every page self-canonicals**, every URL ends in a trailing slash, and the sitemap lists only
   indexable pages. Since round 42 the same gate holds the SEO metadata too: every page has a title
   and a description, titles are ≤ 60 and descriptions ≤ 160 **measured after decoding HTML
   entities**, no two indexable pages share either, and every `og:image` resolves to a real file.
   14 pages are deliberately `noindex` — they are waiting on data, and a thin page that ranks is
   worse than a page that waits.
6. **Every page's schema is one `@graph`, and every `@id` in it resolves on that same page.** A
   reference a crawler would have to fetch another URL to resolve is a dangling reference. See
   `src/data/seo.js` — it owns every site-wide signal, and `npm run verify` gates all of it.
   `<lastmod>` and `dateModified` come from **git**, per page, from content sources only — never
   from the build clock. `scripts/build-lastmod.mjs` explains what is counted and what is not.

## Architecture

```
src/data/          the content. Markets, services, sub-services, locations, claims, partners.
                   seo.js owns the site-wide search signals; generated/ is written by scripts.
src/pages/         13 templates. Three markets are data, not three sites.
src/components/    shared sections. Hero, badge row, FAQ, CTA band, partner carousel…
src/styles/        tokens.css + ui-tokens.css are GENERATED (npm run tokens). base.css is not.
brand/             vendored from coldstream-os. See "Brand files" below.
scripts/           build-time generators and the gates. Read these before changing behaviour.
```

**Two design systems, and neither governs the other.**
- `--cs-web-*` is the **website**: Montserrat, sentence case, mid-navy hero, light-blue emphasis.
  Measured off `public/preview/cincinnati-market-landing.html`, the approved prototype.
- `--cs-*` type tokens are the **social** system: Saira Condensed caps, accent orange. They paint
  rendered social posts in the other repo and must not appear in this stylesheet.

An earlier round "corrected" the website onto the social system and it took a full round to undo.
If the two disagree, that is not a bug.

## Commands

```
npm run dev          # local
npm run build        # tokens + redirects + og card + icons + lastmod + llms.txt, then astro;
                     #   postbuild writes pagemap, /handoff/ and PAGES.md
npm run verify       # THE GATES. Run after every build. Green or it is not done.
npm run test:gates   # proves the gates fail when they should
npm run inventory    # 58 planned pages vs what built; extras must be named
npm run contracts    # data-shape checks for the Contractors Cloud / GBP pulls
npm run live:pull    # re-read the live WordPress copy into src/data/live-copy/
npm run brand:publish # push brand/ out to coldstream-os (this repo owns it)
npm run og           # regenerate public/og-default.jpg from the brand tokens (headless Chrome)
npm run icons        # regenerate the favicon set from the logo mark (headless Chrome)
npm run lastmod      # recompute per-page content dates from git → src/data/generated/lastmod.json
npm run llms         # regenerate public/llms.txt from markets/claims/sitemap
```

## What is done, and what is not

**Done:** all 75 pages build and pass all 31 gates. **The technical SEO and AI-readability layer
is finished** — rounds 41–46, DECISIONS §42–§52. What remains on that front is content and business
inputs, not engineering. Copy consolidated from the live site. Design
language matched to the prototype. Real partner logos on a rotating strip. National service pages
and `/service-areas/` with a Google map. The handoff site at `/handoff/`.

**Not done, in rough priority order:**
1. **Copy port — the conversion pages are what is left.** `/about-us/` was BUILT AND INDEXED
   2026-08-26: the three owners' profiles ported verbatim from the live site (team.js), values and
   the Hover note added, noindex lifted. `src/data/live-copy/` holds
   ~150k words pulled from the live site (`npm run live:pull`). Done since this list was written:
   the service hubs, the market landings (round 32) and all six sub-services, which now carry depth
   blocks — vinyl and Hardie shared, the other four per-market (rounds 33 and 37). `/about` and the
   conversion pages have not been ported.
2. **Gallery and reviews pages are empty and noindex** — waiting on the Contractors Cloud job pull
   (photos with consent) and the Google Business Profile review pull. `src/data/contracts.js` has
   the shapes both must satisfy. Nothing is invented in the meantime and nothing should be.
3. **The blog — 45 real posts sit on the live WordPress site and none of them is here.** They are
   the only informational content the domain owns, they cover the highest-intent queries in the
   trade ("how much does a roof replacement cost in Cincinnati"), and the competitor benchmark has
   69. Blocked on `site/data/live-urls.txt` — per-post traffic and backlinks — which is also the
   last `PENDING` in the 301 map. **⚠ `/blog/` COLLIDES AT CUTOVER**: this build ships an empty
   index at the same path WordPress serves 45 posts from. Leave `/blog/` with WordPress and do not
   upload `dist/blog/`. See DECISIONS §52.
4. **Layout and motion pass** — a gallery lightbox is the obvious missing modal.
5. ~~**Mobile overflow at 390px.**~~ **FIXED (round 35, 2026-08-19)** — measured scrollWidth 390
   against clientWidth 390 in headless Chrome at a true 390px viewport. The H1 was never the cause:
   the estimate CTA sat in the header row at ~200px, putting the row's minimum content at ~417px
   with no flex-wrap, so the document grew wider than the viewport and every section inherited it.
   The CTA moved into the mobile drawer. See DECISIONS §36.
6. **Open questions:** the Cincinnati number reads (513) 717-5462 in the prototype and
   (513) 258-0450 in the data. Round 42 found the public Facebook page printing (513) 258-0450 —
   a third source agreeing with the data against the prototype. Still not a formal sign-off,
   but nothing now backs the prototype number. The GAF certification tier has three conflicting
   sources. The hero video button was added but never formally approved.

   **Added 2026-08-24, from a public search while chasing the GBP URLs — all in `claims.js`:**
   **⚠ THE FOUNDING YEAR HAS THREE ANSWERS.** An Angi listing says established 2007, an Owens
   Corning profile says "over 20 years", the live site says "25+ years". If 2007 is right, "25+
   years" overstates by six years across ~20 live pages. **⚠ THE LISTINGS SAY COLDSTREAM DOES
   SOLAR** — installation, maintenance and monitoring — and nothing in this repo mentions solar at
   all. That is a question about the business, not a gap to fill from a directory. Also: two BBB
   URLs exist for the same profile ID (`/oh/cincinnati/` recorded, `/oh/milford/` returned by
   search), and the St. Louis Yelp listing carries a `-2` suffix, which is what Yelp does when a
   duplicate exists.

## The handoff

Production is **not** this host. The plan of record is Rambo serving the built HTML from the host
WordPress already runs on. `/handoff/` (built by `scripts/build-handoff.mjs`) walks that: upload,
put the 301 fragment **above** the WordPress rewrite block, stop WordPress routing these paths, cut
over, submit the sitemap. Redirects and pages go live in the same change — publishing the 301s
early points 273 rules at a 404.

## Brand files

`brand/tokens.json` and `brand/voice-spec.json` are **the originals. This repo is authoritative for
them.** A brand value changes here and nowhere else.

**This reversed on 2026-08-13.** coldstream-os used to hold the originals and `npm run brand:sync`
pulled them down; that script is deleted, because pulling now would overwrite the truth with a copy.
Older comments elsewhere may still describe the old direction — this section wins.

Downstream, `coldstream-os/design-systems/exteriors/` is a **vendored copy of these two files**.
`supabase/seed-brand.sh exteriors` loads that copy into the `content_portal_brands` table, and the
`render-post` edge function rasterises social and print assets from the **table, not the file**. So
a brand change reaches a rendered post only after both steps:

```
npm run brand:publish                 # here → coldstream-os/design-systems/exteriors/
./supabase/seed-brand.sh exteriors    # in coldstream-os: file → database
```

Publishing without seeding is the drift to watch for: the website repaints, the posts do not, and
every file on disk looks correct. `brand:publish` writes files only — it does not commit or seed.

The files stay committed here rather than imported because this repo has to build on a host that has
never heard of coldstream-os. Nothing in `npm run build` calls `brand:publish`.

## Working style this repo expects

- **Comments explain why, not what.** Most files open with the decision that produced them and the
  alternative that was rejected. Keep that up; it is the only reason the rules survive a handoff.
- **Generated files say so and are never hand-edited** — `tokens.css`, `ui-tokens.css`,
  `public/_redirects`, `pagemap.html`, `/handoff/`, `PAGES.md`.
- **`DECISIONS.md` is the log.** Every round appends what changed and what was deliberately not
  changed. A reversal gets written down as a reversal.
- **Gates are the contract.** If a change needs a gate relaxed, that is a decision to state out
  loud, not a line to quietly edit.
