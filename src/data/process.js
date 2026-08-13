// THE STEP SEQUENCES — what actually happens on a job, per trade, for ProcessScrub.astro.
//
// THIS COPY IS DELIBERATELY CLAIM-FREE, AND THAT IS THE WHOLE CONSTRAINT ON IT.
//
// Every factual assertion about Coldstream lives in claims.js and is gated there, so anything
// unsourced simply does not render. This file sits outside that gate — it is prose in a component,
// not a value the gate can null out — which makes it the easiest place on the site to reintroduce
// exactly the problem claims.js was written to remove. The live site's process copy is where
// "25+ years", "A+ rated" and "financing available" were woven into ordinary sentences, and once a
// claim is a clause in a paragraph nothing structural can strip it.
//
// So the rule here is narrower than the voice spec: DESCRIBE CRAFT, ASSERT NOTHING.
//
//   No timeframes      — not "in a day", "same week", "before the rain".
//   No prices          — no figures, no ranges, no "affordable", no financing.
//   No warranties      — not even the approved 25-year one. It is true and it belongs where the
//                        gate can see it, not narrated in a step.
//   No ratings, review counts, accreditations or certification tiers.
//   No superlatives and none of voice-spec's banned terms.
//
// What is left is what a crew lead would tell you standing in the driveway: the order of the work
// and why each part matters. That is the thing a homeowner deciding whether to call actually wants,
// and it is the one thing here that cannot be wrong.
//
// VOICE: brand/voice-spec.json. Plain and warm, "you" and "your home", short active sentences,
// roughly 8th-grade reading level, no hype and no urgency.
//
// Shape is { title, body }. The keys match the service keys in services.js, which is what lets a
// service page look its own sequence up rather than being handed one.

export const PROCESS = {
  roofing: [
    { title: "Tear-off",
      body: "We strip the old shingles back to the bare deck. That is when soft spots and old water damage turn up, and we show you what we find before anything covers it again." },
    { title: "Underlayment",
      body: "A water-resistant layer goes down over the deck, with extra protection in the valleys and along the eaves. It is the part you never see and the part doing the quiet work." },
    { title: "Shingles",
      body: "Shingles go on from the bottom up, each row lapping the one below it. Nail placement matters more than it looks — get it wrong and a roof ages years early." },
    { title: "Ridge cap",
      body: "Capped shingles finish the peak and the ridge vent lets hot air leave your attic. Then we run a magnet over the lawn and the drive until the nails are gone." },
  ],

  siding: [
    { title: "Sheathing",
      body: "The old siding comes off and we look at the sheathing underneath. Anything soft gets replaced now, while it is open and easy to reach." },
    { title: "House wrap",
      body: "A weather-resistant barrier goes over the sheathing and gets taped at the seams. It sheds the wind-driven rain that finds its way past any siding." },
    { title: "Siding",
      body: "Boards go on from the bottom up, each course lapping the one below. Straight lines across a whole wall come from setting that first course right." },
    { title: "Trim",
      body: "Corner boards and window trim close the edges. They cover the cut ends and keep water out of the seams siding alone cannot protect." },
  ],

  gutters: [
    { title: "Fascia",
      body: "We start at the fascia board behind your gutter. If an old leak has left it soft, it gets sorted first — nothing should hang off wood that cannot hold it." },
    { title: "Hangers",
      body: "Hidden hangers go on at even spacing along the run. A full gutter in heavy rain is heavier than people expect, so where these land matters." },
    { title: "The run",
      body: "A seamless length sets into the hangers, pitched so water keeps moving toward the outlet instead of standing in the middle." },
    { title: "Downspout",
      body: "The downspout ties in at the corner and carries the water down and away from your foundation, which is the whole reason any of it is up there." },
  ],
};

// Headings live beside the steps so a template does not have to build one from a service label —
// "How gutters actually goes on" is what that produces, and grammar is not worth a helper.
export const PROCESS_INTRO = {
  roofing: {
    eyebrow: "On the roof",
    heading: "How a roof actually goes on.",
    intro: "Most people never watch their own roof get replaced. Here is what the crew is doing up there, in the order it happens.",
  },
  siding: {
    eyebrow: "On the wall",
    heading: "How siding actually goes on.",
    intro: "Siding is mostly the parts you stop seeing once it is finished. Here is the order the wall goes back together in.",
  },
  gutters: {
    eyebrow: "At the eave",
    heading: "How gutters actually go on.",
    intro: "A gutter is a simple thing that fails in ways that are not. Here is what goes up, in order, and what each part is for.",
  },
};
