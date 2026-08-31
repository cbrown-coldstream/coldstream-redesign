// SYNTHETIC GOOGLE REVIEWS — FOR LOOKING AT THE LAYOUT, NEVER FOR SHIPPING.
//
// ── READ THIS BEFORE USING IT ────────────────────────────────────────────────────────────────
//
// Every name below begins with "FIXTURE" and every quote says so. That is not decoration, it is the
// safety mechanism: scripts/verify-build.mjs fails any build whose HTML contains the string FIXTURE
// — "a build that shipped them would be publishing fabricated endorsements" — so this data cannot
// reach a deployed page without someone deliberately defeating a gate.
//
// WHY IT IS QUARANTINED BEHIND AN ENV VAR RATHER THAN WRITTEN TO A FILE. The obvious way to preview
// the section is to write a placeholder src/data/generated/reviews.json. That file is committed in
// normal use — the host builds from the repo, so real reviews have to be in git — which means a
// placeholder version is one `git add -A` away from being deployed. Netlify runs `npm run build`,
// not `npm run verify`, so the gate would not stop it. Nothing is written here at all: the data is
// only reachable with COLDSTREAM_FIXTURES=1 on the command line, exactly like the synthetic reviews
// in claims.js.
//
//   COLDSTREAM_FIXTURES=1 npm run build && npm run preview      # look at it
//   npm run build                                               # back to empty, no cleanup needed
//
// THE SHAPE IS THE PULL'S OUTPUT SHAPE, and it satisfies contracts.js — same field names, same
// required fields — so what you are looking at is the real layout with real structure, not a mock.
//
// FIVE PER MARKET IS THE CEILING the Places API imposes, so the counts here are 5, 4 and 3: the
// design has to survive an uneven set, and this is where you find out whether it does.
//
// The ratings are not all 5. A wall of fives is what invented data looks like, and the section has
// to handle a 3 without the layout flinching — Google's terms forbid filtering by sentiment, so a
// real pull will contain them.

const g = (n) => `https://maps.google.com/fixture/contrib/${n}`;
const r = (n) => `https://maps.google.com/fixture/review/${n}`;

