// TEMPLATE 4 DATA — location pages.
//
// RULING (round 3) — THIS FILE CHANGED SHAPE. Read this before editing it.
//
// 1. THERE IS NO SECOND ADDRESS PER MARKET. Coldstream has exactly three physical addresses,
//    one per market, and they live in markets.js. A location page therefore NEVER carries an
//    address of its own and NEVER emits a LocalBusiness. Fabricated NAP conflicts with the real
//    GBP listing, and inconsistent NAP across a domain is a well-understood ranking and trust
//    problem. Not worth six pages. There is no `address` field below any more — the field was
//    removed rather than left null, so it cannot be filled in by mistake.
//
// 2. LOCATION PAGES SURVIVE ON JOB PROOF, NOT ADDRESSES. The reason these pages beat a
//    competitor's is that they carry real completed work from that sub-area, pulled from
//    Contractors Cloud. "Anyone can rewrite copy. Nobody else has our job photos from Amelia."
//    So `jobs` is the gate: A LOCATION WITH NO REAL JOBS IS NOT A PAGE. It does not build,
//    it does not redirect, it stays a heading in the served-areas list on the market page.
//    Same bar the service pages are held to.
//
//    THE PAGE COUNT FOLLOWS THE JOB DATA, NOT THE OTHER WAY ROUND. Every `jobs` array below is
//    empty, so the location template currently generates ZERO pages. That is the correct state,
//    not a gap in the build — the template is finished and waiting on the Contractors Cloud pull.
//
// 3. TOWN ASSIGNMENTS BELOW ARE A DRAFT FOR THE LOCAL GMs. They know which side of town a job
//    actually came from; this is worked out from geography. `townsConfirmed: false` says so, the
//    build prints it on every run, and a GM disagreement is authoritative over anything here.

/**
 * A completed job from Contractors Cloud. THE SHAPE NOW LIVES IN ./contracts.js, with a validator
 * and worked fixtures — this file only stores the records and routes them to areas.
 *
 * `detail` is the part that cannot be faked and cannot be templated: what the crew actually did
 * on that house. A job with a photo and no detail is stock photography with a caption. The
 * contract enforces that, along with the consent field without which nothing is published.
 */

import { SURFACES } from "./contracts.js";

export const LOCATIONS = {
  cincinnati: {
    // Market-level job pool — jobs pulled for this market that are not filed under an area.
    //
    // Two jobs, one array. It is where a Columbus job lands while Columbus HAS no areas (its
    // areas are to be DERIVED from these clusters, per the note on that market below), and it is
    // what the market gallery draws on together with the area jobs — so a gallery does not
    // require an area split to exist first. Same gate as everything else: empty means no page.
    jobs: [],
    // The core metro splits east/west cleanly. Butler County and Northern Kentucky do not —
    // see `review` below. Two buckets is the current shape, not a settled one.
    townsConfirmed: false,
    review:
      "Fairfield, Hamilton, Ross and West Chester are Butler County — genuinely NORTH, filed " +
      "west because there are only two buckets. Cold Spring is Northern Kentucky, across the " +
      "river, and fits neither half. If Butler County and NKY both matter commercially this " +
      "should be three or four areas, not two. GM call.",
    unassigned: {
      "Cold Spring": "Northern Kentucky — across the river, south. Fits neither east nor west.",
    },
    areas: {
      east: {
        name: "Cincinnati East",
        blurb: "The east side and Clermont County — Milford, Loveland, Batavia, Amelia and the river towns.",
        towns: [
          "Amberley Village", "Amelia", "Batavia", "Bethel", "Blue Ash", "Goshen", "Indian Hill",
          "Kenwood", "Landen", "Loveland", "Madeira", "Maineville", "Mason", "Milford",
          "Montgomery", "Pleasant Ridge", "Silverton",
        ],
        jobs: [],
      },
      west: {
        name: "Cincinnati West",
        blurb: "The west side and Butler County — Colerain, Cleves, Ross, Fairfield and Hamilton.",
        towns: ["Cleves", "Colerain", "Fairfield", "Hamilton", "Ross", "West Chester"],
        jobs: [],
      },
    },
  },

  // COLUMBUS HAS NO AREAS, DELIBERATELY.
  //
  // It is a ring city around I-270 with served towns at every compass point. Any two-way cut
  // puts Westerville and Grove City in the same bucket, which no local would recognise — so the
  // north/south split that was here has been removed rather than kept as a placeholder. Columbus
  // gets its location pages defined by WHERE THE REAL JOBS ARE, per the ruling above. Until the
  // job pull lands, all 26 towns render as plain text on the market page, which is correct.
  columbus: {
    jobs: [],               // see the note on cincinnati.jobs — this is where the clusters land
    // ONE METRO PAGE, at /columbus/locations/. Columbus is a ring city around I-270 with served
    // towns at every compass point, and any two-way cut puts Westerville and Grove City in the
    // same bucket. The Page System asks for a single locations page here rather than a split, and
    // that matches the geography — so this market has no `areas` and one metro page covering all
    // 26 towns.
    metro: {
      name: "Central Ohio",
      blurb: "The whole ring around I-270 and out — Dublin, Hilliard, Westerville, Gahanna, New Albany, Upper Arlington, Grove City and the rest of Central Ohio.",
    },
    townsConfirmed: false,
    review:
      "No geometric split. Columbus areas are to be defined by job-data clusters from " +
      "Contractors Cloud, not by a boundary the market does not have.",
    unassigned: {},
    areas: {},
  },

  "st-louis": {
    jobs: [],
    // RENAMED. The served-area list is overwhelmingly South County plus West County — exactly
    // one town is north. The halves were "north/south", which was simply wrong; they are now
    // "south" and "west". Any old /st-louis/locations/north/ URL is a 301 to the market page.
    townsConfirmed: false,
    review:
      "Slugs are north/south to match the Page System; the towns are really South County and " +
      "West County. Berkeley is the only true North County entry and is filed under the north " +
      "slug. GM confirmation still outstanding on the split itself.",
    unassigned: {},
    // SLUGS ARE north/south TO MATCH THE PAGE SYSTEM. The geography is not: the served-area list
    // is overwhelmingly South County plus West County, and exactly one town is genuinely north.
    // Build order round 6 is explicit — keep the plan's slugs, describe the real geography
    // honestly — so the URL says north and the page says West County and North County, which is
    // what those towns actually are. Berkeley is assigned here rather than left flagged: it is the
    // one North County town and this is the page whose slug is north.
    areas: {
      south: {
        name: "South County and South City",
        blurb: "South County and the southern city — Kirkwood, Webster Groves, Sunset Hills, Oakville, Mehlville, Affton and down through Fenton to Arnold.",
        towns: [
          "Affton", "Arnold", "Concord", "Crestwood", "Fenton", "Green Park", "House Springs",
          "Kirkwood", "Lemay", "Mehlville", "Murphy", "Oakville", "Sunset Hills", "The Hill",
          "Tower Grove", "Valley Park", "Webster Groves",
        ],
        jobs: [],
      },
      north: {
        name: "West County and North County",
        blurb: "West County and the inner ring — Chesterfield, Town and Country, Creve Coeur, Clayton, Des Peres and Maryland Heights — plus Berkeley in North County.",
        towns: [
          "Berkeley", "Chesterfield", "Clayton", "Creve Coeur", "Des Peres", "Ellisville",
          "Maplewood", "Maryland Heights", "Richmond Heights", "Town and Country",
        ],
        jobs: [],
      },
    },
  },
};

