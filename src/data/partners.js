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

  // ⚠ GAF'S MARK IS A THIRD-PARTY REDRAW, NOT GAF'S OWN FILE. Read this before trusting it.
  //
  // GAF publishes no reachable asset: gaf.com returns 403 to everything — curl, a real headless
  // browser and a fetch tool alike — and the ONLY GAF artwork on Coldstream's own WordPress is the
  // "GoldElite™ Commercial Contractor" lockup, which asserts a certification tier and duplicates
  // the badge row on the same page. Cropping it the way Owens Corning was cropped does not help:
  // OC's lockup contains OC's actual brand mark, whereas GAF's contains the GOLDELITE device, so a
  // crop would still be a tier claim rather than a brand mark.
  //
  // So this is commons.wikimedia.org's File:GAF_logo.svg — visually the correct red GAF square,
  // but drawn by a contributor ("HapHaxion", own work) and licensed CC BY-SA 4.0. TWO CONSEQUENCES
  // worth someone's attention: it is not authoritative artwork, and CC BY-SA nominally wants
  // attribution and share-alike, which a commercial marketing page does not give it.
  //
  // REPLACE IT with the file from GAF's contractor portal when someone with a login can pull it.
  // Drop it in /public/partners/, update `file`/`w`/`h` here, and nothing else changes.
  { key: "gaf", name: "GAF", tag: "Roofing",
    alt: "GAF", tint: "#B8232F",
    file: "/partners/gaf.svg", w: 503, h: 503,
    source: "https://commons.wikimedia.org/wiki/File:GAF_logo.svg — CC BY-SA 4.0, contributor redraw, NOT GAF's own asset. See the note above." },

  { key: "owens-corning", name: "Owens Corning", tag: "Roofing",
    alt: "Owens Corning", tint: "#E5007D",
    file: "/partners/owens-corning-mark.png", w: 272, h: 313,
    source: "cropped from https://coldstreamexteriors.com/wp-content/uploads/2025/11/owens-corning-logo-1.webp — restored from git 2026-08-19" },

  { key: "certainteed", name: "CertainTeed", tag: "Roofing & siding",
    alt: "CertainTeed", tint: "#00539B",
    file: "/partners/certainteed.webp", w: 768, h: 218,
    source: "https://coldstreamexteriors.com/wp-content/uploads/2025/11/ct-1-768x218-691713a09b43a-1.webp" },

  { key: "provia", name: "ProVia", tag: "Windows & doors",
    alt: "ProVia", tint: "#00539F",
    file: "/partners/provia.webp", w: 768, h: 205,
    source: "https://coldstreamexteriors.com/wp-content/uploads/2025/11/logo-provia-1-768x205-6917139239f7d-1.webp" },

  { key: "royal", name: "Royal Building Products", tag: "Siding",
    alt: "Royal Building Products", tint: "#005EB8",
    file: "/partners/royal.webp", w: 350, h: 350,
    source: "https://coldstreamexteriors.com/wp-content/uploads/2025/11/logo-royal-1-69171396217e4-1.webp" },

  // MALARKEY IS ST. LOUIS'S ROOFING LINE and appears in no other market's set. badges.js has
  // carried it as "St. Louis-only, unconfirmed and therefore absent" since the 08-18 call; it was
  // named for that market's strip on 2026-08-19, which is the confirmation that was missing.
  //
  // This one IS the manufacturer's own artwork — Malarkey's site serves it directly, unlike GAF.
  // `marketOnly` KEEPS IT OUT OF THE NATIONAL SET. Without it, appending this entry to PARTNERS
  // put Malarkey on the national strip too — a line one office runs, shown as though the company
  // ran it everywhere. A market names it explicitly in its own `partners` array; the national
  // default skips anything flagged here.
  { key: "malarkey", name: "Malarkey Roofing Products", tag: "Roofing", marketOnly: true,
    alt: "Malarkey Roofing Products", tint: "#00A651",
    file: "/partners/malarkey.svg", w: 209, h: 44,
    source: "https://www.malarkeyroofing.com/app/themes/malarkey-roofing/src/images/logo-horizontal-full-color.svg — the manufacturer's own horizontal full-colour mark" },

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
