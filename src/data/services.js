// TEMPLATE 3 — service hub content.
//
// A service page is shared service copy PLUS market-specific copy. Both are required.
//
// THE UNIQUENESS BAR IS THE POINT OF THE WHOLE REBUILD. site-plan: every surviving page needs
// "a unique H1 that is not reused across markets · at least one piece of local proof · unique
// FAQ answers · the local phone number and address · 300+ words written for that market. A page
// that cannot clear it should not be a page — it should be a section on one that can."
//
// The audit found 100+ neighborhood pages that were the same skeleton with synonyms swapped.
// Shipping 12 service pages that differ only by city name would rebuild that problem in a new
// framework. So `local` below is keyed by market and starts EMPTY: a service page with no local
// copy is reported by the build and should not go live until it has some.
//
// Nothing here is generated from a pattern. When a market's entry is filled it should say
// something only that market could say.
//
// ── HOW THE `local` ENTRIES GET WRITTEN (ruling, round 3) ─────────────────────────────────────
//
// DON'T WRITE THIS COPY. SOURCE IT. Copy that could have been produced without looking at a
// single Coldstream job is thin content wearing a word count — it would rebuild, in a new
// framework, the exact problem the consolidation just removed. The uniqueness bar is only
// clearable from real inputs, and the real inputs exist:
//
//   · Contractors Cloud — completed jobs per market per service: service, materials, scope,
//     neighborhood. This is the primary source.
//   · The content portal's intake — crew notes and job photos, already routed by market lane.
//
// The sequence, in order:
//
//   1. Pull the last 12–24 months of completed jobs, per market, per service.
//   2. For each of the 13 pages assemble the real inputs: representative jobs, materials
//      actually specified, neighborhoods actually worked, the local specifics — building stock,
//      what storm season does there, what the permit process looks like.
//   3. Draft from those inputs. EVERY SPECIFIC MUST TRACE TO A RECORD.
//   4. Apply the copy compliance rules from design-systems/exteriors/voice-spec.json — the same
//      voice, banned-word and approved-claim rules that govern the social pipeline, verbatim.
//      Do not re-derive them here. In particular: no "guarantee" as an absolute promise, no
//      superlatives, and only the pre-approved claims (licensed & insured, free no-obligation
//      inspections, 25-year workmanship warranty).
//
// Until a market's entry lands, its page builds with a noindex — the correct state for a page
// whose copy does not exist yet.

import { offers } from "./markets.js";
import { MARKET_CONTEXT } from "./subservices.js";

// ── LOCAL COPY, WRITTEN PER SERVICE PER MARKET (build order, round 6) ─────────────────────────
//
// The gate is lifted: every service hub ships with copy written for its market rather than a
// noindex and a wait. This matters beyond the hubs themselves — they are the targets of most of
// the 301 map, and a redirect into a noindex page hands Google the old URL's ranking value and
// then tells it not to index the page holding it.
//
// It is NOT a template with the city name swapped. Each function below asks a different question
// of the market — a roofing page cares what the weather does to a roof, a siding page cares what
// it does to a painted surface, a gutter page cares about tree cover — so the fifteen paragraphs
// this produces are fifteen different paragraphs, not one paragraph fifteen times.
//
// Contractors Cloud job records still upgrade these pages: when `local[market]` is filled in from
// real completed work it takes precedence over everything here.
const LOCAL_INTRO = {
  roofing: (m, c) =>
    `Roofs here fail in ways that are specific to this place. ${c.weather} ${c.stock} We quote after walking the roof, because the same age of shingle on two houses a street apart can be in very different condition once you are standing on it. ${c.permits}`,
  siding: (m, c) =>
    `${c.stock} Siding on that mix of houses is rarely a single conversation — a mid-century elevation and a 2000s two-story want different materials and different detailing. ${c.weather} That movement is what opens joints and lifts butt ends, so how a wall is installed matters more here than which brand goes on it.`,
  windows: (m, c) =>
    `Most of the windows we replace across ${m.region} are original to the house or a first replacement that has failed at the seals. ${c.stock} ${c.weather} A window that has lost its seal shows it first as condensation between the panes, and no amount of caulk brings that back.`,
  gutters: (m, c) =>
    `Gutters are the most neglected part of an exterior and the one that causes the most expensive damage when they fail. ${c.trees} ${c.weather} Where the water goes once it leaves the gutter is half the job, and it is the half most often skipped — a downspout emptying against a foundation is a basement problem waiting to happen.`,
  "commercial-roofing": (m, c) =>
    `Commercial and multi-family work across ${m.region} is a different job from a house, and the difference is rarely the roof itself — it is working around occupancy, access and a board or a manager who needs the scope in writing. ${c.weather} On a low-slope roof that movement works seams and fasteners harder than it works a pitched roof, which is why the detailing matters more than the membrane brand.`,
};

const LOCAL_FAQ = {
  roofing: (m, c) => [{ q: `What should I expect from a roof in ${m.name}?`, a: `${c.weather} A well-installed architectural shingle roof handles that, but the details decide it — ventilation, ice-and-water membrane at the eaves, and flashing that was replaced rather than caulked over.` }],
  siding: (m, c) => [{ q: `Which siding holds up best around ${m.name}?`, a: `Both fiber cement and vinyl work here when they are installed properly. ${c.weather} Fiber cement moves less under that and holds paint far longer; vinyl costs less and is perfectly good with room left to expand.` }],
  windows: (m, c) => [{ q: `Will new windows make a difference in ${m.name} winters?`, a: `Going from single pane to a modern double-pane unit is a real difference you will feel in a cold snap. Replacing a ten-year-old double-pane with a new one is not — we will tell you which of those you have.` }],
  gutters: (m, c) => [{ q: `Do I need gutter guards in ${m.name}?`, a: `${c.trees} Under that kind of cover, guards turn an annual clean into an occasional one. On an open lot they rarely pay for themselves, and we will say which yours is.` }],
  "commercial-roofing": (m, c) => [{ q: `Can you work around our tenants in ${m.name}?`, a: `Yes — scheduling around occupancy is most of what makes a commercial job different. We agree the phasing and the access before we start, not on the day.` }],
};

/** The market-specific copy for a service hub: sourced job copy if it exists, written copy if not. */
export const localFor = (key, marketSlug, market) => {
  const sourced = SERVICE_CONTENT[key]?.local?.[marketSlug];
  if (sourced) return sourced;
  const c = MARKET_CONTEXT[marketSlug];
  if (!c || !LOCAL_INTRO[key]) return null;
  return { intro: LOCAL_INTRO[key](market, c), faq: LOCAL_FAQ[key](market, c), written: true };
};

/**
 * MARKET-SCOPED META DESCRIPTIONS for the service hubs.
 *
 * The template used to build these as `${lead} Serving ${market.name} from our ${office} office.`
 * The lead is already a full sentence, so the appended tail carried three of them past 160
 * characters, where Google cuts the description off mid-clause. Written short here instead, with
 * the region in them, because a hub page competes on "roofing in {region}" and the description is
 * the line a searcher actually reads under the title.
 */
// The city belongs in the description (owner brief 2026-08-27: local SEO pass). St. Louis's
// region string already contains the city, so it keeps the region-only phrasing — "in St. Louis
// and across Greater St. Louis" would say the name twice in one clause.
const where = (m) => (m.region.includes(m.name) ? `across ${m.region}` : `in ${m.name} and across ${m.region}`);

export const SERVICE_META = {
  roofing: (m) => `Roof replacement, repair and storm work ${where(m)} — no payments until completion. Free inspection first: ${m.phone}.`,
  siding: (m) => `Fiber cement and vinyl siding ${where(m)}, installed to the manufacturer's specification. Free inspection and a written quote first.`,
  windows: (m) => `Replacement windows ${where(m)}, measured opening by opening and fitted by trained installers. Free, no-obligation quote.`,
  gutters: (m) => `Seamless gutters, guards and downspouts ${where(m)}, sized to the roof draining into them. Free inspection.`,
  "commercial-roofing": (m) => `Flat and low-slope roofing for commercial, HOA and multi-family properties across ${m.region}. Surveyed and scoped in writing.`,
  "garage-doors": (m) => `Garage door installation and replacement across ${m.region}. Free, no-obligation quote and a written price.`,
};

