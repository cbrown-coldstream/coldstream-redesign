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
// ── THE WHOLE SET WAS RESUPPLIED 2026-08-14 ─────────────────────────────────────────────────
//
// All seven badges now come from artwork supplied directly, replacing the WordPress media-library
// uploads this row was first built from. Two things that were wrong before are fixed by the swap
// rather than by code:
//
//   · Owens Corning is now the "Preferred Contractor" lockup. The alt text has claimed that since
//     this file was written while the artwork was the bare corporate logo; image and alt finally
//     agree.
//   · The png and webp of each badge are now the same image at the same dimensions. They were not:
//     james-hardie-elite shipped a 1024x853 webp beside a 592x488 png, so the declared size was
//     right for one format and wrong for the other.
//
// The old uploads are deleted rather than kept alongside. Two files for one badge is how a row
// ends up half-updated, which is exactly the state this replaced.
//
// ── THE GAF TIER, RESOLVED ──────────────────────────────────────────────────────────────────
//
// This file used to withhold the tier: three artefacts disagreed (site-plan said "GoldElite", the
// old asset filename said "Commercial Roofers", the brief said "Certified"), and misstating a
// manufacturer certification is a compliance problem rather than a copy nit, so alt said only
// "GAF".
//
// That position had stopped making sense. The artwork ITSELF reads "GAF GoldElite™ Commercial
// Contractor" and always did — the tier was already on screen for every sighted visitor, and
// withholding it from alt text only meant a screen reader got less than the image said.
//
// The supplied asset is GAF-issued artwork naming the tier, and it agrees with site-plan and with
// the old filename's "Commercial". That is the strongest source available and it is now the one
// used. If GAF's contractor portal ever disagrees, the portal wins and this line changes with it.
//
// ONE THING STILL PENDING, DELIBERATELY:
//
//   `href` is null on every review badge. Linking a review profile to a guessed URL is worse than
//   not linking it. Fill these in and they become links automatically.
//
// BBB REMAINS TEXT-ONLY. No image asset exists — BBB's seal programme requires their hosted,
// linked seal, so it has to come from the accreditation account. The slot renders a labelled
// placeholder rather than a fabricated seal.

export const BADGES = [
  {
    key: "owens-corning",
    alt: "Owens Corning Preferred Contractor",
    file: "/badges/owens-corning-preferred.webp",
    fallback: "/badges/owens-corning-preferred.png",
    w: 798, h: 248,
    href: null,
    source: "supplied artwork, 2026-08-14",
  },
  {
    key: "homeadvisor",
    alt: "HomeAdvisor Top Rated",
    file: "/badges/homeadvisor-top-rated.webp",
    fallback: "/badges/homeadvisor-top-rated.png",
    w: 580, h: 666,
    href: null,            // PENDING — HomeAdvisor profile URL
    source: "supplied artwork, 2026-08-14",
  },
  {
    key: "yelp",
    alt: "Yelp Reviews",
    file: "/badges/yelp-five-star.webp",
    fallback: "/badges/yelp-five-star.png",
    w: 451, h: 334,
    href: null,            // PENDING — Yelp profile URL
    source: "supplied artwork, 2026-08-14",
  },
  {
    key: "google",
    // FEWER PIXELS THAN THE FILE IT REPLACED (184x189 against 450x228) AND STILL THE RIGHT SWAP.
    // The row caps by height, so what matters is how much of the frame is logo rather than the raw
    // count: the old upload carried a wide margin of empty white, this one is cropped to the mark,
    // and at the same cap it reads larger. It is also the smallest asset in the row, so it is the
    // one that limits how far the height cap can go — see .badge img in base.css.
    alt: "Google Reviews",
    file: "/badges/google-five-star.webp",
    fallback: "/badges/google-five-star.png",
    w: 184, h: 189,
    href: null,            // PENDING — Google Business Profile review URL
    source: "supplied artwork, 2026-08-14",
  },
  {
    key: "angi",
    alt: "Angi Reviews",
    file: "/badges/angi-five-star.webp",
    fallback: "/badges/angi-five-star.png",
    w: 310, h: 221,
    href: null,            // PENDING — Angi profile URL
    source: "supplied artwork, 2026-08-14",
  },
  {
    key: "james-hardie",
    alt: "James Hardie Alliance Elite Contractor",
    file: "/badges/james-hardie-elite.webp",
    fallback: "/badges/james-hardie-elite.png",
    w: 592, h: 488,
    href: null,
    source: "supplied artwork, 2026-08-14 — png and webp now match, see header",
  },
  {
    key: "gaf",
    // Tier stated, from the artwork. See "THE GAF TIER, RESOLVED" above before changing this.
    alt: "GAF GoldElite Commercial Contractor",
    file: "/badges/gaf-goldelite-commercial.webp",
    fallback: "/badges/gaf-goldelite-commercial.png",
    w: 738, h: 210,
    href: null,
    source: "supplied artwork, 2026-08-14",
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
