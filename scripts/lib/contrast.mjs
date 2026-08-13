// Measures what the hero copy is actually drawn on, and returns the real WCAG contrast ratios.
//
// TWO GROUNDS, AND THE CHECK HAS TO KNOW WHICH ONE IS PAINTING.
//
//   measureHeroGround — the default. No page passes hero media, so the copy sits on the CSS
//     ground: the navy gradient with the 105° wash over it, both from ui-tokens.json's web
//     block. Contrast is a property of those tokens, and this composites them rather than
//     restating a ratio somebody once computed by hand.
//
//   measureHero — for when real photography lands. A photo goes UNDER the wash, and the wash is
//     translucent, so contrast becomes a property of whichever image is in the slot. Swap in a
//     bright hero shot and AA can break with no error anywhere; this is the check that catches
//     it. It takes the brightest pixel in the copy band, which is the worst case a viewer gets.
//
// The old bottom-up scrim this file used to model is gone from the web hero — that geometry is
// the social renderer's, and it stayed there when the two systems were separated.
//
// No image library is available, so this shells out to macOS `sips` to downsample to PNG and
// decodes that by hand. It only needs an average and a worst case over a region, and a 100px-wide
// sample is ample for both.
import { execFileSync } from "node:child_process";
import { readFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { inflateSync } from "node:zlib";

const lin = (c) => (c / 255 <= 0.04045 ? c / 255 / 12.92 : (((c / 255) + 0.055) / 1.055) ** 2.4);
export const relL = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
export const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

/** Decode a small PNG to { W, H, ch, rows } with the PNG filters undone. */
const decodePng = (buf) => {
  let pos = 8, W = 0, H = 0, ct = 0;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString("ascii", pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === "IHDR") { W = data.readUInt32BE(0); H = data.readUInt32BE(4); ct = data[9]; }
    else if (type === "IDAT") idat.push(data);
    pos += 12 + len;
  }
  const raw = inflateSync(Buffer.concat(idat));
  const ch = { 0: 1, 2: 3, 4: 2, 6: 4 }[ct];
  const stride = W * ch;
  const rows = [];
  let prev = Buffer.alloc(stride), i = 0;
  for (let y = 0; y < H; y++) {
    const f = raw[i++];
    const line = Buffer.from(raw.subarray(i, i + stride)); i += stride;
    for (let x = 0; x < stride; x++) {
      const a = x >= ch ? line[x - ch] : 0, b = prev[x], c = x >= ch ? prev[x - ch] : 0;
      if (f === 1) line[x] = (line[x] + a) & 255;
      else if (f === 2) line[x] = (line[x] + b) & 255;
      else if (f === 3) line[x] = (line[x] + ((a + b) >> 1)) & 255;
      else if (f === 4) {
        const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        line[x] = (line[x] + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 255;
      }
    }
    rows.push(line); prev = line;
  }
  return { W, H, ch, rows };
};

// ── the copy column ────────────────────────────────────────────────────────────────────────
// .hero .wrap is a 1.08fr/.92fr grid with align-items:center, so the text occupies roughly the
// left 4–52% horizontally and the middle 30–72% vertically. Both measurements below sample that
// same box, so a photo result and a CSS result are comparable.
const COPY = { x0: 0.04, x1: 0.52, y0: 0.30, y1: 0.72 };

/** Parse `#rrggbb` or `rgba(r,g,b,a)` into {r,g,b,a}. */
const parseColor = (s) => {
  const t = s.trim();
  const rgba = t.match(/rgba?\(([^)]+)\)/);
  if (rgba) {
    const [r, g, b, a = "1"] = rgba[1].split(",").map((v) => v.trim());
    return { r: +r, g: +g, b: +b, a: parseFloat(a) };
  }
  const h = t.replace("#", "");
  const n = h.length === 3 ? h.split("").map((c) => c + c) : h.match(/../g);
  return { r: parseInt(n[0], 16), g: parseInt(n[1], 16), b: parseInt(n[2], 16), a: 1 };
};

/** Stops of a linear-gradient, as [{ pos 0..1, color }]. Positions must be explicit percentages. */
const parseStops = (grad) => {
  const inner = grad.slice(grad.indexOf("(") + 1, grad.lastIndexOf(")"));
  // split on commas that are not inside rgba()
  const parts = inner.split(/,(?![^(]*\))/).map((p) => p.trim());
  return parts.slice(1).map((p) => {
    const m = p.match(/^(.*?)\s+([\d.]+)%$/);
    return { color: parseColor(m[1]), pos: parseFloat(m[2]) / 100 };
  });
};

