// Columbus market landing. Same template as Cincinnati, different content object.
//
// The plan's uniqueness bar applies: a unique H1 not reused across markets, local proof, unique
// FAQ answers, the local phone and address. Copy below is written for Central Ohio — it is not
// the Cincinnati file with the city swapped, which is exactly the pattern the consolidation is
// removing (the audit found 100+ neighbourhood pages that differed only by synonyms).
export const columbus = {
  title: "Roofing & Exteriors in Columbus, OH | Coldstream Exteriors",
  description:
    "Roofing, siding, windows and gutters across Central Ohio, from Dublin to Gahanna. Free, no-obligation inspections and a 25-year workmanship warranty.",

  // HERO SUB REWRITTEN ON THE TEAM CALL (2026-08-18). It used to end "backed by our own local
  // crews", which reads as though a crew is sourced per market — i.e. subcontracted. We do not sub.
  // The differentiator is one point of contact: a project manager who stays on the job rather than
  // a salesperson who hands off at signing. Market-scoped, and it lives here rather than in Hero.
  hero: {
    eyebrow: "Central Ohio Roofing and Exteriors",
    headline: "Roofing and Exteriors Built for Central Ohio Weather",
    sub: "One project manager runs your job from the first walk-through to the last nail — the same person, start to finish, not a salesperson who hands you off after you sign. Free estimates from our Galloway office and a 25-year workmanship warranty.",
    // Market-scoped CTA — see Hero.astro. Edited here, not in the component.
    cta: "Get my free Columbus estimate →",
  },
  services: {
    heading: "One team for your whole exterior",
    intro: "Roofing is the core. Siding, windows and gutters complete the home.",
  },
  why: {
    heading: "Straightforward from quote to cleanup",
    cards: [
      { title: "Honest, upfront pricing", body: "A clear quote after a free inspection — no surprises, no pressure, no games on price." },
      { title: "Our own crews, start to finish", body: "The people who quote the job are the people who do it. No subcontractor gets handed the keys to your house." },
      { title: "Backed by a 25-year warranty", body: "A 25-year workmanship warranty, fully insured, and factory-certified installers." },
    ],
  },
  roofing: {
    eyebrow: "Roofing in Columbus",
    heading: "Everything roofing, on one page",
    intro: "Sections of the roofing page — not separate pages.",
    cards: [
      { title: "Roof Replacement", body: "Full tear-off and installation, sized and priced after a free inspection." },
      { title: "Roof Repair", body: "Leaks, emergency, storm, hail and wind damage — all handled here as one repair section." },
      { title: "Storm and Insurance Claims", body: "Central Ohio takes a run of spring hail most years. We document the damage and work directly with your adjuster." },
      { title: "Commercial Roofing", body: "Flat, TPO, EPDM and coatings for multi-family and commercial buildings.", service: "commercial-roofing", requiresService: true },
    ],
  },
  areas: {
    heading: "Serving Central Ohio",
    intro: "Based at our Galloway office — serving these communities.",
  },
  reviews: {
    heading: "Proven. Trusted. Backed by Your Neighbors.",
    intro: "Feedback from Columbus-area homeowners who trusted us with their roofing, siding and exterior projects.",
  },
  faq: [
    { q: "How much does a new roof cost in Columbus?", a: "It depends on size, pitch and material. We walk the roof, then give you an exact, no-obligation quote — not a number from a satellite image." },
    { q: "Do you handle hail claims in Central Ohio?", a: "Yes. Spring hail is the most common reason Columbus homeowners call us. We inspect, document the damage properly, and work directly with your adjuster." },
    { q: "Which areas around Columbus do you cover?", a: "From our Galloway office we cover the metro and the ring suburbs — Dublin, Westerville, Gahanna, Hilliard, Grove City, New Albany, Upper Arlington and Worthington among them. The full list is above." },
    { q: "How long does a roof replacement take?", a: "Most homes are finished in a single day. We'll give you a clear timeline up front and leave the property clean." },
  ],
  cta: {
    heading: "Ready for a free, no-pressure estimate?",
    body: "Tell us what you need — we'll take a look and give you an honest number.",
  },
  // ── BODY COPY DEPTH (team call, 2026-08-18) ───────────────────────────────────────────────
  // Written from Columbus's own conditions: flat open ground, wind, and a suburban ring largely
  // built in the 1990s and 2000s. Deliberately shares no structure with the other markets.
  depth: {
    eyebrow: "Working on Central Ohio homes",
    heading: "Flat ground, open wind, and a lot of houses the same age",
    intro: "Columbus is a ring city on flat ground, and its housing stock is unusually uniform. Both of those change what goes wrong and when.",
    blocks: [
      { h: "Wind, not slope, is the problem here",
        p: ["There is very little to break the wind across Central Ohio. Storms come across open ground and hit a roofline at full strength, and what fails first is almost always an edge — a ridge cap, a rake edge, the first course above a gable.",
            "So the details we fuss over here are different from a hillside market. Starter course, nailing pattern and ridge attachment are where a Columbus roof is won or lost, and a roof that loses shingles in the first big blow usually lost them at the perimeter."] },
      { h: "A suburban ring built within about fifteen years",
        p: ["Dublin, Powell, Hilliard, New Albany, Westerville and Gahanna filled in largely between the early nineties and the mid two-thousands. That means an enormous number of houses in this market are hitting twenty-five to thirty years old at the same time — which is exactly when an original builder-grade roof stops being repairable.",
            "It is why we do more full replacements and fewer patch jobs here than in the other markets. If your neighbours are all replacing roofs, that is not a coincidence and it is not a sales pitch — the street went up together."] },
      { h: "Ice damming on shallow pitches",
        p: ["A lot of that same building era used shallow pitches and generous overhangs. Snow sits on a shallow pitch instead of shedding, warm attic air melts it from underneath, the water runs to a cold eave and refreezes. The dam it forms pushes water back up under the shingles.",
            "The fix is rarely the roof surface. It is ventilation and ice-and-water protection at the eave, and if someone quotes you a Columbus ice dam without looking in the attic, they are guessing."] },
      { h: "The ring is not one place",
        p: ["I-270 makes Columbus easy to describe and misleading to treat as uniform. German Village and Clintonville are pre-war and dense; Galena and Grove City are neither. We cover the whole ring from the Galloway office, and the estimate reflects the house rather than the metro average."] },
    ],
  },

};
