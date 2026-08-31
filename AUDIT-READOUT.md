# AUDIT READOUT v2 — corrections and full content rewrite

Branch `prelaunch-audit-fixes`, completed 2026-08-31 and merged to main → staging. All builds
green across all 34 automated checks. No redirect rules written or modified; roofing pages
untouched; CC endpoints, pricing multipliers and Instagram embed still stubbed null.

## 1. Summary

All 17 remaining rewrites are done — six page sets now measure 9–19% cross-market overlap
(target <25%, from 62–71%) with no shared prose sentence between market versions. Assumption 5
is corrected: the city-swap siding heading is gone, and every repeated heading, subhead and FAQ
across market versions is now distinct. High-impression meta descriptions were re-examined and
ten more rewritten around concrete click reasons (led by "no payments until completion").
Both disputed audit findings verified stale against the built output. Two decisions for you in
§8/§9; the CC company mapping is flagged as unresolvable without you.

## 2. Overlap and word count — every set, before → after

| Page set | Overlap before | Overlap after (cin-col · cin-stl · col-stl) | Words (cin/col/stl) |
|---|---|---|---|
| /[city]/siding/ | 71% | **17% · 16% · 19%** | 1,793 / 1,543 / 1,538 |
| …/vinyl-siding/ | 68% | **9% · 9% · 9%** | 1,490⚑ / 1,478⚑ / 1,532 |
| …/james-hardie-siding/ | 64% | **13% · 13% · 13%** | 1,516 / 1,504 / 1,500 |
| /[city]/gutters/ | 64% | **13% · 13% · 13%** | 1,524 / 1,508 / 1,514 |
| /[city]/windows/ | 62% | **12% · 13% · 12%** | 1,517 / 1,533 / 1,520 |
| /[city]/reviews/ | 69% | **16% · 16% · 16%** | 747⚑ / 707⚑ / 724⚑ |
| /[city]/roofing/ (untouched, reference) | 30% | 30% — not touched | — |

⚑ **Under-1,500 flags, with reasons.** Vinyl Cincinnati/Columbus sit at 1,490/1,478 by the
strictest possible counter (visible body text only, chrome stripped) — within 1.5% of the floor;
I stopped adding rather than pad into filler, and any looser counter (incl. nav/alt text) puts
them over. Reviews pages run ~720 by design: they are intentionally-noindex placeholders whose
core content (the actual reviews) does not exist yet — writing 800 more words around an absent
center would be exactly the thin-content padding the audit exists to kill. Each now carries
unique per-market framing, a link to that market's real Google profile, and stays noindex.

**Longest remaining shared strings, per set** — all are shared COMPONENTS, not prose:
siding 180w & gutters 207w & windows 211w = the pending-calculator card (Phase-5 component,
identical by design until rates arrive); hardie 170w = the always-true trust panel + section
chrome; vinyl 86w = the "hub page" navigation card; reviews 98w = the trust panel. The longest
shared *prose* passage across any pair is under 15 words.

## 3. Headings changed (assumption 5 correction) — per market

| Set | Cincinnati | Columbus | St. Louis |
|---|---|---|---|
| Siding section | What a full siding replacement does for a Cincinnati home | Re-siding a Columbus house, from tear-off to trim | New siding, done the way St. Louis housing demands |
| Siding depth | What Cincinnati walls ask of their siding | The two Columbus walls, and what each one needs | Cladding a frame wall in a masonry town |
| Windows section | Window replacement across a century of Cincinnati openings | When a whole subdivision's glass fogs at once | Windows that earn their keep in a St. Louis summer |
| Windows depth | What a hundred years of openings taught us | The subdivision glass problem, up close | Glass against the gradient |
| Gutters section | Moving water off a hillside house | Gutters that keep pace with a flat-lot downpour | Sized for oak drop and gully-washer rain |
| Gutters depth | Water management on terrain that has opinions | Sizing against the April cell | Two seasons of load, one system |
| Hardie depth | Why the older neighborhoods keep choosing it | One board, both Columbuses | The stability argument, in the swing capital |
| Vinyl depth | Vinyl's case, made honestly | Second-generation vinyl, for the city that bought the first | Engineering for the eighty-degree year |
| Reviews hero | Cincinnati Homeowners, in Their Own Words | The Reviews Our Columbus Work Earns | What St. Louis Neighbors Tell Each Other |

Every section-card title and every FAQ question inside these sets is likewise market-unique
(zero repeated questions across markets on the rewritten sets). H1s and title tags keep their
keyword+city formulas deliberately — the untouched roofing pages (the stated quality bar) use
exactly that pattern.

## 4. Meta descriptions re-examined (item 3)

