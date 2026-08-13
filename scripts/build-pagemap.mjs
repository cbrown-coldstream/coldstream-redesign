// THE PAGE MAP — a working reference for all 58 pages, generated from the build.
//
// Run: npm run pagemap   →   dist/pagemap.html  (also runs automatically after npm run build)
//
// IT IS WRITTEN INTO dist/, NOT BESIDE IT. The first version wrote to site/pagemap.html, which is
// outside the published directory — so it existed on disk and 404'd on the deployed site, which is
// the one place you would actually go looking for it. It now writes into the build output and into
// public/ so the next build carries it, and npm runs it automatically as a postbuild step.
//
// "How do I know what page I'm working on" is the question this answers. For every page it gives
// the URL, what it is, which template file to edit, whether it is indexable, how many retired URLs
// 301 into it, and what it is still waiting on. Grouped so the variants are visible as structure:
// sub-service pages nest under their hub, location pages under their market.
//
// IT IS GENERATED, NOT WRITTEN. Every number is read out of dist/ and the data modules, so it
// cannot describe a build it did not come from. Rebuild and re-run and it re-states the truth.
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join, relative } from "node:path";
import { MARKETS, servicesFor } from "../src/data/markets.js";
import { SERVICE_CONTENT } from "../src/data/services.js";
import { SUBSERVICES } from "../src/data/subservices.js";
import { LOCATIONS, marketJobs } from "../src/data/locations.js";
import { TESTIMONIALS } from "../src/data/claims.js";
import { GLOBAL_PENDING } from "../src/data/pages/global.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
if (!existsSync(dist)) { console.error("  ✗ no dist/ — run npm run build first"); process.exit(1); }

// ── read the build ───────────────────────────────────────────────────────────────────────────
const walk = (d) => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : p.endsWith("index.html") ? [p] : [];
});
const html = {};
for (const f of walk(dist)) {
  if (f.includes("/handoff/")) continue;   // internal docs, not pages of the site
  let u = "/" + relative(dist, f).replace(/index\.html$/, "").replace(/\\/g, "/");
  if (u === "/./") u = "/";
  html[u] = readFileSync(f, "utf8");
}

const rules = readFileSync(resolve(root, "public/_redirects"), "utf8")
  .split("\n").filter((l) => l.trim() && !l.startsWith("#")).map((l) => l.trim().split(/\s+/));
const redirectsIn = {};
for (const [, to] of rules) redirectsIn[to] = (redirectsIn[to] ?? 0) + 1;

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const words = (h) => h.replace(/<(script|style)[\s\S]*?<\/\1>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().split(" ").length;
const h1of = (h) => { const m = h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/); return m ? decode(m[1].replace(/<[^>]+>/g, "").trim()) : ""; };
const noindexOf = (h) => /name="robots" content="noindex/.test(h);

// ── the model ────────────────────────────────────────────────────────────────────────────────
const page = (url, o) => {
  const h = html[url];
  return {
    url, ...o,
    exists: Boolean(h),
    h1: h ? h1of(h) : "",
    words: h ? words(h) : 0,
    noindex: h ? noindexOf(h) : false,
    redirectsIn: redirectsIn[url] ?? 0,
  };
};

const groups = [];

groups.push({
  key: "sitewide", label: "Site-wide", note: "Five pages that are not scoped to a market.",
  rows: [
    page("/", { what: "National landing and market chooser. Hero video, badge row, the router.", tpl: "src/pages/index.astro" }),
    page("/about-us/", { what: "The company story. Deliberately not repeated on the market About pages.", tpl: "src/pages/about-us.astro", needs: "Founding year, ownership, crew size, markets-served history." }),
    page("/free-estimate/", { what: "National conversion page. Routes to a market.", tpl: "src/pages/free-estimate.astro" }),
    page("/thank-you/", { what: "Post-submit confirmation. Reached by submitting the form — the one page nothing links to, on purpose. noindex permanently, by design, not for want of anything." , tpl: "src/pages/thank-you.astro" }),
    page("/blog/", { what: "Advice index. Built and empty — 48 live posts stay on WordPress until each has traffic and backlink numbers.", tpl: "src/pages/blog.astro", needs: "A decision on which of the 48 posts migrate." }),
  ],
});