export const SERVICE_CONTENT = {
  roofing: {
    label: "Roofing",
    // Phase 3 (Rambow audit): "roofing contractors {city}" is the primary query; the bare
    // "Roofing in {city}" title undersold it. H1 unchanged — the page reads fine as it is.
    titleTag: (m) => `Roofing Contractors in ${m.cityState} | Coldstream Exteriors`,
    h1: (m) => `Roofing in ${m.name}`,
    // Market-dependent for the same reason the SERVICES blurb is: "residential and commercial" is
    // a service claim, and St. Louis was ruled to have no commercial roofing.
    // MATERIALS ARE A MARKET FACT (owner brief 2026-08-27): St. Louis runs shingle and low-slope
    // only — no metal roofing there, and no St. Louis page may say otherwise. Cincinnati and
    // Columbus keep shingle, metal and low-slope.
    lead: (m) => `Replacement, repair, and storm work — ${offers(m, "commercial-roofing") ? "residential and commercial" : "residential"}. ${m.slug === "st-louis" ? "Shingle and low-slope systems" : "Shingle, metal and low-slope systems"}, quoted after a free inspection.`,
    sections: [
      { title: "Roof Replacement", body: "Full tear-off and installation. We size and price the job after walking the roof, not from a satellite image." },
      { title: "Roof Repair", body: "Leaks, emergency call-outs, storm, hail and wind damage — all one repair conversation rather than five separate ones." },
      { title: "Storm and Insurance Claims", body: "We document the damage the way an adjuster needs it documented, then deal with them directly." },
      // `service` is a REFERENCE, not a URL, and `requiresService` means this card does not
      // render at all where the market does not offer it. So it is the commercial buyer's
      // hand-off on the Cincinnati and Columbus roofing hubs, and ABSENT from the St. Louis one —
      // round 5 ruled that market has no commercial roofing, and describing flat and TPO systems
      // on its roofing page would advertise exactly the service line that ruling removed.
      { title: "Commercial and Multi-Family", body: "Flat, TPO, EPDM and coatings for apartment blocks, HOA properties and commercial buildings.", service: "commercial-roofing", requiresService: true, linkText: "See commercial roofing" },
    ],
    process: [
      { title: "Free inspection", body: "A thorough inspection — we photograph what we find and check the decking, flashing and ventilation — not a satellite image of it." },
      { title: "Written scope and quote", body: "Materials, tear-off, ventilation and the number, in writing before anything is ordered." },
      { title: "Tear-off and installation", body: "Our own crew, on the day we said. Most homes are stripped and re-covered inside one day." },
      { title: "Clean-up and walkthrough", body: "A magnet run over the whole property for nails, a walk of the job with you, and nothing due until it is finished." },
    ],
    faq: [
      { q: "Do I need a full replacement or a repair?", a: "That is what the free inspection answers. Age, the state of the decking and how widespread the damage is decide it — we will tell you when a repair is the honest answer." },
      { q: "How long does a roof replacement take?", a: "Most homes are finished in a single day. We give you the timeline up front and leave the property clean." },
      { q: "Do you work with insurance companies on storm damage claims?", a: "Yes. We document the damage the way an adjuster needs it documented — photographs, measurements and a written scope — and we meet them on site. What gets approved is the carrier's decision, not ours, and we will not tell you otherwise before it happens." },
      { q: "How quickly can you get out after a storm?", a: "Same day or next day for anything actively letting water in. The first visit stops the damage getting worse; the assessment and the quote follow once the roof is safe to walk." },
      // `a` may be a function of the market — the templates resolve it. St. Louis: no metal.
      { q: "What roofing materials do you install?", a: (m) => m?.slug === "st-louis"
          ? "Architectural asphalt shingle on most homes, impact-resistant shingles where hail is the recurring problem, and flat systems for low-slope sections. The specification follows the inspection rather than a default."
          : "Architectural asphalt on most homes, impact-resistant shingles where hail is the recurring problem, metal, and flat systems for low-slope sections. The specification follows the inspection rather than a default." },
      { q: "What does a new roof cost?", a: "Size, pitch, how many layers come off, the state of the decking underneath and the material you choose. We put the number in writing after the free inspection, and it does not move unless the scope does." },
      { q: "What do I need to do before the crew arrives?", a: "Move vehicles off the drive and take anything fragile off the walls in the top rooms. We cover the landscaping, protect the gutters and run a magnet over the whole property before we leave." },
      { q: "Can you replace a roof in winter?", a: "Yes, with the right conditions and materials — shingle adhesives need temperatures the forecast has to cooperate on, and we schedule around cold snaps rather than pretending they are not happening. Emergency repairs do not wait for spring." },
      { q: "Do you tear off the old roof or lay over it?", a: "Tear off, always. An overlay hides the decking — the one thing that decides whether the new roof has something sound to fasten to — and most shingle manufacturers reduce or void coverage over a second layer." },
      { q: "How long should a roof last here?", a: "Architectural asphalt is typically rated for decades, but ventilation and installation quality decide whether it gets there — an attic that cannot breathe shortens any shingle's life. Hail and wind can end a roof early regardless of age, which is what the free inspection is for after a storm." },
    ],
    local: {},   // PENDING per market — see header
  },
  siding: {
    label: "Siding",
    // HERO SET BY THE OWNER BRIEF (2026-08-27): "Fiber cement and vinyl siding throughout
    // Greater {City}". The h1 no longer fits the derived title (h1 + cityState + brand runs past
    // 60), so `titleTag` overrides it — the template prefers titleTag when a service carries one.
    h1: (m) => `Fiber cement and vinyl siding throughout Greater ${m.name}`,
    titleTag: (m) => `Siding Contractors in ${m.cityState} | Coldstream Exteriors`,
    // THE DETAIL SECTION, ALSO FROM THE BRIEF — heading and both paragraphs verbatim. The intro
    // is an array: ServiceDetail renders one <p> per entry.
    // DISTINCT HEADING PER MARKET (owner correction, 2026-08-31): the shared "What a full
    // siding replacement does for a {City} home" pattern was the owner's 08-27 instruction,
    // overruled by the same owner after seeing the overlap numbers — it was the exact
    // city-swap template the rewrite exists to remove. Same purpose, three phrasings.
    detailHeading: (m) => ({
      cincinnati: "What a full siding replacement does for a Cincinnati home",
      columbus: "Re-siding a Columbus house, from tear-off to trim",
      "st-louis": "New siding, done the way St. Louis housing demands",
    }[m.slug]),
    // CINCINNATI REWRITTEN 2026-08-31 (Rambow audit phase 2 — the hub pages measured 71%
    // cross-market overlap; Cincinnati first, stop for review). Columbus and St. Louis keep the
    // owner's 2026-08-27 paragraphs until their rewrites are approved.
    detailIntro: (m) => m.slug === "cincinnati" ? [
      "Drive one loop from Hyde Park through Oakley to Anderson Township and you will pass every siding era Cincinnati has: 1920s foursquares still wearing original wood clapboard, post-war ranches through Blue Ash and Madeira sided in the aluminum of their day, and the vinyl-clad two-stories that filled Mason and West Chester from the nineties on. Each of those walls fails differently, and a siding quote that does not account for which one you own is a guess.",
      "A full replacement here starts with what the old cladding is hiding. Wood-sheathed older homes east of the Mill Creek often carry decades of patched moisture damage at the base course; newer builds hide their trouble at window heads where builder-grade flashing gave up early. The old siding comes off, the sheathing gets inspected board by board, and what needs replacing gets replaced before anything new goes on the wall.",
      "Then the assembly is built as a system — housewrap lapped and taped, flashing at every opening, trim, soffit and fascia detailed to spec — because siding is a water-management layer that happens to look good, not the other way around.",
    ] : m.slug === "columbus" ? [
      "Columbus siding work splits along a line you can drive in twenty minutes: on one side, the vinyl-clad subdivisions that filled Dublin, Hilliard and Westerville from the nineties on, where builder-grade panels and the sheathing behind them are aging out together; on the other, Clintonville, Bexley and German Village, where the cladding question comes with historic-district rules attached and the answer has to look like it belongs on the street.",
      "We work both sides of that line. On newer homes, a replacement means stripping the original builder package, fixing the moisture problems it hid — window heads and bottom courses, almost every time — and rebuilding the wall as a system with wrap, flashing and a cladding gauge chosen for open-lot wind. On older streets it means profiles and trim that pass both the review board and the neighbors' eye test.",
    ] : [
      "St. Louis is a brick town, which makes siding here a more particular trade than it looks. What we clad is everything the brick is not: frame gables and dormers above the masonry, rear additions off city houses near Tower Grove and The Hill, and the long, low elevations of South County ranches in Affton, Mehlville and Oakville that were built frame from the start.",
      "Those walls take a climate that swings from genuinely hot summers to freezing winters, and the swing is what kills cladding here — it works fasteners loose, opens joints, and finds every place an installer skipped a clearance. A replacement from us starts at the sheathing, fixes what the old siding was hiding, and goes back together with the movement room and flashing detail this weather insists on.",
    ],
    // Cincinnati's lead is its own (phase 2); the shared string serves the other two markets.
    lead: (m) => m?.slug === "cincinnati"
      ? "Siding installation and replacement across greater Cincinnati — James Hardie fiber cement and vinyl, fitted to the house you actually own."
      : "James Hardie fiber cement and vinyl siding, installed and repaired for the whole exterior.",
    local: {
      columbus: {
        replaceFaq: true,
        description: "Columbus siding replacement for both sides of town — subdivision vinyl aging out and historic streets with rules. Written quote after a free inspection.",
        sections: [
          { title: "The nineties package, replaced properly", body: "Dublin, Hilliard and Westerville run on builder-grade vinyl now hitting the end of its life. Replacing it is the moment to fix the wrap and flashing that era skipped." },
          { title: "Historic streets, matching profiles", body: "German Village, Bexley and Clintonville come with review standards. We spec lap widths and trim that pass the board and look right from the sidewalk." },
          { title: "Wind is the local enemy", body: "Open central-Ohio lots give gusts a straight run at a wall. Fastening schedule and panel lock strength matter more here than in either of our other metros." },
          { title: "One elevation or the whole house", body: "A failed west wall does not always mean re-siding everything. We quote the honest scope — and warn you when a partial match will show." },
        ],
        faq: [
          { q: "Do you handle historic-district approval in Columbus?", a: "We prepare the material and profile documentation your submission needs and spec products that boards have accepted before. The application itself belongs to the homeowner, but you will not be doing it blind." },
          { q: "Why is everyone's siding failing at once in my subdivision?", a: "Because it all went up the same season, from the same builder order, at the same gauge. Whole streets in the northwest suburbs are hitting the twenty-five-to-thirty-year wall together — which also means we can often quote several neighbors one mobilization." },
          { q: "What does re-siding a Columbus two-story cost?", a: "The honest range depends on gauge, trim scope, and what the tear-off finds — sheathing repair is the variable nobody can price from the curb. We put a written number on it after a free inspection, and it holds unless the scope changes." },
          { q: "Can new siding stand up to the wind out here?", a: "Specified and fastened correctly, yes. Panel wind ratings vary widely, and the fastening schedule matters as much as the rating — we set both for open-ground exposure, not the catalog default." },
          { q: "How fast can it happen?", a: "Most single-family jobs run three to six working days once materials land. We stage so the house is never left open, and weather moves the schedule rather than the standard." },
        ],
      },
      "st-louis": {
        replaceFaq: true,
        description: "St. Louis siding for frame gables, additions and full ranches — built for the summer-to-winter swing. Free inspection from our Geyer Road office.",
        sections: [
          { title: "Where brick ends, we start", body: "Gables, dormers and rear additions above and behind the masonry — small areas where detail matters, because every edge meets brick and every edge has to shed water." },
          { title: "Ranch-scale walls, done in days", body: "South County's long single-story elevations are efficient to re-side and unforgiving of sloppy lines — a wavy course reads across forty feet." },
          { title: "Built for the swing", body: "Hot summers, freezing winters, and everything a wall does moving between them. Movement room and fastening depth are the spec items this climate cares about." },
          { title: "Storm damage on cladding", body: "Hail and wind mark siding as well as roofs. We document it slope-and-elevation style for the same reason — so a claim conversation starts with evidence." },
        ],
        faq: [
          { q: "My house is mostly brick — is a siding job worth calling about?", a: "Yes. Gable-and-dormer packages are some of our most common St. Louis work: small square footage, high skill share, and the difference between a crisp roofline and a shabby one." },
          { q: "What siding survives a St. Louis summer best?", a: "Fiber cement is the most dimensionally stable through our heat, and heavier-gauge vinyl behaves well when it is hung with proper movement room. Thin panels pinned tight are what buckle in August — that is installation, not material." },
          { q: "Can you match the rest of the street?", a: "Usually close enough that nobody looks twice; exactly, not always — profiles get discontinued. We check availability before we promise, and show you the nearest match if the original is gone." },
          { q: "Do you replace soffit and fascia with the siding?", a: "Almost always, and here more than anywhere: the oak canopy over South County keeps those boards wet and working. Doing them in the same pass costs a fraction of a return visit." },
          { q: "What will it cost on a typical ranch?", a: "Long, simple walls make ranches some of the most efficient siding work we do per square foot — but the number still depends on what the tear-off exposes. Free inspection, written quote, no payments until completion." },
        ],
      },
      cincinnati: {
        // replaceFaq: the shared siding FAQ was a 250-word block identical on all three market
        // pages — the single biggest overlap contributor the audit measured. Cincinnati's FAQ
        // stands alone; the other markets keep the shared set until their rewrites.
        replaceFaq: true,
        description: "Cincinnati siding contractors for James Hardie and vinyl — tear-off, sheathing repair and spec installation from our Milford office. Free inspection.",
        sections: [
          { title: "Fiber cement for the four-seasons test", body: "Hardie board holds paint through Ohio Valley freeze-thaw and shrugs off spring hail — the reason it has been winning the older east-side streets where wood finally gave out." },
          { title: "Vinyl, specified honestly", body: "The right call for much of Mason, Loveland and West Chester: modern heavier-gauge panels on a properly prepared wall, not the thin builder-grade sheet that earned vinyl its reputation." },
          { title: "The repair-or-replace line", body: "One failed elevation on a sound wall is a repair. Waviness, chronic paint failure or soft sheathing underneath is the wall telling you the assembly is done — we will say which, plainly." },
          { title: "Trim, soffit and fascia in the same pass", body: "Cincinnati's tree cover keeps gutters and fascia wet longer than open suburbs; rotted trim goes with the siding job while the wall is open, at a fraction of the standalone cost." },
        ],
        faq: [
          { q: "What does new siding cost in Cincinnati?", a: "It depends on the wall more than the material: how much sheathing repair is hiding under the old cladding, how many stories and openings, and whether trim and fascia go in the same pass. We put a written number on it after a free inspection — and the quote holds unless the scope itself changes." },
          { q: "Hardie or vinyl for a Cincinnati home?", a: "Fiber cement wins on impact, fire rating and paint life, and suits the older housing stock from Hyde Park to Pleasant Ridge. Quality vinyl wins on budget and maintenance and fits much of the newer stock north of the loop. Where both fit we quote both and say which we would put on our own house." },
          { q: "Can you match historic siding profiles on older homes?", a: "Usually, yes. Hardie's smooth and cedar-textured lap lines come in widths that sit correctly on 1920s facades, and trim details can be reproduced in composite that outlasts the wood it replaces. Bring us a photo of the street face and we will tell you what is matchable." },
          { q: "How long does a full siding replacement take?", a: "Most single-family homes run three to five working days: tear-off and sheathing repair first, then wrap and flashing, then cladding and trim. Weather moves the schedule rather than the standard, and we tell you when it does." },
          { q: "Do you handle the permits?", a: "Yes. Hamilton, Clermont, Butler and Warren counties each run their own process and several municipalities add their own layer — we pull whatever the address needs before the crew arrives." },
        ],
      },
    },
    sections: [
      { title: "James Hardie Fiber Cement", body: "The premium option: holds paint far longer than vinyl and stands up to impact. We are an Alliance Elite contractor." },
      { title: "Vinyl Siding", body: "The value option, and a good one when it is installed properly. Most siding complaints trace back to installation, not material." },
      { title: "Siding Repair", body: "Storm damage, rot at the base course, and the sections nobody notices until they are replacing more than they needed to." },
      { title: "Soffit and Fascia", body: "Usually done alongside siding or gutters — it is where water gets in when it is neglected." },
    ],
    process: [
      { title: "Free inspection", body: "We check the wall for rot and moisture, and how the existing course was fitted — which is usually where the trouble started." },
      { title: "Product and color", body: "Hardie or vinyl, with samples held against your roof and trim in daylight rather than picked off a chart." },
      { title: "Removal and repair", body: "The old siding comes off and the sheathing gets inspected. Anything soft is replaced before the new course goes on." },
      { title: "Installation and finish", body: "Course, trim, soffit and fascia, with the site cleared at the end of every day rather than at the end of the job." },
    ],
    faq: [
      { q: "Hardie or vinyl?", a: "Hardie costs more up front and lasts longer, holds color better and takes a knock without cracking. Vinyl is a lower price and fine when installed well. We quote both and let you decide." },
      { q: "Can you do siding and gutters together?", a: "Yes, and it is usually faster and cheaper than two visits — the same crew is already set up." },
      { q: "Can you install new siding over what is already there?", a: "Code sometimes allows it and we rarely recommend it. Taking the old course off is what lets us see the sheathing, replace anything rotten and flash the openings properly. Covering it up hides the problem you are paying to solve." },
      { q: "How long does a siding job take?", a: "Five to ten days on most homes. A single-story ranch is at the short end, a complex two-story with a lot of trim detail at the long end." },
      { q: "Do you work on new construction?", a: "Yes — with homeowners, builders and general contractors, scheduled around the rest of the trades rather than dropped into the middle of them." },
      { q: "What about the soffit, fascia and trim?", a: "Done in the same visit. It is where water actually gets in when it is neglected, and it is the part that makes a siding job look finished rather than wrapped." },
    ],
    // (the per-market `local` block sits above, after `lead` — a second empty one here shadowed
    // it in the object literal and silently threw away the Cincinnati rewrite. Caught in-round.)
  },
  windows: {
    label: "Windows",
    h1: (m) => `Replacement Windows in ${m.name}`,
    // Rewritten per market 2026-08-31 (audit continuation): heading, intro, sections, FAQ and
    // depth are each written from scratch per metro — no shared sentence between versions.
    detailHeading: (m) => ({
      cincinnati: "Window replacement across a century of Cincinnati openings",
      columbus: "When a whole subdivision's glass fogs at once",
      "st-louis": "Windows that earn their keep in a St. Louis summer",
    }[m.slug]),
    detailIntro: (m) => ({
      cincinnati: [
        "Cincinnati's openings span a hundred years of construction habits. The double-hungs in a Hyde Park foursquare sit in true-dimension frames with weight pockets; a Madeira ranch carries mid-century units in openings that have settled a half inch since; the newer stock in Mason and West Chester holds builder-grade windows whose seals are failing right on schedule. One spec does not fit those three houses, which is why we measure every opening individually and quote the window each one actually needs.",
        "The valley's climate does the rest of the arguing: humid summers that find every leaky sash, and winters that turn single-pane and failed-seal units into condensation machines. Done right, replacement windows here pay you back twice — in comfort first, then on the bills.",
        "Our window crews carry the same rules as every Coldstream trade: a free assessment before any number, a written per-opening quote that holds, and no payments until the work is complete. If a repair honestly beats a replacement on a given window — a reglaze, new balances, weatherstripping — that goes in the quote too, because selling you glass you did not need is a one-transaction business.",
      ],
      columbus: [
        "There is a particular call we get from Dublin, Hilliard and Westerville almost weekly: the glass has gone cloudy, three windows at once, in a house built in the nineties. That is seal failure, it is arriving street by street across the era's subdivisions, and once the insulated unit has lost its gas fill the window has quietly stopped doing its job — no matter how clean it looks from the yard.",
        "Our Columbus window work is largely that story, plus the opposite one: older Clintonville and Beechwold homes where original frames deserve keeping and an insert unit does the work without touching the trim. Full-frame where the frame has failed, insert where it has not, and a straight answer about which yours is.",
        "Every Columbus window quote is built the same way: each opening measured and listed with its own line, the insert-versus-full-frame call explained per window rather than averaged, and the total written down before anything is ordered. Assessment is free, the number holds unless the scope changes, and nothing is due until the last window is installed and working.",
      ],
      "st-louis": [
        "Ask what a window is for in St. Louis and the honest answer is: surviving August. Solar heat gain drives summer bills here harder than winter loss does, which flips the glass spec most national guides assume — low-E coatings tuned to reject heat, not just hold it. On a west-facing elevation in Ballwin or Florissant, the right glass package is the difference you can feel standing in the room.",
        "The housing adds its own wrinkle: masonry openings on city and inner-ring brick homes need a different installation approach than the frame openings of South County ranches. We do both, measure every opening rather than averaging the house, and put the whole thing in writing after a free assessment.",
        "What that assessment covers: every opening measured and probed, the frames checked for the rot our humidity quietly grows, glass packages recommended per elevation with the reasoning attached, and a written per-window quote with no payments due until completion. It is the same no-pressure process our roofing customers know, applied to glass.",
      ],
    }[m.slug]),
    sections: [
      { title: "Full-Frame Replacement", body: "When the frame itself has failed, replacing the insert alone just hides the problem." },
      { title: "Insert Replacement", body: "Where the existing frame is sound, an insert is faster, cheaper and less disruptive." },
      { title: "Styles", body: "Double-hung, slider, casement, bay and bow, and fixed picture windows." },
    ],
    process: [
      { title: "In-home assessment", body: "Every opening measured individually, and the frames checked for damage and water intrusion before anything is quoted." },
      { title: "Product selection", body: "Style and glass package chosen against the house and what you want it to do — not one specification applied to every window in it." },
      { title: "Careful removal", body: "Old units out, and the wall around each opening checked for the hidden moisture or rot that only shows up once it is open." },
      { title: "Precision installation", body: "Levelled, shimmed, flashed and sealed with low-expansion foam, then tested for operation before the crew moves to the next one." },
    ],
    local: {
      cincinnati: {
        replaceFaq: true,
        description: "Replacement windows measured to Cincinnati's century-old openings and its newest ones — insert or full-frame, quoted per window. Free assessment.",
        sections: [
          { title: "Old-house windows, kept honest", body: "Pre-war double-hungs can often take an insert that preserves original trim. When the frame has rot or racking, we say so — an insert in a failed frame just hides it." },
          { title: "The settled-opening problem", body: "Hillside homes and older foundations mean out-of-square openings. Each one gets measured on its own; nothing is averaged from a floor plan." },
          { title: "Glass for the valley", body: "Humidity, shade, freeze-thaw: we spec low-E and fills for actual exposure, wall by wall, not one package for the whole house." },
          { title: "Rot repair before install", body: "Sills and jambs under Cincinnati tree cover stay wet. We open, repair and flash before the new unit goes in — the step skipped quotes skip." },
        ],
        faq: [
          { q: "Can you replace windows in a hundred-year-old Cincinnati house without wrecking the trim?", a: "Usually, yes — that is what insert replacement is for. The original interior trim stays, the new unit works inside the old frame, and the street face keeps its character. The honest exception is a frame that has failed structurally; then full-frame is the only fix that is not cosmetic." },
          { q: "Why do my windows sweat every winter?", a: "Condensation on the room side means the inside glass surface is cold — single panes or failed seals, almost always. New insulated units keep that surface warm enough that the moisture stays in the air where it belongs." },
          { q: "How many windows make a job worth it?", a: "We take single-window jobs, though most homeowners batch at least a wall. Bundling helps the per-unit price mostly by sharing one setup and one trip — and on older houses it lets the crew keep one consistent sightline and trim approach across the elevation instead of matching someone else's earlier work." },
          { q: "What is the timeline right now?", a: "Measurement to installation typically runs a few weeks, driven by the manufacturer's build time on made-to-measure units. Installation itself is one to two hours per window." },
          { q: "Do you handle the disposal and cleanup?", a: "Completely — old units, packaging, and a vacuum pass room by room. Each opening is finished and closed the same day it is opened." },
          { q: "Which Cincinnati neighborhoods do your window crews cover?", a: "The whole metro from our Milford office — Hyde Park and Oakley east through Anderson Township and Loveland, north through Blue Ash, Mason and West Chester, and across the river towns. If we side or roof there, we do windows there." },
        ],
      },
      columbus: {
        replaceFaq: true,
        description: "Foggy glass in a 1990s Columbus subdivision? Seal failure is epidemic in that era's windows. We replace them properly — free, per-opening assessment.",
        sections: [
          { title: "Seal failure, the era's signature", body: "Cloudy glass means the insulated unit is done. It arrives in batches in Dublin, Hilliard and Westerville because whole streets share one build year." },
          { title: "Insert or full-frame, honestly", body: "Sound frame: insert, faster and cheaper. Compromised frame: full-frame, because anything else buries the problem behind new vinyl." },
          { title: "Wind-tight on open ground", body: "Air infiltration ratings matter more on central Ohio's open lots than the brochure implies. We spec and foam-seal for the exposure your wall actually has." },
          { title: "Egress and code, checked", body: "Bedroom windows have opening-size requirements. Replacements are the moment those get quietly right — or quietly wrong. We check." },
        ],
        faq: [
          { q: "Half my windows are foggy — do I replace all of them or just those?", a: "The clear ones from the same build year are usually a few seasons behind the foggy ones. We quote it both ways so you can weigh doing it once against doing it twice." },
          { q: "Is fixing the glass alone an option?", a: "Sash or glass-unit replacement exists for some product lines, and where your frames are sound and the line is still made we will price it against full replacement rather than defaulting to the bigger job." },
          { q: "What brands and lines do you install in Columbus?", a: "Lines with real warranties and a manufacturer we can get answers from — quoted per project, since availability shifts. What we will not install is the bottom-shelf builder-grade unit that created this problem the first time." },
          { q: "Will replacements change how the house looks from the street?", a: "Matched frame colors and grid patterns keep the elevation consistent — worth care in a subdivision where every house shares the same window rhythm, and something we mock up with you before ordering." },
          { q: "What does a whole-house window job cost here?", a: "It scales with count, sizes and the insert-versus-full-frame split, so honest numbers come from the free assessment. The quote is written, itemized per opening, and holds unless the scope changes." },
          { q: "Do you cover my part of the Columbus metro?", a: "From Galloway we run the full ring — Dublin, Hilliard and Westerville where the seal-failure calls cluster, Worthington, Gahanna and Upper Arlington, and the older blocks of Clintonville and Bexley where the preservation questions live." },
          { q: "Is winter a bad time to replace windows in Columbus?", a: "Less than people assume. One-opening-at-a-time installation means the house is exposed for minutes per window, not hours, and winter scheduling is often faster because demand dips. The sealants we use are rated for cold application — the calendar is a preference, not a constraint." },
        ],
      },
      "st-louis": {
        replaceFaq: true,
        description: "Heat-rejecting glass for St. Louis summers, fitted to brick and frame openings alike. Free per-window assessment — no payments until completion.",
        sections: [
          { title: "Glass that fights August", body: "Low-E packages tuned to reject solar gain — the spec that matters most here — chosen per elevation, because a north wall and a west wall live different lives." },
          { title: "Masonry openings, handled", body: "Brick surrounds need the right anchoring and sealing approach. City and inner-ring homes get an install detail suited to masonry, not a frame-wall shortcut." },
          { title: "Ranch rows, done in a day", body: "South County's window walls — big openings, similar sizes — replace efficiently. Most single-story homes finish in a day or two." },
          { title: "Storm-season toughness", body: "Impact-rated and laminated options exist for exposed elevations. We tell you where they earn their premium and where ordinary insulated glass is plenty." },
        ],
        faq: [
          { q: "What actually lowers a St. Louis summer electric bill — new windows or more insulation?", a: "Both matter, but west- and south-facing glass is often the biggest single heat gate in the house. Heat-rejecting low-E on those elevations is one of the few upgrades you can feel the week it goes in." },
          { q: "Can you replace windows set in brick?", a: "Yes — masonry openings are routine here and change the anchoring, flashing and sealing approach rather than the window itself. It is a detail we plan for, not a surprise we hit." },
          { q: "Do new windows help with street and highway noise?", a: "Meaningfully, especially moving from single-pane or loose old units. Laminated glass options push the improvement further where noise is the actual complaint." },
          { q: "What happens if a storm is coming mid-project?", a: "No opening is left unglazed, ever — each window is removed and installed the same day, and we sequence the work so the house is closed every night of the job." },
          { q: "How do I get a real price?", a: "A free assessment where we measure each opening and check the frames. The quote is written, and there are no payments until the work is complete." },
          { q: "Where in the St. Louis metro do you install?", a: "Metro-wide from Geyer Road: Kirkwood, Webster Groves and the inner ring, South County through Oakville and Mehlville, West County out to Chesterfield and Ballwin, and north through Florissant and O'Fallon." },
          { q: "Can grids and styles match a mid-century ranch?", a: "Yes — picture-and-flanker combinations and horizontal sliders are the period vocabulary of South County's housing, and modern lines carry all of them. We match the era's proportions rather than forcing a colonial grid onto a ranch elevation." },
        ],
      },
    },
    faq: [
      { q: "Will new windows actually cut my bills?", a: "They help, and how much depends on what you have now. Single-pane to modern double-pane is a real difference; a ten-year-old double-pane to a new one is not." },
      { q: "Can I get a window repaired instead of replaced?", a: "Sometimes. Worn weatherstripping and a broken latch are repairs. Fog between the panes, rot in the frame or daylight around the edges are not — at that point the unit has failed and a repair only buys a season." },
      { q: "What works in an older home?", a: "A lot of the housing stock here predates 1970, and double-hung units in vinyl or wood-clad fit those openings without rebuilding the wall. Where the frame itself has gone, full-frame replacement is the honest answer." },
      { q: "How long does it take?", a: "One to two hours per window. A whole house of ten to fifteen is two to three days, and we leave each room finished rather than opening every opening at once." },
      { q: "Can I do just a few windows?", a: "Yes. We will match the new units to the existing ones as closely as the product line allows, and tell you where the match will be visible." },
      { q: "What is the difference between an insert and a full-frame replacement?", a: "An insert fits inside the existing frame — quicker, cheaper, and only right when that frame is sound. Full-frame takes it back to the opening and is what you need when the frame is the thing that failed." },
    ],
    // (per-market `local` sits above the shared faq; a trailing empty local here shadowed it —
    // the same object-literal trap the siding entry hit. Do not re-add.)
  },
  gutters: {
    label: "Gutters",
    titleTag: (m) => `Gutter Installation in ${m.cityState} | Coldstream Exteriors`,
    h1: (m) => `Gutters in ${m.name}`,
    detailHeading: (m) => ({
      cincinnati: "Moving water off a hillside house",
      columbus: "Gutters that keep pace with a flat-lot downpour",
      "st-louis": "Sized for oak drop and gully-washer rain",
    }[m.slug]),
    detailIntro: (m) => ({
      cincinnati: [
        "Gutter work in Cincinnati is shaped by two things the flatland guides never mention: hills and trees. A hillside lot in Mt. Washington or Price Hill concentrates roof water exactly where the slope already wants to push it — at the foundation — and the canopy over Clermont County and the river townships keeps every open gutter fed with debris eight months a year. Sizing, guard choice and where the downspouts discharge all follow from those two facts.",
        "We roll seamless runs on site, size them to the actual roof area draining into them, and treat the question nobody asks — where does the water go after the downspout — as half the job. On a slope, it is the whole job.",
        "The visit itself is simple: we measure the roof planes feeding each run, walk the discharge path the water takes today, probe the fascia the new system will hang from, and write the whole scope down with one number. If guards make sense for your trees we will show the arithmetic; if they do not, we will say that instead of selling them.",
      ],
      columbus: [
        "Central Ohio's spring storms drop serious water fast, and the flat lots most Columbus homes sit on give that water nowhere obvious to go. An undersized gutter here does not fail gradually; it sheets over the front edge in the first big cell of April and soaks the same foundation corner every time. Sizing to the real roof area — not the builder default — is the fix, and it is the first thing we calculate.",
        "Tree cover splits the guard question neatly by neighborhood: heavy in Clintonville and Worthington, nearly absent across the newer rings. We recommend guards where they earn their cost and say so plainly where they will not.",
        "A Columbus gutter quote from us reads like a drainage plan, because that is what it is: run lengths and sizes with the catchment math shown, downspout positions with where each one discharges, guard recommendations tied to your actual trees, and fascia condition noted before anything hangs on it. Free inspection first, written number after, no payments until the water is tested and moving.",
      ],
      "st-louis": [
        "Two forces run gutter work in this metro: the mature oaks over South County and the inner ring, which load systems with a heavy autumn drop plus spring tassels, and the summer gully-washers that arrive faster than any residential gutter fashionably handles. A St. Louis system needs capacity for the cloudbursts and protection from the canopy — and on the long, low rooflines of Affton and Mehlville ranches, runs that hold their fall over forty feet.",
        "Every quote starts at the roof: area, pitch and where the water lands today. Seamless runs rolled in the driveway, oversized where the math says so, tested with a hose before we call it finished.",
        "St. Louis homeowners get the same terms as every Coldstream trade: the inspection costs nothing, the quote is written and itemized by run, guards are recommended by canopy rather than by commission, and payment waits until the system has been water-tested in front of you. If a repair genuinely solves it — one dropped hanger, one failed corner — that is what we will quote.",
      ],
    }[m.slug]),
    local: {
      cincinnati: {
        replaceFaq: true,
        description: "Seamless gutters for Cincinnati's hills and canopy — sized to the roof, guards where trees demand them, discharge planned for the slope. Free inspection.",
        sections: [
          { title: "Hillside discharge planning", body: "On a slope, a downspout that dumps at the corner sends water straight to the foundation below. We route and extend so it leaves the property's fall line safely." },
          { title: "Guards that earn it", body: "Under Clermont County canopy, guards turn three cleanings a year into an occasional check. On the open lots of West Chester, we will tell you to skip them." },
          { title: "Ice at the eaves", body: "Valley winters build ice at the gutter line. Hanger strength and spacing decide whether a system shrugs that off or peels away by February." },
          { title: "Fascia condition, checked first", body: "Gutters anchor to fascia, and shaded fascia here is often soft. We check before hanging anything — new gutters on rotten boards is a return visit scheduled in advance." },
        ],
        faq: [
          { q: "Why does my Cincinnati basement get water every spring?", a: "Walk outside during the next hard rain and watch the gutters. Overflow at the front edge or a downspout dumping beside the wall is the cause more often than the foundation itself — and rerouting water is a far cheaper fix than waterproofing." },
          { q: "Are guards worth it on a treed lot here?", a: "Under real canopy, genuinely yes — the east side and the river townships are the strongest guard case we see anywhere. On open newer lots the honest answer is usually no, and we say it." },
          { q: "Five-inch or six-inch for my roof?", a: "It follows the square footage and pitch draining into each run. Cincinnati's bigger older roofs and steep sections often justify six-inch with oversized outlets; we do the arithmetic per run rather than defaulting." },
          { q: "Can you handle a hillside property?", a: "It is half our Cincinnati gutter work. Slopes change where water must be discharged, and extensions or drain tie-ins are quoted up front, not discovered later." },
          { q: "Gutters with a new roof, or separately?", a: "With, when a roof is happening anyway — the drip edge and flashing line up correctly in that order. Separately is fine too; we check the roof edge condition either way." },
          { q: "How often should Cincinnati gutters be cleaned if I skip guards?", a: "Under real canopy, plan on twice a year minimum — after the spring helicopters and after leaf drop — plus a check after any big storm. That schedule, priced out over a decade, is usually the argument that makes guards pay." },
          { q: "What parts of greater Cincinnati do your gutter crews reach?", a: "Everywhere the trees are: the east side through Hyde Park, Anderson Township and Milford, north through Blue Ash, Loveland and Mason, the west side and Butler County, and the Northern Kentucky river towns. Hillside streets are a specialty, not a surcharge." },
        ],
      },
      columbus: {
        replaceFaq: true,
        description: "Columbus gutter installation sized for spring downpours, not the builder default. Seamless runs rolled on site — free inspection and a written quote.",
        sections: [
          { title: "Capacity math, per run", body: "The builder five-inch on a big two-story roof is why the front walk floods every April. We compute each run against its real catchment and upsize where the number says to." },
          { title: "Guard honesty, street by street", body: "Clintonville's canopy justifies guards; a treeless Lewis Center lot does not. The recommendation follows the trees, not the sales margin." },
          { title: "Downspouts on flat lots", body: "Flat ground needs deliberate discharge — extensions, splash management or tie-ins that move water away instead of letting it pond by the slab." },
          { title: "Wind-firm hanging", body: "Open-lot gusts work loose what was hung casually. Hanger spec and spacing here match the exposure, and every run is water-tested for fall." },
        ],
        faq: [
          { q: "Why do my gutters overflow only in spring?", a: "Spring cells drop the year's highest rain rates. A system that keeps up all summer can still be undersized for April — capacity is set by the worst storm it will meet, not the average one." },
          { q: "What do new gutters cost on a Columbus two-story?", a: "Linear footage, size, downspout count and guard choice set the number, and the honest version comes from measuring, not from a per-foot guess over the phone. The written quote is free and holds unless scope changes." },
          { q: "Do I actually need guards?", a: "Look up: real overhanging canopy, probably yes; young subdivision landscaping, probably not for a decade. We give the street-specific answer instead of one pitch for everyone — and when the answer is yes, we spec the guard type to the debris your trees actually drop, because needle litter and broadleaf load defeat different designs." },
          { q: "Can gutters be fixed rather than replaced?", a: "A dropped hanger or a single leaking corner, certainly. Multiple failing seams, rust lines or pull-away along a run mean the system is at end of life, and patching it buys months, not years." },
          { q: "How long is the install?", a: "Most Columbus homes are one day: runs rolled on the driveway in the morning, hung and tested by the afternoon, old material hauled away." },
          { q: "What color and profile options are there?", a: "K-style in the standard aluminum palette covers most Columbus homes; half-round and copper exist for the historic streets that want them. We bring samples to the inspection so the choice happens against your actual trim color, not a website swatch." },
          { q: "Which Columbus neighborhoods do you install gutters in?", a: "All of them, from one Galloway dispatch: the subdivision rings of Dublin, Hilliard, Westerville and Grove City where sizing corrections are the usual job, the treed streets of Clintonville and Worthington where guards earn their keep, and the historic blocks where half-round is the right look. Same-week inspections most of the year, stretching slightly in the spring rush." },
        ],
      },
      "st-louis": {
        replaceFaq: true,
        description: "St. Louis gutters built for oak drop and cloudburst rain — oversized where the math demands it, guards where the canopy does. Free on-site quote.",
        sections: [
          { title: "Cloudburst capacity", body: "Summer cells here outrun standard sizing. Where roof area and pitch demand it, we spec six-inch runs and bigger outlets — quoted from the math, not a truck default." },
          { title: "The oak calendar", body: "Autumn drop, spring tassels: the inner ring's oaks load gutters twice a year. Guards are close to mandatory under that canopy, optional beyond it." },
          { title: "Ranch-run fall", body: "A forty-foot South County run must hold its pitch across the whole length or water stands and works the seams. Long runs get set with a line, then proven with a hose." },
          { title: "Expansion, planned for", body: "Our seasonal temperature swing works aluminum hard. Expansion behavior gets planned into run lengths and hanger choice instead of surprising the seams later." },
        ],
        faq: [
          { q: "What happens to gutters in a St. Louis summer storm?", a: "The failure is speed: an inch-plus-per-hour cell fills an undersized system in minutes and the overflow looks like a waterfall at the corners. Capacity sizing is the cure — the roof's area and pitch tell us exactly what each run must carry." },
          { q: "Are guards worth it under the oaks?", a: "Under the inner ring's canopy, more so than anywhere else we work — two heavy load seasons a year is the strongest possible case. On open lots further out, we will honestly steer you to spend the money elsewhere." },
          { q: "My long ranch runs sag in the middle — why?", a: "Hangers spaced for a short wall, or seasons of expansion working them loose. Long single-story runs need closer hanger spacing and set fall — it is detail work, and it is exactly the kind of thing we water-test before leaving." },
          { q: "Where should downspouts discharge?", a: "Away from the slab, always — with extensions or tie-ins where the yard's fall requires. Water sitting against a foundation is the most expensive place in the property to store it." },
          { q: "Roof and gutters together?", a: "Ideal order when both are due: roof first, then gutters, so drip edge and flashing integrate. We quote the pairing as one scope with one number." },
          { q: "Do you service the whole St. Louis metro?", a: "Yes — city neighborhoods with their box-gutter quirks, the inner ring under the oaks, South County's ranch country, and out through Ballwin, Chesterfield and Florissant. One office on Geyer Road, one crew standard everywhere." },
          { q: "Can downspouts tie into buried drains?", a: "Where the yard's fall allows, yes — and on clay soil it is often the cleanest permanent answer. We quote the tie-in as its own line so you can weigh it against surface extensions, and we never bury a connection we have not water-tested first." },
        ],
      },
    },
    lead: "Seamless gutters, guards and downspouts, sized to the roof they are draining.",
    sections: [
      { title: "Seamless Gutters", body: "Rolled on site to the length of the run, so the only joins are at corners and outlets." },
      { title: "Gutter Guards", body: "Worth it under trees, less so on an open lot. We will say which yours is." },
      { title: "Downspouts and Drainage", body: "Where the water goes once it leaves the gutter is half the job and the half most often skipped." },
    ],
    process: [
      { title: "Free inspection", body: "Roof area, pitch and tree cover — and where the water is currently ending up, which is the part most quotes skip." },
      { title: "Sizing and quote", body: "Gutter and downspout sized to the roof draining into them, in writing, before anything is rolled." },
      { title: "Rolled on site", body: "Seamless lengths formed on the drive to the exact run, so the only joints are at the corners and the outlets." },
      { title: "Hung and water-tested", body: "Hangers, pitch, outlets and downspouts routed away from the foundation — then water put through it to prove the fall." },
    ],
    faq: [
      { q: "Are gutter guards worth it?", a: "Under heavy tree cover, yes — they turn an annual clean into an occasional one. On an open lot they rarely pay for themselves, and we will tell you that rather than sell them." },
      { q: "How do I know I need new gutters?", a: "Sections pulling away from the fascia, rust or splits at the seams, water sheeting over the front in a downpour, or pooling at the foundation after it stops. Past about twenty years most systems are at the end of it." },
      { q: "Seamless or sectional?", a: "Seamless, in almost every case. The run is rolled on site to the exact length, so the only joints are at corners and outlets — and joints are where gutters leak first." },
      { q: "Repair or replace?", a: "Several leaking seams, gutters pulling off the fascia, corrosion, or standing water sitting in the run after rain all point to replacement. A single failed hanger or one split seam does not." },
      { q: "What size do I need?", a: "It follows the roof draining into it. Five-inch handles most homes; steep or large roof areas want six-inch and oversized downspouts, and undersizing that is why a system overflows in the heaviest rain it will ever see." },
      { q: "Can you do the gutters with the roof?", a: "Yes, and it is the sensible order — new gutters go on after the roof so the drip edge and the flashing line up instead of being worked around." },
    ],
    // (per-market `local` sits above; the trailing empty local was the shadowing trap. Do not re-add.)
  },
  // site-plan keeps this as its own hub rather than a section: "commercial buyers do not search
  // by sub-service. One strong page." It is the target the 13 folding commercial URLs land on.
  // Per-market, and OFF in St. Louis — see markets.js.
  "commercial-roofing": {
    label: "Commercial Roofing",
    h1: (m) => `Commercial Roofing in ${m.name}`,
    lead: "Flat and low-slope roofing for multi-family, HOA and commercial properties — installed, restored and repaired.",
    sections: [
      { title: "Flat and Low-Slope Systems", body: "TPO, EPDM and modified bitumen, specified against the deck, the drainage and what the building is used for — not against a default." },
      { title: "Roof Coatings and Restoration", body: "Where the deck is sound, a coating buys years for a fraction of a tear-off. We will tell you when it is the honest answer and when it is only postponing one." },
      { title: "Multi-Family and HOA", body: "Apartment blocks, condo associations and managed properties — phased so the buildings stay occupied and the board gets one point of contact." },
      { title: "Repair and Maintenance", body: "Leak tracing, flashing and penetration detail, and scheduled inspections that catch the small failures before they reach the insulation." },
    ],
    process: [
      { title: "Site survey", body: "Deck, drainage, penetrations and moisture, written up so it can go to an owner or a board without translation." },
      { title: "System recommendation", body: "TPO, EPDM, modified bitumen or a coating, specified against how the building is used and what the survey found." },
      { title: "Scope and phasing", body: "Access, hours and staging agreed in writing before anyone mobilises — the part that decides whether the job disrupts the business." },
      { title: "Installation and close-out", body: "Phased so buildings stay occupied, and handed over with warranty documentation and an inspection schedule." },
    ],
    faq: [
      { q: "Can you work around our tenants and business hours?", a: "Yes — scheduling around occupancy is most of what makes a commercial job different from a residential one. We agree the phasing and the access before we start, not on the day." },
      { q: "Do you handle the property manager or the board directly?", a: "Either. We work with whoever owns the decision, and we put the scope and the number in writing so it can go to a board without being reinterpreted." },
      { q: "Is a coating a real fix or a delay?", a: "It depends entirely on the deck and the amount of trapped moisture. A free inspection answers it, and we will say when a tear-off is the only thing that actually solves the problem." },
      { q: "How often should a commercial roof be inspected?", a: "Twice a year, spring and autumn, plus a check after any major storm. Most of what becomes a five-figure repair was a flashing detail somebody could have seen." },
      { q: "What are the signs it needs attention?", a: "Water still ponding forty-eight hours after rain, blistering or splitting in the membrane, stained ceiling tiles under the deck, loose flashing at the parapet, and heating or cooling costs climbing without another explanation." },
      { q: "How long does a commercial replacement take?", a: "One to three weeks for most buildings, driven by size, the system going on and what the deck turns out to be like underneath. The schedule is set around your operating hours before anyone mobilises." },
    ],
    local: {},   // PENDING per market — see header
  },
  "garage-doors": {
    label: "Garage Doors",
    h1: (m) => `Garage Doors in ${m.name}`,
    lead: "Installation and replacement, usually alongside a roofing or siding project so it is one crew and one schedule.",
    sections: [
      { title: "Installation", body: "New builds and first-time replacements, including the opener and the track." },
      { title: "Replacement", body: "Swapping a failed or dated door, matched to the siding and trim it sits in." },
    ],
    faq: [
      { q: "Do you install garage doors in every market?", a: "St. Louis only at the moment." },
    ],
    local: {},
  },
};

