// Validates every job and review record against the ingestion contract in src/data/contracts.js.
//
// Run: npm run contracts
//
// It checks three things, in order:
//
//   1. THE FIXTURES SATISFY THE CONTRACT. If the worked examples do not validate, the contract and
//      the examples have drifted apart and neither can be trusted as a spec for the pull.
//   2. THE REAL DATA SATISFIES THE CONTRACT. Today there is none, which is reported rather than
//      passed over in silence — "0 records checked" and "all records valid" are different results.
//   3. THE FIXTURES ARE NOT IN THE REAL DATA. A synthetic job or a fabricated review committed to
//      src/data/ would be indistinguishable from real data six weeks from now.
//
// Exits non-zero if real data is invalid, or if fixture content has leaked into real data. Invalid
// FIXTURES are also a failure — they are the spec.
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { MARKETS, SERVICES } from "../src/data/markets.js";
import { LOCATIONS, allMarketJobs } from "../src/data/locations.js";
import { TESTIMONIALS } from "../src/data/claims.js";
import { validateJob, validateReview, validateProfile, qualifiesFor, SURFACES, JOB_FIELDS, REVIEW_FIELDS, REVIEW_RULES } from "../src/data/contracts.js";
import { SAMPLE_JOBS } from "../src/data/fixtures/jobs.sample.js";
import { SAMPLE_REVIEWS } from "../src/data/fixtures/reviews.sample.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const SERVICE_KEYS = SERVICES.map((s) => s.key);
const areaFor = (market, town) => {
  const m = LOCATIONS[market];
  if (!m) return null;
  return Object.entries(m.areas ?? {}).find(([, a]) => a.towns.includes(town))?.[0] ?? null;
};
// Recency is measured against a date passed in, never the clock — see contracts.js. For a
// reporting script the reference is the fixture set's own newest completion date, so this script
// produces the same output today and in a year.
const TODAY = SAMPLE_JOBS.map((j) => j.completedOn).sort().at(-1);
const ctx = { areaFor, today: TODAY };

let failed = false;
const problem = (msg) => { console.log(`  ✗ ${msg}`); failed = true; };

console.log("\n  THE INGESTION CONTRACT\n");
console.log(`  Job fields — required: ${JOB_FIELDS.required.join(", ")}`);
console.log(`               required when publishable: ${JOB_FIELDS.requiredWhenPublishable.join(", ")}`);
console.log(`               optional: ${JOB_FIELDS.optional.join(", ")}`);
console.log(`  Review fields — required: ${REVIEW_FIELDS.required.join(", ")}`);
for (const r of REVIEW_RULES) console.log(`    · ${r}`);

console.log("\n  Surface bars — what a job has to clear to appear where:");
for (const [key, s] of Object.entries(SURFACES)) {
  console.log(`    ${key.padEnd(13)} ${s.label}`);
  for (const n of s.needs) console.log(`      ${"".padEnd(13)} · ${n}`);
}

// ── 1. fixtures validate ─────────────────────────────────────────────────────────────────────
console.log(`\n  FIXTURES — ${SAMPLE_JOBS.length} jobs, reference date ${TODAY}\n`);
for (const job of SAMPLE_JOBS) {
  const issues = validateJob(job, MARKETS, SERVICE_KEYS);
  const surfaces = qualifiesFor(job, ctx);
  const label = `${job.jobId} ${job.market}/${job.town} ${job.service}`;
  if (issues.length) {
    problem(`${label} — INVALID FIXTURE`);
    for (const i of issues) console.log(`      · ${i}`);
  } else {
    console.log(`  ✓ ${label.padEnd(44)} → ${surfaces.length ? surfaces.join(", ") : "NO SURFACE"}`);
  }
}

const fixtureReviews = Object.values(SAMPLE_REVIEWS).flat();
console.log(`\n  FIXTURES — ${fixtureReviews.length} reviews\n`);
for (const r of fixtureReviews) {
  const issues = validateReview(r, MARKETS);
  if (issues.length) {
    problem(`${r.market}/"${r.name}" — INVALID FIXTURE`);
    for (const i of issues) console.log(`      · ${i}`);
  } else {
    console.log(`  ✓ ${r.market}/"${r.name}" — ${r.rating}★, linked`);
  }
}

// ── 2. real data validates ───────────────────────────────────────────────────────────────────
const realJobs = Object.keys(LOCATIONS).flatMap((s) => allMarketJobs(s));
const realReviews = Object.entries(TESTIMONIALS).filter(([k]) => k !== "national").flatMap(([, v]) => v);

