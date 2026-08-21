// GENERATES THE FAVICON SET — public/favicon.ico, favicon-96.png, favicon-192.png,
// apple-touch-icon.png.
//
// THE SITE HAD NO ICON OF ANY KIND until round 43. That is not only a browser-tab problem: Google
// shows a favicon beside every result on mobile, and a site without one gets a generic globe next
// to its listing while every competitor in the list shows their mark. It is the smallest piece of
// brand real estate in the search result and it was empty.
//
// GENERATED FOR THE SAME REASON THE OG CARD IS. The source is the on-dark logo lockup and the
// brand navy; both are tokens. An icon exported by hand is the first asset to go stale when the
// brand repaints, and a stale favicon is invisible from inside the site.
//
// WHY THE MARK AND NOT THE LOCKUP. "COLDSTREAM EXTERIORS" set across 16 pixels is a grey smear.
// The circular droplet mark reads at 16px, which is the size that actually matters. It is drawn
// white on the brand navy rather than blue on transparent, because a transparent icon disappears
// into a dark browser chrome and the tab is where most people see it.
//
// THE .ico IS A PNG INSIDE AN ICO CONTAINER, which has been valid since Windows Vista and is what
// every modern generator emits. It is written by hand below — 22 bytes of header around a PNG — so
// this repo does not take an image dependency for one file.
import { execFileSync } from "node:child_process";
import { existsSync, writeFileSync, readFileSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pub = (f) => resolve(root, "public", f);

const CHROME = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].find((p) => existsSync(p));

if (!CHROME) {
  console.log("  ⚠ icons not regenerated — no Chrome found. Using the committed files.");
  process.exit(0);
}

const tokens = JSON.parse(readFileSync(resolve(root, "ui-tokens.json"), "utf8")).web;
const logo = readFileSync(pub("logo-coldstream-ondark.png")).toString("base64");

// THE CROP, IN SOURCE PIXELS. The lockup is 3300×960 and the mark occupies roughly x 31–821,
// y 65–855 of it — a 790px square around the circle, including the tail that breaks its lower
// right edge. Written as numbers rather than eyeballed in CSS so the arithmetic below is checkable
// against the file if the lockup is ever re-exported at a different size.
const SRC_W = 3300, SRC_H = 960;
const CROP = { x: 31, y: 65, side: 790 };
const BOX = 512;                                  // the master render; everything else resizes down
const scale = BOX / CROP.side;
const inset = 0.78;                               // the mark fills 78% of the square, the rest is ground

const card = `<!doctype html><meta charset="utf-8"><style>
*{margin:0;padding:0}
body{width:${BOX}px;height:${BOX}px;overflow:hidden;background:${tokens.hero_base}}
.sq{width:${BOX}px;height:${BOX}px;background:#1c4c78;display:flex;align-items:center;justify-content:center}
.mark{
  width:${Math.round(BOX * inset)}px;height:${Math.round(BOX * inset)}px;
  background-image:url(data:image/png;base64,${logo});
  background-repeat:no-repeat;
  background-size:${Math.round(SRC_W * scale * inset)}px ${Math.round(SRC_H * scale * inset)}px;
  background-position:${-Math.round(CROP.x * scale * inset)}px ${-Math.round(CROP.y * scale * inset)}px;
  /* blue artwork on transparent → solid white, without needing a second source file */
  filter:brightness(0) invert(1);
}
</style><div class="sq"><div class="mark"></div></div>`;

const tmpHtml = resolve(root, ".icon.html");
const master = resolve(root, ".icon-512.png");
writeFileSync(tmpHtml, card);

const sizes = [
  [192, pub("favicon-192.png")],
  [180, pub("apple-touch-icon.png")],
  [96, pub("favicon-96.png")],
];

/** ICO with a single PNG image inside it — 6-byte header, one 16-byte entry, then the PNG. */
const icoFromPng = (png, size) => {
  const head = Buffer.alloc(6);
  head.writeUInt16LE(0, 0);                       // reserved
  head.writeUInt16LE(1, 2);                       // type 1 = icon
  head.writeUInt16LE(1, 4);                       // one image
  const dir = Buffer.alloc(16);
  dir[0] = size >= 256 ? 0 : size;                // 0 means 256
  dir[1] = size >= 256 ? 0 : size;
  dir[2] = 0;                                     // palette
  dir[3] = 0;                                     // reserved
  dir.writeUInt16LE(1, 4);                        // colour planes
  dir.writeUInt16LE(32, 6);                       // bits per pixel
  dir.writeUInt32LE(png.length, 8);
  dir.writeUInt32LE(head.length + dir.length, 12);
  return Buffer.concat([head, dir, png]);
};

try {
  execFileSync(CHROME, [
    "--headless", "--disable-gpu", "--hide-scrollbars",
    `--window-size=${BOX},${BOX}`,
    `--screenshot=${master}`,
    `file://${tmpHtml}`,
  ], { stdio: "pipe" });

  for (const [px, out] of sizes) {
    execFileSync("sips", ["-z", String(px), String(px), master, "--out", out], { stdio: "pipe" });
  }

  // 48 is what Google's own guidance asks for — the icon it shows beside a mobile result is
  // rendered from a multiple of 48, and anything smaller gets upscaled and looks it.
  const ico48 = resolve(root, ".icon-48.png");
  execFileSync("sips", ["-z", "48", "48", master, "--out", ico48], { stdio: "pipe" });
  writeFileSync(pub("favicon.ico"), icoFromPng(readFileSync(ico48), 48));
  unlinkSync(ico48);

  console.log("  ✓ favicons regenerated — .ico 48, png 96/180/192");
} catch (e) {
  console.log(`  ⚠ icons not regenerated — ${String(e.message).split("\n")[0]}`);
} finally {
  for (const f of [tmpHtml, master]) if (existsSync(f)) unlinkSync(f);
}
