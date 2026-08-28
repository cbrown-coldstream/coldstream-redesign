// WORDPRESS / BRICKS BUILD KIT — the third handoff zip (Rambow's ask, 2026-08-30).
//
// Rambow's developer is rebuilding this site in WordPress with the Bricks builder rather than
// serving the static HTML. What that developer needs is not 71 HTML files but the four things
// buried inside them: the CONTENT (per page, in order, copy-pasteable), the DESIGN TOKENS, the
// SEO DATA (titles, descriptions, robots, schema, redirects), and the BEHAVIOUR SPEC. This
// script extracts all four from the built site, so the kit can never drift from what the pages
// actually say — same principle as the review-board inventory, which uses the same parser rules.
//
// Output: rambow-handoff-kit/ (staged by build-rambow-package.sh into 3-wordpress-bricks-kit.zip)
import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync, cpSync, rmSync } from "node:fs";
import { join, relative } from "node:path";

const DIST = "dist";
const OUT = "rambow-handoff-kit";
const EXCLUDE = /^(handoff|preview|blog)(\/|$)/;

// content/design/seo are regenerated wholesale; screens/ is PRESERVED — the screenshot run is
// slow and lives in its own step, and wiping it here would silently ship an empty folder.
for (const d of ["content", "design", "seo"]) rmSync(join(OUT, d), { recursive: true, force: true });
for (const d of ["content", "design", "seo", "screens"]) mkdirSync(join(OUT, d), { recursive: true });

/* ── collect pages ── */
const pages = [];
(function walk(dir) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p);
    else if (n === "index.html") {
      const rel = relative(DIST, dir).split("\\").join("/");
      if (EXCLUDE.test(rel)) continue;
      pages.push({ path: rel === "" ? "/" : `/${rel}/`, html: readFileSync(p, "utf8") });
    }
  }
})(DIST);
pages.sort((a, b) => a.path.localeCompare(b.path));

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"')
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const text = (s) => decode(s.replace(/<[^>]+>/g, " "));
const grab = (h, re) => { const m = h.match(re); return m ? m[1] : null; };
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

const SHEET_CSS = `body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.6;color:#101B26;max-width:860px;margin:36px auto;padding:0 24px}
h1{border-bottom:3px solid #E8843B;padding-bottom:8px}
h2{margin-top:2em;padding-top:.6em;border-top:1px solid #E4EAEF}
h3{color:#2A6699}
.meta{background:#F2F6F9;border:1px solid #E4EAEF;border-radius:10px;padding:14px 18px;font-size:.95em}
.meta b{display:inline-block;min-width:130px}
.faq-q{font-weight:700;margin-bottom:2px}
.note{color:#5B6B78;font-style:italic}
details{border:1px solid #E4EAEF;border-radius:8px;padding:10px 14px;margin-top:1.5em}
pre{white-space:pre-wrap;font-size:.8em;background:#F2F6F9;padding:12px;border-radius:8px}`;

