// THE MANUFACTURERS WE INSTALL. Distinct from data/badges.js, which is review profiles and
// accreditations — that row is evidence about us, this one is evidence about what goes on the house.
//
// The eight are the set named in the build order, and they match what the live site lists.
//
// ── THE LOGOS ARE REAL NOW, AND THEY CAME FROM OUR OWN SITE ──────────────────────────────────
//
// Seven of the eight are self-hosted in /public/partners/, pulled from the live WordPress media
// library — the same provenance as the badge row, and the same rule: nothing is hotlinked and
// nothing is drawn from memory. `source` records where each one came from so the next person can
// re-pull or replace it without guessing.
//
// OWENS CORNING IS A CROP, AND DELIBERATELY SO. The only OC asset that exists is the "Preferred
// Contractor" lockup, which already appears in the badge row at the top of the page. Shipping it
// twice would put the same image on one page twice and collapse the distinction between the two
// rows. The crop isolates OC's own brand mark from that lockup — the same logo, unmodified, just
// without the co-branded text — which is what this row is for.
//
// GAF IS STILL A WORDMARK, AND THAT IS THE HONEST OPTION. The only GAF asset anywhere is the
// "GAF GoldElite™ Commercial Contractor" lockup. It duplicates the badge row, and it prints a
// certification tier three artifacts still disagree about (site-plan says GoldElite, the filename
// says Commercial Roofers, the brief says Certified). A typographic wordmark asserts the brand
// without asserting the tier. Ask GAF's brand-assets page for a plain mark, drop it in
// /public/partners/, set `file`/`w`/`h` below, and it switches with no other change.
//
// `tint` colours the wordmark fallback. It is not applied to real logos — a logo row is a
// statement of fact and the marks are shown as their owners drew them.

export const PARTNERS = [
  { key: "james-hardie", name: "James Hardie", tag: "Fiber cement",
    alt: "James Hardie", tint: "#1B4E9B",
    file: "/partners/james-hardie.webp", w: 768, h: 147,
    source: "https://coldstreamexteriors.com/wp-content/uploads/2025/11/hardie-1-768x147-6917138b6fe77-1.webp" },

  { key: "gaf", name: "GAF", tag: "Roofing",
    alt: "GAF", tint: "#B8232F",
    file: null, w: null, h: null },   // see the GAF note above — wordmark until a plain mark exists

  { key: "owens-corning", name: "Owens Corning", tag: "Roofing",
    alt: "Owens Corning", tint: "#E5007D",
    file: "/partners/owens-corning-mark.png", w: 272, h: 313,
    source: "cropped from https://coldstreamexteriors.com/wp-content/uploads/2025/11/owens-corning-logo-1.webp" },

  { key: "certainteed", name: "CertainTeed", tag: "Roofing & siding",
    alt: "CertainTeed", tint: "#00539B",
    file: "/partners/certainteed.webp", w: 768, h: 218,
    source: "https://coldstreamexteriors.com/wp-content/uploads/2025/11/ct-1-768x218-691713a09b43a-1.webp" },

  { key: "provia", name: "ProVia", tag: "Windows & doors",
    alt: "ProVia", tint: "#00539F",
    file: "/partners/provia.webp", w: 768, h: 205,
    source: "https://coldstreamexteriors.com/wp-content/uploads/2025/11/logo-provia-1-768x205-6917139239f7d-1.webp" },

  { key: "royal", name: "Royal", tag: "Siding",
    alt: "Royal Building Products", tint: "#005EB8",
    file: "/partners/royal.webp", w: 350, h: 350,
    source: "https://coldstreamexteriors.com/wp-content/uploads/2025/11/logo-royal-1-69171396217e4-1.webp" },

  { key: "norandex", name: "Norandex", tag: "Siding",
    alt: "Norandex", tint: "#0B5D3B",
    file: "/partners/norandex.webp", w: 600, h: 250,
    source: "https://coldstreamexteriors.com/wp-content/uploads/2025/11/nordandex-1-6917139b4ea65-1.webp" },

  { key: "wincore", name: "WinCore", tag: "Windows",
    alt: "WinCore Windows", tint: "#00629B",
    file: "/partners/wincore.webp", w: 768, h: 209,
    source: "https://coldstreamexteriors.com/wp-content/uploads/2025/11/wincore-hi-res-1-768x209-69171309e2b18-1.webp" },
];

/** Partners still rendering as a wordmark because no logo file exists. Named by the build. */
export const PARTNER_ASSETS_PENDING = PARTNERS.filter((p) => !p.file).map((p) => p.name);
