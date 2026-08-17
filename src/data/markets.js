// Market configuration — the single source for every market-scoped value on the site.
//
// Nothing below may be repeated in a component. Phone numbers, addresses, service lists and
// served-area lists all resolve from here, which is what makes "a new city page is a data file
// plus a route" true rather than aspirational.
//
// THE PROTOTYPE'S PHONE NUMBERS WERE FAKE — (513) 717-5462, (614) 555-0188, (314) 555-0166,
// (800) 555-0147 are all placeholders from the design comp. The real numbers are below. The
// live WordPress home page also displays (888) 625-5960 while linking tel:+18444268222; that
// page is being retired, and the national number here is the one it links to, not the one it
// printed.

/**
 * A complete tel: href, derived from the displayed number so the two cannot disagree.
 *
 * Deriving rather than storing both is the whole point: the live WordPress home page prints
 * (888) 625-5960 while linking tel:+18444268222, which is exactly the class of bug that cannot
 * happen when one value is computed from the other.
 */
const tel = (display) => "tel:+1" + display.replace(/\D/g, "");

export const NATIONAL_PHONE = "(844) 426-8222";

export const SERVICES = [
  // The blurb is market-dependent: "residential and commercial" is a service claim, and it is not
  // true in a market with no commercial roofing. See copyFor and the St. Louis ruling below.
  { key: "roofing",  label: "Roofing",  icon: "▲", href: "roofing/",
    blurb: (m) => `Replacement and repair, ${offers(m, "commercial-roofing") ? "residential and commercial" : "residential"} — asphalt, metal, flat.` },
  { key: "siding",   label: "Siding",   icon: "▤", blurb: "James Hardie and vinyl siding, installation and repair.",                     href: "siding/" },
  { key: "windows",  label: "Windows",  icon: "☐", blurb: "Energy-efficient replacement windows, professionally installed.",             href: "windows/" },
  { key: "gutters",  label: "Gutters",  icon: "〣", blurb: "Seamless gutters, guards and downspouts.",                                    href: "gutters/" },
  // Commercial roofing is the plan's own hub — "commercial buyers do not search by sub-service.
  // One strong page" — and the target the 13 folding commercial URLs are supposed to land on.
  // It is ALSO a per-market flag, for the same reason garage doors is: the audit of the live
  // pages records Columbus as keeping commercial roofing and St. Louis as having none.
  //
  // `audience` is what keeps it out of the homeowner nav and the homeowner services grid. It is
  // a different buyer arriving on a different search, and a seven-item primary nav is not a nav.
  // It is linked from the footer of every page and from the commercial section of the roofing
  // hub, so the page is reachable rather than orphaned.
  { key: "commercial-roofing", label: "Commercial Roofing", icon: "▦", audience: "commercial",
    blurb: "Flat and low-slope systems for multi-family, HOA and commercial buildings.",
    href: "commercial-roofing/" },
];

