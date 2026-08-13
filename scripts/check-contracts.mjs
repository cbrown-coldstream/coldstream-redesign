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
import { MARKETS, SERVICES } from "../src/data/markets.js";
import { LOCATIONS, allMarketJobs } from "../src/data/locations.js";
import { TESTIMONIALS } from "../src/data/claims.js";
import { validateJob, validateReview, qualifiesFor, SURFACES, JOB_FIELDS, REVIEW_FIELDS, REVIEW_RULES } from "../src/data/contracts.js";
import { SAMPLE_JOBS } from "../src/data/fixtures/jobs.sample.js";
import { SAMPLE_REVIEWS } from "../src/data/fixtures/reviews.sample.js";

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

// ── 3. no fixture content in real data ───────────────────────────────────────────────────────
const fixtureIds = new Set(SAMPLE_JOBS.map((j) => j.jobId));
for (const job of realJobs) if (fixtureIds.has(job.jobId)) problem(`FIXTURE ${job.jobId} HAS BEEN COMMITTED AS REAL DATA`);
for (const r of realReviews) if (/FIXTURE/i.test(r.name ?? "")) problem(`FIXTURE review "${r.name}" HAS BEEN COMMITTED AS REAL DATA`);

console.log(failed ? "\n  ✗ CONTRACT CHECK FAILED\n" : "\n  ✓ contract check passed\n");
process.exit(failed ? 1 : 0);
