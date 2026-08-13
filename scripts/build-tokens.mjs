// Regenerate src/styles/tokens.css from the brand system.
//
// brand/tokens.json is the source of truth for colour — locked 2026-07-29.
//
// THIS REPO IS AUTHORITATIVE FOR IT (reversed 2026-08-13; it used to be a vendored copy of
// coldstream-os/design-systems/exteriors/tokens.json). A brand colour changes HERE, and
// `npm run brand:publish` pushes it out to coldstream-os, where seed-brand.sh loads it into the
// database that render-post rasterises social posts from. Changing it there instead makes the
// website and the rendered posts two brands that merely resemble each other, which is the exact
// failure this file exists to prevent — the direction flipped, the failure did not.
//
//   npm run tokens
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const t = JSON.parse(readFileSync(join(here, "../brand/tokens.json"), "utf8"));
const { color: c, type: ty } = t;

const kebab = (s) => s.replace(/_/g, "-");
const lines = [
  "/* Design tokens — GENERATED from brand/tokens.json (vendored from coldstream-os).",
  "   Do not hand-edit and do not write a hex literal in a component.",
  "",
  "   That file is the brand system locked 2026-07-29, and it already drives every social",
  "   and print render in this repo. Generating from it is what keeps the website and the",
  "   rendered posts the same brand rather than two that merely look similar. If a colour",
  "   needs to change, change it there and regenerate: npm run tokens */",
  "",
  ":root{",
  "  /* colour */",
  ...Object.entries(c).filter(([k]) => k !== "neutrals").map(([k, v]) => `  --cs-${kebab(k)}: ${v};`),
  ...Object.entries(c.neutrals).map(([k, v]) => `  --cs-${k}: ${v};`),
  "",
  "  /* type */",
  `  --cs-display: "${ty.headline_family}", "Public Sans", system-ui, sans-serif;`,
  `  --cs-body: "${ty.body_family}", system-ui, -apple-system, sans-serif;`,
  `  --cs-display-weight: ${ty.headline_weight};`,
  `  --cs-display-lh: ${ty.headline_line_height};`,
  `  --cs-display-ls: ${ty.headline_letter_spacing_em}em;`,
  `  --cs-body-weight: ${ty.body_weight};`,
  `  --cs-body-lh: ${ty.body_line_height};`,
  `  --cs-eyebrow-weight: ${ty.eyebrow_weight};`,
  `  --cs-eyebrow-ls: ${ty.eyebrow_letter_spacing_em}em;`,
  "",
  "  /* scrim — the brand's locked overlay geometry: bottom gradient only, never a panel */",
  `  --cs-scrim: ${c.scrim};`,
  "  --cs-scrim-strong: rgba(14,27,42,0.85);",
  "",
  "  /* spacing + measure, from the reference page's rhythm */",
  "  --cs-wrap: 1180px;",
  "  --cs-gap: 22px;",
  "  --cs-radius: 14px;",
  "  --cs-section-y: clamp(48px, 6vw, 84px);",
  "}",
];
mkdirSync(join(here, "../src/styles"), { recursive: true });
writeFileSync(join(here, "../src/styles/tokens.css"), lines.join("\n") + "\n");

// ---- site UI layer -------------------------------------------------------------------
// Additive to the brand palette, never a replacement. A website needs interface states a
// rendered social post never does — success, error, focus, disabled, field borders — and those
// have no business in the render pipeline. Brand flows INTO this layer; nothing flows back.
//
// The same file also carries the WEB DESIGN LANGUAGE (ui-tokens.json → "web"): the type and hero
// treatment the four page templates share. That is a second system from the social one on
// purpose — see the $web_comment in ui-tokens.json — and it is emitted under its own --cs-web-
// prefix so no rule can reach for a social token when it means a web one, or the reverse.
const ui = JSON.parse(readFileSync(join(here, "../ui-tokens.json"), "utf8"));
const uiLines = [
  "/* Site UI tokens — GENERATED from site/ui-tokens.json. Do not hand-edit.",
  "",
  "   ADDITIVE TO THE BRAND PALETTE, NOT A REPLACEMENT. tokens.css above is generated from",
  "   brand/tokens.json, vendored from coldstream-os where render-post also reads it and where it is",
  "   authoritative. This file adds only what an interface needs and a composite never does:",
  "   success, error, focus, disabled, field borders.",
  "",
  "   The dependency is one-directional. If a colour belongs on a social post it goes in",
  "   tokens.json; if it only ever appears in a browser it goes here. Merging the two would put",
  "   form-validation red into the file that paints every branded asset.",
  "",
  "   --cs-web-* IS THE WEBSITE'S OWN DESIGN LANGUAGE, measured off the approved prototype at",
  "   public/preview/cincinnati-market-landing.html. Montserrat in sentence case on a mid navy",
  "   ground with a light-blue emphasis is what a browser shows; Saira Condensed caps in accent",
  "   orange is what a rendered post shows. Neither is a mistake in the other's file. */",
  "",
  ":root{",
  "  /* interface states */",
  ...Object.entries(ui.ui).map(([k, v]) => `  --cs-ui-${kebab(k)}: ${v};`),
  "",
  "  /* web design language — measured from the prototype hero, never eyeballed */",
  ...Object.entries(ui.web).map(([k, v]) => `  --cs-web-${kebab(k)}: ${v};`),
  "}",
];
writeFileSync(join(here, "../src/styles/ui-tokens.css"), uiLines.join("\n") + "\n");

console.log(`tokens.css      ${Object.keys(c).length - 1 + Object.keys(c.neutrals).length} brand colours, ${Object.keys(ty).length} type tokens`);
console.log(`ui-tokens.css   ${Object.keys(ui.ui).length} UI tokens + ${Object.keys(ui.web).length} web-language tokens (brand palette untouched)`);