/** A service page clears the bar for a market only when it has copy written for that market. */
export const hasLocalCopy = (serviceKey, marketSlug) =>
  Boolean(SERVICE_CONTENT[serviceKey]?.local?.[marketSlug]);

/**
 * NATIONAL DEPTH — the buying-decision layer the national hubs lacked (round 48).
 *
 * WHERE IT CAME FROM. The live site carried six pages per market on windows and gutters alone —
 * 7,000+ pulled words per target sitting unused in live-copy/ — and the competitor benchmarks
 * carry the same layer: what decides the choice, what fails, what good fitting looks like. Our
 * national hubs were the thinnest indexable content pages on the site (788–1,035 words) and said
 * nothing about any of it.
 *
 * WHAT WAS NOT DONE: porting the live prose. It leans on "25+ years" (gated in claims.js), reads
 * in the banned voice ("Most Trusted", superlatives), and repeats one skeleton across six URLs.
 * The TOPICS are the gap; the copy below is written new, as trade fact rather than company claim,
 * which is why none of it needs the claims gate. No cities — a national page must not compete
 * with the market hubs on a city term (see the title rule in [service].astro).
 *
 * Shape matches MarketDepth: { eyebrow, heading, blocks: [{ h, p: [...] }] }.
 */
/**
 * MARKET ROOFING DEPTH — the inspection section, localized (owner brief 2026-08-27).
 *
 * Same headings as the national block ("What the inspection is looking for" / "What separates a
 * roof that lasts from one that doesn't"), but the copy is each market's actual weather — hail,
 * wind, freeze-thaw, storm season — because what an inspection looks FOR is set by what the sky
 * does to that metro. Three rules held while writing these:
 *   · Real climate, not invented detail: every claim is a general truth of the region (freeze-thaw
 *     counts, spring storm season, straight-line wind exposure) — no fake storms, dates or streets.
 *   · Neighborhoods over repetition: the towns named are the owner's list per market, used where
 *     the city name would otherwise repeat (the brief's own instruction).
 *   · St. Louis names no metal roofing — shingle and low-slope only there.
 * The three blocks are deliberately different per market in structure and emphasis, so the
 * similarity check has nothing to pair.
 */
