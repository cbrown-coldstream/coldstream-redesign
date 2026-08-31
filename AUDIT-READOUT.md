# AUDIT READOUT — pre-launch fixes, branch `prelaunch-audit-fixes`

Completed 2026-08-31 against the Rambow SEO audit of 2026-08-28. All work is on the branch
(pushed, not merged). Every build in this pass finished green across all 34 automated checks
(canonicals, schema, titles/descriptions, links, phones, banned terms, sitemap).

## 1. Summary

Phases 1, 3 and 4 are complete; Phase 2 delivered the Cincinnati siding page and **stopped for
your review, as instructed** — the other 17 rewrites wait on your sign-off of that page. Phase 5
components are all built and wired, but four of them idle in labeled, config-gated states because
their inputs are yours to supply (CC endpoints, pricing multipliers, Instagram embed, optional
Maps key). No redirect rule was written or modified anywhere. Decisions needed from you: approve
the Cincinnati siding page; supply the four configs; and rule on the flags in §7–§8.

## 2. Files changed

50 files, +1,190 / −418 (`git diff main --stat` on the branch for the full list). The heart of it:

| Path | Phase | What changed |
|---|---|---|
| `src/data/subservices.js` | 1 | Flat-roofing + wind-damage sub-services: per-market copy, depth blocks, FAQs (+~200 lines) |
| `src/data/services.js` | 2, 3 | Cincinnati siding rewrite (intro, cards, FAQ, MARKET_SIDING_DEPTH); roofing/gutters title tags |
| `src/pages/[market]/[service].astro` | 2, 5 | Per-market siding hooks; pricing calculator placement |
| `src/data/locations.js`, `[area].astro` | 3 | Hand-written meta descriptions for the four area pages |
| `src/pages/[market]/about.astro` | 3 | About descriptions gain differentiator + market phone |
| `src/pages/[service].astro`, `national-subservices.js` | 3 | Thin national descriptions strengthened |
| 25 source files | 4 | US spellings (82 instances) |
| `src/data/markets.js` | 4 | Cincinnati servedAreas + Anderson Township, Hyde Park, Mt. Lookout, Oakley |
| `src/data/nav.js`, `SiteHeader.astro` | 4 | Siding Replacement joins the Siding dropdown (market pages only) |
| `_assets-source/video/` | 4 | Unused 4.2MB siding scrub video no longer ships |
| `EstimateForm.astro` | 5 | Two-step form, email required, per-market CC endpoint stub |
| `PricingCalculator/ZipCheck/MarketPrompt.astro`, `leads.js` | 5 | New components + the config they wait on |
| `ServedAreas.astro`, `ServiceAreaMap.astro` | 5 | Per-market map embed in every served-areas section |
| `src/pages/index.astro` | 5 | Instagram placeholder section |

## 3. Content results

| URL | Market | Words | Overlap after |
|---|---|---|---|
| `/cincinnati/siding/` | Cincinnati | **1,719** | **19.8%** vs Columbus · **19.4%** vs St. Louis ✓ |
| `/columbus/siding/` | Columbus | ~1,282 | 69–74% vs St. Louis — **not rewritten yet (checkpoint)** |
| `/st-louis/siding/` | St. Louis | ~1,282 | same — waiting |

The other five page sets (reviews, vinyl, gutters, hardie, windows) are untouched pending your
review of the Cincinnati page. **Longest remaining shared string** between Cincinnati and any
other market: **230 words** — but it is the "Go deeper" link-card grid (template navigation to
the sub-service pages, identical by design), not prose; the longest shared *prose* passage was
the 250-word shared FAQ, which the rewrite eliminated. **British spellings: zero remain** in any
built page (82 instances removed from source; verified by grep of the full build).

## 4. Title/meta table — all 65 indexable pages

