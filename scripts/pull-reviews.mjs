// PULL THE GOOGLE REVIEWS. Run: npm run reviews:pull
//
// DELIBERATELY NOT PART OF `npm run build`. A build must not depend on a third-party API being up,
// a key being present, or a quota having room — every deploy would become a coin toss. Reviews are
// pulled when someone decides to pull them, the result is committed, and the build reads a file.
//
// ── WHY BUILD-TIME AND NOT CLIENT-SIDE ───────────────────────────────────────────────────────
//
// This site is static output on a host with no runtime. A browser-side fetch would need the Places
// key in the page, and a Places key in public HTML is a billable key anyone can lift. There is no
// server to proxy through, so the fetch has to happen here, at a moment a person chose.
//
// ── WHAT GOOGLE'S POLICY ACTUALLY SAYS, CHECKED 2026-08-17 ───────────────────────────────────
//
// Source: https://developers.google.com/maps/documentation/places/web-service/policies
//
//   CACHING — CONFIRMED: "You must not pre-fetch, cache, or store Places API content beyond the
//   allowed exceptions." Place IDs are the named exception: "the place ID, used to uniquely identify
//   a place, is exempt from the caching restrictions. You can therefore store place ID values
//   indefinitely." That is why the place IDs live in env vars and the review text does not live
//   anywhere permanent.
//
//   CACHE DURATION — NOT CONFIRMED, AND I WILL NOT INVENT ONE. The widely-repeated "30 consecutive
//   calendar days" figure appears in the Maps Platform Service Specific Terms against LATITUDE AND
//   LONGITUDE for the Directions and Geocoding APIs. I could not verify it extends to Places review
//   text; cloud.google.com/maps-platform/terms truncates on fetch and the Places policy page states
//   no duration at all.
//
//   SO THE CADENCE IS CONSERVATIVE BY CHOICE, NOT BY GUESS: treat reviews.json as short-lived.
//   Re-pull before any deploy that displays reviews, and do not let it sit for months. If someone
//   needs a defensible number, it has to come from Google's terms or their support — not from here.
//
//   ATTRIBUTION — CONFIRMED, AND IT IS A REQUIREMENT NOT A COURTESY: "always credit the author when
//   displaying photos or reviews. Each photo and review includes an author attribution (author's
//   avatar image, name, and profile link)." So the component shows name, avatar and a link, and
//   `author_url` is required per review — a review we cannot attribute is dropped here rather than
//   rendered anonymously.
//
//   ORDERING — CONFIRMED: "Include a clear notice that describes how reviews are being ordered and
//   filtered including any search criteria applied." We apply NO ordering and NO filtering, and the
//   component says so on the page. Nothing here sorts by rating or drops a low one.
//
//   AVATARS — the policy addresses displaying them and is silent on storing them. Since it also
//   forbids caching Places content generally, the compliant reading is to REFERENCE Google's URL at
//   render time and never download the image. That is what this does: the URL is stored as returned
//   and the file is never fetched.
//
// ── FAILURE IS LOUD AND NEVER PARTIAL ────────────────────────────────────────────────────────
//
// If a key is missing, a request fails, or a market returns nothing usable, this exits non-zero and
// writes NOTHING. Overwriting a good file with a partial one is the failure mode that matters: the
// site would silently lose reviews it had, and nobody would notice until someone looked.
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";

const OUT = resolve(process.cwd(), "src/data/generated/reviews.json");

const KEY = process.env.GOOGLE_PLACES_API_KEY;
// Place IDs default from MARKET_PROFILES — the canonical GBP links Craig supplied 2026-08-24
// carry the place_id in the URL, so the pull no longer waits on env vars for them. An env var
// still overrides, for the day a listing is replaced. The API key remains the one missing input.
const idFrom = (slug) =>
  (MARKET_PROFILES[slug]?.gbp?.match(/place_id:([A-Za-z0-9_-]+)/) ?? [])[1] ?? null;
const PLACES = {
  cincinnati: process.env.GOOGLE_PLACE_ID_CINCINNATI ?? idFrom("cincinnati"),
  columbus: process.env.GOOGLE_PLACE_ID_COLUMBUS ?? idFrom("columbus"),
  "st-louis": process.env.GOOGLE_PLACE_ID_ST_LOUIS ?? idFrom("st-louis"),
};

const die = (msg) => {
  console.error(`\n  ✗ ${msg}\n`);
  console.error("    Nothing was written — any existing reviews.json is untouched.");
  console.error("    See .env.example for the variables this needs.\n");
  process.exit(1);
};

