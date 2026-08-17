// Builds the handoff package for the Rambo team.
//
// Run: npm run handoff   →   site/handoff/ (MANIFEST.md, htaccess.txt, coldstream-site-<date>.zip)
//
// site-plan has Rambo serving finished HTML on the existing host, which is why nothing in this
// build depends on an edge runtime. So the deliverable is not a URL — it is a directory of static
// files plus an Apache fragment, and the thing that makes or breaks the migration is the ORDER
// the two go live in. That is what the manifest is for.
//
// The manifest is GENERATED, not written, so it cannot describe a build it did not come from.
// Page counts, the indexable list, the noindex reasons and the redirect count are all read out of
// the same data the site is built from.
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join, relative, resolve } from "node:path";
import { MARKETS, servicesFor } from "../src/data/markets.js";
import { urls, INDEXABLE, NOINDEXED } from "../src/data/sitemap.js";
import { BLOG } from "../src/data/redirects.js";
import { GALLERY_PENDING } from "../src/data/locations.js";
import { REVIEWS_PAGE_PENDING, CLAIMS_PENDING } from "../src/data/claims.js";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const out = resolve(root, "handoff");
const dist = resolve(root, "dist");
if (!existsSync(dist)) { console.error("  ✗ no dist/ — run npm run build first"); process.exit(1); }

// ── THE HANDOFF WILL NOT PACKAGE A FIXTURE BUILD ─────────────────────────────────────────────
//
// This is the one script that turns dist/ into something that goes on the production host, and it
// had no idea what was in dist/. `npm run verify` catches fabricated reviews and synthetic jobs, but
// verify is a separate command nobody is obliged to run — so a fixture build sitting in dist/ could
// be zipped and handed over, and the fake would arrive on coldstreamexteriors.com.
//
// It is checked here rather than trusted to process, because the risk is not "someone sets the env
// var while running the handoff" — it is "dist/ was built with fixtures an hour ago and nobody
// rebuilt". So the test is the OUTPUT, not the environment.
const leaked = [];
const scan = (d) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) scan(p);
    else if (f.endsWith(".html") && /FIXTURE/i.test(readFileSync(p, "utf8"))) leaked.push(relative(dist, p));
  }
};
scan(dist);
if (leaked.length) {
  console.error(`\n  ✗ REFUSING TO PACKAGE — ${leaked.length} page(s) in dist/ contain FIXTURE content.\n`);
  for (const f of leaked.slice(0, 8)) console.error(`      ${f}`);
  if (leaked.length > 8) console.error(`      … and ${leaked.length - 8} more`);
  console.error("\n    This build has synthetic reviews or job records in it. Handing it over would");
  console.error("    publish fabricated endorsements on the live site.\n");
  console.error("    Rebuild without fixtures and run the gates:");
  console.error("      npm run build && npm run verify\n");
  process.exit(1);
}
mkdirSync(out, { recursive: true });

// The build date is passed in rather than read from the clock so two runs of the same source
// produce the same manifest — the same rule the ingestion contract follows.
const STAMP = process.env.HANDOFF_DATE ?? "2026-08-11";

const rules = readFileSync(resolve(root, "public/_redirects"), "utf8")
  .split("\n").filter((l) => l.trim() && !l.startsWith("#"));
const ix = INDEXABLE();
const nx = NOINDEXED();