// ── FIXTURE INJECTION ────────────────────────────────────────────────────────────────────────
//
// COLDSTREAM_FIXTURES=1 merges the synthetic jobs in ./fixtures/jobs.sample.js into the arrays
// above, so the location and gallery gates can be exercised before the Contractors Cloud pull
// exists. It is off in every normal build, it announces itself loudly when it is on, and
// scripts/verify-build.mjs fails if a fixture string is ever found in built HTML.
//
// A job is filed to the area whose towns list contains it, and to the market pool otherwise —
// which is the same routing the real pull will need, so this is the ingestion step in miniature.
export const FIXTURES_ON = process.env.COLDSTREAM_FIXTURES === "1";

if (FIXTURES_ON) {
  const { SAMPLE_JOBS } = await import("./fixtures/jobs.sample.js");
  console.warn("\n  ⚠⚠  FIXTURES ON — synthetic job records are being built into this site.");
  console.warn("      COLDSTREAM_FIXTURES=1. This output must never be deployed.\n");
  for (const job of SAMPLE_JOBS) {
    const m = LOCATIONS[job.market];
    if (!m) continue;
    const area = Object.values(m.areas).find((a) => a.towns.includes(job.town));
    (area ? area.jobs : m.jobs).push(job);
  }
}

/**
 * The jobs in a list that may actually be shown. THE GATE IS THE CONTRACT, NOT THE ARRAY LENGTH.
 *
 * A job that is on file is not automatically a job that can be published: SURFACES.gallery in
 * contracts.js requires an explicit `publishable: true`, consent, a photo with real dimensions
 * and written alt text, and a detail line somebody wrote. Counting raw array entries would
 * publish a record whose consent box was never ticked, which is the one mistake in this whole
 * pipeline that cannot be taken back.
 */
export const showableJobs = (jobs) => (jobs ?? []).filter((j) => SURFACES.gallery.test(j));

/**
 * THE JOB GATE IS LIFTED (build order, round 6).
 *
 * It used to be that an area with no job photos was not a page. That was the right reading of the
 * round-3 ruling and the wrong instruction: the deliverable is a complete static site handed to
 * Rambo, and a page that does not exist cannot be handed over. So every defined area builds, and
 * a page with no job proof renders an honest empty state and warns at build time.
 *
 * `showableJobs` still governs WHAT RENDERS on the page. Lifting the gate on page existence does
 * not lift the consent rule: a job with no explicit `publishable: true` still appears nowhere.
 */
export const isPublished = () => true;

/** Areas with real, publishable work behind them — used for the build report, not for routing. */
export const hasJobProof = (area) => showableJobs(area?.jobs).length > 0;

