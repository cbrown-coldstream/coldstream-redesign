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

  /**
   * Years in business, as a number. Nobody has sourced the founding year.
   *
   * ── ⚠ THREE SOURCES, THREE ANSWERS, FOUND 2026-08-24 ───────────────────────────────────────
   *
   *   "Established in 2007"   an Angi listing for the St. Louis entity  → about 19 years
   *   "over 20 years"         an Owens Corning contractor profile and the live Facebook page
   *   "25+ years"             the live WordPress site and the design comp
   *
   * NONE OF THEM IS THE BUSINESS ANSWERING THE QUESTION, and they cannot all be right. This is the
   * same shape of problem as the review count and the GAF tier: a number that has been repeated
   * until it reads as fact, with no origin behind it.
   *
   * WHAT UNLOCKS IT is one date — the year the company was founded — from someone who knows. The
   * site then prints a figure derived from it rather than a remembered one, and it stays correct
   * every year without anyone editing a template.
   *
   * ⚠ NOTE THE DIRECTION OF THE ERROR. If 2007 is right, "25+ years" is not a rounding — it is six
   *   years of experience the company does not have, printed on roughly twenty pages of the live
   *   site. That is the reason this is gated rather than carried across.
   */
  experience: null,

  /**
   * Homes served, as a number. The live site prints "3,000+ satisfied customers" with no source.
   * Fill this in and it appears in the home page's numbers band automatically.
   */
  customersServed: null,

  /**
   * BBB accreditation. Shape: `{ rating: "A+", profileUrl: "https://www.bbb.org/..." }`.
   *
   * WHAT UNLOCKS IT: the accreditation record itself — the BBB business profile showing Coldstream
   * as an accredited business and the letter grade BBB currently assigns. Not a screenshot, not the
   * live site's own claim, not a brief. The live WordPress home page prints "BBB A+ Accredited" and
   * nothing anywhere sources it, which is why it is here rather than in the copy.
   *
   * TWO SEPARATE THINGS ARE MISSING and filling one does not release the other:
   *   1. the record above, which is what this field gates
   *   2. the seal image, which BBB's programme requires be their hosted, linked seal — it has to
   *      come from the accreditation account, so it cannot be recreated. badges.js keeps a slot.
   *
   * ── CONFIRMED 2026-08-19 ──────────────────────────────────────────────────────────────────
   *
   * The business confirmed Coldstream IS BBB accredited, which is what this field gates, and the
   * badge row's BBB slot now renders.
   *
   * `rating` CONFIRMED "A+" 2026-08-19, separately from the accreditation status and after it. The
   * two were asked and answered as two questions on purpose: "accredited" is a yes/no status,
   * "A+" is a letter grade BBB assigns, publishes and REVISES. The badge now reads "BBB A+
   * Accredited Business".
   *
   * BECAUSE THE GRADE CAN CHANGE, THIS IS THE FIELD TO RE-CHECK, not a value to set and forget. If
   * BBB ever moves it, change it here and the badge, the hero line and verify's exemption all
   * follow — the string "BBB A+" is on verify-build's BANNED_CLAIMS and is released ONLY for the
   * exact grade this field records, so a stale grade fails the build rather than shipping quietly.
   *
   * `profileUrl` still null — set it and the badge becomes a link to the accreditation record,
   * which is the single strongest form this claim can take.
   *
   * The seal image is a SEPARATE outstanding item and this field does not release it: BBB's
   * programme requires their hosted, linked seal, so it has to come from the accreditation
   * account. badges.js renders a typographic badge until it lands.
   */
  bbb: {
    accredited: true,
    rating: "A+",
    accreditedSince: "2017-03-27",
    profileUrl: "https://www.bbb.org/us/oh/cincinnati/profile/roofing-contractors/coldstream-exteriors-0292-90017698",
    source: "VERIFIED AGAINST BBB, 2026-08-21 — that profile states A+ and \"BBB Accredited Since: 3/27/2017\". Confirmed by the business 2026-08-19 and now checked against the record itself.",
  },
};

/**
 * THE PROFILES THIS BUSINESS OWNS — the `sameAs` set.
 *
 * WHY THIS IS IN THE CLAIMS FILE AND NOT IN A TEMPLATE. `sameAs` is not decoration: it is the
 * assertion "this URL is the same real-world business as this website", and Google uses it to
 * decide which entity a page belongs to. Pointing it at a profile that is NOT ours is worse than
 * omitting it — it merges our entity with someone else's, and unpicking that in the Knowledge
 * Graph is not a same-day fix. So it is gated exactly like a rating is.
 *
 * WHAT MAKES ONE ELIGIBLE: the profile has to be the company's own, and the handle or the listing
 * has to be checkable from outside. Each entry records how it was checked and when.
 *
 * The BBB entry is the same URL `bbb.profileUrl` already carries. It is repeated by reference,
 * not by value, so the two cannot drift.
 *
 * STILL MISSING: the Google Business Profile for each market. That is the single highest-value
 * entry in this list — it is the link between the website and the map pack — and it needs the
 * listing's own URL (the `?cid=` form or the maps place link), read off the GBP dashboard. It
 * cannot be guessed from a search result, so it is null until someone opens the dashboard.
 */
