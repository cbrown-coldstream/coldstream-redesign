// The global pages — the ones that belong to the company rather than to a metro.
//
// WHAT IS HERE AND WHAT ISN'T, against site-plan's proposed page system
// (`/about-us/ /free-estimate/ /thank-you/ /blog/`):
//
//   /about-us/        BUILT — noindex, see below
//   /free-estimate/   BUILT — indexed. The one canonical conversion page; the live site has four.
//   /thank-you/       BUILT — noindex, as a thank-you page always should be. It is the form's
//                     post target, which until now went nowhere.
//   /financing/       BUILT — noindex. Not in the plan's list, but the footer links to it and
//                     the prototype promised financing on twenty pages. A promise made that
//                     often needs a destination; see data/claims.js for why it is gated.
//   /privacy-policy/  BUILT — noindex. Footer links to it and the estimate form collects a name,
//                     a phone number and a ZIP, so the site cannot ship without one.
//   /terms/           BUILT — noindex, same reason.
//   /blog/            NOT BUILT. In the plan, but there is no content and no editorial owner.
//                     An empty blog index is a thin page with a promise attached.
//
// NOT BUILT ON PURPOSE — /instant-roof-quote/. It appears in the audit as one of the sixteen
// duplicate utility pages being consolidated, NOT in the proposed page system, and there is no
// instant-quote widget or vendor behind it. A page called "instant roof quote" that cannot give
// an instant roof quote is a broken promise, so all four live copies 301 to /free-estimate/.
//
// NOT BUILT, PENDING DATA — /{market}/reviews/ and /{market}/gallery/. Both are in the plan's
// page system; reviews needs the real GBP pull and gallery needs the Contractors Cloud photos.
// The footer used to link to both. Those links are now pointed at real destinations or removed,
// because a link to a page that does not exist is the failure this rebuild is removing.

/**
 * Global pages that build with a noindex because something factual is still missing.
 *
 * Same bar as the service and location pages: build it, keep it out of the index, and name it
 * on every build so the gap cannot rot into a shipped assumption.
 */
export const GLOBAL_PENDING = [
  {
    path: "/instant-roof-quote/",
    needs:
      "the Roofful embed. Page and ?market= routing are built; until the widget is in the repo " +
      "every instant-quote CTA points at /free-estimate/ and the live URLs keep their 301s there.",
  },
  {
    path: "/financing/",
    needs:
      "lender, advertised monthly payment, APR, term and approval criteria. Advertising a " +
      "specific monthly payment triggers Regulation Z disclosure requirements.",
  },
  {
    path: "/privacy-policy/",
    needs:
      "the real data practices — analytics, call tracking, CRM, ad pixels, SMS/TCPA consent, " +
      "retention — then counsel review. Sections with no sourced answer are marked in the page.",
  },
  {
    path: "/terms/",
    needs: "counsel review of the warranty, payment and dispute terms before this indexes.",
  },
];
