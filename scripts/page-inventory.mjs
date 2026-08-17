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

/** The sixteen every market carries. */
const SIXTEEN = [
  "", "roofing/", "roofing/roof-replacement/", "roofing/roof-repair/",
  "roofing/insurance-storm-damage/", "commercial-roofing/", "siding/",
  "siding/siding-replacement/", "siding/james-hardie-siding/", "siding/vinyl-siding/",
  "windows/", "gutters/", "reviews/", "gallery/", "about/", "free-estimate/",
];

/** Locations differ by market: two areas each in Cincinnati and St. Louis, one metro in Columbus. */
const LOCATIONS = {
  cincinnati: ["locations/east/", "locations/west/"],
  columbus: ["locations/"],
  "st-louis": ["locations/north/", "locations/south/"],
};

const want = new Set(SITEWIDE);
for (const [m, locs] of Object.entries(LOCATIONS)) {
  for (const p of SIXTEEN) want.add(`/${m}/${p}`);
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
  "/commercial-roofing/": "National service page. Not in the header — different buyer — but linked from every footer, where it was a dead link.",
  "/service-areas/": "Answers 'do you cover my town' outside a market page, with a map and the full town list per metro. The new Service Areas tab in the header goes here.",
  "/privacy-policy/": "The estimate form collects a name, phone and ZIP. A site taking personal data needs a policy behind it, and the footer links it on every page.",
  "/terms/": "Warranty, payment and dispute terms. Linked site-wide from the footer alongside the privacy policy.",
  "/financing/": "Linked from the footer and referenced by the offer band. Its figures are gated in claims.js and the page is noindex until a lender is confirmed.",
  "/sitemap/": "The human sitemap. The footer has linked \"Sitemap\" since this site was built and it pointed at raw XML; this is the page it should have gone to. Derived from data/sitemap.js, so it cannot drift from what is actually crawlable.",
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
