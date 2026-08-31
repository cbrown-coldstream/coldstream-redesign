// LEAD PLUMBING CONFIG — everything here is OWNER-SUPPLIED, and everything unsupplied is null.
// Null never renders a fake: forms fall back to the static /thank-you/ flow, the calculator
// renders its labeled pending state, the Instagram section renders a labeled placeholder.
// (Rambow audit phase 5, 2026-08-31.)

// CONTRACTORS CLOUD — three accounts, ONE PER MARKET, never shared across markets (the brief is
// explicit). Each value is that market's form-intake endpoint URL. While null, the form submits
// to the static thank-you page exactly as before and the integration is inert.
export const CC_ENDPOINTS = {
  cincinnati: null,   // ⚠ awaiting endpoint from Craig
  columbus: null,     // ⚠ awaiting endpoint from Craig
  "st-louis": null,   // ⚠ awaiting endpoint from Craig
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
