// THE 301 MAP.
//
// site-plan: "Every retired URL gets mapped to its canonical hub first — not after the pages
// come down." With 299 pages folding, this is the difference between a rebuild and a reset: a
// 301 passes the ranking value the old URL earned to the new one, and a 404 throws it away.
//
// THIS FILE IS RULES, NOT A LIST OF 299 LINES. The live URL structure is systematic —
// /{market}/{category}/{service}/ and /{market}/service-area/{hood}/{service}/ — so the map is
// expressed as the rules that generated the sprawl in reverse. scripts/build-redirects.mjs turns
// them into a Netlify _redirects file and an Apache fragment for Rambo, and checks them against
// the live URL export when one is available.
//
// ── WHAT THIS MAP CANNOT DO YET ──────────────────────────────────────────────────────────────
//
//   1. NO LIVE URL EXPORT EXISTS IN THIS REPO. The rules below cover the patterns the audit
//      documented, but "cover every one of the 299" is a claim that needs the actual list to
//      verify. Drop the live sitemap at site/data/live-urls.txt (one URL per line) and the
//      generator will report every URL no rule matches. Until then, coverage is unproven.
//
//   2. WINDOWS IS UNDECIDED. 25 pages sit in "review", and the plan is explicit that the call
//      needs Rambo's page-level ranking data first. Folding bay/bow/slider/picture windows into
//      one hub before that data arrives could retire a page that is quietly earning. They are
//      listed in UNDECIDED below and DELIBERATELY EMIT NO RULE — they keep 200ing until someone
//      decides. A missing redirect is recoverable; a wrong one costs the ranking twice.
//
//   3. RESOLVED, THEN RE-SCOPED TWICE. Round 6 made commercial a hub in all three markets; the
//      2026-08-25 brief scoped St. Louis out; the owner scoped Columbus out on 2026-08-27 —
//      commercial is CINCINNATI-ONLY now. The per-market fallback machinery below is why each of
//      those was a data change and not a rule change: where the hub exists the slug resolves to
//      itself, everywhere else it falls back per SLUG_MAP.

/**
 * Live service-slug variants → the one canonical slug per service.
 *
 * "Six slugs for one service. Pick one canonical spelling and redirect the rest — the single
 * cheapest fix in the plan." Everything on the left is a real slug from the audit; everything on
 * the right is a page that exists in this build.
 */
export const SLUG_MAP = {
  // Roofing. THREE OF THESE NOW LAND ON THEIR OWN PAGE rather than folding into the hub —
  // build order round 6 restored roof-replacement, roof-repair and insurance-storm-damage as
  // nested pages, which is what the fold table asked for all along ("Collapse to
  // roofing/roof-replacement/ and roofing/roof-repair/"). A value containing a slash is a nested
  // target; the generator resolves it the same way.
  "residential-roofing": "roofing",
  "roofing-services": "roofing",
  "roof-types": "roofing",              // material choices ARE sections — the plan is explicit
  "roof-replacement": "roofing/roof-replacement",
  "roof-repair": "roofing/roof-repair",
  "roof-repair-maintenance": "roofing/roof-repair",
  "roof-leak-repair": "roofing/roof-repair",
  "emergency-roof-repair": "roofing/roof-repair",
  "storm-damage": "roofing/insurance-storm-damage",
  "storm-damage-repair": "roofing/insurance-storm-damage",
  "hail-damage": "roofing/insurance-storm-damage",
  "wind-damage": "roofing/insurance-storm-damage",
  "insurance-claims": "roofing/insurance-storm-damage",
  // Commercial — see caveat 3. This entry is the FALLBACK for a market with no commercial hub
  // (St. Louis and, since 2026-08-27, Columbus). Where the hub exists the generator resolves the
  // slug to itself and this line does not apply, so the same map serves both without a special case.
  "commercial-roofing": "roofing",
  // Siding. "Keep the hub, James Hardie and vinyl" — so three of these are pages, not folds.
  "siding-installation-replacement": "siding",
  "siding-replacement": "siding/siding-replacement",
  "siding-installation": "siding/siding-replacement",
  "james-hardie": "siding/james-hardie-siding",
  "fiber-cement-siding": "siding/james-hardie-siding",
  "vinyl-siding": "siding/vinyl-siding",
  // Gutters — five spellings. downspouts and gutter-replacement surfaced in the 2026-08-25 live
  // sitemap diff: the live site was RESTRUCTURED (Nov 2025) into /{market}/gutters/{sub}/ nesting
  // after the audit this map was written against, so the new shapes matched nothing. The fold
  // decision was already recorded for their siblings; these join it.
  "seamless-gutters": "gutters",
  "gutter-guards": "gutters",
  "gutter-installation": "gutters",
  "gutter-replacement": "gutters",
  "downspouts": "gutters",
  // Siding repair and soffit/fascia — same diff, same reasoning. Both fold into the replacement
  // page, whose depth copy already carries the trim/soffit/fascia and repair-vs-replace content.
  "siding-repair": "siding/siding-replacement",
  "soffit-fascia-services": "siding/siding-replacement",
  // GARAGE DOORS HAS NO PAGE IN THE INVENTORY. It is a real St. Louis service and it is on the
  // live site, so these do not 404 — they land on the St. Louis market page, where the service is
  // described as a section. Flagged in DECISIONS.md as the one inventory/live-site conflict.
  "garage-doors": "",
  "garage-door-installation": "",
  "garage-doors-installation-replacement": "",
};

