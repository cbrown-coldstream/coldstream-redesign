// THE PRIMARY NAV, AS DECIDED ON THE TEAM REVIEW CALL (2026-08-18) AND REVISED 2026-08-19.
//
// Top-level, in this order (owner brief 2026-08-24): Roofing · Siding · Windows · Gutters ·
// Service Areas · Storm Damage, then About pushed right against the estimate CTA. Seven items.
//
// NOT ONE "SERVICES" DROPDOWN. That was raised and rejected on the call: top-level visibility of
// each trade was the explicit ask. It costs horizontal room and that cost is taken deliberately —
// see the breakpoint note in base.css for what happens when the room runs out.
//
// ── WHAT THE 2026-08-19 REVISION CHANGED, AND WHY ────────────────────────────────────────────
//
// The 08-18 build left two items flagged as not matching the pages that existed. Both are now
// resolved by BUILDING THE PAGES rather than by bending the nav around their absence:
//
//   1. STORM DAMAGE moved from sixth to third — directly after Siding — and now points at a real
//      standalone page, /storm-damage/, on national. It was previously a nav item in a standalone
//      POSITION whose only destination was /{market}/roofing/insurance-storm-damage/, nested
//      under roofing, exactly where the call said it should not sit.
//
//      ON A MARKET PAGE IT STILL GOES TO THAT MARKET'S NESTED PAGE, deliberately. The nested page
//      carries the market's own hail and wind history, its adjuster process and its phone number;
//      the national page cannot. 273 redirect rules also already resolve to the nested URL, and
//      re-pointing them to a national page would strip the local signal off every one of them.
//      Standalone position, market-local destination. Both asks are satisfied at once.
//
//   2. STONE VENEER now has a page — /siding/stone-veneer/ — and is in the Siding dropdown.
//      IT IS NATIONAL-ONLY (`nationalOnly: true`), so it resolves to the same URL from every page
//      on the site including the market pages. There is no /{market}/siding/stone-veneer/ and
//      linking one would be a dead internal link and a gate failure. See the note in
//      data/national-subservices.js on why it has no market variants.
//
// ── THE NATIONAL SUB-SLUGS ARE NOT THE MARKET SUB-SLUGS. READ THIS BEFORE EDITING ────────────
//
// A dropdown child has ONE `key` but can resolve to TWO different URLs:
//
//     child.key = "roof-replacement"   →  /cincinnati/roofing/roof-replacement/   (market)
//     child.national = "replacement"   →  /roofing/replacement/                   (national)
//
// The market spelling is load-bearing: 273 redirect rules in data/redirects.js point at
// `roofing/roof-replacement` and `roofing/roof-repair`, and renaming those URLs would invalidate
// every one of them. The national spelling is the one specified for the new pages. `national` is
// therefore an override, not a rename — omit it and both contexts use `key`.
//
// Dropdown targets are pages that exist in every market unless marked `nationalOnly`.

/** Top-level items in call order. `children` is the dropdown; absent means a plain link. */
export const NAV = [
  {
    key: "roofing",
    label: "Roofing",
    children: [
      { key: "roof-replacement", label: "Roof Replacement", national: "replacement" },
      { key: "roof-repair", label: "Roof Repair", national: "repair" },
      // Commercial joins the Roofing dropdown (owner brief 2026-08-25, "add it in a dropdown").
      // CINCINNATI-ONLY SINCE 2026-08-27 (owner) — Columbus was scoped out two days after the
      // brief that kept it, and with one market running the line the national hub stops building.
      // Every context that is not Cincinnati therefore links into Cincinnati's page, which is
      // exactly what the owner asked: "when clicked from national page… should be redirected to
      // Cincinnati". Same rule serviceHref applies in the footer.
      { key: "commercial-roofing", label: "Commercial Roofing",
        href: (m) => (m?.slug && (m.services ?? []).includes("commercial-roofing")
          ? `/${m.slug}/commercial-roofing/` : "/cincinnati/commercial-roofing/") },
    ],
  },
  {
    key: "siding",
    label: "Siding",
    children: [
      { key: "vinyl-siding", label: "Vinyl Siding" },
      { key: "james-hardie-siding", label: "James Hardie Siding" },
      // National-only: there is no market variant of this page. See the file header.
      { key: "stone-veneer", label: "Stone Veneer", nationalOnly: true },
    ],
  },
  // Windows: top-level link only. The call was explicit that it gets no dropdown.
  { key: "windows", label: "Windows" },
  { key: "gutters", label: "Gutters" },
  { key: "service-areas", label: "Service Areas", href: (m) => (m?.slug ? `/service-areas/#${m.slug}` : "/service-areas/") },
  // Storm Damage sat THIRD by the 2026-08-18 call; the owner brief of 2026-08-24 moves it here,
  // beside Service Areas. A reversal, logged as one in DECISIONS. Destination logic unchanged:
  // standalone position, market-local target where a market is in context.
  {
    key: "storm-damage",
    label: "Storm Damage",
    href: (m) => (m?.slug ? `/${m.slug}/roofing/insurance-storm-damage/` : "/storm-damage/"),
  },
];

/** Pushed right, adjacent to the CTA — the call's wording. */
export const NAV_RIGHT = [
  { key: "about", label: "About", href: (m) => (m?.slug ? `/${m.slug}/about/` : "/about-us/") },
];

/** Resolve an item to a URL for the market in context. */
export const navHref = (item, market) => {
  if (typeof item.href === "function") return item.href(market);
  return market?.slug ? `/${market.slug}/${item.key}/` : `/${item.key}/`;
};

/**
 * Resolve a dropdown child, which always hangs off its parent hub.
 *
 * Three cases, in order: a national-only child ignores the market entirely; a market page uses the
 * market spelling of the slug; national uses `national` if the child overrides it, else `key`.
 */
export const childHref = (parent, child, market) => {
  if (typeof child.href === "function") return child.href(market);
  if (child.nationalOnly) return `/${parent.key}/${child.key}/`;
  if (market?.slug) return `/${market.slug}/${parent.key}/${child.key}/`;
  return `/${parent.key}/${child.national ?? child.key}/`;
};
