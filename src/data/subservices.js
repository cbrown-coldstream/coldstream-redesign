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
    stock: "The east side runs to post-war ranches and split-levels through Blue Ash, Kenwood and Madeira, with a lot of 1920s and 1930s brick further in around Pleasant Ridge and Silverton. Mason, Landen and West Chester are mostly newer two-storeys on bigger footprints.",
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
    stock: "South County is mid-century ranches through Affton, Mehlville and Oakville — simple pitches, long runs. The city neighbourhoods around Tower Grove and The Hill are brick with parapet walls and low-slope rear additions, which is a different roof entirely. West County runs to larger, newer homes with complex rooflines.",
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
        { q: "How long does a replacement take?", a: "A simple ranch is usually a single day. A larger two-storey with a complex roofline runs two to three. Weather moves the schedule and we tell you when it does." },
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
              p: ["The older brick stock through the city neighbourhoods carries chimneys that were flashed once and sealed repeatedly since. Sealant on brick is a maintenance material with a life measured in a few years, and for every one of those years it looked fine from the ground.",
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
                  "We fasten to the specification the rating depends on, and take it up a step on exposed elevations. It costs a little labour and nothing in material."] },
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
        description: (m, c) => `Hail and wind damage across ${m.region}, documented the way an adjuster needs it and repaired start to finish. Free inspection.`,
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
                  "Every re-side we do is a chance to put that right, and it is the part of the job we would rather you asked about than the colour."] },
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
      // ── SEO TITLE AND DESCRIPTION, WRITTEN RATHER THAN DERIVED ──────────────────────────────
      // Derived from `h1` and `lead` before, which broke two ways at once: h1 is a sentence and
      // ran the title past 60 characters where Google truncates it, and `lead` carries no city, so
      // all three markets shipped the SAME meta description — the one signal that most directly
      // tells a crawler two pages are the same page. `cityState` puts the state code in, which is
      // what a local search actually matches on.
      seo: {
        title: (m) => `James Hardie Siding in ${m.cityState}`,
        description: (m, c) => `James Hardie fiber cement siding across ${m.region}, installed to the clearances the warranty depends on. Free inspection — call ${m.phone}.`,
      },
      h1: (m) => `James Hardie Fiber Cement Siding in ${m.name}`,
      lead: (m) => `Fiber cement siding installed by an Alliance Elite contractor — the option that holds its colour and takes a knock.`,
      intro: (m, c) =>
        `Fiber cement is the material we recommend most often, and the reason is straightforward: it holds paint far longer than vinyl and it does not crack when something hits it. ${c.weather} That temperature range is hard on a material that expands and contracts, and fiber cement moves less than most of the alternatives. We are a James Hardie Alliance Elite contractor, which means the crews are trained on the installation specifics the warranty depends on.`,
      sections: [
        { title: "Why fiber cement", body: "It holds colour, it stands up to impact, and it does not soften in heat. It costs more up front than vinyl and lasts longer." },
        { title: "ColorPlus and site-painted", body: "Factory-applied ColorPlus finishes hold longer than site painting and arrive consistent. Site painting gives you any colour you like. We quote both." },
        { title: "Installation is the whole thing", body: "Fastener spacing, clearance at the ground and the roofline, and the gap detail at butt joints are what the warranty rests on. Done wrong, the material is not the problem." },
        { title: "Trim and detailing", body: "Hardie trim at corners and openings so the whole elevation moves together and the joins stay tight." },
      ],
      faq: (m, c) => [
        { q: "Hardie or vinyl?", a: "Hardie costs more up front, lasts longer, holds colour better and takes an impact without cracking. Vinyl is less expensive and perfectly good when it is installed well. We quote both and let you decide." },
        { q: "Does it need painting?", a: "Eventually, but far less often than wood and much less often than most people expect. A factory ColorPlus finish goes longest." },
        { q: `Is it a good fit for houses in ${m.name}?`, a: `It suits the stock here well. ${c.stock}` },
        ...commonFaq(m),
      ],
      // ── PRODUCT DEPTH (team call follow-up, 2026-08-18) ────────────────────────────────────
      // Same problem as the vinyl page: strong product sections, ~19% of sentences on the product.
      // This is fiber cement specifically — weight, cutting, clearances and finish — and it is
      // written to be read next to the vinyl page by someone deciding between the two.
      depth: {
        eyebrow: "About the material",
        heading: "Fiber cement is a different job, not a different colour",
        intro: "James Hardie is cement, sand and cellulose. That makes it behave nothing like vinyl on the wall or in the hands of the crew fitting it.",
        blocks: [
          { h: "It is heavy, and that changes the crew",
            p: ["A fiber cement plank weighs several times what a vinyl panel does. It needs more hands, different fastening and a substrate that can carry it, and it does not forgive being hung on a wall nobody checked first.",
                "It is also cut rather than snapped. Cutting it releases silica dust, so it is cut with the right blade and the right control — which is a working practice, not a preference."] },
          { h: "Clearances are where installations fail",
            p: ["Fiber cement has specified gaps: above the roof line, above decking and horizontal surfaces, and at grade. Those clearances exist because the board will wick water if it sits in it, and wicked water in a freeze-thaw climate splits the board from the inside.",
                "It is the single most common thing we find wrong on fiber cement that somebody else fitted. The board is fine; it was installed tight to a roof and has been drinking for three winters."] },
          { h: "ColorPlus or site-painted",
            p: ["ColorPlus is finished in the factory — baked on, consistent, and it arrives that colour. Site-painted means primed board finished on the wall, which costs less and lets you choose any colour, but the finish is only as good as the day it was applied.",
                "Neither is wrong. Factory finish for longevity and consistency; site paint for colour freedom and for matching something existing. We will quote either and say which we would put on our own house."] },
          { h: "Why it suits this climate",
            p: ["Fiber cement does not soften in heat or grow brittle in cold, and it does not give insects anything to eat. In a market that crosses freezing repeatedly through the winter, dimensional stability is worth more than it sounds.",
                "The trade-off is honest: it costs more than vinyl, it is heavier to work with, and a bad installation is more expensive to put right. It is the better material and it is the less forgiving one."] },
        ],
      },
    },

    "vinyl-siding": {
      label: "Vinyl Siding",
      // ── SEO TITLE AND DESCRIPTION, WRITTEN RATHER THAN DERIVED ──────────────────────────────
      // Derived from `h1` and `lead` before, which broke two ways at once: h1 is a sentence and
      // ran the title past 60 characters where Google truncates it, and `lead` carries no city, so
      // all three markets shipped the SAME meta description — the one signal that most directly
      // tells a crawler two pages are the same page. `cityState` puts the state code in, which is
      // what a local search actually matches on.
      seo: {
        title: (m) => `Vinyl Siding in ${m.cityState}`,
        description: (m, c) => `Vinyl siding across ${m.region}, hung so it can move over a wall we actually inspected. Free inspection and a written quote.`,
      },
      h1: (m) => `Vinyl Siding in ${m.name}`,
      lead: (m) => `Vinyl siding installed so it can move, over a wall somebody actually looked at.`,
      intro: (m, c) =>
        `Vinyl gets a poor reputation it mostly does not deserve. Almost every vinyl complaint we are called to look at is an installation problem, not a material one: nailed too tight so it cannot move, no room left at the ends, or a water barrier behind it that was never taped. ${c.weather} Vinyl needs room to expand and contract, and a crew that leaves it that room gets decades out of it.`,
      sections: [
        { title: "Installed so it can move", body: "Nailed to allow movement, not pinned tight. Room left at the ends of every run. This is the difference between vinyl that lasts and vinyl that buckles." },
        { title: "What goes behind it", body: "House wrap lapped and taped, and flashing at every opening. The siding is the rain screen; the barrier behind it is what actually keeps the wall dry." },
        { title: "Insulated options", body: "Insulated backing adds a little R-value and a lot of rigidity, which makes the wall look flatter and quieter. Worth it on some elevations, not all." },
        { title: "Repairs and partial replacement", body: "Storm damage and cracked panels can often be swapped rather than re-siding a whole elevation, if the profile is still available." },
      ],
      faq: (m, c) => [
        { q: "How long does vinyl last?", a: "Decades, when it is installed with room to move and there is a sound water barrier behind it. The installation matters more than the brand." },
        { q: "Will it fade?", a: "Modern vinyl holds colour far better than it used to, and darker colours hold least well. We will tell you which of your choices is most likely to shift." },
        { q: "Can you match my existing siding?", a: "Sometimes. Profiles and colours get discontinued, so an exact match on an older house is not always possible — we will check before promising it." },
        ...commonFaq(m),
      ],
      // ── PRODUCT DEPTH (team call follow-up, 2026-08-18) ────────────────────────────────────
      // The page was 741 words with only about a fifth of its sentences mentioning vinyl at all —
      // four good product sections wrapped in shared boilerplate. This is the part that is about
      // the material: how it is fastened, what sits behind it, and what actually goes wrong.
      // Written for a homeowner choosing between vinyl and fiber cement, not for a crawler.
      depth: {
        eyebrow: "About the material",
        heading: "What decides whether vinyl looks right in ten years",
        intro: "Vinyl is the value option and it earns that honestly — but it is less forgiving of a bad installation than almost anything else on a house.",
        blocks: [
          { h: "It has to be hung loose, not nailed tight",
            p: ["A vinyl panel expands and contracts with temperature — noticeably, along its length, every day. It is designed to hang on the nail rather than be pinned by it, which means the nail head sits slightly proud and the panel slides behind it.",
                "Nail it tight and the panel has nowhere to go, so it buckles in the first hot week and stays buckled. Wavy vinyl on a wall is almost never a bad product. It is a crew that drove the nails home."] },
          { h: "The wall behind it does the work",
            p: ["Vinyl is a rain screen, not a seal. Water gets behind it by design and has to drain out, which makes the weather-resistant barrier, the flashing and the condition of the sheathing more important than the panel you chose.",
                "That is why we take the old siding off rather than going over it. Going over hides whatever is rotting underneath and adds a second layer for water to sit between."] },
          { h: "Insulated vinyl, and when it is worth it",
            p: ["Insulated panels have foam bonded to the back. They are stiffer, so they look flatter on the wall and sound less hollow, and they add a modest amount of R-value.",
                "The honest version: buy it for the flatness and the rigidity, not for the energy saving. If someone is selling insulated vinyl mainly on heating bills, ask them for the number in writing."] },
          { h: "Colour, and the repair problem",
            p: ["Darker colours hold heat and fade faster, and a south or west elevation ages ahead of the rest of the house. Modern formulations are far better than they were, but the sunny wall is still the one that shows age first.",
                "Matching matters later. Profiles and colours get discontinued, so a partial repair on a ten-year-old wall often cannot be matched exactly. We will tell you when a patch is going to be visible rather than doing it and letting you find out."] },
        ],
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