/**
 * Windows. NO RULES EMITTED — this is the open decision, not an oversight.
 *
 * Bay, bow, slider and picture windows may each earn their own search. The plan says decide
 * against ranking data before folding, so these stay live and unredirected until that data says
 * otherwise. The generator prints them on every run so they cannot be forgotten.
 */
export const UNDECIDED = {
  reason: "25 windows pages in review — needs Rambo's page-level ranking data before folding.",
  slugs: [
    "windows-replacement", "replacement-windows", "window-installation",
    "bay-windows", "bow-windows", "slider-windows", "picture-windows",
    "double-hung-windows", "casement-windows", "energy-efficient-windows",
    // The Nov-2025 live restructure's spellings for the same pages, from the 2026-08-25 sitemap
    // diff — still the same open decision, so still no rules, but now ACCOUNTED for by name.
    "window-replacement", "window-installations", "vinyl-windows",
    "energy-efficient-window", "bay-bow-windows", "provia-windows",
  ],
};

/**
 * The sixteen duplicate utility pages → one canonical each.
 *
 * Four free-estimate, four instant-roof-quote, four thank-you. The plan allows "one of each — or
 * one per market"; this build ships one of each, nationally, because a market-scoped conversion
 * page would need market-scoped copy to justify existing and would otherwise be four near-
 * identical pages — the pattern the whole consolidation removes.
 *
 * INSTANT-ROOF-QUOTE FOLDS RATHER THAN SURVIVING. There is no instant-quote widget or vendor
 * behind it, and a page promising an instant quote that cannot give one is a broken promise.
 * All four go to the free-estimate page, which does the same job honestly.
 */
export const UTILITY = {
  // PER-MARKET free-estimate pages now EXIST, so only the root-level duplicates fold. The
  // generator skips a market-scoped rule wherever that market has the page — see build-redirects.
  "free-estimate": "/free-estimate/",
  "instant-roof-quote": "/free-estimate/",
  "instant-quote": "/free-estimate/",
  "thank-you": "/thank-you/",
  "thanks": "/thank-you/",
};

/**
 * Hand-mapped one-offs — URLs that break the pattern and have to be named individually.
 */
