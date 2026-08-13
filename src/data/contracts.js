// THE INGESTION CONTRACT.
//
// Two pulls block almost everything left on this site: completed jobs from Contractors Cloud, and
// reviews from the Google Business Profile per market. Until now those were sentences in a report.
// This file is the shape they have to arrive in, the rules they have to satisfy, and the bars each
// surface holds them to — so when the pulls land the only question is whether they match the
// schema, not what the schema is.
//
// THREE PROPERTIES, ALL DELIBERATE.
//
//   · DEFAULT DENY. Anything not explicitly marked publishable is not published. A missing consent
//     field is treated as "no", never as "probably fine" — these are photographs of real people's
//     houses and the words of real named customers.
//
//   · THE BARS DIFFER BY SURFACE. A gallery photo carries less weight than a sentence on a service
//     page that says we do a particular thing in a particular town. `qualifiesFor` says which jobs
//     clear which bar, and a job can clear one and fail another.
//
//   · VALIDATION RUNS AT BUILD. Real data is checked on every build and reported the same way
//     every other gap on this site is reported. Bad records are named and excluded, not silently
//     rendered.
//
// The fixtures in ./fixtures/ are synthetic records that satisfy this contract. `npm run contracts`
// validates them, and `npm run test:gates` builds the whole site with them injected — so the
// templates that currently generate zero pages are proven to work before the real data exists.

// ── JOBS ─────────────────────────────────────────────────────────────────────────────────────
//
// Source: Contractors Cloud, completed jobs. The right-hand column is the field we need; where the
// CRM's own name for it is known it is given, because "map these fields" is a smaller ask than
// "design an export".
//
//   market        market slug — cincinnati | columbus | st-louis
//   town          the municipality the job was in. MUST match a name in that market's servedAreas
//                 in markets.js, or the job cannot be filed to a location page.
//   service       canonical service key — roofing | siding | windows | gutters | garage-doors |
//                 commercial-roofing. Not the CRM's free-text job type; mapped to ours.
//   completedOn   ISO date (YYYY-MM-DD). Drives the 24-month recency window and the gallery order.
//   materials     array of what was ACTUALLY specified — "GAF Timberline HDZ", "James Hardie
//                 ColorPlus". This is the field service-page copy is written from; a generic
//                 "shingles" is not usable.
//   scope         one line of what the job was — "full tear-off, 32 sq, new decking to the north
//                 slope". The thing a competitor cannot copy because they did not do the work.
//   detail        the sentence that goes under the photo, in plain language, for a homeowner.
//   publishable   REQUIRED BOOLEAN. False or missing means the job appears nowhere public.
//   consent       who cleared it and when — { by, on }. Required when publishable is true.
//   photos        array of { src, alt, w, h }. Real pixel dimensions, no placeholders — they are
//                 what stops the gallery shifting layout as images load. Alt text describes what
//                 is in the frame, written by whoever took the photo, not generated from the town
//                 name. `altSource` records who wrote it.

