// THE 58. Checks the build against the exact page inventory in the round-6 build order.
//
// Run: npm run inventory   (after npm run build)
//
// The build order is explicit: "If your build doesn't emit exactly 58, the delta is a bug — report
// it, don't absorb it." So this transcribes the inventory as data and diffs the build against it,
// in both directions. A missing page is a failure. An extra page is reported, never silently kept.
import { existsSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join, relative } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
if (!existsSync(dist)) { console.error("  ✗ no dist/ — run npm run build first"); process.exit(1); }

// ── the inventory, transcribed ───────────────────────────────────────────────────────────────
const SITEWIDE = ["/", "/about-us/", "/free-estimate/", "/thank-you/", "/blog/"];

/** The sixteen every market carries — minus commercial where the owner scoped it out. */
const SIXTEEN = [
  "", "roofing/", "roofing/roof-replacement/", "roofing/roof-repair/",
  "roofing/insurance-storm-damage/", "commercial-roofing/", "siding/",
  "siding/siding-replacement/", "siding/james-hardie-siding/", "siding/vinyl-siding/",
  "windows/", "gutters/", "reviews/", "gallery/", "about/", "free-estimate/",
];
// Owner brief 2026-08-25: "Commercial and multi are Cincinnati and Columbus only." The second
// reversal on this flag (round 6 restored it to St. Louis); the written instruction wins, so the
// transcribed plan records the exception rather than the build quietly disagreeing with it.
// Columbus joined St. Louis outside the commercial line on 2026-08-27 (owner instruction).
const NOT_IN_MARKET = { "st-louis": new Set(["commercial-roofing/"]), columbus: new Set(["commercial-roofing/"]) };

/** Locations differ by market: two areas each in Cincinnati and St. Louis, one metro in Columbus. */
const LOCATIONS = {
  cincinnati: ["locations/east/", "locations/west/"],
  columbus: ["locations/"],
  "st-louis": ["locations/north/", "locations/south/"],
};

const want = new Set(SITEWIDE);
for (const [m, locs] of Object.entries(LOCATIONS)) {
  for (const p of SIXTEEN) if (!NOT_IN_MARKET[m]?.has(p)) want.add(`/${m}/${p}`);
  for (const p of locs) want.add(`/${m}/${p}`);
}

