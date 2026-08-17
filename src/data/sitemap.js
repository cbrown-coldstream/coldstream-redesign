// THE INDEXABLE URL LIST — one computation, used by the sitemap and checked by the build.
//
// A sitemap that lists a noindex page sends Google two contradictory instructions about the same
// URL, and Search Console reports it as an error. With nineteen of this site's pages currently
// noindexed by design, the sitemap cannot be a hand-kept list — it has to be derived from the
// same gates the templates use, so a page becomes crawlable in exactly one step: source the
// thing it was missing.
import { MARKETS, MARKET_LIST, NATIONAL, servicesFor, offers } from "./markets.js";
import { SERVICE_CONTENT } from "./services.js";
import { publishedLocations, marketsWithGallery, marketsWithPhotos, metroLocations } from "./locations.js";
import { marketsWithReviews, marketsWithSourcedReviews } from "./claims.js";
import { SUBSERVICES } from "./subservices.js";
import { GLOBAL_PENDING } from "./pages/global.js";

const SITE = "https://coldstreamexteriors.com";

/** Global pages that are always noindex regardless of sourcing — see each page for why. */
const ALWAYS_NOINDEX = ["/thank-you/", "/404.html"];

/** Every URL this build produces, with the reason it is or is not indexable. */
export const urls = () => {
  const out = [
    { path: "/", index: true, priority: "1.0" },
    { path: "/free-estimate/", index: true, priority: "0.9" },
    // The national service pages the header links to, and the one page that answers "do you cover
    // my town". Added in round 12 — before it, four nav items pointed at `/#services` and there
    // was no service-areas page at all.
    { path: "/service-areas/", index: true, priority: "0.7" },
    // The HUMAN sitemap. It lists itself deliberately: a page linked from every footer that is
    // absent from its own sitemap is the one URL a crawler reaches constantly and is told nothing
    // about. /sitemap.xml stays the machine copy and is not listed — sitemaps do not list sitemaps.
    { path: "/sitemap/", index: true, priority: "0.3" },
    // Same rule the template's getStaticPaths uses: a service gets a national page when more than
    // one market runs it. Deriving it here from anything else is how a built page ends up missing
    // from the sitemap, which is exactly what happened the first time.
    ...servicesFor(NATIONAL)
      .filter((s) => MARKET_LIST.filter((m) => offers(m, s.key)).length > 1)
      .map((s) => ({ path: `/${s.key}/`, index: true, priority: "0.8" })),
  ];

  // Build order round 6: every page in the inventory is built and, unless it is genuinely empty,
  // indexable. Service hubs and sub-services all carry copy written for their market, which also
  // matters because they are the targets of most of the 301 map — a redirect into a noindex page
  // hands over the old URL's ranking value and then tells Google not to index the page holding it.
  for (const [slug, m] of Object.entries(MARKETS)) {
    out.push({ path: `/${slug}/`, index: true, priority: "0.9" });
    out.push({ path: `/${slug}/about/`, index: true, priority: "0.6" });
    out.push({ path: `/${slug}/free-estimate/`, index: true, priority: "0.8" });
    for (const s of servicesFor(m)) {
      out.push({ path: `/${slug}/${s.key}/`, index: true, priority: "0.8" });
      for (const sub of Object.keys(SUBSERVICES[s.key] ?? {}))
        out.push({ path: `/${slug}/${s.key}/${sub}/`, index: true, priority: "0.7" });
    }
  }

  // Location, gallery and reviews pages all exist only where real proof does — job photos for the
  // first two, sourced GBP reviews for the third. There is no thin version of any of them, so
  // every one that builds is indexable, and the sitemap has to ask the same three gates the
  // templates ask rather than keeping its own list beside them.
  for (const { market, key } of publishedLocations()) {
    out.push({ path: `/${market}/locations/${key}/`, index: true, priority: "0.7" });
  }
  for (const { market } of metroLocations()) {
    out.push({ path: `/${market}/locations/`, index: true, priority: "0.7" });
  }
  // Gallery and reviews are BUILT for every market and indexable only once they have something on
  // them. An empty gallery or a reviews page with no reviews has nothing for a crawler.
  const withPhotos = new Set(marketsWithPhotos());
  for (const market of marketsWithGallery()) {
    out.push({ path: `/${market}/gallery/`, index: withPhotos.has(market), priority: "0.7",
               why: withPhotos.has(market) ? null : "no job photos yet" });
  }
  const withReviews = new Set(marketsWithSourcedReviews());
  for (const market of marketsWithReviews()) {
    out.push({ path: `/${market}/reviews/`, index: withReviews.has(market), priority: "0.7",
               why: withReviews.has(market) ? null : "no sourced reviews yet" });
  }
  out.push({ path: "/blog/", index: false, why: "index built, no posts migrated yet" });

  for (const g of GLOBAL_PENDING) out.push({ path: g.path, index: false, why: g.needs });
  for (const p of ALWAYS_NOINDEX) out.push({ path: p, index: false, why: "never indexed by design" });

  return out;
};

export const INDEXABLE = () => urls().filter((u) => u.index);
export const NOINDEXED = () => urls().filter((u) => !u.index);

export const sitemapXml = () =>
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  INDEXABLE()
    .map((u) => `  <url>\n    <loc>${SITE}${u.path}</loc>\n    <priority>${u.priority ?? "0.5"}</priority>\n  </url>\n`)
    .join("") +
  `</urlset>\n`;
