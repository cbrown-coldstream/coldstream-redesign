// PULL THE LIVE SITE'S COPY. Run: npm run live:pull
//
// Writes one JSON file per rebuild page into src/data/live-copy/, each carrying the live URL it
// came from, the title, the meta description, the H1, and every heading/paragraph/list item in
// document order. That corpus is the source material for the copy port — the point of the
// consolidation is that the rebuild says what the live site says, on a quarter of the URLs.
//
// WHY A SCRIPT AND NOT A PASTE. 443 live URLs collapse into 58 pages, several of them merging
// four or five live pages into one. Doing that by hand is where copy quietly goes missing, and
// there would be no way to tell later which sentence came from where. Every extracted block
// records its source, so any claim on the rebuild can be traced back to the page it came from.
//
// BOILERPLATE IS REMOVED BY FREQUENCY, NOT BY SELECTOR. The live site is a page builder: the nav,
// the footer, the CTA band and the service menu are the same DOM on every page, and no stable
// class name separates them from the body. Anything appearing on more than half the pages is
// chrome by definition, so it is dropped after the crawl rather than guessed at during it.
//
// IT IS A READ. Nothing here writes to the live site, and the crawl is sequential with a delay —
// this is our own site, but it is a production site with customers on it.
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "../src/data/live-copy");
const SITE = "https://coldstreamexteriors.com";
const MARKETS = ["cincinnati", "columbus", "st-louis"];

// ── the map: one rebuild page ← the live page(s) it consolidates ──────────────────────────────
// Order matters. The first source is the primary — its title, description and H1 are the ones
// worth comparing against. The rest are merged in as additional sections.
const MAP = [
  ["/", ["/"]],
  ["/about-us/", ["/about-us/"]],
  ["/free-estimate/", ["/free-estimate/", "/instant-roof-quote/"]],
  ["/thank-you/", ["/thank-you/"]],
  ["/blog/", ["/blog/"]],
];

for (const m of MARKETS) {
  MAP.push(
    [`/${m}/`, [`/${m}/`]],
    [`/${m}/about/`, [`/${m}/about/`]],
    [`/${m}/free-estimate/`, [`/${m}/free-estimate/`, `/${m}/instant-roof-quote/`]],
    [`/${m}/gallery/`, [`/${m}/gallery/`]],
    [`/${m}/reviews/`, [`/${m}/reviews/`]],
    [`/${m}/locations/`, [`/${m}/service-area/`]],

    // Roofing hub absorbs the roof-types tree — the live site splits material choice from the
    // service, and the rebuild answers both on one page.
    [`/${m}/roofing/`, [`/${m}/residential-roofing/`, `/${m}/roof-types/`]],
    [`/${m}/roofing/roof-replacement/`, [
      `/${m}/residential-roofing/roof-replacement/`,
      `/${m}/residential-roofing/roof-installation/`,
      `/${m}/roof-types/asphalt-shingle-roofing/`,
    ]],
    [`/${m}/roofing/roof-repair/`, [
      `/${m}/residential-roofing/roof-repair/`,
      `/${m}/residential-roofing/roof-leak-repair/`,
      `/${m}/residential-roofing/emergency-roof-repair/`,
      `/${m}/residential-roofing/roof-maintenance/`,
      `/${m}/residential-roofing/roof-inspections/`,
    ]],
    [`/${m}/roofing/insurance-storm-damage/`, [
      `/${m}/residential-roofing/storm-damage-repair/`,
      `/${m}/residential-roofing/insurance-claim-assistance/`,
      `/${m}/residential-roofing/hail-damage-roof-repair/`,
      `/${m}/residential-roofing/wind-damage-roof-repair/`,
    ]],

    [`/${m}/commercial-roofing/`, [
      `/${m}/commercial-roofing/`,
      `/${m}/commercial-roofing/flat-roof-systems/`,
      `/${m}/commercial-roofing/multi-family-roofing/`,
      `/${m}/commercial-roofing/hoa-community-roofing/`,
    ]],

    [`/${m}/siding/`, [`/${m}/siding/`, `/${m}/siding/siding-installation/`]],
    [`/${m}/siding/siding-replacement/`, [`/${m}/siding/siding-replacement/`, `/${m}/siding/siding-repair/`]],
    [`/${m}/siding/james-hardie-siding/`, [`/${m}/siding/james-hardie-siding/`, `/${m}/siding/fiber-cement-siding/`]],
    [`/${m}/siding/vinyl-siding/`, [`/${m}/siding/vinyl-siding/`, `/${m}/siding/soffit-fascia-services/`]],

    [`/${m}/windows/`, [
      `/${m}/windows/`,
      `/${m}/windows/window-replacement/`,
      `/${m}/windows/window-installations/`,
      `/${m}/windows/energy-efficient-window/`,
      `/${m}/windows/double-hung-windows/`,
      `/${m}/windows/vinyl-windows/`,
    ]],

    [`/${m}/gutters/`, [
      `/${m}/gutters/`,
      `/${m}/gutters/seamless-gutters/`,
      `/${m}/gutters/gutter-guards/`,
      `/${m}/gutters/gutter-installation/`,
      `/${m}/gutters/gutter-replacement/`,
      `/${m}/gutters/downspouts/`,
    ]],
  );
}
// St. Louis keeps garage doors as a section on the market landing — the live pages exist.
MAP.push(["/st-louis/#garage-doors", ["/st-louis/garage-doors/"]]);

