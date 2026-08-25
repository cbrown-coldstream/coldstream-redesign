// THE NATIONAL SUB-SERVICE PAGES — /roofing/replacement/, /roofing/repair/,
// /siding/vinyl-siding/, /siding/james-hardie-siding/, /siding/stone-veneer/.
//
// Requested 2026-08-19: the nav dropdowns needed real destinations from a national page. Before
// this, `childHref` with no market in context returned the parent hub, so every dropdown child on
// a national page pointed at the page you were already on — the same "four nav items, one
// destination" problem that produced the national hubs themselves (see pages/[service].astro).
//
// ── HOW THESE AVOID BEING A FOURTH COPY OF THE MARKET PAGE ───────────────────────────────────
//
// CLAUDE.md's one rule: a page that cannot say something only it could say should not be a page.
// The split that keeps these honest is the same one [service].astro already documents, applied one
// level down, and it is a real split rather than a formatting one:
//
//     MARKET sub-service page  →  this material, HERE. Local climate, local building stock, the
//                                 market's own crew, phone and served areas.
//     NATIONAL sub-service page → this material, FULL STOP. What it is, how it is installed, how
//                                 it fails, and how to choose it. No city appears anywhere.
//
// So NOTHING IN THIS FILE IS WRITTEN AGAINST A CITY, and no market page's local paragraphs are
// repeated here. The material argument is genuinely market-independent — vinyl hangs on the nail
// the same way in all three metros — and it is the half a homeowner comparing products actually
// reads. `npm run similarity` is the check on whether that stayed true.
//
// ── SLUGS: THE NATIONAL SPELLING IS NOT THE MARKET SPELLING ──────────────────────────────────
//
//     /roofing/replacement/   national   ←→   /{market}/roofing/roof-replacement/   market
//     /roofing/repair/        national   ←→   /{market}/roofing/roof-repair/        market
//
// The national spelling is the one specified in the request. The market spelling is load-bearing
// and was NOT touched: 273 redirect rules in data/redirects.js resolve to `roofing/roof-repair`
// and `roofing/roof-replacement`, and renaming those URLs would point every one of them at a 404.
// `marketService` below carries the market path so the market chooser deep-links correctly.
//
// ── STONE VENEER IS NATIONAL-ONLY, AND WHY ───────────────────────────────────────────────────
//
// There is no /{market}/siding/stone-veneer/. Three market variants would be this same page with a
// city name dropped into it — the exact pattern the consolidation exists to remove — because we
// have no market-specific stone veneer content: no local job history, no per-market crew note,
// nothing only a Cincinnati stone page could say. One national page is the honest shape until
// there is real local work behind it, and `nationalOnly` in data/nav.js links it from every market.
//
// ⚠ ONE THING NEEDS CONFIRMING AND IS FLAGGED RATHER THAN ASSUMED. Stone veneer appears nowhere in
// the ~150k words of live WordPress copy in src/data/live-copy/, and it is not in any market's
// `services` array in markets.js. The page was requested, which is taken as the answer to "do we
// offer this"; the copy below therefore describes the work accurately but claims NO manufacturer
// certification, NO completed project count and NO market availability, because none of those has
// a source. If the answer is that we do not install it, delete this entry and the nav line.

/**
 * Shared closing questions. The market pages get a market-scoped pair from `commonFaq` in
 * subservices.js; the national equivalent cannot name a region, so it answers the two questions a
 * national reader actually has instead — is it really free, and who turns up.
 */
const commonFaq = () => [
  { q: "Is the inspection really free?", a: "Yes. The inspection and the written quote are free and carry no obligation, and nobody will lean on you afterwards." },
  { q: "Who actually does the work?", a: "Coldstream crews in every market we run — and the person who quotes the job stays on the job from the first walk-through to the final cleanup." },
  { q: "What does the warranty cover?", a: "A 25-year workmanship warranty on what we install, alongside whatever the manufacturer warrants on the material itself. Licensed and insured in every market we work in." },
];

