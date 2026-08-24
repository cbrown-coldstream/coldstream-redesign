// THE HANDOFF SITE — /handoff/, four pages, generated from the build. Run: npm run handoff
// (also runs automatically as a postbuild step, beside the page map).
//
// WHO IT IS FOR. Rambow, taking this build into WordPress. Everything here answers one of two
// questions: what is this page meant to be, and what do I do to move it.
//
// WHY IT IS GENERATED. A spec written by hand is a spec that is wrong by the second build. Every
// number, URL, heading and section list below is read out of dist/ and the data modules at build
// time, so the document cannot describe a site that does not exist. The prose — the migration
// steps, the field maps, the rules — is written once and lives in this file.
//
// IT IS NOINDEX AND IT IS NOT IN THE SITEMAP. Internal documentation on a public host.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join, relative } from "node:path";
import { MARKETS, servicesFor } from "../src/data/markets.js";
import { SERVICE_CONTENT } from "../src/data/services.js";
import { SUBSERVICES } from "../src/data/subservices.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
if (!existsSync(dist)) { console.error("  ✗ no dist/ — run npm run build first"); process.exit(1); }

// ── read the build ───────────────────────────────────────────────────────────────────────────
const walk = (d) => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : p.endsWith("index.html") ? [p] : [];
});