for (const [slug, m] of Object.entries(MARKETS)) {
  const rows = [];
  const loc = LOCATIONS[slug] ?? {};
  const hasPhotos = marketJobs(slug).length > 0;
  const hasReviews = (TESTIMONIALS[slug] ?? []).length > 0;

  rows.push(page(`/${slug}/`, { what: `Market landing. The only page carrying this market's address and its LocalBusiness node.`, tpl: "src/pages/[market]/index.astro", kind: "landing" }));

  for (const s of servicesFor(m)) {
    const sourced = Boolean(SERVICE_CONTENT[s.key]?.local?.[slug]);
    rows.push(page(`/${slug}/${s.key}/`, {
      what: `${s.label} hub for ${m.name}.`, tpl: "src/pages/[market]/[service].astro", kind: "hub",
      needs: sourced ? null : "Running on written local copy. Contractors Cloud job records upgrade it in place.",
    }));
    for (const [subKey, sub] of Object.entries(SUBSERVICES[s.key] ?? {})) {
      rows.push(page(`/${slug}/${s.key}/${subKey}/`, {
        what: `${sub.label} — nested under the ${s.label.toLowerCase()} hub.`,
        tpl: "src/pages/[market]/[hub]/[sub].astro", kind: "sub", parent: `/${slug}/${s.key}/`,
      }));
    }
  }

  rows.push(page(`/${slug}/reviews/`, { what: "Customer reviews for this market.", tpl: "src/pages/[market]/reviews.astro", kind: "proof", needs: hasReviews ? null : "Real, attributable, linkable GBP reviews. Nothing is invented in the meantime." }));
  rows.push(page(`/${slug}/gallery/`, { what: "Completed work across the market.", tpl: "src/pages/[market]/gallery.astro", kind: "proof", needs: hasPhotos ? null : "Completed-job photos from Contractors Cloud, with consent recorded." }));
  rows.push(page(`/${slug}/about/`, { what: "This office, this crew, this building stock. The company story stays on /about-us/.", tpl: "src/pages/[market]/about.astro", kind: "editorial" }));
  rows.push(page(`/${slug}/free-estimate/`, { what: "Market conversion page — this market's number on the form.", tpl: "src/pages/[market]/free-estimate.astro", kind: "convert" }));

  if (loc.metro) {
    rows.push(page(`/${slug}/locations/`, { what: `One metro page covering all ${m.servedAreas.length} towns. No compass split — it is a ring city.`, tpl: "src/pages/[market]/locations/index.astro", kind: "location" }));
  }
  for (const [key, area] of Object.entries(loc.areas ?? {})) {
    const proof = (area.jobs ?? []).length > 0;
    rows.push(page(`/${slug}/locations/${key}/`, {
      what: `${area.name} — ${area.towns.length} towns.`, tpl: "src/pages/[market]/locations/[area].astro", kind: "location",
      needs: proof ? null : "Job photos for this sub-area. Renders an honest empty state until then.",
      towns: area.towns,
    }));
  }

  groups.push({
    key: slug, label: m.name, note: `${m.region} · ${m.phone} · ${m.office.street}, ${m.office.city}`,
    rows,
  });
}

const beyond = ["/privacy-policy/", "/terms/", "/financing/"].filter((u) => html[u]);
groups.push({
  key: "beyond", label: "Beyond the 58", note: "Built and kept deliberately — each is linked from every footer.",
  rows: beyond.map((u) => page(u, {
    what: u === "/financing/" ? "Financing. All figures gated until a lender is confirmed."
        : u === "/terms/" ? "Warranty, payment and dispute terms."
        : "Required — the estimate form collects a name, phone and ZIP.",
    tpl: `src/pages/${u.replace(/\//g, "")}.astro`,
    needs: (GLOBAL_PENDING.find((g) => g.path === u) ?? {}).needs ?? null,
  })),
});

const all = groups.flatMap((g) => g.rows);
const inventoryCount = all.length - beyond.length;
const stats = {
  total: all.length,
  inventory: inventoryCount,
  indexable: all.filter((r) => !r.noindex).length,
  noindex: all.filter((r) => r.noindex).length,
  needs: all.filter((r) => r.needs).length,
  rules: rules.length,
  words: all.reduce((n, r) => n + r.words, 0),
};

