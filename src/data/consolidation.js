// WHY THERE ARE 68 PAGES AND NOT 443 — computed, not asserted.
//
// The consolidation is the whole point of this rebuild, and until now the reasoning for it lived in
// prose: CLAUDE.md says "100+ neighborhood pages that were one skeleton with synonyms swapped",
// DECISIONS.md says why each fold was chosen. None of that told you which old URLs actually fold
// into the page you are looking at, which is the question the team asks when reviewing a page —
// "what was here before, and did we keep what it was for?"
//
// THIS READS THE GENERATED _redirects FILE, DELIBERATELY. Not redirects.js, the rule source.
// The rules are patterns; `_redirects` is what those patterns actually expanded to and what will
// actually ship to the host. Recomputing the expansion here would be a second implementation of
// build-redirects.mjs, and the two would disagree the first time either changed.
//
// ORDERING DEPENDENCY, AND IT IS SAFE: `npm run build` is `tokens && redirects && astro build`, so
// public/_redirects is written before any page renders. If it is missing — someone running
// `astro build` directly — this returns empty rather than throwing, and the board simply shows no
// fold data instead of failing the build.
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const FILE = resolve(process.cwd(), "public/_redirects");

/**
 * Why a URL was retired. These are the shapes the audit found, not invented categories — each one
 * corresponds to a rule block in redirects.js.
 */
export const REASONS = {
  neighborhood: {
    label: "Neighborhood page",
    blurb:
      "One skeleton page per town per service, with the town name swapped in. They competed with " +
      "each other and with the market page for the same query, so none of them won. The towns " +
      "survive as a linked list on the market page, which is the page that can actually rank.",
  },
  slug: {
    label: "Duplicate slug",
    blurb:
      "The same service reachable at several spellings — residential-roofing, roofing-services, " +
      "roof-installation. Google had to pick one and split the value across the rest.",
  },
  conversion: {
    label: "Duplicate conversion page",
    blurb:
      "Four free-estimate pages and four thank-you pages. One of each is all a site needs; the " +
      "duplicates diluted the conversion path and the tracking on it.",
  },
  blog: { label: "Blog", blurb: "Posts stay on WordPress for now — no rules are emitted for them yet." },
  utility: { label: "Utility or legacy URL", blurb: "Feeds, old CMS paths and one-off legacy URLs." },
  gone: {
    label: "Deleted outright (410)",
    blurb:
      "A page with no successor and nothing worth passing on. A 410 tells Google it is gone on " +
      "purpose, which drops it faster and more cleanly than a 404.",
  },
  other: { label: "Folded into a hub", blurb: "Retired in favour of the page that absorbed its subject." },
};

const classify = (from) => {
  if (/\/service-area\//.test(from)) return "neighborhood";
  if (/free-estimate|thank-you|get-a-quote|contact/.test(from)) return "conversion";
  if (/^\/blog|\/category\/|\/tag\/|\/author\//.test(from)) return "blog";
  if (/\/feed\/?$|^\/wp-|\/page\/\d|\/\?|sitemap/.test(from)) return "utility";
  // A slug variant is a one-segment source whose name differs from where it lands.
  if (from.split("/").filter(Boolean).length <= 2) return "slug";
  return "other";
};

let cache = null;

/** Every rule in the shipped map: { from, to, code, reason }. */
export const rules = () => {
  if (cache) return cache;
  if (!existsSync(FILE)) return (cache = []);
  cache = readFileSync(FILE, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => {
      const [from, to, code] = l.split(/\s+/);
      return { from, to, code: code ?? "301", reason: code === "410" ? "gone" : classify(from) };
    });
  return cache;
};

/** path -> the rules that land on it, most-folded first. */
export const foldsInto = () => {
  const out = {};
  for (const r of rules()) (out[r.to] ??= []).push(r);
  return out;
};

/** Totals for the summary panel. */
export const summary = () => {
  const all = rules();
  const byReason = {};
  for (const r of all) byReason[r.reason] = (byReason[r.reason] ?? 0) + 1;
  return {
    total: all.length,
    redirected: all.filter((r) => r.code !== "410").length,
    gone: all.filter((r) => r.code === "410").length,
    byReason,
    // Distinct destinations — how many of the surviving pages actually absorbed something.
    absorbing: new Set(all.filter((r) => r.code !== "410").map((r) => r.to)).size,
  };
};
