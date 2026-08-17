// THE PRIMARY NAV, AS DECIDED ON THE TEAM REVIEW CALL (2026-08-18).
//
// Top-level, in this order: Roofing · Siding · Windows · Gutters · Storm Damage · Service Areas,
// then About pushed right against the estimate CTA. Seven items.
//
// NOT ONE "SERVICES" DROPDOWN. That was raised and rejected on the call: top-level visibility of
// each trade was the explicit ask. It costs horizontal room and that cost is taken deliberately —
// see the breakpoint note in base.css for what happens when the room runs out.
//
// ── TWO ITEMS DO NOT MATCH THE PAGES THAT EXIST, AND ARE HANDLED HONESTLY ────────────────────
//
//   1. STORM DAMAGE is a standalone top-level item on the call's instruction — "it spans trades,
//      which is why it sits on its own". The only page that exists is
//      /{market}/roofing/insurance-storm-damage/, which is nested under roofing, exactly where the
//      call said it should not sit. The NAV POSITION is standalone as asked; the URL is still
//      nested, because moving it means a new page, a redirect rule and an inventory entry, none of
//      which was authorised. Flagged rather than quietly resolved either way.
//
//   2. STONE VENEER was asked for in the Siding dropdown. THERE IS NO SUCH PAGE — the siding
//      sub-services are vinyl, James Hardie and siding replacement. Linking it would be a dead
//      internal link, which is a gate failure and, worse, a nav item promising a service page we
//      cannot show. It is omitted and reported. Add the page and add a line here.
//
// Dropdown targets are sub-service pages that exist in every market. `serviceHref` and the market
// slug do the routing, so a national page links to the national service pages and a market page
// links to its own.

/** Top-level items in call order. `children` is the dropdown; absent means a plain link. */
export const NAV = [
  {
    key: "roofing",
    label: "Roofing",
    children: [
      { key: "roof-replacement", label: "Roof Replacement" },
      { key: "roof-repair", label: "Roof Repair" },
    ],
  },
  {
    key: "siding",
    label: "Siding",
    children: [
      { key: "vinyl-siding", label: "Vinyl Siding" },
      { key: "james-hardie-siding", label: "James Hardie" },
      // { key: "stone-veneer", label: "Stone Veneer" },  ← NO PAGE. See the note above.
    ],
  },
  // Windows: top-level link only. The call was explicit that it gets no dropdown.
  { key: "windows", label: "Windows" },
  { key: "gutters", label: "Gutters" },
  // Storm Damage: standalone, not nested under roofing. `href` is set explicitly because the page
  // it points at still lives under the roofing hub — see note 1 above.
  { key: "storm-damage", label: "Storm Damage", href: (m) => (m?.slug ? `/${m.slug}/roofing/insurance-storm-damage/` : "/roofing/") },
  { key: "service-areas", label: "Service Areas", href: (m) => (m?.slug ? `/service-areas/#${m.slug}` : "/service-areas/") },
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

/** Resolve a dropdown child, which always hangs off its parent hub. */
export const childHref = (parent, child, market) =>
  market?.slug ? `/${market.slug}/${parent.key}/${child.key}/` : `/${parent.key}/`;