/** [{ market, key, area }] for every location page. Every defined area is a page. */
export const publishedLocations = () =>
  Object.entries(LOCATIONS).flatMap(([market, m]) =>
    Object.entries(m.areas ?? {}).map(([key, area]) => ({ market, key, area })));

/** Markets carrying a single metro locations page instead of an area split. */
export const metroLocations = () =>
  Object.entries(LOCATIONS).filter(([, m]) => m.metro).map(([market, m]) => ({ market, metro: m.metro }));

/**
 * Every job on file for a market — the area-filed ones plus the market-level pool.
 *
 * This is the gallery's source. It deliberately does NOT depend on the area split, so Columbus
 * can have a gallery before it has areas, and so a job that has not been assigned to a sub-area
 * yet still shows up as proof somewhere rather than being invisible until someone files it.
 */
export const marketJobs = (slug) => {
  const m = LOCATIONS[slug];
  if (!m) return [];
  return showableJobs([...(m.jobs ?? []), ...Object.values(m.areas ?? {}).flatMap((a) => a.jobs ?? [])]);
};

/** Every job on file for a market, publishable or not. For reporting, never for rendering. */
export const allMarketJobs = (slug) => {
  const m = LOCATIONS[slug];
  if (!m) return [];
  return [...(m.jobs ?? []), ...Object.values(m.areas ?? {}).flatMap((a) => a.jobs ?? [])];
};

/** Jobs on file that CANNOT be shown, with the reason. Reported so a bad record is visible. */
export const withheldJobs = (slug) =>
  allMarketJobs(slug)
    .filter((j) => !SURFACES.gallery.test(j))
    .map((j) => ({
      id: j.jobId ?? `${j.town}/${j.service}`,
      why: j.publishable !== true ? "not marked publishable" : "incomplete photo set or missing detail line",
    }));

/**
 * EVERY market gets a gallery page. Gate lifted with the rest — a market with no photos yet
 * renders an honest empty state rather than 404ing on a URL the Page System lists.
 */
export const marketsWithGallery = () => Object.keys(LOCATIONS);

/** Markets that actually have photos to show. Drives the empty state and the build warning. */
export const marketsWithPhotos = () => Object.keys(LOCATIONS).filter((s) => marketJobs(s).length);

/** Markets whose gallery is built but empty — reported by the build on every run. */
export const GALLERY_PENDING = Object.keys(LOCATIONS).filter((s) => !marketJobs(s).length);

/** Areas that build but have no job proof behind them yet. Reported on every run. */
export const AWAITING_JOBS = Object.entries(LOCATIONS).flatMap(([market, m]) =>
  Object.entries(m.areas).filter(([, a]) => !isPublished(a)).map(([key]) => `${market}/${key}`));

/**
 * The location page a town links to, or null.
 *
 * Null in three separate cases, all of which must render as plain text: the town is unassigned,
 * its market has no areas yet, or its area has no job proof so has no page. A link to a page
 * that does not exist is worse than no link, for a crawler and for a person.
 */
export const areaForTown = (marketSlug, town) => {
  const m = LOCATIONS[marketSlug];
  if (!m) return null;
  for (const [key, area] of Object.entries(m.areas ?? {})) {
    if (area.towns.includes(town)) return key;
  }
  // A metro market has one page covering every served town rather than an area per compass point.
  return m.metro ? "" : null;
};

/** Towns rendering as plain text in a market — no page to point at, for whatever reason. */
export const unlinkedAreas = (market) =>
  (market.servedAreas ?? []).filter((t) => !areaForTown(market.slug, t));

/** Markets whose town→area assignment is still an unconfirmed draft. */
export const TOWNS_UNCONFIRMED = Object.entries(LOCATIONS)
  .filter(([, m]) => !m.townsConfirmed).map(([slug]) => slug);

/**
 * Integrity check on the draft itself, run at build.
 *
 * Catches the two ways a hand-written assignment rots: a town assigned to an area that is not in
 * the market's served list (a typo, or a town quietly dropped from markets.js), and a served
 * town that is neither assigned to an area nor explicitly flagged as unassigned. The second is
 * the important one — it is how a town silently disappears from the plan.
 */
export const assignmentIssues = (markets) => {
  const out = [];
  for (const [slug, m] of Object.entries(LOCATIONS)) {
    const served = new Set(markets[slug]?.servedAreas ?? []);
    const assigned = new Set();
    // A market with no areas at all is a decision, not a gap — Columbus has no geometric split
    // and is waiting on job clusters to define one. Every town there is correctly unassigned, so
    // the per-town check below would report 26 non-errors.
    if (Object.keys(m.areas).length === 0) continue;
    for (const [key, area] of Object.entries(m.areas)) {
      for (const t of area.towns) {
        if (!served.has(t)) out.push(`${slug}/${key}: "${t}" is not in that market's servedAreas`);
        if (assigned.has(t)) out.push(`${slug}: "${t}" is assigned to two areas`);
        assigned.add(t);
      }
    }
    for (const t of served) {
      if (!assigned.has(t) && !(t in m.unassigned)) {
        out.push(`${slug}: "${t}" is served but neither assigned to an area nor flagged unassigned`);
      }
    }
  }
  return out;
};
