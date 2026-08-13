// Generates the 301 map in both formats the migration might need, from the rules in
// src/data/redirects.js:
//
//   site/public/_redirects          Netlify, if we host it ourselves
//   site/redirects/htaccess.txt     Apache RewriteRule fragment, to hand to Rambo
//
// Run: npm run redirects  (also runs as part of npm run build)
//
// TWO SAFETY PROPERTIES, both deliberate:
//
//   · NO RULE MAY POINT AT A PAGE THIS BUILD DOES NOT PRODUCE. A 301 into a 404 loses the
//     ranking value exactly like a 404 does, but looks handled. Targets are checked against the
//     real page list and the script exits non-zero if one is wrong.
//
//   · NOTHING FOLDS SILENTLY. Given a live URL export at site/data/live-urls.txt, every URL no
//     rule matches is printed. Without that file the script says so rather than implying the
//     299 are covered.
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { MARKETS, servicesFor } from "../src/data/markets.js";
import { SLUG_MAP, UNDECIDED, UTILITY, EXACT, KILL, validTargets } from "../src/data/redirects.js";
import { SUBSERVICES } from "../src/data/subservices.js";
import { LOCATIONS } from "../src/data/locations.js";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const TARGETS = validTargets(MARKETS, servicesFor, SUBSERVICES, LOCATIONS);

/** [from, to, status] */
const rules = [];
const add = (from, to, status = 301) => {
  // A page redirecting to itself is an infinite loop, not a redirect. It happens naturally here
  // because the surviving canonical shares its slug with the duplicates it absorbs.
  if (from === to) return;
  const plain = to.replace(/:\w+/g, "");
  if (status !== 410 && !to.includes(":") && !TARGETS.has(to)) {
    console.error(`  ✗ rule target does not exist: ${from} -> ${to}`);
    process.exitCode = 1;
  }
  rules.push([from, to, status, plain]);
};

// 1. Junk — 410 Gone, before anything else could match it.
for (const p of KILL) add(p, "/404.html", 410);

// 2. Hand-mapped one-offs.
for (const [from, to] of Object.entries(EXACT)) add(from, to);

// 3. Utility page duplicates. The live site carries these at the root and under each market.
//
//    A MARKET-SCOPED RULE IS SKIPPED WHERE THAT MARKET NOW HAS THE PAGE. /{market}/free-estimate/
//    is a real page again, so folding it into the national one would redirect a page that exists.
for (const [slug, to] of Object.entries(UTILITY)) {
  add(`/${slug}/`, to);
  for (const m of Object.keys(MARKETS)) {
    if (TARGETS.has(`/${m}/${slug}/`)) continue;
    add(`/${m}/${slug}/`, to);
  }
  // WordPress numbers its duplicates: /free-estimate-2/, /thank-you-3/ …
  add(`/${slug}-*`, to);
}

// 4. Neighbourhood pages — the 250. /{market}/service-area/{hood}/{service}/ folds into the
//    service hub above it; anything else under service-area folds to the market landing.
for (const [m, market] of Object.entries(MARKETS)) {
  const canonical = new Set(servicesFor(market).map((s) => s.key));
  const services = new Set([...canonical, ...Object.keys(SLUG_MAP)]);
  for (const s of services) {
    // A slug that is CANONICAL in this market always resolves to itself, never to what it folds
    // into elsewhere. A mapped value may be nested ("roofing/roof-repair") or empty (the market
    // page itself, for a service with no page in the inventory).
    const to = canonical.has(s) ? s : (SLUG_MAP[s] ?? s);
    if (UNDECIDED.slugs.includes(s)) continue; // windows — no rule until the data says so
    const target = to === "" ? `/${m}/` : `/${m}/${to}/`;
    if (!TARGETS.has(target)) continue;        // service this market does not offer
    add(`/${m}/service-area/:hood/${s}/`, target);
  }
  add(`/${m}/service-area/*`, `/${m}/`);      // catch-all, after the service-specific rules
}

