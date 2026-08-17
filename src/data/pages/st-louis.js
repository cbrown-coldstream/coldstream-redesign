// St. Louis market landing. Same template, different content object.
//
// The only market carrying garage doors — set on the market's `services` array, so the header
// nav, the services grid and the footer all pick it up without a per-page exception.
export const stLouis = {
  title: "Roofing & Exteriors in St. Louis, MO | Coldstream Exteriors",
  description:
    "Roofing, siding, windows, gutters and garage doors across Greater St. Louis. Free, no-obligation inspections and a 25-year workmanship warranty.",

  hero: {
    eyebrow: "Greater St. Louis Roofing and Exteriors",
    headline: "Roofing, Siding and Exteriors Across Greater St. Louis",
    sub: "Free estimates with honest pricing from our Geyer Road office. Backed by our own local crews and a 25-year workmanship warranty.",
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
      { title: "Our own crews, start to finish", body: "The people who quote the job are the people who do it. No subcontractor gets handed the keys to your house." },
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
};
