// CREDENTIAL badges for the hero row.
//
// ── REVIEW LOGOS RESTORED 2026-08-19, REVERSING THE TRIM BELOW ──────────────────────────────
//
// The 08-18 trim described in the next block was REVERSED on instruction: Google, Yelp and Angi
// are back in the row alongside the accreditations, and BBB is unblocked. The reasoning that
// removed them is left below rather than deleted, because a reversal is only readable next to what
// it reversed.
//
// ⚠ ONE THING TO KNOW ABOUT THE THREE REVIEW ASSETS. All three depict FIVE FILLED STARS. That is a
// rating claim made in artwork, and no rating is sourced yet — TESTIMONIALS is empty, every entry
// in REVIEW_PROFILES is null, and the market reviews pages are noindex "no sourced reviews yet".
// verify-build's unsourced-claim scan reads TEXT and cannot see inside a PNG, so this is NOT a
// gate the build can hold for you. `npm run reviews:pull` fills in the real Google figures; if a
// pulled rating comes back below 5.0, these three assets and the row disagree with it.
//
// ── CREDENTIALS ONLY, AND PER MARKET (team call, 2026-08-18) — REVERSED, SEE ABOVE ───────────
//
// The row used to mix two different kinds of thing: accreditations we hold (GAF, James Hardie,
// BBB, HomeAdvisor) and review-platform logos (Google, Yelp, Angi). They argue differently — a
// certification says a manufacturer trained and vetted us, a platform logo says people can leave
// us reviews there — and a row that mixes them reads as neither. The platform logos came out; the
// reviews section says what the profiles actually hold, with real numbers.
//
// WHICH CREDENTIALS SHOW IS NOW A PER-MARKET DATA FIELD. `markets.js` carries a `credentials`
// array of keys; this file carries the artwork for each. Manufacturer programmes genuinely differ
// by market — Leaf Preferred is Columbus-only and Malarkey is St. Louis-only, both unconfirmed and
// therefore ABSENT — so adding one later is a key in one array, not a change here or in the
// component.
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
//   · OWENS CORNING IS GONE ENTIRELY (team call, 2026-08-18): we do not run that line. The badge,
//     the partner-strip entry, the MANUFACTURERS row and both artwork files were removed rather
//     than commented out — a credential we do not hold is worse than a missing one.
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

import { CLAIMS } from "./claims.js";

export const BADGES = [
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
    key: "yelp",
    alt: "Yelp Reviews",
    file: "/badges/yelp-five-star.webp",
    fallback: "/badges/yelp-five-star.png",
    w: 451, h: 334,
    href: null,            // PENDING — Yelp profile URL
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
    // ── RESTORED 2026-08-19, REVERSING THE 08-18 REMOVAL ────────────────────────────────────
    // Taken out on the team call as "a line we do not run" — a credential we do not hold is worse
    // than a missing one — and put back on instruction. Artwork recovered from git (94a1981^);
    // it was deleted rather than kept, so `public/` could not supply it.
    //
    // ⚠ "PREFERRED CONTRACTOR" IS A SPECIFIC TIER, and it is the wording the supplied artwork
    // carries. Owens Corning runs Preferred and Platinum; the two are not interchangeable and a
    // misstated manufacturer certification is a compliance problem rather than a copy nit — the
    // same reasoning that kept the GAF tier withheld until the artwork itself settled it. This
    // says exactly what the asset says and claims nothing beyond it.
    key: "owens-corning",
    alt: "Owens Corning Preferred Contractor",
    file: "/badges/owens-corning-preferred.webp",
    fallback: "/badges/owens-corning-preferred.png",
    w: 798, h: 248,
    href: null,
    source: "supplied artwork, 2026-08-14 — restored from git 2026-08-19",
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
    // ── ACCREDITATION AND A+ GRADE BOTH CONFIRMED 2026-08-19 ────────────────────────────────
    //
    // ALT AND LABEL ARE COMPUTED IN BadgeRow, not fixed here, because they depend on the grade in
    // claims.js rather than on anything in this file. "BBB Accredited Business" and "BBB A+
    // Accredited Business" are TWO DIFFERENT CLAIMS — the second adds a grade BBB assigns and can
    // revise — and both were confirmed, so the badge prints the grade. Clear CLAIMS.bbb.rating and
    // the wording drops back to the status alone with no change here.
    //
    // ── THE REAL SEAL, 2026-08-21 ────────────────────────────────────────────────────────────
    // BBB's OWN artwork, served from m.bbb.org and the same asset their profile page uses, rather
    // than anything recreated. It is the "NoRating" seal, so the mark says ACCREDITED BUSINESS and
    // prints no grade — the A+ is carried in the alt text, and more usefully the badge now LINKS TO
    // THE ACCREDITATION RECORD, which is the strongest form this claim can take: a reader can check
    // it instead of taking our word for it.
    //
    // The href resolves from CLAIMS.bbb.profileUrl rather than sitting here, because the URL is the
    // evidence for the claim and evidence belongs with the claim. See BadgeRow's hrefFor.
    // ── CRAIG'S SEAL, 2026-08-25, GATED ON CLAIMS.bbbLogo ────────────────────────────────────
    // When bbbLogo is set the row renders the owner-supplied artwork (an AI recreation — the
    // concern is on record in claims.js and DECISIONS; the owner overrode it). Clear bbbLogo and
    // the row falls back to BBB's own hosted seal below, which never leaves the repo.
    alt: null,
    file: CLAIMS.bbbLogo ? CLAIMS.bbbLogo.replace(/\.png$/, ".webp") : "/badges/bbb-accredited-seal.svg",
    fallback: CLAIMS.bbbLogo ?? undefined,
    w: CLAIMS.bbbLogo ? 473 : 962, h: CLAIMS.bbbLogo ? 600 : 369,
    href: null,             // resolved from CLAIMS.bbb.profileUrl — see BadgeRow
    source: CLAIMS.bbbLogo
      ? "owner-supplied artwork 2026-08-25 (brand/logos/bbb-a-plus.png) — see claims.js bbbLogo"
      : "https://m.bbb.org/brand/seals/Accredited_Business_Seal_NoRating_RGB.svg — BBB's own seal artwork",
  },
];

// The manufacturer/product strip further down the page is a DIFFERENT row and stays distinct
// from the accreditation badges above.
export const MANUFACTURERS = [
  "James Hardie", "James Hardie Elite", "ProVia", "Royal",
  "Norandex", "CertainTeed", "WinCore", "Owens Corning",
];
