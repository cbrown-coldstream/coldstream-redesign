// WHAT WE DO — the homepage's eight service cards (owner brief 2026-08-24, §5).
//
// ORDER IS SPECIFIED AND LOAD-BEARING: James Hardie sits directly beside Siding, as requested.
// Body copy is TWO TIGHT sentences per card (~25 words — trimmed 2026-08-25 after the longer
// versions overflowed the hover overlay on screen), unique per card, written to rank on the
// service term plus
// expertise language — the substance ported from the live pages, the prose written fresh because
// the live prose leans on gated claims and the banned voice. NOT one sentence with the noun
// swapped; that is the exact failure the rebuild exists to fix.
//
// ── PHOTOS, AND WHY FIVE OF EIGHT ARE PLACEHOLDERS ───────────────────────────────────────────
//
// The brief's source order: (1) Contractors Cloud jobs — none pulled yet; (2) the live WordPress
// uploads — scraped 2026-08-24, and the live site turned out to hold only THREE real project
// photographs total (everything else is icons, partner marks and one stock office photo);
// (3) an obvious placeholder, registered in MISSING_ASSETS.md. So three cards carry real
// photos with their live filenames kept for provenance, and five carry the deliberate
// placeholder. No stock photography that could read as a Coldstream job — that rule outranks
// having a photo.
//
// `photo: null` renders /photos/placeholder-project.svg. A real photo is { base, w, h, alt } and
// resolves to /photos/live/{base}.avif|.webp|.jpg — three formats, generated at import time by
// scripts (sharp), committed like every other binary asset.

export const WHAT_WE_DO = [
  {
    key: "residential-roofing",
    label: "Residential Roofing",
    benefit: "Replacement and repair, specified after a walk on the roof",
    body: "Architectural asphalt and impact-resistant roofs, replaced and repaired by factory-certified crews. Specified on the roof itself, and backed by a 25-year workmanship warranty.",
    href: "/roofing/",
    subs: [
      { label: "Roof replacement", href: "/roofing/replacement/" },
      { label: "Roof repair", href: "/roofing/repair/" },
      { label: "Storm damage", href: "/storm-damage/" },
    ],
    photo: {
      base: "Coldstream_Exteriors_Roofing_Installer-1024x606",
      w: 900, h: 533,
      alt: "New architectural shingle roof installed by Coldstream Exteriors",
    },
  },
  {
    key: "storm-damage",
    label: "Storm Damage Restoration",
    benefit: "Documented the way an adjuster needs it, then repaired",
    body: "Hail and wind damage documented the way an insurance adjuster needs it, then repaired across roofing, siding and gutters. Active leaks get same-day or next-day attention.",
    href: "/storm-damage/",
    subs: [
      { label: "Roof repair", href: "/roofing/repair/" },
      { label: "Free inspection", href: "/free-estimate/" },
    ],
    photo: null,
  },
  {
    key: "siding",
    label: "Siding",
    benefit: "Fiber cement and vinyl, over a wall that was actually inspected",
    body: "Fiber cement and vinyl siding, fitted over a drainage plane that sheds water. The old cladding comes off, so the sheathing gets inspected before anything new goes on.",
    href: "/siding/",
    subs: [
      { label: "James Hardie", href: "/siding/james-hardie-siding/" },
      { label: "Vinyl siding", href: "/siding/vinyl-siding/" },
      { label: "Stone veneer", href: "/siding/stone-veneer/" },
    ],
    photo: {
      base: "Cincinnati-siding-1-1024x771",
      w: 900, h: 678,
      alt: "Completed siding installation by Coldstream Exteriors",
    },
  },
  {
    key: "james-hardie",
    label: "James Hardie Siding",
    benefit: "Fiber cement, installed to Hardie's own specification",
    body: "James Hardie fiber cement siding installed by certified crews to Hardie's own specification — clearances, flashed joints, sealed edges. Fire-resistant, impact-tough, and it holds its finish.",
    href: "/siding/james-hardie-siding/",
    subs: [
      { label: "All siding", href: "/siding/" },
      { label: "Vinyl alternative", href: "/siding/vinyl-siding/" },
    ],
    photo: null,
  },
  {
    key: "vinyl-siding",
    label: "Vinyl Siding",
    benefit: "Hung so it can move with the weather, not against it",
    body: "Vinyl siding hung so it moves with the weather instead of buckling against it — the economical way to re-side a whole elevation, over an inspected water barrier.",
    href: "/siding/vinyl-siding/",
    subs: [
      { label: "All siding", href: "/siding/" },
      { label: "James Hardie", href: "/siding/james-hardie-siding/" },
    ],
    // Real Coldstream photograph from the live homepage; the siding MATERIAL in it is not
    // verified as vinyl, so the alt claims the work, not the product. Flagged in
    // MISSING_ASSETS.md for replacement by a verified vinyl job from the Contractors Cloud pull.
    photo: {
      base: "415775438-848354917293152-631252259915544195-n-1",
      w: 900, h: 675,
      alt: "Re-sided home with new lap siding by Coldstream Exteriors",
    },
  },
  {
    key: "windows",
    label: "Replacement Windows",
    benefit: "Measured opening by opening, never averaged from a plan",
    body: "Insert and full-frame replacement windows, measured opening by opening. Low-E glass and proper flashing decide the performance — we go through the label with you.",
    href: "/windows/",
    subs: [
      { label: "Free estimate", href: "/free-estimate/" },
      { label: "Where we work", href: "/service-areas/" },
    ],
    photo: null,
  },
  {
    key: "gutters",
    label: "Seamless Gutters",
    benefit: "Roll-formed on site, sized to the roof above them",
    body: "Seamless gutters roll-formed on site and sized to the roof draining into them, with downspouts where the water needs to go. Guards fitted to what your trees drop.",
    href: "/gutters/",
    subs: [
      { label: "Free estimate", href: "/free-estimate/" },
      { label: "Storm damage", href: "/storm-damage/" },
    ],
    photo: null,
  },
  {
    key: "commercial-roofing",
    label: "Commercial Roofing",
    benefit: "Flat and low-slope systems for buildings that work for a living",
    body: "TPO, EPDM and coating systems for flat and low-slope buildings — multi-family, HOA and commercial. Restoration where the membrane has life left, replacement where it does not.",
    href: "/commercial-roofing/",
    subs: [
      { label: "Free assessment", href: "/free-estimate/" },
    ],
    photo: null,
  },
];
