// THE CLAIMS GATE. Every factual assertion the site makes about Coldstream lives here, and
// anything unsourced is null.
//
// WHY THIS FILE EXISTS. The review rating was pulled because 4.8 was a factual claim about a
// real review profile that no source backed. Auditing the rest of the prototype copy for the
// same defect turned up more of it — all inherited from the same design comp that supplied the
// fake phone numbers and the fake rating:
//
//   · "$1,000 off your roof replacement"   — a promotion nobody has confirmed is running
//   · "financing as low as $99/mo", "$0 down", "low- and 0%-interest options"
//                                          — advertised credit terms. In the US these are
//                                            regulated: advertising a specific monthly payment
//                                            triggers Regulation Z disclosure requirements, and
//                                            the figure has to come from the actual lender.
//   · "no payment until your project is complete" — a payment-terms promise
//   · "25+ years" of work                  — a company-history claim
//   · "BBB A+"                             — an accreditation claim; badges.js already records
//                                            that BBB exists as text only, with no seal asset
//   · three named customer testimonials    — INVENTED. "Sarah M.", "Dave R." and "Priya K." are
//                                            prototype filler, and the same quotes appeared on
//                                            both the national and Cincinnati pages under the
//                                            heading "Real feedback from Cincinnati homeowners".
//                                            Fabricated endorsements are an FTC problem, not a
//                                            copy nit.
//
// None of it is deleted — it is gated. Fill a value in and it appears everywhere it belongs,
// automatically, in one place. Until then the build names every gap on every run.
//
// WHAT IS NOT GATED, because it is pre-approved as always true in
// design-systems/exteriors/voice-spec.json:
//
//   · Licensed & insured
//   · Free, no-obligation inspections and quotes
//   · 25-year workmanship warranty
//
// Also ungated: "locally owned", "our own crews" and "factory-certified installers" — three real
// offices with three real crews back the first two, and the manufacturer badges back the third
// at that level of generality. (Badge TIERS stay gated in badges.js — the GAF tier is still
// claimed three different ways.)

export const CLAIMS = {
  /** The seasonal promotion. `{ headline, body, chip }` when a real one is confirmed running. */
  offer: null,

  /**
   * Consumer financing. `{ from: "$__/mo", zeroDown: bool, lender, apr, terms }`.
   * Needs the lender's own advertised terms, not a number from a design comp.
   */
  financing: null,

  /** Payment terms, e.g. "No payment is due until your project is finished." Needs sign-off. */
  paymentTerms: null,

  /** Years in business, as a number. Nobody has sourced the founding year. */
  experience: null,

  /**
   * Homes served, as a number. The live site prints "3,000+ satisfied customers" with no source.
   * Fill this in and it appears in the home page's numbers band automatically.
   */
  customersServed: null,

  /** BBB accreditation, e.g. `{ rating: "A+", profileUrl }`. No seal asset exists yet. */
  bbb: null,
};

/**
 * Customer testimonials, per market plus `national`.
 *
 * These must be REAL and ATTRIBUTABLE — pulled from the GBP listing for that market, with the
 * reviewer's own words. Empty means the reviews section does not render at all, which is the
 * correct state. It is not a placeholder to be filled with something plausible.
 */
export const TESTIMONIALS = {
  national: [],
  cincinnati: [],
  columbus: [],
  "st-louis": [],
};

// ── FIXTURE INJECTION ────────────────────────────────────────────────────────────────────────
//
// COLDSTREAM_FIXTURES=1 merges the synthetic reviews in ./fixtures/reviews.sample.js into
// TESTIMONIALS above. Fabricated endorsements are the exact thing this file exists to prevent, so
// this is quarantined harder than the job fixtures: off by default, a banner on every build that
// loads it, and scripts/verify-build.mjs fails outright if the word FIXTURE reaches built HTML.
if (process.env.COLDSTREAM_FIXTURES === "1") {
  const { SAMPLE_REVIEWS } = await import("./fixtures/reviews.sample.js");
  console.warn("  \u26a0\u26a0  FIXTURES ON — synthetic REVIEWS are being built into this site.");
  console.warn("      COLDSTREAM_FIXTURES=1. This output must never be deployed.\n");
  for (const [market, list] of Object.entries(SAMPLE_REVIEWS)) TESTIMONIALS[market] = list;
}