export const EXACT = {
  // Breaks the nested pattern and is not a service we offer. Its hub above it is the market.
  "/columbus/service-area/dublin-concrete-services/": "/columbus/",
  // Per-market About pages EXIST now (build order round 6 restored them), so nothing folds here.
  // The company story stays on /about-us/; the market pages carry what is genuinely per-market.
  // St. Louis location slugs are north/south, matching the Page System, so both are real pages
  // now and neither redirects. Columbus has one metro page instead of a split.
  "/columbus/locations/north/": "/columbus/locations/",
  "/columbus/locations/south/": "/columbus/locations/",
  "/columbus/locations/east/": "/columbus/locations/",
  "/columbus/locations/west/": "/columbus/locations/",
  // Garage doors: the service is described on the St. Louis landing page.
  "/st-louis/garage-doors/": "/st-louis/",
  // COMMERCIAL WENT CINCINNATI-ONLY 2026-08-27 (owner). The national hub stops building — only
  // one market runs the line — so its URL gets a rule rather than a 404: commercial buyers go to
  // the one commercial page. /columbus/commercial-roofing/ needs NO row here: the moment the page
  // stopped being canonical, the generator's SLUG_MAP fallback took the URL to /columbus/roofing/,
  // the same treatment St. Louis's commercial URLs have always had. (A row here too would emit two
  // rules for one URL — caught on the first build.)
  "/commercial-roofing/": "/cincinnati/commercial-roofing/",
};

/**
 * THE BLOG. Every live blog URL gets a row here, and every row stays PENDING until it has a
 * decision behind it.
 *
 * /blog/ is in the plan's page system and is not built: there is no content, no owner and no
 * publishing cadence. That makes the posts under it the one part of the migration where a wrong
 * call is expensive in both directions — folding a post that carries backlinks throws away the
 * only off-site authority this domain has earned, and keeping a post nobody reads carries a thin
 * page into the new site that the whole consolidation exists to remove.
 *
 * So no blog URL gets a rule from a guess. Each one needs its own traffic and backlink numbers,
 * and until those arrive the honest state is a named row with no rule, which is what PENDING is.
 * A row's `decision` becomes "keep", "fold" (with a target) or "kill", and only then does the
 * generator emit anything for it.
 *
 * THE LIST IS EMPTY BECAUSE THE LIVE URL EXPORT DOES NOT EXIST IN THIS REPO. That is a gap, not a
 * finding that there are no blog posts — verify-build.mjs fails on it deliberately rather than
 * letting an empty list read as "handled". Drop the export at site/data/live-urls.txt and every
 * /blog/ path in it that has no row here will be named.
 */
export const BLOG = {
  status: "PENDING",
  /** Live post count, per the build order. The URLs themselves need the live export. */
  count: 48,
  reason: "Needs per-post traffic and backlink data before any post is folded, kept or killed.",
  disposition: "Posts stay on WordPress for now. /blog/ is built as an index with nothing in it.",
  /** [{ path, decision: "PENDING" | "keep" | "fold" | "kill", target?, note? }] */
  rows: [],
};

/**
 * Killed outright — 410 Gone, not 301.
 *
 * "Deleted outright. No redirect needed — nothing links to them and nothing ranks for them."
 * A 410 tells Google the page is intentionally gone and drops it faster than a 404 does.
 * Redirecting junk into a real page instead would pass junk signals onto that page.
 */
export const KILL = [
  "/sample-page/",
];

/**
 * Pages in this build that a redirect is allowed to point at.
 * The generator refuses to emit a rule whose target is not in here — a 301 to a 404 is worse
 * than the 404 it replaced, because it hides the mistake.
 */
export const validTargets = (markets, servicesFor, subservices = {}, locations = {}) => {
  const t = new Set(["/", "/free-estimate/", "/thank-you/", "/about-us/", "/financing/",
                     "/blog/", "/privacy-policy/", "/terms/"]);
  for (const [slug, m] of Object.entries(markets)) {
    t.add(`/${slug}/`);
    t.add(`/${slug}/about/`);
    t.add(`/${slug}/free-estimate/`);
    t.add(`/${slug}/reviews/`);
    t.add(`/${slug}/gallery/`);
    for (const s of servicesFor(m)) {
      t.add(`/${slug}/${s.key}/`);
      for (const sub of Object.keys(subservices[s.key] ?? {})) t.add(`/${slug}/${s.key}/${sub}/`);
    }
    const loc = locations[slug] ?? {};
    if (loc.metro) t.add(`/${slug}/locations/`);
    for (const key of Object.keys(loc.areas ?? {})) t.add(`/${slug}/locations/${key}/`);
  }
  return t;
};
