// SUB-SERVICE PAGES — the six nested pages the Page System keeps under the roofing and siding hubs.
//
//   /{market}/roofing/roof-replacement/       /{market}/siding/siding-replacement/
//   /{market}/roofing/roof-repair/            /{market}/siding/james-hardie-siding/
//   /{market}/roofing/insurance-storm-damage/ /{market}/siding/vinyl-siding/
//
// BUILD ORDER (round 6) LIFTED THE GATE. These are built for every market whether or not sourced
// job proof exists. What that changes is where the copy comes from, not whether it is real: the
// substance below is ported from the live coldstreamexteriors.com pages that fold into each of
// these URLs — the services described, the process, the materials, the timelines — and rewritten
// rather than copied. Contractors Cloud job records upgrade these pages later; they do not gate
// them now.
//
// COMPLIANCE IS UNCHANGED AND STILL BINDING. The live site says "guarantee" four times, prints a
// BBB rating, a review count, a years-in-business figure and a dollar price range. None of that
// is portable: "guarantee" is banned outright, and the rest are unsourced claims gated in
// claims.js. What ports is the information a homeowner actually needs.
//
// LOCALISATION IS REAL, NOT A FIND-AND-REPLACE. Each market has its own building stock, its own
// weather pattern and its own permit picture, and every sub-service draws on them differently —
// a roof-repair page cares about what fails here, a Hardie page cares about what the climate does
// to a painted surface. Copy that would read identically with the city name swapped is the exact
// failure the consolidation removed 100+ pages to fix.

/**
 * What is actually different about working in each market. One place, so a sub-service page can
 * draw the part it needs instead of every page repeating the same paragraph.
 */
export const MARKET_CONTEXT = {
  cincinnati: {
    stock: "The east side runs to post-war ranches and split-levels through Blue Ash, Kenwood and Madeira, with a lot of 1920s and 1930s brick further in around Pleasant Ridge and Silverton. Mason, Landen and West Chester are mostly newer two-stories on bigger footprints.",
    weather: "Hail and straight-line wind come through in spring and early summer. The bigger long-term problem is freeze-thaw: north-facing slopes hold snow and ice for weeks, and ice dams at the eaves back water up under the shingles.",
    trees: "Clermont County and the river townships carry heavy tree cover, which decides more gutter and moss questions here than anywhere else we work.",
    permits: "Permits vary by municipality across Hamilton, Clermont, Butler and Warren counties, and Northern Kentucky is a separate process again. We pull them.",
    stormLine: "spring and early-summer hail, straight-line wind, and winter ice damming on north slopes",
  },
  columbus: {
    stock: "Dublin, Hilliard, New Albany and Lewis Center are largely 1990s and 2000s subdivisions — steeper pitches, more valleys, more roof for the same square footage. Clintonville, German Village and Bexley are much older, with steep slate-era pitches and historic-district rules that change what can go back on.",
    weather: "Central Ohio takes a run of hail most springs, and the flat ground gives wind a clear path across new subdivisions where there is little mature tree cover to break it up.",
    trees: "Tree cover is patchy — heavy in Clintonville and Worthington, almost absent in the newer rings, which changes the gutter-guard answer street by street.",
    permits: "Columbus and each suburb permit separately, and the historic districts add a review step. We handle both.",
    stormLine: "spring hail runs and open-ground wind across the newer subdivisions",
  },
  "st-louis": {
    stock: "South County is mid-century ranches through Affton, Mehlville and Oakville — simple pitches, long runs. The city neighborhoods around Tower Grove and The Hill are brick with parapet walls and low-slope rear additions, which is a different roof entirely. West County runs to larger, newer homes with complex rooflines.",
    weather: "Straight-line wind and hail come through most summers, and the temperature swing between seasons is wide enough to work materials hard — expansion and contraction opens seams and fasteners over time.",
    trees: "Mature oaks across South County and the inner ring drop enough through autumn to decide the gutter-guard conversation for most of these houses.",
    permits: "St. Louis County and the municipalities permit separately, and Jefferson County is different again. We pull them.",
    stormLine: "summer straight-line wind and hail, and a wide seasonal temperature swing that works seams and fasteners",
  },
};

/** Approved-claim-safe closing FAQ every sub-service carries, localised. */
const commonFaq = (m) => [
  { q: "Is the inspection really free?", a: "Yes. The inspection and the written quote are free and carry no obligation, and nobody will lean on you afterwards." },
  { q: `Do you cover my part of ${m.name}?`, a: `We work across ${m.region} from our ${m.office.city} office. If you are not sure whether your street is in, call ${m.phone} and ask — it takes a minute.` },
];