// THE THREE ADDRESSES BELOW ARE THE ONLY ADDRESSES COLDSTREAM HAS. Confirmed, one per market.
// There is no second address per market and none will be invented — a location page never gets
// an address of its own, and no template on this site can emit a PostalAddress that did not come
// from this object. See data/locations.js for the reasoning.
export const MARKETS = {
  cincinnati: {
    slug: "cincinnati",
    name: "Cincinnati",
    possessive: "Cincinnati's",
    cityState: "Cincinnati, OH",
    region: "Southwest Ohio",
    phone: "(513) 258-0450",
    get telHref() { return tel(this.phone); },
    office: {
      label: "Cincinnati Office",
      street: "1308 US-50 Suite 100",
      city: "Milford", state: "OH", zip: "45150",
      // Placeholder until the GBP listing is confirmed — footer NAP must match Google exactly.
      mapUrl: null,
    },
    // CREDENTIALS SHOWN IN THIS MARKET'S BADGE ROW — keys resolve against badges.js.
    // Per market because manufacturer programmes are: Leaf Preferred (Columbus) and Malarkey
    // (St. Louis) are real but UNCONFIRMED, so neither is listed. Adding one is a key here.
    credentials: ["gaf", "james-hardie", "homeadvisor", "bbb"],
    services: ["roofing", "siding", "windows", "gutters", "commercial-roofing"],
    reviews: null,          // PENDING — see REVIEWS note above
    // Replaces ~117 thin neighbourhood pages. These link to the surviving location pages, which
    // is the internal linking site-plan calls "the piece doing the job those 250 pages were
    // built to do" — without it the location pages are orphans.
    servedAreas: [
      "Amberley Village", "Amelia", "Batavia", "Bethel", "Blue Ash", "Cleves", "Cold Spring",
      "Colerain", "Fairfield", "Goshen", "Pleasant Ridge", "Silverton", "Hamilton",
      "Indian Hill", "Kenwood", "Landen", "Loveland", "Madeira", "Maineville", "Mason",
      "Milford", "Montgomery", "Ross", "West Chester",
    ],
  },

  columbus: {
    slug: "columbus",
    name: "Columbus",
    possessive: "Columbus's",
    cityState: "Columbus, OH",
    region: "Central Ohio",
    phone: "(614) 812-0811",
    get telHref() { return tel(this.phone); },
    office: {
      label: "Columbus Office",
      street: "5825 Fieldcrest Dr",
      city: "Galloway", state: "OH", zip: "43119",
      mapUrl: null,
    },
    // site-plan's market-landing note for Columbus: "Keeps commercial roofing."
    // CREDENTIALS SHOWN IN THIS MARKET'S BADGE ROW — keys resolve against badges.js.
    // Per market because manufacturer programmes are: Leaf Preferred (Columbus) and Malarkey
    // (St. Louis) are real but UNCONFIRMED, so neither is listed. Adding one is a key here.
    credentials: ["gaf", "james-hardie", "homeadvisor", "bbb"],
    services: ["roofing", "siding", "windows", "gutters", "commercial-roofing"],
    reviews: null,          // PENDING
    servedAreas: [
      "Bexley", "Blacklick Estates", "Clintonville", "Dublin", "Eastmoor", "Easton",
      "Gahanna", "Galena", "Galloway", "German Village", "Grandview Heights", "Grove City",
      "Groveport", "Hilliard", "Lewis Center", "Lockbourne", "Marysville", "New Albany",
      "Obetz", "Polaris", "Short North Arts District", "Upper Arlington", "Valleyview",
      "Westerville", "Whitehall", "Worthington",
    ],
  },

  "st-louis": {
    slug: "st-louis",
    name: "St. Louis",
    possessive: "St. Louis'",
    cityState: "St. Louis, MO",
    region: "Greater St. Louis",
    phone: "(314) 380-8111",
    get telHref() { return tel(this.phone); },
    office: {
      label: "St. Louis Office",
      street: "3636 S Geyer Rd #100",
      city: "St. Louis", state: "MO", zip: "63127",
      mapUrl: null,
    },
    // The only market carrying garage doors — confirmed against the live site.
    //
    // REVERSED (build order, round 6). The round-5 ruling removed commercial roofing from this
    // market on the strength of a note about the live landing page. The Page System inventory has
    // /st-louis/commercial-roofing/ in it, and the Page System is authoritative — so the hub is
    // back, and with it the landing-page card and the roofing-hub section.
    //
    // GARAGE DOORS IS NOT IN THE INVENTORY and therefore generates no page. It is a real service
    // in this market and it is on the live site, so it is not deleted: it stays a section on the
    // St. Louis landing page and /st-louis/garage-doors/ 301s to that page rather than 404ing.
    // Flagged in DECISIONS.md as the one place the inventory and the live site disagree.
    // CREDENTIALS SHOWN IN THIS MARKET'S BADGE ROW — keys resolve against badges.js.
    // Per market because manufacturer programmes are: Leaf Preferred (Columbus) and Malarkey
    // (St. Louis) are real but UNCONFIRMED, so neither is listed. Adding one is a key here.
    credentials: ["gaf", "james-hardie", "homeadvisor", "bbb"],
    services: ["roofing", "siding", "windows", "gutters", "commercial-roofing"],
    reviews: null,          // PENDING
    servedAreas: [
      "Affton", "Arnold", "Berkeley", "Chesterfield", "Clayton", "Concord", "Crestwood",
      "Creve Coeur", "Des Peres", "Ellisville", "Fenton", "Green Park", "House Springs",
      "Kirkwood", "Lemay", "Maplewood", "Maryland Heights", "Mehlville", "Murphy", "Oakville",
      "Richmond Heights", "Sunset Hills", "The Hill", "Tower Grove", "Town and Country",
      "Valley Park", "Webster Groves",
    ],
  },
};

/** The national variant. Not a market — it routes to one. */
export const NATIONAL = {
  slug: null,
  name: "Coldstream Exteriors",
  possessive: "Our",
  cityState: "Ohio & Missouri",
  region: "Ohio and Missouri",
  phone: NATIONAL_PHONE,
  telHref: tel(NATIONAL_PHONE),
  office: null,
  // Commercial roofing is listed nationally because the company does it — in two of three
  // markets. The national context is the one place "residential and commercial" is true without
  // qualification, and there are no national service pages for it to link at, so this only
  // affects copy and the footer, both of which route to the market chooser.
  services: ["roofing", "siding", "windows", "gutters", "commercial-roofing"],
  servedAreas: [],
};

export const MARKET_LIST = Object.values(MARKETS);

/**
 * GEO DETECTION for the national page's client-side redirect. Cities are matched as substrings of
 * the detected city name; the region code must also match, which is the part that matters —
 * "Columbus" is also a city in Georgia, Indiana and Mississippi, and sending those visitors to a
 * Central Ohio roofing page would be worse than doing nothing.
 *
 * Only these three metros redirect. Everyone else in the world stays on the national page.
 */
