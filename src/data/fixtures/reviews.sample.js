// SYNTHETIC REVIEWS — the GBP half of the contract in ./contracts.js, made concrete.
//
// THESE ARE NOT REAL REVIEWS AND MUST NEVER REACH A BUILD THAT SHIPS. Fabricated endorsements are
// the specific thing the claims gate was built to prevent, so these are quarantined harder than
// the job fixtures: loaded only under COLDSTREAM_FIXTURES=1, announced by a banner on every build
// that loads them, and asserted absent by the verify script on any normal build.
//
// The permalinks below point at example.com deliberately. A fixture that looked like a real Google
// review URL would be the one thing here that could be mistaken for evidence.
//
// The set covers the cases that matter:
//
//   · a four-star review — the site must render four stars, not five
//   · a review with a line break and an unedited typo, kept exactly as written
//   · one market with reviews and two without, so the gate is visible in both states

export const SAMPLE_REVIEWS = {
  columbus: [
    {
      market: "columbus",
      name: "FIXTURE — Not A Real Reviewer",
      rating: 5,
      quote: "They showed up when they said they would, put a tarp over the whole flowerbed before they started, and I did not find a single nail in the driveway afterwards.",
      date: "2026-06-20",
      permalink: "https://example.com/fixture-review-1",
      service: "roofing",
    },
    {
      market: "columbus",
      name: "FIXTURE — Also Not Real",
      // FOUR stars. The site rendered a hardcoded five on every card until this fixture existed.
      rating: 4,
      quote: "Good work on the roof and a fair price. Took a week longer than they first told me because of the rain, and I would rather have been told that up front — but the job itself is solid.",
      date: "2026-05-02",
      permalink: "https://example.com/fixture-review-2",
      service: "roofing",
    },
  ],
  cincinnati: [],
  "st-louis": [],
};

/** Per-market profile figures. Only these may ever back an aggregateRating. */
export const SAMPLE_PROFILES = {
  columbus: { rating: 4.7, count: 132, profileUrl: "https://example.com/fixture-gbp-columbus" },
};