const sample = (stops, t) => {
  if (t <= stops[0].pos) return stops[0].color;
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i].pos) {
      const a = stops[i - 1], b = stops[i];
      const f = (t - a.pos) / (b.pos - a.pos || 1);
      return {
        r: a.color.r + (b.color.r - a.color.r) * f,
        g: a.color.g + (b.color.g - a.color.g) * f,
        b: a.color.b + (b.color.b - a.color.b) * f,
        a: a.color.a + (b.color.a - a.color.a) * f,
      };
    }
  }
  return stops[stops.length - 1].color;
};

const over = (fg, bg) => ({
  r: fg.r * fg.a + bg.r * (1 - fg.a),
  g: fg.g * fg.a + bg.g * (1 - fg.a),
  b: fg.b * fg.a + bg.b * (1 - fg.a),
  a: 1,
});

/**
 * Measure the CSS hero ground — what paints when no page passes hero media, which today is
 * every page. Takes ui-tokens.json's `web` block so the tokens stay the single source: change a
 * gradient there and this follows it instead of going quietly stale.
 *
 * The two gradients run at 135° and 105°, so progress along each axis is approximated as a
 * fraction of x (and of x+y for the diagonal). That is close enough for a worst-case sweep and
 * errs light, which is the safe direction for a contrast floor.
 */
export const measureHeroGround = (web) => {
  const base = parseColor(web.hero_base);
  const ground = parseStops(web.hero_ground);
  const wash = parseStops(web.hero_scrim);
  const accent = parseColor(web.hero_accent);

  let lightest = 0, at = null;
  for (let x = COPY.x0; x <= COPY.x1; x += 0.02) {
    for (let y = COPY.y0; y <= COPY.y1; y += 0.02) {
      const bg = over(sample(ground, (x + y) / 2), base);   // 135° plate over the flat base
      const px = over(sample(wash, x), bg);                 // 105° wash, left to right
      const L = relL(px.r, px.g, px.b);
      if (L > lightest) { lightest = L; at = { x, y }; }
    }
  }
  return {
    lightestLuminance: lightest,
    lightestAt: at,
    whiteRatio: ratio(1.0, lightest),                                  // h1, sub, bullets, call link
    accentRatio: ratio(relL(accent.r, accent.g, accent.b), lightest),  // the headline's last phrase
  };
};

/**
 * Measure a hero photo and report the worst contrast the copy would get over it.
 *
 * Unused while no page passes media — kept because the moment one does, the ground stops being
 * a known quantity and this is the check that says so.
 */
export const measureHero = (posterPath, web) => {
  const dir = mkdtempSync(join(tmpdir(), "cs-contrast-"));
  const png = join(dir, "s.png");
  execFileSync("sips", ["-s", "format", "png", "-z", "56", "100", posterPath, "--out", png], { stdio: "pipe" });
  const { W, H, ch, rows } = decodePng(readFileSync(png));

  const wash = parseStops(web.hero_scrim);
  const accent = parseColor(web.hero_accent);

  // The wash is translucent and thins out to the right, so the worst pixel is not simply the
  // brightest one — it is the brightest one AFTER the wash that covers it. Composite per pixel.
  let sum = 0, n = 0, worst = 0;
  for (let y = Math.floor(COPY.y0 * H); y < Math.floor(COPY.y1 * H); y++) {
    for (let x = Math.floor(COPY.x0 * W); x < Math.floor(COPY.x1 * W); x++) {
      const o = x * ch;
      const px = over(sample(wash, x / W), { r: rows[y][o], g: rows[y][o + 1], b: rows[y][o + 2], a: 1 });
      const L = relL(px.r, px.g, px.b);
      sum += L; n++;
      if (L > worst) worst = L;
    }
  }
  return {
    avgLuminance: sum / n,
    brightestLuminance: worst,
    whiteRatio: ratio(1.0, worst),                                  // h1, sub, bullets, call link
    accentRatio: ratio(relL(accent.r, accent.g, accent.b), worst),  // the headline's last phrase
  };
};