export const SUBSERVICES = {
  roofing: {
    "roof-replacement": {
      label: "Roof Replacement",
      // ── SEO TITLE AND DESCRIPTION, WRITTEN RATHER THAN DERIVED ──────────────────────────────
      // Derived from `h1` and `lead` before, which broke two ways at once: h1 is a sentence and
      // ran the title past 60 characters where Google truncates it, and `lead` carries no city, so
      // all three markets shipped the SAME meta description — the one signal that most directly
      // tells a crawler two pages are the same page. `cityState` puts the state code in, which is
      // what a local search actually matches on.
      seo: {
        title: (m) => `Roof Replacement in ${m.cityState}`,
        description: (m, c) => `Full tear-off roof replacement across ${m.region}. Decking checked, ventilation balanced, and industry-leading warranties. Free inspection.`,
      },
      h1: (m) => `Roof Replacement in ${m.name}`,
      lead: (m) => `Full tear-off and replacement across ${m.region}, priced after someone has walked your roof — not from a satellite image.`,
      intro: (m, c) =>
        `A replacement starts with the decking, not the shingles. We strip the roof to the boards, replace anything soft, and only then talk about what goes back on. ${c.stock} That mix is why we quote after walking the roof: two houses on the same street can need very different work once the old layers come off.`,
      sections: [
        { title: "Tear-off, not an overlay", body: "Laying new shingles over old hides the decking and traps heat, which shortens the life of what you just paid for. We take it back to the boards so we can see what we are working with." },
        { title: "Decking and ventilation", body: "Soft decking gets replaced before anything goes over it. Intake and exhaust ventilation get sized while the roof is open — it is the easiest moment to fix airflow and the most expensive one to skip." },
        // Market fact (owner brief 2026-08-27): St. Louis is shingle and low-slope only — metal
        // must not appear as an offering on any St. Louis page. A body may be a function of the
        // market; the template resolves it.
        { title: "Materials", body: (m) => m.slug === "st-louis"
            ? "Architectural asphalt shingles for most homes, impact-resistant where hail is a recurring problem, and a low-slope system where the roof calls for it. We quote what the roof needs."
            : "Architectural asphalt shingles for most homes, impact-resistant where hail is a recurring problem, and metal or a low-slope system where the roof calls for it. We quote what the roof needs." },
        { title: "The finish", body: "New underlayment, ice-and-water membrane at the eaves and valleys, new flashing at every penetration. Old flashing caulked back into place is the most common leak we get called out to." },
      ],
      faq: (m, c) => [
        { q: "How long does a replacement take?", a: "A simple ranch is usually a single day. A larger two-story with a complex roofline runs two to three. Weather moves the schedule and we tell you when it does." },
        { q: "Do I need a full replacement or a repair?", a: "The free inspection answers it. Age, the state of the decking and how widespread the damage is decide it, and we will say when a repair is the honest answer." },
        { q: `What does the ${m.name} weather do to a roof?`, a: c.weather },
        ...commonFaq(m),
      ],
      // ── PER-MARKET DEPTH (2026-08-21) ────────────────────────────────────────────────────────
      // NOT the shared shape vinyl and Hardie use. The material and process argument for a
      // replacement now lives on /roofing/replacement/, so repeating it here would leave the market
      // page saying nothing only it could say. This is the job as THIS climate and THIS building
      // stock demand it — swap a city name between these three and the sentences become false,
      // which is the test the old site failed. See depthFor() for the two shapes.
      depth: {
        cincinnati: {
          eyebrow: "Replacing a roof here",
          heading: "What a river-valley roof asks of a replacement",
          intro: "Freeze-thaw and hillside drainage decide more about a Cincinnati replacement than the shingle on the quote does. These are the four things we price differently here.",
          blocks: [
            { h: "Membrane goes further up the north slopes",
              p: ["A north-facing slope in the valley holds snow for days after a south slope has cleared, and the cycle of thawing by afternoon and freezing again overnight drives meltwater back up under the courses. The code minimum for ice-and-water membrane is a floor, not a specification written for this.",
                  "On north slopes, shallow pitches and every valley we run it further than the minimum. It is a modest line on the quote and it is the difference between a roof that leaks in February and one that does not."] },
            { h: "Hillside roofs move water sideways before they move it down",
              p: ["Split-levels and cross-gables on the hillsides throw long valleys that carry the runoff of two planes into one channel. That is where the volume is, and it is where a woven valley on a steep run eventually gives way.",
                  "We line those in metal rather than weaving them, and we look at where the water actually lands — a valley discharging onto a lower roof or past the end of a gutter is a drainage problem the covering cannot fix on its own."] },
            { h: "Pre-war chimneys need cut flashing, not sealant",
              p: ["The older brick stock through the city neighborhoods carries chimneys that were flashed once and sealed repeatedly since. Sealant on brick is a maintenance material with a life measured in a few years, and for every one of those years it looked fine from the ground.",
                  "A replacement is the moment to cut fresh counterflashing into the mortar joint and step the base flashing properly. If the mortar itself is spent, we say so before the roof goes on rather than after."] },
            { h: "What the east-side ranches have under the shingles",
              p: ["The post-war ranches and split-levels through Blue Ash, Kenwood and Madeira often carry plank decking rather than plywood — boards with gaps between them, which hold a nail differently and are not always sound at the eaves after decades of freeze-thaw.",
                  "Nobody knows which until the old covering is off. That is why the quote says what happens if boards need replacing, rather than leaving it as a conversation in the middle of the job."] },
          ],
        },
        columbus: {
          eyebrow: "Replacing a roof here",
          heading: "Open ground, one build era, and what that changes",
          intro: "Central Ohio's wind and the age of its suburban ring decide more about a replacement here than the shingle does. Four things we handle differently.",
          blocks: [
            { h: "Wind resistance is a nailing pattern, not a product",
              p: ["A shingle's wind rating assumes it was fastened the way the manufacturer specifies: the right number of nails, placed in the nailing strip, driven flush. High nails and four-nail patterns are quicker, and they are why shingles lift on the first serious gust across open ground.",
                  "We fasten to the specification the rating depends on, and take it up a step on exposed elevations. It costs a little labor and nothing in material."] },
            { h: "A whole subdivision reaches the end at once",
              p: ["Dublin, Hilliard, New Albany and Lewis Center went up in runs, so the builder-grade covering on a whole street is the same age within a season or two. When one roof starts failing, the neighbours usually are as well.",
                  "That is worth knowing for scheduling rather than as pressure: it is a reason to book before the first hail run of the spring, when every crew in the county is already committed."] },
            { h: "Shallow pitches are a different assembly",
              p: ["The porches, bump-outs and rear additions on newer builds are frequently much shallower than the main roof. Below a certain pitch a shingle is the wrong covering — water does not shed fast enough and wind drives it back up the laps.",
                  "Those sections get a low-slope system rather than the same shingle carried around the corner, and the quote separates them so you can see which is which."] },
            { h: "Ridge vent on an exposed ridge",
              p: ["A ridge running across flat, open ground takes wind-driven rain and snow at an angle a sheltered ridge never sees. An unbaffled vent on that ridge lets weather in, and it shows up later as attic staining nobody connects back to the vent.",
                  "Baffled vent, with intake at the eaves sized to match it. Exhaust without intake pulls its air from the house instead, which is how a new roof still cooks a deck."] },
          ],
        },
        "st-louis": {
          eyebrow: "Replacing a roof here",
          heading: "Hail, brick, and a wide seasonal swing",
          intro: "Hail drives most of the replacement conversations in St. Louis, and the brick stock changes how the roof meets everything around it. Four things we price differently.",
          blocks: [
            { h: "Impact-resistant is a real decision, not an upsell",
              p: ["Where hail comes through most summers, an impact-rated shingle is worth weighing on its own terms: it resists the bruising that strips the granule layer and shortens a roof's life without ever making it leak.",
                  "It costs more up front and it is not armour — a large enough stone will still mark it. Some carriers reduce a premium for one, which is worth asking yours about before you choose rather than after."] },
            { h: "Brick changes where the roof ends",
              p: ["The city and inner-ring stock is brick, and brick means chimneys, parapets and party walls rather than a simple gable end. Each is a junction properly flashed and cut into the mortar, and each is a place a roof leaks when it was sealed instead of flashed.",
                  "Where the tuckpointing is spent, new flashing into failing mortar buys less time than it should. We would rather tell you that before the roof goes on."] },
            { h: "The seasonal swing works fasteners and seams",
              p: ["The spread between a St. Louis summer and a St. Louis winter is wide enough to move a roof through a real range every year. Fasteners back out, laps work against each other, and details that were adequate on the day slowly stop being.",
                  "It is an argument for fastening to specification, and for details that do not depend on a bead of sealant staying flexible for twenty years."] },
            { h: "Low-slope sections on the older stock",
              p: ["Rear additions, porch roofs and dormer tops on the city stock are frequently close to flat while attached to a steep main roof. They are a different assembly and they fail first when they are shingled as though they were not.",
                  "Those get their own system and their own line on the quote. The mid-century ranches through Affton, Mehlville and Oakville are simpler — long runs, one pitch — and price accordingly."] },
          ],
        },
      },
    },

    "roof-repair": {
      label: "Roof Repair",
      // ── SEO TITLE AND DESCRIPTION, WRITTEN RATHER THAN DERIVED ──────────────────────────────
      // Derived from `h1` and `lead` before, which broke two ways at once: h1 is a sentence and
      // ran the title past 60 characters where Google truncates it, and `lead` carries no city, so
      // all three markets shipped the SAME meta description — the one signal that most directly
      // tells a crawler two pages are the same page. `cityState` puts the state code in, which is
      // what a local search actually matches on.
      seo: {
        title: (m) => `Roof Repair in ${m.cityState}`,
        description: (m, c) => `Leak tracing, flashing and storm repairs across ${m.region}. We find where the water is actually getting in. Free inspection — call ${m.phone}.`,
      },
      h1: (m) => `Roof Repair in ${m.name}`,
      lead: (m) => `Leaks, storm damage and emergency call-outs across ${m.region} — one repair conversation instead of five separate ones.`,
      intro: (m, c) =>
        `Most roofs we are called to do not need replacing. They need one detail fixed properly. Flashing at a chimney or a sidewall, a valley that was never lined, boots on the plumbing stacks that have gone brittle — those are the leaks, far more often than the field of the roof. ${c.trees} We trace the water to where it is actually getting in, which is rarely directly above the stain on your ceiling.`,
      sections: [
        { title: "Leak tracing", body: "Water travels along decking and rafters before it drops. We find the entry point rather than patching the ceiling below it and hoping." },
        { title: "Flashing and penetrations", body: "Chimneys, sidewalls, skylights and stack boots. Old flashing that has been caulked over instead of replaced is the single most common repair we do." },
        { title: "Storm and emergency", body: "Wind-lifted shingles, hail bruising and impact damage. If it is open to the weather we get it covered first and quote the repair second." },
        { title: "When we say replace instead", body: "If a repair only buys a season on a roof that is at the end of its life, we will tell you that. It is a shorter conversation than the one after the second repair." },
      ],
      faq: (m, c) => [
        { q: "How fast can you get out for a leak?", a: `Call ${m.phone}. Active leaks get looked at first, and if it is open to the weather we cover it before we do anything else.` },
        { q: "Is a repair worth it on an older roof?", a: "Sometimes, and sometimes not. If the decking is sound and the failure is a detail, a repair is the right answer. If the shingles are brittle across the whole roof, a repair is only postponing the real decision." },
        { q: `What fails first on roofs around ${m.name}?`, a: c.weather },
        ...commonFaq(m),
      ],
      // PER-MARKET. /roofing/repair/ carries how water travels and which details fail; this is
      // what gets called in around each metro and why. See depthFor().
      depth: {
        cincinnati: {
          eyebrow: "Repairs we get called to here",
          heading: "What actually gets called in around the valley",
          intro: "The repair list in Cincinnati is shaped by three things: winter, tree cover, and a lot of houses with more than one roof plane meeting at a valley.",
          blocks: [
            { h: "Ice damming is not a roof fault, and repairing the roof will not stop it",
              p: ["A dam forms when heat escaping into the attic melts snow on the upper slope, the meltwater runs down to a cold eave and refreezes there. The ridge of ice then holds the next melt against the roof until it finds a way under the courses. The covering is doing what it was designed to do.",
                  "So the fix is intake and exhaust ventilation and the insulation line, not another layer of sealant at the gutter. We will say that even though it is the less convenient answer, because replacing shingles under a dam buys you one winter."] },
            { h: "Shaded slopes wear differently",
              p: ["Clermont County and the river townships carry heavy tree cover, and a slope that stays damp under it holds moss and debris that a sunny slope sheds. Granule loss runs ahead of the rest of the roof there, and the valley below fills faster than anyone expects.",
                  "Half of what looks like a failing roof on those houses is a shaded plane and a blocked valley. Clearing and relining one valley is a different conversation from replacing a roof, and we will tell you which one you are in."] },
            { h: "The leak that only appears in a thaw",
              p: ["A detail sealed rather than flashed will hold through a rainstorm and fail during a thaw, because meltwater arrives slowly, from above, and sits. That is why a leak somebody has already had looked at twice can still be genuinely hard to reproduce in summer.",
                  "When a leak is seasonal we look at the details that only see water under those conditions — the chimney cricket, the sidewall step flashing, the low end of a valley — rather than at the field of the roof."] },
            { h: "When relining one valley is the right answer",
              p: ["A hillside house with cross-gables concentrates the runoff of several planes into a small number of valleys, and those valleys wear out well before the slopes either side of them do.",
                  "If the covering has life left, relining the valley in metal is a real repair rather than a stopgap. If the shingles either side are brittle, it is not, and we would rather have that conversation once."] },
          ],
        },
        columbus: {
          eyebrow: "Repairs we get called to here",
          heading: "What open ground and one build era send us out for",
          intro: "Most Columbus repair calls trace back to two things: wind that has nothing to slow it down, and a suburban ring whose roofs are all about the same age.",
          blocks: [
            { h: "The wind damage that looks like nothing",
              p: ["A gust can lift a shingle, break the seal strip underneath and lay it back down. From the ground the roof is untouched. It is also no longer sealed, and the next driven rain goes under it.",
                  "We check by hand along the exposed elevations rather than by eye from the driveway, because a broken seal is something you feel rather than see. Caught early it is a repair; left, it is where the next real leak starts."] },
            { h: "The builder-grade original is the common denominator",
              p: ["Across the newer ring the original covering is the same specification, fitted the same way, at the same time. That makes the failures predictable — the same ridge detail, the same shallow porch, the same fastening pattern turning up street after street.",
                  "It also means a repair is often genuinely worth doing, because the rest of the roof is in known condition rather than a mystery."] },
            { h: "Pipe boots outlive nobody",
              p: ["The rubber collar on a plumbing stack hardens and splits long before the shingles around it are worn, and on a roof between about fifteen and twenty-five years old it is the single most common cause of a ceiling stain we are called to.",
                  "It is a small repair and an easy one to miss from the ground, which is why we look at every penetration when we are up there rather than only the one above the stain."] },
            { h: "Tree cover here is patchy, and that changes the list",
              p: ["Clintonville and Worthington carry mature cover; large parts of the newer rings carry almost none. The same house in the two places has a different maintenance list — debris, moss and blocked valleys in one, and bare exposure to sun and wind in the other.",
                  "It is worth saying because advice that suits one half of this market is wrong for the other half, and the roof will tell you which you have."] },
          ],
        },
        "st-louis": {
          eyebrow: "Repairs we get called to here",
          heading: "Hail you cannot see, brick, and humid attics",
          intro: "St. Louis repair calls cluster around three things: storm damage that leaves no obvious mark, the junctions a brick house creates, and moisture that never came through the roof at all.",
          blocks: [
            { h: "Hail bruising is the repair nobody knows they need",
              p: ["A stone can take the granule layer off a shingle without cracking it. The roof sheds water afterwards exactly as before, so nothing announces itself — and the exposed mat then ages several times faster than the rest of the slope.",
                  "That is why a post-storm inspection is worth having even when the roof looks fine, and why the documentation matters more than the repair on the day."] },
            { h: "Brick makes junctions, and junctions leak",
              p: ["A brick house has chimneys, parapets and shared walls where a frame house has a simple edge. Every one of those is flashing cut into mortar, and every one is a place a previous repair may have reached for sealant instead.",
                  "When the mortar itself has gone, flashing into it will not hold. We would rather point at the tuckpointing than sell you a flashing repair that fails in two winters."] },
            { h: "Not every stain is a leak",
              p: ["Humid summers and an under-ventilated attic will condense moisture on the underside of the deck and drop it onto the insulation below. The staining looks like a roof leak, appears in weather that has nothing to do with rain, and no amount of work on the covering will change it.",
                  "We check the attic before quoting a repair. Telling somebody their roof is fine is a shorter conversation than the one after a repair that fixed nothing."] },
            { h: "The low-slope sections go first",
              p: ["Rear additions, porch roofs and dormer tops on the older city stock sit close to flat against a steep main roof. Water moves slowly across them and sits at the seams, so they reach the end of their life well ahead of the roof they are attached to.",
                  "Those are frequently repairable on their own, and replacing one low-slope section is a far smaller job than the whole roof it adjoins."] },
          ],
        },
      },
    },

    "insurance-storm-damage": {
      label: "Insurance & Storm Damage",
      // ── SEO TITLE AND DESCRIPTION, WRITTEN RATHER THAN DERIVED ──────────────────────────────
      // Derived from `h1` and `lead` before, which broke two ways at once: h1 is a sentence and
      // ran the title past 60 characters where Google truncates it, and `lead` carries no city, so
      // all three markets shipped the SAME meta description — the one signal that most directly
      // tells a crawler two pages are the same page. `cityState` puts the state code in, which is
      // what a local search actually matches on.
      seo: {
        title: (m) => `Storm Damage Repair in ${m.cityState}`,
        description: (m) => `Hail and wind damage across ${m.region}, documented the way an adjuster needs it and repaired start to finish. Free inspection. Call ${m.phone}.`,
      },
      h1: (m) => `Storm Damage and Insurance Claims in ${m.name}`,
      lead: (m) => `Hail and wind damage documented the way an adjuster needs it documented, then handled with them directly.`,
      intro: (m, c) =>
        `Storm damage is often not visible from the ground, and that is the problem with it. Hail bruising takes the granules off a shingle without breaking it, so the roof looks fine from the driveway while its life has been cut short. ${c.weather} We inspect, photograph and document what we find, then deal with your adjuster directly so you are not the one relaying messages between two parties who both do this for a living.`,
      sections: [
        { title: "The inspection and the documentation", body: "Every affected slope photographed, damage marked and measured, and a written scope. This is the part that decides how a claim goes." },
        { title: "Working with your adjuster", body: "We meet them on site where we can, and we speak to them directly afterwards. You should not have to translate between a roofer and an insurance company." },
        { title: "What is usually covered", body: "Sudden storm damage generally is. Age and wear generally are not. We will tell you honestly which one we think you have before you file anything." },
        { title: "Emergency cover first", body: "If the roof is open, protecting the inside of the house comes before the paperwork." },
      ],
      faq: (m, c) => [
        { q: "Should I file a claim?", a: "Not always. If the damage is wear rather than a storm event, a claim will not go anywhere and it goes on your record either way. We will give you our honest read first." },
        { q: "Do you meet the adjuster?", a: "Where we can, yes. It is a much shorter conversation when the roofer and the adjuster are on the roof at the same time." },
        { q: `What kind of storms hit ${m.name}?`, a: `Mostly ${c.stormLine}.` },
        ...commonFaq(m),
      ],
      // PER-MARKET. /storm-damage/ carries the claims argument — documentation, the adjuster, and
      // the four things nobody can promise. This is which storms actually come through each metro,
      // what they damage beyond the roof, and how the local paperwork differs. See depthFor().
      depth: {
        cincinnati: {
          eyebrow: "Storms around the valley",
          heading: "Three seasons of damage, and a state line in the middle of the market",
          intro: "Cincinnati takes its damage in two distinct seasons and across four counties plus Northern Kentucky, which matters more for a claim than most people expect.",
          blocks: [
            { h: "Spring hail, then summer wind",
              p: ["The hail runs come through in spring and early summer and are the events that quietly shorten a roof's life. Straight-line wind arrives with the summer storms and does more visible damage — lifted shingles, branches, gutters pulled off a fascia.",
                  "They are different claims with different evidence. Hail needs the slope-by-slope documentation; wind damage usually announces itself and is worth photographing before anything is tidied up."] },
            { h: "Winter is the third season, and it is not always a claim",
              p: ["Ice damming causes real interior damage here, and it is frequently not a storm event in the sense a policy means. It is heat loss and ventilation acting on a normal winter, which is maintenance rather than a sudden loss.",
                  "We will tell you which one we think you have before you file. A denied claim can still sit on your record, and the underlying problem needs fixing either way."] },
            { h: "Heavy tree cover changes what gets damaged",
              p: ["Clermont County and the river townships carry enough canopy that a wind event brings limbs down as often as it lifts shingles. Impact damage from a branch is a straightforward claim and an obvious one.",
                  "It is also the case that a roof under heavy cover has been ageing faster than its neighbours, which an adjuster will notice. Worth knowing before the conversation rather than during it."] },
            { h: "Four counties and a state line",
              p: ["Hamilton, Clermont, Butler and Warren each permit differently, and Northern Kentucky is a different state with its own rules and its own adjusters. A repair scope that is routine on one side of the river is not automatically routine on the other.",
                  "We work both sides and pull the permits either way. It is one fewer thing to discover halfway through a claim."] },
          ],
        },
        columbus: {
          eyebrow: "Storms across Central Ohio",
          heading: "Open ground, spring hail, and whole streets claiming at once",
          intro: "Central Ohio's damage pattern is shaped by flat ground and by a suburban ring where every roof is the same age — which affects both what happens and how busy everyone is afterwards.",
          blocks: [
            { h: "Wind has a clear run at the newer subdivisions",
              p: ["There is very little between an open field and a subdivision built on it. Wind arrives at the exposed elevations at full strength, and the damage concentrates on the windward slopes and the ridge rather than being spread across the roof.",
                  "That pattern is useful evidence: damage that follows the prevailing direction across a whole elevation reads as a storm event rather than as wear, which is exactly the distinction a claim turns on."] },
            { h: "Spring hail runs, most years",
              p: ["Central Ohio takes a hail run most springs. Not every one of them damages a roof, and the difference between a storm that marked your shingles and one that did not is measurable rather than a matter of opinion.",
                  "We inspect and document it either way. If the answer is that your roof is fine, that is a useful thing to have on file for the next storm."] },
            { h: "When the whole street claims together",
              p: ["Because the ring went up in runs, one hail event can put an entire subdivision into the claims process in the same week. Adjusters get busy, crews get committed, and both timelines stretch.",
                  "Being early is worth more here than anywhere else in our markets. It is also worth being careful about who knocks on the door afterwards — a storm brings contractors into the area who will not be here next year."] },
            { h: "Each suburb permits separately",
              p: ["Columbus and each surrounding suburb permit on their own terms, and the historic districts add a review step on top. A storm repair still needs the paperwork, and the timeline differs street to street.",
                  "We handle both, and we would rather set the expectation at the inspection than explain a delay later."] },
          ],
        },
        "st-louis": {
          eyebrow: "Storms across the St. Louis area",
          heading: "Summer wind and hail, on a housing stock made of brick",
          intro: "St. Louis takes straight-line wind and hail most summers, and the masonry stock means the damage frequently extends past the roof in ways a roof-only scope misses.",
          blocks: [
            { h: "Straight-line wind is the event that does visible damage",
              p: ["Most summers bring at least one system with enough sustained wind to lift covering, empty a gutter run off a fascia and bring limbs down. It is the damage people notice and the one they call about.",
                  "Photograph it before anything is cleared. A tidied-up yard is a harder claim than an untidy one, which is an awkward thing to have to say and a true one."] },
            { h: "Hail marks more than the roof",
              p: ["The same stones that bruise shingles dent gutters, downspouts, siding on the windward elevation and the fins on an air-conditioning condenser. Those are part of the same event and belong in the same scope.",
                  "A roof-only inspection after a hail event routinely under-reports the damage. We walk the elevations and the ground-level units as well, because they are evidence for the roof claim as much as claims in their own right."] },
            { h: "Brick changes the damage list",
              p: ["A brick house does not dent, but it has chimneys, parapets and copings that take wind directly, and mortar that has been weathering for decades. Storm damage here shows up as displaced coping, cracked mortar and failed counterflashing rather than as marked siding.",
                  "That is masonry work alongside roofing, and it is worth having documented at the same time rather than discovering it the following winter."] },
            { h: "Two counties and a lot of municipalities",
              p: ["St. Louis County and the individual municipalities permit separately, and Jefferson County is different again. After a widespread event the queues are the constraint rather than the crews.",
                  "We pull them where they are needed. Knowing which jurisdiction you are in is the first thing we work out at the inspection."] },
          ],
        },
      },
    },
    // ── FLAT ROOFING (Rambow audit, 2026-08-28 / built 2026-08-31) ──────────────────────────
    // The audit found /columbus/roofing/flat-roofing/ holding page-one-adjacent positions for
    // "flat roofing companies" and "central ohio flat roof installation" on the LIVE site while
    // the phrase "flat roof" appeared nowhere on the new one — a service we actually sell (TPO
    // and low-slope are live lines) with no page to catch its own demand. Redirects for the old
    // URLs are DEFERRED per the same brief; these pages only build the destination.
    "flat-roofing": {
      label: "Flat & Low-Slope Roofing",
      seo: {
        title: (m) => `Flat Roofing in ${m.cityState}`,
        description: (m) => `Flat roof installation and repair across ${m.region} — TPO, EPDM and modified bitumen, quoted after a free on-roof inspection. Call ${m.phone}.`,
      },
      h1: (m) => `Flat Roofing in ${m.name}`,
      lead: (m) => `TPO, EPDM and modified bitumen for flat and low-slope roofs across ${m.region} — installed, repaired and replaced.`,
      intro: (m, c) => ({
        cincinnati:
          "A flat roof is not a shingle roof laid flat — it is a membrane system, and it succeeds or fails on seams, drainage and edge details rather than on the field. Around Cincinnati that mostly means the low-slope sections older homes accumulate: rear additions in Pleasant Ridge and Norwood, porch roofs in Hyde Park, garage roofs from Oakley out to Milford. We install and repair flat roofs as their own trade, with the right membrane for how the roof is used, not shingles pretending the pitch is steeper than it is.",
        columbus:
          "Central Ohio flat roof installation is a different job from the steep-slope work most roofing companies quote, and treating it the same is why so many flat roofs here leak young. Columbus carries more low-slope roofing than people expect — porch roofs and rear additions in Clintonville and German Village, garage and bump-out roofs through Hilliard and Gahanna, and the low-pitch sections that 1990s subdivision designs tucked behind dormers. We run flat roofing as a dedicated line: membrane systems, engineered drainage, and details that hold through a freeze.",
        "st-louis":
          "St. Louis is a flat-roof town in a way the other metros we serve are not. The brick housing stock around Tower Grove, The Hill and the inner ring carries parapet walls and low-slope rear sections as a matter of course, and South County ranches add long, shallow porch and carport roofs on top of that. A flat roofing contractor here has to know membranes and masonry both — where the membrane turns up the parapet is where most of these roofs actually fail, and it is the first place we look.",
      }[m.slug]),
      sections: [
        { title: "TPO", body: "The workhorse single-ply: heat-welded seams, reflective surface, strong price-to-life ratio. Our default recommendation for most residential low-slope sections." },
        { title: "EPDM rubber", body: "Proven over decades, tolerant of movement, and often the right call over occupied space where dark membrane and simple detailing win." },
        { title: "Modified bitumen", body: "Layered asphalt sheets for roofs that take foot traffic or abuse — and the natural repair match for many existing older flat roofs." },
        { title: "Drainage and edges", body: "Ponding water is the flat-roof killer. Tapered insulation, working drains and scuppers, and clean edge terminations are quoted as part of the job, not extras." },
      ],
      depth: {
        cincinnati: {
          eyebrow: "Flat roofs in this metro",
          heading: "What a Cincinnati flat roof is up against",
          blocks: [
            { h: "Freeze-thaw finds every seam", p: [
              "An Ohio Valley winter crosses freezing dozens of times, and standing water on a flat section turns each crossing into a pry bar. A membrane with even shallow ponding ages several winters for every calendar one here.",
              "That is why our flat-roof quotes talk about tapered insulation and drainage before they talk about membrane brand — moving the water off the roof buys more life than any upgrade in the material itself.",
            ]},
            { h: "Additions meet old houses", p: [
              "Most of the flat roofing we do in Hamilton County is where a newer low-slope section meets an older steep roof or a brick wall — the back of a Pleasant Ridge four-square, a Milford garage tied into the house. Those transitions are flashing problems first and membrane problems second, and quoting them from the ground misses what matters.",
            ]},
            { h: "Repair or re-cover, honestly", p: [
              "A flat roof with a tired surface but sound insulation can often take a re-cover for well under replacement cost. One with wet insulation cannot — trapping moisture under new membrane buys a worse failure later. A moisture check settles it before we quote, and we will say plainly which side of the line your roof is on.",
            ]},
          ],
        },
        columbus: {
          eyebrow: "Flat roofs in this metro",
          heading: "What central Ohio asks of a flat roof",
          blocks: [
            { h: "Hail hits membranes differently", p: [
              "The spring hail that bruises shingles punctures aged single-ply. Fresh TPO shrugs off most central Ohio hail; fifteen-year-old membrane that has lost its plasticizers cracks instead. Age, not brand, is usually the deciding variable — which is why our inspection reads the membrane's condition before anything else.",
            ]},
            { h: "Open ground means wind uplift", p: [
              "Flat roofs fail at the perimeter in wind, and the flat terrain that gives Columbus subdivisions their long wind fetch makes edge securement the detail that matters most. Fastening schedules and edge details on our installs follow the wind rating the location actually needs, not a one-size default.",
            ]},
            { h: "From porch roofs to whole systems", p: [
              "Central Ohio flat roof installation spans a wide range — a Clintonville porch, a German Village rear addition under historic-district rules, a Gahanna garage. The membrane choice follows the use: EPDM over living space for quiet and movement tolerance, TPO where sun exposure dominates, modified bitumen where the roof gets walked.",
            ]},
          ],
        },
        "st-louis": {
          eyebrow: "Flat roofs in this metro",
          heading: "Flat roofing in a brick city",
          blocks: [
            { h: "The parapet is the roof", p: [
              "On the brick stock around Tower Grove, The Hill and the near South Side, the membrane field rarely fails first — the turn-up at the parapet wall does. Coping stones shift, mortar joints open, and water enters above the membrane line entirely. Our flat-roof inspections here spend as much time on the masonry interface as on the membrane.",
            ]},
            { h: "A wide thermal swing works the seams", p: [
              "St. Louis summers put serious heat into a dark flat roof and the winters still freeze — a seasonal swing wide enough to open seams and back out fasteners over the years. Heat-welded TPO seams and generous expansion detailing are how a flat roof rides that swing instead of fighting it.",
            ]},
            { h: "Shingle and low-slope, one quote", p: [
              "Many South County homes pair a shingled main roof with a low-slope porch, carport or rear addition. We quote both parts as one job with the right system on each — asphalt shingle above, membrane below — rather than stretching either material past what it is for.",
            ]},
          ],
        },
      },
      faq: (m, c) => [
        { q: "Which flat roof membrane is best?", a: `The one matched to how the roof is used. TPO is our default for sun-exposed sections, EPDM tolerates movement and suits roofs over living space, and modified bitumen takes foot traffic. On an inspection in ${m.name} we will tell you which fits and why — and quote more than one when the case is close.` },
        { q: "Can you repair a flat roof, or does it have to be replaced?", a: "Repair is often the honest answer: seam failures, flashing details and isolated punctures are all fixable if the insulation underneath is dry. A moisture check tells us whether repair money is well spent, and we share that reading before you commit to anything." },
        { q: "How long does a flat roof last?", a: `Installed and drained properly, TPO and EPDM both run 20 to 30 years; modified bitumen similar with maintenance. Ponding water shortens all of them — which is why drainage is part of every quote we write. ${c.weather}` },
        { q: "Do you handle the low-slope section along with a shingle roof?", a: "Yes, as one job. Homes with a shingled main roof and a flat porch or addition get the right system on each section and one crew responsible for the transition between them — which is where mixed roofs usually leak." },
      ],
    },

    // ── WIND DAMAGE REPAIR (same audit, same date) ──────────────────────────────────────────
    // Live site ranks for "wind damage roof repair" and "roofing maintenance for high-wind
    // areas" on a page this build folded into insurance-storm-damage. Wind gets its own page
    // per market; the storm page keeps insurance and hail. Redirects deferred, as above.
    "wind-damage": {
      label: "Wind Damage Repair",
      seo: {
        // m.name, not cityState: with the brand suffix the state code pushed all three past 60.
        title: (m) => `Wind Damage Roof Repair in ${m.name}`,
        description: (m) => `Wind damage roof repair across ${m.region}: lifted shingles, creased tabs and blow-offs fixed fast. Free inspection and documentation. ${m.phone}.`,
      },
      h1: (m) => `Wind Damage Roof Repair in ${m.name}`,
      lead: (m) => `Lifted, creased and missing shingles across ${m.region} — found, documented and repaired before the next front arrives.`,
      intro: (m, c) => ({
        cincinnati:
          "Wind damage rarely announces itself. A gust that clears the Ohio Valley hills lifts a run of tabs, the shingles settle back down, and from the driveway the roof looks untouched — but every lifted tab is a broken seal, and the next storm finds it. We repair wind damage across greater Cincinnati, from river-adjacent streets in Anderson Township that funnel gusts uphill to the open newer builds around Mason, and we start by finding the damage that does not show from the ground.",
        columbus:
          "Wind is central Ohio's signature roof threat. The flat, open ground gives straight-line winds a running start across Dublin, Hilliard and the newer rings, where young trees break nothing, and a single June front can crease shingles across an entire subdivision without tearing one of them off. Wind damage roof repair is its own discipline here: reading creases and broken seals that hide in plain sight, fixing them fast, and documenting everything in case the damage crosses into an insurance conversation.",
        "st-louis":
          "The storm cells that cross the St. Louis metro in summer push outflow winds ahead of them, and those gusts do their work in seconds — lifted ridge caps in Ballwin, creased field shingles in Florissant, a strip of tabs gone from a Mehlville ranch. We handle wind damage roof repair across the metro: emergency cover first when weather is still coming, then a slope-by-slope inspection, then a repair scoped to what the wind actually did rather than a replacement pitch you did not ask for.",
      }[m.slug]),
      sections: [
        { title: "Lifted and creased shingles", body: "A crease is a break in the shingle's spine and a lifted tab is a broken seal — both leak later if not resealed or replaced now. These are the finds that decide whether a roof rides out the next front." },
        { title: "Blow-offs and emergency cover", body: "Missing shingles and exposed underlayment get covered the day you call when weather is incoming. Stopping the water buys time to do the repair right." },
        { title: "Ridge, rake and edge work", body: "Wind works the perimeter hardest. Ridge caps, rake edges and the first courses at the eaves get checked and re-secured — the places damage starts, and the places a quick look misses." },
        { title: "Documentation as we go", body: "Every find is photographed and written up slope by slope. If the damage turns out to be widespread enough for an insurance claim, the record is already in the shape an adjuster needs." },
      ],
      depth: {
        cincinnati: {
          eyebrow: "Wind in this metro",
          heading: "How Ohio Valley wind takes roofs apart",
          blocks: [
            { h: "The hills make their own gusts", p: [
              "Cincinnati's terrain channels wind — river corridors and hillsides accelerate gusts that flat ground would spread out, which is why one street in Mt. Washington shows damage while the next one over shows none. We inspect the roof in front of us rather than assuming the neighborhood's weather was uniform.",
            ]},
            { h: "Trees do half the damage", p: [
              "The heavy canopy through Clermont County and the river townships means wind events here drop limbs as often as they lift shingles. Impact scuffs and punctures hide among leaves and shade lines; part of a wind inspection here is simply looking under what the trees dropped.",
            ]},
            { h: "Maintenance for exposed roofs", p: [
              "For homes on ridgelines and open hilltops we offer a simple standing check: seals, ridge caps and edge courses gone over ahead of storm season. Roofing maintenance for high-wind exposure costs little and is the difference between riding out a front and calling us after it.",
            ]},
          ],
        },
        columbus: {
          eyebrow: "Wind in this metro",
          heading: "Straight-line wind, and what it leaves behind",
          blocks: [
            { h: "Damage in plain sight", p: [
              "After a derecho-style front, the roofs that lost shingles get attention and the roofs that merely creased get forgotten — until they leak. A creased shingle keeps its place and loses its strength, and finding them takes someone on the roof, not binoculars from the lawn.",
            ]},
            { h: "New subdivisions, no windbreaks", p: [
              "Dublin, Lewis Center and the newer rings sit on open former farmland where young landscaping breaks no wind at all. The same front that rattles an old Clintonville street tears at these roofs directly — which is why we check field fastening and not just the obvious ridge line on newer builds.",
            ]},
            { h: "A pre-season check beats a claim", p: [
              "For high-wind exposure we run a maintenance visit ahead of spring: reseal what has lifted, re-nail what has backed out, and note what is aging toward vulnerable. It is the least expensive roofing work a wind-exposed home buys all year.",
            ]},
          ],
        },
        "st-louis": {
          eyebrow: "Wind in this metro",
          heading: "Outflow winds and the metro roof",
          blocks: [
            { h: "Seconds of wind, seasons of leaks", p: [
              "The gust front ahead of a summer storm cell hits hard and moves on. What it leaves — broken seals, shifted ridge caps, a crease across a south-facing slope — leaks slowly over the seasons that follow, long after the storm that caused it is forgotten. Dating the damage matters, and our slope-by-slope documentation does exactly that.",
            ]},
            { h: "Long simple roofs, long exposed runs", p: [
              "South County's mid-century ranches carry long unbroken slopes with edge runs to match. Wind that gets under a first course peels along the whole run, so eave and rake securement is where our inspections start on these houses.",
            ]},
            { h: "When wind damage becomes a claim", p: [
              "One slope of creases is a repair; damage across multiple slopes is often an insurance conversation. We tell you plainly which you have, hand you the photographed record either way, and repair what makes sense to repair regardless of how the claim question resolves.",
            ]},
          ],
        },
      },
      faq: (m, c) => [
        { q: "What does wind damage on a roof look like?", a: "Missing shingles are the obvious sign. The common ones are subtler: horizontal creases across tabs, shingles that lift by hand because the seal strip broke, and ridge caps sitting slightly proud. None of them show reliably from the ground — which is why the inspection is free and happens on the roof." },
        { q: "How fast can you get out after high winds?", a: `Same day or next day for anything open to the weather across ${m.region} — emergency cover first, then the full inspection once the roof is safe to walk.` },
        { q: "Is wind damage covered by insurance?", a: "Often, when it is widespread and documented. We photograph and write up everything we find slope by slope. Whether to claim is your call and the carrier's decision — we will tell you honestly when the damage is minor enough that a straight repair beats involving them." },
        { q: "Do you offer maintenance for high-wind areas?", a: `Yes — a pre-season check that reseals lifted tabs, re-secures ridge and edge courses, and flags aging shingles before ${c.stormLine} arrive. It is inexpensive and it is the single best predictor of a roof getting through storm season quietly.` },
      ],
    },

  },


  siding: {
    "siding-replacement": {
      label: "Siding Replacement",
      // ── SEO TITLE AND DESCRIPTION, WRITTEN RATHER THAN DERIVED ──────────────────────────────
      // Derived from `h1` and `lead` before, which broke two ways at once: h1 is a sentence and
      // ran the title past 60 characters where Google truncates it, and `lead` carries no city, so
      // all three markets shipped the SAME meta description — the one signal that most directly
      // tells a crawler two pages are the same page. `cityState` puts the state code in, which is
      // what a local search actually matches on.
      seo: {
        title: (m) => `Siding Replacement in ${m.cityState}`,
        description: (m, c) => `Full re-siding across ${m.region} — old siding off, sheathing checked, flashing done properly. Free inspection and a written quote.`,
      },
      h1: (m) => `Siding Replacement in ${m.name}`,
      lead: (m) => `Full re-siding across ${m.region}, installed to the manufacturer's specification — most projects finished inside a week.`,
      intro: (m, c) =>
        `Siding fails from the bottom and from behind. The base course takes years of splash-back off the ground, and water that gets behind a poorly flashed window has nowhere to go. ${c.stock} We take the old siding off, look at the sheathing and the water barrier underneath, and fix what we find before anything new goes on — which is the step that decides whether the new siding lasts.`,
      sections: [
        { title: "Tear-off and what is underneath", body: "The old siding comes off so we can see the sheathing. Rot at the base course and around openings is common, and it costs little to put right while the wall is open." },
        { title: "Water barrier and flashing", body: "House wrap taped and lapped properly, and flashing at every window, door and transition. Most siding complaints trace back to installation, not material." },
        { title: "Trim, soffit and fascia", body: "Usually done with the siding because the crew is already set up and it is where water gets in when it is neglected." },
        { title: "Material choice", body: "Fiber cement and vinyl both work when installed well. We quote both and tell you what we would put on our own house." },
      ],
      faq: (m, c) => [
        { q: "How long does a re-side take?", a: "Most homes are finished within about three days once the crew starts. Larger or more complex elevations run longer, and we give you the timeline before we begin." },
        { q: "Can you do siding and gutters together?", a: "Yes, and it is usually faster and cheaper than two visits — the same crew is already up there." },
        { q: `What does ${m.name} weather do to siding?`, a: c.weather },
        ...commonFaq(m),
      ],
      // PER-MARKET. The vinyl and Hardie pages carry the material argument and are SHARED, because
      // how a plank is fastened does not change by metro. This page is the job rather than the
      // product, and the job does change: what is behind the wall, and what the weather does to
      // the bottom of it. See depthFor().
      depth: {
        cincinnati: {
          eyebrow: "Re-siding here",
          heading: "What the wall behind it looks like around the valley",
          intro: "Siding fails from the bottom and from behind, and in Cincinnati both are driven by the same thing: water that freezes, thaws, and does it again.",
          blocks: [
            { h: "The base course takes the winter",
              p: ["Splash-back off a path or a driveway soaks the bottom course through the winter, and every freeze cycle works that moisture further into whatever is behind it. On the older frame stock that is sheathing and sill plate, and it is the first thing we look at when the siding comes off.",
                  "It is also why we take the old course off rather than going over it. Covering a wet base course hides the one part of the wall most likely to be rotten."] },
            { h: "Hillside houses get more splash than they should",
              p: ["A house cut into a slope frequently has ground much closer to the siding on the uphill side than anyone intended, and grade that has crept up over the years. Siding held too close to soil wicks moisture continuously and never dries.",
                  "Sometimes the fix is regrading rather than siding. We would rather say that at the inspection than fit new material to the same problem."] },
            { h: "Mixed walls on the pre-war stock",
              p: ["A lot of the older housing here is brick at the front and frame at the sides and rear, or brick to the first floor and frame above. The transition between the two is a detail rather than an edge, and it is where water gets behind a wall.",
                  "Flashing that transition properly is most of what decides whether the new siding lasts. It is also the detail most often skipped, because it is not visible from the street."] },
            { h: "Trim, soffit and fascia in a wet market",
              p: ["Under heavy tree cover the fascia and soffit stay damp for long stretches of the year, and they fail well ahead of the siding below them. Replacing the siding and leaving them is a false economy on this stock.",
                  "We quote them together because the crew is already set up, and because water entering at a soffit does not care how new the siding underneath is."] },
          ],
        },
        columbus: {
          eyebrow: "Re-siding here",
          heading: "A ring of houses reaching the same age at the same time",
          intro: "Central Ohio's suburban ring was built fast and built alike, which makes the siding conversation here unusually predictable — and unusually wind-driven.",
          blocks: [
            { h: "Builder vinyl reaching the end together",
              p: ["Dublin, Hilliard, New Albany and Lewis Center went up within about fifteen years of each other, largely in the same thin builder-grade vinyl. It is reaching the end of its service life across whole streets at once, which is why so much of what we quote here is a full re-side rather than a repair.",
                  "The upside is predictability: we know what is behind it before we take it off, because we have taken the same wall apart on the next street."] },
            { h: "Wind gets behind a loose course",
              p: ["Open ground means the windward elevation takes sustained pressure that a sheltered wall never sees. A course that was fitted slightly loose, or a J-channel that was never properly locked, will let wind lift it and drive rain in behind.",
                  "That damage concentrates on one or two elevations rather than the whole house, which is worth knowing — sometimes the honest answer is two elevations rather than four."] },
            { h: "The water barrier is the part that was rushed",
              p: ["On a fast build, house wrap goes on quickly and gets lapped the wrong way or left untaped around openings. It is invisible for twenty years and then it is the reason a wall is soft under a window.",
                  "Every re-side we do is a chance to put that right, and it is the part of the job we would rather you asked about than the color."] },
            { h: "Steeper pitches mean more gable to cover",
              p: ["The newer stock here runs to steeper roofs and larger gable ends than the older housing in our other markets, which puts more siding high up where nobody inspects it.",
                  "Those elevations weather hardest and get looked at least. We photograph them at the inspection so you can see the wall you have never actually seen."] },
          ],
        },
        "st-louis": {
          eyebrow: "Re-siding here",
          heading: "Siding on a brick city, and humidity behind it",
          intro: "St. Louis is largely brick, so siding here is usually on the parts of a house that are not — gables, dormers, rear additions and the post-war suburbs. That changes the job.",
          blocks: [
            { h: "Siding is often a partial elevation, not a house",
              p: ["On the city and inner-ring stock the siding is frequently a gable end, a dormer cheek or a rear addition attached to brick. The work is smaller and the detailing matters more, because almost all of it is transition.",
                  "Where siding meets masonry there has to be a flashing and a gap. Fitted tight to brick it traps water against both materials, and the brick loses that argument slowly."] },
            { h: "The post-war ranches are a different job entirely",
              p: ["South County through Affton, Mehlville and Oakville runs to mid-century ranches with long, simple runs and low elevations. Those are straightforward re-sides and they go quickly.",
                  "Long runs do mean expansion matters more, because a full-length panel has further to move. Room left at the ends is not optional on a wall like that."] },
            { h: "Humidity is behind the wall, not on it",
              p: ["A humid summer pushes moisture into a wall from the outside during the day and the house pushes it back the other way at night. A barrier that cannot dry in one direction or the other will hold that moisture against the sheathing.",
                  "It is an argument for taking the old siding off and for what goes back behind the new — a wall that can dry is worth more here than a wall that is merely sealed."] },
            { h: "Hail marks siding as well as roofs",
              p: ["The same summer hail that bruises a roof dents and cracks siding on the windward elevation, and older vinyl gets brittle enough that it cracks rather than dents.",
                  "That is part of the same storm claim as the roof and belongs in the same scope. It is also the case that a cracked panel on a discontinued profile is frequently not matchable, which we would rather tell you before we try."] },
          ],
        },
      },
    },

    "james-hardie-siding": {
      label: "James Hardie Siding",
      // REWRITTEN PER MARKET 2026-08-31 (audit continuation): the three market versions shared
      // one intro, one section set, one FAQ and one depth block — 64% overlap. Now every element
      // is written per metro; no sentence appears on two markets.
      seo: {
        title: (m) => `James Hardie Siding in ${m.cityState}`,
        description: (m) => ({
          cincinnati: "Hardie fiber cement for Cincinnati's older streets — Alliance Elite installation, profiles that suit pre-war facades. Free inspection: (513) 258-0450.",
          columbus: "James Hardie siding installed to spec in Columbus — ColorPlus for open-sun subdivisions, board-approved profiles for historic blocks. Free quote.",
          "st-louis": "Fiber cement built for St. Louis heat swings — James Hardie installed with the clearances the warranty demands. Free inspection: (314) 380-8111.",
        }[m.slug]),
      },
      h1: (m) => `James Hardie Fiber Cement Siding in ${m.name}`,
      lead: (m) => ({
        cincinnati: "The cladding that suits Cincinnati's older housing best, fitted by an Alliance Elite crew.",
        columbus: "Factory-finished fiber cement, installed to Hardie's own specification across central Ohio.",
        "st-louis": "The most dimensionally stable siding you can put on a house that lives through St. Louis summers.",
      }[m.slug]),
      intro: (m, c) => ({
        cincinnati:
          "Fiber cement earned its place in Cincinnati the honest way: on the older east-side streets where wood clapboard finally gave out and vinyl never looked right. Hardie board carries the deeper profiles and crisp shadow lines a Hyde Park or Wyoming facade wants, holds paint through the valley's freeze-thaw winters, and shrugs off the hail that comes through most springs. We install it as a James Hardie Alliance Elite contractor — the training tier built around the installation details the warranty actually depends on.",
        columbus:
          "Two very different Columbus houses keep choosing the same siding. In the newer subdivisions, homeowners replacing failed builder vinyl step up to Hardie for the ColorPlus finish that holds in full open-lot sun. On the historic blocks, review boards approve fiber cement because its profiles read as original from the sidewalk. Both are right, for different reasons — and both depend entirely on installation done to Hardie's specification, which is where our Alliance Elite training earns its keep.",
        "st-louis":
          "Ask what breaks siding in St. Louis and the answer is movement: the swing from August heat to January freeze works every panel, joint and fastener on a wall, year after year. Fiber cement moves less than anything else we hang, which is why it is our first recommendation here more often than in either Ohio market. James Hardie board, installed with the clearances and gaps the manufacturer specifies, is the closest thing to a set-and-forget wall this climate allows.",
      }[m.slug]),
      sections: (m) => ({
        cincinnati: [
          { title: "Profiles for pre-war facades", body: "Deeper laps, wider trim, real shadow lines — the vocabulary a 1920s elevation expects, in a board that will not rot at the base course." },
          { title: "Paint that survives the valley", body: "ColorPlus factory finish holds through humid summers and freeze-thaw winters far longer than site paint on wood ever did here." },
          { title: "Hail takes the test", body: "Spring hail that cracks aged vinyl bounces off fiber cement. On the east side's exposed hilltops, that difference shows up within a few seasons." },
          { title: "Alliance Elite installation", body: "Fastening, clearances and joint detail per Hardie's spec — the difference between the 30-year wall and the warranty claim." },
        ],
        columbus: [
          { title: "ColorPlus against open sun", body: "Subdivision lots with no shade fade site-applied finishes fast. Factory-baked ColorPlus is the answer built for exactly that exposure." },
          { title: "Board-approved for historic streets", body: "German Village and Bexley reviewers have approved Hardie profiles repeatedly — we submit spec sheets they have already said yes to." },
          { title: "Stable in the wind", body: "A heavy board hung on a proper schedule does not rattle, lift or work loose the way lightweight cladding does on open central Ohio ground." },
          { title: "Spec-first installation", body: "Every warranty condition — gaps, clearances, fastener depth — is a line item on our checklist, not an assumption about the crew." },
        ],
        "st-louis": [
          { title: "Built for the swing", body: "Cement, sand and cellulose barely move between July and January — the property that matters most on a St. Louis wall." },
          { title: "Gables and additions in brick country", body: "Hardie's trim system finishes cleanly against masonry, which is exactly what the city's gable-and-addition siding jobs demand." },
          { title: "Fire and pest, settled", body: "Non-combustible board with nothing organic for insects — two line items St. Louis homeowners ask about that fiber cement simply closes." },
          { title: "Clearances, obsessively", body: "Roofline, grade and deck gaps per the spec — because a board that wicks water splits in our freeze cycles, and the spec is what prevents it." },
        ],
      }[m.slug]),
      faq: (m, c) => ({
        cincinnati: [
          { q: "Is Hardie worth the premium over vinyl on an older Cincinnati house?", a: "On the pre-war stock, usually yes — the profiles suit the architecture, the board takes the canopy's falling limbs and the spring hail, and repainting cycles run decades apart. On a simple newer elevation the calculus tightens, and we will say so." },
          { q: "Can you match the original wood look on my street?", a: "Closely. Hardie's smooth and cedarmill laps come in widths that sit correctly on older facades, and the trim system reproduces most period details in a board that will not rot. Bring a photo; we will point at the matching profile." },
          { q: "How does fiber cement handle Cincinnati winters?", a: "It is the winter that makes the case: the board does not become brittle in cold, and with correct clearances it cannot wick meltwater — which is what splits badly installed fiber cement. Installation quality is the whole story, which is why the Alliance Elite training exists." },
          { q: "ColorPlus or painted on site?", a: "ColorPlus for longevity and consistency; site paint when you need a color the factory palette lacks or an exact match to something existing. We quote both with the honest maintenance difference attached." },
          { q: "What does a Hardie re-side cost here?", a: "More than vinyl up front, less over the decades — the crossover math depends on the house. The written quote after a free inspection itemizes board, trim, and any sheathing repair the tear-off reveals." },
          { q: "Who actually installs it?", a: "Our own trained crews under one project manager from the Milford office — the person who quotes the wall runs the wall." },
          { q: "Can Hardie go on just the street-facing elevation?", a: "It can, and on tight budgets it sometimes should — the facade carries the architecture while simpler cladding serves the sides. We will design the transition so it reads as intentional, because done casually that mix looks like what it is." },
          { q: "How long does a Cincinnati Hardie job run?", a: "Four to eight working days on most houses — the board rewards patience and punishes rushing. The quote carries the schedule, and the hillside streets get an honest staging day where the access needs one." },
        ],
        columbus: [
          { q: "Will a review board accept Hardie in a Columbus historic district?", a: "They have, repeatedly — the smooth profiles in appropriate lap widths read as original material from the street, which is the test that matters. We prepare the product documentation your submission needs." },
          { q: "Why did my neighbor's site-painted siding fade while ColorPlus held?", a: "Factory finish is baked onto the board under controlled conditions; site paint is only as good as its application day. On the open-sun lots of Dublin or Lewis Center, that difference compounds every summer." },
          { q: "Is fiber cement overkill for a subdivision two-story?", a: "It is an upgrade, not overkill: the step from failed builder vinyl to Hardie is the one most Columbus re-siding customers are actually shopping, and the wind stability alone is noticeable on open ground. We will quote vinyl beside it so the premium is a choice, not a default." },
          { q: "How long does a Hardie installation take?", a: "A typical two-story runs four to seven working days — the board is heavier and the detail standard higher than vinyl, and rushing either is how warranties get voided. The schedule is in the quote." },
          { q: "What maintenance does it actually need?", a: "A rinse when you think of it and caulk-joint checks every few years. Repainting, when it eventually comes, accepts paint better than wood and holds it longer." },
          { q: "Does hail damage fiber cement?", a: "Central Ohio's typical hail does not faze it — impacts that crack aged vinyl leave Hardie unmarked. Catastrophic stones can chip any material; we document and repair those cases like any storm claim." },
          { q: "Where do your Hardie crews work around Columbus?", a: "Metro-wide from Galloway — the review-board streets of German Village and Bexley, the upgrade market across Dublin, Hilliard and Westerville, and everywhere between. Historic and subdivision jobs run on the same spec checklist." },
          { q: "Can you install over my existing sheathing?", a: "Only after we have seen it. Hardie's weight needs sound substrate and correct fastener bite; the tear-off inspection confirms both, and any repair is priced in the quote rather than discovered on install day." },
          { q: "What does the free assessment involve?", a: "A walk of every elevation, moisture readings where the wall hints at trouble, photographs, and a written itemized quote with the spec attached — usually in your inbox within two business days." },
        ],
        "st-louis": [
          { q: "Why do you push fiber cement harder in St. Louis than anywhere?", a: "Because our climate's defining stress — the huge summer-to-winter swing — is precisely the stress fiber cement resists best. The material barely moves, so the joints, caulk lines and fasteners it depends on stay where the installer put them." },
          { q: "Can Hardie be used on just a gable or addition?", a: "Yes, and it is some of our most common city work — the trim system closes neatly against brick, and a small area of premium board costs less than people assume. Partial jobs get the same spec discipline as whole houses." },
          { q: "How does it do against summer heat specifically?", a: "It does not soften, sag or oil-can in August the way thin cladding can, and dark ColorPlus shades stay usable here where dark vinyl becomes a liability on west walls." },
          { q: "What is the real cost difference from vinyl?", a: "Typically a meaningful premium on materials and labor — the board is heavier and slower to hang correctly. The written quote shows both systems side by side; on long-hold houses the lifetime math usually closes the gap." },
          { q: "Is the dust from cutting a concern?", a: "Silica dust is real, which is why the board is cut with scoring shears and dust-controlled saws per the working spec. That is our crews' problem to manage, and they manage it properly — it never becomes your household's." },
          { q: "What warranty comes with it?", a: "Hardie's substrate warranty runs decades, ColorPlus carries its own finish warranty, and our workmanship warranty covers the installation — with the spec-compliance documentation that keeps all three enforceable." },
          { q: "Do you install Hardie across the whole St. Louis metro?", a: "Yes — city gable jobs near Tower Grove, inner-ring homes in Kirkwood and Webster Groves, and full re-sides out through Ballwin and Chesterfield, all run from Geyer Road with the same spec discipline." },
        ],
      }[m.slug]),
      depth: {
        cincinnati: {
          eyebrow: "About the material",
          heading: "Why the older neighborhoods keep choosing it",
          blocks: [
            { h: "The architecture argument", p: [
              "Cincinnati's pre-war streets were built with cladding proportions modern vinyl never quite reproduces — deeper reveals, heavier trim, corners that cast a real shadow. Fiber cement is the one modern material that carries those proportions convincingly, which is why an east-side re-side in Hardie disappears into its street while vinyl on the same house reads as a renovation.",
              "It is also why our Cincinnati Hardie quotes spend real time on trim: the boards are half the look, and the corner and opening details are the other half. A quote that prices planks and hand-waves the trim is describing a different, lesser project.",
            ]},
            { h: "Weight is a feature and a demand", p: [
              "A Hardie plank weighs several times its vinyl equivalent. On the wall that mass is why the material sits flat and quiet; on the job it demands more hands, engineered fastening and a substrate someone verified. Older Cincinnati sheathing varies house to house, and checking it is part of our tear-off, not a surprise afterward.",
            ]},
            { h: "The clearance rules exist for our winters", p: [
              "Hardie specifies gaps above rooflines, decks and grade because standing water wicks into cut board edges — and wicked water meeting an Ohio Valley freeze splits board from the inside. The most common defect we find in other crews' fiber cement work is board run tight to a roof, drinking meltwater for years. Ours is installed to the gap, photographed, and warrantied.",
              "The photography is not decoration. Every clearance on every elevation goes into the job file at closing, which is what turns a warranty from a promise into a claim that succeeds.",
            ]},
            { h: "Where we say no", p: [
              "Fiber cement is not automatic. On a simple, large, newer elevation where budget matters more than profile depth, a heavy-gauge vinyl can be the smarter spend, and our quotes say so out loud. Recommending the expensive board everywhere is salesmanship; recommending it where Cincinnati's housing genuinely rewards it is judgment.",
            ]},
          ],
        },
        columbus: {
          eyebrow: "About the material",
          heading: "One board, both Columbuses",
          blocks: [
            { h: "The subdivision case", p: [
              "The homeowner replacing 1990s builder vinyl in Hilliard is usually deciding between doing vinyl again or stepping up once. The step-up case rests on three central Ohio facts: open-sun lots that punish site-applied finishes (ColorPlus answers this), unbroken wind that works lightweight panels loose (mass answers this), and spring hail that cracks aging vinyl (cement answers this). It costs more. It also ends the cycle.",
            ]},
            { h: "The historic case", p: [
              "On the review-board streets the question inverts — nobody doubts the durability; the question is whether it looks right. Approved projects across the older districts have settled it: correct lap widths in smooth finish, real trim at openings, and the elevation reads as it always did. We arrive at reviews with spec sheets from products boards have already accepted, which shortens the conversation considerably.",
            ]},
            { h: "Spec is a checklist, not a vibe", p: [
              "Hardie's warranty conditions are concrete: fastener type and depth, gap detail at butt joints, clearances at every horizontal. Our crews run them as a literal checklist per elevation, and the job file keeps the photographic proof. When a warranty claim matters years from now, that file is what makes it succeed.",
            ]},
            { h: "Wind, quantified", p: [
              "Fastened to specification, fiber cement carries wind ratings far past anything a central Ohio front delivers. The material's mass does what lightweight cladding cannot on open ground: it stays put, quietly, in the October gusts that leave vinyl streets ticking and rattling.",
              "The quiet compounds with the practical: a wall that is not moving is a wall whose caulk lines, paint film and fastener seats are not working loose either. Stillness is not a luxury feature; it is the mechanism behind the low maintenance. That stillness is audible from inside the house, which surprises people: a Hardie wall in a windstorm simply does not participate. For homeowners replacing a vinyl wall that has spent twenty autumns announcing the weather, it is the upgrade they mention most afterward.",
            ]},
          ],
        },
        "st-louis": {
          eyebrow: "About the material",
          heading: "The stability argument, in the swing capital",
          blocks: [
            { h: "Movement is the local tax", p: [
              "Every cladding on a St. Louis wall pays a movement tax between July and January. Vinyl pays it in visible growth and shrink; caulk pays it in opened joints; fasteners pay it a little each cycle. Fiber cement's near-zero movement is not a brochure abstraction here — it is why ten-year-old Hardie walls in Kirkwood still have tight joints while the same-age vinyl next door has begun to wander.",
            ]},
            { h: "Against the masonry", p: [
              "Most St. Louis Hardie work terminates against brick somewhere — a gable over a masonry first story, an addition tied to a city house. The board's rigid trim system makes a clean, flashed, permanent line at that junction, where flexible cladding needs a caulk bead that our climate then chews through. The brick interface is where this material most outclasses its alternatives locally.",
            ]},
            { h: "Heat, taken seriously", p: [
              "August here disqualifies materials quietly: dark vinyl oil-cans on west walls, foam-backed products outgas their adhesives, site paint on wood blisters. Fiber cement with factory finish is the combination that ignores a 100-degree afternoon — which is why our west-elevation recommendations here are nearly always the same board.",
              "The full ColorPlus palette stays available here too, including the deep shades our heat takes off the table for vinyl — a small freedom that matters to homeowners who wanted the dark house and kept being talked out of it.",
            ]},
            { h: "The honest ledger", p: [
              "The premium is real: heavier board, slower installation, silica-controlled cutting, trim system priced like the durable good it is. The return is a wall whose maintenance calendar has almost nothing on it. On a house you intend to keep, that ledger usually closes; on a flip, it rarely does — and we will tell you which quote you are holding.",
              "The terms around the premium stay the same as every Coldstream job: free inspection, a written itemized quote, and no payments until the wall is finished and walked with you.",
            ]},
          ],
        },
      },
    },

    "vinyl-siding": {
      label: "Vinyl Siding",
      // REWRITTEN PER MARKET 2026-08-31 (audit continuation) — was 68% cross-market overlap.
      seo: {
        title: (m) => `Vinyl Siding in ${m.cityState}`,
        description: (m) => ({
          cincinnati: "Vinyl siding hung right on Cincinnati homes — movement room, taped wrap, honest gauge advice. The install decides everything. Free quote: (513) 258-0450.",
          columbus: "Replacing tired builder vinyl across Columbus subdivisions — heavier gauge, wind-rated fastening, a wall fixed before the panels. Free inspection.",
          "st-louis": "Vinyl siding that survives St. Louis summers: hung loose to move, gauge chosen for heat, wrap inspected first. Free quote from Geyer Road: (314) 380-8111.",
        }[m.slug]),
      },
      h1: (m) => `Vinyl Siding in ${m.name}`,
      lead: (m) => ({
        cincinnati: "The value option done properly — which around Cincinnati means gauge, movement room and a wall checked first.",
        columbus: "The upgrade path from the builder-grade panels your subdivision came with.",
        "st-louis": "Vinyl that keeps its shape through a St. Louis August, because it was hung to move.",
      }[m.slug]),
      intro: (m, c) => ({
        cincinnati:
          "Most vinyl complaints that reach our Milford office are installation stories wearing a material's name: panels pinned tight that buckled the first hot week, ends butted with no room that bowed, wrap behind them never taped so the sheathing stayed damp under Cincinnati's canopy shade. Hung correctly — loose, gapped, over a barrier somebody actually inspected — modern vinyl is a genuinely good value on much of this metro's housing, and we install it that way or not at all. Every vinyl quote we write here starts with a walk of the wall: what the current cladding is hiding, which elevations take the weather, and whether the profile you would be matching still exists. The number is written, itemized, and carries the same terms as all our work — free inspection first, no payments until completion.",
        columbus:
          "Columbus is where American builder-grade vinyl went up by the square mile, and it is now where that vinyl is wearing out by the street. Replacing it with the same thin panel repeats the cycle; replacing it with heavier gauge, wind-appropriate fastening and a corrected wall underneath ends it. That second version is the vinyl work we do across the metro's subdivisions — same affordable material class, entirely different outcome. The pattern is familiar enough by now that we can usually predict the tear-off findings from the build year: which window-head details were skipped, where the wrap was left untaped, which elevations the wind has already worked loose. The inspection is free, the findings go in writing, and the quote covers the wall corrections alongside the panels rather than springing them mid-job.",
        "st-louis":
          "Vinyl expands and contracts more than any other cladding we hang, and no market tests that property like St. Louis — the July-to-January swing here moves a twelve-foot panel visibly. The whole trade secret is respecting that: nails set to let panels float, expansion room at every terminal, gauge heavy enough not to oil-can on a west wall in August. Done so, vinyl serves this metro's frame walls and gables well at a price fiber cement cannot touch. Our Geyer Road crews hang it across the whole metro — ranch re-sides in South County, gable packages over city brick, storm repairs wherever the last hail line ran — and every job carries the same written quote and no-payment-until-completion terms as the rest of our work.",
      }[m.slug]),
      sections: (m) => ({
        cincinnati: [
          { title: "Hung to float", body: "Nail heads proud, panels moving freely, ends gapped — the checklist that separates a straight wall in year ten from a buckled one." },
          { title: "The wall underneath", body: "Old siding off, sheathing probed, wrap taped and lapped. Shade-side walls here hide damp; we look before we cover." },
          { title: "Gauge, honestly", body: "Thicker panel costs a little more and reads flatter on the long walls of post-war ranches. We show samples of both and price both." },
          { title: "Partial repairs", body: "Storm-cracked panels can often be swapped if the profile survives in the catalog — we check before promising a match." },
        ],
        columbus: [
          { title: "Beyond builder grade", body: "The original panels were a spreadsheet decision. The replacement is yours: heavier gauge, better lock design, a finish rated for open sun." },
          { title: "Wind-spec fastening", body: "Panel locks and nailing schedules chosen for open-lot gusts — the detail that keeps a subdivision wall quiet in October." },
          { title: "Fixing the era's shortcuts", body: "Untaped wrap and bare window heads are standard finds behind 1990s vinyl. They get corrected while the wall is open." },
          { title: "Whole street, one mobilization", body: "When neighbors' siding fails together, quoting together saves everyone setup costs. Ask — we do it often." },
        ],
        "st-louis": [
          { title: "Movement room, engineered", body: "Expansion gaps sized to our temperature swing, not a national default — the spec that keeps August from writing waves into the wall." },
          { title: "Heat-side gauge advice", body: "West and south elevations here punish thin panel. We steer gauge and color by exposure and say why in the quote." },
          { title: "Gables above brick", body: "Vinyl remains the budget-right answer for many frame gables over masonry — detailed at the brick line so the junction sheds water." },
          { title: "Hail and the brittle years", body: "Old vinyl grows brittle and spring hail finds it. We document cracked walls for claims the same way we document roofs." },
        ],
      }[m.slug]),
      faq: (m, c) => ({
        cincinnati: [
          { q: "Is vinyl a mistake on an older Cincinnati house?", a: "On a pre-war facade with real trim depth it usually reads wrong, and we will say so. On post-war ranches and colonials through Blue Ash, Fairfield or Loveland, quality vinyl looks right and spends the budget where it matters." },
          { q: "Why did my last vinyl buckle?", a: "Almost certainly nailed tight. Vinyl must hang and slide on its nails; pin it and the first hot spell has nowhere to send the expansion but outward. It is the most common installation failure in the metro and the easiest to avoid." },
          { q: "What is behind my current siding?", a: "Under Cincinnati shade, often a story: damp sheathing, an untaped barrier, sometimes older wood siding used as the nailing base. The tear-off tells us; the quote covers what we find rather than discovering it mid-job." },
          { q: "Does insulated vinyl make sense here?", a: "For flatness and rigidity on long visible walls, sometimes. As an energy upgrade, the honest numbers are modest — we quote it as an appearance option and let the R-value be a bonus." },
          { q: "How long will a proper install last?", a: "Decades — installation quality and gauge decide it far more than brand. The panels we hang loose today will still be sliding freely on their nails when the trees have grown another canopy." },
          { q: "What does vinyl cost versus Hardie in Cincinnati?", a: "Vinyl typically runs meaningfully less installed. The written quote can show both systems on your actual house, which beats any rule of thumb." },
          { q: "Do you re-side around Cincinnati's river towns?", a: "Milford outward through Loveland, Batavia and the Clermont County towns is home turf for our siding crews — the office is on that side of the metro, which usually means faster scheduling east than homeowners expect." },
          { q: "What happens to the old siding?", a: "Hauled and disposed of by us, with anything reusable separated out. Aluminum tear-offs still have scrap value, and on those jobs the haul-away line in your quote reflects it." },
          { q: "How disruptive is the work for the household?", a: "Exterior-only, but loud in stretches — panel cutting and nailing travel through a frame wall. Most Cincinnati homes are wrapped up inside a week, we confirm each day's working zone in the morning, and pets and home-office schedules get planned around rather than surprised." },
        ],
        columbus: [
          { q: "My whole subdivision's siding looks tired — replace or paint it?", a: "Aged vinyl takes paint poorly and briefly; it is a delay purchase, not a repair. Panel replacement with a modern gauge resets the wall for decades and fixes the underlying wrap while it is open." },
          { q: "What gauge should replacement panels be?", a: "A step or two heavier than the builder original, at minimum — .044 and up reads flatter, locks stiffer and takes central Ohio wind without chatter. We bring gauge samples so the difference is in your hands, not a spec sheet." },
          { q: "Can new vinyl handle the wind out here?", a: "Rated and fastened properly, comfortably. The failures you have seen are lock design and nailing schedule problems from the build era, not a verdict on the material." },
          { q: "Will it match the neighborhood's look?", a: "Modern lines carry the standard subdivision profiles plus better ones. Staying harmonious while stepping up quality is exactly the brief we hear most in Dublin and Westerville — it is very doable." },
          { q: "How fast is a typical replacement?", a: "Two to four working days for most two-stories: tear-off and wall correction first, then panels. Weather moves the schedule, never the standard." },
          { q: "Is now a bad time of year?", a: "Vinyl installs run year-round; cold-weather work simply respects the material's contraction with slightly different gapping. The calendar affects scheduling backlog more than quality." },
          { q: "Do you handle just one damaged elevation?", a: "Yes — a west wall that took the worst of a storm can be re-sided alone. We are candid about match visibility on the older profiles, and when several neighbors have the same single-wall damage we can often run them as one mobilization." },
          { q: "What areas around Columbus do your siding crews cover?", a: "The full metro from Galloway: Dublin, Hilliard, Westerville and Grove City most weeks, Worthington and Gahanna, and out through Pickerington and Reynoldsburg. If your subdivision is inside the outerbelt ring, we have almost certainly worked it." },
          { q: "Does new vinyl help resale?", a: "Fresh, straight siding is one of the highest-visibility exterior updates a listing can carry, and in subdivisions where every third house shows tired original panels, the contrast does real work. We will not invent a return percentage — but ask any local agent which houses photograph better." },
        ],
        "st-louis": [
          { q: "Why does vinyl wave and ripple on some St. Louis walls?", a: "Heat plus tight nailing. Our swing gives vinyl the largest movement range it sees anywhere we work, and a panel that cannot slide converts that movement into waves. Correct hanging prevents it entirely — the wavy wall next door was preventable." },
          { q: "Is dark vinyl a bad idea here?", a: "On west and south exposures, often yes — dark panel runs hot in August and ages ahead of the house. Modern formulations help; physics still gets a vote. We flag the risky combinations before you order them." },
          { q: "Vinyl or fiber cement for my gable?", a: "Small areas narrow the price gap, so gables are where Hardie tempts. But a well-hung vinyl gable over brick remains a perfectly good budget answer, and we quote the pair side by side rather than upselling by default." },
          { q: "Can hail-damaged vinyl go on an insurance claim?", a: "Cracked and holed panels from a documented storm frequently qualify. We photograph wall damage elevation by elevation — the same discipline as our roof documentation — so the conversation with your carrier starts from evidence." },
          { q: "How do repairs work if a panel breaks later?", a: "Panels unzip and swap individually when the profile is still made — we note your profile and color in the job file to make that future repair findable. Discontinued profiles are the honest risk; we tell you the match odds up front." },
          { q: "What does a ranch re-side run?", a: "South County's long simple walls are vinyl's best value case in the metro — high square footage per setup day. The free inspection turns that into a written number that holds." },
          { q: "How soon after hail should walls be looked at?", a: "Within a few weeks, while the damage dates cleanly to the storm. Vinyl cracks are unambiguous evidence when fresh; a year later the attribution conversation with a carrier gets harder than it needed to be." },
          { q: "Which parts of the metro do you side from Geyer Road?", a: "All of it: the city's gable work, the inner ring under the oaks, South County ranch country through Mehlville and Oakville, and west through Ballwin and Chesterfield. One crew standard, one written-quote process, everywhere." },
          { q: "Can soffit and fascia be done in the same visit?", a: "Almost always, and under the metro's oak canopy it is usually overdue — those boards live wet here. Same crew, same scaffold time, a fraction of the standalone price, and the whole roofline edge ends up matching instead of half-new." },
        ],
      }[m.slug]),
      depth: {
        cincinnati: {
          eyebrow: "About the material",
          heading: "Vinyl's case, made honestly",
          blocks: [
            { h: "Where it belongs here", p: [
              "Cincinnati's post-war rings — the ranches and split-levels of Blue Ash, Madeira, Fairfield, Landen — were built with simple elevations that quality vinyl suits perfectly. The material's case collapses only where architecture demands depth it cannot fake, and we draw that line with you house by house rather than pretending one answer covers a metro this varied.",
            ]},
            { h: "The canopy complication", p: [
              "Heavy shade keeps walls damp, and damp is vinyl's quiet enemy — not the panel, which shrugs it off, but the wall behind, which must be dry and sealed before panels close it in. Our tree-street installs treat the moisture barrier as the job and the vinyl as its cover. That order of priorities is most of what a decade of east-side tear-offs has taught us.",
            ]},
            { h: "Hail's sorting function", p: [
              "Spring hail sorts vinyl by age: new panels flex and shed it, brittle fifteen-year-old ones crack. If your walls took last spring's storm, the sorting already happened — we read walls after hail the way we read roofs, and cracked vinyl belongs on the same claim as bruised shingles.",
            ]},
            { h: "What a Cincinnati vinyl quote contains", p: [
              "It also names the crew's working plan: which elevation starts, where material stages, how landscaping and the neighbor's fence line get protected. On the tighter east-side lots that plan is the difference between a smooth week and a strained one, so it is written down like everything else.",
              "Panel spec with gauge named, the wall-preparation scope from the inspection, trim and accessory lines priced individually, haul-away, and the schedule. Nothing labeled miscellaneous, nothing to be determined later — if the tear-off changes the picture, the change order is written and signed before it is worked. That paperwork discipline is not bureaucracy; it is why our jobs end at the number they started at.",
            ]},
            { h: "A note on hillside houses", p: [
              "Cincinnati's slopes complicate siding logistics more than siding physics: staging on a grade, protecting the downhill landscaping, sequencing tear-off so debris never travels. Our crews work the hill streets constantly, and the quote reflects real access rather than a flat-lot assumption that falls apart on arrival day.",
            ]},
          ],
        },
        columbus: {
          eyebrow: "About the material",
          heading: "Second-generation vinyl, for the city that bought the first",
          blocks: [
            { h: "What the nineties bought", p: [
              "Columbus's boom subdivisions received the thinnest panel that met code, hung at production speed over minimally detailed walls. It lasted about as designed — twenty-five to thirty years — and its synchronized retirement across the metro is why re-siding quotes cluster by street here. The material was never wrong; the specification was minimal. Replacement is the chance to fix the spec.",
            ]},
            { h: "What second-generation means", p: [
              "Heavier gauge that locks stiffer and lies flatter. Finishes engineered for open-lot sun. Fastening schedules chosen for a wind fetch with no mature trees in it. And underneath, the wrap taped and the openings flashed the way the schedule skipped the first time. Same material class, roughly the same relative affordability — a categorically different wall.",
            ]},
            { h: "The lock is the spec", p: [
              "In central Ohio wind, a vinyl wall is only as good as its panel-to-panel lock. Modern lock designs grip through gusts that unzip the originals — it is the least visible upgrade in the catalog and, on open ground, the one that matters most. Ask to feel the difference on samples; it is immediately obvious in the hand.",
            ]},
            { h: "Reading your wall's build year", p: [
              "The same archaeology sets expectations honestly: a 1994 Hilliard wall will need more correction than a 2004 Westerville one, and the quotes will differ for that stated reason. Two neighbors comparing our numbers see the logic, not a mystery — which is exactly how quoting should work on streets where everyone talks.",
              "A practiced eye dates a Columbus vinyl wall within a few years from the profile, the lock style and the accessory details — and the date predicts the failure list. Pre-1995 walls hide the thinnest panel and the barest sheathing paper; the 2000s brought marginally better wrap and the same tight nailing. When we quote your street, that archaeology is already priced in, which is why our change-order rate on these jobs is nearly zero.",
            ]},
            { h: "Timing a street-wide problem", p: [
              "Because whole Columbus streets age together, the replacement market moves in waves — and the spring after a visible hail season is always the crowded one. Homeowners who book assessments in the quieter months get faster scheduling and the same pricing; the panels do not know what quarter it is. Worth knowing if your wall is close.",
            ]},
          ],
        },
        "st-louis": {
          eyebrow: "About the material",
          heading: "Engineering for the eighty-degree year",
          blocks: [
            { h: "The swing, quantified", p: [
              "A St. Louis wall cycles through roughly an eighty-degree working range every year, and vinyl responds to every degree — a long panel grows and shrinks by fractions of an inch across the seasons. None of that is a problem for a floating installation and all of it is fatal to a pinned one. Movement math is the first page of our vinyl spec here, not a footnote.",
            ]},
            { h: "August is the exam", p: [
              "Heat exposes every shortcut at once: tight nails become waves, thin panel oil-cans, dark colors on west walls go soft by afternoon. Our August-proofing is unglamorous — gauge, color counsel, hanging discipline — and it is why our summer callbacks are for new work, not repairs of our own.",
            ]},
            { h: "The brick-line detail", p: [
              "So much St. Louis vinyl terminates against masonry that the junction deserves its own paragraph: J-channel alone is not a water plan. Our brick-line details flash behind the channel so the joint sheds rather than collects — the difference shows up in the sheathing five years later, which is exactly why nobody skimps on it twice.",
            ]},
            { h: "Color strategy for the gradient", p: [
              "The strategy extends to accessories: trim, corner posts and shutters age on the same sun schedule as panels, and mixing new panel with sun-tired accessories shortchanges the result. Our St. Louis quotes bundle the accessory refresh by default, priced separately so you can decline it with open eyes.",
              "St. Louis rewards a specific color logic: lighter shades on the punished west and south walls, freedom everywhere else. Modern vinyl's fade resistance is genuinely improved, but physics still charges dark panels a premium here — more heat, more movement, more visible aging. We bring the exposure map to the color conversation so the pretty choice and the durable choice can be negotiated openly.",
            ]},
            { h: "Ranch economics, spelled out", p: [
              "A single-story ranch re-side is the best price-per-square vinyl work in the metro: long runs, minimal ladder time, few penetrations. It is also where sloppy lines show most, which keeps the discipline honest. If you own an Affton or Oakville ranch and have been assuming siding is out of budget, the free quote frequently comes as a pleasant surprise.",
            ]},
          ],
        },
      },
    },
  },
};