// ── extraction ───────────────────────────────────────────────────────────────────────────────
const decode = (s) => s
  .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#0?39;|&apos;|&#8217;/g, "'")
  .replace(/&quot;|&#8220;|&#8221;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/&#8211;|&ndash;/g, "–").replace(/&#8212;|&mdash;/g, "—").replace(/&hellip;/g, "…")
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
  .replace(/&[a-z]+;/gi, " ");

const text = (h) => decode(h.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

const extract = (html) => {
  const body = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
    .replace(/<svg[\s\S]*?<\/svg>/gi, "");

  const meta = (name) => {
    const m = body.match(new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']*)`, "i"))
      ?? body.match(new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+name=["']${name}["']`, "i"));
    return m ? decode(m[1]).trim() : "";
  };

  const blocks = [];
  const re = /<(h1|h2|h3|h4|p|li)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let m;
  while ((m = re.exec(body))) {
    const t = text(m[2]);
    if (!t || t.length < 2) continue;
    blocks.push({ tag: m[1].toLowerCase(), text: t });
  }

  return {
    title: decode((body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "")).trim(),
    description: meta("description"),
    h1: blocks.find((b) => b.tag === "h1")?.text ?? "",
    blocks,
  };
};

// ── crawl ────────────────────────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const wanted = [...new Set(MAP.flatMap(([, srcs]) => srcs))];
const pages = new Map();

console.log(`  pulling ${wanted.length} live URLs…`);
for (const path of wanted) {
  try {
    const res = await fetch(SITE + path, { headers: { "user-agent": "coldstream-rebuild/copy-pull" } });
    if (!res.ok) { console.log(`  ✗ ${res.status} ${path}`); continue; }
    pages.set(path, extract(await res.text()));
  } catch (e) {
    console.log(`  ✗ ${path} — ${e.message}`);
  }
  await sleep(120);
}
console.log(`  got ${pages.size}/${wanted.length}`);

// ── boilerplate ──────────────────────────────────────────────────────────────────────────────
// The first cut at this dropped anything appearing on more than half the crawled URLs, and the
// mega-menu survived it: the menu is not on every template, so 60-odd of 140 URLs was under the
// line. Frequency is the right instrument, the threshold was just far too generous. A block of
// real page copy does not appear on seven different pages; a nav item appears on fifty.
const freq = new Map();
for (const p of pages.values()) {
  for (const t of new Set(p.blocks.map((b) => b.text))) freq.set(t, (freq.get(t) ?? 0) + 1);
}
const chrome = new Set([...freq].filter(([, n]) => n > 6).map(([t]) => t));
console.log(`  ${chrome.size} boilerplate strings dropped (nav, mega-menu, footer NAP, CTA band)`);

// ── write ────────────────────────────────────────────────────────────────────────────────────
if (!existsSync(out)) mkdirSync(out, { recursive: true });
const slug = (u) => (u === "/" ? "home" : u.replace(/[/#]/g, "-").replace(/^-|-$/g, ""));
const index = [];

for (const [target, srcs] of MAP) {
  const sources = srcs.filter((s) => pages.has(s)).map((s) => {
    const p = pages.get(s);
    return {
      url: SITE + s,
      title: p.title,
      description: p.description,
      h1: p.h1,
      blocks: p.blocks.filter((b) => !chrome.has(b.text)),
    };
  });
  if (!sources.length) continue;
  const words = sources.reduce((n, s) => n + s.blocks.reduce((k, b) => k + b.text.split(/\s+/).length, 0), 0);
  const rec = { target, pulled: srcs.length, kept: sources.length, words, sources };
  writeFileSync(join(out, `${slug(target)}.json`), JSON.stringify(rec, null, 2) + "\n");
  index.push({ target, file: `${slug(target)}.json`, sources: sources.map((s) => s.url), words });
}

writeFileSync(join(out, "index.json"), JSON.stringify({
  pulledAt: process.env.PULL_STAMP ?? "see git history",
  note: "Generated by scripts/pull-live-copy.mjs. The live site's own copy, kept as source material for the port. Not shipped as-is: the claims gate and the voice spec still apply.",
  pages: index,
}, null, 2) + "\n");

console.log(`  → src/data/live-copy/ — ${index.length} pages, ${index.reduce((n, p) => n + p.words, 0).toLocaleString()} words of source copy`);
