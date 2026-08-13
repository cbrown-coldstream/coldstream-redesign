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
https://coldstream-exteriors-staging.netlify.app (noindex, review only). Production is the
existing WordPress host — see "The handoff" below.

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
   indexable pages. 12 pages are deliberately `noindex` — they are waiting on data, and a thin
   page that ranks is worse than a page that waits.

## Architecture

```
src/data/          the content. Markets, services, sub-services, locations, claims, partners.
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
npm run build        # build + redirects + tokens; postbuild writes pagemap, /handoff/ and PAGES.md
npm run verify       # THE GATES. Run after every build. Green or it is not done.
npm run test:gates   # proves the gates fail when they should
npm run inventory    # 58 planned pages vs what built; extras must be named
npm run contracts    # data-shape checks for the Contractors Cloud / GBP pulls
npm run live:pull    # re-read the live WordPress copy into src/data/live-copy/
npm run brand:sync   # re-pull brand/ from coldstream-os
```

## What is done, and what is not

**Done:** all 67 pages build and pass every gate. Copy consolidated from the live site. Design
language matched to the prototype. Real partner logos on a rotating strip. National service pages
and `/service-areas/` with a Google map. The handoff site at `/handoff/`.

**Not done, in rough priority order:**
1. **Sub-service and market/location copy port.** `src/data/live-copy/` holds ~150k words pulled
   from the live site (`npm run live:pull`). The service hubs have been ported; the 18 sub-service
   pages, the market landings, `/about`, and the conversion pages have not.
2. **Gallery and reviews pages are empty and noindex** — waiting on the Contractors Cloud job pull
   (photos with consent) and the Google Business Profile review pull. `src/data/contracts.js` has
   the shapes both must satisfy. Nothing is invented in the meantime and nothing should be.
3. **Layout and motion pass** — a gallery lightbox is the obvious missing modal.
4. **Mobile overflow at 390px.** The header row does not wrap, so the H1 runs off the right edge.
   Pre-existing and inherited from the prototype; it is a real bug and it is not fixed.
5. **Open questions:** the Cincinnati number reads (513) 717-5462 in the prototype and
   (513) 258-0450 in the data — unconfirmed. The GAF certification tier has three conflicting
   sources. The hero video button was added but never formally approved.

## The handoff

Production is **not** this host. The plan of record is Rambo serving the built HTML from the host
WordPress already runs on. `/handoff/` (built by `scripts/build-handoff.mjs`) walks that: upload,
put the 301 fragment **above** the WordPress rewrite block, stop WordPress routing these paths, cut
over, submit the sitemap. Redirects and pages go live in the same change — publishing the 301s
early points 273 rules at a 404.

## Brand files

`brand/tokens.json` and `brand/voice-spec.json` are **vendored copies**. The originals live in the
**coldstream-os** repo at `design-systems/exteriors/`, where a `render-post` edge function reads
them to rasterise social and print assets. That repo is authoritative: change a brand value there,
then `npm run brand:sync` here. They are committed rather than imported because this repo has to
build on a host that has never heard of coldstream-os.

## Working style this repo expects

- **Comments explain why, not what.** Most files open with the decision that produced them and the
  alternative that was rejected. Keep that up; it is the only reason the rules survive a handoff.
- **Generated files say so and are never hand-edited** — `tokens.css`, `ui-tokens.css`,
  `public/_redirects`, `pagemap.html`, `/handoff/`, `PAGES.md`.
- **`DECISIONS.md` is the log.** Every round appends what changed and what was deliberately not
  changed. A reversal gets written down as a reversal.
- **Gates are the contract.** If a change needs a gate relaxed, that is a decision to state out
  loud, not a line to quietly edit.