export const GEO = [
  { slug: "cincinnati", regions: ["oh", "ky", "ohio", "kentucky"],
    cities: ["cincinnati", "milford", "mason", "loveland", "blue ash", "west chester", "hamilton",
             "fairfield", "batavia", "montgomery", "madeira", "amelia", "sharonville", "norwood",
             "covington", "newport", "florence", "cold spring", "colerain", "cleves"] },
  { slug: "columbus", regions: ["oh", "ohio"],
    cities: ["columbus", "dublin", "hilliard", "westerville", "gahanna", "grove city", "worthington",
             "upper arlington", "new albany", "powell", "galloway", "reynoldsburg", "pickerington",
             "lewis center", "marysville", "bexley", "clintonville", "groveport", "whitehall"] },
  { slug: "st-louis", regions: ["mo", "missouri"],
    cities: ["st. louis", "st louis", "saint louis", "kirkwood", "webster groves", "chesterfield",
             "clayton", "ballwin", "oakville", "mehlville", "affton", "arnold", "fenton",
             "creve coeur", "maryland heights", "town and country", "ellisville", "sunset hills",
             "des peres", "valley park", "crestwood", "richmond heights", "maplewood"] },
];

/**
 * The stable schema.org @id for a market's business entity.
 *
 * ONE LocalBusiness node exists per market, defined on that market's landing page. Everything
 * else — service hubs, location pages — REFERENCES it by @id instead of restating the NAP.
 * There are exactly three physical addresses; a fourth cannot appear on the site by accident
 * because no template is capable of writing one.
 */
export const businessId = (market) => `https://coldstreamexteriors.com/${market.slug}/#business`;

/** The provider reference used by every non-landing page. Deliberately carries no address. */
export const providerRef = (market) => ({
  "@type": "RoofingContractor",
  "@id": businessId(market),
  name: `Coldstream Exteriors — ${market.name}`,
});

export const serviceFor = (key) => SERVICES.find((s) => s.key === key);

/** Does this market offer this service? The single question every market-aware claim asks. */
export const offers = (market, key) => Boolean(market && (market.services ?? []).includes(key));

/**
 * Resolve a copy field that may be market-dependent.
 *
 * A `blurb` or a `lead` may be a plain string or a function of the market. Round 5 is why: the
 * roofing copy said "residential and commercial" in all three markets, which is a commercial
 * service claim on a St. Louis page after that market was ruled to have no commercial roofing.
 * A claim that is true in two markets and false in the third cannot be a constant.
 */
export const copyFor = (value, market) => (typeof value === "function" ? value(market) : value);

/** The services a market actually offers, in canonical order. */
export const servicesFor = (market) =>
  SERVICES.filter((s) => (market.services ?? []).includes(s.key));

/**
 * The homeowner-facing subset — everything except the commercial hub.
 *
 * Used by the primary nav and the market landing's services grid, both of which address a
 * homeowner. Commercial roofing is a different buyer arriving on a different search; it is
 * reached from the footer (every page) and from the commercial section of the roofing hub.
 * The footer deliberately uses `servicesFor` and therefore DOES list it — a hub nothing links
 * to is an orphan, which is the failure the served-areas block was rebuilt to avoid.
 */
export const homeownerServicesFor = (market) =>
  servicesFor(market).filter((s) => s.audience !== "commercial");

/**
 * Absolute path to a service hub within a market.
 *
 * THERE ARE NO NATIONAL SERVICE PAGES, by design — "services stay under the market, not above
 * it". In a national context a service link therefore routes to the home page's unified services
 * section rather than to /roofing/, which has never existed.
 *
 * It used to point at #markets, the market-chooser block. That block was removed in round 7 and
 * the anchor went with it, which would have left every national service link pointing at nothing.
 */
/**
 * Where a service link goes from wherever you are.
 *
 * In a market it goes to that market's hub. Nationally it used to return `/#services` — an anchor
 * on the page you were already on — which made Roofing, Siding, Windows and Gutters four nav items
 * pointing at one destination and no page. The national service pages exist now, so it returns one.
 */
export const serviceHref = (market, service) =>
  market.slug ? `/${market.slug}/${service.href}` : `/${service.href}`;

/**
 * The "where do you work" link. One national page carries all three markets with a map and the
 * full town list each, so a market context deep-links to its own section rather than to a
 * per-market locations page, most of which do not exist — those are gated on real job proof.
 */
export const areasHref = (market) =>
  market?.slug ? `/service-areas/#${market.slug}` : "/service-areas/";

/**
 * The conversion page for this context. Per-market where we are in a market, national otherwise.
 *
 * Build order round 6 restored the per-market free-estimate pages, and a page that exists but is
 * never linked is a page nobody can reach — the estimate button on a Cincinnati page should land
 * on the Cincinnati form, with the Cincinnati number on it.
 */
export const estimateHref = (market) =>
  market?.slug ? `/${market.slug}/free-estimate/` : "/free-estimate/";

/** The About page for this context. Same reasoning. The company story stays on /about-us/. */
export const aboutHref = (market) =>
  market?.slug ? `/${market.slug}/about/` : "/about-us/";

/** Markets still missing sourced review figures. The build warns on these rather than guessing. */
export const REVIEWS_PENDING = MARKET_LIST.filter((m) => !m.reviews).map((m) => m.name);

// Town → location-page routing lives in data/locations.js (`areaForTown`, `unlinkedAreas`).
// It is derived from the location data itself rather than duplicated here, so a town cannot
// link to a location page that does not exist.