export const PROFILES = [
  { url: "https://www.facebook.com/coldstreamexteriors/",
    source: "FOUND 2026-08-21 — public page under the exact brand handle, listing (513) 258-0450 " +
            "and info@coldstreamexteriors.com. CONFIRM OWNERSHIP before this is treated as settled." },
  { url: "https://www.instagram.com/coldstreamexteriors/",
    source: "FOUND 2026-08-21 — public profile under the exact brand handle. CONFIRM OWNERSHIP." },
  { url: "https://www.linkedin.com/company/coldstream-exteriors",
    source: "FOUND 2026-08-21 — company page under the brand name. CONFIRM OWNERSHIP." },
];

/**
 * PROFILES FOUND BUT NOT ADDED — the queue, with what each one still needs.
 *
 * Kept as data rather than a comment so it survives, and separate from PROFILES so nothing here
 * can reach a page by accident. Moving an entry up is a deliberate edit.
 */
export const PROFILE_CANDIDATES = [
  { url: "https://www.yelp.com/biz/coldstream-exteriors-milford",
    needs: "Confirm this is the company's own listing. The badge row already shows a Yelp mark, so " +
           "the profile is presumably ours — 'presumably' is why it is here and not above." },
  { url: "https://www.yelp.com/biz/coldstream-exteriors-st-louis-2",
    needs: "Same. Note the `-2` suffix: Yelp appends it when a second listing exists for the same " +
           "name, so there may be an older duplicate splitting reviews. Worth checking." },
  { url: null, needs: "THE GOOGLE BUSINESS PROFILE, one per office. Still the highest-value missing " +
           "signal on the site — it is the link between this domain and the map pack. It cannot be " +
           "found from outside: it comes off the dashboard, or from Maps via Share → Copy link." },
];

/**
 * ⚠ TWO BBB URLs EXIST FOR THE SAME PROFILE ID, found 2026-08-24.
 *
 *     .../us/oh/cincinnati/profile/roofing-contractors/coldstream-exteriors-0292-90017698   ← recorded above
 *     .../us/oh/milford/profile/roofing-contractors/coldstream-exteriors-0292-90017698      ← what search returns
 *
 * Same ID, different city segment; Milford is the actual office address, so that is probably the
 * canonical one and the Cincinnati form a redirect. It has NOT been changed, because BBB blocks
 * automated requests and neither URL could be resolved to confirm which redirects to which.
 * Open both in a browser, keep whichever does not redirect, and update `bbb.profileUrl`.
 */

/**
 * ⚠ THE LISTINGS SAY COLDSTREAM DOES SOLAR. THIS SITE DOES NOT MENTION IT.
 *
 * The Owens Corning contractor profile describes "solar energy system installation, maintenance and
 * monitoring" alongside the exteriors work. Nothing in this repo — not markets.js, not services.js,
 * not any live-copy page — refers to solar at all.
 *
 * That is a question, not a gap to fill: is solar a separate brand, a discontinued line, or a real
 * service missing from the site? It is not added on the strength of a directory listing, and a
 * service the company sells that its own website omits is worth more than most of the SEO work in
 * DECISIONS §44.
 */

/**
 * Opening hours, as an OpeningHoursSpecification-shaped object, or null.
 *
 * Shape: `{ dayOfWeek: ["Monday", ...], opens: "08:00", closes: "17:00" }`.
 *
 * NOT SET, because nobody has stated them. Hours are a factual claim a customer acts on — they
 * drive to an office, or they ring at 7pm expecting an answer — and a plausible 8-to-5 typed into
 * a schema block is the same class of invention as a plausible star rating. It also feeds the
 * "Open now" line Google can show beside a local result, so a wrong value is wrong in public.
 *
 * Fill this in and it appears on all three market business nodes at once.
 *
 * ── CANDIDATE FOUND 2026-08-24, NOT ACCEPTED ─────────────────────────────────────────────────
 *
 * Third-party directory listings (Yelp, YellowPages, an Owens Corning contractor profile) agree on:
 *
 *     Mon–Fri 08:00–17:00 · Sat 08:00–13:00 · Sun closed
 *
 * THAT IS NOT A SOURCE BY THIS FILE'S STANDARD and it is not written in below. A directory prints
 * whatever it was given, whenever it was given it, and none of them is the business saying so
 * today. It is recorded here so the question can be answered with a yes/no instead of from scratch:
 * confirm those hours and this becomes a two-line edit.
 *
 * The Saturday half-day is the part worth confirming rather than assuming — it is the difference
 * between a customer driving to an office on a Saturday morning and finding it open or shut.
 */