// 5. Service slug standardisation. Both the page itself and anything nested under it.
for (const [m, market] of Object.entries(MARKETS)) {
  const canonical = new Set(servicesFor(market).map((s) => s.key));
  for (const [variant, to] of Object.entries(SLUG_MAP)) {
    const target = to === "" ? `/${m}/` : `/${m}/${to}/`;
    if (canonical.has(variant)) {
      // The variant IS a page in this market — it serves itself, and must not be redirected.
      // Its old sub-pages still have to land somewhere, though: /{market}/commercial-roofing/
      // was a category with services beneath it on the live site, and folding those into the
      // hub is the whole point of the hub. One segment, not a splat, so the rule cannot match
      // the hub itself and send it to itself.
      add(`/${m}/${variant}/:sub/`, `/${m}/${variant}/`);
      continue;
    }
    if (!TARGETS.has(target)) continue;
    add(`/${m}/${variant}/`, target);
    add(`/${m}/${variant}/*`, target);
  }
}

// ── output ───────────────────────────────────────────────────────────────────────────────────
const netlify = [
  "# Generated by scripts/build-redirects.mjs — do not edit by hand.",
  "# Source of truth: src/data/redirects.js",
  "#",
  "# Order matters: Netlify takes the FIRST matching rule, so the 410s and the exact maps come",
  "# before the patterns, and each market's service-area catch-all comes after its per-service",
  "# rules.",
  "#",
  "# No rule carries the ! force flag, deliberately. Unforced, a redirect fires only when no real",
  "# file matches the path — so the pages this build produces always serve themselves and only",
  "# retired URLs are redirected.",
  "",
  ...rules.map(([f, t, s]) => `${f}  ${t}  ${s}`),
  "",
].join("\n");

const apache = [
  "# Generated by scripts/build-redirects.mjs — do not edit by hand.",
  "# Apache fragment for the current WordPress host. Place ABOVE the WordPress rewrite block,",
  "# otherwise WordPress answers first and none of these fire.",
  "",
  "<IfModule mod_rewrite.c>",
  "RewriteEngine On",
  ...rules.flatMap(([f, t, s]) => {
    const from = "^" + f.replace(/\*$/, "(.*)$").replace(/:(\w+)/g, "([^/]+)").replace(/^\//, "/?");
    if (s === 410) return [`RewriteRule ${from} - [G,L]`];
    return [`RewriteRule ${from} ${t} [R=301,L]`];
  }),
  "</IfModule>",
  "",
].join("\n");

writeFileSync(resolve(root, "public/_redirects"), netlify);
mkdirSync(resolve(root, "redirects"), { recursive: true });
writeFileSync(resolve(root, "redirects/htaccess.txt"), apache);

// ── coverage report ──────────────────────────────────────────────────────────────────────────
const toRegex = (p) =>
  new RegExp("^" + p.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/:\w+/g, "[^/]+").replace(/\*/g, ".*") + "$");
const matchers = rules.map(([f]) => toRegex(f));

console.log(`\n  → ${rules.length} redirect rules written`);
console.log("    public/_redirects (Netlify) · redirects/htaccess.txt (Apache, for Rambo)");
console.log(`  ⚠ WINDOWS DELIBERATELY UNMAPPED — ${UNDECIDED.reason}`);
console.log(`    ${UNDECIDED.slugs.join(", ")}`);

const inventory = resolve(root, "data/live-urls.txt");
if (!existsSync(inventory)) {
  console.log("\n  ⚠ NO LIVE URL EXPORT — coverage of the 299 folding pages is UNVERIFIED.");
  console.log("    Drop the live sitemap at site/data/live-urls.txt (one path per line) and");
  console.log("    re-run to get a list of every URL no rule matches.\n");
} else {
  const paths = readFileSync(inventory, "utf8").split("\n")
    .map((l) => l.trim()).filter(Boolean)
    .map((l) => l.replace(/^https?:\/\/[^/]+/, ""));
  const unmatched = paths.filter((p) => !matchers.some((r) => r.test(p)) && !TARGETS.has(p));
  console.log(`\n  → ${paths.length} live URLs checked, ${paths.length - unmatched.length} matched`);
  if (unmatched.length) {
    console.log(`  ⚠ ${unmatched.length} LIVE URLs MATCH NO RULE — they would 404 on migration:`);
    for (const u of unmatched) console.log(`    · ${u}`);
    process.exitCode = 1;
  }
  console.log("");
}
