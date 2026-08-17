// PUSH THE BUILD'S PAGE LIST INTO THE REVIEW BOARD'S DATABASE.
//
// Run: SUPABASE_SERVICE_KEY=... npm run review:sync
//
// WHY A SYNC RATHER THAN THE BOARD READING THE BUILD. The board's rows have to exist in Postgres
// before anyone can attach a status, a tick or an edit request to one — a foreign key needs
// something to point at. So the build stays the source of truth for WHICH pages exist, and this
// copies that list across whenever it changes.
//
// IT IS AN UPSERT, AND IT NEVER DELETES. A page that disappears from the build keeps its row, its
// notes and its edit requests. Deleting the row would cascade and take the team's discussion of
// that page with it — and a page vanishing from a build is usually a rename or a mistake, both of
// which are exactly when you want the notes still there. Stale rows are cheap; lost decisions are
// not. `synced_at` is how you spot one.
//
// THE SERVICE KEY IS READ FROM THE ENVIRONMENT AND NEVER WRITTEN DOWN. It bypasses RLS entirely —
// it is the one credential that could read and rewrite the whole board — and this repo is public.
// If it is missing, this exits with instructions rather than doing anything partial.
import { INDEXABLE, NOINDEXED } from "../src/data/sitemap.js";
import { MARKETS } from "../src/data/markets.js";
import { laneFor } from "../src/data/review-sections.js";
import { foldsInto } from "../src/data/consolidation.js";

const PROJECT = process.env.SUPABASE_PROJECT_REF ?? "riwmmxhrpgcunfwikxqm";
const KEY = process.env.SUPABASE_SERVICE_KEY;

if (!KEY) {
  console.error("\n  ✗ SUPABASE_SERVICE_KEY is not set.\n");
  console.error("    Find it in the Supabase dashboard under Project Settings → API,");
  console.error("    then run:  SUPABASE_SERVICE_KEY=... npm run review:sync\n");
  console.error("    Do not paste it into a file in this repo — the repo is public.\n");
  process.exit(1);
}

const URL = `https://${PROJECT}.supabase.co/rest/v1`;
const marketSlugs = Object.keys(MARKETS);
const folds = foldsInto();

const NAMES = {
  "/": "Home", "/free-estimate/": "Free estimate", "/service-areas/": "Service areas",
  "/commercial-roofing/": "Commercial roofing", "/about-us/": "About Coldstream",
  "/financing/": "Financing", "/privacy-policy/": "Privacy policy", "/terms/": "Terms",
  "/blog/": "Advice", "/thank-you/": "Thank you", "/sitemap/": "This board",
};
const titleFor = (p) =>
  NAMES[p] ?? (p.replace(/\/$/, "").split("/").pop() ?? "").replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());

const rows = [
  ...INDEXABLE().map((u) => ({ path: u.path, indexable: true, waiting_on: null })),
  ...NOINDEXED().map((u) => ({ path: u.path, indexable: false, waiting_on: u.why ?? null })),
]
  .filter((u) => u.path !== "/404.html")
  .map((u) => {
    const seg = u.path.replace(/^\//, "").split("/")[0];
    return {
      ...u,
      title: titleFor(u.path),
      lane: laneFor(u.path, marketSlugs),
      market: marketSlugs.includes(seg) ? seg : null,
      absorbed_urls: (folds[u.path] ?? []).length,
      synced_at: new Date().toISOString(),
    };
  });

const res = await fetch(`${URL}/pages?on_conflict=path`, {
  method: "POST",
  headers: {
    apikey: KEY,
    Authorization: `Bearer ${KEY}`,
    "Content-Type": "application/json",
    "Content-Profile": "review",
    Prefer: "resolution=merge-duplicates,return=minimal",
  },
  body: JSON.stringify(rows),
});

if (!res.ok) {
  console.error(`\n  ✗ sync failed — HTTP ${res.status}`);
  console.error("   ", (await res.text()).slice(0, 400), "\n");
  process.exit(1);
}

const byLane = rows.reduce((a, r) => ((a[r.lane] = (a[r.lane] ?? 0) + 1), a), {});
console.log(`\n  → review.pages — ${rows.length} pages upserted`);
for (const [lane, n] of Object.entries(byLane).sort((a, b) => b[1] - a[1]))
  console.log(`      ${String(n).padStart(3)}  ${lane}`);
console.log(`\n  ${rows.filter((r) => !r.indexable).length} noindex · ${rows.filter((r) => r.absorbed_urls > 0).length} absorbed retired URLs\n`);
