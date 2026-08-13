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
      h1: (m) => `Roof Replacement in ${m.name}`,
      lead: (m) => `Full tear-off and replacement across ${m.region}, priced after someone has walked your roof — not from a satellite image.`,
      intro: (m, c) =>
        `A replacement starts with the decking, not the shingles. We strip the roof to the boards, replace anything soft, and only then talk about what goes back on. ${c.stock} That mix is why we quote after walking the roof: two houses on the same street can need very different work once the old layers come off.`,
      sections: [
        { title: "Tear-off, not an overlay", body: "Laying new shingles over old hides the decking and traps heat, which shortens the life of what you just paid for. We take it back to the boards so we can see what we are working with." },
        { title: "Decking and ventilation", body: "Soft decking gets replaced before anything goes over it. Intake and exhaust ventilation get sized while the roof is open — it is the easiest moment to fix airflow and the most expensive one to skip." },
        { title: "Materials", body: "Architectural asphalt shingles for most homes, impact-resistant where hail is a recurring problem, and metal or a low-slope system where the roof calls for it. We quote what the roof needs." },
        { title: "The finish", body: "New underlayment, ice-and-water membrane at the eaves and valleys, new flashing at every penetration. Old flashing caulked back into place is the most common leak we get called out to." },
      ],
      faq: (m, c) => [
        { q: "How long does a replacement take?", a: "A simple ranch is usually a single day. A larger two-storey with a complex roofline runs two to three. Weather moves the schedule and we tell you when it does." },
        { q: "Do I need a full replacement or a repair?", a: "The free inspection answers it. Age, the state of the decking and how widespread the damage is decide it, and we will say when a repair is the honest answer." },
        { q: `What does the ${m.name} weather do to a roof?`, a: c.weather },
        ...commonFaq(m),
      ],
    },

    "roof-repair": {
      label: "Roof Repair",
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
    },

    "insurance-storm-damage": {
      label: "Insurance & Storm Damage",
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
    },
  },

  siding: {
    "siding-replacement": {
      label: "Siding Replacement",
      h1: (m) => `Siding Replacement in ${m.name}`,
      lead: (m) => `Full re-siding across ${m.region}, installed by our own crews — most projects finished inside a week.`,
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
    },

    "james-hardie-siding": {
      label: "James Hardie Siding",
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
    },

    "vinyl-siding": {
      label: "Vinyl Siding",
      h1: (m) => `Vinyl Siding in ${m.name}`,
      lead: (m) => `Vinyl siding installed properly — the value option, and a good one when the details are right.`,
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
    },
  },
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
