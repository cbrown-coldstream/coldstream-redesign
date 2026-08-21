// /sitemap.xml — generated from the indexable-URL computation, never hand-kept.
//
// It lists only pages that are actually crawlable. A noindex page in a sitemap is a contradiction
// Search Console flags, and fourteen of this site's pages are noindex by design right now.
import { sitemapXml } from "../data/sitemap.js";

export function GET() {
  return new Response(sitemapXml(), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
