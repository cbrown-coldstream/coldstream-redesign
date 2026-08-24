// St. Louis market landing. Same template, different content object.
//
// The only market carrying garage doors — set on the market's `services` array, so the header
// nav, the services grid and the footer all pick it up without a per-page exception.
export const stLouis = {
  title: "Roofing & Exteriors in St. Louis, MO | Coldstream Exteriors",
  description:
    "Roofing, siding, windows, gutters and garage doors across Greater St. Louis. Free, no-obligation inspections and a 25-year workmanship warranty.",

  // HERO SUB REWRITTEN ON THE TEAM CALL (2026-08-18). It used to end "backed by our own local
  // crews", which reads as though a crew is sourced per market — i.e. subcontracted. We do not sub.
  // The differentiator is one point of contact: a project manager who stays on the job rather than
  // a salesperson who hands off at signing. Market-scoped, and it lives here rather than in Hero.
  hero: {
    eyebrow: "Greater St. Louis Roofing and Exteriors",
    headline: "Roofing, Siding and Exteriors Across Greater St. Louis",
    sub: "One project manager runs your job from the first walk-through to the last nail — the same person, start to finish, not a salesperson who hands you off after you sign. Free estimates from our Geyer Road office and a 25-year workmanship warranty.",
    // Market-scoped CTA — see Hero.astro. Edited here, not in the component.
    cta: "Get my free St. Louis estimate →",
  },
  services: {
    heading: "One team for your whole exterior",
    intro: "Roofing is the core. Siding, windows, gutters and garage doors complete the home.",
  },
  why: {
    heading: "Straightforward from quote to cleanup",
    cards: [
      { title: "Honest, upfront pricing", body: "A clear quote after a free inspection — no surprises, no pressure, no games on price." },
      { title: "One project manager, start to finish", body: "The person who quotes the job runs the job, and is the person you call afterwards." },
      { title: "Backed by a 25-year warranty", body: "A 25-year workmanship warranty, fully insured, and factory-certified installers." },
    ],
  },
  roofing: {
    eyebrow: "Roofing in St. Louis",
    heading: "Everything roofing, on one page",
    intro: "Sections of the roofing page — not separate pages.",
    cards: [
      { title: "Roof Replacement", body: "Full tear-off and installation, sized and priced after a free inspection." },
      { title: "Roof Repair", body: "Leaks, emergency, storm, hail and wind damage — all handled here as one repair section." },
      { title: "Storm and Insurance Claims", body: "Straight-line wind and hail come through most summers. We document the damage and work directly with your adjuster." },
      // RESTORED (build order, round 6). The Page System has /st-louis/commercial-roofing/, so the
      // market offers it again and this card links there.
      { title: "Commercial Roofing", body: "Flat, TPO, EPDM and coatings for multi-family and commercial buildings.", service: "commercial-roofing", requiresService: true },
      // GARAGE DOORS HAS NO PAGE IN THE INVENTORY, and it is a real service in this market — the
      // only market that carries it. So it is described here, on the market landing, and
      // /st-louis/garage-doors/ 301s to this page rather than 404ing. No `service` reference,
      // because there is no page to link to. See DECISIONS.md.
      { title: "Garage Doors", body: "Installation and replacement, insulated options included — usually scheduled alongside a roofing or siding project so it is one crew and one visit." },
    ],
  },
  areas: {
    heading: "Serving Greater St. Louis",
    // One office, one name for it. The prototype called this "Sunset Hills" here and "Geyer Road"
    // in the hero — two names for one address is how NAP drift starts.
    intro: "Based at our Geyer Road office — serving these communities across the county.",
  },
  reviews: {
    heading: "Proven. Trusted. Backed by Your Neighbors.",
    intro: "Feedback from St. Louis-area homeowners who trusted us with their roofing, siding and exterior projects.",
  },
  faq: [
    { q: "How much does a new roof cost in St. Louis?", a: "It depends on size, pitch and material — and St. Louis has a lot of older housing stock with steeper, more complicated rooflines. We give you an exact, no-obligation quote after a free inspection." },
    { q: "Do you work on older homes?", a: "Yes. Much of the metro is pre-war brick, and those roofs need different flashing and ventilation detailing than a new build. That's normal work for us, not an exception." },
    { q: "Do you install garage doors?", a: "Yes, in St. Louis. Installation and replacement, usually alongside a roofing or siding project so it's one crew and one schedule." },
    { q: "How long does a roof replacement take?", a: "Most homes are finished in a single day. We'll give you a clear timeline up front and leave the property clean." },
  ],
  cta: {
    heading: "Ready for a free, no-pressure estimate?",
    body: "Tell us what you need — we'll take a look and give you an honest number.",
  },
  // ── BODY COPY DEPTH (team call, 2026-08-18) ───────────────────────────────────────────────
  // Written from St. Louis's own conditions: hail, humidity, and a brick housing stock that is
  // close to unique in the Midwest. Nothing here transfers to the Ohio markets.
  depth: {
    eyebrow: "Working on Greater St. Louis homes",
    heading: "Hail, humidity, and a city built out of brick",
    intro: "St. Louis has a housing stock that does not look like anywhere else we work, and a storm season that does most of the damage in a handful of afternoons.",
    blocks: [
      { h: "Hail is the single biggest driver",
        p: ["This market sits where it gets real hail, and a bad afternoon can bruise every roof on a street. Hail damage is also the kind that does not announce itself: the granules come off, the mat underneath is exposed, and the roof looks fine from the driveway while its remaining life quietly halves.",
            "That is why most of our St. Louis work starts as an inspection rather than a quote. We photograph what we find the way an adjuster needs it documented, and if the honest answer is that there is no claim here, we say that."] },
      { h: "Brick changes the whole conversation",
        p: ["South City, The Hill, Tower Grove and much of the older county are brick, and brick houses fail at the joints rather than the field — the tuckpointing, the chimney, the parapet, the flashing where brick meets roof.",
            "It also means siding work here is often trim, soffit and fascia rather than a full elevation. A siding quote that assumes a frame house will be wrong on a brick one, and we do not write one until we have seen which we are dealing with."] },
      { h: "Humidity, and what it does to attics",
        p: ["Summers here are genuinely humid, and a poorly ventilated attic in August is a moisture problem before it is a temperature one. We see decking that has cupped, nail heads that have rusted through from the underside, and insulation that has been quietly damp for years.",
            "None of that is visible from outside. It is the reason our inspection includes the attic wherever we can safely get into it."] },
      { h: "South County, West County and one town north",
        p: ["The served area is really two: South County and the southern city through Affton, Oakville, Mehlville and down to Arnold, and West County through Kirkwood, Webster Groves, Chesterfield, Des Peres and Creve Coeur. Berkeley is our one North County entry.",
            "Those are different housing stocks and different price points, and we quote them differently. Working out of the Geyer Road office puts us in the middle of both."] },
    ],
  },

};
