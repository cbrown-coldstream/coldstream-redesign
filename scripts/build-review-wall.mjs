// THE REVIEW WALL — every page rendered live, side by side, at a viewport you choose.
//
// Run: npm run review   →   dist/review.html  (also runs automatically after npm run build)
//
// WHY THIS EXISTS ALONGSIDE pagemap.html, WHICH IS NOT A DUPLICATE OF IT. The page map answers
// "what is this page and which file do I edit" — a reference table, no pixels. It cannot answer
// "does this page LOOK right", which is the question you have when reviewing 67 pages that are
// three markets' worth of the same lanes. This renders each one in an iframe so the answer is
// visible rather than inferred.
//
// SAME-ORIGIN IS THE WHOLE TRICK. The iframes use relative srcs and this file ships inside dist/,
// so it works identically opened from disk, on staging, and after cutover — no host allowlist, no
// CSP negotiation, nothing to configure. A review tool hosted somewhere else could not frame these
// pages at all, which is why it is generated into the build rather than published separately.
//
// THE 390px TOGGLE IS NOT DECORATION. A known open bug is that the header row does not wrap at
// 390px and the H1 runs off the right edge. A wall that only shows desktop would hide the one
// defect most worth catching, so the viewport switch is a first-class control.
//
// IT IS GENERATED, NOT WRITTEN. Pages, titles and noindex state are read out of dist/; the palette
// is read out of brand/tokens.json and ui-tokens.json so this tool cannot drift from the brand it
// is displaying. Rebuild and re-run and it re-states the truth.
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join, relative, sep } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
if (!existsSync(dist)) { console.error("  ✗ no dist/ — run npm run build first"); process.exit(1); }

const tokens = JSON.parse(readFileSync(join(root, "brand/tokens.json"), "utf8"));
const ui = JSON.parse(readFileSync(join(root, "ui-tokens.json"), "utf8"));
const C = tokens.color, W = ui.web;

const walk = (d) => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : p.endsWith("index.html") ? [p] : [];
});

// Same exclusion the gates use, and for the same reason: the handoff site and the generated docs
// ship inside dist/ for convenience but are not pages of the website.
const DOCS = (f) => f.includes(`${sep}handoff${sep}`);

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const pages = walk(dist).filter((f) => !DOCS(f)).map((f) => {
  const html = readFileSync(f, "utf8");
  const url = "/" + relative(dist, f).replace(/index\.html$/, "").replace(/\\/g, "/");
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "").replace(/\s+/g, " ").trim();
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  const noindex = /<meta[^>]+name=["']robots["'][^>]*noindex/i.test(html);
  return { url, title, h1, noindex, words: html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length };
}).sort((a, b) => a.url.localeCompare(b.url));

// Grouped by market because that is how the work is actually reviewed — the three markets are the
// same lanes and the interesting question is whether they agree.
const MARKETS = { cincinnati: "Cincinnati", columbus: "Columbus", "st-louis": "St. Louis" };
const groupOf = (u) => {
  const seg = u.split("/")[1] ?? "";
  return MARKETS[seg] ? MARKETS[seg] : "National & global";
};
const groups = [...new Set(pages.map((p) => groupOf(p.url)))]
  .sort((a, b) => (a === "National & global" ? -1 : b === "National & global" ? 1 : a.localeCompare(b)))
  .map((name) => ({ name, items: pages.filter((p) => groupOf(p.url) === name) }));

const card = (p) => `
<article class="card${p.noindex ? " is-noindex" : ""}" data-url="${esc(p.url)}" data-noindex="${p.noindex}">
  <div class="frame"><iframe loading="lazy" title="${esc(p.url)}" src="${esc(p.url)}" tabindex="-1" scrolling="no"></iframe></div>
  <div class="meta">
    <a class="u" href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.url)}</a>
    <p class="h">${esc(p.h1 || p.title || "—")}</p>
    <p class="badges">
      ${p.noindex ? '<span class="b b-no">noindex — awaiting data</span>' : '<span class="b b-ix">indexable</span>'}
      <span class="b b-w">${p.words.toLocaleString()} words</span>
    </p>
  </div>
</article>`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Review wall — ${pages.length} pages</title>
<style>
@font-face{font-family:Montserrat;src:url(/fonts/montserrat-var-latin.woff2) format("woff2");font-weight:100 900;font-display:swap}
@font-face{font-family:Inter;src:url(/fonts/inter-var-latin.woff2) format("woff2");font-weight:100 900;font-display:swap}
:root{
  --primary:${C.primary}; --deep:${C.primary_deep}; --accent:${C.accent};
  --ink:${C.text}; --muted:${C.text_muted}; --line:${C.neutrals.line};
  --paper:${C.surface_paper}; --cloud:${C.surface}; --dark:${C.deep_dark};
  --display:${W.display}; --body:${W.body};
  --vw:1280px;      /* the width each iframe RENDERS at — the toggle rewrites this */
  --vh:820px;       /* how much of the page each card shows */
  --cardw:340px;
}
*{box-sizing:border-box}
body{margin:0;background:var(--cloud);color:var(--ink);font-family:var(--body),system-ui,sans-serif;-webkit-font-smoothing:antialiased}
header{position:sticky;top:0;z-index:10;background:var(--dark);color:var(--paper);padding:14px clamp(14px,3vw,30px);
  display:flex;flex-wrap:wrap;gap:14px 22px;align-items:center;box-shadow:0 2px 14px rgba(14,27,42,.28)}