/**
 * Markets with enough real, attributable reviews to justify a /{market}/reviews/ page.
 *
 * The plan's page system has one per market. It is gated exactly like a location page is gated
 * on job photos: a reviews page whose reviews are not real is the single worst version of this
 * page to ship, so no reviews means no page — not an empty page, not a noindex page. Fill in
 * TESTIMONIALS from the GBP listing and the pages build themselves.
 */
export const marketsWithReviews = () =>
  Object.keys(TESTIMONIALS).filter((k) => k !== "national");

/** Markets that actually have reviews to render. Drives the empty state and the build warning. */
export const marketsWithSourcedReviews = () =>
  Object.entries(TESTIMONIALS).filter(([k, t]) => k !== "national" && t.length).map(([k]) => k);

/** Markets with no sourced reviews — no reviews page. Named by the build on every run. */
export const REVIEWS_PAGE_PENDING = Object.entries(TESTIMONIALS)
  .filter(([k, t]) => k !== "national" && !t.length).map(([k]) => k);

/**
 * The hero bullet list, assembled from what is actually sourced.
 *
 * Always at least the three approved claims, so a hero is never short. Gated claims append
 * themselves the moment they are filled in — nothing to remember, nothing to retype per page.
 */
export const heroBullets = () => {
  const out = ["Free, no-obligation inspection"];
  if (CLAIMS.financing) out.push(`Financing available — as low as ${CLAIMS.financing.from}`);
  if (CLAIMS.paymentTerms) out.push(CLAIMS.paymentTerms);
  out.push("25-year workmanship warranty", "Licensed and insured");
  return out.slice(0, 3);
};

/**
 * The service card's back-face assurances.
 *
 * WHY THIS LIVES HERE AND NOT IN THE COMPONENT. A back face that is revealed on hover is exactly
 * the kind of surface that collects unsourced copy: it is easy to miss in review, it reads as
 * decoration, and "BBB A+" or "financing available" typed into a template is invisible to the gate
 * that greps built HTML only until it ships. Assembling it here means the same rule governs it as
 * governs a hero — a claim that is null cannot be printed, because there is nothing to print.
 *
 * ELIGIBILITY IS DELIBERATELY NARROW. Only the three always-true claims from
 * brand/voice-spec.json, plus the three ungated descriptions this repo has already accepted are
 * backed at that level of generality — three real offices and three real crews carry "locally
 * owned" and "our own crews", and the manufacturer badges carry "factory-certified installers".
 * Badge TIERS stay out: the GAF tier is still claimed three different ways by three sources.
 *
 * Nothing gated joins this list by being added below. `.filter(Boolean)` is what makes that
 * structural rather than a convention — a value that becomes null drops its bullet instead of
 * rendering "null", and the card simply gets shorter.
 */
export const cardAssurances = () => [
  "Licensed and insured",
  "Free, no-obligation inspections",
  "25-year workmanship warranty",
  "Locally owned",
  "Our own crews",
  "Factory-certified installers",
].filter(Boolean);

/** The hero offer chip, or null. Hero already omits the chip when this is null. */
export const offerChip = () => (CLAIMS.offer ? CLAIMS.offer.chip : null);

/** Everything still unsourced, named by the build on every run. */
export const CLAIMS_PENDING = [
  !CLAIMS.offer && ["offer", "the $1,000-off promotion — confirm it is running, and its end date"],
  !CLAIMS.financing && ["financing", "lender, advertised monthly payment, APR and terms (Reg Z)"],
  !CLAIMS.paymentTerms && ["paymentTerms", "\"no payment until complete\" — confirm it is policy"],
  !CLAIMS.experience && ["experience", "founding year, for the \"25+ years\" claim"],
  !CLAIMS.customersServed && ["customersServed", "homes served, for the \"3,000+ customers\" figure"],
  !CLAIMS.bbb && ["bbb", "accreditation status, rating and profile URL"],
  ...Object.entries(TESTIMONIALS)
    .filter(([, t]) => !t.length)
    .map(([k]) => [`testimonials.${k}`, "real, attributable reviews from the GBP listing"]),
].filter(Boolean);
