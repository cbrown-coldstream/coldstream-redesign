// Publish the brand files from here into coldstream-os. Run: npm run brand:publish
//
// DIRECTION REVERSED 2026-08-13. This repo is now authoritative for brand/tokens.json and
// brand/voice-spec.json. It used to be the other way round — coldstream-os held the originals and
// scripts/brand-sync.mjs pulled them down. That script is gone; pulling now would overwrite the
// truth with a copy, which is the whole reason it was deleted rather than kept "just in case".
//
// WHERE THEY GO AND WHAT READS THEM. coldstream-os/design-systems/exteriors/ is the authored export
// that supabase/seed-brand.sh loads into the content_portal_brands table, and the render-post edge
// function rasterises social and print assets from that table — not from the file. So a colour that
// changes here reaches a rendered post only after BOTH steps:
//
//   npm run brand:publish            # here → coldstream-os/design-systems/exteriors/
//   ./supabase/seed-brand.sh exteriors   # in coldstream-os, file → database
//
// Skipping the second is the failure mode to watch: the website repaints, the posts do not, and the
// two drift while every file on disk looks correct.
//
// WHY COPIES AND NOT A DEPENDENCY — unchanged by the reversal. This repo has to build on a host that
// has never heard of coldstream-os: Rambow's, Netlify's, a fresh clone. A build that reaches outside
// its own tree for a colour is a build that fails somewhere you are not looking. brand/ stays
// committed here and nothing in `npm run build` calls this script.
//
// WHAT IT DOES NOT DO: commit, push, or seed. It writes two files into a working tree you still have
// to review and commit yourself. Cross-repo automation that also commits is how a brand change lands
// in a repo nobody was looking at.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

// Override with COLDSTREAM_OS=/path/to/coldstream-os when it is not a sibling directory.
const os = process.env.COLDSTREAM_OS ?? resolve(root, "../coldstream-os");
const to = join(os, "design-systems/exteriors");

if (!existsSync(to)) {
  console.error(`  ✗ coldstream-os not found at ${os}`);
  console.error("    Clone it beside this repo, or set COLDSTREAM_OS=/path/to/coldstream-os.");
  console.error("    Nothing was changed. brand/ here is still the source of truth either way.");
  process.exit(1);
}

let changed = 0;
for (const f of ["tokens.json", "voice-spec.json"]) {
  const src = join(root, "brand", f);
  const dst = join(to, f);
  if (!existsSync(src)) { console.log(`  ✗ ${f} missing in brand/ — left alone`); continue; }
  const a = readFileSync(src, "utf8");
  const b = existsSync(dst) ? readFileSync(dst, "utf8") : null;
  if (a === b) { console.log(`  = ${f} already current in coldstream-os`); continue; }
  writeFileSync(dst, a);
  changed++;
  console.log(`  ↑ ${f} published${b === null ? " (new file)" : ""}`);
}

console.log(changed
  ? `\n  ${changed} file(s) written to ${to}.` +
    "\n  NOT DONE YET — in coldstream-os: review the diff, commit, then" +
    "\n  ./supabase/seed-brand.sh exteriors   (the renderer reads the database, not the file)."
  : "\n  Nothing to do — coldstream-os already matches.");