h1{font-family:var(--display),system-ui,sans-serif;font-weight:800;font-size:1.05rem;letter-spacing:-.01em;margin:0}
h1 small{display:block;font-family:var(--body),system-ui,sans-serif;font-weight:400;font-size:.78rem;opacity:.72;letter-spacing:0}
.controls{display:flex;flex-wrap:wrap;gap:8px;margin-left:auto}
button{font-family:var(--display),system-ui,sans-serif;font-weight:700;font-size:.82rem;cursor:pointer;
  background:rgba(255,255,255,.1);color:var(--paper);border:1px solid rgba(255,255,255,.28);border-radius:8px;padding:7px 13px}
button:hover{background:rgba(255,255,255,.2)}
button[aria-pressed=true]{background:var(--paper);color:var(--deep);border-color:var(--paper)}
button:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
main{padding:clamp(14px,3vw,30px)}
section{margin:0 0 38px}
h2{font-family:var(--display),system-ui,sans-serif;font-weight:800;font-size:1.5rem;letter-spacing:-.015em;margin:0 0 3px}
.count{color:var(--muted);font-size:.85rem;margin:0 0 16px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(var(--cardw),1fr));gap:20px}
.card{background:var(--paper);border:1px solid var(--line);border-radius:12px;overflow:hidden;
  box-shadow:0 1px 3px rgba(16,27,38,.07);transition:box-shadow .15s,transform .15s}
.card:hover{box-shadow:0 8px 26px rgba(16,27,38,.14);transform:translateY(-2px)}
.card.is-noindex{border-color:var(--accent);border-width:2px}
/* The frame is a fixed-size window; the iframe inside renders at full --vw and is scaled down to
   fit it. Scaling rather than shrinking the viewport is the point — a 390px-wide render is what
   a phone actually gets, so layout bugs at that width show up here instead of hiding. */
.frame{position:relative;height:calc(var(--vh) * (var(--cardw) / var(--vw)));background:var(--cloud);
  border-bottom:1px solid var(--line);overflow:hidden}
.frame iframe{position:absolute;top:0;left:0;width:var(--vw);height:var(--vh);border:0;
  transform:scale(calc(var(--cardw) / var(--vw)));transform-origin:0 0;pointer-events:none}
.meta{padding:11px 13px 13px}
.u{font-family:var(--display),system-ui,sans-serif;font-weight:700;font-size:.9rem;color:var(--deep);
  text-decoration:none;word-break:break-word}
.u:hover{text-decoration:underline}
.h{margin:4px 0 8px;font-size:.82rem;line-height:1.4;color:var(--muted)}
.badges{margin:0;display:flex;flex-wrap:wrap;gap:5px}
.b{font-size:.68rem;font-weight:600;padding:3px 7px;border-radius:5px;white-space:nowrap}
.b-ix{background:#e8f3ea;color:#12823B}
.b-no{background:#fdf0e6;color:#a8571c}
.b-w{background:var(--cloud);color:var(--muted)}
[hidden]{display:none !important}
@media print{header{position:static}.card{break-inside:avoid}}
</style>
</head>
<body>
<header>
  <h1>Review wall<small>${pages.length} pages · ${pages.filter((p) => !p.noindex).length} indexable · ${pages.filter((p) => p.noindex).length} noindex · generated from this build</small></h1>
  <div class="controls">
    <button id="vp-d" aria-pressed="true">Desktop 1280</button>
    <button id="vp-t" aria-pressed="false">Tablet 768</button>
    <button id="vp-m" aria-pressed="false">Mobile 390</button>
    <button id="f-all" aria-pressed="true">All</button>
    <button id="f-ix" aria-pressed="false">Indexable</button>
    <button id="f-no" aria-pressed="false">Noindex</button>
    <button id="sz">Bigger</button>
  </div>
</header>
<main>
${groups.map((g) => `<section>
  <h2>${esc(g.name)}</h2>
  <p class="count">${g.items.length} pages</p>
  <div class="grid">${g.items.map(card).join("")}</div>
</section>`).join("\n")}
</main>
<script>
const r = document.documentElement.style;
const vp = { "vp-d": ["1280px","820px"], "vp-t": ["768px","900px"], "vp-m": ["390px","760px"] };
const press = (ids, on) => ids.forEach(i => document.getElementById(i).setAttribute("aria-pressed", String(i === on)));
Object.keys(vp).forEach(id => document.getElementById(id).onclick = () => {
  const [w,h] = vp[id]; r.setProperty("--vw", w); r.setProperty("--vh", h); press(Object.keys(vp), id);
});
const filters = { "f-all": () => true, "f-ix": c => c.dataset.noindex === "false", "f-no": c => c.dataset.noindex === "true" };
Object.keys(filters).forEach(id => document.getElementById(id).onclick = () => {
  document.querySelectorAll(".card").forEach(c => { c.hidden = !filters[id](c); });
  document.querySelectorAll("section").forEach(s => {
    const vis = [...s.querySelectorAll(".card")].filter(c => !c.hidden).length;
    s.hidden = vis === 0;
    s.querySelector(".count").textContent = vis + " pages";
  });
  press(Object.keys(filters), id);
});
// Card width steps rather than a slider: three sizes cover "scan the wall" through "read the copy".
const steps = ["340px","520px","760px"]; let si = 0;
document.getElementById("sz").onclick = (e) => {
  si = (si + 1) % steps.length; r.setProperty("--cardw", steps[si]);
  e.target.textContent = si === 2 ? "Smaller" : "Bigger";
};
</script>
</body>
</html>
`;

writeFileSync(join(dist, "review.html"), html);
writeFileSync(join(root, "public", "review.html"), html);
console.log(`\n  → dist/review.html + public/review.html — ${pages.length} pages (${pages.filter((p) => p.noindex).length} noindex), live at /review.html`);
