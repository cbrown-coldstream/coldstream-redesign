// GENERATES public/og-default.jpg — the card every shared link renders as.
//
// WHY THIS IS A SCRIPT AND NOT A JPEG SOMEBODY EXPORTED. The card is the hero ground, the display
// face and the logo, and all three are tokens. Exported once by hand, it is the first thing to go
// stale when the brand repaints, and nothing would ever catch it — a wrong-coloured share card is
// invisible from inside the site. Generated, it repaints with `npm run build`.
//
// IT DID NOT EXIST AT ALL UNTIL ROUND 42. BaseLayout has pointed og:image at /og-default.jpg since
// the first build and the file was never created, so every link shared to Facebook, LinkedIn,
// Slack or iMessage rendered as a blank rectangle. verify-build §13 now fails the build if the
// referenced file is missing, so this cannot silently regress.
//
// HEADLESS CHROME rather than an image library: the card is HTML using the same fonts and the same
// gradient as the site, so it cannot drift from the hero it is supposed to echo, and the repo
// gains no image dependency. Chrome is already the tool round 35 used to measure the mobile
// viewport. If Chrome is absent the build WARNS and continues — a developer without Chrome should
// still be able to build the site, and the committed JPEG is what ships.
import { execFileSync } from "node:child_process";
import { existsSync, writeFileSync, unlinkSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(root, "public/og-default.jpg");

const CHROME = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].find((p) => existsSync(p));

if (!CHROME) {
  console.log("  ⚠ og image not regenerated — no Chrome found. Using the committed file.");
  process.exit(0);
}

const tokens = JSON.parse(readFileSync(resolve(root, "ui-tokens.json"), "utf8")).web;
const logo = readFileSync(resolve(root, "public/logo-coldstream-ondark.png")).toString("base64");
const font = readFileSync(resolve(root, "public/fonts/montserrat-var-latin.woff2")).toString("base64");

// 1200×630 is the size Facebook, LinkedIn, X and Slack all crop from without letterboxing.
// The copy is the three approved always-true claims and the three metros — nothing gated, so this
// file can never become the surface that leaks a claim the rest of the site refuses to make.
const card = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:Montserrat;src:url(data:font/woff2;base64,${font}) format("woff2");font-weight:100 900}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;font-family:Montserrat,sans-serif;
     background:${tokens.hero_base};color:#fff}
.card{width:1200px;height:630px;position:relative;display:flex;flex-direction:column;
      justify-content:center;padding:0 92px}
.ground{position:absolute;inset:0;background:${tokens.hero_ground}}
.scrim{position:absolute;inset:0;background:${tokens.hero_scrim}}
.inner{position:relative}
img{height:74px;width:auto;display:block;margin-bottom:44px}
h1{font-size:66px;font-weight:${tokens.display_weight_hero};line-height:${tokens.display_lh};
   letter-spacing:${tokens.display_ls};max-width:1030px}
h1 em{font-style:normal;color:${tokens.hero_accent}}
p{margin-top:30px;font-size:29px;font-weight:600;color:${tokens.hero_sub};letter-spacing:.01em}
ul{margin-top:38px;display:flex;gap:34px;list-style:none;font-size:23px;font-weight:600;
   color:${tokens.hero_bullet}}
li::before{content:"✓";color:${tokens.hero_accent};margin-right:11px;font-weight:800}
</style>
<div class="card"><div class="ground"></div><div class="scrim"></div><div class="inner">
  <img src="data:image/png;base64,${logo}" alt="">
  <h1>Roofing, siding, windows<br>and <em>gutters</em></h1>
  <p>Cincinnati · Columbus · St. Louis</p>
  <ul><li>Licensed and insured</li><li>Free inspections</li><li>25-year workmanship warranty</li></ul>
</div></div>`;

const tmpHtml = resolve(root, ".og-card.html");
const tmpPng = resolve(root, ".og-card.png");
writeFileSync(tmpHtml, card);

try {
  execFileSync(CHROME, [
    "--headless", "--disable-gpu", "--hide-scrollbars",
    "--window-size=1200,630",
    `--screenshot=${tmpPng}`,
    `file://${tmpHtml}`,
  ], { stdio: "pipe" });

  // sips is macOS-only; on Linux the PNG is kept and the reference stays valid because the
  // extension is what BaseLayout names. Converting is worth doing where it is available — a
  // photographic gradient is 4× smaller as a JPEG and scrapers cap the file size they will fetch.
  try {
    execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "82", tmpPng, "--out", out], { stdio: "pipe" });
  } catch {
    execFileSync("cp", [tmpPng, out]);
  }
  console.log("  ✓ og-default.jpg regenerated (1200×630)");
} catch (e) {
  console.log(`  ⚠ og image not regenerated — ${String(e.message).split("\n")[0]}`);
} finally {
  for (const f of [tmpHtml, tmpPng]) if (existsSync(f)) unlinkSync(f);
}