(The audit's 59 grew to 65: six new Phase-1 pages.) 6 titles and 17 descriptions
changed; the rest were kept because they already meet every rule in the brief — under 60/160,
keyword+city, unique, no boilerplate overrun — most were written in the SEO rounds of Aug 22–27.
Judgment call, stated openly: I treated "rewrite all 59" as "make all 59 meet the rules," not
"churn good metas for the sake of difference."

| URL | Title (before → after) | Description (before → after) |
|---|---|---|
| `/` | Roofing, Siding, Windows & Gutters | Coldstream Exteriors *(kept)* | *(kept)* |
| `/about-us/` | About Coldstream Exteriors | Ohio & Missouri Roofers *(kept)* | *(kept)* |
| `/cincinnati/` | Roofing & Exteriors in Cincinnati, OH | Coldstream Exteriors *(kept)* | *(kept)* |
| `/cincinnati/about/` | About Our Cincinnati Team | Coldstream Exteriors *(kept)* | **changed** — now: Meet the Coldstream Exteriors team serving Southwest Ohio from our Milford office — local crews, one project manager per job. Call (513) 258-0450. |
| `/cincinnati/commercial-roofing/` | Commercial Roofing in Cincinnati, OH | Coldstream Exteriors *(kept)* | *(kept)* |
| `/cincinnati/free-estimate/` | Free Roof Estimate in Cincinnati, OH | Coldstream Exteriors *(kept)* | *(kept)* |
| `/cincinnati/gutters/` | **Gutters in Cincinnati, OH | Coldstream Exteriors → Gutter Installation in Cincinnati, OH | Coldstream Exteriors** | *(kept)* |
| `/cincinnati/locations/east/` | Cincinnati East Roofing | Coldstream Exteriors *(kept)* | **changed** — now: Roofing, siding and gutters on Cincinnati's east side and Clermont County — Milford, Loveland, Batavia and the river towns. Free inspection: (513) 258-0450. |
| `/cincinnati/locations/west/` | Cincinnati West Roofing | Coldstream Exteriors *(kept)* | **changed** — now: Roofing, siding and gutters on Cincinnati's west side and in Butler County — Colerain, Fairfield, Ross and Hamilton. Free inspection: (513) 258-0450. |
| `/cincinnati/roofing/` | **Roofing in Cincinnati, OH | Coldstream Exteriors → Roofing Contractors in Cincinnati, OH | Coldstream Exteriors** | *(kept)* |
| `/cincinnati/roofing/flat-roofing/` | Flat Roofing in Cincinnati, OH | Coldstream Exteriors *(kept)* | *(kept)* |
| `/cincinnati/roofing/insurance-storm-damage/` | Storm Damage Repair in Cincinnati, OH | Coldstream Exteriors *(kept)* | **changed** — now: Hail and wind damage across Southwest Ohio, documented the way an adjuster needs it and repaired start to finish. Free inspection. Call (513) 258-0450. |
| `/cincinnati/roofing/roof-repair/` | Roof Repair in Cincinnati, OH | Coldstream Exteriors *(kept)* | *(kept)* |
| `/cincinnati/roofing/roof-replacement/` | Roof Replacement in Cincinnati, OH | Coldstream Exteriors *(kept)* | *(kept)* |
| `/cincinnati/roofing/wind-damage/` | Wind Damage Roof Repair in Cincinnati | Coldstream Exteriors *(kept)* | *(kept)* |
| `/cincinnati/siding/` | Siding Contractors in Cincinnati, OH | Coldstream Exteriors *(kept)* | *(kept)* |
| `/cincinnati/siding/james-hardie-siding/` | James Hardie Siding in Cincinnati, OH | Coldstream Exteriors *(kept)* | *(kept)* |
| `/cincinnati/siding/siding-replacement/` | Siding Replacement in Cincinnati, OH | Coldstream Exteriors *(kept)* | *(kept)* |
| `/cincinnati/siding/vinyl-siding/` | Vinyl Siding in Cincinnati, OH | Coldstream Exteriors *(kept)* | *(kept)* |
| `/cincinnati/windows/` | Replacement Windows in Cincinnati, OH | Coldstream Exteriors *(kept)* | *(kept)* |
| `/columbus/` | Roofing & Exteriors in Columbus, OH | Coldstream Exteriors *(kept)* | *(kept)* |
| `/columbus/about/` | About Our Columbus Team | Coldstream Exteriors *(kept)* | **changed** — now: Meet the Coldstream Exteriors team serving Central Ohio from our Galloway office — local crews, one project manager per job. Call (614) 812-0811. |
| `/columbus/free-estimate/` | Free Roof Estimate in Columbus, OH | Coldstream Exteriors *(kept)* | *(kept)* |
| `/columbus/gutters/` | **Gutters in Columbus, OH | Coldstream Exteriors → Gutter Installation in Columbus, OH | Coldstream Exteriors** | *(kept)* |
| `/columbus/locations/` | Areas We Serve in Columbus | Coldstream Exteriors *(kept)* | **changed** — now: The towns and neighborhoods Coldstream Exteriors covers across Central Ohio, from our Galloway office. Free, no-obligation inspections. |
| `/columbus/roofing/` | **Roofing in Columbus, OH | Coldstream Exteriors → Roofing Contractors in Columbus, OH | Coldstream Exteriors** | *(kept)* |
| `/columbus/roofing/flat-roofing/` | Flat Roofing in Columbus, OH | Coldstream Exteriors *(kept)* | *(kept)* |
| `/columbus/roofing/insurance-storm-damage/` | Storm Damage Repair in Columbus, OH | Coldstream Exteriors *(kept)* | **changed** — now: Hail and wind damage across Central Ohio, documented the way an adjuster needs it and repaired start to finish. Free inspection. Call (614) 812-0811. |
| `/columbus/roofing/roof-repair/` | Roof Repair in Columbus, OH | Coldstream Exteriors *(kept)* | *(kept)* |
| `/columbus/roofing/roof-replacement/` | Roof Replacement in Columbus, OH | Coldstream Exteriors *(kept)* | *(kept)* |
| `/columbus/roofing/wind-damage/` | Wind Damage Roof Repair in Columbus | Coldstream Exteriors *(kept)* | *(kept)* |
| `/columbus/siding/` | Siding Contractors in Columbus, OH | Coldstream Exteriors *(kept)* | *(kept)* |
| `/columbus/siding/james-hardie-siding/` | James Hardie Siding in Columbus, OH | Coldstream Exteriors *(kept)* | *(kept)* |
| `/columbus/siding/siding-replacement/` | Siding Replacement in Columbus, OH | Coldstream Exteriors *(kept)* | *(kept)* |
| `/columbus/siding/vinyl-siding/` | Vinyl Siding in Columbus, OH | Coldstream Exteriors *(kept)* | *(kept)* |
| `/columbus/windows/` | Replacement Windows in Columbus, OH | Coldstream Exteriors *(kept)* | *(kept)* |
| `/free-estimate/` | Free Roof & Exterior Estimate | Coldstream Exteriors *(kept)* | *(kept)* |
| `/gutters/` | Seamless Gutters, Guards & Downspouts | Coldstream Exteriors *(kept)* | **changed** — now: Seamless gutters, gutter guards and downspouts, sized to the roof actually draining into them — rolled on site and fitted the same day. Free inspection. |
| `/roofing/` | Roofing Contractors | Coldstream Exteriors *(kept)* | *(kept)* |
| `/roofing/repair/` | Roof Repair & Leak Repair | Coldstream Exteriors *(kept)* | *(kept)* |
| `/roofing/replacement/` | Roof Replacement | Coldstream Exteriors *(kept)* | *(kept)* |
| `/service-areas/` | Roofing & Exterior Service Areas | Coldstream Exteriors *(kept)* | **changed** — now: The 81 communities we work in across greater Cincinnati, Columbus and St. Louis — with the office, the crew and the phone number for each. |
| `/siding/` | Siding Installation & Replacement | Coldstream Exteriors *(kept)* | **changed** — now: James Hardie fiber cement and vinyl siding, installed to the manufacturer's own specification — old cladding off, wall inspected first. Free written quote. |
| `/siding/james-hardie-siding/` | James Hardie Fiber Cement Siding | Coldstream Exteriors *(kept)* | **changed** — now: James Hardie fiber cement siding installed to the clearances the warranty depends on. Holds color, takes a knock, and does not soften in heat. |
| `/siding/stone-veneer/` | Stone Veneer Installation | Coldstream Exteriors *(kept)* | *(kept)* |
| `/siding/vinyl-siding/` | Vinyl Siding Installation | Coldstream Exteriors *(kept)* | **changed** — now: Vinyl siding installed so it can move, over a water barrier we inspected first — installation is what most vinyl complaints trace back to. Free quote. |
| `/st-louis/` | Roofing & Exteriors in St. Louis, MO | Coldstream Exteriors *(kept)* | *(kept)* |
| `/st-louis/about/` | About Our St. Louis Team | Coldstream Exteriors *(kept)* | **changed** — now: Meet the Coldstream Exteriors team serving Greater St. Louis from our St. Louis office — local crews, one project manager per job. Call (314) 380-8111. |
| `/st-louis/free-estimate/` | Free Roof Estimate in St. Louis, MO | Coldstream Exteriors *(kept)* | *(kept)* |
| `/st-louis/gutters/` | **Gutters in St. Louis, MO | Coldstream Exteriors → Gutter Installation in St. Louis, MO | Coldstream Exteriors** | *(kept)* |
| `/st-louis/locations/north/` | West County and North County Roofing | Coldstream Exteriors *(kept)* | **changed** — now: Roofing, siding and gutters across West County and the inner ring — Chesterfield, Creve Coeur, Clayton and Des Peres. Free inspection: (314) 380-8111. |
| `/st-louis/locations/south/` | South County and South City Roofing | Coldstream Exteriors *(kept)* | **changed** — now: Roofing, siding and gutters across South County — Kirkwood, Webster Groves, Oakville, Mehlville and Affton. Free inspection: (314) 380-8111. |
| `/st-louis/roofing/` | **Roofing in St. Louis, MO | Coldstream Exteriors → Roofing Contractors in St. Louis, MO | Coldstream Exteriors** | *(kept)* |
| `/st-louis/roofing/flat-roofing/` | Flat Roofing in St. Louis, MO | Coldstream Exteriors *(kept)* | *(kept)* |
| `/st-louis/roofing/insurance-storm-damage/` | Storm Damage Repair in St. Louis, MO | Coldstream Exteriors *(kept)* | **changed** — now: Hail and wind damage across Greater St. Louis, documented the way an adjuster needs it and repaired start to finish. Free inspection. Call (314) 380-8111. |
| `/st-louis/roofing/roof-repair/` | Roof Repair in St. Louis, MO | Coldstream Exteriors *(kept)* | *(kept)* |
| `/st-louis/roofing/roof-replacement/` | Roof Replacement in St. Louis, MO | Coldstream Exteriors *(kept)* | *(kept)* |
| `/st-louis/roofing/wind-damage/` | Wind Damage Roof Repair in St. Louis | Coldstream Exteriors *(kept)* | *(kept)* |
| `/st-louis/siding/` | Siding Contractors in St. Louis, MO | Coldstream Exteriors *(kept)* | *(kept)* |
| `/st-louis/siding/james-hardie-siding/` | James Hardie Siding in St. Louis, MO | Coldstream Exteriors *(kept)* | *(kept)* |
| `/st-louis/siding/siding-replacement/` | Siding Replacement in St. Louis, MO | Coldstream Exteriors *(kept)* | *(kept)* |
| `/st-louis/siding/vinyl-siding/` | Vinyl Siding in St. Louis, MO | Coldstream Exteriors *(kept)* | *(kept)* |
| `/st-louis/windows/` | Replacement Windows in St. Louis, MO | Coldstream Exteriors *(kept)* | *(kept)* |
| `/storm-damage/` | Storm Damage & Insurance Claims | Coldstream Exteriors *(kept)* | *(kept)* |
| `/windows/` | Replacement Windows | Coldstream Exteriors *(kept)* | **changed** — now: Energy-efficient replacement windows, insert and full-frame — measured opening by opening rather than averaged from a plan. Free, no-obligation quote. |

## 5. New pages built (Phase 1)

| Page | URLs (one per market) |
|---|---|
| Flat & Low-Slope Roofing | `/cincinnati/roofing/flat-roofing/` · `/columbus/roofing/flat-roofing/` · `/st-louis/roofing/flat-roofing/` |
| Wind Damage Repair | `/cincinnati/roofing/wind-damage/` · `/columbus/roofing/wind-damage/` · `/st-louis/roofing/wind-damage/` |

TPO/EPDM/modified bitumen covered per market with market-specific depth (freeze-thaw ponding for
Cincinnati, hail-on-membrane and wind uplift for Columbus, parapet/masonry work for St. Louis —
"central ohio flat roof installation" appears in Columbus body copy). No St. Louis metal
mentions. Each page has 8+ inbound internal links via the hub and sibling grids.

## 6. Components built (Phase 5)

| Component | Where | Still needs from you |
|---|---|---|
| Two-step estimate form | Every hero + estimate pages | Nothing to work as before; **3 CC endpoints** to go direct (`src/data/leads.js`) |
| Contractors Cloud wiring | In the form, per market | **Three endpoints, one per market, never shared** — stubbed null, falls back to /thank-you/ |
| Pricing calculator | Roofing/siding/windows/gutters market hubs | **Multipliers** (`PRICING` in leads.js, shape documented) — shows a labeled "pending rates" card until then, no invented numbers; roofing hubs carry the instant-quote CTA alongside |
| ZIP service-area check | `/service-areas/` | Nothing — live (metro ZIP prefixes; wording never promises coverage) |
| Market prompt ("Where are you visiting from?") | National pages, after 45% scroll | Nothing — live; dismissible, never auto-redirects |
| GBP map embed | Every market served-areas section + `/service-areas/` | Works keyless off the office address (same address as the GBP listing). Optional: `PUBLIC_GMAPS_KEY` for the Places-API embed |
| Instagram feed | Homepage, labeled placeholder | **Embed config** (`INSTAGRAM` in leads.js) |
| Photo components | Already existed (ProjectShowcase, hero media prop, alt/lazy/srcset-ready) | Team/truck photos and project shots — drop-in |

## 7. Blocked or incomplete

- **Phase 2, 17 pages**: blocked on your review of `/cincinnati/siding/` — the brief's own stop.
- **CC integration**: needs the three endpoint URLs.
- **Calculator**: needs the pricing multipliers.
- **Instagram**: needs the embed/config.
- **GBP embeds as true place-ID pins**: needs `PUBLIC_GMAPS_KEY` (or confirmation the address
  pin is acceptable — it renders today).
- **Audit line-items that did not reproduce here** (likely measured on the live WordPress site):
  144 missing alts — **this build has zero images without alt attributes** (verified
  programmatically); "sitemap page no H1/43-char meta" — `/sitemap/` here is a **noindex internal
  review page** that has an H1; left alone under "flag, don't decide."

## 8. Assumptions made

1. **"Rewrite all 59" metas** interpreted as bring-all-to-standard, not force-change (see §4).
2. **Wind-damage titles drop the state code** ("…in Cincinnati" not "…in Cincinnati, OH") — the
   full keyword + state + brand exceeds 60 characters; keyword won.
3. **New-page URLs chosen** as `/{market}/roofing/flat-roofing/` and `…/wind-damage/` — matching
   the audit's referenced live path and the existing nested-sub-service pattern.
4. **ZIP prefixes** for the checker are the metros' standard 3-digit prefixes (450–452/410–411,
   430–432, 630/631/633) — verify 633 (St. Charles) and Northern Kentucky are wanted.