export const JOB_FIELDS = {
  required: ["market", "town", "service", "completedOn", "detail", "publishable"],
  requiredWhenPublishable: ["consent"],
  optional: ["materials", "scope", "photos", "jobId"],
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const isStr = (v) => typeof v === "string" && v.trim().length > 0;
const isArr = (v) => Array.isArray(v) && v.length > 0;

/** Every photo problem in one job, as sentences. Empty array means the photo set is usable. */
const photoIssues = (job) =>
  (job.photos ?? []).flatMap((p, i) => {
    const at = `photos[${i}]`;
    const out = [];
    if (!isStr(p.src)) out.push(`${at}.src missing`);
    if (!isStr(p.alt)) out.push(`${at}.alt missing — alt text is written by whoever took the photo, not generated`);
    if (!Number.isInteger(p.w) || !Number.isInteger(p.h) || p.w < 1 || p.h < 1)
      out.push(`${at} needs real integer pixel dimensions w and h — they prevent layout shift`);
    if (!isStr(p.altSource)) out.push(`${at}.altSource missing — who wrote the alt text`);
    return out;
  });

/**
 * Validate one job against the contract. Returns problems as sentences; empty means valid.
 *
 * `markets` is the MARKETS object, so town and service are checked against what actually exists
 * rather than against a copy of the list that can drift.
 */
export const validateJob = (job, markets, serviceKeys) => {
  const out = [];
  for (const f of JOB_FIELDS.required) {
    if (job[f] === undefined || job[f] === null || job[f] === "") out.push(`missing required field \`${f}\``);
  }
  if (typeof job.publishable !== "boolean") out.push("`publishable` must be an explicit boolean — a missing value is treated as no");
  if (job.publishable === true && !(job.consent && isStr(job.consent.by) && ISO_DATE.test(job.consent.on ?? "")))
    out.push("`publishable: true` requires consent { by, on: YYYY-MM-DD } — who cleared it and when");

  const market = markets[job.market];
  if (!market) out.push(`unknown market \`${job.market}\``);
  else if (isStr(job.town) && !market.servedAreas.includes(job.town))
    out.push(`town "${job.town}" is not in ${job.market}'s servedAreas — add it to markets.js or correct the record`);

  if (isStr(job.service) && !serviceKeys.includes(job.service))
    out.push(`service "${job.service}" is not a canonical service key (${serviceKeys.join(", ")})`);
  else if (market && isStr(job.service) && !(market.services ?? []).includes(job.service))
    out.push(`service "${job.service}" is not offered in ${job.market} — a job cannot advertise a service line that market does not have`);

  if (!ISO_DATE.test(job.completedOn ?? "")) out.push("`completedOn` must be an ISO date, YYYY-MM-DD");
  out.push(...photoIssues(job));
  return out;
};

/**
 * WHAT A JOB NEEDS TO EARN EACH SURFACE. The bars genuinely differ.
 *
 *   gallery        A photograph with a caption a person wrote. It is proof of work, and it is not
 *                  making a claim beyond "we did this job here".
 *   location       Everything the gallery needs, and the town has to be filed to an area — a
 *                  location page IS its sub-area, so a job that cannot be placed cannot support one.
 *   serviceProof   The highest bar, and the only one that does not need a photo. This is the record
 *                  a sentence of service-page copy traces back to, so it needs the materials
 *                  actually specified and the scope actually done, and it needs to be recent enough
 *                  to still be true of how we work. No photo required: a materials-and-scope record
 *                  with no picture is still a fact a page can be written from.
 */
export const SURFACES = {
  gallery: {
    label: "gallery",
    needs: ["publishable", "a photo with alt text and real dimensions", "a written detail line"],
    test: (j) => j.publishable === true && isArr(j.photos) && photoIssues(j).length === 0 && isStr(j.detail),
  },
  location: {
    label: "location page",
    needs: ["everything the gallery needs", "a town that maps to a defined area in that market"],
    test: (j, ctx) => SURFACES.gallery.test(j) && Boolean(ctx?.areaFor?.(j.market, j.town)),
  },
  serviceProof: {
    label: "service-page proof",
    needs: ["publishable", "materials actually specified", "a scope line", "completed within 24 months"],
    test: (j, ctx) =>
      j.publishable === true && isArr(j.materials) && isStr(j.scope) && isStr(j.detail) &&
      withinMonths(j.completedOn, 24, ctx?.today),
  },
};

/**
 * Recency, measured against a date passed IN rather than read from the clock.
 *
 * The build must be reproducible — the same source producing the same HTML — so nothing here
 * reads the current time. `today` comes from the caller, which gets it from the build's own
 * reference date. A job "within 24 months" of an unstated moment is not a checkable claim.
 */
export const withinMonths = (iso, months, today) => {
  if (!ISO_DATE.test(iso ?? "") || !ISO_DATE.test(today ?? "")) return false;
  const [ty, tm] = today.split("-").map(Number);
  const [jy, jm] = iso.split("-").map(Number);
  return (ty * 12 + tm) - (jy * 12 + jm) <= months && iso <= today;
};

/** Which surfaces this job clears. */
export const qualifiesFor = (job, ctx) =>
  Object.entries(SURFACES).filter(([, s]) => s.test(job, ctx)).map(([k]) => k);

// ── REVIEWS ──────────────────────────────────────────────────────────────────────────────────
//
// Source: the Google Business Profile for each market.
//
// THREE RULES THAT ARE PART OF THE CONTRACT, NOT OF THE STYLE GUIDE. They are encoded here so
// they cannot be forgotten at ingestion time, which is the only moment they can be broken:
//
//   1. REVIEW TEXT IS NEVER EDITED. Not trimmed to fit, not tidied, not spell-corrected. An edited
//      review is no longer the customer's statement. `quote` is the reviewer's words verbatim;
//      if a review is too long for a card, the card scrolls or the review is not used.
//   2. ALWAYS ATTRIBUTED. A named reviewer, as the profile shows them. No "a happy customer".
//   3. ALWAYS LINKED. `permalink` to the review on Google, so anyone can check that it is real and
//      that we did not change it. A review we cannot link to does not go on the site.
//
//   market        market slug
//   name          reviewer name as it appears on the profile
//   rating        integer 1–5, the reviewer's own. Never assumed to be 5.
//   quote         the review text, VERBATIM
//   date          ISO date the review was left
//   permalink     absolute https URL to that review on Google
//   service       optional — which job it was about, if it can be matched to one
//
// The per-market profile figures are a separate record, because "how many reviews we chose to
// publish" and "how many reviews the profile has" are different numbers and only the second one
// may be used in aggregateRating:
//
//   rating        the profile's own average, as displayed
//   count         the profile's own total review count
//   profileUrl    absolute https URL to the GBP listing

export const REVIEW_FIELDS = {
  required: ["market", "name", "rating", "quote", "date", "permalink"],
  neverEdited: "quote",
};

export const REVIEW_RULES = [
  "Review text is copied verbatim — never trimmed, tidied or spell-corrected.",
  "Every review is attributed to the reviewer as the profile names them.",
  "Every review links to itself on Google, so it can be checked.",
];

const isHttps = (v) => isStr(v) && /^https:\/\//.test(v);

export const validateReview = (review, markets) => {
  const out = [];
  for (const f of REVIEW_FIELDS.required) {
    if (review[f] === undefined || review[f] === null || review[f] === "") out.push(`missing required field \`${f}\``);
  }
  if (!markets[review.market]) out.push(`unknown market \`${review.market}\``);
  if (!Number.isInteger(review.rating) || review.rating < 1 || review.rating > 5)
    out.push("`rating` must be the reviewer's own integer 1–5 — never assumed");
  if (!ISO_DATE.test(review.date ?? "")) out.push("`date` must be an ISO date, YYYY-MM-DD");
  if (!isHttps(review.permalink))
    out.push("`permalink` must be an https URL to the review on Google — a review we cannot link to does not go on the site");
  if (isStr(review.quote) && review.quote !== review.quote.trim())
    out.push("`quote` has been trimmed — store the reviewer's text exactly as written");
  return out;
};

/** The per-market GBP profile figures. Only these may back an aggregateRating. */
export const validateProfile = (profile) => {
  const out = [];
  if (typeof profile?.rating !== "number" || profile.rating < 1 || profile.rating > 5)
    out.push("`rating` must be the profile's own average, as displayed");
  if (!Number.isInteger(profile?.count) || profile.count < 1)
    out.push("`count` must be the profile's own total review count — NOT the number of reviews we publish");
  if (!isHttps(profile?.profileUrl)) out.push("`profileUrl` must be an https URL to the GBP listing");
  return out;
};