// ── fonts, inlined ───────────────────────────────────────────────────────────────────────────
const font = (f) => readFileSync(resolve(root, "public/fonts", f)).toString("base64");
const FONTS = {
  saira: font("saira-condensed-800-latin.woff2"),
  sans: font("public-sans-400-latin.woff2"),
  sansBold: font("public-sans-700-latin.woff2"),
};

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const rowHtml = (r) => `
  <tr class="row${r.needs ? " row--needs" : ""}${r.kind === "sub" ? " row--sub" : ""}" data-url="${esc(r.url)}" data-state="${r.needs ? "needs" : "ready"}" data-index="${r.noindex ? "noindex" : "indexable"}">
    <td class="c-url">
      <a href="https://coldstream-exteriors-staging.netlify.app${esc(r.url)}" target="_blank" rel="noopener">${esc(r.url)}</a>
      <span class="tpl">${esc(r.tpl)}</span>
    </td>
    <td class="c-what">
      <p class="h1">${esc(r.h1) || "<em>no h1</em>"}</p>
      <p class="what">${esc(r.what)}</p>
      ${r.towns ? `<p class="towns">${r.towns.map(esc).join(" · ")}</p>` : ""}
      ${r.needs ? `<p class="needs"><span>Waiting on</span> ${esc(r.needs)}</p>` : ""}
    </td>
    <td class="c-flags">
      <span class="chip chip--${r.noindex ? "noindex" : "index"}">${r.noindex ? "noindex" : "indexed"}</span>
    </td>
    <td class="c-num">${r.words.toLocaleString()}</td>
    <td class="c-num">${r.redirectsIn || "—"}</td>
  </tr>`;

const groupHtml = (g) => `
<section class="group" id="g-${g.key}">
  <header class="group-head">
    <h2>${esc(g.label)}</h2>
    <p>${esc(g.note)}</p>
    <span class="count">${g.rows.length} page${g.rows.length === 1 ? "" : "s"}</span>
  </header>
  <div class="table-wrap">
    <table>
      <thead><tr><th>URL &amp; template</th><th>What it is</th><th>Index</th><th>Words</th><th>301s in</th></tr></thead>
      <tbody>${g.rows.map(rowHtml).join("")}</tbody>
    </table>
  </div>
</section>`;

