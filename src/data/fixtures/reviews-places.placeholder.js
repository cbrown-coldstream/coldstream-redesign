// DEPLOYABLE SAMPLE REVIEWS — the office-by-office section's placeholder mode.
//
// This is the sibling of reviews-places.sample.js with the OPPOSITE deployment rule, and the
// difference is one word. That file's content says FIXTURE, which verify-build refuses to ship —
// it exists to preview layout locally and can never reach staging. THIS file says SAMPLE, is
// self-describing in every name and quote, renders under an on-page banner declaring it invented,
// and ships to staging deliberately: the owner reviews pending sections on staging and asked
// (2026-08-24, reaffirmed twice, logged as DECISIONS §59) for labeled placeholders over absence.
// Same ruling extended to this section on 2026-08-27 — DECISIONS §60.
//
// The layout stress-tests are inherited from the fixture set on purpose: uneven columns (5/4/3),
// non-five ratings (Google's terms forbid filtering by sentiment, so a real pull will contain
// them), one market with no profile figures. What the fixture set links, this set does not:
// author_url and profileUrl are null, because a sample card must not point at a Google URL that
// does not exist.
//
// It never overrides real data — ReviewsByMarket only reaches for it when generated/reviews.json
// is absent and the page passed placeholders={true}. The first real pull replaces all of it.

export const SAMPLE_PLACES_PLACEHOLDERS = {
  $sample: "SELF-LABELED SAMPLE CONTENT. Ships to staging under an on-page banner. DECISIONS §60.",
  markets: {
    cincinnati: {
      // NO rating, NO count — and not by oversight. The fixture set carries 4.8/137 and 4.9/64;
      // shipping those tripped the unsourced-claim gate ("4.8" on /) and the gate is right: an
      // invented figure against a REAL Google profile is a checkable false claim, banner or not
      // (the §59 guardrail). Sample columns render the neutral no-figures line; the real
      // aggregates appear the moment reviews:pull writes them.
      reviews: [
        { name: "Sample — Not A Real Reviewer", rating: 5,
          quote: "SAMPLE TEXT, NOT A REAL REVIEW. Long enough to show how a card handles four or five lines of a homeowner talking about a tear-off, because that is the length most real ones land at.",
          author_url: null, profile_photo_url: null, relative_time_description: "a week ago" },
        { name: "Sample — Also Not Real", rating: 5,
          quote: "SAMPLE TEXT. Short one — the card has to look deliberate at two lines too.",
          author_url: null, profile_photo_url: null, relative_time_description: "2 weeks ago" },
        { name: "Sample — Third Placeholder", rating: 4,
          quote: "SAMPLE TEXT. A four-star one, because a column of nothing but fives is what fabricated data looks like and the layout should not depend on it.",
          author_url: null, profile_photo_url: null, relative_time_description: "a month ago" },
        { name: "Sample — Fourth Placeholder", rating: 5,
          quote: "SAMPLE TEXT. Middling length, gutters and a downspout, nothing more.",
          author_url: null, profile_photo_url: null, relative_time_description: "2 months ago" },
        { name: "Sample — Fifth Placeholder", rating: 3,
          quote: "SAMPLE TEXT. A three-star one. Google's terms forbid filtering by sentiment, so a real pull will contain these and the design has to carry one without flinching.",
          author_url: null, profile_photo_url: null, relative_time_description: "2 months ago" },
      ],
    },
    columbus: {
      reviews: [
        { name: "Sample — Columbus One", rating: 5,
          quote: "SAMPLE TEXT, NOT A REAL REVIEW. Siding on a two-story, written at the length people actually write at when they are pleased and not trying.",
          author_url: null, profile_photo_url: null, relative_time_description: "5 days ago" },
        { name: "Sample — Columbus Two", rating: 5,
          quote: "SAMPLE TEXT. Storm damage and an insurance adjuster.",
          author_url: null, profile_photo_url: null, relative_time_description: "3 weeks ago" },
        { name: "Sample — Columbus Three", rating: 4,
          quote: "SAMPLE TEXT. A longer one to check that a column with four reviews still fills its height without the marquee looking thin, which is the failure mode at this cap.",
          author_url: null, profile_photo_url: null, relative_time_description: "a month ago" },
        { name: "Sample — Columbus Four", rating: 5,
          quote: "SAMPLE TEXT. Windows, and a crew that cleaned up.",
          author_url: null, profile_photo_url: null, relative_time_description: "2 months ago" },
      ],
    },
    "st-louis": {
      reviews: [
        { name: "Sample — St Louis One", rating: 5,
          quote: "SAMPLE TEXT, NOT A REAL REVIEW. No column shows a star average or count while these are samples — real profile figures appear only once the Google pull runs.",
          author_url: null, profile_photo_url: null, relative_time_description: "3 days ago" },
        { name: "Sample — St Louis Two", rating: 4,
          quote: "SAMPLE TEXT. Second of three — the shortest column, which is the one that tests whether three reads as finished.",
          author_url: null, profile_photo_url: null, relative_time_description: "2 weeks ago" },
        { name: "Sample — St Louis Three", rating: 5,
          quote: "SAMPLE TEXT. Last one. A closing card that ends the loop cleanly.",
          author_url: null, profile_photo_url: null, relative_time_description: "a month ago" },
      ],
    },
  },
};