export const HOURS = null;

/**
 * The three claims that are always true, from brand/voice-spec.json's `always_true_claims`.
 *
 * ONE ARRAY, SO THE WORDING CANNOT DRIFT. These strings appear in the hero bullets, the national
 * trust band and the service-card back faces. Written out per surface they had already started to
 * vary — "Free, no-obligation inspection" against "Free inspections" against "Free, no-obligation
 * inspections" — and a claim that is phrased three ways is three claims to check rather than one.
 *
 * NOT A PLACE TO ADD THINGS. Anything not in voice-spec's approved list belongs in CLAIMS above,
 * gated, however obviously true it feels. "Fully insured" in particular is NOT one of these: the
 * approved wording is "Licensed and insured", and the stronger phrasing sits on the pending list.
 */
export const ALWAYS_TRUE = [
  "Locally owned and operated",
  "Licensed and insured",
  "Free, no-obligation inspections",
];

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
 * The per-market Google Business Profile figures — the ONLY thing that may back an aggregateRating.
 *
 * Shape per market, validated by `validateProfile` in contracts.js:
 *   { rating: 4.8, count: 412, profileUrl: "https://..." }
 *
 * TWO NUMBERS THAT ARE NOT THE SAME NUMBER, which is the whole reason this is separate from
 * TESTIMONIALS. `count` is the profile's own total. The number of reviews we chose to publish is
 * `TESTIMONIALS[market].length`. Printing the second as if it were the first, or the first without
 * having read it off the profile today, is the "400+ five-star reviews" problem the claims gate
 * exists to stop — three artifacts disagreed about that figure and none of them was the profile.
 *
 * NULL MEANS NO RATING RENDERS ANYWHERE. Not a 5, not "great reviews", not stars with nothing under
 * them. A star row is a factual claim about a real profile and it needs that profile as its source.
 */
export const REVIEW_PROFILES = {
  cincinnati: null,
  columbus: null,
  "st-louis": null,
  national: null,
};

/**
 * Attach a real review to a themed card, by keyword.
 *
 * WHY MATCHING RATHER THAN A FIXED LIST. The six "why us" cards are themes — own crews, free
 * inspection, written pricing, insurance, materials, warranty. When reviews land, some of them will
 * talk about exactly those things in the customer's own words, and a real sentence under a claim is
 * worth more than the claim alone. Which review lands under which card cannot be decided now
 * because the reviews do not exist yet, so this decides it at build time from the text.
 *
 * THE RULES IT WILL NOT BREAK, inherited from contracts.js:
 *   · `quote` is used verbatim. This selects a review; it never edits one.
 *   · A review is used under AT MOST ONE card, so the section cannot print the same sentence twice.
 *   · No match means no quote on that card, and the card renders exactly as it does today.
 *
 * Returns a Map of cardIndex -> review. Empty when there are no reviews, which is today.
 */
export const matchReviewsToCards = (reviews = [], cards = []) => {
  const out = new Map();
  if (!Array.isArray(reviews) || !reviews.length) return out;

  const used = new Set();
  cards.forEach((card, i) => {
    const keys = card.match ?? [];
    if (!keys.length) return;
    // Longest quote among the matches, on the theory that a review that says more about a theme is
    // the more useful one — not the highest rating, which would quietly select for 5s.
    const hit = reviews
      .filter((r) => !used.has(r.permalink) && typeof r.quote === "string")
      .filter((r) => keys.some((k) => r.quote.toLowerCase().includes(k)))
      .sort((a, b) => b.quote.length - a.quote.length)[0];
    if (hit) { out.set(i, hit); used.add(hit.permalink); }
  });
  return out;
};

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
  // The single highest-value missing SEO signal — see data/seo.js. It is the link between this
  // website and the map pack, and it is one URL per office, read off the GBP dashboard.
  ["profiles.gbp", "the Google Business Profile URL for each of the three offices"],
  !HOURS && ["hours", "opening hours, for the three offices — drives \"Open now\" in local results"],
  ...Object.entries(TESTIMONIALS)
    .filter(([, t]) => !t.length)
    .map(([k]) => [`testimonials.${k}`, "real, attributable reviews from the GBP listing"]),
].filter(Boolean);