const doc = `<title>Coldstream Exteriors — Page Map</title>
<style>
@font-face{font-family:"Saira Condensed";src:url(data:font/woff2;base64,${FONTS.saira}) format("woff2");font-weight:800;font-display:swap}
@font-face{font-family:"Public Sans";src:url(data:font/woff2;base64,${FONTS.sans}) format("woff2");font-weight:400;font-display:swap}
@font-face{font-family:"Public Sans";src:url(data:font/woff2;base64,${FONTS.sansBold}) format("woff2");font-weight:700;font-display:swap}

:root{
  --paper:#FFFFFF; --surface:#F2F6F9; --sunk:#E9EFF4;
  --ink:#101B26; --muted:#5B6B78; --faint:#8A99A6;
  --line:#E4EAEF; --rule:#D3DDE5;
  --blue:#3A89C7; --blue-deep:#2A6699; --amber:#E8843B;
  --ready:#3A89C7; --waiting:#E8843B;
  --display:"Saira Condensed",system-ui,sans-serif;
  --body:"Public Sans",system-ui,-apple-system,sans-serif;
}
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){
    --paper:#0E1B2A; --surface:#14283C; --sunk:#0A1522;
    --ink:#E8EEF4; --muted:#9DB0C0; --faint:#6E8296;
    --line:#1E3346; --rule:#264056;
    --blue:#6FB3E8; --blue-deep:#8CC5F2; --amber:#F2A163;
    --ready:#6FB3E8; --waiting:#F2A163;
  }
}
:root[data-theme="dark"]{
  --paper:#0E1B2A; --surface:#14283C; --sunk:#0A1522;
  --ink:#E8EEF4; --muted:#9DB0C0; --faint:#6E8296;
  --line:#1E3346; --rule:#264056;
  --blue:#6FB3E8; --blue-deep:#8CC5F2; --amber:#F2A163;
  --ready:#6FB3E8; --waiting:#F2A163;
}

*{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);font-family:var(--body);line-height:1.55;-webkit-font-smoothing:antialiased}
a{color:var(--blue-deep)}
.shell{max-width:1240px;margin:0 auto;padding:0 24px 96px}

header.top{padding:56px 0 30px;border-bottom:3px solid var(--ink)}
.eyebrow{font-family:var(--display);font-weight:800;text-transform:uppercase;letter-spacing:.24em;font-size:.72rem;color:var(--blue-deep);margin:0 0 12px}
h1{font-family:var(--display);font-weight:800;font-size:clamp(2.3rem,5vw,3.7rem);line-height:.95;letter-spacing:.005em;margin:0 0 14px;text-wrap:balance;text-transform:uppercase}
.lede{max-width:64ch;color:var(--muted);font-size:1.03rem;margin:0}

.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(128px,1fr));gap:1px;background:var(--rule);border:1px solid var(--rule);margin:30px 0 0}
.stat{background:var(--paper);padding:15px 17px}
.stat b{display:block;font-family:var(--display);font-weight:800;font-size:1.85rem;line-height:1;font-variant-numeric:tabular-nums}
.stat span{display:block;font-size:.7rem;text-transform:uppercase;letter-spacing:.13em;color:var(--faint);margin-top:6px;font-weight:700}
.stat--wait b{color:var(--waiting)}

nav.rail{position:sticky;top:0;z-index:5;background:var(--paper);border-bottom:1px solid var(--line);padding:13px 0;display:flex;flex-wrap:wrap;gap:7px;align-items:center}
nav.rail a{font-family:var(--display);font-weight:800;text-transform:uppercase;letter-spacing:.07em;font-size:.83rem;text-decoration:none;color:var(--ink);background:var(--surface);border:1px solid var(--line);padding:7px 13px}
nav.rail a:hover,nav.rail a:focus-visible{border-color:var(--blue);color:var(--blue-deep)}
.filters{margin-left:auto;display:flex;gap:7px}
button.f{font-family:var(--body);font-weight:700;font-size:.78rem;padding:7px 13px;border:1px solid var(--line);background:var(--paper);color:var(--muted);cursor:pointer}
button.f[aria-pressed="true"]{background:var(--ink);color:var(--paper);border-color:var(--ink)}
button.f:focus-visible,nav.rail a:focus-visible{outline:2px solid var(--blue);outline-offset:2px}

.group{margin-top:52px;scroll-margin-top:70px}
.group-head{display:flex;align-items:baseline;gap:14px;flex-wrap:wrap;border-bottom:2px solid var(--ink);padding-bottom:9px;margin-bottom:0}
.group-head h2{font-family:var(--display);font-weight:800;text-transform:uppercase;font-size:1.55rem;letter-spacing:.02em;margin:0}
.group-head p{margin:0;color:var(--muted);font-size:.87rem;flex:1;min-width:220px}
.count{font-family:var(--display);font-weight:800;font-size:.82rem;text-transform:uppercase;letter-spacing:.12em;color:var(--faint);font-variant-numeric:tabular-nums}

.table-wrap{overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:.9rem}
thead th{text-align:left;font-family:var(--display);font-weight:800;text-transform:uppercase;letter-spacing:.13em;font-size:.68rem;color:var(--faint);padding:11px 12px;border-bottom:1px solid var(--rule);white-space:nowrap}
thead th:nth-child(4),thead th:nth-child(5){text-align:right}
.row{border-bottom:1px solid var(--line);border-left:3px solid transparent}
.row:hover{background:var(--surface)}
.row--needs{border-left-color:var(--waiting)}
.row--sub .c-url a{padding-left:18px;position:relative}
.row--sub .c-url a::before{content:"";position:absolute;left:4px;top:.62em;width:9px;height:1px;background:var(--faint)}
td{padding:13px 12px;vertical-align:top}
.c-url{min-width:250px}
.c-url a{font-family:var(--display);font-weight:800;font-size:.98rem;letter-spacing:.01em;text-decoration:none;color:var(--ink);display:inline-block;word-break:break-all}
.c-url a:hover{color:var(--blue-deep);text-decoration:underline}
.tpl{display:block;font-size:.7rem;color:var(--faint);margin-top:4px;font-variant-numeric:tabular-nums;word-break:break-all}
.c-what{min-width:300px}
.c-what .h1{margin:0;font-weight:700;font-size:.9rem}
.c-what .what{margin:3px 0 0;color:var(--muted);font-size:.85rem}
.towns{margin:6px 0 0;font-size:.74rem;color:var(--faint);line-height:1.5}
.needs{margin:8px 0 0;font-size:.81rem;color:var(--ink);background:var(--surface);border-left:2px solid var(--waiting);padding:7px 10px}
.needs span{font-family:var(--display);font-weight:800;text-transform:uppercase;letter-spacing:.11em;font-size:.65rem;color:var(--waiting);display:block}
.chip{display:inline-block;font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.09em;padding:4px 8px;white-space:nowrap}
.chip--index{background:color-mix(in srgb,var(--blue) 14%,transparent);color:var(--blue-deep)}
.chip--noindex{border:1px dashed var(--faint);color:var(--faint)}
.c-num{text-align:right;font-variant-numeric:tabular-nums;color:var(--muted);white-space:nowrap}

footer.end{margin-top:64px;padding-top:22px;border-top:1px solid var(--line);color:var(--faint);font-size:.82rem}
.row[hidden]{display:none}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
</style>

<div class="shell">
<header class="top">
  <p class="eyebrow">Coldstream Exteriors · static rebuild</p>
  <h1>The Page Map</h1>
  <p class="lede">Every page in the build: what it is, which file to edit, whether it is indexable,
  how many retired URLs redirect into it, and what it is still waiting on. Generated from the build
  itself — rebuild and re-run <code>npm run pagemap</code> and this restates the truth. URLs link to staging.</p>
  <div class="stats">
    <div class="stat"><b>${stats.inventory}</b><span>inventory pages</span></div>
    <div class="stat"><b>${beyond.length}</b><span>kept beyond</span></div>
    <div class="stat"><b>${stats.indexable}</b><span>indexable</span></div>
    <div class="stat"><b>${stats.noindex}</b><span>noindex</span></div>
    <div class="stat stat--wait"><b>${stats.needs}</b><span>awaiting input</span></div>
    <div class="stat"><b>${stats.rules}</b><span>301 rules</span></div>
    <div class="stat"><b>${(stats.words / 1000).toFixed(1)}k</b><span>words live</span></div>
  </div>
</header>

<nav class="rail" aria-label="Jump to section">
  ${groups.map((g) => `<a href="#g-${g.key}">${esc(g.label)}</a>`).join("")}
  <span class="filters">
    <button class="f" id="f-all" aria-pressed="true">All</button>
    <button class="f" id="f-needs" aria-pressed="false">Awaiting input</button>
    <button class="f" id="f-noindex" aria-pressed="false">noindex</button>
  </span>
</nav>

${groups.map(groupHtml).join("")}

<footer class="end">
  Generated ${stats.total} pages from <code>dist/</code> and <code>public/_redirects</code>.
  The orange rule marks a page waiting on something — the full list of what, and every default taken
  to get here, is in <code>site/DECISIONS.md</code>.
</footer>
</div>

<script>
(function(){
  var rows = Array.prototype.slice.call(document.querySelectorAll("tr.row"));
  var btns = { all: document.getElementById("f-all"), needs: document.getElementById("f-needs"), noindex: document.getElementById("f-noindex") };
  function apply(mode){
    Object.keys(btns).forEach(function(k){ btns[k].setAttribute("aria-pressed", String(k === mode)); });
    rows.forEach(function(r){
      var show = mode === "all"
        || (mode === "needs" && r.dataset.state === "needs")
        || (mode === "noindex" && r.dataset.index === "noindex");
      r.hidden = !show;
    });
    document.querySelectorAll(".group").forEach(function(g){
      var any = Array.prototype.some.call(g.querySelectorAll("tr.row"), function(r){ return !r.hidden; });
      g.hidden = !any;
    });
  }
  Object.keys(btns).forEach(function(k){ btns[k].addEventListener("click", function(){ apply(k); }); });
})();
</script>`;

writeFileSync(resolve(dist, "pagemap.html"), doc);
writeFileSync(resolve(root, "public/pagemap.html"), doc);
console.log(`\n  → dist/pagemap.html + public/pagemap.html — ${stats.total} pages (${stats.inventory} inventory + ${beyond.length} beyond), ${stats.needs} awaiting input\n`);
