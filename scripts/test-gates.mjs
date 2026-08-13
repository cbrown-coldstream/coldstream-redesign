// THE GATE TEST. Proves the templates that generate zero pages today actually work.
//
// Run: npm run test:gates
//
// BUILD ORDER ROUND 6 CHANGED WHAT THE GATES DO. They no longer decide whether a page exists —
// every page in the inventory is built, always. They decide WHAT RENDERS ON IT, and that is the
// part that still has to be right: a job with no consent recorded must appear nowhere, a job with
// no photograph must not reach a gallery, and a reviews page with nothing sourced must say so
// rather than inventing a testimonial.
//
// So this builds the site twice:
//
//   1. WITH FIXTURES. Synthetic records are injected and the pages must fill with exactly the ones
//      the contract admits — and NOT with the ones it excludes. Those negative cases are the whole
//      point: publishable:false appears nowhere, a photo-less job earns no gallery entry, and a
//      four-star review renders four stars.
//   2. WITHOUT FIXTURES. The pages must still exist — they are inventory pages — but must be back
//      to their empty states, and no fixture string may survive anywhere in dist/.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const dist = resolve(root, "dist");

const build = (fixtures) =>
  execFileSync("npm", ["run", "build"], {
    cwd: root,
    encoding: "utf8",
    stdio: "pipe",
    env: { ...process.env, COLDSTREAM_FIXTURES: fixtures ? "1" : "0" },
  });

const page = (p) => existsSync(join(dist, p, "index.html"));
const html = (p) => readFileSync(join(dist, p, "index.html"), "utf8");

let failed = false;
const check = (ok, label) => {
  console.log(`  ${ok ? "✓" : "✗"} ${label}`);
  if (!ok) failed = true;
};

// What the five fixture jobs and two fixture reviews earn, derived by hand from the contract.
// Written out longhand rather than computed, so this test can disagree with the code.
// Inventory pages exist in BOTH builds. These are checked in both directions.
const ALWAYS = [
  "cincinnati/locations/east", "cincinnati/locations/west",
  "st-louis/locations/north", "st-louis/locations/south", "columbus/locations",
  "cincinnati/gallery", "columbus/gallery", "st-louis/gallery",
  "cincinnati/reviews", "columbus/reviews", "st-louis/reviews",
];

// With fixtures loaded, these pages must CONTAIN this content.
const EXPECT_CONTENT = [
  ["cincinnati/locations/east", "north slope decking had gone soft", "FIXTURE-1 Milford renders on Cincinnati East"],
  ["st-louis/locations/south", "could not carry a Kirkwood downpour", "FIXTURE-5 Kirkwood renders on St. Louis South"],
  ["cincinnati/gallery", "north slope decking had gone soft", "Cincinnati gallery shows its one showable job"],
  ["columbus/gallery", "step flashing at the chimney", "FIXTURE-4 Dublin reaches the gallery from the market pool"],
  ["columbus/reviews", "tarp over the whole flowerbed", "Columbus reviews render"],
];

// The negative cases — the ones the contract exists for.
const EXPECT_EXCLUDED = [
  ["cincinnati/gallery", "base course on the west wall", "FIXTURE-2 excluded — materials and scope but NO photo"],
  ["cincinnati/gallery", "Hail claim from the April storms", "FIXTURE-3 excluded — publishable:false, default deny holds"],
  ["cincinnati/locations/east", "Hail claim from the April storms", "publishable:false excluded from the location page too"],
];

console.log("\n  GATE TEST — building WITH fixtures\n");
build(true);

for (const p of ALWAYS) check(page(p), `${p}/ built`);
for (const [p, needle, why] of EXPECT_CONTENT) check(page(p) && html(p).includes(needle), why);
for (const [p, needle, why] of EXPECT_EXCLUDED) check(page(p) && !html(p).includes(needle), why);

// The negative cases inside a page that did build. These are the contract's real work.
if (page("cincinnati/gallery")) {
  // Assert on JOB CONTENT, not town names: every served town appears on this page in the
  // served-areas block, so "does the page mention Loveland" is a different question.
  const figures = (html("cincinnati/gallery").match(/<figure class="job"/g) ?? []).length;
  check(figures === 1, `Cincinnati gallery renders exactly 1 job figure, not 3 (found ${figures})`);
}
check(!page("columbus/locations/north") && !page("columbus/locations/south"),
  "Columbus has one metro locations page, not a compass split");

// The bug the manual version of this test caught.
if (existsSync(join(dist, "sitemap.xml"))) {
  const sm = readFileSync(join(dist, "sitemap.xml"), "utf8");
  // The bug the manual version of this test caught: pages that became indexable and were missing
  // from the sitemap.
  for (const [p] of EXPECT_CONTENT) check(sm.includes(`/${p}/`), `sitemap lists /${p}/ once it has content`);
}

// A four-star review must render four stars.
if (page("columbus/reviews")) {
  const r = html("columbus/reviews");
  check(r.includes("★★★★</div>") || r.includes(">★★★★<"), "a 4★ review renders four stars, not five");
  check(r.includes('"ratingValue":4'), "Review schema carries the reviewer's own rating");
}

console.log("\n  GATE TEST — rebuilding WITHOUT fixtures\n");
build(false);

// The pages must STILL EXIST — they are inventory pages — and be back to their empty states.
for (const p of ALWAYS) check(page(p), `${p}/ still built without fixtures`);
for (const [p, needle, why] of EXPECT_CONTENT) check(!html(p).includes(needle), `${p}/ back to its empty state`);
check(html("cincinnati/gallery").includes("Photographs are on their way"), "empty gallery renders its honest empty state");
check(html("cincinnati/reviews").includes("reviews live on Google"), "empty reviews page says so rather than inventing one");

// Nothing synthetic may survive in the output that would actually be deployed.
const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const full = join(dir, f);
  return statSync(full).isDirectory() ? walk(full) : [full];
});
const leaked = walk(dist).filter((f) => /\.(html|xml|txt|json)$/.test(f) && /FIXTURE/i.test(readFileSync(f, "utf8")));
check(leaked.length === 0, `no fixture content in dist/ ${leaked.length ? `— LEAKED INTO ${leaked.join(", ")}` : ""}`);

console.log(failed ? "\n  ✗ GATE TEST FAILED\n" : "\n  ✓ gate test passed — the gates work in both directions\n");
process.exit(failed ? 1 : 0);
