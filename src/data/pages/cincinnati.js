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
    "Roofing, siding, windows and gutters across greater Cincinnati, from our Milford office. Free, no-obligation inspections and a 25-year workmanship warranty.",

  hero: {
    eyebrow: "Cincinnati's Trusted Roofing Contractors",
    headline: "Roofing, Siding, Window & Gutter Services in Cincinnati",
    sub: "Free estimates with honest pricing. No surprises. Backed by our own Southwest Ohio crews and a 25-year workmanship warranty.",
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
    { q: "How much does a new roof cost in Cincinnati?", a: "It depends on size, pitch and material. We walk the roof, then give you an exact, no-obligation quote — not a number from a satellite image." },
    { q: "Can you help with a storm or insurance claim?", a: "Yes. We inspect and document the damage, then work directly with your adjuster to make the claim as smooth as possible." },
    { q: "How long does a roof replacement take?", a: "Most homes are finished in a single day. We'll give you a clear timeline up front and leave the property clean." },
  ],

  cta: {
    heading: "Ready for a free, no-pressure estimate?",
    body: "Tell us what you need — we'll take a look and give you an honest number.",
  },
};
