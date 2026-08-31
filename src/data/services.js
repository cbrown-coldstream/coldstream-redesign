// TEMPLATE 3 — service hub content.
//
// A service page is shared service copy PLUS market-specific copy. Both are required.
//
// THE UNIQUENESS BAR IS THE POINT OF THE WHOLE REBUILD. site-plan: every surviving page needs
// "a unique H1 that is not reused across markets · at least one piece of local proof · unique
// FAQ answers · the local phone number and address · 300+ words written for that market. A page
// that cannot clear it should not be a page — it should be a section on one that can."
//
// The audit found 100+ neighbourhood pages that were the same skeleton with synonyms swapped.
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
//     neighbourhood. This is the primary source.
//   · The content portal's intake — crew notes and job photos, already routed by market lane.
//
// The sequence, in order:
//
//   1. Pull the last 12–24 months of completed jobs, per market, per service.
//   2. For each of the 13 pages assemble the real inputs: representative jobs, materials
//      actually specified, neighbourhoods actually worked, the local specifics — building stock,
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
    `${c.stock} Siding on that mix of houses is rarely a single conversation — a mid-century elevation and a 2000s two-storey want different materials and different detailing. ${c.weather} That movement is what opens joints and lifts butt ends, so how a wall is installed matters more here than which brand goes on it.`,
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
  roofing: (m) => `Roof replacement, repair and storm work ${where(m)}. Free inspection, a written quote first, and industry-leading warranties.`,
  siding: (m) => `Fiber cement and vinyl siding ${where(m)}, installed to the manufacturer's specification. Free inspection and a written quote first.`,
  windows: (m) => `Replacement windows ${where(m)}, measured opening by opening and fitted by trained installers. Free, no-obligation quote.`,
  gutters: (m) => `Seamless gutters, guards and downspouts ${where(m)}, sized to the roof draining into them. Free inspection.`,
  "commercial-roofing": (m) => `Flat and low-slope roofing for commercial, HOA and multi-family properties across ${m.region}. Surveyed and scoped in writing.`,
  "garage-doors": (m) => `Garage door installation and replacement across ${m.region}. Free, no-obligation quote and a written price.`,
};

export const SERVICE_CONTENT = {
  roofing: {
    label: "Roofing",
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
    detailHeading: (m) => `What a full siding replacement does for a ${m.name} home`,
    // CINCINNATI REWRITTEN 2026-08-31 (Rambow audit phase 2 — the hub pages measured 71%
    // cross-market overlap; Cincinnati first, stop for review). Columbus and St. Louis keep the
    // owner's 2026-08-27 paragraphs until their rewrites are approved.
    detailIntro: (m) => m.slug === "cincinnati" ? [
      "Drive one loop from Hyde Park through Oakley to Anderson Township and you will pass every siding era Cincinnati has: 1920s foursquares still wearing original wood clapboard, post-war ranches through Blue Ash and Madeira sided in the aluminum of their day, and the vinyl-clad two-storeys that filled Mason and West Chester from the nineties on. Each of those walls fails differently, and a siding quote that does not account for which one you own is a guess.",
      "A full replacement here starts with what the old cladding is hiding. Wood-sheathed older homes east of the Mill Creek often carry decades of patched moisture damage at the base course; newer builds hide their trouble at window heads where builder-grade flashing gave up early. The old siding comes off, the sheathing gets inspected board by board, and what needs replacing gets replaced before anything new goes on the wall.",
      "Then the assembly is built as a system — housewrap lapped and taped, flashing at every opening, trim, soffit and fascia detailed to spec — because siding is a water-management layer that happens to look good, not the other way around.",
    ] : [
      "Nothing changes a home's appearance like new siding. Who installs it matters just as much as what goes on the wall.",
      "We take the old siding off rather than cover it, inspect the carpentry underneath, and replace anything that needs it before new material goes on. House wrap, flashing, trim, soffit, and fascia all get done to spec.",
    ],
    // Cincinnati's lead is its own (phase 2); the shared string serves the other two markets.
    lead: (m) => m?.slug === "cincinnati"
      ? "Siding installation and replacement across greater Cincinnati — James Hardie fiber cement and vinyl, fitted to the house you actually own."
      : "James Hardie fiber cement and vinyl siding, installed and repaired for the whole exterior.",
    local: {
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
      { title: "Product and colour", body: "Hardie or vinyl, with samples held against your roof and trim in daylight rather than picked off a chart." },
      { title: "Removal and repair", body: "The old siding comes off and the sheathing gets inspected. Anything soft is replaced before the new course goes on." },
      { title: "Installation and finish", body: "Course, trim, soffit and fascia, with the site cleared at the end of every day rather than at the end of the job." },
    ],
    faq: [
      { q: "Hardie or vinyl?", a: "Hardie costs more up front and lasts longer, holds colour better and takes a knock without cracking. Vinyl is a lower price and fine when installed well. We quote both and let you decide." },
      { q: "Can you do siding and gutters together?", a: "Yes, and it is usually faster and cheaper than two visits — the same crew is already set up." },
      { q: "Can you install new siding over what is already there?", a: "Code sometimes allows it and we rarely recommend it. Taking the old course off is what lets us see the sheathing, replace anything rotten and flash the openings properly. Covering it up hides the problem you are paying to solve." },
      { q: "How long does a siding job take?", a: "Five to ten days on most homes. A single-storey ranch is at the short end, a complex two-storey with a lot of trim detail at the long end." },
      { q: "Do you work on new construction?", a: "Yes — with homeowners, builders and general contractors, scheduled around the rest of the trades rather than dropped into the middle of them." },
      { q: "What about the soffit, fascia and trim?", a: "Done in the same visit. It is where water actually gets in when it is neglected, and it is the part that makes a siding job look finished rather than wrapped." },
    ],
    // (the per-market `local` block sits above, after `lead` — a second empty one here shadowed
    // it in the object literal and silently threw away the Cincinnati rewrite. Caught in-round.)
  },
  windows: {
    label: "Windows",
    h1: (m) => `Replacement Windows in ${m.name}`,
    lead: "Energy-efficient replacement windows, measured and installed by trained crews.",
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
    faq: [
      { q: "Will new windows actually cut my bills?", a: "They help, and how much depends on what you have now. Single-pane to modern double-pane is a real difference; a ten-year-old double-pane to a new one is not." },
      { q: "Can I get a window repaired instead of replaced?", a: "Sometimes. Worn weatherstripping and a broken latch are repairs. Fog between the panes, rot in the frame or daylight around the edges are not — at that point the unit has failed and a repair only buys a season." },
      { q: "What works in an older home?", a: "A lot of the housing stock here predates 1970, and double-hung units in vinyl or wood-clad fit those openings without rebuilding the wall. Where the frame itself has gone, full-frame replacement is the honest answer." },
      { q: "How long does it take?", a: "One to two hours per window. A whole house of ten to fifteen is two to three days, and we leave each room finished rather than opening every opening at once." },
      { q: "Can I do just a few windows?", a: "Yes. We will match the new units to the existing ones as closely as the product line allows, and tell you where the match will be visible." },
      { q: "What is the difference between an insert and a full-frame replacement?", a: "An insert fits inside the existing frame — quicker, cheaper, and only right when that frame is sound. Full-frame takes it back to the opening and is what you need when the frame is the thing that failed." },
    ],
    local: {},
  },
  gutters: {
    label: "Gutters",
    h1: (m) => `Gutters in ${m.name}`,
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
    local: {},
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
export const MARKET_SIDING_DEPTH = {
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