/* ── one content sheet per page ── */
const index = [];
for (const p of pages) {
  const title = decode(grab(p.html, /<title>([\s\S]*?)<\/title>/i) ?? "");
  const desc = decode(grab(p.html, /<meta name="description" content="([^"]*)"/i) ?? "");
  const noindex = /<meta name="robots" content="[^"]*noindex/i.test(p.html);
  const jsonld = grab(p.html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  let body = p.html.split(/<footer/i)[0].replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "");
  const h1 = grab(body, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const afterH1 = body.slice(body.search(/<\/h1>/i));

  // walk h2/h3/summary/p/li in order, building a clean outline
  const toks = [...afterH1.matchAll(/<(h2|h3|summary|p|li|blockquote)\b[^>]*>([\s\S]*?)<\/\1>/gi)]
    .map((m) => ({ tag: m[1].toLowerCase(), t: text(m[2]) }))
    .filter((x) => x.t && x.t !== "Get Your Free Estimate");
  const out = [];
  const seen = new Set();
  for (const tk of toks) {
    const key = tk.tag + "|" + tk.t;
    if (seen.has(key)) continue;                    // marquee clones, aria-hidden duplicates
    seen.add(key);
    if (tk.tag === "h2") out.push(`<h2>${esc(tk.t)}</h2>`);
    else if (tk.tag === "h3") out.push(`<h3>${esc(tk.t)}</h3>`);
    else if (tk.tag === "summary") out.push(`<p class="faq-q">Q: ${esc(tk.t.replace(/\s*\+$/, ""))}</p>`);
    else if (tk.tag === "li") out.push(`<ul><li>${esc(tk.t)}</li></ul>`);
    else out.push(`<p>${esc(tk.t)}</p>`);
  }

  const slug = p.path === "/" ? "home" : p.path.slice(1, -1).replace(/\//g, "--");
  const file = `content/${slug}.html`;
  writeFileSync(join(OUT, file), `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(p.path)} — content</title><style>${SHEET_CSS}</style>
<h1>${esc(p.path)}</h1>
<div class="meta">
  <p><b>SEO title:</b> ${esc(title)}</p>
  <p><b>Meta description:</b> ${esc(desc)}</p>
  <p><b>Indexing:</b> ${noindex ? "NOINDEX — intentionally hidden from search until real content lands" : "index, follow"}</p>
  <p><b>Canonical:</b> https://coldstreamexteriors.com${esc(p.path)} <span class="note">(always with the trailing slash)</span></p>
  <p><b>H1:</b> ${esc(text(h1 ?? ""))}</p>
</div>
${out.join("\n")}
${jsonld ? `<details><summary>Structured data (JSON-LD) — paste as-is into a code block on this page</summary><pre>${esc(jsonld.trim())}</pre></details>` : ""}
`);
  index.push({ path: p.path, file, title, noindex });
}

/* ── content index ── */
writeFileSync(join(OUT, "content/index.html"), `<!doctype html><meta charset="utf-8"><title>Content sheets</title><style>${SHEET_CSS}</style>
<h1>Content sheets — one per page (${index.length})</h1>
<p>Each sheet carries the page's SEO fields, heading outline and full copy, in page order, plus
its structured data. Build the page in Bricks from the sheet; check it against the matching
screenshot and the live preview.</p>
<ul>${index.map((i) => `<li><a href="${i.file.replace("content/", "")}">${esc(i.path)}</a>${i.noindex ? ' <span class="note">(noindex)</span>' : ""} — ${esc(i.title)}</li>`).join("\n")}</ul>`);

/* ── design tokens ── */
cpSync("src/styles/tokens.css", join(OUT, "design/tokens.css"));
cpSync("src/styles/ui-tokens.css", join(OUT, "design/ui-tokens.css"));
cpSync("brand/tokens.json", join(OUT, "design/brand-tokens.json"));
cpSync("brand/voice-spec.json", join(OUT, "design/voice-spec.json"));

/* ── seo pack ── */
writeFileSync(join(OUT, "seo/meta-all-pages.csv"),
  "path,indexing,seo_title,meta_description\n" +
  index.map((i) => {
    const pg = pages.find((p) => p.path === i.path);
    const desc = decode(grab(pg.html, /<meta name="description" content="([^"]*)"/i) ?? "");
    return `"${i.path}","${i.noindex ? "noindex" : "index"}","${i.title.replace(/"/g, '""')}","${desc.replace(/"/g, '""')}"`;
  }).join("\n"));
// Redirection-plugin CSV from the Netlify rules (source target 301) — same map, WP-importable.
const rules = readFileSync("dist/_redirects", "utf8").split("\n")
  .map((l) => l.trim()).filter((l) => l && !l.startsWith("#"))
  .map((l) => l.split(/\s+/)).filter((a) => a.length >= 3 && a[2] === "301");
writeFileSync(join(OUT, "seo/redirects-for-redirection-plugin.csv"),
  "source,target,regex,http_code\n" + rules.map(([s, t]) => {
    const isPattern = s.includes(":") || s.includes("*");
    const src = isPattern ? "^" + s.replace(/:[a-z]+/g, "[^/]+").replace(/\*/g, ".*") + "$" : s;
    return `"${src}","${t}",${isPattern ? 1 : 0},301`;
  }).join("\n"));
cpSync("dist/robots.txt", join(OUT, "seo/robots.txt"));
cpSync("dist/llms.txt", join(OUT, "seo/llms.txt"));

console.log(`${index.length} content sheets, ${rules.length} redirect rows → ${OUT}/`);