console.log(`\n  REAL DATA — ${realJobs.length} jobs, ${realReviews.length} reviews on file\n`);
if (!realJobs.length && !realReviews.length) {
  console.log("  ⚠ NOTHING TO VALIDATE YET. Both pulls are outstanding — this is not a pass.");
  console.log("    Contractors Cloud job pull → src/data/locations.js (area jobs, or the market pool)");
  console.log("    GBP review pull            → TESTIMONIALS in src/data/claims.js");
  console.log("    Both must satisfy the contract above; this script is how that gets checked.");
}
for (const job of realJobs) {
  const issues = validateJob(job, MARKETS, SERVICE_KEYS);
  if (issues.length) {
    problem(`real job ${job.jobId ?? `${job.market}/${job.town}`} is invalid`);
    for (const i of issues) console.log(`      · ${i}`);
  }
}
for (const r of realReviews) {
  const issues = validateReview(r, MARKETS);
  if (issues.length) {
    problem(`real review "${r.name}" (${r.market}) is invalid`);
    for (const i of issues) console.log(`      · ${i}`);
  }
}

// ── 2b. THE PULLED GOOGLE REVIEWS, VALIDATED AGAINST THE SAME CONTRACT ───────────────────────
//
// scripts/pull-reviews.mjs writes src/data/generated/reviews.json. It is checked here rather than
// trusted: "the pull satisfies the contract" is a claim, and this is the thing that makes it a fact.
// The first version of that script wrote the Places API's own field names — author_name, text — and
// would have sailed past a check that never ran.
//
// Absent is fine and silent-ish: no key, no pull, no file. Present and wrong is a failure.
const REVIEWS_FILE = resolve(root, "src/data/generated/reviews.json");
if (existsSync(REVIEWS_FILE)) {
  let pulled = null;
  try {
    pulled = JSON.parse(readFileSync(REVIEWS_FILE, "utf8"));
  } catch (e) {
    problem(`generated/reviews.json is not valid JSON — ${e.message}`);
  }
  if (pulled) {
    const markets = Object.entries(pulled.markets ?? {});
    console.log(`\n  PULLED GOOGLE REVIEWS — ${markets.length} market(s), pulled ${pulled.pulledAt ?? "?"}`);
    let n = 0;
    for (const [slug, m] of markets) {
      if (!MARKETS[slug]) problem(`reviews.json has an unknown market \`${slug}\``);
      // The aggregate is all-or-nothing: a rating with no count, or either with no link, is a figure
      // nobody can check. validateProfile is the same gate the component applies at render time.
      const hasAny = m.rating != null || m.count != null || m.profileUrl != null;
      if (hasAny) {
        const pIssues = validateProfile(m);
        if (pIssues.length) {
          problem(`${slug} profile figures are invalid`);
          for (const i of pIssues) console.log(`      · ${i}`);
        }
      }
      for (const r of m.reviews ?? []) {
        n++;
        const issues = validateReview(r, MARKETS);
        if (issues.length) {
          problem(`pulled review "${r.name ?? "?"}" (${slug}) is invalid`);
          for (const i of issues) console.log(`      · ${i}`);
        }
        // Google's attribution requirement is avatar, name AND profile link. The contract does not
        // know about author_url because it predates this pull, so it is asserted here.
        if (!r.author_url) problem(`pulled review "${r.name ?? "?"}" (${slug}) has no author_url — attribution is required`);
        if (/FIXTURE|VERIFY-ONLY/i.test(r.name ?? "")) problem(`placeholder review "${r.name}" HAS BEEN COMMITTED AS REAL DATA`);
      }
      // Five per place is the API ceiling. More than that means something invented rows.
      if ((m.reviews ?? []).length > 5) problem(`${slug} has ${m.reviews.length} reviews — the Places API returns at most 5`);
      console.log(`    ✓ ${slug.padEnd(12)} ${(m.reviews ?? []).length} reviews · ${m.rating ?? "no"} rating of ${m.count ?? "no"} count`);
    }
    console.log(`    ${n} pulled review(s) checked against the same contract as the fixtures`);
  }
}

// ── 3. no fixture content in real data ───────────────────────────────────────────────────────
const fixtureIds = new Set(SAMPLE_JOBS.map((j) => j.jobId));
for (const job of realJobs) if (fixtureIds.has(job.jobId)) problem(`FIXTURE ${job.jobId} HAS BEEN COMMITTED AS REAL DATA`);
for (const r of realReviews) if (/FIXTURE/i.test(r.name ?? "")) problem(`FIXTURE review "${r.name}" HAS BEEN COMMITTED AS REAL DATA`);

console.log(failed ? "\n  ✗ CONTRACT CHECK FAILED\n" : "\n  ✓ contract check passed\n");
process.exit(failed ? 1 : 0);
