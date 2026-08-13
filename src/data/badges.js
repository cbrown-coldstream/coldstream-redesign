// Review and accreditation badges for the hero row, in the order the live site uses.
//
// SELF-HOSTED. Files live in /public/badges/ — the live WordPress uploads are never hotlinked.
// Each carries its native dimensions so an explicit width/height can be emitted and CLS stays
// at zero; the row normalises by HEIGHT in CSS, because a 640x640 square beside a 920x313
// wordmark looks wrong at equal widths.
//
// ALT TEXT IS REAL. The live site ships every one of these with alt="", which tells a screen
// reader nothing and wastes the accreditation signal.
//
// TWO THINGS PENDING, BOTH DELIBERATE:
//
//   1. BBB has no image asset anywhere on the live site — it exists as text only. The slot is
//      built and renders a labelled placeholder. Not fabricated: BBB's seal programme requires
//      their hosted, linked seal, so it has to come from the accreditation account.
//
//   2. `href` is null on every review badge. Linking a review profile to a guessed URL is worse
//      than not linking it. Fill these in and they become links automatically.
//
// GAF TIER IS UNVERIFIED. Three different claims exist for it: site-plan says "GoldElite", the
// asset filename says "Commercial Roofers", and the brief says "Certified". Misstating a
// manufacturer certification tier is a compliance problem, not a copy nit, so the alt text
// below states only the manufacturer until the tier is confirmed.

export const BADGES = [
  {
    key: "owens-corning",
    alt: "Owens Corning Preferred Contractor",
    file: "/badges/owens-corning.webp",
    fallback: "/badges/owens-corning.png",
    w: 920, h: 313,
    href: null,
    source: "https://coldstreamexteriors.com/wp-content/uploads/2025/11/owens-corning-logo-1.webp",
  },
  {
    key: "homeadvisor",
    alt: "HomeAdvisor Top Rated",
    file: "/badges/homeadvisor-top-rated.webp",
    fallback: "/badges/homeadvisor-top-rated.png",
    w: 640, h: 640,
    href: null,            // PENDING — HomeAdvisor profile URL
    source: "https://coldstreamexteriors.com/wp-content/uploads/2025/11/HomeAdvisor-Top-Rated-Badge-1.webp",
  },
  {
    key: "yelp",
    alt: "Yelp Reviews",
    file: "/badges/yelp-reviews.webp",
    fallback: "/badges/yelp-reviews.png",
    w: 666, h: 375,
    href: null,            // PENDING — Yelp profile URL
    source: "https://coldstreamexteriors.com/wp-content/uploads/2025/11/yelp-reviews-removebg-preview-1.png",
  },
  {
    key: "google",
    alt: "Google Reviews",
    file: "/badges/google-reviews.webp",
    fallback: "/badges/google-reviews.png",
    w: 450, h: 228,
    href: null,            // PENDING — Google Business Profile review URL
    source: "https://coldstreamexteriors.com/wp-content/uploads/2025/11/Google-reviews-1-2.webp",
  },
  {
    key: "angi",
    alt: "Angi Reviews",
    file: "/badges/angi-reviews.webp",
    fallback: "/badges/angi-reviews.png",
    w: 500, h: 250,
    href: null,            // PENDING — Angi profile URL
    source: "https://coldstreamexteriors.com/wp-content/uploads/2025/11/angi-reviews-1.webp",
  },
  {
    key: "james-hardie",
    alt: "James Hardie Alliance Elite Contractor",
    file: "/badges/james-hardie-elite.webp",
    fallback: "/badges/james-hardie-elite.png",
    w: 1024, h: 853,
    href: null,
    source: "https://coldstreamexteriors.com/wp-content/uploads/2025/11/image-5-1024x853-1-2.webp",
  },
  {
    key: "gaf",
    alt: "GAF",                 // tier withheld until confirmed — see header note
    file: "/badges/gaf.webp",
    fallback: "/badges/gaf.png",
    w: 710, h: 182,
    href: null,
    source: "https://coldstreamexteriors.com/wp-content/uploads/2025/11/Coldstream-Exteriors-GAF-Commercial-Roofers-11-18-2025_07_07_PM-1.png",
  },
  {
    key: "bbb",
    alt: "BBB A+ Accredited Business",
    file: null,                 // PENDING — no asset exists; renders a labelled placeholder
    pendingLabel: "BBB A+ · asset pending",
    w: null, h: null,
    href: null,
  },
];

// The manufacturer/product strip further down the page is a DIFFERENT row and stays distinct
// from the accreditation badges above.
export const MANUFACTURERS = [
  "James Hardie", "James Hardie Elite", "ProVia", "Royal",
  "Norandex", "CertainTeed", "WinCore", "Owens Corning",
];
