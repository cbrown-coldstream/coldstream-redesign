// WRITES src/data/generated/lastmod.json — when each page's CONTENT last changed, from git.
//
// ── WHY THIS EXISTS, AFTER BEING REFUSED TWICE ───────────────────────────────────────────────
//
// Rounds 42 and 43 both looked at putting <lastmod> in the sitemap and both refused, for the same
// reason: the easy implementation stamps the build date on all 61 URLs, which tells a crawler that
// every page changed every time anyone ran `npm run build`. Google's own guidance is that lastmod
// is used only when it is consistently accurate, and a field that is wrong on 60 of 61 URLs
// teaches it to ignore the field on the sixty-first too. Both rounds wrote down that it was worth
// doing properly or not at all.
//
// This is properly. For each URL, the date is the newest commit touching the CONTENT SOURCES that
// page is built from — its route template plus every module under src/data/ that the template
// imports, transitively.
//
// ── WHAT IS DELIBERATELY EXCLUDED, AND WHY IT MATTERS ────────────────────────────────────────
//
// Components, layouts and stylesheets are NOT counted. Editing BaseLayout changes the bytes of
// all 75 pages, but it does not change what any of them SAY, and a sitemap that reports 61 pages
// modified because a font preload moved is the same lie in a more expensive wrapper. `lastmod`
// answers "has the content changed since you last crawled" — chrome is not content.
//
// Shared DATA is counted, and that is not the same mistake. If markets.js changes, the copy on
// every page that reads it really can change; that is a content edit with a wide blast radius,
// not a cosmetic one.
//
// ── NO GIT, NO DATES ─────────────────────────────────────────────────────────────────────────
//
// If git is unavailable, or a file has no commits yet, the map is written empty or the entry is
// omitted. Both consumers — sitemap.js and BaseLayout's dateModified — drop the field entirely
// rather than substituting today. That is the whole point: absent beats invented.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, relative, join } from "node:path";
import { urls } from "../src/data/sitemap.js";
import { MARKETS } from "../src/data/markets.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pagesDir = resolve(root, "src/pages");
const outFile = resolve(root, "src/data/generated/lastmod.json");

const git = (args) => {
  try { return execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); }
  catch { return ""; }
};

if (!git(["rev-parse", "--git-dir"])) {
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, JSON.stringify({ generated: null, pages: {} }, null, 2) + "\n");
  console.log("  ⚠ lastmod not computed — no git repository. Dates will be omitted, not guessed.");
  process.exit(0);
}

/**
 * Resolve a built URL to the .astro file that produces it.
 *
 * Ordered and deterministic: a concrete file always wins over a dynamic route, which is how
 * /financing/ and /roofing/ — both one segment — resolve to different templates. Anything that
 * fails to resolve is REPORTED rather than silently skipped; a page with no route found is a sign
 * this table has fallen behind src/pages/, and a quietly missing date is exactly the failure this
 * script exists to avoid.
 */
const routeFor = (url) => {
  const seg = url.replace(/^\/|\/$/g, "").split("/").filter(Boolean);
  const file = (...parts) => {
    const p = join(pagesDir, ...parts);
    return existsSync(p) ? p : null;
  };
  const isMarket = (s) => Object.hasOwn(MARKETS, s);

  if (seg.length === 0) return file("index.astro");
  if (url === "/404.html") return file("404.astro");

  if (isMarket(seg[0])) {
    if (seg.length === 1) return file("[market]", "index.astro");
    if (seg.length === 2) return file("[market]", `${seg[1]}.astro`) ?? file("[market]", "[service].astro");
    if (seg[1] === "locations") return file("[market]", "locations", "[area].astro");
    if (seg.length === 3) return file("[market]", "[hub]", "[sub].astro");
    return null;
  }

  if (seg.length === 1) return file(`${seg[0]}.astro`) ?? file("[service].astro");
  if (seg.length === 2) return file("[hub]", "[sub].astro");
  return null;
};

/** Every module under src/data/ that a file imports, transitively. Chrome is not followed. */
const contentDeps = (entry, seen = new Set()) => {
  if (seen.has(entry) || !existsSync(entry)) return seen;
  seen.add(entry);
  const src = readFileSync(entry, "utf8");
  // Static imports and the dynamic await import() form getStaticPaths uses.
  for (const m of src.matchAll(/(?:from|import)\s*\(?\s*["'](\.[^"']+)["']/g)) {
    const target = resolve(dirname(entry), m[1]);
    const rel = relative(root, target);
    if (!rel.startsWith("src/data")) continue;                      // data only — see the header
    // ⚠ NEVER FOLLOW INTO src/data/generated/. This file's own output lives there and seo.js
    //   imports it, so counting it would make every page depend on the date map — and committing
    //   a new map would then bump every page's date, on every build, forever. That is precisely
    //   the "changes on every build" lie this whole script exists to avoid, arriving by the back
    //   door. Generated data is not content.
    if (rel.startsWith("src/data/generated")) continue;
    contentDeps(target, seen);
  }
  return seen;
};

const dateOf = (files) => {
  const dates = [...files]
    .map((f) => git(["log", "-1", "--format=%cI", "--", relative(root, f)]))
    .filter(Boolean);
  return dates.length ? dates.sort().at(-1) : null;
};

const pages = {};
const unresolved = [];
const cache = new Map();

for (const u of urls()) {
  const route = routeFor(u.path);
  if (!route) { unresolved.push(u.path); continue; }
  if (!cache.has(route)) cache.set(route, dateOf(contentDeps(route)));
  const d = cache.get(route);
  if (d) pages[u.path] = d;
}

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify({
  note: "GENERATED by scripts/build-lastmod.mjs. Do not edit. See that file for what the dates mean.",
  // NO "generated at" FIELD, deliberately. It would change on every commit and make this file
  // churn in every diff while none of the dates it carries had moved — the same noise, one level
  // up. The dates below are the content of this file; nothing else belongs in it.
  pages,
}, null, 2) + "\n");

const distinct = new Set(Object.values(pages)).size;
console.log(`  ✓ lastmod — ${Object.keys(pages).length} pages, ${distinct} distinct date${distinct === 1 ? "" : "s"}`);
if (unresolved.length) {
  console.log(`  ⚠ ${unresolved.length} URL(s) resolved to no route — no date written for them:`);
  for (const u of unresolved.slice(0, 10)) console.log(`      ${u}`);
}