const M = [];
M.push(`# Coldstream Exteriors — static site handoff`);
M.push("");
M.push(`Build of ${STAMP}. **${ix.length + nx.length} pages · ${rules.length} redirect rules.**`);
M.push("");
M.push("This is a complete static site: plain HTML with a real heading structure, no client");
M.push("framework, no server runtime, no build step on your side. It is designed to be served by");
M.push("the existing host exactly as it is.");
M.push("");
M.push("## What is in the package");
M.push("");
M.push("| File | What it is |");
M.push("|---|---|");
M.push(`| \`coldstream-site-${STAMP}.zip\` | The site. Unzip to the web root. Directory-per-URL, so \`/cincinnati/\` is \`cincinnati/index.html\`. |`);
M.push("| `htaccess.txt` | The 301 map as an Apache fragment. **Read the placement note at the top of the file.** |");
M.push("| `MANIFEST.md` | This file. |");
M.push("");
M.push("## Order of operations — this is the part that matters");
M.push("");
M.push("The redirects and the pages have to go live together. Each half on its own is worse than");
M.push("neither:");
M.push("");
M.push("1. **Upload the site files first**, but do not point the domain at them yet.");
M.push("2. **Add the htaccess fragment ABOVE the WordPress rewrite block.** If it goes below,");
M.push("   WordPress answers first and not one of these rules fires.");
M.push("3. **Cut over.** From this moment the old URLs 301 and the new pages answer.");
M.push("4. **Submit `/sitemap.xml`** in Search Console and watch Coverage for two weeks.");
M.push("");
M.push("Publishing the redirects before the pages exist points every one of them at a 404, which");
M.push("loses the ranking value exactly as a 404 does while looking handled.");
M.push("");
M.push("## Serving requirements");
M.push("");
M.push("- **Trailing slashes.** Every canonical URL ends in `/` and every page is an `index.html`");
M.push("  inside a directory. `DirectoryIndex index.html` must be on. Do not add a rule that");
M.push("  strips trailing slashes — it would fight the canonicals on every page.");
M.push("- **No WordPress on these paths.** WordPress must not attempt to route any URL in the");
M.push("  sitemap. The htaccess fragment sits above its block for this reason.");
M.push("- **Do not hand-edit the HTML.** It is generated. An edit here is overwritten by the next");
M.push("  build and diverges from the source of truth in the meantime.");
M.push("- `robots.txt` is deliberately permissive; page-level control is meta robots on the page.");
M.push("  Disallowing a noindex URL would stop Google reading the tag that removes it.");
M.push("");
M.push("## What is indexable, and what is not");
M.push("");
M.push(`**${ix.length} of ${ix.length + nx.length} pages are indexable.** That is intentional and is not a`);
M.push("broken build. Everything else carries `<meta name=\"robots\" content=\"noindex\">` because the");
M.push("content it needs has not been sourced yet, and a thin page that ranks is worse than a page");
M.push("that waits. The sitemap lists only the indexable set, so the two never contradict.");
M.push("");
M.push("Indexable today:");
M.push("");
for (const u of ix) M.push(`- \`${u.path}\``);
M.push("");
M.push(`Noindex today (${nx.length}) — grouped by what each is waiting on:`);
M.push("");
const byReason = {};
for (const u of nx) (byReason[u.why ?? "unspecified"] ??= []).push(u.path);
for (const [why, list] of Object.entries(byReason)) {
  M.push(`- **${why}** — ${list.length} page(s): ${list.map((p) => `\`${p}\``).join(", ")}`);
}
M.push("");
M.push("## Pages that do not exist yet, by design");
M.push("");
M.push("These templates are finished and generate nothing, because each is gated on real material");
M.push("that has not arrived. They will appear in a later build with no code change:");
M.push("");
M.push(`- **Location pages** — gated on completed-job photos per sub-area.`);
M.push(`- **Market galleries** — same job pull. Pending: ${GALLERY_PENDING.join(", ")}.`);
M.push(`- **Market reviews pages** — gated on real, linkable Google reviews. Pending: ${REVIEWS_PAGE_PENDING.join(", ")}.`);
M.push(`- **/blog/** — no content and no owner. ${BLOG.reason}`);
M.push("");
M.push("## What we need from you");
M.push("");
M.push("Three things, and the first is the one blocking a claim we cannot currently make:");
M.push("");
M.push("1. **The live URL export** — every currently-published URL, one per line. The 301 map");
M.push("   covers the patterns the audit documented, but *coverage of all 299 folding pages is");
M.push("   unverified without the actual list*. Drop it in and the generator names every URL no");
M.push("   rule matches, before cutover rather than after.");
M.push("2. **Page-level ranking data for the ~25 windows URLs.** They are deliberately unmapped:");
M.push("   bay, bow, slider and picture windows may each earn their own search, and folding them");
M.push("   on a guess could retire a page that is quietly earning. They keep 200ing until the data");
M.push("   says otherwise.");
M.push("3. **Blog traffic and backlinks per post.** Same reasoning. No blog URL gets a rule from a");
M.push("   guess — folding a post that carries backlinks throws away the only off-site authority");
M.push("   the domain has.");
M.push("");
M.push("## Known gaps in this build");
M.push("");
M.push(`${CLAIMS_PENDING.length} factual claims are gated off the site entirely until someone sources them —`);
M.push("the promotion, the financing figures, the BBB accreditation, the years-in-business number");
M.push("and all customer testimonials. They are absent from the HTML rather than approximated:");
M.push("");
for (const [k, needs] of CLAIMS_PENDING) M.push(`- \`${k}\` — ${needs}`);
M.push("");
M.push("---");
M.push("");
M.push("Questions on any of the above go back to the Coldstream side, not into an HTML edit.");
M.push("");

writeFileSync(resolve(out, "MANIFEST.md"), M.join("\n"));
copyFileSync(resolve(root, "redirects/htaccess.txt"), resolve(out, "htaccess.txt"));

const zip = resolve(out, `coldstream-site-${STAMP}.zip`);
// pagemap.html is an internal working tool, not part of what Rambo serves.
execFileSync("zip", ["-rq", zip, ".", "-x", "pagemap.html"], { cwd: dist });

console.log(`\n  → handoff package written to site/handoff/`);
console.log(`    · MANIFEST.md                      generated from this build`);
console.log(`    · htaccess.txt                     ${rules.length} rules`);
console.log(`    · coldstream-site-${STAMP}.zip     ${ix.length + nx.length} pages, ${ix.length} indexable`);
console.log("");