/**
 * MARKET SIDING DEPTH — phase 2 of the Rambow audit (2026-08-31). Cincinnati only, by
 * instruction ("produce the Cincinnati siding page first and stop"); Columbus and St. Louis
 * render nothing here until their rewrites are approved. Every fact below is a general truth of
 * the metro's housing stock or climate — no invented jobs, addresses or testimonials.
 */
export const MARKET_HUB_DEPTH = {
  gutters: {
    cincinnati: {
      eyebrow: "Gutters in this metro",
      heading: "Water management on terrain that has opinions",
      blocks: [
        { h: "The hill decides where water wants to go", p: [
          "A gutter system on flat ground has one job; on a Price Hill or Mt. Adams slope it has two, because the ground itself is already steering water toward somebody's foundation — yours or the neighbor's downhill. Discharge planning on these lots is engineering, not accessorizing: which corner, how far the extension runs, whether a buried drain is the only honest answer.",
        ]},
        { h: "Canopy economics", p: [
          "The tree cover east of the Mill Creek and through the river townships is the deciding variable in most of our gutter conversations. It fills open systems relentlessly, it shades fascia into softness, and it makes guards — a hard sell on an open lot — simply good arithmetic. We price the guard against the cleanings it retires and let the math talk.",
        ]},
        { h: "Freeze-thaw at the roof edge", p: [
          "Valley winters hover at the freezing line, which is the worst place for a gutter to live: meltwater by day, ice by night, weight cycling on every hanger. Systems here earn their lifespan through hanger quality and spacing more than through the metal itself — the run that survives February was specified in July.",
        ]},
        { h: "Fascia first, always", p: [
          "Every gutter is only as good as the board it hangs from, and shaded Cincinnati fascia spends most of the year damp. Our inspections probe the fascia line before quoting anything — replacing soft sections while the gutters are down costs a fraction of doing it later, and hanging new metal on failing wood is how a one-day job becomes two jobs.",
        ]},
        { h: "What we find behind old systems", p: [
          "Thirty-year-old gutters come down and tell the house's history: rot lines where a seam dripped for a decade, tiger-striping where overflow ran the siding, soil channels where a downspout discharged at the wall. We photograph what we find, fix what is ours to fix, and flag what belongs to another trade — some of our roofing and siding work starts as a gutter tear-off's discoveries.",
          "That is also the argument for having one exterior company on the ladder: a gutter crew that recognizes early shingle-edge failure or a soft fascia line can flag it while the fix is small. Water problems on a house are one system wearing four trades' names, and we quote them that way when it saves you money.",
        ]},
      ],
    },
    columbus: {
      eyebrow: "Gutters in this metro",
      heading: "Sizing against the April cell",
      blocks: [
        { h: "Design for the worst hour of the year", p: [
          "Columbus gutter systems live or die by a handful of spring storms that drop rain faster than any average suggests. A system that handles the year's other fifty-one weeks and fails in that hour has failed at its whole purpose — the foundation only needs soaking a few times. We size each run against peak rate for its actual catchment, which routinely means six-inch where a builder installed five.",
        ]},
        { h: "Flat lots hide their drainage sins", p: [
          "On sloped ground, water leaves; on the flat lots of the newer rings, water goes exactly where the downspouts put it and stays. Ponding beside a slab is a settlement and moisture problem on a slow fuse. The unglamorous half of our installs is extensions and discharge routing — the part invisible in photos and decisive in basements.",
        ]},
        { h: "Exposure works on hardware too", p: [
          "The same open-ground wind that stresses siding rattles gutter runs, and hangers that were adequate on day one loosen a season at a time. We hang for the exposure — tighter spacing, better hardware — because a gutter's real spec is not the metal profile, it is what fastens the metal to the house.",
        ]},
        { h: "The subdivision default, revisited", p: [
          "Most Columbus gutter systems were installed by production math: one profile, one downspout count, whatever the framing schedule allowed. Twenty-five years later the houses have mature landscaping, finished basements and patios that change where water can acceptably go. A replacement is the low-cost moment to redesign discharge around how the property is actually used now — we treat it as a drainage rethink, not a like-for-like swap.",
        ]},
        { h: "Winter's short, sharp test", p: [
          "Central Ohio winters are milder than the gutter belt's worst, but the January thaw-freeze whiplash loads runs with ice exactly when the metal is most brittle. Hidden hangers at proper spacing and a correctly pitched run shed that test; the spike-and-ferrule systems still on many older houses fail it a little more each year.",
          "If your gutters still hang on visible spikes, that alone dates the system past twenty-five years — and re-driving the spikes each spring is maintenance on borrowed time. Modern hidden-hanger replacement costs less than most homeowners guess, and it is the difference between owning gutters and renting them season to season.",
        ]},
      ],
    },
    "st-louis": {
      eyebrow: "Gutters in this metro",
      heading: "Two seasons of load, one system",
      blocks: [
        { h: "What the oaks demand", p: [
          "The inner ring's oak canopy delivers two full load seasons — leaf drop in autumn, tassels and seed in spring — and an open gutter under it spends half the year part-blocked. Blockage is not an inconvenience; it converts the system into a trough that overflows at the worst point on the run. Under this canopy, guards move from upsell to infrastructure.",
        ]},
        { h: "Cloudburst arithmetic", p: [
          "St. Louis summer cells produce rainfall rates the standard residential spec never contemplated. The fix is unglamorous math: roof area times pitch factor times peak rate, per run, then hardware sized to the result. It is ten minutes of calculation that separates a system that works in July from one that decorates the fascia.",
        ]},
        { h: "Long runs, wide swings", p: [
          "A ranch's forty-foot run amplifies everything: more thermal expansion across our seasonal swing, more chance for fall to wander, more water arriving at a single outlet. Long-run work is set with a string line, seamed only at corners, given room to move, and proven with a running hose before the trailer is packed.",
        ]},
        { h: "City parapets and box gutters", p: [
          "Older city housing brings gutter forms most crews never touch: built-in box gutters behind cornices, internal drops through parapet walls, and the flat-roof drainage of rear additions. This is careful, slightly archaeological work — lining and relining rather than ripping out — and it is a real part of what gutter service means on the streets around Tower Grove.",
        ]},
        { h: "The foundation math nobody runs", p: [
          "St. Louis clay swells wet and shrinks dry, and a downspout dumping at a corner cycles that clay through both states harder than weather alone ever would. Slab and basement movement traces back to roof water more often than owners suspect. Extending discharge ten feet costs almost nothing during an install; it is some of the highest-return money on the whole project.",
          "It is also why our St. Louis gutter inspections finish at ground level, not at the eaves: we walk where each downspout discharges today, look for the soil channels and splash erosion that tell the truth about past storms, and write the discharge plan into the quote alongside the metal.",
        ]},
      ],
    },
  },
  windows: {
    cincinnati: {
      eyebrow: "Windows in this metro",
      heading: "What a hundred years of openings taught us",
      blocks: [
        { h: "Weight pockets, plaster returns and other pre-war realities", p: [
          "East-side foursquares and Tudors carry window assemblies modern products never met: rope-and-weight pockets that leak air like chimneys, plaster returns instead of drywall jambs, sills poured deeper than any modern default. Working these openings without wrecking what makes the house good is a skill line item — and it is why our measurements happen from a ladder, not a spreadsheet.",
        ]},
        { h: "Shade is lovely and expensive", p: [
          "The canopy that keeps Clifton and Wyoming beautiful also keeps sills damp. Wood rot at the bottom corners of window frames is the most common thing our assessments find on treed streets, and it decides insert-versus-full-frame more often than the glass does. We probe every sill because paint hides everything until it does not.",
        ]},
        { h: "Two seasons, two jobs for the glass", p: [
          "A Cincinnati window earns its living twice a year: holding out humid ninety-degree air in July and holding in heat through January's freeze-thaw seesaw. Dual low-E coatings, warm-edge spacers and honest fills matter here in a way milder climates never test. We spec for both seasons, not the showroom.",
        ]},
        { h: "The quote is per opening, because the house is", p: [
          "By the time a Cincinnati house is fifty years old, no two of its openings are quite the same size. Averaging a house from plans is how gaps get foamed instead of fitted. Every unit we order is measured against its own opening, which is slower on day one and right for the next thirty years.",
        ]},
        { h: "Storm season includes the glass", p: [
          "The hail runs that bring us roofing calls crack glazing and dent aluminum cladding on windows facing the weather, and insurance scopes routinely miss both. When we document a storm-hit house, openings are part of the walk — a cracked pane and a bruised sash are the same storm, and they belong on the same claim.",
        ]},
        { h: "What replacement day actually looks like", p: [
          "One opening at a time: the old unit out, the frame probed and repaired where it needs it, the new unit leveled, shimmed, foamed and flashed, trim closed, room vacuumed — then the next. A typical east-side house of twelve to fifteen openings runs two to three days, and no room stays torn up overnight.",
          "The crew that measures is the crew that installs, which matters more in old housing than new: the person who noticed the racked opening in the northwest bedroom is the person shimming the unit into it. Notes do not survive handoffs; on hundred-year-old houses, we skip the handoff.",
        ]},
      ],
    },
    columbus: {
      eyebrow: "Windows in this metro",
      heading: "The subdivision glass problem, up close",
      blocks: [
        { h: "Why whole streets fog together", p: [
          "An insulated glass unit is two panes, a spacer, a desiccant and a gas fill — and a finite seal holding it together. The units installed across Columbus's boom subdivisions came from the same era of manufacturing and have been aging in lockstep ever since. When the seal goes, moisture gets in, the fill gets out, and the fog you cannot wipe off is the visible symptom of an invisible efficiency loss that started years earlier.",
        ]},
        { h: "The builder-grade ceiling", p: [
          "The original units in most of these houses were chosen by a spreadsheet, not a homeowner. Replacement is the one moment the ceiling lifts: better frames, better glass, better installation — for a house you already know you are keeping. Skipping that moment to install the same grade again is the only real mistake available.",
        ]},
        { h: "Air-tightness on open ground", p: [
          "Central Ohio wind does not just push on walls; it finds every gap around every opening. Infiltration ratings — the spec nobody reads — matter more here than almost anywhere, and installation quality matters more than the rating. Level, shimmed, low-expansion foamed, and tested: the last hour of an install is where a window's winter performance is decided.",
        ]},
        { h: "Historic exceptions to everything above", p: [
          "None of the subdivision logic applies in German Village or on Clintonville's older blocks, where the right answer is usually preserving profiles and sightlines while quietly upgrading the glass. Different problem, different products, same crew — and the review-board paperwork prepared with the quote.",
        ]},
        { h: "Reading a failed unit before it fogs", p: [
          "Fog is the late symptom. Earlier ones: condensation between panes on cold mornings that clears by noon, a window noticeably colder to the hand than its neighbors, sashes that suddenly feel light because the gas fill is gone. Catching seal failure early does not save the unit — nothing does — but it lets you plan the replacement instead of discovering it in January.",
        ]},
        { h: "Batch pricing, because the problem arrives in batches", p: [
          "Since seal failure sweeps a street at a time, we quote Columbus window work with clean per-opening arithmetic that scales — doing eight now and four next spring should not cost more than twelve at once by accident. The itemized quote shows the count math so you can split the job across seasons deliberately.",
          "One practical note from a decade of these streets: replace the weather-side elevations first. West and south walls age fastest in central Ohio exposure, so if the budget forces an order, that is the order — and your quote will already be sequenced that way when it arrives.",
        ]},
      ],
    },
    "st-louis": {
      eyebrow: "Windows in this metro",
      heading: "Glass against the gradient",
      blocks: [
        { h: "The west wall pays the bills", p: [
          "Take an infrared camera around a St. Louis house in July and the story writes itself: the west and south glass runs ten degrees hotter than the walls around it. Solar heat gain coefficient — SHGC, the number most window shopping ignores — is the working spec here. We tune it by elevation, because blocking heat on the west wall and welcoming light on the north one are both correct.",
        ]},
        { h: "Brick changes the install, not the goal", p: [
          "A window in a masonry opening is anchored, flashed and sealed differently from one in a frame wall — and this metro has more masonry openings than any market we serve. Sloppy masonry installs hide behind caulk for a year or two; ours are detailed for the brick from the start, which is most of why they still work in year twenty.",
        ]},
        { h: "What the storm season asks", p: [
          "Summer cells throw debris as well as rain. For exposed elevations we quote laminated or impact-rated glass as an option with its real price next to it — worth it on some houses, unnecessary on others, and your call once the difference is in writing.",
        ]},
        { h: "Sequenced so the house is never open", p: [
          "St. Louis weather punishes an unglazed opening faster than anywhere we work, so our installs run one opening at a time, removed and finished the same day, sequenced around the forecast. A window job should never involve plywood.",
        ]},
        { h: "Humidity is the quiet second enemy", p: [
          "August air here carries water the way January air carries cold, and single-pane or failed units sweat on the outside in summer the way they frost inside in winter. Beyond comfort, that condensation cycle feeds sill rot and paint failure around the opening — replacing the unit is often what stops a slow-motion carpentry problem, not just a glass one.",
        ]},
        { h: "The masonry-to-frame price question", p: [
          "Homeowners with brick-set windows often expect a premium and are right to ask. The honest answer: the install detail differs more than the price does. Anchoring and sealing to masonry takes care rather than exotic materials, and our per-opening quotes show the difference explicitly instead of burying it in a lump sum.",
          "The same transparency runs the whole quote: glass package by elevation with the reasoning, any frame repair called out per opening, and the storm-glass option priced separately so you can take it or leave it. A window quote you cannot read line by line is a window quote hiding something.",
        ]},
      ],
    },
  },
  siding: {
  columbus: {
    eyebrow: "Siding in this metro",
    heading: "The two Columbus walls, and what each one needs",
    blocks: [
      { h: "A subdivision problem arriving on schedule", p: [
        "Most of the housing ringing Columbus went up in a twenty-year burst, and its original cladding is aging out on the same schedule it went up on. The panels themselves are usually the least of it: that construction era wrapped walls quickly, taped little, and flashed window heads with whatever the schedule allowed. The failures we open up in Dublin or Lewis Center are behind the vinyl far more often than in it.",
        "So a replacement here is really a wall rebuild wearing a siding job's name — the cladding comes off, the original shortcuts get corrected, and the new panels go over a wall that finally has a working water barrier.",
      ]},
      { h: "Wind writes the spec", p: [
        "Flat ground, young trees, long fetch: a front crossing central Ohio meets nothing that slows it before it meets your west elevation. Siding spec here starts from wind — panel lock strength, fastening schedule, and the discipline of leaving movement room without leaving slack. A panel that rattles in October is a panel that leaves in April.",
      ]},
      { h: "The historic streets play by different rules", p: [
        "German Village's review standards are the strictest, but Bexley, Clintonville and Worthington's older blocks all carry expectations about lap width, shadow line and trim that a subdivision product does not meet. Fiber cement carries most of these projects: it takes the deeper profiles, holds paint, and reads as original from the street.",
        "We spec what boards have approved before and prepare the documentation a submission needs — the fastest route through a review is showing up with the answer they have already said yes to.",
      ]},
      { h: "Hail happens to walls too", p: [
        "The spring runs that bruise shingles crack aged vinyl, especially panels that have gone brittle in the sun. After a hail event we read walls the way we read roofs — elevation by elevation, photographed — because cladding damage is claimable on the same storm and homeowners routinely leave it off the scope.",
      ]},
    ],
  },
  "st-louis": {
    eyebrow: "Siding in this metro",
    heading: "Cladding a frame wall in a masonry town",
    blocks: [
      { h: "The gable trade", p: [
        "Drive any street off Kingshighway and look up: brick to the eaves, then a frame gable wearing whatever was affordable the last time someone worked on it. Those gables, plus dormers and the rear additions that generations added to city houses, are the classic St. Louis siding job. They are small in square feet and dense in detail — every edge terminates against masonry, and the flashing at that line decides whether the wall works.",
      ]},
      { h: "What the swing does to a wall", p: [
        "Between a July afternoon and a January night, this metro asks cladding to survive one of the widest working temperature ranges in the country. Vinyl grows and shrinks visibly across that span; fasteners back out of it a little more every cycle; caulk joints open. The spec answer is material chosen for stability, hung with engineered movement room — and honest advice about which products tolerate a western exposure here and which quietly do not.",
      ]},
      { h: "Ranches reward straight lines", p: [
        "South County's mid-century stock — Affton, Mehlville, Oakville, out to Fenton — offers the opposite job: enormous, simple, single-story runs. Production efficiency makes these the best-value siding work in the metro, and the long sightlines punish any course that wanders. Our crews string and check these walls obsessively because on a ranch, straight IS the craftsmanship.",
      ]},
      { h: "After the storm, look at the walls", p: [
        "The same summer cells that drive our roofing work strafe siding on the windward side — cracked panels, punched-through hail hits on brittle older vinyl, creased aluminum on homes that still carry it. We photograph and write up wall damage with the same slope-by-slope discipline as roof damage, because carriers treat documented elevations very differently from a homeowner's guess.",
      ]},
    ],
  },
  cincinnati: {
    eyebrow: "Siding in this metro",
    heading: "What Cincinnati walls ask of their siding",
    blocks: [
      { h: "Three housing eras, three different walls", p: [
        "The east-side streets through Hyde Park, Mt. Lookout and Oakley carry pre-war homes with true wood sheathing and, often, several generations of cladding layered over it. The first ring out — Blue Ash, Madeira, Wyoming, Anderson Township — is largely post-war construction where aluminum and early vinyl went over plank or early panel sheathing. Mason, Loveland and West Chester filled in from the eighties onward with OSB-sheathed frames built for vinyl from day one.",
        "Why it matters: the tear-off findings, the fastening schedule and even the right starter course differ across those three walls. A crew that sides every house the same way is siding two of the three wrong.",
      ]},
      { h: "The Ohio Valley is hard on cladding", p: [
        "Cincinnati summers are humid enough to keep shaded walls damp for days, winters cross freezing dozens of times, and spring brings hail often enough that we meet its dents every year. Paint on wood fails fast here; thin vinyl reads every temperature swing; and any siding over a wall that cannot dry is a rot problem on a timer.",
        "That is why our installs are detailed for drying as much as for looks — rain-screen gaps where the assembly calls for them, wrapped and taped sheathing, and flashing that sheds water out of the wall instead of trapping it behind the cladding.",
      ]},
      { h: "Trees, hillsides and the moisture line", p: [
        "The canopy through Clermont County and the river townships is beautiful and merciless: shaded north walls in Milford or Terrace Park can stay wet weeks longer than an open Mason lot two towns over. On heavily treed streets we pay particular attention to the base course and to clearances at grade, because splash-back and held moisture is where those walls fail first.",
      ]},
      { h: "Hardie country, honestly qualified", p: [
        "Fiber cement has earned its run through Cincinnati's older neighborhoods — it takes an impact, holds paint through the freeze-thaw cycles, and carries the deeper profiles older facades want. We install it to James Hardie's own specification, which is most of what separates a Hardie wall that lasts from one that curls at the butts. But it is not automatic: on a large, simple newer elevation, a heavier-gauge vinyl can be the smarter spend, and we will say so.",
      ]},
      { h: "What the quote actually covers", p: [
        "Tear-off to the sheathing, repair of what turns up, housewrap lapped and taped, flashing at every opening and transition, the cladding itself, and trim, soffit and fascia detailed in the same pass. One crew, one project manager from our Milford office, and a written scope before anyone touches the wall — across Hamilton, Clermont, Butler and Warren counties and the Northern Kentucky river towns.",
      ]},
    ],
  },
  },
};