/**
 * Resolve a sub-service's depth block for one market.
 *
 * ── TWO SHAPES, AND WHICH ONE A PAGE SHOULD USE ──────────────────────────────────────────────
 *
 *   SHARED   depth: { eyebrow, heading, blocks: [...] }        one argument, all three markets
 *   PER-MARKET depth: { cincinnati: {...}, columbus: {...} }   a different argument per market
 *
 * Vinyl and James Hardie are SHARED on purpose: how a plank is fastened and what sits behind it is
 * the same in all three metros, and pretending otherwise would be the city-swapped copy this whole
 * rebuild exists to remove.
 *
 * Roof replacement and roof repair are PER-MARKET for the opposite reason. Their material and
 * process argument now lives on the national pages (/roofing/replacement/, /roofing/repair/), so a
 * shared block here would duplicate them and leave the market page saying nothing only it could
 * say. What a market page can say is what THIS climate and THIS building stock demand of the job —
 * which is different in each metro and would be factually wrong if swapped.
 *
 * A market with no entry renders no depth section, so these can be filled in one at a time.
 */
export const depthFor = (svc, marketSlug) => {
  const d = svc?.depth;
  if (!d) return null;
  return Array.isArray(d.blocks) ? d : (d[marketSlug] ?? null);
};

/** [{ market, hub, sub }] for every sub-service page in every market that offers the parent hub. */
export const subservicePaths = (markets) => {
  const out = [];
  for (const [market, m] of Object.entries(markets)) {
    for (const [hub, subs] of Object.entries(SUBSERVICES)) {
      if (!(m.services ?? []).includes(hub)) continue;
      for (const sub of Object.keys(subs)) out.push({ market, hub, sub });
    }
  }
  return out;
};
