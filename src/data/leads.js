// LEAD PLUMBING CONFIG — everything here is OWNER-SUPPLIED, and everything unsupplied is null.
// Null never renders a fake: forms fall back to the static /thank-you/ flow, the calculator
// renders its labeled pending state, the Instagram section renders a labeled placeholder.
// (Rambow audit phase 5, 2026-08-31.)

// CONTRACTORS CLOUD — three accounts, ONE PER MARKET, never shared across markets (the brief is
// explicit). Each value is that market's form-intake endpoint URL. While null, the form submits
// to the static thank-you page exactly as before and the integration is inert.
// ⚠ THE PER-MARKET MAPPING IS UNRESOLVED (Rambow review, 2026-08-31). The CC account holds
// FIVE companies, not the three this file assumed:
//   1043  Coldstream Exteriors
//   1047  Coldstream Exteriors            (duplicate name, different settings)
//   1098  Coldstream Exteriors - Columbus
//   1435  Coldstream Solar
//   1576  West & Davis Homes
// No company is explicitly named St. Louis. Which of 1043/1047 is Cincinnati and which (if
// either) is St. Louis is NOT guessable from names — DO NOT wire an endpoint here until the
// owner confirms the mapping. Endpoints stay null and the forms stay on the static flow.
export const CC_ENDPOINTS = {
  cincinnati: null,   // ⚠ unresolved — see mapping note above
  columbus: null,     // ⚠ likely company 1098, unconfirmed — do not wire without confirmation
  "st-louis": null,   // ⚠ no named St. Louis company exists — mapping must come from the owner
};

// PRICING CALCULATOR — multipliers are supplied, never invented (brief: "I will supply them").
// Shape, when it arrives:
//   {
//     sqftMin: 800, sqftMax: 6000,
//     services: {
//       roofing: { label: "Roof replacement", perSqftLow: 0, perSqftHigh: 0,
//                  tiers: { good: 1.0, better: 1.25, best: 1.6 } },
//       siding:  { ... }, windows: { ... }, gutters: { ... },
//     },
//   }
// While null the calculator renders a labeled "awaiting rates" card and no number anywhere.
export const PRICING = null;

// INSTAGRAM — the embed markup or handle config for the homepage feed. While null the section
// renders a labeled placeholder, never a fake feed.
export const INSTAGRAM = null;

// ZIP PREFIXES per market, for the service-area checker. These are the standard three-digit
// ZIP prefixes of the metro areas the town lists already claim — no coverage promise is made
// from a prefix alone; the component's wording is "looks like our area", never "we cover you".
export const ZIP_PREFIXES = {
  cincinnati: ["450", "451", "452", "410", "411"],   // SW Ohio + Northern Kentucky river towns
  columbus: ["430", "431", "432"],                   // central Ohio
  "st-louis": ["630", "631", "633"],                 // St. Louis city/county + St. Charles
};