export const NATIONAL_SUBSERVICES = {
  roofing: {
    // ── /roofing/replacement/ ────────────────────────────────────────────────────────────────
    replacement: {
      label: "Roof Replacement",
      marketService: "roofing/roof-replacement",
      title: "Roof Replacement | Coldstream Exteriors",
      description: "Full tear-off roof replacement. Decking inspected, ventilation balanced, new flashing throughout, and a 25-year workmanship warranty.",
      h1: "Roof replacement, taken back to the boards",
      lead: "A full tear-off, a deck somebody actually looked at, and a written quote after a free inspection — not a price off a satellite image.",
      intro: "A roof replacement is sold as shingles and delivered as everything underneath them. The covering is the part you can see and the smallest part of whether the job lasts: the decking it is nailed to, the ventilation moving air beneath it, and the flashing at every place the roof meets something else are what decide that. We quote a replacement after walking the roof, because two houses built the same year on the same street routinely need different work once the old layers come off.",
      sections: [
        { title: "Tear-off, not an overlay", body: "Laying a second layer over the first hides the decking, traps heat against the new shingles and shortens the life of what you just bought. We strip the roof to the boards so nothing is covered up unseen." },
        { title: "Decking, then everything else", body: "Soft or delaminated decking is replaced before anything goes over it. This is the one moment in twenty years the boards are visible, and covering a bad one costs far more the second time." },
        { title: "Ventilation, balanced", body: "Intake at the eaves and exhaust at the ridge, sized together. A roof with exhaust and no intake pulls air from inside the house instead, which is how a new roof still cooks a plywood deck." },
        { title: "The details that leak", body: "New underlayment, ice-and-water membrane at eaves and valleys, and new flashing at every penetration, sidewall and chimney. Old flashing caulked back into place is the most common leak we get called out to fix." },
      ],
      depth: {
        eyebrow: "About the work",
        heading: "What separates a roof that lasts from one that just looks finished",
        intro: "Every replacement looks identical from the kerb on the day it is finished. The differences show up in year six, and all of them were decided while the roof was open.",
        blocks: [
          { h: "The deck is the roof",
            p: ["Shingles are a wear layer. The structure doing the actual work is the decking underneath, and it is the only part of the assembly nobody sees between one replacement and the next.",
                "Soft spots around chimneys, in valleys and along the eaves are normal on a roof at the end of its life — those are the places water has been sitting. Replacing a few sheets while the roof is stripped is a small line on the quote. Discovering them at the next replacement means the layer you paid for was never nailed into anything solid."] },
          { h: "Ventilation is not an upsell",
            p: ["Air has to enter low and leave high. When it cannot, moisture from inside the house condenses on the underside of the deck through the winter and heat builds under the shingles through the summer, and both shorten the life of a roof that was installed perfectly.",
                "The common fault is exhaust without matching intake — ridge vent added, soffit intake blocked by insulation or never cut. The system then draws its air from the house. Balancing it costs little while the roof is open and is awkward and expensive afterwards."] },
          { h: "Flashing is where roofs actually leak",
            p: ["The field of a roof rarely fails first. Leaks start where the roof meets something else: a chimney, a sidewall, a skylight, a valley, a plumbing stack. Those junctions are handled by metal, and metal has a service life of its own.",
                "Reusing old flashing and sealing the gap with caulk is quick, it costs almost nothing, and it is the reason for a large share of the repairs we are called to. Caulk is a maintenance material, not a flashing. New flashing goes on with a new roof."] },
          { h: "Choosing the covering, honestly",
            p: ["Architectural asphalt suits most houses and is what most replacements use. Impact-resistant shingles are worth considering where hail is a recurring problem rather than a one-off. Metal costs more up front and lasts substantially longer, and it suits some rooflines far better than others.",
                "A low-slope section — a porch, a dormer, an addition — is a different assembly from the steep roof next to it and must not be shingled as though it were. Where a roof mixes pitches, it gets more than one system, and the quote says so."] },
        ],
      },
      process: [
        { title: "Free inspection", body: "We walk the roof, photograph what we find, and check decking, flashing and ventilation rather than pricing off an aerial image." },
        { title: "Written scope and quote", body: "Materials, tear-off, ventilation and the number, in writing, before anything is ordered." },
        { title: "Tear-off and installation", body: "Our own crew, on the day we said. Most homes are stripped and re-covered inside a day." },
        { title: "Clean-up and walkthrough", body: "A magnet run over the property for nails, then a walk of the finished job with you." },
      ],
      faq: [
        { q: "How long does a replacement take?", a: "A simple ranch is usually a single day. A larger two-storey with a complex roofline runs two to three. Weather moves the schedule, and we tell you when it does." },
        { q: "Do I need a replacement or a repair?", a: "The free inspection answers it. Age, the condition of the decking and how widespread the damage is decide it, and we will say when a repair is the honest answer." },
        { q: "Can you go over the existing shingles?", a: "We do not. It hides the decking, adds weight, traps heat and shortens the life of the new layer. If somebody has quoted you an overlay, that is why it is cheaper." },
        { q: "Will you replace the flashing too?", a: "Yes. New flashing at penetrations, sidewalls and valleys is part of a replacement rather than an optional line on it." },
        ...commonFaq(),
      ],
    },

    // ── /roofing/repair/ ─────────────────────────────────────────────────────────────────────
    repair: {
      label: "Roof Repair",
      marketService: "roofing/roof-repair",
      title: "Roof Repair & Leak Repair | Coldstream Exteriors",
      description: "Leak tracing, flashing and storm repairs by trained crews. We find where the water is actually getting in, and say so when a repair is not the honest answer.",
      h1: "Roof repair, traced to where the water gets in",
      lead: "Most roofs we are called to look at do not need replacing. They need one detail fixed properly.",
      intro: "Water does not drop straight down. It runs along decking and rafters and finds the first low point, which is why the stain on a ceiling is rarely underneath the hole that caused it. A repair that starts by patching above the stain fixes nothing and costs the same as one that starts by tracing the water. Almost every leak we find begins at a junction — flashing at a chimney or sidewall, an unlined valley, a plumbing stack boot gone brittle — rather than in the open field of the roof.",
      sections: [
        { title: "Leak tracing first", body: "We find the entry point rather than patching the ceiling below it and hoping. That means following the path the water is taking, not the shortest line to the damage." },
        { title: "Flashing and penetrations", body: "Chimneys, sidewalls, skylights and stack boots. Old flashing that has been caulked over instead of replaced is the single most common repair we do." },
        { title: "Storm and emergency work", body: "Wind-lifted shingles, hail bruising, impact damage from a branch. If the roof is open to the weather we get it covered first and quote the repair second." },
        { title: "When we say replace instead", body: "If a repair only buys a season on a roof at the end of its life, we will tell you. It is a shorter conversation than the one after the second repair." },
      ],
      depth: {
        eyebrow: "About the work",
        heading: "Why the leak is almost never where the stain is",
        intro: "A repair is diagnosis first and materials second. Getting the diagnosis wrong is how a roof gets repaired three times for one fault.",
        blocks: [
          { h: "Water travels before it drops",
            p: ["Water entering at a chimney can run down a rafter for several feet before it meets a nail, a seam or a light fitting and finally comes through the ceiling. The visible damage marks where it ran out of roof, not where it got in.",
                "So we work from the inside out and the outside in: where the staining is, where the framing runs, and what is directly uphill of it on the roof. Patching the deck above a stain is the repair that gets redone."] },
          { h: "Boots, valleys and sidewalls",
            p: ["Rubber plumbing-stack boots harden and split, usually well before the shingles around them are worn. They cost very little to replace, they are a common cause of a ceiling stain in an otherwise sound roof, and they are easy to miss from the ground.",
                "Valleys and sidewalls are the other two. A valley that was never properly lined, or a sidewall where the step flashing was replaced with a bead of sealant, will leak in wind-driven rain and stay dry in a downpour — which is exactly the intermittent leak that is hardest to pin down."] },
          { h: "Storm damage is not always visible",
            p: ["Hail can take the granule layer off a shingle without cracking it. The roof looks intact from the driveway while its remaining life has been cut short, and the failure arrives a year or two later as a leak nobody connects to the storm.",
                "Wind damage is similar: a shingle can be lifted and reseated by the next warm day with the seal strip broken underneath. It looks fine and it is no longer sealed. Both are worth documenting when they happen rather than when they leak."] },
          { h: "When a repair is the wrong answer",
            p: ["A repair is right when the covering has life left and a specific detail has failed. It is the wrong answer when shingles are brittle across the whole roof, when granule loss is general rather than local, or when the same roof has already been repaired twice.",
                "We would rather tell you that at the inspection than take the repair and have the conversation again next spring. Where it is genuinely borderline we will say that too, with what each option realistically buys you."] },
        ],
      },
      process: [
        { title: "Call and free inspection", body: "Active leaks get looked at first. If the roof is open to the weather, covering it comes before anything else." },
        { title: "Trace and document", body: "We find the entry point, photograph it, and show you what we found rather than describing it." },
        { title: "Written quote", body: "The repair, in writing, with an honest note on how much life it buys the roof." },
        { title: "Repair and check", body: "Our own crew, and a check of the surrounding details while we are up there rather than a return visit for the next one." },
      ],
      faq: [
        { q: "How fast can you get out for a leak?", a: "Active leaks are prioritised, and if the roof is open to the weather we cover it before we do anything else. Call your nearest office and say it is leaking." },
        { q: "Is a repair worth it on an older roof?", a: "Sometimes. If the decking is sound and the failure is a detail, yes. If the shingles are brittle across the whole roof, a repair is only postponing the real decision." },
        { q: "Can you match my existing shingles?", a: "Often closely, rarely perfectly. Colours are discontinued and the roof around them has weathered. We will tell you how visible a patch is likely to be before we do it." },
        { q: "Do you charge for the inspection?", a: "No. The inspection and the written quote are free, whether the answer is a repair, a replacement or that nothing needs doing yet." },
        ...commonFaq(),
      ],
    },
  },

  siding: {
    // ── /siding/vinyl-siding/ ────────────────────────────────────────────────────────────────
    "vinyl-siding": {
      label: "Vinyl Siding",
      marketService: "siding/vinyl-siding",
      title: "Vinyl Siding Installation | Coldstream Exteriors",
      description: "Vinyl siding installed so it can move, over a water barrier that was actually inspected.",
      h1: "Vinyl siding, installed so it can move",
      lead: "Installed so it can move, over a wall somebody actually looked at.",
      intro: "Vinyl has a reputation it mostly does not deserve. Nearly every vinyl complaint we are called to look at is an installation fault rather than a material one: panels nailed tight so they cannot expand, no room left at the ends of a run, or a water barrier behind them that was never taped. Fitted properly, over a wall somebody inspected, vinyl gives decades of service for less money than anything else on the wall. Fitted badly, it buckles in its first hot summer and nothing will straighten it afterwards.",
      sections: [
        { title: "Hung loose, not pinned", body: "Nailed to allow movement, with the fastener centred in the slot and left slightly proud. Room left at the end of every run. This single detail is most of the difference between vinyl that lasts and vinyl that waves." },
        { title: "What goes behind it", body: "House wrap lapped and taped, and flashing at every window, door and transition. The siding is the rain screen; the barrier behind it is what actually keeps the wall dry." },
        { title: "Insulated panels", body: "Foam-backed panels are stiffer and sit flatter on the wall, and they add a modest amount of insulation. Worth it on some elevations and not all — we will say which." },
        { title: "Repairs and partial replacement", body: "Storm damage and cracked panels can often be swapped rather than re-siding a whole elevation, when the profile is still available." },
      ],
      depth: {
        eyebrow: "About the material",
        heading: "What decides whether vinyl looks right in ten years",
        intro: "Vinyl earns its place on price and it is less forgiving of a bad installation than almost anything else on a house. Four things decide how it ages.",
        blocks: [
          { h: "It has to hang, not be pinned",
            p: ["A vinyl panel expands and contracts along its length with temperature — measurably, every day. It is designed to hang on the nail rather than be clamped by it, so the fastener sits slightly proud and the panel slides behind the head.",
                "Nail it home and the panel has nowhere to go. It buckles in the first hot week and stays buckled, because the distortion is permanent. Wavy vinyl on a wall is almost never a bad product; it is a crew that drove the nails tight."] },
          { h: "The wall behind it does the work",
            p: ["Vinyl is a rain screen, not a seal. Water is expected to get behind it and expected to drain back out, which makes the weather-resistant barrier, the flashing and the condition of the sheathing more important than which panel you chose.",
                "It is also why we take the old siding off instead of going over it. Going over hides whatever is rotting underneath and creates a second cavity for water to sit in, and it makes the next repair worse than it needed to be."] },
          { h: "Insulated vinyl, and when it is worth buying",
            p: ["Insulated panels have foam bonded to the back. They are noticeably more rigid, which makes the wall look flatter and sound less hollow, and they resist denting better than hollow-back panels.",
                "The honest version: buy it for the rigidity and the flatness. The added insulation is real but modest, and if somebody is selling insulated vinyl mainly on what it will do to your heating bill, ask them to put the figure in writing."] },
          { h: "Colour, fade and the matching problem",
            p: ["Darker colours absorb more heat and shift sooner, and a south or west elevation ages ahead of the rest of the house regardless of colour. Modern formulations hold far better than they used to, but the sunny wall still shows age first.",
                "Matching matters later rather than now. Profiles and colours get discontinued, so a partial repair on a wall that is ten years old often cannot be matched exactly. We will tell you when a patch is going to be visible instead of fitting it and letting you notice."] },
        ],
      },
      process: [
        { title: "Free inspection", body: "We look at how the existing course was fitted and check the wall for rot and moisture — usually where the trouble started." },
        { title: "Product and colour", body: "Profile and colour held against your roof and trim in daylight rather than picked from a chart." },
        { title: "Removal and repair", body: "The old siding comes off, the sheathing and barrier get inspected, and anything soft is replaced before new panels go on." },
        { title: "Installation and finish", body: "Course, trim, soffit and fascia, with the site cleared at the end of each day rather than the end of the job." },
      ],
      faq: [
        { q: "How long does vinyl siding last?", a: "Decades, when it is installed with room to move and there is a sound water barrier behind it. The installation matters more than the brand." },
        { q: "Will it fade?", a: "Modern vinyl holds colour far better than it once did, and darker colours hold it least well. We will tell you which of your choices is most likely to shift." },
        { q: "Can you match my existing siding?", a: "Sometimes. Profiles and colours get discontinued, so an exact match on an older house is not always possible — we check before promising it." },
        { q: "Vinyl or fiber cement?", a: "Vinyl costs less and is perfectly good installed well. Fiber cement costs more, lasts longer, holds colour better and takes an impact without cracking. We quote both." },
        ...commonFaq(),
      ],
    },

    // ── /siding/james-hardie-siding/ ─────────────────────────────────────────────────────────
    "james-hardie-siding": {
      label: "James Hardie Siding",
      marketService: "siding/james-hardie-siding",
      title: "James Hardie Fiber Cement Siding | Coldstream Exteriors",
      description: "James Hardie fiber cement siding installed to the clearances the warranty depends on. Holds colour, takes a knock, and does not soften in heat.",
      h1: "James Hardie fiber cement siding",
      lead: "The material we recommend most often — it holds its colour, it takes a knock, and it does not soften in the heat.",
      intro: "Fiber cement is cement, sand and cellulose, and it behaves nothing like vinyl on the wall or in the hands of the crew fitting it. It holds paint far longer, it does not crack when something hits it, and it stays dimensionally stable across a temperature range that pulls other materials in and out all year. It costs more up front than vinyl and it is less forgiving to install, which is the whole of the trade-off and the reason the installation details below matter more than the brochure.",
      sections: [
        { title: "Why fiber cement", body: "It holds colour, stands up to impact, does not soften in heat, and gives insects nothing to eat. It costs more than vinyl up front and lasts longer." },
        { title: "ColorPlus or site-painted", body: "Factory-applied finishes arrive consistent and hold longest. Site painting gives you any colour you like. We quote both and say which we would choose." },
        { title: "Installation is the whole thing", body: "Fastener spacing, clearance at grade and the roofline, and the detail at butt joints are what the warranty actually rests on. Done wrong, the material is not the problem." },
        { title: "Trim and detailing", body: "Matching trim at corners and openings so the whole elevation moves together and the joins stay tight." },
      ],
      depth: {
        eyebrow: "About the material",
        heading: "Fiber cement is a different job, not a different colour",
        intro: "Everything that makes fiber cement worth buying also makes it unlike vinyl to fit. These are the four things that decide whether it performs the way it should.",
        blocks: [
          { h: "It is heavy, and that changes the crew",
            p: ["A fiber cement plank weighs several times what a vinyl panel does. It needs more hands, different fastening and a substrate that can carry it, and it does not forgive being hung on a wall nobody checked first.",
                "It is cut rather than snapped. Cutting it releases silica dust, so it is cut with the right blade and the right dust control — a working practice rather than a preference, and one worth asking any contractor about."] },
          { h: "Clearances are where installations fail",
            p: ["Fiber cement has specified gaps: above the roof line, above decking and other horizontal surfaces, and at grade. Those clearances exist because the board will wick water if it sits in it, and wicked water in a climate that crosses freezing splits the board from the inside out.",
                "It is the single most common fault we find on fiber cement somebody else fitted. The board is fine. It was installed tight to a roof and has been drinking for three winters."] },
          { h: "ColorPlus or site-painted",
            p: ["A factory finish is baked on, arrives consistent across every plank, and holds longest. Site-painted means primed board finished on the wall: it costs less, it lets you pick any colour at all, and the finish is only ever as good as the conditions on the day it went on.",
                "Neither is wrong. Factory finish for longevity and consistency, site paint for colour freedom or for matching something that already exists. We will quote either and tell you which we would put on our own house."] },
          { h: "What you are actually buying",
            p: ["Dimensional stability. Fiber cement does not soften in summer heat or grow brittle in a hard freeze, and it does not move enough to open its own joints. In a climate that swings hard in both directions, that is worth more than it sounds on paper.",
                "The trade-off stated plainly: it costs more than vinyl, it is heavier and slower to work with, and a bad installation is more expensive to put right. It is the better material and it is the less forgiving one."] },
        ],
      },
      process: [
        { title: "Free inspection", body: "We check the wall, the substrate and how the existing course was fitted before quoting anything." },
        { title: "Finish and colour", body: "ColorPlus or site-painted, with samples held against your roof and trim in daylight." },
        { title: "Removal and repair", body: "The old siding comes off and the sheathing is inspected. Fiber cement is heavy, so what it hangs on gets checked properly." },
        { title: "Installation and finish", body: "Fastening, clearances and trim to specification, with the site cleared at the end of each day." },
      ],
      faq: [
        { q: "Hardie or vinyl?", a: "Hardie costs more up front, lasts longer, holds colour better and takes an impact without cracking. Vinyl costs less and is perfectly good when installed well. We quote both and let you decide." },
        { q: "Does it need painting?", a: "Eventually, but far less often than wood and much less often than most people expect. A factory-applied finish goes longest." },
        { q: "Why does the installation matter so much?", a: "Because the warranty rests on it. Fastener spacing, butt-joint detail and the specified clearances at grade and roofline are what keep water out of the board, and they are exactly what gets skipped on a fast job." },
        { q: "Is it worth the extra over vinyl?", a: "On most houses we think so, for the colour retention and the impact resistance. On a rental or a short hold, vinyl fitted well is a sound decision and we will say so." },
        ...commonFaq(),
      ],
    },

    // ── /siding/stone-veneer/ ────────────────────────────────────────────────────────────────
    //
    // ⚠ SEE THE FILE HEADER. Stone veneer is in no live-copy page and in no market's services
    // array. This page describes the work accurately and deliberately claims no certification, no
    // job count and no market coverage, because none of those has a source yet.
    "stone-veneer": {
      label: "Stone Veneer",
      marketService: "siding",
      marketNote: "Stone veneer is quoted from each of our offices alongside the rest of the exterior — start at your market's siding page and ask for it by name.",
      title: "Stone Veneer Installation | Coldstream Exteriors",
      description: "Manufactured stone veneer installed over a proper drainage plane, with the clearances and weep detail that keep water moving out of the wall.",
      h1: "Stone veneer, installed as a drained wall",
      lead: "The accent that changes an elevation more than any other — and the one where what goes behind it matters most.",
      intro: "Stone veneer is a thin facing rather than a structural wall. Manufactured veneer is a cement-based product cast and coloured to look like quarried stone, at a fraction of the weight, which is what lets it go onto an ordinary framed wall without a footing under it. That lightness is the reason it is affordable and also the reason it is unforgiving: a facing this thin has no capacity to store water and get rid of it later, so the assembly behind it has to move water out. Nearly every stone veneer failure we see is a drainage failure, not a stone failure.",
      sections: [
        { title: "The drainage plane behind it", body: "A water-resistant barrier, lath and a scratch coat go on before any stone does. Water gets behind adhered veneer by design and has to have a path back out — that path is the whole assembly." },
        { title: "Clearances and the weep detail", body: "Veneer is held clear of grade, paving and roof surfaces, with a weep screed at the bottom so water leaves the wall. Stone taken down to the dirt is the fault we find most often." },
        { title: "Where it earns its place", body: "Wainscot below a window line, columns and porch piers, a chimney chase, or a single gable. Used as an accent against siding it does more for an elevation than covering the whole thing in it." },
        { title: "Full-height and mixed elevations", body: "Full walls work, and they need the transitions thought through — where the stone stops, how it terminates, and how the siding above sheds onto it." },
      ],
      depth: {
        eyebrow: "About the material",
        heading: "Stone veneer is a drainage detail with stone on the front",
        intro: "Manufactured stone is a durable material that almost never fails on its own. What fails is the wall behind it, and every one of those failures was decided before the first stone went up.",
        blocks: [
          { h: "Adhered veneer is a facing, not a wall",
            p: ["Manufactured stone veneer is cast from cement and lightweight aggregate, coloured through the body, and bonded to the wall through lath and mortar rather than stacked on a foundation. Nothing above it rests on it, and it carries no structural load.",
                "That is a genuine advantage: it goes onto a normal framed wall without the footing and wall ties that full-thickness masonry needs. It also means the bond and the substrate are doing all the work, so preparation is not a stage that can be shortened."] },
          { h: "It gets wet behind, and that is normal",
            p: ["Mortar and cast stone both absorb water. Wind-driven rain reaches the back of the veneer, and the assembly is designed on the assumption that it will. The job of what sits behind the stone is to catch that water and drain it back out at the bottom.",
                "That means a continuous water-resistant barrier over the sheathing, lath fastened through into the framing, and a scratch coat for the stone to bond to. Stone applied straight onto sheathing, or onto a barrier with no way to drain, traps water against the wall. It looks identical on the day it is finished."] },
          { h: "Clearances are not optional trim",
            p: ["Veneer is held up off the ground, off paving and off roof surfaces, and a weep screed at the base gives water somewhere to leave. The gap looks like an unfinished edge to anyone who has not seen a wall opened up.",
                "Stone run down into soil or mulch wicks ground moisture upward continuously and freezes in it every winter. It is the most common reason we are asked to look at spalling stone and a damp interior wall, and it cannot be fixed from the outside without taking the bottom courses off."] },
          { h: "Choosing it, and where to use it",
            p: ["Manufactured veneer is lighter, cheaper and easier to fit than natural stone, and the good ranges are convincing at the distance anyone actually stands. Natural thin stone costs more, weighs more and reads differently up close on a porch or an entry where people are within arm's length.",
                "As for how much: stone tends to look most convincing where a real stone wall would plausibly have been — a base, a pier, a chimney — rather than applied evenly across a whole elevation. We will lay it out against your roof and trim colours before anything is ordered."] },
        ],
      },
      process: [
        { title: "Free inspection", body: "We look at the wall, the sheathing and how the existing exterior drains before quoting stone onto it." },
        { title: "Layout and product", body: "Style, colour range and where the stone stops, held against your roof and trim rather than chosen from a chart." },
        { title: "Barrier, lath and scratch coat", body: "The drainage plane goes on first, with the weep detail and clearances set before any stone is placed." },
        { title: "Setting and pointing", body: "Stone set, joints pointed to the profile you chose, and the site cleared at the end of each day." },
      ],
      faq: [
        { q: "Is manufactured stone as good as natural stone?", a: "For durability on a wall, it performs well and it weighs far less, which is what lets it go on without a footing. Natural thin stone reads better at close range and costs more. Both depend entirely on the drainage detail behind them." },
        { q: "Does it need a foundation?", a: "Adhered veneer is light enough to be carried by a normal framed wall, which is the point of it. Full-thickness masonry is a different job and does need support under it." },
        { q: "Why is there a gap at the bottom?", a: "That is the clearance and the weep detail, and it is deliberate. Water that gets behind the stone leaves there. Stone taken down into the soil has no exit and wicks ground moisture upward instead." },
        { q: "Can it go over my existing siding?", a: "No. The siding comes off and the drainage plane is built on the sheathing. Stone applied over an existing wall covering has nothing sound to bond to and no drainage path." },
        { q: "Can you match stone that is already on the house?", a: "Sometimes closely. Ranges are discontinued and existing stone has weathered, so we check what is available and tell you honestly how close it will look before you commit." },
        ...commonFaq(),
      ],
    },
  },
};

/** [{ hub, sub }] for every national sub-service page. Drives getStaticPaths. */
export const nationalSubservicePaths = () =>
  Object.entries(NATIONAL_SUBSERVICES).flatMap(([hub, subs]) =>
    Object.keys(subs).map((sub) => ({ hub, sub })));