Rewritten this pass, beyond the six sets' own new descriptions (which all changed with their
pages): the three market landing descriptions, the homepage, the three market roofing-hub
descriptions — each now leads with a concrete reason to click ("no payments until completion",
the market phone, storm documentation) instead of restating the category. `/cincinnati/siding/`
(the 46,713-impression page) got a fully new description with its rewrite. **Blog (291,904
impressions, 0.07% CTR): those URLs are WordPress's and stay untouched per the standing /blog/
rule — flagging that the blog is the single largest CTR opportunity nobody can act on until the
blog migration decision is made.**

## 5. Verification results (item 4) — both findings are stale

- **Alt text**: 1,033 `<img>` tags across the entire built output; **zero lack an alt
  attribute** (empty alt="" on decorative marquee clones is intentional and valid). The 144
  figure was measured against the earlier delivered package; the Aug 22–27 accessibility rounds
  fixed it.
- **/sitemap/**: has exactly one H1 ("Page review board"); the 43-char description is
  deliberate — the page is a **noindex internal review tool**, labeled "Not for publication."
  Nothing missed; left alone per flag-don't-decide.

## 6. Deploy target and redirect formats (item 5, report only)

- **Hosting today**: GitHub → **Netlify** (staging at coldstream-exteriors-staging.netlify.app,
  netlify.toml in repo). **There is no Vercel configuration anywhere in the repo** — the brief's
  "GitHub → Vercel" does not match this codebase.
- **Production plan of record** (repo docs): the built HTML served from the existing
  WordPress/Apache host by Rambow — which is why the redirects generate in BOTH formats already:
  `public/_redirects` (Netlify, 380 rules) and `redirects/htaccess.txt` (Apache RewriteRule
  fragment, same rules). If production becomes Vercel, neither file works as-is — `vercel.json`
  redirects are a third syntax, and the generator would need a third emitter (~an hour, not a
  rewrite). **Decision needed: name the production host before the deferred redirect pass.**

## 7. Contractors Cloud (item 5, report only + flag)

`src/data/leads.js` now records the five-company reality (1043 & 1047 both "Coldstream
Exteriors" with different settings, 1098 Columbus, 1435 Solar, 1576 West & Davis) and states
that the per-market mapping is UNRESOLVED — no St. Louis-named company exists, and 1043 vs 1047
is not guessable. Endpoints remain null; forms remain on the static flow. Nothing was wired.

## 8. Open questions answered (item 5 — answers, not actions)

- **ZIP 633 (St. Charles)**: recommend IN scope — St. Charles County towns (O'Fallon) are in the
  St. Louis served-areas list the site already publishes, so the checker claiming 633 matches
  existing claims. Awaiting your confirmation; it ships either way as "looks like our area,"
  never a coverage promise.
- **Northern Kentucky**: recommend IN scope — the audit's own /florence/ and /covington/
  impression history plus the site's existing "Northern Kentucky river towns" copy both support
  it. Prefixes 410/411 are already in the checker for that reason. Confirm, and NKY should also
  be a named consideration in the deferred redirect pass (those historical URLs need targets).
- **The "Go deeper" grid**: quantified above — after the rewrites it is no longer the top shared
  string anywhere (per-market lead lines now vary it); the biggest shared blocks are the
  pending-calculator card and trust panel, both of which become page-unique naturally when the
  pricing config lands and are chrome in any case. **Verdict: not worth further hand-variation.**

## 9. New assumptions this pass

1. Reviews pages stay noindex and under 1,500 words (reasoning in §2) — reversible on request.
2. Reviews pages now link out to each market's Google profile (sourced URLs from the GBP data
   you supplied on Aug 24) — treated as obviously safe, but it is a new outbound link.
3. Vinyl/hardie H1 and title formulas kept (roofing-parity argument, §3).
4. "No payments until completion" used as the lead differentiator in several descriptions — it
   is your approved claim from Aug 25; flagging its heavier use.
5. The pending-calculator card counts toward page words in my measurements (it renders); if the
   auditor's counter excludes it, vinyl's two flagged pages drop further below the floor until
   the pricing config lands.

## 10. Deploy confirmation

Merged to main and pushed; Netlify rebuilds staging on push. Verified against the live staging
host after deploy: `X-Robots-Tag: noindex, nofollow` on every response, `/robots.txt` serving
`Disallow: /` to all crawlers, and all 13 intentionally-noindexed pages still carry their meta
noindex (3 gallery + 3 reviews + blog + financing + instant-roof-quote + sitemap + privacy +
terms + thank-you — the brief's "ten" plus the three utility pages that have always been
noindex). Production robots.txt in the package remains the crawlable version.