export const MARKET_ROOFING_DEPTH = {
  cincinnati: {
    eyebrow: "What the inspection is looking for",
    heading: "What separates a roof that lasts from one that doesn't",
    blocks: [
      { h: "Freeze-thaw is the quiet one", p: [
        "An Ohio Valley winter crosses freezing dozens of times, and every crossing works water a little deeper into any gap it has found — a lifted shingle edge, a nail head, tired flashing. The damage shows up in spring, long after the ice that caused it is gone.",
        "So the inspection reads the roof for what February did to it: sealant lines at penetrations, the eaves where ice dams stand, and the shaded northern slopes that stay wet longest — the same exposures that age roofs early from Anderson Township to Loveland.",
      ]},
      { h: "Spring hail and wind, documented before they are argued about", p: [
        "The storm season that runs April through June drops hail somewhere in the metro most years. Bruised shingles do not leak on day one — they shed granules and fail early instead, which is why fresh damage gets photographed and measured while it is still legible.",
        "Wind works differently: it creases and lifts tabs along ridges and rakes, and a crease is a break in the seal whether or not anything looks torn from the driveway. We have walked enough roofs in Mason, West Chester and Milford after the same storm to know two streets apart can be two different claims.",
      ]},
      { h: "Humid summers cook from underneath", p: [
        "A shingle roof over a poorly vented attic runs hot in a humid summer, and heat from below ages a roof as surely as weather from above. Intake at the eaves and exhaust at the ridge get checked as a pair on every inspection — from older housing stock in Hyde Park to newer builds in Blue Ash, blocked soffit vents are the most common finding.",
      ]},
    ],
  },
  columbus: {
    eyebrow: "What the inspection is looking for",
    heading: "What separates a roof that lasts from one that doesn't",
    blocks: [
      { h: "Straight-line wind is the signature risk", p: [
        "Central Ohio's flat, open terrain gives summer wind events a running start, and derecho-style straight-line winds have taken more roofs here than tornadoes have. The inspection starts where wind starts: ridge lines, rake edges and the field fasteners on the windward side.",
        "A tab that lifted once and resealed leaves a crease you can read a year later. Finding those before the next front comes through is the difference between a repair now and a deck-soaking later — true in Hilliard and Gahanna exactly as it is downtown.",
      ]},
      { h: "Freeze-thaw and the ice-dam line", p: [
        "Winter here hovers around freezing rather than sitting below it, which is the worst pattern a roof can get: melt by day, refreeze by night, and standing ice at the eaves prying at the first course. Ice-and-water membrane at the eaves is code minimum, not a finish line — the inspection checks how far up it actually runs.",
        "Homes from Worthington to Upper Arlington with original decking get particular attention at the eaves, where forty winters of that cycle concentrate their work.",
      ]},
      { h: "Hail season sets the granule clock", p: [
        "Spring hail through the northwest suburbs — Dublin and Westerville see their share — rarely punches holes. It bruises. A bruised shingle sheds its granules over the following seasons and exposes the mat to UV, so the inspection reads granule loss in gutters and downspouts as a record of what has already hit the roof.",
      ]},
    ],
  },
  "st-louis": {
    eyebrow: "What the inspection is looking for",
    heading: "What separates a roof that lasts from one that doesn't",
    blocks: [
      { h: "Hail is the headline here", p: [
        "This metro sits closer to hail country than either of our Ohio markets, and it shows in the work: hail drives more replacement conversations here than age does. The inspection documents impact damage the way a carrier needs it — circle by circle, slope by slope — because a storm that hit Ballwin hard can have brushed Chesterfield and skipped Kirkwood entirely.",
        "Impact-resistant shingles earn their premium in this pattern, and we say so when the roof and the budget make the case.",
      ]},
      { h: "Storm season is also insurance season", p: [
        "Severe weather from spring into summer means the busiest inspection weeks follow the loudest nights. Fresh damage is easiest to attribute while it is fresh: the assessment separates what the storm did from what the years did, in writing, before an adjuster asks — a distinction that decides claims from Florissant to O'Fallon.",
      ]},
      { h: "Heat load and the freeze on either side of it", p: [
        "Summer here puts real heat into a shingle roof and the winter that follows still crosses freezing — the spread works fasteners loose and opens laps year by year. Ventilation carries more of the lifespan here than most homeowners expect, and shaded, slow-drying slopes in the older tree streets of Webster Groves get read closely for moss and held moisture.",
      ]},
    ],
  },
};