export const SAMPLE_PLACES_REVIEWS = {
  pulledAt: "2026-08-17T00:00:00.000Z",
  $fixture: "SYNTHETIC. COLDSTREAM_FIXTURES=1 only. verify-build fails if this reaches built HTML.",
  markets: {
    cincinnati: {
      rating: 4.8,
      count: 137,
      profileUrl: "https://maps.google.com/fixture/place/cincinnati",
      reviews: [
        { market: "cincinnati", name: "FIXTURE — Not A Real Reviewer", rating: 5,
          quote: "FIXTURE TEXT, NOT A REAL REVIEW. Long enough to show how a card handles four or five lines of a homeowner talking about a tear-off, because that is the length most real ones land at.",
          date: "2026-08-09", permalink: r("c1"), author_url: g("c1"),
          profile_photo_url: null, relative_time_description: "a week ago", time: "2026-08-09T00:00:00Z" },
        { market: "cincinnati", name: "FIXTURE — Also Not Real", rating: 5,
          quote: "FIXTURE TEXT. Short one — the card has to look deliberate at two lines too.",
          date: "2026-08-02", permalink: r("c2"), author_url: g("c2"),
          profile_photo_url: null, relative_time_description: "2 weeks ago", time: "2026-08-02T00:00:00Z" },
        { market: "cincinnati", name: "FIXTURE — Third Placeholder", rating: 4,
          quote: "FIXTURE TEXT. A four-star one, because a column of nothing but fives is what fabricated data looks like and the layout should not depend on it.",
          date: "2026-07-21", permalink: r("c3"), author_url: g("c3"),
          profile_photo_url: null, relative_time_description: "a month ago", time: "2026-07-21T00:00:00Z" },
        { market: "cincinnati", name: "FIXTURE — Fourth Placeholder", rating: 5,
          quote: "FIXTURE TEXT. Middling length, gutters and a downspout, nothing more.",
          date: "2026-07-04", permalink: r("c4"), author_url: g("c4"),
          profile_photo_url: null, relative_time_description: "2 months ago", time: "2026-07-04T00:00:00Z" },
        { market: "cincinnati", name: "FIXTURE — Fifth Placeholder", rating: 3,
          quote: "FIXTURE TEXT. A three-star one. Google's terms forbid filtering by sentiment, so a real pull will contain these and the design has to carry one without flinching.",
          date: "2026-06-18", permalink: r("c5"), author_url: g("c5"),
          profile_photo_url: null, relative_time_description: "2 months ago", time: "2026-06-18T00:00:00Z" },
      ],
    },
    columbus: {
      rating: 4.9,
      count: 64,
      profileUrl: "https://maps.google.com/fixture/place/columbus",
      reviews: [
        { market: "columbus", name: "FIXTURE — Columbus One", rating: 5,
          quote: "FIXTURE TEXT, NOT A REAL REVIEW. Siding on a two-story, written at the length people actually write at when they are pleased and not trying.",
          date: "2026-08-12", permalink: r("o1"), author_url: g("o1"),
          profile_photo_url: null, relative_time_description: "5 days ago", time: "2026-08-12T00:00:00Z" },
        { market: "columbus", name: "FIXTURE — Columbus Two", rating: 5,
          quote: "FIXTURE TEXT. Storm damage and an insurance adjuster.",
          date: "2026-07-30", permalink: r("o2"), author_url: g("o2"),
          profile_photo_url: null, relative_time_description: "3 weeks ago", time: "2026-07-30T00:00:00Z" },
        { market: "columbus", name: "FIXTURE — Columbus Three", rating: 4,
          quote: "FIXTURE TEXT. A longer one to check that a column with four reviews still fills its height without the marquee looking thin, which is the failure mode at this cap.",
          date: "2026-07-11", permalink: r("o3"), author_url: g("o3"),
          profile_photo_url: null, relative_time_description: "a month ago", time: "2026-07-11T00:00:00Z" },
        { market: "columbus", name: "FIXTURE — Columbus Four", rating: 5,
          quote: "FIXTURE TEXT. Windows, and a crew that cleaned up.",
          date: "2026-06-25", permalink: r("o4"), author_url: g("o4"),
          profile_photo_url: null, relative_time_description: "2 months ago", time: "2026-06-25T00:00:00Z" },
      ],
    },
    "st-louis": {
      // NO PROFILE FIGURES ON PURPOSE. This is the "reviews but no aggregate" branch — the column
      // should show its reviews and claim no average, rather than printing a zero or a made-up star.
      rating: null,
      count: null,
      profileUrl: null,
      reviews: [
        { market: "st-louis", name: "FIXTURE — St Louis One", rating: 5,
          quote: "FIXTURE TEXT, NOT A REAL REVIEW. This market deliberately has no rating or count, so you can see what a column looks like when the profile figures are missing.",
          date: "2026-08-14", permalink: r("s1"), author_url: g("s1"),
          profile_photo_url: null, relative_time_description: "3 days ago", time: "2026-08-14T00:00:00Z" },
        { market: "st-louis", name: "FIXTURE — St Louis Two", rating: 4,
          quote: "FIXTURE TEXT. Second of three — the shortest column, which is the one that tests whether three reads as finished.",
          date: "2026-08-01", permalink: r("s2"), author_url: g("s2"),
          profile_photo_url: null, relative_time_description: "2 weeks ago", time: "2026-08-01T00:00:00Z" },
        { market: "st-louis", name: "FIXTURE — St Louis Three", rating: 5,
          quote: "FIXTURE TEXT. Third and last.",
          date: "2026-07-09", permalink: r("s3"), author_url: g("s3"),
          profile_photo_url: null, relative_time_description: "a month ago", time: "2026-07-09T00:00:00Z" },
      ],
    },
  },
};
