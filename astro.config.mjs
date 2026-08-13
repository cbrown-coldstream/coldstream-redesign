import { defineConfig } from "astro/config";
import { MARKETS, REVIEWS_PENDING, servicesFor } from "./src/data/markets.js";
import { SERVICE_CONTENT } from "./src/data/services.js";
import { GLOBAL_PENDING } from "./src/data/pages/global.js";
import { CLAIMS_PENDING, REVIEWS_PAGE_PENDING } from "./src/data/claims.js";
import { INDEXABLE, NOINDEXED } from "./src/data/sitemap.js";
import {
  LOCATIONS, AWAITING_JOBS, GALLERY_PENDING, TOWNS_UNCONFIRMED, assignmentIssues, unlinkedAreas,
} from "./src/data/locations.js";

// Build-time completeness warnings.
//
// Placeholders that fail loudly beat placeholders that ship quietly. Anything unsourced —
// review figures, town-to-location assignments — is named here on every build so it cannot rot
// into a shipped assumption.
const completeness = {
  name: "coldstream:completeness",
  hooks: {
    "astro:build:done": () => {
      if (REVIEWS_PENDING.length) {
        console.warn(`\n  ⚠ review figures NOT SOURCED for: ${REVIEWS_PENDING.join(", ")}`);
        console.warn("    Hero rating chip is omitted and AggregateRating schema stays off until real");
        console.warn("    per-market numbers land in src/data/markets.js.");
      }
      for (const m of Object.values(MARKETS)) {
        const u = unlinkedAreas(m);
        if (u.length) console.warn(`  ⚠ ${m.name}: ${u.length}/${m.servedAreas.length} served areas have no location page — rendered as plain text, not links`);
      }

      // Town → area assignment is a DRAFT worked out from geography. The local GMs know which
      // side of town a job actually came from; their answer overrides anything in the data.
      if (TOWNS_UNCONFIRMED.length) {
        console.warn(`  ⚠ town → area assignments are an UNCONFIRMED DRAFT for: ${TOWNS_UNCONFIRMED.join(", ")}`);
        console.warn("    Awaiting local GM confirmation. Treat their disagreement as authoritative.");
      }
      for (const [slug, m] of Object.entries(LOCATIONS)) {
        if (!Object.keys(m.areas).length)
          console.warn(`    · ${slug}: NO AREAS DEFINED — all ${MARKETS[slug].servedAreas.length} towns render as plain text`);
        if (m.review) console.warn(`    · ${slug}: ${m.review}`);
        for (const [town, why] of Object.entries(m.unassigned))
          console.warn(`    · ${slug}: "${town}" UNASSIGNED — ${why}`);
      }
      // A town that is served but neither assigned nor explicitly flagged is how a town silently
      // vanishes from the plan. This should always be empty.
      const bad = assignmentIssues(MARKETS);
      if (bad.length) {
        console.warn(`  ⚠ ${bad.length} TOWN ASSIGNMENT ERRORS — these are bugs, not pending data:`);
        for (const b of bad) console.warn(`    · ${b}`);
      }
      // BUILD ORDER ROUND 6: the gate is lifted and every page ships. Service hubs carry copy
      // written per market rather than a noindex and a wait — see LOCAL_INTRO in services.js.
      // What is still worth naming is which of them are running on WRITTEN copy rather than copy
      // sourced from real completed jobs, because that is the upgrade the pulls deliver.
      const written = [];
      for (const [slug, m] of Object.entries(MARKETS))
        for (const s of servicesFor(m))
          if (!SERVICE_CONTENT[s.key]?.local?.[slug]) written.push(`${slug}/${s.key}`);
      if (written.length) {
        console.warn(`  ⚠ ${written.length} service hubs run on WRITTEN local copy, not sourced job records:`);
        console.warn(`    ${written.join(", ")}`);
        console.warn("    Indexable and complete. Contractors Cloud records upgrade them in place.");
      }
      // A location page is only worth having if real completed work sits behind it, so these do
      // not build at all — no thin page, no noindex page, no page. The count of location pages
      // follows the job data, not the other way round.
      if (AWAITING_JOBS.length) {
        console.warn(`  ⚠ ${AWAITING_JOBS.length} location pages are BUILT but have no job photos yet:`);
        console.warn(`    ${AWAITING_JOBS.join(", ")}`);
        console.warn("    They render an honest empty state. Pull completed jobs by municipality");
        console.warn("    from Contractors Cloud and the recent-work section fills in.");
      }
      // The other two page-system nodes, held to the same "real proof or no page" bar. Neither
      // builds an empty shell — the templates are finished and the pages appear the moment the
      // two pulls land, along with their footer links.
      if (GALLERY_PENDING.length) {
        console.warn(`  ⚠ ${GALLERY_PENDING.length} market galleries are BUILT but empty — noindex until photos land:`);
        console.warn(`    ${GALLERY_PENDING.map((s) => `${s}/gallery`).join(", ")}`);
        console.warn("    Same Contractors Cloud pull as the location pages.");
      }
      if (REVIEWS_PAGE_PENDING.length) {
        console.warn(`  ⚠ ${REVIEWS_PAGE_PENDING.length} market reviews pages are BUILT but empty — noindex until the GBP pull:`);
        console.warn(`    ${REVIEWS_PAGE_PENDING.map((s) => `${s}/reviews`).join(", ")}`);
        console.warn("    Real, attributable, linkable reviews into TESTIMONIALS in src/data/claims.js.");
        console.warn("    NOTHING is invented in the meantime — the pages say so in plain words.");
      }
      if (GLOBAL_PENDING.length) {
        console.warn(`  ⚠ ${GLOBAL_PENDING.length} global pages are missing sourced content — built with noindex:`);
        for (const g of GLOBAL_PENDING) console.warn(`    · ${g.path} — ${g.needs}`);
      }
      // Every factual assertion the prototype made that nobody has sourced. Each one is omitted
      // from the site until it is filled in, and filling it in publishes it everywhere at once.
      if (CLAIMS_PENDING.length) {
        console.warn(`  ⚠ ${CLAIMS_PENDING.length} UNSOURCED CLAIMS are gated off the site entirely:`);
        for (const [k, needs] of CLAIMS_PENDING) console.warn(`    · ${k} — ${needs}`);
      }
      const ix = INDEXABLE(), nx = NOINDEXED();
      console.warn(`\n  → ${ix.length} pages indexable, ${nx.length} noindex. sitemap.xml lists the ${ix.length}:`);
      for (const u of ix) console.warn(`    ✓ ${u.path}`);
      console.warn("");
    },
  },
};

// STATIC OUTPUT, non-negotiable.
//
// site-plan/index.html: "Static HTML, not React — content inside a React wrapper often is not
// read properly by crawlers. Everything that needs to rank ships as plain HTML with a real
// heading structure." Astro satisfies that by compiling to HTML with no client runtime; the
// only JS that ships is what a component explicitly opts into.
//
// Host-agnostic by design. The plan has Rambo serving finished HTML, so nothing here may depend
// on an edge runtime. The market router is a visible chooser plus a first-visit client-side geo
// lookup — see src/components/MarketRouter.astro. If we later host on Netlify ourselves this
// upgrades to true edge personalisation with Vary: Cookie WITHOUT changing the information
// architecture, which is why the hosting question isn't blocking the build.
export default defineConfig({
  site: "https://coldstreamexteriors.com",
  output: "static",
  build: { format: "directory" },   // /cincinnati/index.html — trailing-slash URLs, matching live
  integrations: [completeness],
  devToolbar: { enabled: false },
});
