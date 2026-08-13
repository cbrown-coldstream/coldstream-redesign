// Re-pull the brand files from coldstream-os. Run: npm run brand:sync
//
// brand/tokens.json and brand/voice-spec.json are VENDORED COPIES. The originals live in the
// coldstream-os repo under design-systems/exteriors/, where the render-post edge function reads
// them to rasterise every social and print asset. That repo is authoritative for both.
//
// WHY COPIES AND NOT A DEPENDENCY. This repo has to build on a host that has never heard of
// coldstream-os — Rambo's, Netlify's, a fresh clone on a new laptop. A build that reaches outside
// its own tree for a colour is a build that fails somewhere you are not looking. So the files are
// committed here and this script re-syncs them on demand.
//
// WHAT IT DOES NOT DO: push. Nothing here writes back to coldstream-os. If a brand value needs to
// change it changes there, in the file render-post reads, and then comes back down through this.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

// Override with COLDSTREAM_OS=/path/to/coldstream-os when it is not a sibling directory.
const os = process.env.COLDSTREAM_OS ?? resolve(root, "../coldstream-os");
const from = join(os, "design-systems/exteriors");

if (!existsSync(from)) {
  console.error(`  ✗ coldstream-os not found at ${os}`);
  console.error("    Clone it beside this repo, or set COLDSTREAM_OS=/path/to/coldstream-os.");
  console.error("    Nothing was changed — the committed copies in brand/ are still valid.");
  process.exit(1);
}

let changed = 0;
for (const f of ["tokens.json", "voice-spec.json"]) {
  const src = join(from, f);
  const dst = join(root, "brand", f);
  if (!existsSync(src)) { console.log(`  ✗ ${f} missing in coldstream-os — left alone`); continue; }
  const a = readFileSync(src, "utf8");
  const b = existsSync(dst) ? readFileSync(dst, "utf8") : null;
  if (a === b) { console.log(`  = ${f} already current`); continue; }
  writeFileSync(dst, a);
  changed++;
  console.log(`  ↓ ${f} updated`);
}

console.log(changed
  ? `\n  ${changed} file(s) synced. Run \`npm run tokens && npm run build\` — a colour change is a rebuild.`
  : "\n  Nothing to do.");
