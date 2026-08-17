// CROSS-MARKET BODY-TEXT SIMILARITY. Run: npm run similarity
//
// WHY THIS EXISTS. The old site collapsed because it was one page repeated: 100+ neighbourhood
// pages built from a single skeleton with the town name swapped, and municipality pages that were
// identical across Cincinnati and St. Louis. Thin duplicate pages compete with each other and none
// of them wins. The consolidation fixed the page COUNT; this checks the thing that actually caused
// the damage, which is whether the surviving pages say the same thing as each other.
//
// WHAT IT COMPARES. Only the pages that come in market sets — the three market landings against
// each other, then each service hub against its counterparts in the other two markets. Comparing a
// roofing hub to a gutters hub would be meaningless; comparing Cincinnati roofing to St. Louis
// roofing is exactly the question.
//
// WHAT IT STRIPS. Nav, header, footer, script, style, and the utility bar — every page shares those
// by design and including them would put a floor under every score that has nothing to do with the
// copy. What is left is the body a reader actually reads.
//
// HOW IT SCORES. Jaccard overlap on 5-word shingles. Shingles rather than bare word frequency
// because "roofing" appearing on both roofing pages is not duplication — a whole sentence appearing
// on both is. 5 is long enough that ordinary shared phrasing ("free, no-obligation inspection")
// does not dominate, and short enough to catch a paragraph reused with the city swapped.
//
// THE THRESHOLD IS 80% and it is a reporting threshold, not a build gate. A pair above it is not
// automatically wrong — three service hubs for the same trade legitimately share vocabulary — but it
// is the pair a person has to look at and defend.
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
if (!existsSync(dist)) { console.error("  ✗ no dist/ — run npm run build first"); process.exit(1); }

const MARKETS = ["cincinnati", "columbus", "st-louis"];
const THRESHOLD = 0.80;

const bodyText = (path) => {
  const f = resolve(dist, path.replace(/^\//, ""), "index.html");
  if (!existsSync(f)) return null;
  let h = readFileSync(f, "utf8");
  // Shared chrome, removed. Every page has it; counting it would flatter every score.
  h = h.replace(/<(script|style|nav|footer|header)[\s\S]*?<\/\1>/gi, " ");
  h = h.replace(/<div class="util"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i, " ");
  return h.replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/gi, " ").replace(/\s+/g, " ").trim().toLowerCase();
};

const shingles = (text, n = 5) => {
  const w = text.split(" ").filter(Boolean);
  const out = new Set();
  for (let i = 0; i + n <= w.length; i++) out.add(w.slice(i, i + n).join(" "));
  return out;
};

const jaccard = (a, b) => {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const s of a) if (b.has(s)) inter++;
  return inter / (a.size + b.size - inter);
};

// The page sets that come in threes. Anything a market does not have is skipped rather than scored
// against nothing.
const sets = [{ label: "market landing", paths: MARKETS.map((m) => `/${m}/`) }];
for (const svc of ["roofing", "siding", "windows", "gutters", "commercial-roofing"]) {
  sets.push({ label: `service hub · ${svc}`, paths: MARKETS.map((m) => `/${m}/${svc}/`) });
}
for (const [hub, subs] of Object.entries({
  roofing: ["roof-replacement", "roof-repair", "insurance-storm-damage"],
  siding: ["vinyl-siding", "james-hardie-siding", "siding-replacement"],
})) {
  for (const sub of subs) {
    sets.push({ label: `sub-service · ${hub}/${sub}`, paths: MARKETS.map((m) => `/${m}/${hub}/${sub}/`) });
  }
}

console.log(`\n  CROSS-MARKET SIMILARITY — 5-word shingles, chrome stripped, flagging above ${Math.round(THRESHOLD * 100)}%\n`);

let flagged = 0, compared = 0;
const rows = [];
for (const set of sets) {
  const texts = set.paths.map((p) => ({ p, t: bodyText(p) })).filter((x) => x.t);
  if (texts.length < 2) continue;
  const sh = texts.map((x) => ({ ...x, s: shingles(x.t) }));
  let worst = { v: 0, a: null, b: null };
  for (let i = 0; i < sh.length; i++)
    for (let j = i + 1; j < sh.length; j++) {
      const v = jaccard(sh[i].s, sh[j].s);
      compared++;
      if (v > worst.v) worst = { v, a: sh[i].p, b: sh[j].p };
    }
  const over = worst.v >= THRESHOLD;
  if (over) flagged++;
  rows.push({ label: set.label, worst, over, words: Math.round(texts.reduce((n, x) => n + x.t.split(" ").length, 0) / texts.length) });
}

rows.sort((a, b) => b.worst.v - a.worst.v);
for (const r of rows) {
  const pct = (r.worst.v * 100).toFixed(1).padStart(5);
  console.log(`  ${r.over ? "✗" : "✓"} ${pct}%  ${r.label.padEnd(34)} ~${r.words} words   ${r.worst.a} vs ${r.worst.b}`);
}

console.log(`\n  ${compared} pairs compared across ${rows.length} page sets.`);
console.log(flagged
  ? `\n  ✗ ${flagged} set(s) at or above ${Math.round(THRESHOLD * 100)}% — these read as one page with the city swapped.\n`
  : `\n  ✓ no set at or above ${Math.round(THRESHOLD * 100)}%\n`);

// Reporting tool, not a gate: it exits 0 either way so it can be run on any build without
// blocking one. The number is for a person to judge.
process.exit(0);
