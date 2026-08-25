// Cincinnati market landing — page content only.
//
// Geography, phone, services and served areas come from markets.js; nothing market-scoped is
// retyped here. That separation is what makes Columbus and St. Louis a data file each rather
// than a new layout.
//
// COPY COMPLIANCE — what changed from the prototype and why:
//
//   · "a lifetime workmanship warranty"  ->  "a 25-year workmanship warranty"   (hero sub)
//   · "Backed for life / Lifetime workmanship warranty"
//                                        ->  "Backed by a 25-year warranty / A 25-year
//                                            workmanship warranty"              (why card 3)
//     Only three claims are pre-approved as always true, and the warranty one is 25-year.
//     "Lifetime" is a materially larger promise than the approved claim.
//
//   · "you pay nothing until the project is complete"
//                                        ->  "no payment is due until the project is finished
//                                            and you're satisfied"              (why card 2, FAQ)
//     Same fact, stated the way the brief specifies, and it avoids drifting toward a
//     satisfaction guarantee — the exact phrasing that is banned outright.
//
//   · "Absolutely." -> "Yes."            (storm/insurance FAQ) — plainspoken, not salesy.
//   · Removed "[own page? — D4]" and the in-copy build annotations entirely.
//
// The prototype carried NO banned filler and no instance of "guarantee", so most lines survive
// unchanged. All four "guarantee" instances live on the WordPress national home page, which is
// being retired.
export const cincinnati = {
  title: "Roofing & Exteriors in Cincinnati, OH | Coldstream Exteriors",
  description:
    "Roofing, siding, windows and gutters across greater Cincinnati, from our Milford office. Free, no-obligation inspections and industry-leading warranties.",

  // HERO SUB REWRITTEN ON THE TEAM CALL (2026-08-18). It used to end "backed by our own local
  // crews", which reads as though a crew is sourced per market — i.e. subcontracted. We do not sub.
  // The differentiator is one point of contact: a project manager who stays on the job rather than
  // a salesperson who hands off at signing. Market-scoped, and it lives here rather than in Hero.
  hero: {
    eyebrow: "Cincinnati's Trusted Roofing Contractors",
    headline: "Roofing, Siding, Window & Gutter Services in Cincinnati",
    sub: "One project manager runs your job from the first walk-through to the last nail — the same person, start to finish, not a salesperson who hands you off after you sign. Free estimates, honest pricing, and industry-leading warranties.",
    // Market-scoped CTA — see Hero.astro. Edited here, not in the component.
    cta: "Get my free Cincinnati estimate →",
  },

  services: {
    heading: "One team for your whole exterior",
    intro: "Roofing is the core. Siding, windows and gutters complete the home.",
  },

  why: {
    heading: "Straightforward from quote to cleanup",
    cards: [
      { title: "Honest, upfront pricing", body: "A clear quote after a free inspection — no surprises, no pressure, no games on price." },
      { title: "One project manager, start to finish", body: "The person who quotes the job runs the job, and is the person you call afterwards." },
      { title: "Backed by industry-leading warranties", body: "Industry-leading warranties, fully insured, and one team for the whole exterior." },
    ],
  },

  roofing: {
    eyebrow: "Roofing in Cincinnati",
    heading: "Everything roofing, on one page",
    intro: "Sections of the roofing page — not separate pages.",
    cards: [
      { title: "Roof Replacement", body: "Full tear-off and installation, sized and priced after a free inspection." },
      { title: "Roof Repair", body: "Leaks, emergency, storm, hail and wind damage — all handled here as one repair section." },
      { title: "Storm and Insurance Claims", body: "We document the damage and work directly with your adjuster." },
      { title: "Commercial Roofing", body: "Flat, TPO, EPDM and coatings for multi-family and commercial buildings.", service: "commercial-roofing", requiresService: true },
    ],
  },

  areas: {
    heading: "Serving greater Cincinnati",
    intro: "Based at our Milford office — serving these communities.",
  },

  reviews: {
    heading: "Proven. Trusted. Backed by Your Neighbors.",
    intro: "Feedback from Cincinnati homeowners who trusted us with their roofing, siding and exterior projects.",
  },


  faq: [
    { q: "How much does a new roof cost in Cincinnati?", a: "It depends on size, pitch and material. We carry out a thorough inspection, then give you an exact, no-obligation quote — not a number from a satellite image." },
    { q: "Can you help with a storm or insurance claim?", a: "Yes. We inspect and document the damage, then work directly with your adjuster to make the claim as smooth as possible." },
    { q: "How long does a roof replacement take?", a: "Most homes are finished in a single day. We'll give you a clear timeline up front and leave the property clean." },
  ],

  cta: {
    heading: "Ready for a free, no-pressure estimate?",
    body: "Tell us what you need — we'll take a look and give you an honest number.",
  },
  // ── BODY COPY DEPTH (team call, 2026-08-18) ───────────────────────────────────────────────
  // Written from Cincinnati's own conditions: the Ohio River valley, hillside drainage, and a
  // pre-war housing stock. None of it would be true if you swapped the city name in.
  depth: {
    eyebrow: "Working on Southwest Ohio homes",
    heading: "What the river valley does to a roof",
    intro: "Cincinnati sits in a river valley, and that shapes almost everything about how houses here fail. Here is what we actually find when we get on a roof in this market.",
    blocks: [
      { h: "Freeze-thaw is the main event",
        p: ["The valley holds moisture and the temperature crosses freezing far more often here than the raw winter average suggests. Water gets into a hairline crack in a shingle or a flashing joint, freezes overnight, expands, and opens the crack a little wider. Do that fifty times a winter and a roof that looked fine in October is leaking by March.",
            "It is why we spend so much time on flashing and valleys rather than on the open field of a roof. The field is rarely where a Cincinnati roof lets go."] },
      { h: "Hillside houses drain differently",
        p: ["Half this market is built on a slope. In Mount Adams, Clifton and along the east side through Amberley Village and Indian Hill, roofs shed onto ground that is already moving water downhill, and a gutter that would be adequate on flat ground backs up in a heavy summer storm.",
            "On a hillside property we size the downspouts for the run and check where the water actually goes once it leaves them. A gutter that empties against a foundation on a slope is a basement problem waiting for the right storm."] },
      { h: "Pre-war brick and frame",
        p: ["A lot of the older stock here is brick with a slate or tile roof originally, replaced at some point with asphalt. Those roofs often have complicated rooflines, low-slope porch sections and original decking that has been patched more than once.",
            "That matters for pricing honesty: we will not quote a tear-off on a house like that without getting up there, because what is under the last layer decides the job. A satellite measurement cannot see soft decking."] },
      { h: "Butler County and Northern Kentucky",
        p: ["North through Fairfield, Hamilton and Ross the housing gets newer and the hail gets worse — that stretch takes more hail damage than the core city does, and it is where most of our insurance work comes from.",
            "Across the river, Cold Spring and the Northern Kentucky side are a different permitting picture again. We work both, and the estimate says which rules apply to your address."] },
    ],
  },

};
