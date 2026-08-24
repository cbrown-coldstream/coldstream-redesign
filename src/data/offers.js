// OFFERS & PROMOTIONS — the shell, not the offers. Owner brief 2026-08-24, §8.
//
// Every field is null until Craig confirms the live promotion in writing and, for financing,
// until the lender supplies terms in writing. This is the same architecture as claims.js: the
// section exists, the copy slots exist, and nothing renders until the value behind it is real.
// With everything null the section shows one evergreen card — the free, no-obligation inspection
// and quote — which is already approved and always true.
//
// ── REGULATION Z, AND WHY THE FINANCING CARD HAS ITS OWN GATE ────────────────────────────────
//
// Advertising a specific rate, term or monthly payment is a "triggering term" under Reg Z
// (12 CFR 1026.24): print one and the ad must carry the lender's actual terms and disclosures.
// A rate without its disclosure is not a lean version of the offer — it is the violation itself.
// So the rule here is structural, and verify-build enforces it: if `apr` or `termMonths` is set
// while `disclosure` is null, THE BUILD FAILS. Not a warning. The disclosure text must be the
// lender's own, verbatim — never paraphrased in-house.
//
// `expires` is an ISO date; an offer past it stops rendering at the next build. That is
// build-time, not clock-time — a stale deploy can outlive an expiry by however long nobody
// rebuilds, which is another reason finePrint carries the expiry in words as well.

export const offers = [
  {
    id: "seasonal-discount",
    headline: null,        // e.g. the discount as actually authorised
    services: null,        // which services it applies to
    eligibility: null,     // minimum project value, exclusions
    finePrint: null,       // cannot-be-combined language, expiry in words
    expires: null,         // ISO date; expired offers stop rendering automatically
  },
  {
    id: "financing",
    headline: null,
    lender: null,          // named lender — required before any rate renders
    apr: null,
    termMonths: null,
    disclosure: null,      // verbatim lender-supplied Reg Z disclosure
    expires: null,
  },
];

/** True when an offer has everything it needs to render. Financing needs the lender pair too. */
export const renderable = (o) => {
  if (!o.headline || !o.eligibility || !o.finePrint) return false;
  if (o.id === "financing" && (!o.lender || !o.disclosure)) return false;
  if (o.expires && o.expires < new Date().toISOString().slice(0, 10)) return false;
  return true;
};

/** The Reg Z structural check, exported so verify-build and test:gates exercise the same rule. */
export const regZViolation = (o) =>
  o.id === "financing" && (o.apr != null || o.termMonths != null) && !o.disclosure;

export const liveOffers = () => offers.filter(renderable);