// Pages this build produces that are NOT in the inventory but are kept deliberately. Each one is
// named here with its reason, so "extra" never means "unexplained".
const KEPT_BEYOND_INVENTORY = {
  // Round 12. The header renders a link per service on every page, and nationally every one of
  // them resolved to `/#services` — four nav items, one anchor, no page. These are those pages,
  // plus the commercial one the footer was linking on all 15 national pages. They route to the
  // market that does the work rather than competing with it: no city term appears on any of them.
  "/roofing/": "National service page. The header links it from every national page; before this it pointed at an anchor.",
  "/siding/": "National service page. Same reason as /roofing/.",
  "/windows/": "National service page. Same reason as /roofing/.",
  "/gutters/": "National service page. Same reason as /roofing/.",
  // /commercial-roofing/ LEFT THIS LIST 2026-08-27: with the line Cincinnati-only (owner), the
  // template's more-than-one-market rule stops the national page from building, and every former
  // link routes to /cincinnati/commercial-roofing/ via serviceHref's single-runner rule.
  "/service-areas/": "Answers 'do you cover my town' outside a market page, with a map and the full town list per metro. The new Service Areas tab in the header goes here.",
  "/privacy-policy/": "The estimate form collects a name, phone and ZIP. A site taking personal data needs a policy behind it, and the footer links it on every page.",
  "/terms/": "Warranty, payment and dispute terms. Linked site-wide from the footer alongside the privacy policy.",
  "/financing/": "Linked from the footer and referenced by the offer band. Its figures are gated in claims.js and the page is noindex until a lender is confirmed.",
  "/sitemap/": "The human sitemap. The footer has linked \"Sitemap\" since this site was built and it pointed at raw XML; this is the page it should have gone to. Derived from data/sitemap.js, so it cannot drift from what is actually crawlable.",

  // Round 35 (2026-08-19). Same problem as the national hubs above, one level down: the Roofing
  // and Siding dropdowns render on every page, and nationally every child resolved to its parent
  // hub — five nav items, two destinations, no pages. These are those pages. They carry the
  // material and process argument, which is identical in all three metros, and no city term
  // appears on any of them; the market chooser deep-links to the local version of the same
  // sub-service. See data/national-subservices.js for the split and the slug mapping.
  "/roofing/replacement/": "National sub-service page behind the Roofing dropdown. Nationally the dropdown child resolved to /roofing/ itself. Market equivalent is /{market}/roofing/roof-replacement/, whose slug is unchanged because 273 redirect rules resolve to it.",
  "/roofing/repair/": "National sub-service page behind the Roofing dropdown. Same reason as /roofing/replacement/.",
  "/instant-roof-quote/": "Roofful widget host, built ahead of its embed (owner brief 2026-08-24 §9). Noindex and deliberately unlinked until the widget is in the repo; ?market= routing already wired.",
  "/siding/vinyl-siding/": "National sub-service page behind the Siding dropdown. Same reason as /roofing/replacement/.",
  "/siding/james-hardie-siding/": "National sub-service page behind the Siding dropdown. Same reason as /roofing/replacement/.",
  "/siding/stone-veneer/": "National sub-service page behind the Siding dropdown, requested 2026-08-19. NATIONAL-ONLY — there is no market variant, because three would be this page with a city dropped into it and there is no local stone veneer content to carry. ⚠ The offering itself is unconfirmed: stone veneer appears in no live-copy page and in no market's services array. See the flag in data/national-subservices.js.",
  "/storm-damage/": "Standalone national storm damage page. The nav has carried a standalone Storm Damage item since the 2026-08-18 call — \"it spans trades, which is why it sits on its own\" — with no page of its own to point at; it resolved to /{market}/roofing/insurance-storm-damage/, nested under roofing, exactly where the call said it should not sit. The three market pages are unchanged and no redirect rule was re-pointed.",
};

// ── what was built ───────────────────────────────────────────────────────────────────────────
const walk = (d) => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : p.endsWith("index.html") ? [p] : [];
});
const built = new Set(walk(dist).filter((f) => !f.includes("/handoff/")).map((f) => "/" + relative(dist, f).replace(/index\.html$/, "").replace(/\\/g, "/")).map((u) => (u === "/./" ? "/" : u)));

const missing = [...want].filter((p) => !built.has(p)).sort();
const extra = [...built].filter((p) => !want.has(p)).sort();
const unexplained = extra.filter((p) => !(p in KEPT_BEYOND_INVENTORY));

console.log(`\n  THE 58 — build order inventory vs this build\n`);
console.log(`  inventory:  ${want.size} pages`);
console.log(`  built:      ${built.size} pages (excluding 404.html)\n`);

if (missing.length) {
  console.log(`  ✗ ${missing.length} INVENTORY PAGES NOT BUILT — this is a bug:`);
  for (const p of missing) console.log(`      ${p}`);
} else {
  console.log(`  ✓ all ${want.size} inventory pages built`);
}

if (extra.length) {
  console.log(`\n  ⚠ ${extra.length} pages built beyond the inventory:`);
  for (const p of extra) console.log(`      ${p}  — ${KEPT_BEYOND_INVENTORY[p] ?? "UNEXPLAINED"}`);
}

if (unexplained.length) {
  console.log(`\n  ✗ ${unexplained.length} of those are unexplained. Name them here or remove them.`);
}

const failed = missing.length || unexplained.length;
console.log(`\n  ${failed ? "✗ INVENTORY CHECK FAILED" : `✓ inventory check passed — ${want.size} required, ${extra.length} kept beyond it and accounted for`}\n`);
process.exit(failed ? 1 : 0);