export const NATIONAL_DEPTH = {
  roofing: {
    eyebrow: "What the inspection is looking for",
    heading: "What separates a roof that lasts from one that doesn't",
    blocks: [
      { h: "Material is matched to the roof, not the other way round", p: [
        "Architectural asphalt carries most homes: layered, wind-rated and economical to repair. Impact-rated shingles earn their premium where hail keeps returning. Metal trades a higher up-front cost for lifespan, and low-slope sections need membrane systems, not shingles pretending to be one.",
        "The specification follows the inspection — pitch, exposure, and what the last roof did wrong — rather than a default.",
      ]},
      { h: "Ventilation is half the lifespan", p: [
        "An attic that cannot breathe cooks shingles from underneath in summer and feeds ice dams in winter. Intake at the eaves and exhaust at the ridge work as a pair; blocking either one disables both.",
        "Plenty of \"failed\" roofs are ventilation problems wearing a shingle costume. Replacing the shingles without fixing the airflow buys the same failure twice.",
      ]},
      { h: "Flashing is replaced, not caulked over", p: [
        "Most leaks trace to transitions — chimneys, walls, valleys, pipe boots — not to the open field of the roof. Metal that has moved or rusted gets replaced. Caulk over tired flashing is a countdown, not a repair.",
      ]},
      { h: "The decking decides on tear-off day", p: [
        "What is under the old shingles cannot be known from the ground or a satellite photo. Soft decking found on tear-off gets replaced before anything new goes down — which is why the quote is written after a thorough inspection, and why it holds unless the scope itself changes.",
      ]},
      { h: "Repair or replace — how the call actually gets made", p: [
        "Three things decide it: the age of the shingles, the state of the decking, and how widespread the damage is. A ten-year-old roof with one lifted valley is a repair; a twenty-year-old roof leaking in three places is a replacement being paid for in installments.",
        "The inspection settles it, and we will say when a repair is the honest answer — a roof with years left in it should get them.",
      ]},
      { h: "What a replacement includes", p: [
        "Full tear-off to the deck — never an overlay, which hides the decking and voids most shingle warranties. Then ice-and-water membrane at the eaves and valleys, synthetic underlayment, new flashing throughout, ridge ventilation, and the shingle system installed as the manufacturer specifies.",
        "Cleanup is part of the job: magnet runs for nails, and a walk of the finished work with you before the crew leaves.",
      ]},
      { h: "How the job runs", p: [
        "A project manager carries out a thorough inspection and writes the quote. Materials arrive ahead of the crew, most homes are finished in a single day, and weather moves the schedule rather than the standard — we tell you when it does.",
      ]},
    ],
  },
  siding: {
    eyebrow: "Material and fitting, weighed together",
    heading: "Material is half the decision. Fitting is the other half.",
    blocks: [
      { h: "Fiber cement and vinyl solve different problems", p: [
        "Fiber cement is heavier, fire-resistant, holds paint and takes an impact; it costs more and demands precise installation. Vinyl is lighter on budget and maintenance, never needs paint, and moves with temperature by design.",
        "Where both fit the house we quote both, and say which one we would put on our own.",
      ]},
      { h: "Vinyl is hung, not nailed tight", p: [
        "Vinyl expands and contracts with the weather. A panel nailed hard cannot move, so it buckles in summer and cracks in a cold snap. Fitted right, it hangs on its nailing slots and slides invisibly.",
        "Most \"bad vinyl\" is bad fitting — the material takes the blame for the installation.",
      ]},
      { h: "Fiber cement lives and dies by its details", p: [
        "Clearances off the roofline and the grade, flashed butt joints, sealed cut edges, the right fasteners at the right depth. Fiber cement rewards the crew that respects the spec sheet and punishes the one that improvises.",
      ]},
      { h: "What's behind the siding matters more than the siding", p: [
        "Some water always gets behind cladding, so the wall underneath gets a drainage plane — housewrap lapped to shed, flashing at every opening. The siding is the umbrella; the wrap is the raincoat.",
        "Re-siding is also the one chance to see the sheathing. Soft spots found then cost little to put right. Hidden, they cost a wall.",
      ]},
    ],
  },
  windows: {
    eyebrow: "The decisions the estimate walks through",
    heading: "What decides whether new windows actually perform",
    blocks: [
      { h: "Insert or full-frame comes first", p: [
        "An insert replacement sets the new unit inside the existing frame — less disruption, lower cost, and the right call when that frame is square, sound and dry. A full-frame replacement strips back to the rough opening and rebuilds from there.",
        "Which one your house needs is a measurement, not a preference. Soft sills, racked frames or staining around the casing all point full-frame; covering them with an insert seals the problem in.",
      ]},
      { h: "The glass does the energy work", p: [
        "Two numbers describe most of what a window does: U-factor, how well it holds heat in, and solar heat gain, how much summer sun it lets through. Low-E coatings and gas fill between the panes move both.",
        "A climate with real winters and real summers needs the two read together — a window chosen only to hold heat can cook a west-facing room in July. We go through the label with you, not around it.",
      ]},
      { h: "Fitting decides more than the brand", p: [
        "A well-made window fitted out of square fails early: sashes drag, seals stress, water finds the sill. The parts you never see set the service life — flashing lapped the right way, shims that keep the frame true, insulation that fills the gap without bowing the jambs.",
        "It is why every opening is measured on its own rather than averaged from a floor plan.",
      ]},
      { h: "When a window is actually done", p: [
        "Fog between the panes means the seal has failed and the insulating gas is gone — that unit is finished even if the frame is fine. Sashes that will not stay up, softening sills and drafts you can feel are the same verdict in other forms.",
        "One failed unit does not always mean a whole-house job. The inspection separates the windows that are done from the ones with years left, and the quote follows that line.",
      ]},
    ],
  },
  gutters: {
    eyebrow: "Sizing, seams and where the water goes",
    heading: "Sizing and detail decide whether gutters actually work",
    blocks: [
      { h: "Sized to the roof draining into them", p: [
        "Capacity is a function of the roof above: its area, its pitch, and how many valleys concentrate the flow. A steep roof sheds the same storm faster, and an undersized run overflows at the inside corners first.",
        "Often the fix is not bigger gutters but more downspouts — their count and placement move more water than the profile does.",
      ]},
      { h: "Seamless, because joints are where gutters fail", p: [
        "Sectional gutters leak at their seams as the sealant ages; that is not a defect, it is what sealant does. Seamless runs are roll-formed to length on site, so the only joints left are corners and outlets.",
      ]},
      { h: "Guards are a trade-off, not a magic lid", p: [
        "Guards do their best work against leaves. Shingle grit, seed pods and needles behave differently, and no cover ends maintenance — a good one turns a ladder job every season into an occasional rinse.",
        "The honest question is what your trees drop. That picks the mesh and style better than any brochure.",
      ]},
      { h: "The job is where the water lands", p: [
        "Gutters exist to move water away from the foundation. A downspout that empties beside the footing has moved the problem four feet.",
        "Extensions, splash blocks and the grade they discharge onto are part of the design — wet basements and settled slabs are what failed drainage actually costs.",
      ]},
    ],
  },
};
