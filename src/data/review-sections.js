// THE SECTIONS OF EACH PAGE, FOR THE TEAM REVIEW TOOL ON /sitemap/.
//
// This file exists so the review page can ask "what is actually on this page" without reading
// dist/ — which it cannot do, because it is itself built into dist/. The lists below are the
// section blocks each template renders, in the order the template renders them.
//
// THEY ARE A REVIEW CHECKLIST, NOT A CONTRACT. Nothing validates them and no gate checks them: they
// exist so that when someone says "the FAQ needs rewriting" there is a box to tick and a place to
// put the note. If a template gains or loses a section, update the list here — a checklist that has
// silently drifted from the page is worse than no checklist, because it gets trusted.
//
// KEYED BY LANE, NOT BY URL. Three markets share one market-landing template, so a per-URL list
// would be the same twelve strings written three times and would drift the first time one of them
// was edited. `laneFor()` in the review page maps a path to one of these.

export const REVIEW_SECTIONS = {
  "national-home": [
    "Hero — headline, sub, estimate form",
    "Trust band — the three approved claims",
    "Badge row — accreditations",
    "Market chooser — three offices",
    "Services grid — what we do (flip cards)",
    "Why homeowners keep calling us back — six cards",
    "Roofing deep-dive — four cards",
    "Partner strip — manufacturers",
    "Reviews — empty until GBP pull",
    "Offer band",
    "FAQ — eight questions",
    "Final CTA",
    "Footer — NAP, links",
  ],
  "national-service": [
    "Hero — service headline",
    "Badge row",
    "Service detail — what we do cards",
    "Process scrub — the video sequence",
    "Market chooser — deep-links to this service",
    "How it works — four steps",
    "Why us — trust cards",
    "Partner strip",
    "FAQ",
    "Final CTA",
  ],
  "market-landing": [
    "Hero — market headline, phone, estimate form",
    "Market notice — 'showing Cincinnati'",
    "Badge row",
    "Services grid — flip cards",
    "Why us — trust cards",
    "Roofing detail",
    "Served areas — grouped town list",
    "Reviews — empty until GBP pull",
    "Offer band",
    "FAQ — written local",
    "Final CTA",
    "Footer NAP",
  ],
  "service-hub": [
    "Hero — service in market",
    "Badge row",
    "Service detail — what we do",
    "Process scrub — video sequence",
    "Sub-service cards — go deeper",
    "Local proof block",
    "How it works",
    "Why us",
    "Served areas",
    "Reviews",
    "Offer band",
    "FAQ",
    "Final CTA",
  ],
  "sub-service": [
    "Hero",
    "Body copy — the ported live content",
    "Why us",
    "Served areas",
    "FAQ",
    "Final CTA",
  ],
  location: [
    "Hero — area headline",
    "Completed work — job proof",
    "Towns covered",
    "Why us",
    "FAQ",
    "Final CTA",
  ],
  conversion: [
    "Hero — form first",
    "What happens next",
    "Why the estimate is free",
    "Served areas",
    "Final CTA",
  ],
  company: [
    "Hero",
    "Body copy",
    "Supporting sections",
    "Final CTA",
  ],
};

/** Which lane a path belongs to. Mirrors the template that builds it. */
export const laneFor = (path, marketSlugs) => {
  const seg = path.replace(/^\/|\/$/g, "").split("/").filter(Boolean);
  if (seg.length === 0) return "national-home";
  const inMarket = marketSlugs.includes(seg[0]);

  if (!inMarket) {
    if (["free-estimate", "thank-you"].includes(seg[0])) return "conversion";
    if (seg.length === 1 && ["roofing", "siding", "windows", "gutters", "commercial-roofing"].includes(seg[0]))
      return "national-service";
    return "company";
  }
  if (seg.length === 1) return "market-landing";
  if (seg[1] === "locations") return "location";
  if (["free-estimate"].includes(seg[1])) return "conversion";
  if (["about", "gallery", "reviews"].includes(seg[1])) return "company";
  if (seg.length === 2) return "service-hub";
  return "sub-service";
};

/** Review states a page can be in. The order is the order they appear in the control. */
export const REVIEW_STATES = [
  { key: "", label: "Not started", tone: "none" },
  { key: "reviewing", label: "In review", tone: "wip" },
  { key: "copy", label: "Needs copy", tone: "copy" },
  { key: "design", label: "Needs design", tone: "design" },
  { key: "blocked", label: "Blocked — needs data", tone: "blocked" },
  { key: "done", label: "Approved", tone: "done" },
];
