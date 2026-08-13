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

  hero: {
    eyebrow: "Central Ohio Roofing and Exteriors",
    headline: "Roofing and Exteriors Built for Central Ohio Weather",
    sub: "Free estimates with honest pricing from our Galloway office. Backed by our own Central Ohio crews and a 25-year workmanship warranty.",
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
};