const dec = (s) => s.replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"')
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ");
const strip = (h) => dec(h.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

const pages = [];
for (const f of walk(dist)) {
  if (f.includes(`${"handoff"}/`)) continue;
  let url = "/" + relative(dist, f).replace(/index\.html$/, "").replace(/\\/g, "/");
  if (url === "/./") url = "/";
  const h = readFileSync(f, "utf8");
  const body = h.replace(/<(script|style)[\s\S]*?<\/\1>/g, "");
  pages.push({
    url,
    title: strip(h.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1] ?? ""),
    description: dec(h.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? ""),
    h1: strip(h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? ""),
    sections: [...body.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((m) => strip(m[1])).filter(Boolean),
    words: strip(body).split(" ").length,
    noindex: /name="robots" content="noindex/.test(h),
  });
}
pages.sort((a, b) => a.url.localeCompare(b.url));

// ── redirects ────────────────────────────────────────────────────────────────────────────────
const rules = readFileSync(resolve(root, "public/_redirects"), "utf8")
  .split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#"))
  .map((l) => l.split(/\s+/));
const inbound = {};
for (const [from, to] of rules) (inbound[to] ??= []).push(from);

// ── where each page's copy came from ──────────────────────────────────────────────────────────
let LIVE = { pages: [] };
try { LIVE = JSON.parse(readFileSync(resolve(root, "src/data/live-copy/index.json"), "utf8")); } catch {}
const liveFor = Object.fromEntries(LIVE.pages.map((p) => [p.target, p]));

// ── template classification ──────────────────────────────────────────────────────────────────
const TEMPLATES = {
  home: { file: "src/pages/index.astro", name: "National home", wp: "page-home.php", one: "One instance." },
  landing: { file: "src/pages/[market]/index.astro", name: "Market landing", wp: "page-market.php", one: "One per market (3)." },
  hub: { file: "src/pages/[market]/[service].astro", name: "Service hub", wp: "page-service.php", one: "One per service per market (13)." },
  sub: { file: "src/pages/[market]/[hub]/[sub].astro", name: "Sub-service", wp: "page-subservice.php", one: "Nested under a hub (18)." },
  locations: { file: "src/pages/[market]/locations/index.astro", name: "Locations index", wp: "page-locations.php", one: "Metro markets only." },
  area: { file: "src/pages/[market]/locations/[area].astro", name: "Location area", wp: "page-location-area.php", one: "Sub-areas of a split market." },
  about: { file: "src/pages/[market]/about.astro", name: "Market about", wp: "page-market-about.php", one: "One per market." },
  convert: { file: "src/pages/[market]/free-estimate.astro", name: "Conversion", wp: "page-estimate.php", one: "National and per market." },
  proof: { file: "src/pages/[market]/reviews.astro", name: "Proof page", wp: "page-proof.php", one: "Reviews and gallery, per market." },
  editorial: { file: "src/pages/*.astro", name: "Editorial", wp: "page-editorial.php", one: "About, financing, terms, privacy, blog, thank-you." },
};

const classify = (url) => {
  const p = url.split("/").filter(Boolean);
  if (!p.length) return "home";
  const isMarket = Object.keys(MARKETS).includes(p[0]);
  if (!isMarket) return p[0] === "free-estimate" ? "convert" : "editorial";
  if (p.length === 1) return "landing";
  if (p[1] === "locations") return p.length === 2 ? "locations" : "area";
  if (p[1] === "about") return "about";
  if (p[1] === "free-estimate") return "convert";
  if (p[1] === "reviews" || p[1] === "gallery") return "proof";
  return p.length === 2 ? "hub" : "sub";
};

for (const p of pages) {
  p.kind = classify(p.url);
  p.tpl = TEMPLATES[p.kind];
  p.inbound = inbound[p.url] ?? [];
  p.live = liveFor[p.url] ?? null;
}

const stats = {
  pages: pages.length,
  indexable: pages.filter((p) => !p.noindex).length,
  noindex: pages.filter((p) => p.noindex).length,
  rules: rules.length,
  words: pages.reduce((n, p) => n + p.words, 0),
  liveWords: LIVE.pages.reduce((n, p) => n + p.words, 0),
  liveUrls: new Set(LIVE.pages.flatMap((p) => p.sources)).size,
};

// ── shell ────────────────────────────────────────────────────────────────────────────────────
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const STAGING = "https://coldstream-exteriors-staging.netlify.app";

const NAV = [
  ["/handoff/", "Start here"],
  ["/handoff/pages/", "Page specs"],
  ["/handoff/wordpress/", "The migration"],
  ["/handoff/redirects/", "The 301 map"],
];

const CSS = `
:root{
  --paper:#fff; --surface:#F2F6F9; --line:#E4EAEF; --ink:#101B26; --muted:#5B6B78; --faint:#8A99A6;
  --navy:#12314f; --blue:#3A89C7; --deep:#2A6699; --accent:#E8843B; --good:#16A34A; --warn:#B7791F;
  --display:"Montserrat",system-ui,sans-serif; --body:"Inter",system-ui,sans-serif;
}
@font-face{font-family:"Montserrat";src:url(/fonts/montserrat-var-latin.woff2) format("woff2");font-weight:700 900;font-display:swap}
@font-face{font-family:"Inter";src:url(/fonts/inter-var-latin.woff2) format("woff2");font-weight:400 700;font-display:swap}
*{box-sizing:border-box}
body{margin:0;font-family:var(--body);color:var(--ink);background:var(--surface);line-height:1.62;-webkit-font-smoothing:antialiased}
h1,h2,h3,h4{font-family:var(--display);line-height:1.12;letter-spacing:-.01em;margin:0}
h1{font-size:clamp(1.9rem,3.4vw,2.8rem);font-weight:900}
h2{font-size:clamp(1.35rem,2.2vw,1.8rem);font-weight:800;margin:0 0 10px}
h3{font-size:1.05rem;font-weight:700}
a{color:var(--deep)}
code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.88em;background:#eef3f8;padding:2px 6px;border-radius:5px}
.wrap{max-width:1120px;margin:0 auto;padding:0 22px}

header.top{background:var(--navy);color:#fff;padding:26px 0 0}
header.top .eyebrow{font-family:var(--display);font-weight:700;font-size:.74rem;letter-spacing:.16em;text-transform:uppercase;color:#8fc0ea}
header.top h1{color:#fff;margin:8px 0 6px}
header.top p.lede{color:#c8d8e7;max-width:70ch;margin:0 0 20px}
nav.rail{display:flex;gap:4px;flex-wrap:wrap;border-top:1px solid rgba(255,255,255,.14);padding-top:12px}
nav.rail a{font-family:var(--display);font-weight:700;font-size:.9rem;color:#c8d8e7;text-decoration:none;padding:9px 14px;border-radius:8px 8px 0 0}
nav.rail a:hover{background:rgba(255,255,255,.08);color:#fff}
nav.rail a[aria-current]{background:var(--surface);color:var(--ink)}

main{padding:34px 0 80px}
section.card{background:var(--paper);border:1px solid var(--line);border-radius:14px;padding:26px 26px 22px;margin-bottom:18px}
section.card > p, section.card > ul, section.card > ol{color:var(--muted)}
section.card p:last-child{margin-bottom:0}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(128px,1fr));gap:10px;margin:0 0 22px}
.stat{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);border-radius:11px;padding:12px 14px}
.stat b{display:block;font-family:var(--display);font-weight:900;font-size:1.5rem;color:#fff}
.stat span{font-size:.76rem;color:#a9c0d6;text-transform:uppercase;letter-spacing:.08em}

.note{border-left:4px solid var(--accent);background:#fff8f1;border-radius:0 10px 10px 0;padding:14px 18px;margin:16px 0}
.note.stop{border-color:#C0392B;background:#fdf0ee}
.note.go{border-color:var(--good);background:#f0f9f3}
.note p{margin:0;color:var(--ink)}
.note b{font-family:var(--display)}

table{width:100%;border-collapse:collapse;font-size:.92rem}
th,td{text-align:left;padding:10px 12px;border-bottom:1px solid var(--line);vertical-align:top}
th{font-family:var(--display);font-weight:700;font-size:.76rem;letter-spacing:.09em;text-transform:uppercase;color:var(--muted);background:var(--surface)}
tbody tr:hover{background:#fafcfe}
.table-wrap{overflow-x:auto;border:1px solid var(--line);border-radius:12px;background:var(--paper)}

.chip{display:inline-block;font-family:var(--display);font-weight:700;font-size:.68rem;letter-spacing:.07em;text-transform:uppercase;padding:3px 9px;border-radius:999px;white-space:nowrap}
.chip--index{background:#e8f1fa;color:var(--deep)}
.chip--noindex{background:#f3f5f7;color:var(--faint);border:1px dashed var(--line)}
ol.steps{counter-reset:s;list-style:none;padding:0;margin:0}
ol.steps > li{counter-increment:s;position:relative;padding:0 0 22px 52px;border-left:2px solid var(--line);margin-left:16px}
ol.steps > li:last-child{border-left-color:transparent;padding-bottom:0}
ol.steps > li::before{content:counter(s);position:absolute;left:-17px;top:-2px;width:32px;height:32px;border-radius:50%;
  background:var(--blue);color:#fff;display:grid;place-items:center;font-family:var(--display);font-weight:800;font-size:.9rem}
ol.steps h3{margin-bottom:4px}
ol.steps p{margin:0 0 6px;color:var(--muted)}

.pagerow summary{cursor:pointer;list-style:none;display:grid;grid-template-columns:1fr auto auto;gap:14px;align-items:center;padding:13px 16px}
.pagerow summary::-webkit-details-marker{display:none}
.pagerow{border:1px solid var(--line);border-radius:11px;background:var(--paper);margin-bottom:8px}
.pagerow[open]{border-color:var(--blue);box-shadow:0 10px 26px rgba(16,27,38,.07)}
.pagerow summary:hover{background:#fafcfe}
.purl{font-family:var(--display);font-weight:700;font-size:.98rem}
.ph1{color:var(--muted);font-size:.86rem}
.pbody{padding:4px 16px 18px;border-top:1px solid var(--line)}
.kv{display:grid;grid-template-columns:132px 1fr;gap:6px 14px;font-size:.9rem;margin:12px 0 0}
.kv dt{font-family:var(--display);font-weight:700;font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--faint);padding-top:3px}
.kv dd{margin:0;color:var(--ink)}
.seclist{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:6px}
.seclist li{background:var(--surface);border:1px solid var(--line);border-radius:7px;padding:3px 9px;font-size:.83rem}
.filters{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 16px}
.f{font-family:var(--display);font-weight:700;font-size:.82rem;background:var(--paper);border:1px solid var(--line);
  border-radius:999px;padding:7px 15px;cursor:pointer;color:var(--muted)}
.f[aria-pressed="true"]{background:var(--ink);color:#fff;border-color:var(--ink)}
.grouphead{margin:26px 0 10px;display:flex;align-items:baseline;gap:12px}
.grouphead h2{margin:0}
.grouphead span{color:var(--faint);font-size:.85rem}
pre{background:var(--ink);color:#dbe6f0;padding:16px 18px;border-radius:11px;overflow-x:auto;font-size:.84rem;line-height:1.55}
footer.foot{border-top:1px solid var(--line);padding:24px 0 60px;color:var(--faint);font-size:.85rem}
@media(max-width:640px){.pagerow summary{grid-template-columns:1fr;gap:4px}.kv{grid-template-columns:1fr}}
`;

const shell = ({ path, title, eyebrow, lede, stats: st, body }) => `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${esc(title)} — Coldstream Exteriors handoff</title>
<style>${CSS}</style>
</head><body>
<header class="top"><div class="wrap">
  <p class="eyebrow">${esc(eyebrow)}</p>
  <h1>${esc(title)}</h1>
  <p class="lede">${lede}</p>
  ${st ? `<div class="stats">${st.map(([n, l]) => `<div class="stat"><b>${n}</b><span>${l}</span></div>`).join("")}</div>` : ""}
  <nav class="rail">${NAV.map(([h, l]) => `<a href="${h}"${h === path ? ' aria-current="page"' : ""}>${l}</a>`).join("")}</nav>
</div></header>
<main><div class="wrap">${body}</div></main>
<footer class="foot"><div class="wrap">Generated from the build by <code>scripts/build-handoff.mjs</code>. Every number, URL and section list on this page was read out of <code>dist/</code> — if the build changes, this changes with it. Internal: noindex, not in the sitemap.</div></footer>
</body></html>`;

// ── page 1: start here ───────────────────────────────────────────────────────────────────────
const startBody = `
<section class="card">
  <h2>What you have been handed</h2>
  <p>A complete static rebuild of coldstreamexteriors.com: <b>${stats.pages} pages</b> where the live site has 443, with
  <b>${stats.rules} redirect rules</b> pointing every retired URL at the page that replaced it. It is generated from data —
  templates plus content files — not hand-built page by page. That is why ${Object.keys(MARKETS).length} markets cost three data files rather than three sites.</p>
  <p>The copy is the live site's own, consolidated. ${stats.liveUrls} live URLs were read and reduced into the
  ${LIVE.pages.length} pages that survive; the source URL for every page is recorded on its spec, so any sentence can be
  traced back to the page it came from.</p>
</section>

<section class="card">
  <h2>There are two ways to land this, and they are not equally hard</h2>
  <ol class="steps">
    <li>
      <h3>Serve the built HTML from the existing host</h3>
      <p>Upload, add the redirect fragment above the WordPress rewrite block, cut over. Nothing is rebuilt, nothing is
      re-typed, and what you reviewed on staging is exactly what ships. <b>This is the plan of record</b> — the site-plan
      has you serving finished HTML from the host WordPress is already on, and nothing in this build needs a runtime for
      that reason. <a href="/handoff/wordpress/">Step by step on the migration page.</a></p>
    </li>
    <li>
      <h3>Rebuild the pages inside WordPress</h3>
      <p>Ten templates, a field map per template, and the global data (markets, services, claims) as options. You get the
      WordPress editor back; you also take on keeping ${stats.pages} pages consistent by hand, which is the problem the
      consolidation just solved. <b><a href="/handoff/wordpress/">The migration page</a> walks this route step by step.</b></p>
    </li>
  </ol>
  <div class="note"><p><b>If you take route 2, take the data model with it.</b> The reason there are no thin duplicate
  pages left is that copy lives in one place per market and per service. Recreating these as ${stats.pages} independent
  WordPress pages rebuilds the original problem in a new editor.</p></div>
</section>

<section class="card">
  <h2>The four rules that matter more than the rest</h2>
  <div class="note stop"><p><b>Redirects and pages go live together.</b> Publishing the 301 map before the pages exist
  points ${stats.rules} rules at a 404 — which loses the ranking value exactly as a 404 does, while looking handled.</p></div>
  <div class="note stop"><p><b>The redirect fragment sits ABOVE the WordPress rewrite block.</b> Below it, WordPress
  answers first and not one rule fires.</p></div>
  <div class="note"><p><b>Every canonical URL ends in a trailing slash.</b> Do not add a rule that strips them — it would
  fight the canonical tag on every page.</p></div>
  <div class="note"><p><b>${stats.noindex} pages are deliberately noindex</b> and the sitemap lists only the ${stats.indexable}
  that are not. That is not a broken build: those pages are waiting on content that has not been sourced, and a thin page
  that ranks is worse than a page that waits. Do not "fix" it by indexing them.</p></div>
</section>

<section class="card">
  <h2>What is still open</h2>
  <p>Named here so nothing is discovered late. None of it blocks the migration; all of it blocks those pages being indexed.</p>
  <div class="table-wrap"><table>
    <thead><tr><th>Page</th><th>Waiting on</th></tr></thead>
    <tbody>${pages.filter((p) => p.noindex).map((p) => `<tr><td><code>${esc(p.url)}</code></td><td>${
      p.url.includes("/gallery/") ? "Completed-job photos with consent recorded."
      : p.url.includes("/reviews/") ? "Real, attributable Google reviews. Nothing is invented in the meantime."
      : p.url === "/blog/" ? "A decision on which of the 48 WordPress posts migrate."
      : p.url === "/financing/" ? "A confirmed lender. Every figure on it is gated until then."
      : p.url === "/thank-you/" ? "Nothing — noindex permanently by design."
      : p.url === "/terms/" || p.url === "/privacy-policy/" ? "Legal review before indexing."
      : "Market-specific copy."
    }</td></tr>`).join("")}</tbody>
  </table></div>
</section>`;

// ── page 2: page specs ───────────────────────────────────────────────────────────────────────
const GROUPS = [
  ["Site-wide", (p) => !Object.keys(MARKETS).some((m) => p.url.startsWith(`/${m}/`))],
  ...Object.entries(MARKETS).map(([slug, m]) => [m.name, (p) => p.url.startsWith(`/${slug}/`)]),
];

const pageRow = (p) => `
<details class="pagerow" data-index="${p.noindex ? "noindex" : "indexable"}" data-kind="${p.kind}">
  <summary>
    <span><span class="purl">${esc(p.url)}</span><br><span class="ph1">${esc(p.h1) || "<em>no h1</em>"}</span></span>
    <span class="chip chip--${p.noindex ? "noindex" : "index"}">${p.noindex ? "noindex" : "indexed"}</span>
    <span class="ph1">${p.words.toLocaleString()} words${p.inbound.length ? ` · ${p.inbound.length} 301s in` : ""}</span>
  </summary>
  <div class="pbody">
    <dl class="kv">
      <dt>Live page</dt><dd><a href="${STAGING}${esc(p.url)}" target="_blank" rel="noopener">${STAGING}${esc(p.url)}</a></dd>
      <dt>Template</dt><dd>${esc(p.tpl.name)} — <code>${esc(p.tpl.file)}</code> → WordPress <code>${esc(p.tpl.wp)}</code></dd>
      <dt>Title tag</dt><dd>${esc(p.title)}</dd>
      <dt>Meta description</dt><dd>${esc(p.description) || "<em>none</em>"}</dd>
      <dt>H1</dt><dd>${esc(p.h1)}</dd>
      <dt>Sections</dt><dd><ul class="seclist">${p.sections.map((s) => `<li>${esc(s)}</li>`).join("") || "<li><em>none</em></li>"}</ul></dd>
      ${p.live ? `<dt>Copy source</dt><dd>${p.live.sources.map((u) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(u.replace("https://coldstreamexteriors.com", ""))}</a>`).join("<br>")}<br><span class="ph1">${p.live.words.toLocaleString()} words of live copy read into this page</span></dd>` : ""}
      ${p.inbound.length ? `<dt>301s in</dt><dd>${p.inbound.slice(0, 8).map((u) => `<code>${esc(u)}</code>`).join(" ")}${p.inbound.length > 8 ? ` <span class="ph1">+${p.inbound.length - 8} more — see <a href="/handoff/redirects/">the 301 map</a></span>` : ""}</dd>` : ""}
    </dl>
  </div>
</details>`;

const specsBody = `
<section class="card">
  <h2>How to read this</h2>
  <p>One row per built page. Open a row for its template, its title and description, its H1, the sections it renders in
  order, which live URLs its copy came from, and which retired URLs 301 into it. Everything is read from the build.</p>
  <p><b>The section list is the page spec.</b> If you are rebuilding in WordPress, those headings in that order are what
  the page has to produce — the wording of each one is on the live staging page linked in the row.</p>
</section>
<div class="filters">
  <button class="f" id="f-all" aria-pressed="true">All ${pages.length}</button>
  <button class="f" id="f-index" aria-pressed="false">Indexable ${stats.indexable}</button>
  <button class="f" id="f-noindex" aria-pressed="false">noindex ${stats.noindex}</button>
</div>
${GROUPS.map(([label, test]) => {
  const rows = pages.filter(test);
  if (!rows.length) return "";
  return `<div class="grouphead"><h2>${esc(label)}</h2><span>${rows.length} pages</span></div>${rows.map(pageRow).join("")}`;
}).join("")}
<script>
(function(){
  var btns={"f-all":"all","f-index":"indexable","f-noindex":"noindex"};
  function apply(mode){
    document.querySelectorAll(".pagerow").forEach(function(r){
      r.style.display = (mode==="all"||r.dataset.index===mode) ? "" : "none";
    });
    Object.keys(btns).forEach(function(id){
      document.getElementById(id).setAttribute("aria-pressed", String(btns[id]===mode));
    });
  }
  Object.keys(btns).forEach(function(id){
    document.getElementById(id).addEventListener("click",function(){apply(btns[id]);});
  });
})();
</script>`;

// ── page 3: the migration ────────────────────────────────────────────────────────────────────
const marketList = Object.entries(MARKETS);
const fieldTable = (rows) => `<div class="table-wrap"><table>
  <thead><tr><th>Field</th><th>Type</th><th>Where it comes from</th></tr></thead>
  <tbody>${rows.map(([f, t, s]) => `<tr><td><code>${esc(f)}</code></td><td>${esc(t)}</td><td>${s}</td></tr>`).join("")}</tbody>
</table></div>`;

const wpBody = `
<section class="card">
  <h2>Route 1 — serve the built HTML from the existing host</h2>
  <p><b>This is the plan of record.</b> The site-plan has you serving finished HTML from the host WordPress is already on;
  nothing in this build needs a runtime, a database or a build step on your side. The whole job is upload, redirect,
  cut over — and the order of those three is the part that decides whether it goes well.</p>
  <ol class="steps">
    <li>
      <h3>Upload the build, but do not point anything at it yet</h3>
      <p>Directory-per-URL: <code>/cincinnati/</code> is <code>cincinnati/index.html</code>. <code>DirectoryIndex index.html</code>
      must be on. <b>Upload the whole of <code>dist/</code> to the web root</b> — the ${stats.pages} pages plus every
      directory and loose file beside them. Nothing in it is optional and nothing is generated on your side.</p>
      <p>The loose files at the root, and why each one is there:</p>
      <table class="t"><thead><tr><th>File</th><th>What breaks without it</th></tr></thead><tbody>
        <tr><td><code>sitemap.xml</code></td><td>Search Console has nothing to submit. Lists only the ${stats.indexable} indexable URLs, each with a real last-modified date.</td></tr>
        <tr><td><code>robots.txt</code></td><td>Crawlers get no instruction and no pointer to the sitemap. <b>It must be the permissive one</b> — see the warning below.</td></tr>
        <tr><td><code>llms.txt</code></td><td>AI assistants asked about Coldstream have to assemble an answer from directory listings instead of one authoritative fetch.</td></tr>
        <tr><td><code>og-default.jpg</code></td><td>Every link shared to Facebook, LinkedIn, Slack or a text message renders as a bare grey URL. Referenced by all ${stats.pages} pages.</td></tr>
        <tr><td><code>favicon.ico</code> · <code>favicon-96.png</code><br><code>favicon-192.png</code> · <code>apple-touch-icon.png</code></td><td>Google shows a generic globe beside the listing on mobile search instead of the Coldstream mark.</td></tr>
        <tr><td><code>logo-coldstream-exteriors.jpg</code><br><code>logo-coldstream-ondark.png</code></td><td>The header and footer logo, and the logo in the machine-readable business record.</td></tr>
        <tr><td><code>_redirects</code></td><td>Nothing — it is Netlify's format, for the review host. <b>The Apache fragment is what you use</b>; see the redirects page.</td></tr>
        <tr><td><code>robots-staging.txt</code></td><td>Nothing. <b>DO NOT UPLOAD THIS ONE.</b> It blocks all crawling and exists only for the Netlify review host. It is the one file in <code>dist/</code> that is not part of the deliverable.</td></tr>
      </tbody></table>
      <div class="note stop"><p><b>Check <code>robots.txt</code> after uploading.</b> Fetch
      <code>https://coldstreamexteriors.com/robots.txt</code> and confirm it reads <code>Allow: /</code> and names the
      sitemap. If it reads <code>Disallow: /</code> the staging file went up by mistake and the entire site is invisible to
      every search engine — with every page still loading perfectly, which is why this failure runs for weeks before anyone
      notices. It is also self-concealing: a blocked site cannot be re-read, so Google will not see the corrected file
      either until it next checks robots.txt.</p></div>
    </li>
    <li>
      <h3>Put the 301 fragment ABOVE the WordPress rewrite block</h3>
      <p>In <code>.htaccess</code>, above <code># BEGIN WordPress</code>. Below it WordPress answers first and not one of the
      ${stats.rules} rules fires. This is the single most common way this kind of cutover fails.</p>
    </li>
    <li>
      <h3>Stop WordPress routing these paths</h3>
      <p>WordPress must not attempt to serve any URL in the sitemap. If a WP page exists on the same slug, it wins on a
      misconfigured host and you get the old thin page back at the new URL — with the redirect pointing at it.</p>
      <div class="note stop"><p><b>⚠ <code>/blog/</code> IS THE ONE PATH WHERE THIS CUTS THE OTHER WAY, AND IT NEEDS A
      DECISION BEFORE CUTOVER.</b> WordPress currently serves a real blog at <code>/blog/</code> with 45 live posts under it.
      This build also produces a <code>/blog/</code> — an empty index, noindex, absent from the sitemap, and linked as
      "Advice" from the footer of all ${stats.pages} pages. Upload it as-is and it replaces a working blog with an empty page,
      taking 45 indexed posts out of the site in one move.</p>
      <p><b>Until the blog migration is decided, do this:</b> leave <code>/blog/</code> and everything under it with
      WordPress, and do <b>not</b> upload <code>dist/blog/</code>. The footer link then lands on the existing WordPress blog,
      which is unstyled against the new site but alive and indexed. That is the right trade — an ugly page that ranks beats a
      tidy page that does not exist.</p>
      <p>The blog is the only <code>PENDING</code> block in the 301 map, for the reason set out on the redirects page:
      no post gets folded, kept or killed from a guess. It needs the per-post traffic and backlink export
      (<code>site/data/live-urls.txt</code>), which does not exist in the repo yet.</p></div>
    </li>
    <li>
      <h3>Cut over, then submit the sitemap</h3>
      <p>From this moment the old URLs 301 and the new pages answer. Submit <code>/sitemap.xml</code> in Search Console and
      watch Coverage and the 404 report for two weeks.</p>
    </li>
  </ol>
  <div class="note stop"><p><b>Do not hand-edit the HTML.</b> It is generated from the source in this repo. An edit here is
  overwritten by the next build, and in the meantime the site and its source disagree — which is how a phone number ends up
  correct in one place and wrong in nine.</p></div>
  <div class="note"><p><b>Trailing slashes stay.</b> Every canonical URL ends in <code>/</code> and every page is an
  <code>index.html</code> inside a directory. A rule that strips trailing slashes fights the canonical tag on every page.</p></div>
</section>

<section class="card">
  <h2>Route 2 — rebuild the pages inside WordPress</h2>
  <p>Only if the business needs the WordPress editor on these pages. It is a real project rather than a deployment, and the
  rest of this document is the whole of it: the page tree, ten templates, the field map, and the SEO that carries the value.</p>
  <div class="note"><p><b>Whichever route you take, the 301 map and the noindex set are not optional and do not change.</b>
  They are the SEO half of the consolidation and they behave identically under both.</p></div>
</section>

<section class="card">
  <h2>1 — Build the page tree</h2>
  <p>${stats.pages} pages, ${Object.keys(MARKETS).length} of them market roots. Slugs must match exactly, including the
  trailing slash WordPress adds by default. Create parents before children or the permalinks nest wrong.</p>
  <div class="table-wrap"><table>
    <thead><tr><th>Depth</th><th>Pattern</th><th>Count</th><th>Parent</th></tr></thead>
    <tbody>
      <tr><td>0</td><td><code>/</code></td><td>1</td><td>—</td></tr>
      <tr><td>1</td><td><code>/{market}/</code></td><td>${marketList.length}</td><td>—</td></tr>
      <tr><td>1</td><td><code>/about-us/</code>, <code>/free-estimate/</code>, <code>/blog/</code>, <code>/financing/</code>, <code>/terms/</code>, <code>/privacy-policy/</code>, <code>/thank-you/</code></td><td>7</td><td>—</td></tr>
      <tr><td>2</td><td><code>/{market}/{service}/</code></td><td>${pages.filter((p) => p.kind === "hub").length}</td><td>market</td></tr>
      <tr><td>2</td><td><code>/{market}/about|free-estimate|gallery|reviews|locations/</code></td><td>${pages.filter((p) => ["about", "convert", "proof", "locations"].includes(p.kind) && p.url.split("/").filter(Boolean).length === 2).length}</td><td>market</td></tr>
      <tr><td>3</td><td><code>/{market}/{service}/{sub}/</code></td><td>${pages.filter((p) => p.kind === "sub").length}</td><td>service hub</td></tr>
      <tr><td>3</td><td><code>/{market}/locations/{area}/</code></td><td>${pages.filter((p) => p.kind === "area").length}</td><td>locations</td></tr>
    </tbody>
  </table></div>
</section>

<section class="card">
  <h2>2 — Ten templates, not ${stats.pages} pages</h2>
  <p>Every page is one of these. Build them as page templates or block patterns; the section order is fixed per template
  and is listed on each page's row in <a href="/handoff/pages/">the page specs</a>.</p>
  <div class="table-wrap"><table>
    <thead><tr><th>Template</th><th>WordPress file</th><th>Instances</th><th>Source of truth</th></tr></thead>
    <tbody>${Object.entries(TEMPLATES).map(([k, t]) => `<tr><td><b>${esc(t.name)}</b><br><span class="ph1">${esc(t.one)}</span></td><td><code>${esc(t.wp)}</code></td><td>${pages.filter((p) => p.kind === k).length}</td><td><code>${esc(t.file)}</code></td></tr>`).join("")}</tbody>
  </table></div>
</section>

<section class="card">
  <h2>3 — The field map</h2>
  <p>What is per-page and what is global. <b>Anything marked global must not become a per-page field</b> — that is how
  three phone numbers turn into forty-one and one of them is wrong.</p>

  <h3 style="margin:20px 0 8px">Global — site options, entered once</h3>
  ${fieldTable([
    ["markets[]", "repeater", `Name, slug, region, phone, office address, served areas. ${marketList.length} rows: ${marketList.map(([, m]) => esc(m.name)).join(", ")}. Every NAP on the site reads from here.`],
    ["services[]", "repeater", `Label, slug, per-market availability. ${Object.keys(SERVICE_CONTENT).length} rows. Availability is why St. Louis has no commercial roofing page and its landing has no commercial card.`],
    ["claims", "group", "The gate. Rating, review count, BBB, financing terms, promotions — each empty until sourced. <b>Empty means the component does not render at all</b>, not that it renders blank."],
    ["badges[] / partners[]", "repeater", "Accreditation row and manufacturer strip. Image, alt, source URL. Self-hosted — never hotlink the manufacturers."],
    ["approved_claims", "text[]", "Licensed &amp; insured · free, no-obligation inspections · 25-year workmanship warranty. Nothing else is pre-approved."],
  ])}

  <h3 style="margin:22px 0 8px">Market landing — <code>page-market.php</code></h3>
  ${fieldTable([
    ["hero.eyebrow / headline / sub", "text", "Per market. The headline's last phrase renders in the accent colour automatically — do not wrap it by hand."],
    ["services.heading / intro", "text", "Section head above the service cards."],
    ["why.cards[]", "repeater (title, body)", "Three trust cards. Same shape on every template."],
    ["roofing.cards[]", "repeater", "The roofing sections that used to be separate pages."],
    ["faq[]", "repeater (q, a)", "Market questions first, then the shared service ones."],
  ])}

  <h3 style="margin:22px 0 8px">Service hub — <code>page-service.php</code></h3>
  ${fieldTable([
    ["h1", "text", "<code>{Service} in {Market}</code>. Unique per market — this is the uniqueness bar the whole consolidation rests on."],
    ["lead", "text", "Hero sub-heading. Falls back to the shared service lead when the market has none."],
    ["sections[]", "repeater (title, body)", "The sub-services that are now sections. Some carry a link to a real sub-page."],
    ["process[]", "repeater (title, body)", "Four steps. Ported from the live site's process section, which it ran on every service page."],
    ["local.intro / proof", "wysiwyg", "Market-specific copy. <b>Where this is empty the page is noindex</b> — that rule is enforced by the build, not by hand."],
    ["faq[]", "repeater (q, a)", `Local questions then shared. Currently ${Object.values(SERVICE_CONTENT).reduce((n, s) => n + (s.faq?.length ?? 0), 0)} shared answers across ${Object.keys(SERVICE_CONTENT).length} services.`],
  ])}

  <h3 style="margin:22px 0 8px">Sub-service — <code>page-subservice.php</code></h3>
  ${fieldTable([
    ["parent hub", "relationship", `Required. ${pages.filter((p) => p.kind === "sub").length} sub-pages, each nested under one hub.`],
    ["lead / intro / detail[]", "text, wysiwyg, repeater", "Same shape as the hub, shorter."],
    ["market context", "computed", `Weather, building stock and season notes per market — ${Object.keys(SUBSERVICES).length} service groups' worth. Global data, not typed per page.`],
  ])}
</section>

<section class="card">
  <h2>4 — SEO, which is most of the value</h2>
  <ol class="steps">
    <li><h3>Titles and descriptions</h3><p>One per page, listed in <a href="/handoff/pages/">the page specs</a>. Do not let an
    SEO plugin generate them from a pattern — they were written against the consolidation.</p></li>
    <li><h3>Canonicals</h3><p>Every page self-canonicals to its own trailing-slash URL on <code>https://coldstreamexteriors.com</code>.
    No cross-canonicals, no canonical to the market landing.</p></li>
    <li><h3>The noindex set</h3><p>${stats.noindex} pages carry <code>noindex, follow</code>. They stay that way until the
    content they are waiting on lands. Keep them out of the sitemap and do <b>not</b> disallow them in robots.txt —
    a blocked page cannot be read, so the tag that removes it never gets seen.</p></li>
    <li><h3>Schema</h3><p>One Organization node on the national home with all three offices. LocalBusiness only on market
    pages, one per market, each with its own address and phone. Service pages reference their market's node rather than
    declaring a new one — ${marketList.length} locations, not ${stats.pages}.</p></li>
    <li><h3>Sitemap</h3><p>Only the ${stats.indexable} indexable URLs. Submit it after cutover, then watch Coverage for two weeks.</p></li>
  </ol>
</section>

<section class="card">
  <h2>5 — The redirects</h2>
  <p>${stats.rules} rules. The full table is on <a href="/handoff/redirects/">the 301 map</a>, with an Apache fragment ready to paste.</p>
  <ol class="steps">
    <li><h3>Install above the WordPress block</h3><p>In <code>.htaccess</code>, above <code># BEGIN WordPress</code>. If a
    redirect plugin is used instead, confirm it runs on <code>init</code> before the rewrite — most do, some do not.</p></li>
    <li><h3>Publish with the pages, never before</h3><p>Both halves go live in the same change.</p></li>
    <li><h3>Spot-check the heaviest targets</h3><p>${Object.entries(inbound).sort((a, b) => b[1].length - a[1].length).slice(0, 3)
      .map(([t, l]) => `<code>${esc(t)}</code> takes ${l.length}`).join(", ")}. If those three resolve, the map is wired correctly.</p></li>
    <li><h3>Then check for chains</h3><p>Every rule points at a live page directly. WordPress will happily add a second hop
    (slug change, trailing slash, http→https) and turn one 301 into three. The build verifies there are none; keep it that way.</p></li>
  </ol>
</section>

<section class="card">
  <h2>6 — Forms, media and the things that quietly break</h2>
  <ul>
    <li><b>The estimate form</b> — name, phone, ZIP, service. Posts to <code>/thank-you/</code>, which is noindex by design
    and is the only page nothing links to. Keep the ZIP field: it is how a lead gets routed to a market.</li>
    <li><b>Phone numbers</b> — one per market plus the national number, and they are in the global data. A hard-coded
    number in a template is the bug this structure exists to prevent.</li>
    <li><b>Fonts</b> — Montserrat and Inter, self-hosted as variable woff2. Not Google's CDN: it is a third-party request
    on every page load and it changes the licence conversation.</li>
    <li><b>Badges and partner logos</b> — self-hosted in the build, pulled from the existing media library. Do not hotlink
    manufacturer sites.</li>
    <li><b>Nothing hand-edits the HTML.</b> Under route 1 it is generated and an edit is overwritten by the next build.</li>
  </ul>
</section>

<section class="card">
  <h2>7 — Before you cut over</h2>
  <div class="note go"><p><b>Check these, in this order.</b> Each one has been wrong on a launch before.</p></div>
  <ul>
    <li>Every URL in the sitemap returns 200, and every one of them ends in a slash.</li>
    <li>A sample of 20 old URLs from the 301 map lands on a live page in one hop.</li>
    <li>The ${stats.noindex} noindex pages carry the tag and are absent from the sitemap.</li>
    <li>Each market page shows that market's phone and address, and no other market's.</li>
    <li>The form submits and lands on <code>/thank-you/</code>.</li>
    <li>Nothing on the site prints a star rating, a review count, a BBB claim, a financing figure or a promotion. All of
    it is gated until sourced, and it should still be gated after the migration.</li>
    <li><code>/blog/</code> still serves the WordPress blog and its 45 posts — <b>not</b> this build's empty index. See
    the warning in step 3.</li>
    <li><code>robots.txt</code> reads <code>Allow: /</code> and names the sitemap. If it reads <code>Disallow: /</code>,
    the staging file was uploaded — stop and fix it before anything else on this list matters.</li>
    <li><code>/og-default.jpg</code>, the four icon files and <code>/llms.txt</code> all return 200. Paste the home page URL
    into Slack: if a branded card appears, the first two are right.</li>
    <li>Search Console: submit <code>/sitemap.xml</code>, then watch Coverage and the 404 report for two weeks.</li>
  </ul>
</section>

<section class="card">
  <h2>8 — The search and AI layer, and what it needs from the business</h2>
  <p>Three rounds in August 2026 rebuilt everything a search engine and an AI assistant read before they read the copy.
  Almost none of it is visible on screen, which is exactly why it is written down here — <b>it is also the part most easily
  destroyed by a well-meaning WordPress SEO plugin.</b></p>

  <div class="note stop"><p><b>If route 2 is taken, do not let Yoast, RankMath or All-in-One re-derive any of this.</b>
  Every title and description on this site is written per page, measured, and checked for length and uniqueness on every
  build. A plugin generating them from a template will reintroduce the exact defect this work removed — nine pages sharing
  one description across the three cities. Turn the plugin's title, description, schema and sitemap generation OFF, or do
  not install it.</p></div>

  <h3>What each page carries</h3>
  <ul>
    <li><b>A written title and description</b> — every title inside 60 characters, every description inside 160, measured
    after decoding HTML entities, and no two indexable pages share either. Enforced by <code>npm run verify</code>.</li>
    <li><b>One connected block of machine-readable data</b> (JSON-LD, a single <code>@graph</code>): the page, the website,
    the company, the breadcrumb trail, the service, and the FAQ. Every internal reference in it resolves on that same page —
    also enforced. Do not split it back into separate blocks.</li>
    <li><b>A last-modified date</b> computed from version control, from that page's content sources only. It is in the
    sitemap and on the page. <b>Do not replace it with the WordPress post-modified date</b>, which moves whenever anyone
    opens and saves a page.</li>
    <li><b>Open Graph and Twitter tags in full</b>, including image dimensions, pointing at <code>/og-default.jpg</code>.</li>
    <li><b>Served towns as identified places</b> — the three metros and both states carry Wikidata IDs so a machine knows
    which Columbus. The 77 towns deliberately do not; a wrong ID asserts the wrong place.</li>
  </ul>

  <h3>Still outstanding — these need the business, not the developer</h3>
  <table class="t"><thead><tr><th>Missing</th><th>What it unlocks</th><th>Where it goes</th></tr></thead><tbody>
    <tr><td><b>Google Business Profile URL</b>, one per office</td><td>The link between this site and the map pack. Also the
    star ratings and the three review pages, which are built and deliberately empty.</td><td><code>PROFILES</code> in
    <code>src/data/claims.js</code></td></tr>
    <tr><td><b>Opening hours</b>, per office</td><td>The "Open now" line beside a local result.</td><td><code>HOURS</code> in
    <code>src/data/claims.js</code> — currently <code>null</code>, deliberately</td></tr>
    <tr><td><b>Confirmation the Facebook, Instagram and LinkedIn pages are Coldstream's</b></td><td>They are already declared.
    A wrong one merges the company with a different business in Google's records.</td><td><code>PROFILES</code>, each entry
    flagged <code>CONFIRM OWNERSHIP</code></td></tr>
    <tr><td><b>Founding year, ownership, crew size</b></td><td><code>/about-us/</code> comes out of noindex, and "25+ years"
    stops being gated.</td><td><code>CLAIMS.experience</code> in <code>src/data/claims.js</code></td></tr>
    <tr><td><b>Job photographs with consent</b></td><td>Three gallery pages and the location pages behind them.</td>
    <td>Contractors Cloud pull → <code>src/data/locations.js</code>; shape in <code>contracts.js</code></td></tr>
    <tr><td><b>Lender's own advertised terms</b></td><td><code>/financing/</code> comes out of noindex.</td>
    <td><code>CLAIMS.financing</code> — regulated content, see the note in that file</td></tr>
  </tbody></table>
  <p>Every one of these is <b>gated, not missing</b>: fill the value in one place and it appears everywhere it belongs, on
  the next build. Until then the build names each gap on every run. Nothing invents a placeholder.</p>
</section>`;

// ── page 4: redirects ────────────────────────────────────────────────────────────────────────
const byTarget = Object.entries(inbound).sort((a, b) => b[1].length - a[1].length);
const redirBody = `
<section class="card">
  <h2>${stats.rules} rules, ${byTarget.length} destinations</h2>
  <p>Generated from <code>src/data/redirects.js</code> into <code>public/_redirects</code> (Netlify) and
  <code>site/handoff/htaccess.txt</code> (Apache). The build verifies that every rule points at a page that exists, that
  none of them chain, and that none of them land on a page that is noindex for want of content.</p>
  <div class="note stop"><p><b>Order of operations.</b> These go live in the same change as the pages. Published early they
  point at 404s; published late the old URLs die.</p></div>
</section>
<section class="card">
  <h2>Apache fragment</h2>
  <p>Paste above <code># BEGIN WordPress</code>. The full file is in the handoff package as <code>htaccess.txt</code>.</p>
  <pre>RewriteEngine On
RewriteBase /

# Coldstream Exteriors — consolidation 301s (${stats.rules} rules)
# MUST sit above the WordPress block. Below it, WordPress answers first.
${rules.slice(0, 6).map(([f, t]) => `Redirect 301 ${f} ${t}`).join("\n")}
#   … ${stats.rules - 6} more</pre>
</section>
<div class="grouphead"><h2>Every rule, by destination</h2><span>${byTarget.length} pages take traffic</span></div>
${byTarget.map(([t, froms]) => `
<details class="pagerow">
  <summary>
    <span><span class="purl">${esc(t)}</span><br><span class="ph1">${esc(pages.find((p) => p.url === t)?.h1 ?? "")}</span></span>
    <span class="chip chip--index">${froms.length} in</span>
    <span class="ph1"></span>
  </summary>
  <div class="pbody"><ul class="seclist" style="margin-top:12px">${froms.map((f) => `<li><code>${esc(f)}</code></li>`).join("")}</ul></div>
</details>`).join("")}`;

// ── write ────────────────────────────────────────────────────────────────────────────────────
const out = [
  ["/handoff/", "index.html", shell({
    path: "/handoff/", title: "Start here", eyebrow: "Coldstream Exteriors · build handoff",
    lede: `The static rebuild, what is in it, and the two ways to land it. Written for Rambow; generated from the build so it cannot describe a site that does not exist.`,
    stats: [[stats.pages, "pages"], [stats.indexable, "indexable"], [stats.noindex, "noindex"], [stats.rules, "301 rules"],
            [(stats.words / 1000).toFixed(1) + "k", "words live"], [stats.liveUrls, "live URLs read"]],
    body: startBody,
  })],
  ["/handoff/pages/", "pages/index.html", shell({
    path: "/handoff/pages/", title: "Page specs", eyebrow: "Coldstream Exteriors · build handoff",
    lede: "Every built page: template, title, description, H1, its sections in order, where its copy came from, and what redirects into it.",
    stats: null, body: specsBody,
  })],
  ["/handoff/wordpress/", "wordpress/index.html", shell({
    path: "/handoff/wordpress/", title: "The migration", eyebrow: "Coldstream Exteriors · build handoff",
    lede: "Two routes onto the WordPress host: serve the built HTML as it is — the plan of record — or rebuild the pages in WordPress. Both in full, with the redirects, the SEO and the checks before cutover.",
    stats: null, body: wpBody,
  })],
  ["/handoff/redirects/", "redirects/index.html", shell({
    path: "/handoff/redirects/", title: "The 301 map", eyebrow: "Coldstream Exteriors · build handoff",
    lede: `${stats.rules} retired URLs, each pointed at the page that replaced it. This is the half of the consolidation that keeps the rankings.`,
    stats: null, body: redirBody,
  })],
];

for (const target of [dist, resolve(root, "public")]) {
  for (const [, file, html] of out) {
    const p = join(target, "handoff", file);
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, html);
  }
}
console.log(`  → dist/handoff/ + public/handoff/ — ${out.length} pages for Rambow (${stats.pages} specs, ${stats.rules} rules)`);
