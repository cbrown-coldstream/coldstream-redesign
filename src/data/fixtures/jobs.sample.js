// SYNTHETIC JOB RECORDS — the contract in ./contracts.js, made concrete.
//
// THESE ARE NOT REAL JOBS AND MUST NEVER REACH A BUILD THAT SHIPS. They exist so the gates can be
// tested from the other side: the location, gallery and service-proof surfaces all currently
// generate nothing, and "the template is finished and waiting" is only a claim until something
// has actually gone through it. `npm run test:gates` injects these, builds, asserts the pages
// appear and the sitemap lists them, and then requires the flag to be off again.
//
// They are loaded ONLY when COLDSTREAM_FIXTURES=1. A normal build never merges them, and the
// build prints a loud banner when it does — see locations.js and claims.js.
//
// They are also the worked example for the pull. Each field below is one a Contractors Cloud
// export has to fill, and the five records deliberately cover the awkward cases:
//
//   · one that clears every surface (Milford)
//   · one with materials and scope but NO photo — clears service-proof, not gallery
//   · one publishable: false — appears nowhere, and proves default-deny works
//   · one in a market-level pool with no area filed (Dublin) — gallery yes, location page no
//   · one older than 24 months — gallery yes, service-proof no

export const SAMPLE_JOBS = [
  {
    jobId: "FIXTURE-1",
    market: "cincinnati",
    town: "Milford",
    service: "roofing",
    completedOn: "2026-04-18",
    materials: ["GAF Timberline HDZ, Charcoal", "GAF WeatherWatch ice & water at the eaves"],
    scope: "Full tear-off, 34 squares, decking replaced across the north slope, ridge vent added.",
    detail: "Full tear-off and replacement on a 1970s split-level. The north slope decking had gone soft under two layers, so it came off to the rafters before anything went back on.",
    publishable: true,
    consent: { by: "homeowner, at final walkthrough", on: "2026-04-19" },
    photos: [
      { src: "/video/hero-poster.jpg", alt: "Finished charcoal asphalt roof on a two-storey split-level, ridge vent visible along the peak", w: 1280, h: 720, altSource: "crew lead, on site" },
    ],
  },
  {
    jobId: "FIXTURE-2",
    market: "cincinnati",
    town: "Loveland",
    service: "siding",
    completedOn: "2026-02-02",
    materials: ["James Hardie ColorPlus, Arctic White", "Hardie trim at corners and openings"],
    scope: "Full re-side, 2,100 sq ft, rotted base course replaced on the west elevation.",
    detail: "Vinyl came off, fiber cement went on. The base course on the west wall had taken years of splash-back and had to be rebuilt before siding.",
    publishable: true,
    consent: { by: "homeowner, written", on: "2026-02-06" },
    // NO PHOTOS, deliberately. Clears service-proof — materials and scope are on file — and fails
    // the gallery bar, which is the distinction the contract exists to make.
  },
  {
    jobId: "FIXTURE-3",
    market: "cincinnati",
    town: "Mason",
    service: "roofing",
    completedOn: "2026-05-30",
    materials: ["GAF Timberline HDZ, Weathered Wood"],
    scope: "Storm replacement, insurance claim, 28 squares.",
    detail: "Hail claim from the April storms — documented for the adjuster and replaced once it settled.",
    publishable: false,          // DEFAULT DENY, made explicit. Appears on no surface at all.
    photos: [
      { src: "/video/hero-poster.jpg", alt: "Roof mid-replacement with underlayment exposed", w: 1280, h: 720, altSource: "crew lead, on site" },
    ],
  },
  {
    jobId: "FIXTURE-4",
    market: "columbus",
    town: "Dublin",
    service: "roofing",
    completedOn: "2026-06-11",
    materials: ["GAF Timberline HDZ, Barkwood"],
    scope: "Tear-off and replacement, 26 squares, new step flashing at the chimney.",
    detail: "Replacement on a 1990s two-storey. The old step flashing at the chimney had been caulked over rather than replaced, which is where the leak was.",
    publishable: true,
    consent: { by: "homeowner, at final walkthrough", on: "2026-06-12" },
    photos: [
      { src: "/video/hero-poster.jpg", alt: "Completed brown asphalt roof with new metal step flashing at a brick chimney", w: 1280, h: 720, altSource: "crew lead, on site" },
    ],
    // Columbus has no areas defined, so this lands in the market-level pool: it earns a gallery
    // and cannot earn a location page. That is the Columbus situation exactly.
  },
  {
    jobId: "FIXTURE-5",
    market: "st-louis",
    town: "Kirkwood",
    service: "gutters",
    completedOn: "2023-09-14",   // older than 24 months — gallery yes, service-proof no
    materials: ["6-inch seamless aluminium, K-style"],
    scope: "Full gutter replacement with oversized downspouts to the rear.",
    detail: "The original 5-inch runs could not carry a Kirkwood downpour off a roof that size, so they went up a size and the downspouts moved.",
    publishable: true,
    consent: { by: "homeowner, written", on: "2023-09-15" },
    photos: [
      { src: "/video/hero-poster.jpg", alt: "New white seamless K-style gutter along a roof edge with a downspout at the corner", w: 1280, h: 720, altSource: "crew lead, on site" },
    ],
  },
];

/** Fixture jobs grouped the way LOCATIONS stores them: by market, then by area key or the pool. */
export const sampleJobsFor = (marketSlug) => SAMPLE_JOBS.filter((j) => j.market === marketSlug);
