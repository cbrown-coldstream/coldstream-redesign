// TEMPLATE 1 — national home. Content only.
//
// PORTED FROM THE LIVE HOME PAGE (round 7), section by section, rewritten rather than copied. The
// live page's order is kept: hero · trust band · intro + form · services per market · why us ·
// partners · paying for it · locations · FAQ · final CTA.
//
// TWO THINGS DROPPED ON INSTRUCTION:
//   · the three "OUR SERVICE AREA" blocks that sat beside the per-market service lists
//   · the market selector block — the geo redirect, the header phone and the footer's three
//     offices carry the routing now. The utility bar's market <select> is still on every page,
//     so a misdetected or out-of-area visitor always has a control to hand.
//
// WHAT COULD NOT BE PORTED, AND WHY. Most of the live page's persuasion is unsourced claims, and
// the claims gate does not have an exception for the home page:
//
//   "BBB A+ Accredited"            gated — no accreditation record, no seal asset
//   "400+ Five-Star Reviews"       gated — the review figure three artifacts disagree about
//   "Over 25 Years" / "25+ years"  gated — nobody has sourced the founding year
//   "3,000+ satisfied customers"   gated — no source
//   "you don't pay a single dollar until…"  gated — payment terms need sign-off
//   financing terms                gated — Reg Z; the lender's own numbers or nothing
//   "This is our guarantee" ×2     BANNED outright, not gated
//
// The substance that IS portable — the services, the process, the materials, the timelines, the
// insurance handling, the areas served, the offices — is all here. What is left is a page that
// says true things rather than a page that says impressive ones.
export const national = {
  title: "Roofing, Siding, Windows & Gutters | Coldstream Exteriors",
  description:
    "Roofing, siding, windows and gutters across Cincinnati, Columbus and St. Louis. Free, no-obligation inspections, our own crews, and a 25-year workmanship warranty.",

  // 1 — HERO. Live kicker: "STORM DAMAGE? AGING ROOF? WE'VE GOT YOU COVERED".
  hero: {
    eyebrow: "Storm damage or an aging roof — either way, start here",
    headline: "Roofing, Siding, Windows and Gutters Across Cincinnati, Columbus and St. Louis",
    sub: "Three metros, three local crews, one standard of work. Free inspections, a written quote before anything starts, and a 25-year workmanship warranty behind it.",
  },

  // 2 — TRUST BAND. Live: "Locally Owned & Operated | BBB A+ Accredited | Fully Insured".
  // BBB is gated, so the third item is one of the three pre-approved claims instead.
  trust: {
    heading: "Local crews, in all three markets",
    items: ["Locally owned and operated", "Licensed and insured", "Free, no-obligation inspections"],
  },

  // 3 — INTRO. Sits above the badge row; the estimate form is already in the hero.
  intro: {
    eyebrow: "Roofing and exterior specialists in Cincinnati, Columbus and St. Louis",
    heading: "Show up, do the work properly, stand behind it",
    body: [
      "Coldstream Exteriors works across Ohio, Kentucky and Missouri on roofing, siding, windows and gutters. Each market has its own office and its own crew, so the person who walks your roof and writes your quote is on the job when the work happens. Nothing is handed to a subcontractor.",
      "Every inspection and every written quote is free and carries no obligation. If a repair is the honest answer rather than a replacement, we will say so — it is a shorter conversation than the one after a replacement you did not need.",
    ],
  },

  // 4 — SERVICES. ONE SECTION FOR THE WHOLE COMPANY (round 7 v2). The live page repeats its
  // service list three times, once per market, and the first build of this page copied that. It
  // made the page long and said nothing new on the second and third pass: the services are the
  // same in all three markets. The market-level detail belongs on the market landing pages, and
  // the routing to them is the locations section and the utility bar's market select.
  services: {
    eyebrow: "What we do",
    heading: "Everything on the outside of your house",
    intro: "Roofing is the core of the business. Siding, windows and gutters finish the house — and doing them with one crew is faster and cheaper than booking three separate trades.",
    // What each card lists. Ported from the live site's own service descriptions.
    includes: {
      roofing: ["Full tear-off and replacement", "Leak and storm repair", "Insurance claim handling", "Flat and low-slope systems"],
      siding: ["James Hardie fiber cement", "Vinyl and insulated vinyl", "Soffit, fascia and trim", "Rot repair behind the wall"],
      windows: ["Full-frame replacement", "Insert replacement", "Double-hung, slider, casement", "Bay, bow and picture"],
      gutters: ["Seamless runs rolled on site", "Gutter guards", "Downspouts and drainage", "Repairs and re-hanging"],
      "commercial-roofing": ["TPO, EPDM and modified bitumen", "Coatings and restoration", "Multi-family and HOA", "Scheduled maintenance"],
    },
  },

  // 4b — ONE TEAM, YOUR WHOLE EXTERIOR. The drawn version of the strongest plain thing we can say.
  whole: {
    eyebrow: "One team, your whole exterior",
    heading: "A house is one system, not four trades",
    intro: "Water that gets past the roof shows up in the siding. A gutter that cannot carry a downpour ends up in the basement. Doing the outside of a house as one job is the difference between fixing a symptom and fixing the cause.",
  },

  // 5b — HOW IT WORKS. The live site's own process, rewritten. Four steps, no claims in any of them.
  how: {
    heading: "From your call to a finished job",
    steps: [
      { title: "You call or send the form", body: "A person in your market's office picks up. Tell us what is going on and we will book a time that suits you." },
      { title: "Someone walks it properly", body: "On the roof or along the elevation, usually within about a day. Photographs of what we find, explained in plain terms." },
      { title: "A written quote", body: "Scope, materials and the number, in writing. Free, no obligation, and yours to keep whatever you decide." },
      { title: "Our crew does the work", body: "The same crew, to the timeline agreed up front. We walk it with you at the end and take the debris and the nails with us." },
    ],
  },

  // 6b — BEFORE AND AFTER. Renders real job pairs when they exist; an honest empty state until then.
  beforeAfter: {
    eyebrow: "Our work",
    heading: "Before and after, from our own jobs",
    intro: "The most useful thing we can show you is the same house twice.",
  },

  // 8b — WHO WE ARE. Short and human. Everything about company age, size and customer counts is
  // gated, so this says the things that are true and verifiable instead.
  who: {
    eyebrow: "Who we are",
    heading: "Three local companies, not one national brand",
    body: [
      "Coldstream Exteriors runs as three local businesses — Cincinnati, Columbus and St. Louis — each with its own office, its own crew and its own phone number. When you call, you get someone who works in your market and knows what the weather does to houses there.",
      "We do not subcontract. The person who walks your roof and writes your quote is on the job when the work happens, and is the person you call afterwards if anything is not right.",
    ],
    points: [
      "Locally owned and operated in each market",
      "Our own crews on every job",
      "Licensed and insured in Ohio, Kentucky and Missouri",
      "A 25-year workmanship warranty behind the work",
    ],
  },

  // ROOFING DEEP-DIVE. The market landing carries one of these under its services grid; the home
  // page now carries the same block, written nationally. Sections of the roofing page, not pages.
  // THE HEADING AND INTRO USED TO EXPLAIN THE SITE TO THE READER. They said "Everything roofing,
  // on one page" over "Sections of the roofing conversation — not thirteen separate pages saying
  // the same thing", which is the consolidation rationale — true, load-bearing for the rebuild, and
  // of no interest to a homeowner who never saw the thirteen pages and does not know a page count
  // was ever a question. Internal reasoning belongs in this comment and in DECISIONS.md, not in the
  // copy. It now answers what someone with a stained ceiling actually came to find out.
  roofing: {
    eyebrow: "Roofing",
    heading: "Not sure what your roof needs?",
    intro: "Most people call us because of a stain on a ceiling or a storm that took shingles off. We come out, get on the roof, and tell you whether it is a repair or a replacement — free, and in writing.",
    cards: [
      { title: "Roof Replacement", body: "Full tear-off and installation, sized and priced after someone has walked the roof rather than looked at a satellite image." },
      { title: "Roof Repair", body: "Leaks, emergency call-outs, storm, hail and wind damage — one repair conversation rather than five separate ones." },
      { title: "Storm and Insurance Claims", body: "We document the damage the way an adjuster needs it documented, then deal with them directly." },
      { title: "Commercial and Multi-Family", body: "Flat, TPO, EPDM and coatings for apartment blocks, HOA properties and commercial buildings." },
    ],
  },

  // WHERE WE WORK. The market landing lists that market's towns; nationally the equivalent is the
  // three offices, which is also the routing for anyone the geo redirect did not catch.
  areas: {
    heading: "Three offices, three local crews",
    intro: "Each market is locally owned and run, with its own crew and its own number. Pick the one nearest you.",
  },

  // 5 — WHY US. The live section is twelve items, nine of which are gated claims. What survives
  // is the part that describes how the work actually runs.
  why: {
    heading: "Why homeowners keep calling us back",
    cards: [
      { title: "Our own crews, never subcontracted", match: ["crew","subcontract","same team","their own"], body: "Each market has its own office and its own crew. The people who quote your job are the people who turn up to do it, and they are the people you call afterwards." },
      { title: "A free inspection, usually within a day", match: ["inspection","inspect","came out","next day","same day","quick"], body: "We aim to have someone at your property within about 24 hours of your call. On the roof or along the elevation — not a look from the driveway or a satellite image." },
      { title: "Honest pricing, in writing, first", match: ["price","pricing","quote","estimate","honest","upfront","no pressure"], body: "A written quote with the scope, the materials and the number, before anything begins. No deposit to book an inspection and no pressure afterwards." },
      { title: "We deal with your insurer", match: ["insurance","insurer","adjuster","claim"], body: "For storm damage we inspect, photograph and document the damage the way an adjuster needs it, then talk to them directly so you are not relaying messages between two parties who do this for a living." },
      { title: "Materials chosen for this climate", match: ["shingle","material","hail","storm","tpo","siding"], body: "Architectural asphalt, impact-resistant shingles where hail is a recurring problem, TPO and EPDM on low-slope, fiber cement and vinyl siding. We quote what the building needs." },
      { title: "A 25-year workmanship warranty", match: ["warranty","stood behind","came back","fixed it"], body: "Materials carry their manufacturer warranty. Our workmanship carries ours, and if something is wrong you call the same office that did the job." },
    ],
  },

  // 6 — PARTNERS. Live heading: "ONLY THE HIGHEST QUALITY ROOFING & SIDING PRODUCTS" — rewritten
  // on instruction; the superlative was doing no work.
  partners: {
    eyebrow: "What we install",
    heading: "Materials from manufacturers who stand behind them",
    intro: "We install products with real manufacturer warranties and training behind the installation, because a warranty is only as good as the crew that fits the material.",
  },

  // 7 — PAYING FOR IT. Live heading: "Quality Roofing Shouldn't Wait for Your Savings Account" —
  // rewritten on instruction. The live body advertises financing terms and contains one of the
  // three "guarantee" uses; both are gone. FINANCING TERMS ARE GATED — the section says nothing
  // about monthly payments, APR or a lender until claims.js carries the lender's own numbers.
  paying: {
    eyebrow: "Paying for the work",
    heading: "A failing roof gets more expensive the longer it waits",
    body: [
      "Storm damage does not arrive at a convenient moment, and a small leak becomes decking, insulation and drywall if it is left through a winter. The least expensive version of most of these jobs is the one done before the damage spreads.",
      "That is the honest argument for looking at it now rather than a sales one. The inspection costs nothing, the written quote costs nothing, and if the answer is that it can safely wait a season, we will tell you that too.",
    ],
  },

  // 8 — LOCATIONS. Every value here comes from markets.js — no address or phone is typed on this
  // page. Three offices, three real addresses, three real numbers.
  locations: {
    eyebrow: "Where we are",
    heading: "Three offices across Ohio and Missouri",
    intro: "Each one is locally owned and run, with its own crew and its own phone number.",
  },

  // 9 — FAQ. All eight questions from the live page, answers rewritten. The live heading reads
  // "…Roofing Services in Blue Ash, OH" — a city-page heading leaked onto a national page — so
  // this one is national. Every gated claim has come out of the answers.
  faq: {
    heading: "Questions we get asked most",
    intro: "The same eight questions come up on nearly every call. Here they are with straight answers.",
    items: [
      { q: "Are you licensed and insured?",
        a: "Yes — fully licensed for the work we carry out in Ohio, Kentucky and Missouri, with liability cover and workers' compensation so both your property and our crew are covered. We are happy to send the certificates before you commit to anything." },
      { q: "Do I have to pay anything upfront?",
        a: "There is no deposit to book an inspection and no charge for the quote. Payment terms for the work itself are set out in your written quote before anything starts, so there is nothing to discover later." },
      { q: "How long does a typical roof replacement take?",
        a: "A straightforward ranch is usually a single day. A larger two-storey with a complex roofline runs two to three. Weather moves the schedule and we tell you when it does. Emergency repairs we can often get to the same day or the next." },
      { q: "Do you work with insurance companies on storm damage claims?",
        a: "Yes, and we handle the paperwork. We inspect, photograph and document the damage the way an adjuster needs it documented, meet them on site where we can, and deal with them directly afterwards so you are not in the middle of it." },
      { q: "What roofing and siding materials do you install?",
        a: "Architectural asphalt shingles for most roofs, impact-resistant shingles where hail keeps coming back, and TPO, EPDM or modified bitumen on low-slope and flat. For siding, James Hardie fiber cement and vinyl. We only fit things we would put on our own houses." },
      { q: "How quickly can you provide a free estimate?",
        a: "Usually within about 24 hours. Call (844) 426-8222 or send the form and we will book a time that suits you. Someone will walk the property, answer your questions and leave you with clear pricing in writing before any work is agreed." },
      { q: "What areas do you serve?",
        a: "Greater Cincinnati and Northern Kentucky, Columbus and Central Ohio, and Greater St. Louis. Each market is locally owned and operated. If you are not sure whether your street is covered, call and ask — it takes a minute." },
      { q: "What makes Coldstream different from other contractors?",
        a: "Our own crews rather than subcontractors, so the person who quoted the job is on it. Local ownership in each market rather than a national brand with a local number. And a written quote up front, with an honest answer when a repair beats a replacement." },
    ],
  },

  // 10 — FINAL CTA. Live: "TAKE THE NEXT STEP" / "Call Or Schedule Your Free Estimate".
  cta: {
    eyebrow: "Take the next step",
    heading: "Book a free inspection",
    body: "Tell us what is going on and we will come and look at it. Free, no obligation, and a written quote at the end of it — across Cincinnati, Columbus, St. Louis and the communities around them.",
  },
};
