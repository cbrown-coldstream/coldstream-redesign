# SEO gap audit — live site vs. the 67-page build

Owner brief 2026-08-24, §11. The consolidation from 443 → 67 pages was correct; this checks
nothing worth ranking for was dropped with the duplication. **No pages were created in this
round** — every "own page" recommendation below waits on Craig's approval.

**The page test still applies to every row:** a page that cannot say something only it could say
becomes a section, not a page.

Verified alongside this audit, by the standing gates: every retired URL has a redirect target,
no chains, no loops, no redirect into a noindex-for-content page, and internal linking depth from
the homepage did not increase (every indexable page remains ≤ 3 clicks).

| Live surface | What it ranks / matters for | Recommendation |
|---|---|---|
| **James Hardie Siding** (`/{market}/siding/james-hardie-siding/`) | Brand-term demand ("james hardie installer near me") | **Already own pages** — the brief's "currently folded into Siding" predates the build: `/siding/james-hardie-siding/` plus all three market variants exist, carry depth copy, and sit in the nav dropdown. The live James Hardie **Alliance ELITE** badge found during the photo scrape corroborates the `james-hardie-elite` credential badges.js already shows. **No action.** |
| **Roof types** — asphalt shingle, metal, TPO, EPDM, PVC, flat, impact-resistant (`/{market}/roof-types/*`) | Material-term searches; the copy genuinely differs per material | **Split decision.** *Asphalt vs. metal vs. impact-resistant*: sections on `/roofing/` today (the round-48 depth block covers material matching); an own `/roofing/materials/` page is defensible if Craig wants the material terms targeted — the copy differs enough to pass the page test. *TPO / EPDM / PVC / flat*: *commercial* material terms — they belong under `/commercial-roofing/` as sections, not as homeowner pages. |
| **Commercial roofing sub-pages** — multi-family, HOA & community, industrial, coatings, flat systems, inspections | B2B queries with real intent, low volume | **Sections on `/commercial-roofing/`** (some already exist as cards). Commercial buyers do not search by sub-service at volume that earns seven pages; one strong page was the plan's own ruling. Revisit only if the commercial pipeline becomes a priority. |
| **Garage doors** (live St. Louis market only) | "garage door replacement st louis" | **Keep as the St. Louis service it is** — `garage-doors` is already in the St. Louis services array and folds correctly. An own sub-page only if the business confirms the line is staying; it is one market and one trade. |
| **Insurance claim assistance / hail damage / wind damage** (`/{market}/residential-roofing/…`) | High-intent storm queries | **Sections, confirmed not orphaned**: national `/storm-damage/` + per-market `/{market}/roofing/insurance-storm-damage/` carry this copy, every live URL 301s to one of them, and the nav's standalone Storm Damage item routes market-aware. **No action.** |
| **`/blog/`** — 45 unique live posts | The only informational rankings the domain has; 6 cost posts are the highest-intent pages it owns | **Preserve on WordPress at cutover** (handoff already instructs this — an empty `/blog/` must not be uploaded). Then triage keep/fold/kill on the per-post traffic + backlink export (`site/data/live-urls.txt`, still missing), port keepers into the new design. DECISIONS §52 has the full plan. |
| **Hover 3D rendering / satellite section** (live roofing pages) | Engagement feature, "see your roof" | **Port only with reframing, if at all.** Craig has said explicitly we do **not** estimate from satellite imagery — the trust rewrite says so on the homepage. If this returns it must be framed as a **visualisation tool used after the in-person inspection**, never as a substitute for one. Recommend: leave out until the tool actually exists in the stack. |
| **Solar** (`coldstreamsolar.com`, linked from the live utility bar) | Cross-brand referral; an Owens Corning profile lists Coldstream as doing solar | **Keep a footer link, decision Craig's.** It is an external brand, so it costs one line in the footer's Company column. The bigger open question is in claims.js: directories say Coldstream sells solar and this site never mentions it — that is a business question before it is an SEO one. |
| **Neighbourhood pages** (100+ live) | The pattern the rebuild exists to remove | **Redirect only** — already done, 273 rules. Town pages return only when earned by real completed work (the Contractors Cloud gate). No change. |
| **Per-market instant-roof-quote pages** | CTA landing surface | **Redirect only** (already 301 → `/free-estimate/`); repoint to `/instant-roof-quote/?market=` the day the Roofful embed lands. |

## Recommended approvals to request from Craig

1. **`/roofing/materials/`** (own page, national + optionally per market): the one genuine gap where
   material-term searches (metal roof, impact-resistant shingles) have no dedicated surface. Copy
   genuinely differs per material — passes the page test.
2. **Blog URL export** (`site/data/live-urls.txt` with traffic + backlinks): unblocks the last
   `PENDING` in the redirect map *and* the blog triage.
3. **Solar footer link**: yes/no.

Everything else above is either already covered, already redirected, or recommended against with
the reasoning stated.
