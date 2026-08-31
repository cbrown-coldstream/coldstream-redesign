// PROJECT SHOWCASE PHOTOS — real completed jobs, for the rotating home carousels.
//
// THE SOURCE IS NAMED PER PHOTO because that is the whole claims argument: a photo of "our work"
// is a claim, and each entry records where it came from. Two origins so far:
//
//   · live/     — the three photos scraped from the live WordPress site (round 49 finding: the
//                 live site holds only three real project photos in total).
//   · projects/ — pulled from Contractors Cloud on owner instruction (2026-08-27, "pull in our
//                 homes… in contractors cloud"). The first set is job COL2641 — a completed
//                 James Hardie re-side in the Columbus market, photos uploaded 2026-08-17 by the
//                 crew. Filenames are anonymised to market only; no customer name, street or
//                 house number appears in any caption.
//
// ⚠ CONSENT CAVEAT, ON RECORD: the Contractors Cloud pull gives us the photos, not the
// homeowner's sign-off to publish them. The gallery contract (contracts.js) requires consent per
// photo before the GALLERY ships; the owner directed these into the showcase now. Staging is
// noindex. Before production cutover, confirm consent for COL2641 or swap these entries out —
// they are data, so that is a three-line edit.
//
// MATERIAL IS ONLY CLAIMED WHERE THE JOB RECORD NAMES IT. COL2641 is titled "Hardie" in
// Contractors Cloud, so these captions say James Hardie. The two live-site photos keep the
// round-49 rule: the caption claims the work, not the product, because nobody has verified what
// is on those walls.
//
// Shape matches whatwedo.js: { base, dir, w, h, alt } resolves to /photos/{dir}/{base}.{ext}.

export const HARDIE_SHOWCASE = [
  { base: "hardie-columbus-front-1400x1050", dir: "projects", w: 1400, h: 1050,
    alt: "Two-story home in the Columbus area with new James Hardie fiber cement siding in slate blue",
    label: "James Hardie fiber cement", caption: "Full re-side, Columbus area — completed 2026" },
  { base: "hardie-columbus-angle-1400x1050", dir: "projects", w: 1400, h: 1050,
    alt: "Corner view of the same Columbus-area home showing James Hardie lap siding and white trim",
    label: "James Hardie fiber cement", caption: "Lap siding with wrapped trim, Columbus area" },
  { base: "hardie-columbus-rear-1400x1050", dir: "projects", w: 1400, h: 1050,
    alt: "Rear elevation with new James Hardie lap siding and new white window trim",
    label: "James Hardie fiber cement", caption: "Rear elevation, same project — every side matters" },
];

export const SIDING_SHOWCASE = [
  ...HARDIE_SHOWCASE,
  { base: "Cincinnati-siding-1-1024x771", dir: "live", w: 1024, h: 771,
    alt: "Completed Coldstream siding project on a Cincinnati home",
    label: "Siding", caption: "Completed siding project, Cincinnati" },
  { base: "415775438-848354917293152-631252259915544195-n-1", dir: "live", w: 900, h: 675,
    alt: "Blue two-story home with siding installed by Coldstream Exteriors",
    label: "Siding", caption: "Whole-home siding by our crew" },
];