if (!KEY) die("GOOGLE_PLACES_API_KEY is not set.");
const missing = Object.entries(PLACES).filter(([, id]) => !id).map(([m]) => m);
if (missing.length) die(`No place ID for: ${missing.join(", ")}`);

// Places API (New) — Place Details. `reviews` is capped at five per place by the API itself: there
// is no pagination and no sort parameter. Fifteen reviews across three markets is the ceiling, and
// the section is designed for exactly that rather than pretending more will arrive.
const FIELDS = "id,displayName,rating,userRatingCount,googleMapsUri,reviews";

async function fetchPlace(market, placeId) {
  const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
    headers: { "X-Goog-Api-Key": KEY, "X-Goog-FieldMask": FIELDS },
  });
  if (!res.ok) {
    const body = await res.text();
    die(`${market}: Places API returned ${res.status}\n    ${body.slice(0, 300)}`);
  }
  return res.json();
}

const out = { pulledAt: new Date().toISOString(), markets: {} };
let totalReviews = 0;

for (const [market, placeId] of Object.entries(PLACES)) {
  const p = await fetchPlace(market, placeId);

  // AS RETURNED. No sort, no filter, no sentiment threshold — see the ORDERING note above. The only
  // records dropped are ones that cannot be attributed or have no text, because an unattributed
  // review breaks the policy and an empty one has nothing to show.
  const reviews = (p.reviews ?? [])
    .map((r) => ({
      // ── THE CONTRACT'S FIELD NAMES, because contracts.js is the shape this has to satisfy.
      // `validateReview` requires market, name, rating, quote, date and permalink, and the first
      // version of this script wrote the Places API's own names instead — it satisfied the field
      // list it was given and failed the contract it was told to meet. Both now, rather than a
      // translation layer somewhere later that nobody remembers is there.
      market,
      name: r.authorAttribution?.displayName ?? null,
      rating: typeof r.rating === "number" ? r.rating : null,
      // VERBATIM AND NOT TRIMMED. Rule 1 of the contract. If Google ever returns text with
      // surrounding whitespace, validateReview will say so — that is the check working, and it is
      // not this script's business to quietly normalise a customer's words.
      quote: r.originalText?.text ?? r.text?.text ?? null,
      // ISO date only; the contract's ISO_DATE is YYYY-MM-DD. The full timestamp is kept as `time`.
      date: (r.publishTime ?? "").slice(0, 10) || null,
      permalink: r.googleMapsUri ?? p.googleMapsUri ?? null,

      // ── THE PLACES-NATIVE EXTRAS the section actually renders, named as the API names them.
      // `author_url` and `profile_photo_url` are not optional decoration: Google's attribution
      // requirement is avatar, name AND profile link, so a review without a link is dropped below.
      author_url: r.authorAttribution?.uri ?? null,
      profile_photo_url: r.authorAttribution?.photoUri ?? null,
      relative_time_description: r.relativePublishTimeDescription ?? null,
      time: r.publishTime ?? null,
    }))
    .filter((r) => r.name && r.author_url && r.quote && r.rating && r.date && r.permalink);

  if (!reviews.length) die(`${market}: no usable reviews returned — refusing to write an empty market.`);

  out.markets[market] = {
    // The profile's own figures. These and only these may back an aggregate — see contracts.js on
    // why "reviews we publish" and "reviews the profile has" are different numbers.
    rating: typeof p.rating === "number" ? p.rating : null,
    count: Number.isInteger(p.userRatingCount) ? p.userRatingCount : null,
    profileUrl: p.googleMapsUri ?? null,
    reviews,
  };
  totalReviews += reviews.length;
  console.log(`  ${market.padEnd(12)} ${reviews.length} reviews · ${p.rating ?? "?"}★ of ${p.userRatingCount ?? "?"}`);
}

mkdirSync(dirname(OUT), { recursive: true });
const header = {
  $generated: "GENERATED BY scripts/pull-reviews.mjs — DO NOT HAND-EDIT.",
  $policy:
    "Google Places API content. Displayed as returned: not edited, not filtered by sentiment, not " +
    "reordered. Attribution is required and rendered. Treat this file as short-lived — re-pull " +
    "before a deploy that shows reviews. See the header of pull-reviews.mjs for what the policy " +
    "does and does not say about cache duration.",
};
writeFileSync(OUT, JSON.stringify({ ...header, ...out }, null, 2) + "\n");

console.log(`\n  → src/data/generated/reviews.json — ${totalReviews} reviews across ${Object.keys(out.markets).length} markets`);
console.log("    Committed as data. Re-run before a deploy that displays them.\n");