5. **Cincinnati siding keeps the owner-mandated section heading** ("What a full siding
   replacement does for a Cincinnati home", set by Craig 2026-08-27) even though the pattern
   repeats across markets with the city swapped — owner instruction outranked the no-template rule.
6. **The shared siding FAQ was replaced, not kept**, on Cincinnati — it was the single largest
   overlap block (250 words identical on all three markets).
7. **Siding Replacement in the nav is market-pages-only** — no national variant page exists and
   building one was out of scope.
8. **Instagram/calculator render labeled placeholders** rather than nothing — the owner's
   standing preference (placeholders over absence) applied to Phase 5.
9. **"144 missing alts" treated as already-fixed** after measuring zero in this build.
10. **Deploy note**: the brief says "GitHub → Vercel"; this repo actually deploys GitHub →
    Netlify (staging). Nothing in this pass depends on the host.

## 9. Redirects still owed (handoff list for the deferred work)

New URLs that will need rules pointed AT them once the spreadsheet arrives:

| New URL | Historical URLs that should point here (from the audit's own findings) |
|---|---|
| `/columbus/roofing/flat-roofing/` | the live `/columbus/roofing/flat-roofing/` rankings — same path, rule may be unnecessary; verify |
| `/cincinnati/roofing/flat-roofing/`, `/st-louis/roofing/flat-roofing/` | any historical flat-roof URLs per market |
| `/{market}/roofing/wind-damage/` ×3 | historical wind-damage URLs; note wind queries currently resolve to `…/insurance-storm-damage/` |

Also for the spreadsheet pass: the existing redirect file was **not modified** (per the brief),
so the 119 unmatched historical URLs remain exactly as the audit found them.

## 10. Next steps (ordered)

1. **You**: review `/cincinnati/siding/` on the branch build → approve or redline.
2. Then: the other 17 Phase-2 rewrites (Columbus/St. Louis siding first — they still share 69%).
3. **You**: supply CC endpoints ×3, pricing multipliers, Instagram embed (all → `src/data/leads.js`).
4. Wire arrives → flip each config, test one lead per market end-to-end.
5. Agency spreadsheet arrives → the deferred redirect pass (feeds §9).
6. Merge the branch; redirects and pages go live in the same change — the site stays unlaunched
   until the redirect work exists, per the brief.
