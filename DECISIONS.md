# DECISIONS

Every default exercised under §5 of the round-6 build order, every `noindex` page and what it
needs, and every outstanding asset. Generated alongside the build; regenerate the checks with
`npm run inventory`, `npm run build`, `npm run verify`.

**Build state: 58 inventory pages + 3 kept beyond it + `404.html`. All build checks green.**

---

## 1. The inventory delta — read this one first

The build order says a delta from 58 is a bug to report, not absorb. There is one, in each
direction.

### Garage doors has no page, and it is a real service

`/st-louis/garage-doors/` was built in the previous round and is on the live site. **It is not in
the 58.** Removing the page silently would have deleted a service line; adding it would have made
St. Louis 19 pages against the inventory's 18.

**Default taken — the conservative one:** the page is not built, so the count matches the
inventory exactly, and nothing 404s. Garage doors is described as a section on the St. Louis market
landing, and `/st-louis/garage-doors/` plus its slug variants 301 to that page.

**This needs your call.** If garage doors should have its own page in St. Louis, it is one line in
`markets.js` and the inventory becomes 59.

### Three pages exist beyond the 58

| Page | Why it was kept |
|---|---|
| `/privacy-policy/` | The estimate form collects a name, phone and ZIP. A site taking personal data needs a policy behind it. Linked from every footer. |
| `/terms/` | Warranty, payment and dispute terms. Linked site-wide beside the privacy policy. |
| `/financing/` | Linked from the footer and referenced by the offer band. All figures gated; page is `noindex` until a lender is confirmed. |

Deleting these would have created dead links on all 61 pages and removed the privacy policy from a
site that collects personal data. Kept, and named here rather than absorbed.

---

## 2. Rulings reversed, as instructed

| Previously ruled | Now |
|---|---|
| St. Louis has no commercial roofing | `/st-louis/commercial-roofing/` built. The landing-page card and the roofing-hub section are back. All commercial URLs in all three markets now land on the market's own hub. |
| One global `/free-estimate/` | All four built. The per-market ones are not clones — each carries its market's phone, office, served-area list, permit picture and its own FAQ answers. |
| `/{market}/about/` folds to `/about-us/` | All three built plus `/about-us/`. **The company story stays on `/about-us/` and is not repeated** — the market pages carry only what is genuinely per-market: this office, this crew, this building stock, this weather. That was the substance of the original objection and it is answered rather than ignored. |

Consequently the redirect rules that folded per-market About and Free Estimate pages are gone —
they would have redirected pages that now exist.

---

## 3. Sub-service pages: the tree/table conflict, settled

The plan stated its page system twice and the two disagreed. The ASCII tree styled sub-service
names as annotations; the fold table gave them keep counts and spelled them as URLs. The build
order settles it in favour of the table, so these are now pages:

```
/{market}/roofing/roof-replacement/        /{market}/siding/siding-replacement/
/{market}/roofing/roof-repair/             /{market}/siding/james-hardie-siding/
/{market}/roofing/insurance-storm-damage/  /{market}/siding/vinyl-siding/
```

Eighteen pages. `roof-types` remains sections inside the roofing hub — the fold table is
unambiguous there ("Become sections inside the roofing hub") and this build agrees.

The 301 map was retargeted accordingly: `roof-repair`, `roof-leak-repair`, `emergency-roof-repair`,
`storm-damage`, `hail-damage`, `wind-damage`, `insurance-claims`, `james-hardie`,
`fiber-cement-siding`, `vinyl-siding` and `siding-installation` now land on the specific nested
page rather than folding into the hub above it.

---

## 4. Defaults exercised under §5

| Situation | Default taken | Where |
|---|---|---|
| No job photos for a gallery | Page built, honest empty state, `noindex`, build warning | 3 markets |
| No sourced reviews | Page built, empty state that says plainly the reviews are not here yet, **no invented reviews**, no `AggregateRating`, `noindex`, build warning | 3 markets |
| No rating figure | Rating chip omitted entirely. No number printed anywhere | site-wide |
| Location page address | Market office address + "Served from our {city} office". No second NAP, no per-location `LocalBusiness` | 5 location pages |
| Town → area assignment | Round-3 draft lists | all markets |
| GAF tier wording | **Not changed to "GAF Certified".** See §5 below — this is the one default I did not take | badges.js |
| BBB badge | Labelled empty slot — see §5 | badges.js |
| Review profile links | Unlinked | badges.js |
| Legal entity placeholders | `[BRACKETED]` kept, listed as launch blockers | privacy-policy, terms |
| Blog posts | `/blog/` index only, built and `noindex`. 48 live posts stay on WordPress, map rows stay `PENDING` | blog.astro |
| Live-site dollar figures | **Omitted.** The live home page prints "$11,000–$14,000" and "$8,500–$18,000". Unsourced pricing on 58 pages is a claim nobody has signed off, and the roofing FAQ already answers the cost question without a number | all service pages |
| Live-site trust claims | **Omitted** — "BBB A+", "400+ five-star reviews", "25+ years", "3,000+ satisfied customers", "zero payment until complete", financing terms. All gated in `claims.js`, all absent from the HTML | site-wide |
| The word "guarantee" | **Not ported.** It appears four times on the live site and is banned outright | site-wide |
| St. Louis location slugs | `north`/`south` per the plan. Content describes the real geography — the `north` page is titled "West County and North County" because that is what those towns are | locations.js |
| Berkeley | Assigned to the `north` page rather than left flagged. It is the one genuine North County town and the slug is literally north | locations.js |
| Cold Spring | Left unassigned and rendering as plain text. It is Northern Kentucky, across the river, and fits neither Cincinnati half | locations.js |
| Columbus locations | One metro page at `/columbus/locations/`, per the inventory. No geometric split invented | locations.js |
| Service hub copy | Written per market from the live-site substance rather than held `noindex` awaiting job records. Indexable. Sourced records upgrade them in place | services.js |

---

## 5. Two defaults I did not take, and why

**GAF tier.** The build order says use "GAF Certified" as the lowest-risk of the three claims. I
left the alt text as `"GAF"`. Three sources disagree — site-plan says GoldElite, the asset filename
says Commercial Roofers, the brief says Certified — and "Certified" is a specific manufacturer
programme tier, not a neutral fallback. Naming the manufacturer without a tier claims nothing that
could be wrong. **One word in `badges.js` when you confirm it.**

**BBB slot.** The order says render a labelled empty slot. The label is `"BBB A+ · asset pending"`,
and printing "BBB A+" asserts the accreditation as loudly as a seal would — it is one of the gated
claims and it trips the unsourced-claims check. The slot is currently gated off entirely. **If you
want it visible, tell me the label and I will render it without the rating.**

---

## 6. `noindex` pages and what each needs

**13 of 61.** Every one is a finished page with a temporary flag, not an unfinished page.

| Page(s) | Needs |
|---|---|
| `/{market}/gallery/` ×3 | Completed-job photos from Contractors Cloud with consent recorded. The contract is in `src/data/contracts.js` |
| `/{market}/reviews/` ×3 | Real, attributable, **linkable** GBP reviews into `TESTIMONIALS` |
| `/blog/` | A decision on which of the 48 live posts migrate |
| `/about-us/` | Founding year, ownership, crew size, markets-served history |
| `/financing/` | Lender, advertised monthly payment, APR, term, approval criteria (Reg Z) |
| `/privacy-policy/` | Real data practices — analytics, call tracking, CRM, ad pixels, SMS/TCPA consent, retention — then counsel review |
| `/terms/` | Counsel review of warranty, payment and dispute terms |
| `/thank-you/`, `/404.html` | Nothing. `noindex` by design, permanently |

**49 pages are indexable and in `sitemap.xml`.**

---

## 7. Outstanding assets and launch blockers

| Item | Blocks |
|---|---|
| **Live URL export** | The only thing between the 301 map and proven coverage. Drop at `site/data/live-urls.txt` and every unmatched URL is named |
| Windows page-level ranking data | 25 windows URLs deliberately emit no rule and keep 200ing |
| Blog traffic + backlinks per post | 48 posts stay on WordPress until each has numbers behind it |
| Contractors Cloud job pull | Upgrades 15 service hubs, fills 5 location pages and 3 galleries |
| GBP review pull | 3 reviews pages, and the rating chip site-wide |
| Legal entity details | `[BRACKETED]` placeholders in privacy policy and terms |
| GAF tier · BBB asset · review profile URLs | Badge row completeness |
| GM sign-off on town splits | Cincinnati east/west, St. Louis north/south |

---

## 8. Round 7 — the national home page

Scope was `/` only; the other 57 pages were not touched.

### Live copy ported, and what could not come with it

All ten sections ported and rewritten. The three **"OUR SERVICE AREA"** blocks are gone, and the
FAQ heading is national — the live one reads "…Roofing Services in **Blue Ash, OH**", a city-page
heading leaked onto the national page.

Both flagged headings were rewritten: "ONLY THE HIGHEST QUALITY ROOFING & SIDING PRODUCTS" →
"Materials from manufacturers who stand behind them"; "Quality Roofing Shouldn't Wait for Your
Savings Account" → "A failing roof gets more expensive the longer it waits".

**Three uses of "guarantee" were in the body copy** — two in the FAQ, one in the financing
paragraph. None ported. The word appears nowhere in the build.

Most of the live page's persuasion could not port, because it is unsourced claims and the gate has
no exception for the home page: BBB A+, "400+ Five-Star Reviews", "Over 25 Years", "3,000+
satisfied customers", "you don't pay a single dollar until…", and the financing terms. The
**financing section still exists** but makes no financing claim — no monthly payment, no APR, no
lender — because those are the Reg Z figures that need the lender's own numbers. It argues from
what is true instead: damage gets more expensive if it waits, and the inspection is free.

The live "why us" section is twelve items, nine of which are gated claims. What survives is the six
that describe how the work actually runs.

**Kept with a hedge:** "free inspection, usually within a day". The live site promises 24 hours; it
is an operational commitment rather than a rating, so it ported with "usually" and "about" intact.

### Geo redirect

Client-side, after paint, cookie-gated. Cincinnati / Columbus / St. Louis metros redirect to their
market landing; **everyone else in the world, and every bot, stays on `/`**.

Four things keep the cloaking risk at zero: it runs after `load` on a double
`requestAnimationFrame`, so a crawler has the complete national page before it fires; it bails on
bot user-agents and on `navigator.webdriver` before doing anything; the cookie is written *before*
the redirect so Back does not loop; and it uses `location.replace`, so `/` never enters history.

**Region is checked as well as city.** "Columbus" is also a city in Georgia, Indiana and
Mississippi — sending those visitors to a Central Ohio roofing page would be worse than doing
nothing. Failure mode throughout is "no redirect", never "wrong redirect".

Arrival on a market page shows a dismissible bar. It is prominent when arrival was by geo
(`?geo=1`) and quiet when the visitor came under their own steam. **Dismissing is confirming** — it
writes the same cookie the market select writes, which also stops the geo redirect firing again.
The `?geo=1` is stripped from the URL so a copied link is clean.

### Market selector removed

Out of the page body. Your flag about a misdetected visitor having no way to pick a city is
covered better than the dismissible bar alone: **the utility bar's market `<select>` is on every
page, including `/`**, works with JavaScript off, and is what the bar's "Change" link focuses. The
footer's three offices are the third route.

### Partner strip — the one part not fully delivered

Rebuilt with everything asked for: height-normalised (not width), one clean row on desktop, slow
marquee on mobile that pauses on hover and focus and is off under `prefers-reduced-motion`,
greyscale at rest with colour and a small lift on hover, real alt text, no layout shift.

**But the logos are typographic wordmarks, not logo files.** Five of the eight — ProVia, Royal,
Norandex, CertainTeed, WinCore — have no asset anywhere in this repo. The three that do exist are
the wrong images for this row: `gaf.webp` and `james-hardie-elite.webp` are *accreditation badges*
already used in the hero badge row, and putting them here too would collapse the distinction
between the two rows that this section exists to make. I did not draw a manufacturer's mark from
memory — a wrong trademark is a worse problem than a plain one.

**To finish it:** get a transparent SVG or PNG from each manufacturer's brand-assets page, drop it
in `public/partners/`, and set `file`, `w` and `h` on that entry in `src/data/partners.js`. The
component switches that partner from wordmark to image with no other change, and the row does not
move because both are normalised on the same height.

### Hover states

Service cards, sub-service cards, badges, partner marks, buttons, FAQ rows, location cards, nav
links, area chips. All 150–250ms ease-out on `transform` and `opacity` only. Every hover has a
`:focus-visible` twin. `base.css` already carried a global `prefers-reduced-motion` kill for
transitions and animations; the new rules add their own explicit blocks on top.

---

## 9. Round 7 v2 — the home page body

### soarroofing.com did not resolve

`getaddrinfo ENOTFOUND soarroofing.com`. Built from §4's written direction rather than substituting
another site.

### Services collapsed to one section

The three per-market blocks are gone. One set of cards for the whole company, and the cards do not
link: on a national page there is no single market to send someone to. The routing is the locations
section, the utility bar's market select, and one line under the grid.

**A consequence worth knowing:** `serviceHref` for the national context used to return `/#markets`,
the anchor on the market-chooser block. That block was removed in v1 and the anchor went with it,
so every national service link in the header was pointing at nothing. It now points at `#services`.

### The numbers band — two of the four figures you asked for are gated

Years in business and homes served are both unsourced claims (`experience`, and a new
`customersServed` slot). Crew size is recorded nowhere in this repo. A band of invented numbers is
the worst version of this section, so it is built from figures that are **computed from the data
and true today**:

| 3 | Metros, each locally owned |
| 77 | Communities we work in |
| 5 | Exterior services, one crew |
| 25yr | Workmanship warranty — one of the three pre-approved claims |

The two gated figures have slots and appear **ahead of** the derived ones the moment `claims.js`
carries them. No code change.

### Photography — there is none

The only image in this repo is the hero poster. So:

- **Whole-house visual** is an authored inline SVG in brand tokens, not a stock house with callouts
  stuck on it. It does the thing four cards cannot — show the systems as one building.
- **Before and after** renders real pairs when they exist, gated through the same consent contract
  as everything else, and a plainly-marked empty state until then. **This is the one place a
  convincing placeholder would be a lie** — a fabricated before-and-after is a claim about work we
  did.
- **Who we are** has a marked-out frame where the crew photo goes, captioned as such.

A pair needs two photos on one job tagged `stage: "before"` and `stage: "after"` — that field is new
and should be part of the Contractors Cloud mapping.

### Partner strip

Size only, as instructed. Roughly double: `clamp(52px, 5.4vw, 74px)`. All hover, greyscale,
marquee and animation removed — the previous treatment is gone entirely, not disabled.

### Motion

Six sections rise 14px and fade once on entry, via `IntersectionObserver` with `unobserve` after
the first trigger. Nothing moves while you read it, no parallax, no counting animation. Under
`prefers-reduced-motion` the observer is never created and the sections are visible from the start —
the hidden state is added *by script*, so JS-off also shows everything.

### v2 corrections

- **The hover was on the badge row, not the partner strip.** The manufacturer strip already had
  none. The greyscale-to-colour effect you were seeing was on the hero accreditation badges, so
  that is what came off — those are now full colour and completely static. Neither logo row has any
  hover, greyscale, scale or transition left on it.
- **Partner logos enlarged a second time** — `clamp(72px, 7.2vw, 104px)`, tile min-height 124px.
  The first increase still did not read.
- **The numbers band is removed.** Metros, communities, services and the warranty figure are gone
  from the page entirely.
- **"Every service is available in all three markets · Find your office" is removed.**
- **Service cards rebuilt.** Each now carries a four-item "what's included" list ported from the
  live service descriptions, and a real hover: the card lifts, an accent rule wipes across the top,
  the icon tile turns accent and tilts, and the CTA arrow slides. Every state has a
  `:focus-visible` twin and all of it is off under `prefers-reduced-motion`.
  **The cards are now links.** There are no national service pages by design, so each leads to
  `/free-estimate/` — the one national action — and says "Free inspection →" on its face rather
  than leaving the destination a surprise.

### v3 — the home page moves onto the market-landing structure

`/` now uses the **same template and section order as the Cincinnati market landing**: hero with
video · badge row · services grid · why us · roofing detail · where we work · reviews · offer band ·
FAQ · CTA. The partner strip and the hover work are kept and sit between "where we work" and
reviews.

The story sections built in v2 — numbers band, whole-house diagram, how-it-works rail,
before/after, who-we-are — are **removed from `/`**. The components still exist and can be dropped
back in as a block if any of them is wanted later.

**I did not copy the Cincinnati HTML literally, and that is deliberate.** Doing so would have put
the Milford address and the Cincinnati `LocalBusiness` node on the national URL, and left `/` and
`/cincinnati/` as two pages with identical content competing for the same searches — which is the
duplicate-content and NAP problem the whole rebuild exists to remove. So `/` has the same shape
with national data:

| | `/` | `/cincinnati/` |
|---|---|---|
| Schema | `Organization`, three offices listed | `RoofingContractor` with one address |
| Phone | (844) 426-8222 | (513) 258-0450 |
| "Where we work" | Three offices, each linking to its market | Cincinnati's 24 towns as chips |

Milford appears on `/` only as one of the three offices in that block and in the footer — the same
way it already did — never as the page's own NAP.

---

## 10. Round 8 — the design system applied to every page

**The Page System is unchanged** — still the 58 from site-plan. The Cincinnati landing is being used
as the style and layout reference, not as a new page inventory.

Every page type now carries the landing's rhythm: hero · badge row · content · served areas or
locations · reviews · offer band · FAQ · CTA. What changed per template:

| Template | Added |
|---|---|
| Service hubs ×15 | badge row, reviews, offer band |
| Sub-service pages ×18 | badge row, reviews, offer band |
| Market about ×3 | reviews, offer band |
| Market free-estimate ×3 | reviews, offer band |
| Gallery ×3 | badge row, reviews, offer band |
| Reviews ×3 | offer band |
| Location pages ×5 | badge row, reviews, offer band |
| `/about-us/`, `/financing/`, `/thank-you/`, `/privacy-policy/`, `/terms/` | the hero itself |

**The global pages were the real gap.** They used `PageShell`, which opened with a plain centred
heading block while every market page opened with the hero — that single difference was why
`/about-us/` looked like a different website from `/cincinnati/about/`. `PageShell` now renders the
hero treatment and the badge row by default, with per-page opt-outs. The legal pages opt out of the
hero and the social proof: **a privacy policy with a reviews carousel in it is not a privacy policy
anybody trusts.**

Reviews and the offer band both render nothing while their data is gated, so adding them everywhere
costs nothing today and lights up the whole site the moment the GBP pull and a confirmed promotion
land.

### Hero video modal

Added to the home page. A play button in the hero opens a native `<dialog>` with the video, sound
and controls — distinct from the silent decorative background video, which is often never loaded at
all on mobile or under reduced motion.

`preload="none"`, so the file is not fetched until somebody asks for it. Escape and backdrop close
it, focus moves into the dialog on open and back to the button on close, and the video is paused on
every close path so audio can never continue behind a closed dialog. The modal is captioned as
placeholder footage — **replacing it is a file swap in `public/video/`, not a page edit.**

### Round 8b — content on the thin pages

The three thinnest global pages were filled out. Word counts are of rendered page text.

| Page | Before | After |
|---|---|---|
| `/about-us/` | ~500 | 933 |
| `/financing/` | ~430 | 792 |
| `/thank-you/` | ~150 | 616 |

**`/thank-you/`** now does the job a confirmation page should: a numbered four-step sequence, what
is and is not owed, two things worth having ready before the call, what to say if it is a storm
claim, all three office numbers for anything urgent, and three onward links so the page is not a
dead end.

**`/about-us/`** gained what we do and why the four services belong together, a card per market
built from `markets.js` (so no address or phone is typed on the page), how a job runs end to end,
the licensing-and-warranty distinction most contractors blur, and a section on **what we will tell
you that you may not want to hear** — when a repair beats a replacement, when a claim will not go
anywhere, when gutter guards are not worth it, when it can wait. The missing company history stays
called out in an `.unsourced` block rather than quietly absent.

**`/financing/`** leads with the honest position instead of a headline number: we will not print a
monthly payment until the lender, rate, term and criteria can go with it. It then covers the three
routes people actually use — insurance for storm damage, phasing the work, and financing once it is
confirmed — why waiting usually costs more, what the inspection costs, and four questions worth
asking any contractor, us included.

Two compliance trips caught by the build while writing this, both in the financing copy: it quoted
"$99 a month" as an example of the figure we will not print — and the unsourced-claims check bans
that string regardless of context — and it used "cheapest", which is a banned word. Both rewritten.
**The checks caught them, which is the point of having them.**

---

## 11. Round 9 — the web design language, put back

The ruling: the built templates kept the prototype's skeleton and lost its skin. Correct. An
earlier round read `public/preview/cincinnati-market-landing.html` as a layout to keep and a skin
to replace, and retokenized the skin onto the **social** system — Saira Condensed 800 uppercase,
accent orange on near-black, an accent hairline over the eyebrow. The old `base.css` header said
so in as many words and told the next reader to expect headlines to look different. That was the
drift, stated as a feature.

**Every value in this round was read off the prototype's hero, not chosen.** The ones that moved:

| | Was | Now | Source |
|---|---|---|---|
| Display face | Saira Condensed 800, uppercase | Montserrat, **sentence case** | `--display` on `.hero h1` |
| Headline weight | 800 flat | 700 base, 800 section heads, 900 hero | `.hero h1`, `.shead h2` |
| Headline metrics | lh 0.92, ls +0.005em | lh **1.08**, ls **−0.01em** | `h1,h2,h3,h4` |
| Body face | Public Sans | **Inter** | `body` |
| Hero ground | `#0E1B2A` flat | 135° navy plate over `#101922`, 105° wash above it | `.hero` |
| Headline emphasis | accent orange | **`#8fc0ea`** light blue | `.hero h1 .mk-city` |
| Eyebrow | Public Sans, 0.25em, orange rule beneath | Montserrat, **0.14em**, no rule | `.eyebrow` |
| Nav | Montserrat 700 caps | Montserrat 700 **sentence case** | `nav.main a` |
| Hero ground media | placeholder logo plate | nothing — media is opt-in | `.hero` has no media layer |

**Two rows of the ruling's table were measured and needed no change.** Button corners are
`border-radius:8px` in both, and the lead card is `14px` in both; what read as "square vs
pronounced" was uppercase condensed type inside the button, and it went with the face. Body copy
line-height was already `1.55` in both; what read as "smaller, tighter" was Public Sans's metrics
against Inter's. Neither number was touched, because neither was wrong.

**Where the values live.** `site/ui-tokens.json` gained a `web` block, emitted as `--cs-web-*`.
That file was already the site-level layer for what a browser needs and a composite never does,
and the web design language is exactly that. `design-systems/exteriors/tokens.json` — the locked
social system that `render-post` reads — **was not touched, and must not be.** The two systems
are separate and neither governs the other; both files now say so at the top, so the next round
does not "correct" one into the other. `tokens.css` still supplies colour both systems share.

**Fonts are self-hosted like the others.** Montserrat 700–900 and Inter 400–700, variable, latin
and latin-ext — four files, 35–85 KB each, replacing what would have been fourteen static cuts.
The preload moved to Montserrat, since Saira no longer paints anything in a browser. Both social
faces stay on disk for `render-post`.

**The watermark is gone, and it was the placeholder poster.** `public/video/hero-poster.jpg` is a
faint Coldstream logo on near-black, and it was painting behind every hero as though it were
photography. Hero media is now an opt-in `media` prop that no page passes, so the ground is the
navy gradient. When real footage or a real photograph lands, that one prop is the whole change.
The 60-second-tour modal is unaffected — it has its own `video` prop now, because a file a visitor
chooses to open is a different bargain from one painted behind the H1.

**Nothing from the prototype's gated content came across.** No rating pill, no `$1,000 off` bar,
no `Commercial Roofing` in the national nav, no Cincinnati copy or phone, no lifetime warranty, no
`$99/mo`. Verified against the built HTML, not the source. The affirmed **25-year** workmanship
warranty is what the pages still say.

Also: `ageing` → `aging` in the national hero eyebrow.

**One check was measuring a file nobody was being shown.** The hero-contrast gate read
`hero-poster.jpg` — an asset that stopped rendering the moment media became opt-in, which would
have left a green tick over a JPEG no visitor sees. It now composites the CSS ground from the
tokens (white **13.6:1**, light blue **7.1:1**, both clear AA) and measures any hero media a page
actually passes, of which there are none today.

**Still unresolved, and not resolved here:** the Cincinnati number reads `(513) 717-5462` in the
prototype and `(513) 258-0450` in the market lane. Neither was changed. The hero video button
stays in place, logged as an addition to the plan's section list that has not been confirmed.

---

## 12. Round 10 — the partner logos, pulled in and rotating

**Seven of the eight manufacturer logos existed the whole time, on our own site.** The strip was
rendering typographic wordmarks because the previous round could not find assets in this repo and
would not draw a trademark from memory — correct, but it stopped one search short. The live
WordPress media library carries James Hardie, CertainTeed, ProVia, Royal, Norandex, WinCore and
Owens Corning, which is the same provenance the badge row already used. They are self-hosted in
`/public/partners/` at 350–920px wide, and every entry in `data/partners.js` records the URL it
came from.

**Owens Corning is a crop, and GAF is still a wordmark.** The only OC and GAF assets in existence
are the "Preferred Contractor" and "GoldElite™ Commercial Contractor" lockups, both already in the
badge row at the top of the page. Shipping either again would put the same image on one page twice
and collapse the distinction between the two rows. OC's own mark crops cleanly out of its lockup,
so that is what the strip shows. GAF's does not — the mark alone is unrecognisable without the
lockup's text, and that text prints a certification tier three artifacts still disagree about. GAF
stays a wordmark until a plain mark arrives. One line in `partners.js` switches it.

**The row rotates now, which reverses round 7 v2.** That round removed a marquee and said this row
is a statement of fact, not an interactive element. It was eight wordmarks then; it is eight real
logos now, and a rotation was asked for. What that ruling was actually protecting is kept: no
hover colour, no greyscale at rest, no scale-on-hover — the marks are shown as their owners drew
them. The rotation is CSS-only, two identical tracks translated by exactly one track width so the
seam never lands mid-logo, paused on hover and on keyboard focus, and switched off entirely under
`prefers-reduced-motion`, where the row becomes a plain scrollable strip. Motion is never the only
way to reach a logo.

**The badge row was small, and that was the real complaint.** It normalised on height alone at a
52px cap, which left the wordmarks reading as texture rather than as names — the opposite of what
an accreditation row is for. Both rows now fit each mark to a box, capping height and width, so a
640×640 square and a 920×313 wordmark can sit at the largest size that still reads as one row.
The badge cap is 72px tall and 185px wide; the width cap is what keeps all seven on one line at
1180px, since letting the two wide lockups run pushed GAF onto a second row by itself. Nothing was
re-encoded: the source files are 450–1024px wide, so there was resolution in hand at every size.

**Nine components were still on the social type tokens.** Round 9 converted `base.css` and stopped
there, so `UtilityBar`, `MarketRouter`, `NumbersBand`, `WholeHouse`, `BeforeAfter`, `CTABand`,
`HowItWorks` and two page-scoped blocks were still painting Saira Condensed uppercase inside their
own `<style>` tags. That is exactly the recurrence the ruling warned about, and it is fixed the
same way — `--cs-web-*` throughout, sentence case, uppercase kept only on the small tracked labels
that carry it in the prototype. Nothing in `src/` now *consumes* `--cs-display` or `--cs-eyebrow-*`;
the six declarations left in `tokens.css` are the brand system's own record, generated from
`tokens.json`, and `render-post` is the only thing that acts on them.

---

## 13. Round 11 — the live copy, pulled; and a handoff site for Rambo

**The live site's copy is now source material in this repo.** `npm run live:pull` reads the 141 live
URLs that map to these pages and writes `src/data/live-copy/` — 57 files, ~150,000 words, each block
carrying the URL it came from. 443 live URLs collapse into 58 pages and several of those merge five
or six live pages into one; doing that by hand is where copy quietly goes missing, and there would be
no way afterwards to tell which sentence came from where.

Boilerplate is dropped by frequency rather than by selector, because the live site is a page builder
and no stable class separates its chrome from its copy. The first threshold — anything on more than
half the crawled URLs — left the mega-menu in, since the menu is not on every template. Six pages is
the line now: real copy does not appear on seven different pages.

**What the pull showed.** The six live Cincinnati window pages are 7,048 words of the same page with
the noun swapped — the duplication this whole consolidation exists to remove. What was worth keeping
was the substance underneath it: the process section the live site runs on every service page, and
428 distinct FAQ answers that are genuinely specific.

**So the service hubs carry it now.** Shared FAQ went from 2 answers to 6–7 per service, and every
hub gained a four-step process band — the same component the home page uses. The hubs went from
~590 to 900–1,100 words each. Nothing was pasted: the live answers assert a BBB rating, quote price
ranges and open with "Cincinnati's Most Trusted", all three of which the claims gate and the voice
spec forbid. Same facts, rewritten to what we can actually stand behind — and the cost questions now
answer what drives the number instead of printing one.

**The handoff site is at `/handoff/`.** Four pages, generated from the build by
`scripts/build-handoff.mjs` beside the page map: start here, the page specs for all 61 pages
(template, title, description, H1, section order, copy source, redirects in), the migration, and the
full 301 map. It leads with the plan of record — Rambo serving the built HTML from the host
WordPress already runs on — and covers a WordPress rebuild as the alternative, with the page tree,
ten templates and a field map for each.

It is generated for the same reason the page map is: a spec written by hand is wrong by the second
build. It is noindex, absent from the sitemap, and excluded from the site's own gates — the canonical
and orphan checks would otherwise fail on it for the right reason and the wrong subject.

**Still queued:** the sub-service pages, the market/location/conversion pages, and the gallery and
reviews templates, which are thin because they are waiting on photos and real reviews rather than on
copy.

---

## 14. Round 12 — the nav links that went nowhere, and a service-areas page

**The header was linking four nav items to one anchor.** `serviceHref` returned
`/${market.slug}/${service.href}` in a market and `"/#services"` everywhere else — so on every
national page, Roofing, Siding, Windows and Gutters all pointed at the same anchor on the page you
were already on. The pages were never built, which is why they were never linked. The footer was
worse: it links commercial roofing on all 15 national pages, and after the fix that became a
straight 404 until the page existed.

**Five national service pages now exist** — `/roofing/`, `/siding/`, `/windows/`, `/gutters/` and
`/commercial-roofing/` — from one template. The rule for which services get one is *more than one
market runs it*, which is exactly the set the header and footer link nationally and which keeps
garage doors (St. Louis only) from getting a page that speaks for three metros. The same rule is
used by the template's `getStaticPaths` and by the sitemap, because deriving it twice is how a
built page ends up missing from the sitemap — which is what happened on the first build.

They are not a fourth copy of the hub. A hub answers "roofing in Cincinnati" and carries that
market's proof, phone and areas; these answer "does Coldstream do roofing" and route to the market
that will do the work. **No city term appears on any of them**, so they cannot compete with the
hubs on the query the hubs exist to win.

**`/service-areas/` answers the question the nav had no answer to at all.** Modelled on
swordroof.com/service-area/ — the reference named in the ask — which is a map and then the towns
as a plain list. That page covers one metro; this covers three, so the towns are grouped by market
with the map following the market: office, phone, service links, all 77 communities, and links to
the detailed location pages where those exist.

**The map needs no API key, and that is deliberate.** Google's Embed API and Maps JavaScript API
both want a key, a billing account and a referrer allowlist; a keyless `output=embed` iframe
renders the same map, needs none of it, and cannot leak a key into static HTML served from a host
we do not control. It is what the reference page does too. Setting `PUBLIC_GMAPS_KEY` at build time
switches every map to the official Embed API with no other change, if we ever want that.

**The tabs are progressive enhancement.** Every market panel is a real section with a real heading
and is in the HTML whether or not the script runs; the buttons hide and show what is already there,
and they are added *by* the script so they cannot appear without something to drive them. A crawler
sees all 77 towns either way, and a deep link to `#columbus` opens Columbus rather than scrolling
past two hidden panels.

Six pages beyond the inventory became nine. All named in `page-inventory.mjs` with their reason —
"extra" still never means "unexplained".

---

## 15. Round 13 — the repo split finished, and staging rewired to follow it

**No page, component, style or data file changed this round.** This is deployment plumbing only,
recorded because the previous wiring was silently pointing at the wrong repo and the next person to
push would have found out the hard way.

The repo was split out of coldstream-os (commit `cd72391`) but the Netlify staging site was never
told. It still built from `cbrown-coldstream/coldstream-os` with `base = site` and
`dir = site/dist` — the paths this project had *inside* that repo. `netlify.toml` documents that
`base` is set in the site's build settings rather than in the file, and that is exactly the setting
that went stale.

Source now lives at **`cbrown-coldstream/coldstream-redesign`**. Staging builds from it:
`base` empty, `dir = dist`, `cmd = npm run build`.

**The dangerous intermediate state, written down because it is the reason to check the whole chain
rather than the settings page.** Clearing `base` while `repo_url` still read coldstream-os would
have made the next push to *that* repo build its root — the ColdstreamOS app — and publish it over
this staging site. Under the old `base = site` the build would merely have failed; half-fixing it
turned a loud failure into a silent wrong-site deploy. The repo pointer and the base directory had
to move together.

**Continuous deployment needed three things, not one.** The Netlify UI does them in one OAuth step;
done over the API they are separate and each was independently broken:

1. `build_settings.repo_url` → the new repo.
2. The **GitHub webhook** — Netlify fires builds through a per-repo webhook pointing at this site's
   build hook (`6a7ca941…`). It was still on coldstream-os, so it was both useless to the new repo
   and the trigger for the wrong-site deploy above. Recreated on coldstream-redesign, deleted from
   coldstream-os. This did not affect the coldstream-os *site*, which deploys through the Netlify
   GitHub App and owns no repo webhook.
3. A **deploy key**. Netlify clones over SSH even for a public repo — without one the build dies at
   `preparing repo` with `Host key verification failed`. A read-only key was created on the Netlify
   side and registered on the repo.

Verified end to end with an empty commit rather than by reading the settings back: push → webhook →
build → publish, `x-robots-tag: noindex, nofollow` intact, a 301 and a 410 from `_redirects` both
answering, five pages 200.

**Production is still not Netlify.** Nothing here changes §on the handoff — Rambow serves the built
HTML from the WordPress host, and staging remains a noindexed review URL. CD only shortens the loop
between a commit and something clickable.

**The repo is public.** It was created that way. Scanned for credentials before the first push and
found none, but `src/data/live-copy/` and `/handoff/` — the cutover runbook — are now world
readable. Flagged, not decided; making it private is a one-click reversal if that was not intended.

---

## 16. Round 14 — brand truth moved here, and the pull became a publish

**This is a reversal, and it is written down as one.** §Brand files and every comment in the repo
said coldstream-os was authoritative for `tokens.json` and `voice-spec.json`, and that
`npm run brand:sync` pulled them down. That is no longer true. **This repo owns them.**

`scripts/brand-sync.mjs` is **deleted, not kept as a fallback.** A pull that still worked would
overwrite the source of truth with a copy the first time someone ran it out of habit — the failure
is silent and repaints the whole site. `npm run brand:publish` replaces it and runs the other way.

**The two copies were byte-identical when this flipped**, so nothing had to be reconciled. Worth
recording: had they drifted, choosing a winner would have been a brand decision, not a merge.

**What is downstream, and the step that is easy to skip.** coldstream-os is now the vendored end.
Its `design-systems/exteriors/` is read by `supabase/seed-brand.sh exteriors`, which loads the JSON
into the `content_portal_brands` table — and `render-post` rasterises from **that table, not the
file**. So a colour reaches a rendered post only after both:

```
npm run brand:publish                 # here → coldstream-os/design-systems/exteriors/
./supabase/seed-brand.sh exteriors    # there: file → database
```

Publish without seed is the drift to watch: the website repaints, the posts do not, and every file
on disk looks right. The script says so on exit rather than leaving it to memory.

**`brand:publish` writes files and stops.** It does not commit, push or seed. Cross-repo automation
that also commits is how a brand change lands in a repo nobody was looking at. The original refused
to push for the same class of reason; the direction reversed, the caution did not.

**What did not change.** The files stay committed here, and nothing in `npm run build` calls the
publish script — this repo still has to build on a host that has never heard of coldstream-os. And
the two design systems remain separate: `--cs-web-*` is the website, `--cs-*` is social. Owning the
brand files does not merge them, and §11 still stands.

**Left alone, flagged not fixed:** `coldstream-os/site/` is still a full stale copy of this project
from before the split. Nothing points at it now that staging builds from `coldstream-redesign`
(§15), but it is a second copy of these same files and a plausible thing to edit by mistake.
Deleting it is a change to that repo, so it is not made here.

---

## 17. Round 15 — the mobile overflow, and motion that stays honest

### The 390px header overflow, fixed by wrapping the row — not by shrinking the CTA

Open item 4 has read "the header row does not wrap, so the H1 runs off the right edge" since the
prototype was inherited. **The H1 was never the bug.**

Below 1040px the nav is hidden, leaving `header.site .wrap` a flex row of the logo (a 240×70 file at
`height:44px`, so ~151px wide), a spacer, and the estimate CTA (~200px). With the 22px gap and the
wrap's 44px of padding the row's minimum content is **~417px in a 390px viewport**, and it carried
no `flex-wrap`. So it could not break — it simply got wider than the screen and widened the document
with it. Every section then sat on a canvas wider than the viewport, and the hero H1, being the
widest text on the page, is where you noticed. Fixing the H1 would have moved the symptom.

Under `max-width:430px` the row wraps and the logo drops to 38px with `max-width:100%` and
`object-fit:contain`.

**The CTA was not touched, though it is the widest item and the obvious lever.** It is the primary
conversion action on every page and the element most likely to be hit by a thumb; taking it below
the 44px minimum target to reclaim horizontal space would trade an accessibility floor for a problem
that wrapping already solves. It keeps its size and the row wraps around it.

### Reveal on view — the hidden state is armed by script, never authored in CSS

`[data-reveal]` carries only a transition. The hidden state lives behind `html.cs-reveal`, and the
inline script in `BaseLayout` is the only thing that adds that class — after confirming both that
`IntersectionObserver` exists and that reduced motion is not requested.

**The inversion is the whole design.** Authoring `opacity:0` in CSS and revealing with JS means a
script error, a missing `IntersectionObserver`, or JS off leaves finished HTML permanently
invisible. A marketing site that silently blanks its own copy is a worse failure than one that does
not animate. Every early return in that script is a visitor who gets the complete page, unanimated.

Transform and opacity only — both composite, where animating height or top would put layout work on
the scroll path for decoration.

**Applied to the "What we do" section and nowhere else.** A whole page set to animate reads as a
page loading badly; one section arriving as you reach it reads as deliberate. The heading fades, the
grid staggers its cards 70ms apart.

**Rejected: a horizontal scroll track for the services.** It leaves Gutters off-screen at rest — a
service you have to scroll sideways to discover is a service the page has decided is less important
— and it replaces a responsive 4/2/1 grid with one row at every width, which is worse on the phones
where most of this traffic lands.

**Rejected: stacking the cards as a sequence.** Roofing, siding, windows and gutters are
alternatives, not steps. Stacking implies an order that does not exist and would tell a visitor who
needs gutters that they are fourth in line.

**Noted, not fixed:** an older reveal system (`.reveal--armed` / `.reveal--in`) still sits in
`base.css`, and four components carry a bare `class="reveal"` that nothing arms. It is dead code and
predates this. Left in place rather than removed as an unrequested change — it should go.

### RoofBuild — a scroll-scrubbed sequence, below the hero because the gate says so

A 300vh track with a sticky stage: copy and a numbered `<ol>` left, media right, scroll position
driving both `video.currentTime` and which steps are lit.

**Rejected: scrubbing it behind the hero copy.** That is the more striking version and it is the one
that cannot ship. `verify-build` measures hero contrast and passes with fixed numbers — white
13.6:1, accent 7.1:1 — and those numbers are only true *because no page passes hero media*. The
check keys off `class="hero-media"`; a hero carrying video would start measuring an asset instead,
and a scrubbing clip has no single frame to measure, so hero contrast would stop being a known
quantity at all. **The gate is the contract, so the media moved down the page rather than the gate
moving out of the way.** A section that looks better and makes the accessibility check unverifiable
is not a trade worth making.

**Gated exactly like Hero's `media` prop.** No poster, or nothing to play, and the component renders
nothing at all — no frame, no dashed placeholder, no "video coming soon". A placeholder that looks
deliberate is worse than an absence, because nobody chases the real asset for it. It is live on the
three market landings and absent everywhere else, which is what the build shows.

**The poster is plain markup; the video is not.** The `<img>` paints for everyone. The `<video>`
ships with `preload="none"` and no source at all — the script attaches one and fades it in only once
it has decided the scrub will run and a frame has decoded. Nobody downloads 3.7MB for a still.

**Under reduced motion or below 900px the track collapses to an ordinary static section** — poster
only, every step at full opacity. The end state, never a blank stage: a step list dimmed to 38% with
nothing left to drive it is unreadable, and a pinned stage with no scrub is a section that will not
scroll away.

Scroll is read inside `requestAnimationFrame` with a `{passive:true}` listener, because
`getBoundingClientRect` forces layout and doing that per scroll event is how a decorative section
makes the whole page stutter.

---

## 18. Round 16 — RoofBuild generalized, and the bug that was waiting for a second instance

### RoofBuild → ProcessScrub

Nothing about the pattern was ever roofing. A sticky track, a continuous video scrub and a list of
steps that arrive as you pass them describes siding, gutters or windows equally well; it was named
for the first thing it was pointed at. That is how a component ends up copy-pasted three times with
the noun changed — **the exact failure this site exists to undo at the page level**, reappearing one
layer down.

`.rbuild-*` → `.pscrub-*` throughout, and `id` is now a **required prop** because a page can hold
more than one. Every id in the markup derives from it, so two instances cannot collide on the
heading's `aria-labelledby` target.

The gate is unchanged and still absolute: no poster, or nothing to play, and the component renders
nothing.

### The single-instance selector — a real bug, not a tidy-up

The script reached for `document.getElementById("rbuildTrack")` and its siblings. That was correct
while the component was roofing-only and appeared once per page. **It breaks the moment a page holds
two:** ids stop being unique, `getElementById` returns the first, and the second instance silently
gets no scrub, no step reveal and no rail — while its markup, video and 340vh of track all still
ship. A section that costs full weight and does nothing is worse than one never added.

Now: `querySelectorAll(".pscrub-track")`, with rail, steps and video resolved **from each track**
rather than from the document. No ids are involved, so nothing breaks even if two sections are given
the same `id` prop by mistake.

**Verified rather than assumed:** a second instance was temporarily rendered onto a market landing
to check what Astro actually does. It emits the inline script **once per instance** — two copies on
a two-instance page, each seeing both tracks. Without a guard that means doubled scroll listeners and
video sources appended twice. The per-track `dataset.psInit` flag is therefore load-bearing, not
defensive decoration. The test instance was removed afterwards.

### Steps arrive per segment and persist

Each step owns `1/n` of the track and gets `.in` when progress crosses it. The class is only ever
**added** — no toggle, no else branch — so scrolling back up cannot un-reveal. A homeowner comparing
contractors scrolls back, and copy that vanishes on the way up is copy they cannot re-read. Previously
all four rendered at 38% opacity from the start, so the copy was already read before any scrolling and
only the media moved.

**Scroll-snapping rejected.** It fights trackpad momentum and takes the scroll away from the reader.
This is a section you scroll past, not a slideshow you step through. Track went 300vh → 340vh instead,
so a quarter is long enough that two steps cannot land in one flick.

### process.js, and why its copy is claim-free

The sequences moved to `src/data/process.js` so the market landing and the service hubs cannot drift
into two versions of one sequence.

**That file sits outside the claims gate** — it is prose in a component, not a value `claims.js` can
null out — which makes it the easiest place on the site to reintroduce exactly what the gate removes.
The live site's process copy is where "25+ years", "A+ rated" and "financing available" were woven
into ordinary sentences, and once a claim is a clause in a paragraph nothing structural strips it. So
the rule there is narrower than the voice spec: **describe craft, assert nothing** — no timeframes, no
prices, no warranties (not even the approved 25-year one), no ratings, accreditations or certification
tiers.

### Where the sections landed

Siding and gutters onto the **service hub** lane (`[market]/[service].astro`), so six pages gain one.
Roofing's stays on the market landing. **The footage is the gate, not the service list:** windows,
garage doors and commercial have no clip and therefore get no section rather than a borrowed one.

The gutter assets were renamed `gutter-*` → `gutters-*` to match the service key.

---

## 19. Round 17 — the service cards flip, and what that replaced

Round 7's hover layer on `.svc` was **removed, not built on**: the translateY lift, the `::before`
accent bar wiping across the top, and the icon's `rotate(-4deg)` all animate the element a `rotateY`
now owns, and the `overflow:hidden` that bar needed to clip against the radius would have cropped the
card mid-rotation. Kept: the border and shadow response, which is the card reacting rather than a
second thing moving.

**Both faces share one grid cell — they are not absolutely positioned.** The blurb comes from
`copyFor(s.blurb, market)` and differs per market, and the back's bullet count depends on which
claims are sourced. Absolute faces are out of flow, so the card would need a fixed height guessed
from the longest of twelve strings, and would clip the moment a market's copy grew or a gated claim
landed. In one cell the card is as tall as its taller face, per market, automatically.

**The opacity crossfade is the failure mode, not a flourish.** `backface-visibility` only hides
anything while a real 3D context survives, and `preserve-3d` is flattened by any ancestor that gains
a `filter`, `will-change` or `contain`, and by several mobile browsers regardless. Flattened, the
back face is no longer rotated away — it paints over the front as mirrored, unreadable text. Because
opacity does the actual hiding, that degrades to a plain crossfade instead: the card still swaps
faces and still reads. The .25s delay is half the .55s flip, so the swap lands where both faces are
edge-on. It is commented in place because it looks redundant and someone will remove it.

**The link moved to the back face only, and that is an accessibility decision.** The flip triggers on
`:focus-within` so a keyboard can reach it. Had the front kept its link, the first Tab would land
there, the card would flip in response, and focus would be sitting on a link the crossfade had just
faded to `opacity:0` — focus visually lost on the element that is still active. One link per card
also keeps the internal-link graph honest: four cards, four links, not eight to the same four URLs.

**Touch and reduced motion get the same stacked card.** Under `(hover:none)` the two faces stop
sharing a cell and become two rows, the assurances and link rendering beneath the blurb as part of
the card. Content behind an interaction the hardware cannot perform is content that does not exist.
Reduced motion lands in the same branch because base.css kills every transition globally under that
query — the flip would not animate, it would snap 180deg.

**Bullets come from `claims.js` via a new `cardAssurances()`.** A hover-revealed panel is exactly
where unsourced copy collects: easy to miss in review, reads as decoration, and invisible to a gate
that greps built HTML only until it ships. Eligibility is the three always-true claims plus the three
ungated descriptions already accepted here; `.filter(Boolean)` makes the null rule structural rather
than a convention. Badge tiers stay out — the GAF tier is still claimed three ways.

**A cascade bug found by checking rather than by looking.** The reveal layer sets
`transition:opacity,transform` on `[data-reveal="stagger"]>*`, which *is* `.svc`, and it loads after
the card rules. At equal specificity the later rule wins the whole shorthand, so the card's hover
border and shadow were silently snapping instead of easing. Scoping the card rule as
`.svc-grid .svc` (two classes) outranks the attribute selector and makes it order-independent. The
flip's own transition was never at risk — it lives on `.svc-flip`, which the reveal never touches.

**The stagger and the flip coexist.** The reveal's transform and opacity land on `.svc`, the
*perspective* element; `.svc-flip` carries `preserve-3d` one level below and receives no grouping
property, so the 3D context survives a scroll reveal. Verified in the built CSS: no `will-change`,
`filter` or `contain` anywhere on that chain.

---

## 20. Round 18 — step beats, and the badge row resupplied

### Each step arrives on its own beat

Cue points are derived from `n`, not listed: `FIRST + i * (LAST - FIRST) / (n - 1)`, with FIRST 0.04
and LAST 0.80 — for four steps, `[0.04, 0.29, 0.55, 0.80]`.

Neither end is round by accident. **FIRST is 0.04, not 0**, because the stage pins the instant the
section reaches the top of the viewport and a cue at 0 would fire on that same frame — the step
would never appear to arrive, it would just be there. **LAST is 0.80, not 1**, because the final
step has to land before the section starts releasing, or the reader watches it fade in while the
whole thing scrolls away. `n === 1` collapses to FIRST rather than dividing by zero.

Track 340vh → **360vh**: the beats now span 0.04–0.80 rather than 0–0.75, so the gap between two of
them needed the extra distance. Still no scroll-snap — it fights trackpad momentum, and this is a
section you scroll past, not a slideshow you step through.

**Arrival is sticky, marker state is not, and the difference is deliberate.** `.in` is only ever
added, so scrolling back up cannot un-reveal copy. The marker classes *do* toggle, because "which
step are you on" is a fact about where the scroll is right now rather than something that
accumulates — walking back up should walk the highlight back with it. Exactly one `.is-active`.

**Three marker states, and none of them is accent orange.** Orange is the headline's emphasis and
the focus ring, and on this section it is already spent on the eyebrow; a marker walking through it
would make the one colour that means "look here" mean four things in one viewport. The progression
runs through the blues instead: dim → `--cs-web-hero-accent` while active → `--cs-primary` once
passed.

**One measured problem, left as specified.** White on `--cs-primary` is **3.76:1**, and the marker
numeral is 0.92rem bold ≈ 14.7px — under the 18.66px large-text threshold, so AA wants 4.5:1. The
other two states are fine (upcoming 7.22:1, active 9.01:1). `--cs-primary-deep` would give 6.07:1
and is a one-token change. Recorded rather than made, because it is a visible design choice.
`npm run verify` does not catch this — that gate measures hero contrast only.

The fallback branches now carry `:last-child` / `:not(:last-child)` marker rules so the finished
state is right **without JS**. `phase(1)` sets the same classes, but only if the script runs at all.

### The badge row — all seven resupplied, and the GAF tier resolved

Every badge is now supplied artwork rather than a WordPress media-library upload. Two defects are
fixed by the swap rather than by code: Owens Corning is finally the "Preferred Contractor" lockup
its alt text has claimed since this row was built, and each badge's png and webp are now the same
image at the same size — `james-hardie-elite` had been shipping a 1024x853 webp beside a 592x488
png, so the declared dimensions were right for one format and wrong for the other.

The superseded uploads are **deleted, not kept alongside**. Two files for one badge is how a row
ends up half-updated, which is the state this replaced.

**THE GAF TIER IS NOW STATED.** This file withheld it for good reason — site-plan said "GoldElite",
the old filename said "Commercial Roofers", the brief said "Certified", and misstating a
manufacturer certification is a compliance problem. But that position had stopped making sense: the
artwork itself reads "GAF GoldElite™ Commercial Contractor" and always did, so the tier was already
on screen for every sighted visitor and withholding it from `alt` only meant a screen reader got
less than the image said. The supplied asset is GAF-issued artwork naming the tier and it agrees
with both site-plan and the old filename. If GAF's contractor portal ever disagrees, the portal wins.

**Badges are bigger**: height cap 72 → 92px, width 185 → 225px. **92 is what the smallest asset
supports** — `google-five-star` is 184x189 native, so 92px is exactly 2x for a retina display and
the first thing to soften above it. Two of the new files have fewer pixels than what they replaced
but are cropped tight to the mark where the old uploads carried wide empty margins, so at the same
cap they read larger with less headroom left. Raising the cap means resupplying that file first.

**Working files moved out of the deploy path.** `_assets-source/` (gitignored) now holds the raw
exports, the two contact sheets and a 10 MB `Partner Logos/` dump that were sitting in `public/` and
the repo root. Kept, because discarding the high-resolution source of a badge is how you end up
unable to resize it later; ignored, because none of it belongs in a deploy. `.DS_Store` added to
`.gitignore` — one had already been staged.

---

## 21. Round 19 — the scrub moves, the national page gets a router, and reviews get built before they exist

**The roofing scrub moved to `/[market]/roofing/`.** A market landing has to carry four trades and
route to all of them, and 360vh of sticky track about one of them made roofing the middle of the
page and pushed siding, windows and gutters below it. On the roofing hub the same section is the
subject of the page rather than a detour from it. It is now driven by `PROCESS_MEDIA` like siding
and gutters, so all three arrive the same way.

**The `WhyTrust` eyebrow is optional, not deleted.** `eyebrow={null}` suppresses it. Only the
national page needed that — its heading is "Why homeowners keep calling us back" directly under an
accent-orange "Why homeowners choose us". The other seven callers have different headings
("What we hold ourselves to", "Straightforward from quote to cleanup") where the eyebrow still does
work, so the default stays rather than every caller opting back in.

**The roofing hub copy stopped explaining the site to the reader.** It said "Everything roofing, on
one page" over "Sections of the roofing conversation — not thirteen separate pages saying the same
thing". That is the consolidation rationale: true, load-bearing for this rebuild, and of no interest
to a homeowner who never saw the thirteen pages. Internal reasoning belongs in a comment and in this
file. It now opens "Not sure what your roof needs?" and answers it.

### The national page cannot detect an area, so it asks

Static output means no server, no request-time detection, and no honest way to swap a phone number
before the page is sent. **The 844 number stays the national default** — everything else would be a
guess printed as fact.

`MarketChooser` sits directly under the badge row: three cards, each with the office city, that
market's number and a separate call link. The `#locations` section three-quarters down stays as it
was; it is the same three offices in more detail, and it was never visible at the moment someone is
deciding whether they are covered. Every number comes from `markets.js`, where `telHref` is derived
from the displayed string, so the two cannot disagree — the bug the live WordPress home page still
has, printing (888) 625-5960 while linking a different number.

**The returning-visitor hint reads the cookie that already exists.** `cs_market` is written by the
utility bar's select and by `MarketNotice`; a second key would be a second record of one preference
and they would drift. It is read-only here, never written, and **no IP lookup happens** —
`GeoRedirect` does that separately with its own cookie. The hint ships in the HTML with `hidden`
set and an inline script immediately after it, so it resolves during parse rather than after paint:
no layout shift, and no cookie means nothing renders.

### Reviews: the matching built now, rendering nothing

`matchReviewsToCards` attaches a real review to a themed "why us" card by keyword, at build time,
because which review belongs under which card cannot be decided while the reviews do not exist. Each
review is used under at most one card, quotes are verbatim, attributed and linked — the three rules
from `contracts.js`. **No match means no quote and the card is unchanged**, which is also the state
of every card today.

**The section is designed to read complete without them.** There is no empty quote slot and no
"review coming soon" — the six cards are a finished section, and a quote is additive. This is the
surface where inventing a testimonial would be easiest and least noticed, and the prototype already
shipped three invented ones under a heading claiming they were local homeowners.

`REVIEW_PROFILES` gates aggregates separately and is null everywhere. **A rating needs the profile's
own rating AND count AND link, together** — the number of reviews we publish is not the number the
profile holds, and that conflation is the "400+ five-star reviews" problem.

Proven rather than assumed: built with `COLDSTREAM_FIXTURES=1` and confirmed a fixture review
containing "a fair price" attaches to the pricing card, that no review is used twice, that a review
matching no theme produces nothing, and that the aggregate still does not render because
`REVIEW_PROFILES` is null. Then rebuilt clean — zero fixture strings in `dist/`.

### Trust band, and what is still not claimed

`page.trust` had existed since round 7 and **nothing ever rendered it**, so the three approved claims
appeared on the national page only as prose inside other sections. The band now renders from a new
`ALWAYS_TRUE` array in `claims.js` rather than from page data — the same three strings the hero
bullets and the service-card backs use. Written per surface they had already begun to vary ("Free,
no-obligation inspection" against "Free inspections"), and a claim phrased three ways is three
claims to check.

**"BBB accredited" and "fully insured" are still absent, deliberately.** `CLAIMS.bbb` now names what
would unlock it — the accreditation record itself, not a screenshot or the live site's own claim —
and records that the seal is a second, separate blocker because BBB's programme requires their
hosted seal. "Fully insured" is on the pending list; the approved wording is "Licensed and insured".

### Hero video: capability, unused

Gated exactly like `ProcessScrub` — **poster AND source, or nothing renders**. The poster is now a
plain `<img>` rather than the `poster` attribute, so it paints for everyone rather than only for
browsers that laid the video out, and it is the LCP candidate instead of a frame nobody downloaded.
Under reduced motion the source is never attached, so the file is not even fetched.

**Written into the component in capitals, because it is the trap:** `verify-build` asserts hero
contrast with fixed numbers — white 13.6:1, accent 7.1:1 — and those are **only valid because no
page passes media**. When footage arrives the check must be re-derived against actual frames. A
scrim tuned on a smooth navy gradient can fail on a bright sky behind white headline text, which is
exactly the frame a roofing video is likely to contain. **Nothing passes `media` today.**

### Served areas, rewritten around the question it is asked

A homeowner arrives to settle one thing: do you work where I live. Three changes — a plain sentence
first naming the metro and the office the crews leave from, both derived from `markets.js`; towns
grouped by the market's own areas rather than one run of up to 77 chips; and a line for the town
that is not listed, because the list is the towns with confirmed work, not the limit of where a crew
will drive. Without that last line the page reads as a boundary and "my town is missing" becomes
"they must not cover me". Columbus stays one honest group — it is a ring city and any two-way cut
puts Westerville and Grove City together.

The per-market `intro` is no longer passed: all three said "Based at our <office> office", which is
what the derived lede now says and cannot drift from.

### FAQ

Still native `<details>`/`<summary>` — it works with JS off, is keyboard-operable for free and
reports its own expanded state. The animation is decoration layered on top and does not carry the
behaviour. **Transform and opacity only:** height animation runs layout every frame, and eight rows
of it janks on a mid-range phone. The rows stagger in through the existing `[data-reveal="stagger"]`
rather than a new mechanism. Under reduced motion nothing animates and everything still works.

---

## 22. Round 20 — the scrub reaches the national service pages, and one chooser replaces two

### The scrub was never missing — it was on a different template

`/roofing/` and `/[market]/roofing/` are built by two different files, and only the market one
carried `ProcessScrub`. Anyone checking the national URL saw nothing and concluded the section had
not shipped. It is now on `src/pages/[service].astro` too, in the same position it holds on the
market template: after the detail cards, before the FAQ.

**The component needed no changes to work there**, which is the payoff from generalising RoofBuild
in §18. Its steps describe how the work is done, not where, so the national page and the three
market pages show the identical sequence — no market prop, no national variant, no second copy of
the copy.

The media map is the gate, as before: roofing, siding and gutters have footage and render; windows
and commercial-roofing have none and render nothing at all.

### One chooser, not three implementations of one question

Three separate answers to "which of you is near me" had accumulated: `MarketChooser` under the badge
row on the home page, an `#locations` grid further down that page, and a bespoke `.ns-pick` grid on
every national service page. Same question, three sets of markup.

`MarketChooser` now takes `markets`, `service` and `note`, which is everything the other two did:

- **`service`** keeps the deep link `.ns-pick` always had, and it was the better idea — someone on
  the national siding page wants Columbus **siding**, not Columbus. Without the prop the cards go to
  the market landing, which is right for the home page.
- **`markets`** exists because a service line does not run everywhere — garage doors is St. Louis
  only — and a chooser offering a market that cannot do the job is worse than a shorter list.

`#locations` is **deleted rather than left below the chooser**. Answering the same question twice on
one page is worse than answering it once: the second answer reads as a different question the reader
then has to check. Nothing was orphaned — that block was one of twenty pages linking to
`/{market}/free-estimate/`, and the three office addresses live in the Organization schema and the
footer, not there.

`.ns-pick`'s scoped `<style>` block went with it. Every rule in it styled a grid the page no longer
renders.

### ServedAreas stays off the national pages, deliberately

It renders on six market templates and zero national ones, and that is correct rather than an
oversight. A national visitor is asking **which of your three markets am I in**; a list of 77
neighbourhoods answers "which street are you on", which is a question they cannot have yet. The
market landing is where that list belongs, and the chooser is what gets them there.

### The map

An earlier instruction asked for the keyless Google map to be preserved inside `ServedAreas`. There
was never a map in that component — it is `ServiceAreaMap.astro`, used only on `/service-areas/`.
Both left untouched.

---

## 23. Round 21 — the market select was inert on the pages that needed it

**THE BUG.** The select's `change` handler lived in `MarketNotice.astro`, whose script opens with
`if (!SLUG) return`. On a market page that is fine. On the **national** pages, where `market.slug`
is null, it meant the select had no handler at all: a visitor picked their city and nothing
happened — no navigation, no number change, nothing. That is the one page where a market picker
earns its place, and it was the one page where it did nothing.

The behaviour now lives in `UtilityBar.astro`, the component that renders the control. One handler
instead of a handler in a sibling that may or may not have returned early.

**Two behaviours, because the pages are genuinely different:**

- **On a market page, choosing another market navigates.** You are reading Cincinnati content;
  switching to Columbus has to change the content, not just the number, or the page would say
  Cincinnati while the phone said Columbus.
- **On a national page, it swaps the numbers in place.** The page is about all three markets and
  stays true no matter which number is showing, so there is nothing to navigate away from — the
  visitor asked for their local number and gets it without losing the page they chose.

**Both halves of every number move together.** A `slug -> { phone, telHref }` map is serialised from
`MARKET_LIST`; the swap sets the `href` and the visible text from the same record, and there is no
path that writes one without the other. Nothing is typed into the component — the only literal
number anywhere near it is in a comment, naming the live WordPress page that prints
(888) 625-5960 while linking a different number. That is the failure this shape exists to prevent.
The 844 remains what ships in the HTML and what "Other / not sure" restores.

Marked elements are the utility bar's number and the hero's "Or call" — the number sits in its own
span so the surrounding words are untouched. The change is announced through a polite live region,
because a number quietly changing in the corner of the screen is a change nobody notices, and a
screen reader would otherwise get nothing at all.

**The select was also invisible, which is its own bug.** It was a 5px-padded control at 16% white on
a blue bar — the same visual weight as the text label beside it. It is the site's market router and
the only control that follows a visitor onto every page. It now reads as a control: solid paper
ground, its own drawn caret (a data: URI — an external request for a triangle is not worth it), a
44px target, and a border that is actually visible.

---

## 24. Round 22 — the footer's "Sitemap" link finally goes somewhere a person can read

The footer has linked **Sitemap → /sitemap.xml** since this site was built. That link is in the
human part of the page, next to Privacy and Terms, and it handed anyone who clicked it a wall of
raw XML. `/sitemap/` is the page it should always have pointed at. The XML keeps its own job and is
unchanged — it is for Google, and sitemaps do not list sitemaps.

**Derived from the same computation as the XML.** `urls()` in `data/sitemap.js` already decides what
is crawlable and why, so the page asks it rather than keeping a second list beside it. A hand-kept
HTML sitemap is wrong the first time anyone adds a page, and this one would have been wrong within a
day, because pages here become indexable as their data lands.

**Noindex and empty are not the same thing, and an earlier draft of this page conflated them.**
The first version linked only indexable pages, which meant a sitemap that silently omitted the
privacy policy while the footer linked it on every page. Four company pages — about, financing,
privacy, terms — are noindex because a *fact* on them is unsourced, not because they are empty; they
have real content, and linking an indexable page to a noindex one is normal, since noindex still
means follow. They are listed. The genuinely empty ones are not: sending someone from a sitemap to
an empty gallery is the same failure as shipping the thin page.

**Two counting bugs, both caught by checking rather than by looking.**

The "pages being prepared" line said **13**, which swept in the privacy policy, the 404 and the
thank-you page alongside the galleries. It counts only galleries and reviews now — **6** — because
those are the pages a visitor might actually come looking for.

The headline total was a **sum of the group lengths**, which double-counted each market landing:
it is rendered twice, once as the group heading and once as "<Market> home". It now derives from a
`Set` of everything linked. A sitemap whose own total is wrong is the least forgivable page on a
site to get wrong.

*(A third mismatch I chased was in my verification regex, not the page — it required two slashes and
so dropped `href="/"`. The page was right.)*

**Designed to be read rather than endured.** A sitemap is usually an undifferentiated wall of blue
links, which is exactly as useful as the XML it replaces. This one is grouped the way the site is
actually put together — company, then each market with its services, its detail pages and its
places — so the shape of the company is visible in the shape of the page. Each market heading
carries its office city and phone, both from `markets.js`, because a sitemap is a routing page and
the number is the fastest route of all. Raw paths sit alongside the titles in a quiet grey, useful
when checking a URL and invisible when browsing; they are hidden below 600px.

`/sitemap/` lists itself, deliberately: a page linked from every footer that is absent from its own
sitemap is the one URL a crawler reaches constantly and is told nothing about. Named in
`KEPT_BEYOND_INVENTORY` — the inventory now reports 58 required, 10 beyond and accounted for.

---

## 25. Round 23 — /sitemap/ became the team's review board

It was a public sitemap for about an hour. It is now the page the team walks the build from, and
that is a different kind of page with different rules.

**Three things moved with the purpose.** It is `noindex`; it is out of `sitemap.xml`; and **it does
not follow the web design system**, on instruction. A checklist of unfinished work with the team's
internal commentary on it is not something to hand a crawler, and the visual mismatch is deliberate
— an internal board that looks like the marketing site is one somebody eventually shows a customer.
Dark ground, dense rows, monospace paths and lane tags, a conic-gradient progress ring.

**What it carries.** All 68 pages including the unfinished ones — a build checklist that hides the
incomplete pages is useless — grouped by market. Per page: a tick, a status (in review · needs copy
· needs design · blocked · approved) shown as a coloured left edge so it scans down a long list, an
"open in new tab" link, and a notes field. Expanded, each page lists its own sections with a tick
and a one-line note each: **521 section checkboxes** across the site, from `REVIEW_SECTIONS` keyed
by template lane rather than by URL, because three markets share one template and a per-URL list
would be the same strings three times, drifting the first time one was edited.

Filters for not-done, has-notes and blocked. Expand-all. A print stylesheet, because taking the
board into a meeting on paper is a real thing people do.

**THE REAL LIMITATION, STATED ON THE PAGE RATHER THAN DISCOVERED.** Ticks and notes live in
`localStorage`, so they are **per browser**. This site is static output on a host with no runtime —
there is no server to save them to and adding one is not a small decision. So the board exports and
imports a JSON file, which is how two people end up looking at the same review, and the warning sits
in the header where it cannot be missed. Import **merges rather than replaces**, keeping whichever
record carries a note, so loading a colleague's file cannot wipe your own afternoon.

**The header nav link came straight back out.** It was added when `/sitemap/` was still a public
page; the primary nav is the one row of links a customer reads on every page, and an internal board
full of unfinished work and the team's own notes is the last thing that belongs in it. The footer
keeps the link — enough for the team, and one fewer thing to remember at cutover.

**⚠ THE FOOTER LINK STILL HAS TO COME OUT BEFORE CUTOVER**, along with the page itself. Recorded
here and in the page's own header.

---

## 26. Round 24 — the board explains the consolidation, and the Supabase question

### Why 68 and not 443, computed rather than asserted

The consolidation is the point of this rebuild and its reasoning lived only in prose — CLAUDE.md's
"100+ neighbourhood pages that were one skeleton with synonyms swapped", the fold tables in this
file. None of it told a reviewer **which old URLs fold into the page in front of them**, which is
the question they actually have: what was here before, and did we keep what it was for?

`data/consolidation.js` reads the **generated `_redirects` file**, not `redirects.js`. The rules
there are patterns; `_redirects` is what those patterns expanded to and what will actually ship.
Recomputing the expansion would be a second implementation of `build-redirects.mjs`, and the two
would disagree the first time either changed. The ordering is safe — `npm run build` is
`tokens && redirects && astro build` — and a missing file yields empty rather than throwing.

The numbers it produces: **273 rules, 272 redirects and one 410, landing on 39 of the surviving
pages** — 94 neighbourhood pages, 91 duplicate slugs, 82 folded into a hub, 5 duplicate conversion
pages. Every page on the board now shows its own fold count as a badge, and expanding it lists each
retired URL with the reason it was retired. **29 pages show "nothing redirects here — this page is
new, not a survivor"**, which is a distinction nobody could previously make.

### Groupings

Rows now carry a readable lane label — Market landing, Service hub, Sub-service, Location,
Conversion, Company/legal — because a reviewer judges a sub-service page against a different bar
than a market landing. Added an "Absorbed URLs" filter alongside not-done, has-notes and blocked.

### Supabase — not done, and why

**There is no Supabase MCP connected to this session.** I checked the tool registry and the config;
the servers available are Contractors Cloud, Netlify, Gmail, Drive, Higgsfield, Microsoft 365 and
Wispr Flow. Nothing can create a project, run DDL or write rows, so the shared-database version of
this board could not be built.

There **is** a Supabase project in the organisation — coldstream-os uses one for the social
pipeline. Its credentials sit in that repo's `.env`. **They were deliberately not used.** That
project is the render pipeline's production database; adding tables to it for a website review board
is a decision about someone else's system, and reaching into another repo's secrets to write to a
production database unasked is not a thing to do quietly.

The board keeps localStorage plus JSON export/import, which works today and is honest about being
per-browser. **See §27 for what moving to Supabase actually requires** — it is a real piece of work,
not a switch.

---

## 27. Round 25 — the board became a CMS, on its own database

### A dedicated Supabase project, and why not the two that existed

`Coldstream Review Board` — `riwmmxhrpgcunfwikxqm`, us-east-1, billable compute on the Pro plan.

The two existing projects were both wrong homes. **Coldstream OS** is the render pipeline's
production database; a marketing-site review board does not belong in it. The second project looked
empty and is not — it runs a field-sales app (`agencies`, `prospects`, `referrals`, `field_users`)
with five auth users, and sharing it would have meant those five could sign into this board and
anyone added here could sign into that app's auth. It was also **unhealthy**: `ACTIVE_HEALTHY` at
project level while db, rest and auth all reported "failed to connect". A restart fixed the database
even though the health endpoint stayed stale, which is worth knowing if it happens again.

### The security model, which is the whole design

The board is static HTML on a public URL built from a **public GitHub repo**. The anon key ships in
that HTML. That is normal for Supabase and safe only if the database is closed by default, so:

- everything lives in a `review` schema, not `public`
- `usage` on that schema is granted to `authenticated` and `service_role` **only** — `anon` gets
  nothing, so an anonymous caller is refused at the **schema boundary**, before RLS is consulted
- every table has RLS on, deny by default, with one policy per door
- comments are **append-only** — no update or delete policy, because a thread that records what the
  team decided is not a record if someone can quietly rewrite it

**Verified against the live project rather than assumed.** Anonymous reads and writes return
`permission denied for schema review` on every table. A throwaway user was created, signed in, read
successfully, and was deleted. The committed key was decoded to confirm it carries `role: anon` and
not `service_role`, and the staged diff was swept for the service key and the management token
before pushing.

### What it does now

`review.pages` is synced from the build — 68 rows, upserted, **never deleted**: a page that
disappears keeps its notes and its edit requests, because a page vanishing from a build is usually a
rename, and that is exactly when the discussion is worth keeping.

Ticks, statuses, section checks and notes now live in Postgres, so two people see one board rather
than three private localStorage copies. On top of that, the CMS part: **edit requests** per page and
per section — kind (copy · design · data · bug · question), priority, status, filed against the page
they concern, with an open-count badge on the row and a filter for pages carrying one.

**No SDK.** The Supabase JS client would be a CDN script on a page that loads none, for calls that
are four headers and a fetch. The repo's no-client-framework rule holds and the board's behaviour
stays readable in one file. Anything a person typed is written with `textContent`, never `innerHTML`.

**Signed out, the board is structure only** — the page list and the consolidation breakdown are in
the HTML and are useful on their own; every tick, note and request needs a sign-in and is visibly
inert without one. The database would refuse regardless; the greyed-out state is so nobody types
into a field that cannot save.

### The credential

The management token was pasted into chat. It grants access to every project on the account, it is
in that transcript, and **it should be rotated**. It was used in-session only and written to no file
here. The service-role key is likewise never committed — `scripts/sync-review-board.mjs` reads it
from the environment and exits with instructions if it is missing.

---

## 28. Round 26 — real Google reviews, three offices side by side

### Pulled at build time, not fetched in the browser

`npm run reviews:pull` → `src/data/generated/reviews.json`, committed as data. **Not part of
`npm run build`**: a build that depends on a third-party API being up, a key being present and a
quota having room is a deploy that is a coin toss.

Client-side was never an option. The site is static output on a host with no runtime, so a browser
fetch would need the Places key in the page — and a Places key in public HTML is a billable key
anyone can lift. There is no server to proxy through.

Failure is loud and never partial: a missing key, a failed request or a market with nothing usable
exits non-zero and writes **nothing**. Overwriting good data with a partial file is the failure that
matters, because the site would quietly lose reviews and nobody would look.

### Five per market is the ceiling, and the design admits it

The Places API returns at most five reviews per place, with no pagination and no sort. Fifteen across
three markets is the maximum this section can ever show. So it is **three columns, one per office** —
readable at three reviews and at fifteen — rather than a wall that looks sparse either way.

**Per-market columns are the creative decision, and they are chosen because they are substantiable.**
An anonymous wall of quotes is what every contractor site has and proves nothing. Three named
offices, each with its own Google profile, its own star average and its own review count, is a claim
a visitor can check in one click — and it is true of this business in a way it is not true of a
franchise with one national number. A market with no data **drops its column** rather than showing
zeros; zeros are a claim too.

### What Google's policy actually says — checked, not assumed

From the [Places API policies](https://developers.google.com/maps/documentation/places/web-service/policies),
2026-08-17:

- **Caching, confirmed:** *"You must not pre-fetch, cache, or store Places API content beyond the
  allowed exceptions."* Place IDs are the named exception and may be stored indefinitely — which is
  why the IDs are env config and the review text is not stored anywhere permanent.
- **Duration, NOT confirmed.** The widely-repeated "30 consecutive calendar days" appears in the
  Service Specific Terms against **latitude and longitude** for Directions and Geocoding. I could not
  verify it extends to review text: `cloud.google.com/maps-platform/terms` truncates on fetch and the
  Places policy page states no duration at all. **So the cadence is conservative by choice rather
  than by guesswork** — treat the file as short-lived, re-pull before a deploy that displays reviews.
  A defensible number has to come from Google's terms or their support, and it is recorded as an open
  question rather than invented.
- **Attribution, confirmed and required:** *"always credit the author ... (author's avatar image,
  name, and profile link)."* All three render on every card; a review missing any of them is dropped
  by the pull rather than shown anonymously.
- **Ordering, confirmed:** the policy requires *"a clear notice that describes how reviews are being
  ordered and filtered."* Nothing is sorted, filtered by sentiment or reordered, and the note under
  the heading says so.
- **Avatars:** the policy covers displaying them and is silent on storing them. Since it forbids
  caching Places content generally, the compliant reading is to reference Google's URL at render time
  and never download the file. That is what happens.

### The gate

No data, no section. Not a skeleton, not placeholder stars, not "reviews coming soon". There is no
sample review in the component, no default prop carrying a name, and nothing for a fixture to inject.
Aggregates render only when the profile's rating **and** count **and** link are all present.

**Two counting mistakes were caught by checking rather than by looking.** The first version used
`await import()` for the optional JSON — Rollup resolves imports statically, so a missing file was a
hard build failure that no `try/catch` could catch, and it failed exactly that way. It reads from disk
now. The second: the pull originally wrote the Places API's own field names — `author_name`, `text` —
which satisfied the field list it was given and **failed the contract it was told to meet**. Records
now carry the contract's names and the Places extras.

`npm run contracts` validates the pulled file against the same `validateReview`/`validateProfile` the
fixtures go through, and it was proven in both directions: a deliberately broken file produced nine
distinct failures and exit 1 (bad rating, unknown market, non-https permalink, missing attribution,
placeholder name, more than five reviews); a valid one passed and rendered two columns with the third
correctly dropped. Both throwaway files were deleted and the repo greps clean.

### Placement

Directly below "Why homeowners keep calling us back", and the stacking is the point: those six cards
are our account of how the work runs, this is somebody else's. The six cards are untouched.

Stars use a gold of their own — **not `--cs-accent`**. Orange is headline emphasis and the focus
ring, and it has been spreading; stars pull the eye regardless and do not need to borrow it.

---

## 29. Round 27 — a fixture preview, and a gate that will reject real reviews

### Placeholder reviews, quarantined behind an env var rather than written to a file

Asked for placeholder data so the section could be looked at before a Places key exists.
`COLDSTREAM_FIXTURES=1 npm run build` now fills it from
`src/data/fixtures/reviews-places.sample.js` — 5 / 4 / 3 reviews across the three markets, ratings
of 3, 4 and 5, and St. Louis deliberately carrying no profile figures so the "reviews but no
aggregate" branch is visible too.

**Not a placeholder `generated/reviews.json`, and the reason matters.** That file is committed in
normal use — the host builds from the repo, so real reviews have to be in git — which puts a
placeholder version one `git add -A` from production. **Netlify runs `npm run build`, not
`npm run verify`**, so the gate would never see it. Nothing is written to disk: the data is
unreachable without the env var, there is nothing to commit by accident and nothing to clean up.

Every name and quote contains the string FIXTURE, and it never overrides a real pull.

**Two independent gates refuse a fixture build**, verified — exit 1: the FIXTURE-in-HTML check, and
the unsourced-claim check catching the rating figure. Defence in depth was not designed, it was
discovered, and it is worth keeping.

### ⚠ THE GATE WILL REJECT REAL REVIEWS. NOT FIXED — STATED.

`BANNED_CLAIMS` in verify-build.mjs contains the literal string **`"4.8"`**, from when that figure
was invented prototype copy. The check is a substring scan over built HTML, so it cannot distinguish
a 4.8 typed into a template from a 4.8 this build read off the Google profile.

**The day a real pull returns a 4.8 average for any market, `npm run verify` fails.** The figure will
be sourced, correct, and rejected.

It is deliberately not patched here. This file's own rule: *"If a change needs a gate relaxed, that is
a decision to state out loud, not a line to quietly edit."* Deleting `"4.8"` from the list would
remove the protection that caught the original fabrication, and editing a gate so a build passes is
the thing that must not happen quietly.

**FIXED IN ROUND 28, ON INSTRUCTION.** See below.

---

## 29a. Round 28 — the claims gate learned the difference between typed and sourced

`"4.8"` stays on `BANNED_CLAIMS`. What changed is that **the exemption is the source, not the
number**: a rating-shaped entry is allowed through only if `src/data/generated/reviews.json` — written
by `pull-reviews.mjs` from the Places API and validated by `npm run contracts` — actually carries that
value as a market's profile rating, *with* a count and a profile link. The same all-or-nothing rule
the component and the contract already apply, so a rating with no count is still just a number.

When a rating is exempted the gate says so out loud rather than passing silently:
`no unsourced claim in any page — 4.8 allowed as a pulled Google rating`.

**Proven in four states, not two:**

| | |
|---|---|
| No `reviews.json`, clean build | passes — baseline unchanged |
| `COLDSTREAM_FIXTURES=1`, synthetic 4.8, **no file** | **still fails** — a fixture has no source |
| Pulled 4.8 with count and profile URL | **passes**, and names the exemption |
| Pulled **4.9** while a typed 4.8 sits in copy | **still fails** — the case that matters most |

That third row is the false positive this fixes. That fourth row is why the fix is a match rather
than a flag: a pulled 4.9 does not license a hardcoded 4.8 elsewhere on the page.

**What it deliberately does not do.** It does not exempt a rating merely because the file exists; it
does not help a fixture build, since `COLDSTREAM_FIXTURES=1` supplies reviews from memory and writes
no file; and it cannot stop someone hand-writing a fake `reviews.json`. Nothing here can — that is
deliberate fabrication rather than the accident this gate catches, and `contracts.js` plus the FIXTURE
scan are what bite there. Every other entry on the list — prices, BBB, "25+ years", the invented
reviewer names — has no sourced form and can never be exempted.

Both test artefacts were reverted: the stray `4.8` planted in `national.js` and the throwaway
`reviews.json`. `4.8` appears in zero built pages.

---

## 30. Round 29 — fixture reviews on staging, and the hole that made refusing them wrong

Staging is internal and only the team has the link, so placeholder reviews belong there. I resisted
that twice, and the objection was aimed at the wrong thing: not "staging is public" — it is noindex
and unlisted — but that **`/handoff/` packages `dist/` for the WordPress cutover**, so a fixture
build sitting on staging could be zipped and handed to the host with the fake data in it.

Refusing to deploy was the wrong fix for that. **The fix is to close the hole**, which is now done:

**`npm run handoff` refuses to package any build containing FIXTURE content.** It scans every HTML
file in `dist/` and exits non-zero, naming the affected pages. Proven: it rejected a fixture build
citing 17 pages, and a clean build still packages normally — 69 pages, 55 indexable, 273 rules.

**It tests the OUTPUT, not the environment.** The realistic accident is not somebody setting
`COLDSTREAM_FIXTURES=1` while running the handoff; it is `dist/` having been built with fixtures an
hour earlier and nobody rebuilding. An env-var check would have missed exactly that.

**And the page says so in red.** `ReviewsByMarket` renders a banner — *"Placeholder reviews — not
real … Do not screenshot this for a client"* — whenever the data carries a `$fixture` marker. A build
warning is seen only by whoever ran the build, and this section is going to end up in a deck.

So three independent layers now stand between synthetic reviews and a customer, none of which stops
the team looking at the design:

| Layer | What it refuses |
|---|---|
| `npm run verify` | a fixture build, on two separate gates |
| `npm run handoff` | packaging one for the host |
| the page itself | being mistaken for real, in a screenshot |

**`COLDSTREAM_FIXTURES=1` is now set as a Netlify environment variable on the staging site**, so CD
builds carry the placeholders and they survive every push. Previously they were live only because of
a manual deploy and the next push would have wiped them. **Removing that variable is the single step
that turns them off** once a Places key exists and a real pull has run — and the real file wins over
fixtures anyway, so a pull makes them irrelevant before anyone remembers to unset it.

---

## 31. Round 30 — a placeholder hero video, market-scoped CTAs, and the hint removed

### The hero video is a marked placeholder, and it is the watermark

`/video/hero-placeholder.mp4` is not footage. It is a faint Coldstream wordmark on near-black, six
seconds, barely animated — **the same asset Hero.astro's header records as deliberately removed**,
on the grounds that "a placeholder that looks deliberate is worse than an empty ground: nobody
chases the real asset for it."

It is back on instruction, on the national home page only, and marked so nobody mistakes it for the
finished thing: `data-needs="hero-video"` on both the media wrapper and the `<video>`, greppable with
the rest of the punch list, plus a PLACEHOLDER note in the component. **Replace the file, keep the
props.**

**There was no "current hero still" to use as the poster.** The brief required one; the hero ground
is a CSS gradient and the only still on disk was the rejected watermark. So the poster is
**generated** — `hero-ground-poster.jpg`, a 1600x900 render of `hero_ground` straight from
`ui-tokens.json`. That is the current hero still in the only sense that exists, and it satisfies what
the requirement was actually for: if the video is slow, blocked or fails, the hero looks exactly as
it does today.

**Contrast was re-derived, not assumed** — which is what the warning added in §26 demanded of anyone
enabling this. Worst pixel in the headline region, through the **unchanged** scrim:

| Surface | White | Accent |
|---|---|---|
| Poster (gradient render) | 13.29:1 | 6.90:1 |
| Video, brightest of 144 frames | **15.40:1** | **7.99:1** |
| CSS ground (prior baseline) | 13.6:1 | 7.1:1 |

The video scores *better* than the gradient because it is darker. The scrim needed no change. **Real
roof footage against a bright sky will not inherit this** and the measurement has to be redone —
the component says so where someone swapping the file will read it.

Behaviour: `muted`, `playsinline`, `loop`, `preload="none"`; autoplay is set by script only after
clearing reduced-motion, viewport and connection. So a phone and a reduced-motion visitor **never
fetch the file at all** rather than merely not seeing it play.

### Market-scoped CTA — the last piece of hero copy still living in the component

The market heroes were already city-only and already in their market data objects; none hedged
across markets and the national hero kept the company-level language. The one gap was the CTA label,
hardcoded in `Hero.astro`. It is now a `cta` prop defaulting to the company wording, set per market
in `pages/{market}.js` beside that market's headline and sub — one place to edit per market, no
conditionals in the component.

No coverage was invented: nothing was added about surrounding communities that is not already in
`markets.js`.

### The "Looking for St. Louis?" prompt — REVERSAL

Added two rounds ago in §19 as a returning-visitor hint reading the `cs_market` cookie. **Removed on
instruction.** Recording it as a reversal because adding it was a deliberate decision, not an
accident.

**Checked before deleting, as asked: it orphaned nothing.** Its `href` was written by script at
runtime, so it was never part of the crawlable link graph at all — and each market landing is linked
from **all 68 other pages** by the footer's Markets list and the chooser cards. The orphan gate
passes. No replacement link was added anywhere.

Removing it took this component's only JavaScript with it: the three cards are plain links and the
call targets are plain `tel:` hrefs. The dead `.mchoose-hint` CSS went too.

---

## 32. Round 31 — the team review call (2026-08-18)

Eight items from the call. **Everything else raised on that call is still open and did not ship.**

### 1 · Nav restructure

Six trade/area items — Roofing · Siding · Windows · Gutters · Storm Damage · Service Areas — with
About pushed right against the CTA. Dropdowns on Roofing and Siding only; Windows and Gutters are
top-level links with none, as decided. **Not one "Services" dropdown**: top-level visibility was the
explicit call, and the horizontal room it costs is spent deliberately.

**THE MOBILE NAV IS THE REAL CHANGE.** The old rule was `@media(max-width:1040px){nav.main{display:none}}`
— at four items survivable, at seven it meant **85% of visitors had no way to reach a service page
from the header at all**. It is now a disclosure: `<button aria-expanded>` + panel, Escape closes,
focus moves in on open and back on close, tap-outside dismisses, and with JS off the panel is simply
visible rather than permanently shut.

Breakpoints, measured: **≥1180px** one line with room; **1024px** tight, gap 18→14px and font
.94→.90rem, still one line; **<960px** the horizontal nav is *replaced*, not hidden; **390px**
full-width panel, 48px rows, submenus as nested lists.

**Two items do not match the pages that exist, and are flagged rather than faked:**

- **Stone Veneer has no page.** Siding sub-services are vinyl, James Hardie and siding-replacement.
  Linking it would be a dead internal link — a gate failure, and a nav item promising a page we
  cannot show. Omitted; the line sits commented in `nav.js`.
- **Storm Damage is standalone in the nav, but its URL is still nested** at
  `/{market}/roofing/insurance-storm-damage/` — exactly where the call said it should not sit.
  Moving it needs a new page, a redirect rule and an inventory entry, none of which was authorised.

### 2 · "Local crews, in all three markets" removed

It implied a crew sourced per market — subcontracting, which we do not do. Replaced with the actual
differentiator: **one project manager who stays on the job**, not a salesperson who hands off at
signing. Market-scoped, written into each market's data object beside its headline.

**One correction to the brief:** that string rendered on the **national home page only**, not on
St. Louis. What St. Louis carried was "backed by our own local crews" in its hero sub — the same
implication, different sentence. Both are gone.

### 3 · Owens Corning removed

Badge, `MANUFACTURERS` entry, partner-strip entry, three artwork files, a stale CSS comment, and
five references inside the ported WordPress archive in `live-copy/` — that last one because the
archive is the source for the copy port, so leaving it there risked it coming back in. **Zero in
source, zero in 69 built pages** (was 64). The three hits left in this file are the historical
record; rewriting the log to erase a past decision would make it lie.

### 4 · Badge row

Trimmed to credentials only — the row used to mix accreditations with review-platform logos, which
argue differently. **The set now reads from `markets.js`**, so per-market credentials are a data
edit rather than a refactor: Leaf Preferred (Columbus) and Malarkey (St. Louis) are real but
unconfirmed and therefore **absent**. Size cap 92→68px, spacing 30→52px.

**⚠ BBB A+ IS WIRED BUT NOT RENDERING.** `CLAIMS.bbb` is null and `"BBB A+"` is on verify's
banned-claims list — the live WordPress site prints it with no accreditation record behind it. The
slot is in place and ordered; fill `CLAIMS.bbb` and it appears with no code change. **The gate was
not touched.**

### 5 · Body copy depth

Measured before writing: service hubs were already at ~1045 words median and the **market landings
were the thinnest pages on the site at ~703** — thinner than the pages they route to.

The three landings now run **1124 / 1162 / 1241 words**, written from each market's own conditions:
Cincinnati's river-valley freeze-thaw and hillside drainage; Columbus's open wind and a suburban ring
built within about fifteen years; St. Louis's hail and a brick housing stock. **Swapping a city name
into another market's blocks would produce factually wrong sentences** — which is the test the old
site failed.

`npm run similarity` is a new command: 5-word shingles, chrome stripped, flagging above 80%.
**Nothing is at or above 80%, before or after.** Market-landing similarity **halved, 54.4% → 28.8%**.
Service hubs sit at 69–74%; three pages about one trade sharing vocabulary is expected, and the
number is reported rather than padded away.

Mobile first at 85/15: blocks with their own subheads, measure capped near 62ch, one column below
860px.

### 6 · Phone swap

Already implemented in §23 and verified here rather than rebuilt: schema `telephone`, every `tel:`
link and the visible number agree per market with **one variant each** — no drift. National holds
844. Client-side swap on the same URL; no redirect, no URL change.

### 7 · Team photo slot

One per market, placeholder frame, `data-needs="team-photo-{market}"`. **No stock photograph stands
in for a crew** — a placeholder that looks like a real team is worse than an empty frame, the same
reasoning that took the watermark off the hero ground. Individual PM bios and headshots were raised
and declined on the call and are deliberately absent.

### 8 · Roofful widget

Right-edge tab, placement reserved, `data-needs="roofful-embed"`. **Nothing integrated** — no embed
code exists. Until it does the tab is a plain link to the estimate page, which is the honest version
of the same promise; the live site already had an "instant quote" CTA pointing at a page that does
not exist. `RooffulTab.astro` documents exactly where the script and the handler drop in.

The punch list now greps as 64 × `roofful-embed`, 3 × `team-photo-*`, 2 × `hero-video`.

---

## 33. Round 32 — the vinyl and Hardie pages are about vinyl and Hardie

The pages already existed, one per market, with product-specific section headings and
product-specific FAQs. The problem was proportion: **741 and 775 words of which roughly a fifth of
the sentences were about the material at all.** Four good product sections wrapped in the same
trust cards, served-areas list and CTA every other page carries.

Each now carries a product depth block — the material argument a homeowner choosing between the two
actually needs:

**Vinyl** — that it hangs loose on the nail rather than being pinned by it, and that wavy vinyl is
almost never a bad product but a crew that drove the nails home; that it is a rain screen so the
wall behind it does the work; that insulated panels are worth buying for flatness and rigidity
rather than for the heating bill; and that a partial repair on a ten-year-old wall often cannot be
colour-matched, which we say before doing it rather than after.

**Fiber cement** — that it is several times the weight of vinyl and needs a different crew and a
substrate somebody checked; that cutting it releases silica and is a working practice rather than a
preference; that specified clearances at roof, deck and grade are where installations fail, and that
board installed tight to a roof has been drinking for three winters; and ColorPlus against
site-painted with a straight answer on when each is right.

**Measured, not asserted:** 741 → **1109** and 775 → **1139** words, with the product sections now
**43% and 41%** of the body. The two pages score **21.6% similarity against each other in the same
market** — what they share is the boilerplate, not the argument.

**A note on the metric, because the obvious one is wrong.** Counting sentences containing the literal
word "vinyl" moved only 20% → 23%, and that is the measure failing rather than the copy. Good writing
uses a pronoun the second time; repeating the product name in every sentence is the keyword stuffing
the call explicitly ruled out. The share-of-page figure is the honest number.

**A silent-render bug, found by checking the word count rather than the diff.** The section was wired
as `sub.depth`, but `sub` is the URL param string from `Astro.params` — the object is `svc`. `.depth`
on a string is `undefined`, so `MarketDepth` rendered nothing and every gate passed. The word count
was unchanged from before the copy was written, which is the only reason it was caught.

---

## 34. Round 33 — the nav dropdowns got destinations

The nav structure requested here was, with two exceptions, the structure round 31 already built on
the 2026-08-18 call. `data/nav.js` had flagged both exceptions in its own header rather than
resolving them quietly. **Both are now resolved by building the pages, not by bending the nav.**

### 1 · What actually changed in the nav

**Storm Damage moved from sixth to third**, directly after Siding, as asked. Item count is
unchanged at seven, so the header takes no new horizontal pressure and the 1040px breakpoint
behaviour is untouched.

**Stone Veneer joined the Siding dropdown**, which round 31 had left commented out with "NO PAGE —
linking it would be a dead internal link". It now has one.

Everything else was already correct: Roofing → Roof Replacement · Roof Repair, Siding → Vinyl ·
James Hardie, Windows and Gutters as plain links, Service Areas, About pushed right. The only label
change is "James Hardie" → "James Hardie Siding".

### 2 · Six new pages, because a dropdown child had nowhere to go

On a market page every dropdown child resolved to that market's sub-service page. **On a national
page `childHref` had no market and returned the parent hub** — so five nav items pointed at the two
pages you were already standing on. That is the same fault that produced the national hubs in round
12, one level down, and it has the same fix.

```
/roofing/replacement/   /roofing/repair/
/siding/vinyl-siding/   /siding/james-hardie-siding/   /siding/stone-veneer/
/storm-damage/
```

**They are not a fourth copy of the market page.** The split is the one `[service].astro` already
documents: a market page answers "vinyl siding in Columbus" and carries local climate, crew, phone
and served areas; a national page answers "what is vinyl siding and how does it fail", which has
the same answer in all three metros. **No city name appears on any of the six.**

**Measured rather than asserted.** The similarity script compares market against market, so it
cannot see this pairing; the same 5-word-shingle method run national-against-market gives a **worst
pair of 24.1%** (vinyl and Hardie, which share the trust cards), with roof replacement at 14.6% and
storm damage at 8.7%. For scale, the three market landings sit at 28.8% against each other. The six
pages run 2328–2596 words.

### 3 · The national sub-slugs are not the market sub-slugs, deliberately

```
/roofing/replacement/  ←→  /{market}/roofing/roof-replacement/
/roofing/repair/       ←→  /{market}/roofing/roof-repair/
```

The national spelling is the one specified in the request. **The market spelling was not touched
and must not be**: 273 redirect rules resolve to `roofing/roof-replacement` and `roofing/roof-repair`,
and renaming those URLs would point every one of them at a 404. `childHref` takes a `national`
override per child so one nav entry serves both, and `marketService` carries the market path so the
chooser deep-links correctly. **No redirect rule was added, removed or re-pointed this round.**

### 4 · Storm Damage: standalone position, market-local destination

The call's reasoning holds up — one hail event bruises the roof, dents the gutters, cracks vinyl on
the windward wall and breaks window seals, and it is **one insurance claim rather than four jobs**.
A page nested under roofing describes a quarter of that.

So `/storm-damage/` exists and is where the item points nationally. **On a market page it still
goes to `/{market}/roofing/insurance-storm-damage/`**, because that page carries the market's own
storm history, its adjuster process and its phone number, and because 273 rules already land there.
Standalone position and local destination at the same time.

It is a **static route**, not an entry in `SERVICE_CONTENT`. Adding it to a market's `services`
array would have put it in the footer, the services grid and every market hub's navigation as
though it were a trade alongside roofing and siding.

**Nothing on that page promises a claim outcome, a payout, a timeframe or anything creative with a
deductible** — the four things storm-chasing contractors promise and none of them ours to promise.
It says so on the page, which is the part that is actually persuasive.

### 5 · ⚠ Stone Veneer is built and the offering is UNCONFIRMED

**Stone veneer appears nowhere in the ~150k words of live WordPress copy, and in no market's
`services` array.** The page was requested, and that request is taken as the answer to "do we offer
this" — but it is an assumption, not a source, and it is the one thing in this round that needs a
human yes.

What the copy therefore does **not** claim: no manufacturer certification, no completed project
count, no per-market availability. What it does carry is the work itself — that adhered veneer is a
facing rather than a wall, that the drainage plane behind it is the whole job, and that stone run
down into the soil is the failure we would be called to look at. All of that is true of the material
regardless of who installs it.

**It is national-only.** There is no `/{market}/siding/stone-veneer/`, because three of them would
be this page with a city dropped into it — the exact pattern the consolidation exists to remove —
and there is no local stone content to carry. `nationalOnly` in `nav.js` links the one page from
every market.

**If the answer is that we do not install it, delete the entry and the nav line.** Both are one
block each and nothing else references them.

### 6 · Two gates caught this round, and neither was relaxed

`\bcheap\b` fired on two sentences — "quick, cheap and the reason", "They are cheap" — where the
word was meant descriptively rather than as a value claim. **Rewritten, not exempted.** ("cheaper"
passes the word boundary and was already in use on an existing page.)

The sitemap gate then caught all six pages as indexable-but-unlisted. `sitemap.js` now derives the
five sub-pages from `nationalSubservicePaths()` — the same export the template's `getStaticPaths`
uses — rather than repeating them in a hand-kept list, which is the failure mode that file's own
header warns about. Storm damage is named explicitly, since nothing derives it.

### 7 · What was deliberately not done

- **No market stone veneer pages.** See §5.
- **No redirect changes.** The market sub-service URLs are unchanged, so the 301 map is untouched.
  `/roofing/roof-replacement/` and `/roofing/roof-repair/` are not aliased to the national spelling;
  no live URL points there and nothing internal links it. Worth doing if the mismatch ever bites.
- **The 390px header overflow is still there.** It is pre-existing, it is inherited from the
  prototype, and it now affects 75 pages instead of 69. The new H1s are no longer than existing
  ones, so nothing was made worse — but nothing was fixed either, and it remains the open UI bug.
- **The sub-service depth port stayed queued.** Four market sub-services still have no `depth`
  block; that is unrelated work and was left where it was.

---

## 35. Round 34 — the badge row reversed, and BBB unblocked

**This is a reversal of §32.4 and it is written down as one.** That round trimmed the hero badge
row to credentials only, on the 08-18 call's instruction. The instruction here is the opposite:
put the review logos back and stop gating BBB. The old reasoning is left in `badges.js` rather
than deleted, because a reversal is only readable next to what it reversed.

### 1 · Why the row said 3

Nobody broke it. Every market asked for **four** — `["gaf", "james-hardie", "homeadvisor", "bbb"]`
— and `BadgeRow` dropped BBB on `CLAIMS.bbb` being null, leaving three. It was three on pages
nobody had touched in weeks, which is how it was established that round 33 had nothing to do with it.

### 2 · BBB: accredited yes, letter grade no

The business confirmed the accreditation, so `CLAIMS.bbb` is set and the slot renders.

**`rating` is deliberately still null, and the badge says "BBB Accredited Business".** "Accredited"
is a yes/no status; **"A+" is a separate claim** — a letter grade BBB assigns, publishes and
revises — and only the first was confirmed. Printing a grade nobody sourced is precisely the live
WordPress behaviour this repo exists to stop, and it would have been the easy thing to do here.

Setting `rating: "A+"` is now genuinely one line: **tested by setting it, building, and confirming
the badge reads "BBB A+ Accredited Business" with the build still green**, then reverting.

**FOLLOW-UP, SAME DAY — THE GRADE WAS CONFIRMED AND IS NOW SET.** Asked as a second question and
answered separately, which is why it was worth asking: `CLAIMS.bbb.rating` is `"A+"` and the badge
reads **"BBB A+ Accredited Business"** on all 75 pages. The gate exemption written above is what is
holding it, and it reports itself — verify now prints *"BBB A+ allowed as sourced"* rather than
passing silently, so the exemption is visible on every run instead of being a quiet hole in the list.

**This is the field to re-check rather than set and forget.** A letter grade is not a fact about the
company, it is BBB's current assessment, and BBB revises it. Because the exemption releases only the
exact grade `claims.js` records, a stale value **fails the build** rather than shipping quietly —
which is the behaviour worth having and the reason the string stayed on the banned list.

### 3 · A gate was changed, and here is the change stated out loud

`"BBB A+"` is on verify's `BANNED_CLAIMS`. Left alone, sourcing the grade later would have **failed
the build on all 75 pages** — the gate refusing the sourced version of the thing it was protecting,
which is how a gate gets switched off by someone in a hurry. That was demonstrated before it was
fixed, not assumed.

The exemption is the same shape as §29a's pulled-rating one and **the exemption is the source, not
the string**: released only when `claims.js` carries an accredited record *and* a grade, and only
for the exact grade recorded. Accreditation without a grade — today's state — exempts nothing,
because the banned string never reaches the HTML anyway.

### 4 · Google, Yelp and Angi restored

Entries came back from git history; the artwork was still in `public/badges/`. Seven badges now:
GAF · James Hardie · BBB · Google · Yelp · Angi · HomeAdvisor, grouped by what each one argues —
manufacturer certifications, then the accreditation, then the review platforms.

**The national pages were showing four while every market page showed seven**, because `NATIONAL`
had no `credentials` key and `BadgeRow` carried its own hardcoded fallback. `NATIONAL.credentials`
is now explicit and the component's fallback derives from it, so the two cannot drift again.

### 5 · ⚠ The three review assets depict five filled stars

Not a footnote. **All three are five-star lockups**, which is a rating claim made in artwork, and
**no rating is sourced**: `TESTIMONIALS` is empty, every `REVIEW_PROFILES` entry is null, and the
market reviews pages are `noindex` for "no sourced reviews yet".

**No gate can hold this.** verify-build's unsourced-claim scan reads text and cannot see inside a
PNG, so the build will stay green whatever those images assert. `npm run reviews:pull` fills in the
real Google figures — and **if a pulled rating comes back below 5.0, the badge row and the reviews
section on the same page will contradict each other.** Recorded here and in `badges.js` because it
is the one part of this round that the tooling cannot protect.

### 6 · Owens Corning was NOT restored

It was removed on the 08-18 call for a different reason from the review logos — **"we do not run
that line"**, a credential we do not hold — and its artwork was deleted rather than kept. "Partner
logos as before" was read as the three review platforms, not as that. If we do run the line, the
artwork has to come back first; it is not recoverable from `public/`.

### 7 · Also not done

- **No seal image.** BBB's programme requires their own hosted, linked seal from the accreditation
  account, so it cannot be recreated. The slot renders as a typographic badge — solid rule, brand
  navy, `.badge-text` — rather than the dashed "asset pending" box, because the accreditation is
  real and a pending-looking slot misrepresents it in the other direction.
- **No profile URLs.** `href` is still null on all four review/accreditation badges. Setting
  `CLAIMS.bbb.profileUrl` now links the BBB badge to the record on its own; the other three take a
  URL in `badges.js`.

---

## 36. Round 35 — header spacing and hierarchy

### 1 · The duplicate CTA

Two near-identical buttons about 60px apart: "Get a Free Estimate" in the utility bar and "Get
Free Estimate" in the nav. **The utility bar's was removed, and the reason it was that one is
scroll** — the header is sticky and the bar is not, so past the fold the nav button is still on
screen and the other never was. /free-estimate/ is still linked from the header on every page;
the no-orphan-pages gate confirms nothing became unreachable.

The bar now carries exactly three things: market selector, phone, Service Areas.

### 2 · ⚠ THE UTILITY BAR WAS FAILING WCAG AA, AND THE BRIEF WOULD HAVE MADE IT WORSE

The brief asked for lower-contrast text so the bar reads as secondary. **Measured before writing
any of it: white on `--cs-primary` (#3A89C7) is 3.76:1, against the 4.5:1 that 0.9rem text needs.**
It was already failing, on every page, and pulling the text back further was the one change
guaranteed to deepen it.

So the recession comes from the **ground** instead. `--cs-primary-deep` (#2A6699) carries white at
6.07:1, which leaves room to sit the text at 86% and still measure **4.98:1**. The bar reads
quieter than the white nav AND passes, which it did not before. Type dropped to 0.82rem.

**Nothing in verify-build catches this** — the contrast gate measures hero copy only. The numbers
are recorded in base.css and UtilityBar.astro so the next person changing the colour has them.

Height came 46 → 44px and no further: **44px is the phone's touch target, not a style choice.**

### 3 · The phone and the market selector

The phone was already an `<a href="tel:">` — the brief said plain text — but it read as a statement
of fact: no glyph, no hover, no focus ring, target under 44px. It now has all four, plus a label in
front of it that swaps with the number: **"Call" nationally, the market name once one is chosen.**
The label joins `phone`/`telHref` as a third member of the same swap set, so "Cincinnati" can never
sit beside the Columbus number.

The selector gets a drawn chevron, hover and focus states, and an **`is-chosen`** state — set
server-side from `market.slug`, so it survives a page load rather than only reacting to a click.
Defaulted and chosen looked identical before.

### 4 · Nav hierarchy

Even **28px** gaps. Links moved from Montserrat at display weight to **Inter 600 / 0.9rem** — they
had shared a voice with the logo and the CTA, so three things competed for first read. Logo 44 →
40px so it stops setting the row height. Row min-height 78 → 84px, because the white row was
tighter than the blue bar above it. Carets are now SVG, smaller, `--cs-text-muted`, and rotate 180°
on open.

**Persistent active section**, resolved in SiteHeader from the URL with the market slug stripped.
**Storm damage is the case that makes it fiddly** — on a market page it lives under the roofing hub,
so a naive path test lights up Roofing on a storm page. It resolves first and is excluded from
roofing. All 13 URL cases verified, including both About variants.

### 5 · Sticky condense

Past 120px the row goes 84 → 60px, logo 40 → 32px, and a border appears; it releases below 90px.
**The two thresholds are deliberate** — a single one flickers when a reader rests exactly on it.

**One considered deviation from "transform and opacity only": height is transitioned directly.** A
row that condenses has to change height, and expressing that as a transform would scale the logo
and the type with it. This is one sticky element with a fixed child count, not a per-frame reflow.

### 6 · The drawer, and what the brief got wrong about it

**The brief says base.css still has `@media(max-width:1040px){nav.main{display:none}}`. It does
not — that was replaced in an earlier round and survives only as a comment recording it.** A
disclosure panel with aria-expanded, aria-controls, Escape and body-scroll-lock already existed.

What was genuinely missing, and is now built: a real **focus trap** (the toggle is part of the ring,
since it is how you get back out), the **phone inside the panel** (it lives in the utility bar,
which is gone the moment you scroll on a phone), a **transform-only slide** in place of a
display swap, and **aria-hidden management** so a closed drawer is not reachable by screen reader
while invisible — plus a breakpoint-change handler, because crossing 960px with it open would
otherwise strand a locked body and a stale aria-hidden.

### 7 · The 390px overflow bug is fixed, as a side effect

CLAUDE.md has carried "mobile overflow at 390px" as an open bug since the prototype. **It is gone:
measured scrollWidth 390 against clientWidth 390.** The cause was never the H1 — it was the CTA
sitting in the header row at ~200px, making the row's minimum content ~417px with no flex-wrap, so
the document grew wider than the viewport and every section inherited the overflow. Moving the CTA
into the drawer removed the widest item rather than shrinking it below the touch minimum.

### 8 · How this was checked, and the one thing that could not be

No browser tooling in this repo, so verification ran through **headless Chrome** (already installed)
against a local server, with the page in a **390px iframe** — Chrome clamps its own window to 500px
on macOS, so `--window-size=390` does not give a 390px viewport and the first screenshots were
misleading.

Verified: no horizontal overflow at 390 / 768 / 1200 · drawer closed sits at `translateX(343px)`
and `visibility:hidden` · click opens, focus moves to the first link · Escape closes and returns
focus to the toggle · Tab from the last item wraps to the toggle and Shift+Tab back · body lock
on and off · condense applies at y=300 and gives 60px/32px/border.

**Three "failures" during that pass were harness artifacts, not bugs, and each was chased down
rather than assumed:** headless freezes the animation clock, so `getComputedStyle` returns the
start value of any transitioned property forever; `window.scrollY` never changes under
`--virtual-time-budget`; and rAF stops firing after nested timers, which latches the scroll
handler's `ticking` flag. The condense threshold was finally proven by stubbing `scrollY` and
dispatching on the **first** frame, while one rAF slot still worked.

---

## 37. Round 36 — Owens Corning restored

**A second reversal of §32.3, and it is written down as one.** The 08-18 call removed Owens
Corning as **"a line we do not run"** — a credential we do not hold is worse than a missing one —
and §35 declined to bring it back with the review logos because that was a different reason.
It is back on instruction.

**I was wrong about one thing and it is worth correcting: the artwork was recoverable.** §35 said
it was not, which was true of `public/` — the three files were deleted rather than kept — but git
had them the whole time. All three came back byte-for-byte from `94a1981^`:
`owens-corning-preferred.{png,webp}` and `owens-corning-mark.png`.

Restored in five places, matching what §32.3 recorded removing: the badge, the `MANUFACTURERS`
entry, the partner-strip entry, the three artwork files, and the CSS comment that had been edited
to drop the second wordmark from its measurements.

### ⚠ The tier is a specific claim and it is the artwork's own wording

The badge says **"Owens Corning Preferred Contractor"**, which is what the supplied asset reads.
Owens Corning runs Preferred and Platinum and the two are not interchangeable. **A misstated
manufacturer certification is a compliance problem rather than a copy nit** — the same reasoning
that kept the GAF tier withheld until the artwork itself settled it — so nothing here claims
beyond what the asset carries. Worth a look at the OC contractor portal to confirm the tier is
current, since a programme level can lapse in a way a PNG on disk cannot.

### The eighth badge broke the row, and the fix was measured

Eight badges came to **1206px against 1136px** of usable width (`--cs-wrap` 1180 less 44px of
padding). That dropped HomeAdvisor onto a second row **on its own** — the exact failure the
width-cap note in base.css records for GAF, and an orphan reads as a mistake rather than as a wrap.

Trimming the gap alone was **twelve pixels short**, so the height cap moved too: **gap 52 → 40px,
height cap 68 → 62px, width cap 168 → 152px**, and the BBB text badge's max-width with them. The
height is the lever that matters, because every logo resolves by height and lowering it shrinks all
eight proportionally. The row now measures **1096px and holds one line**, verified in headless
Chrome at 1024, 1200 and 1400px — the row's own height stays at 138px, which is what one row is.
Below the drawer breakpoint it wraps, which is correct.

The three widest items — GAF, Owens Corning and the BBB text badge — all sit **at** the width cap,
so they are what a ninth badge would have to be measured against.

### Not restored

**The five references inside `src/data/live-copy/`.** That archive is the pulled WordPress source
for the copy port, and §32.3 stripped them so the name could not come back in through a port. The
name is now legitimate, but the archive is a record of what the live site said rather than a place
to edit — re-pulling with `npm run live:pull` would restore them from source if they are wanted.

---

## 38. Round 37 — St. Louis names its own manufacturers

### The section did not exist

"Update St. Louis to show these only" had nowhere to land: **the partner strip renders on national
pages only — the home page, the five national hubs and the five national sub-service pages. Zero
market pages carried one**, and `MANUFACTURERS` in badges.js is exported and used nowhere. The only
brand section on a St. Louis page was the credential badge row, which is a different argument.

So the strip is now market-scoped, the same shape `credentials` already uses: a market names keys
in its own `partners` array and **a market with no array renders no section at all.** That is why
Cincinnati and Columbus are untouched — they have never had one, and inventing a product list for a
market nobody has confirmed one for is what the gates exist to stop.

St. Louis: **Malarkey · ProVia · Royal Building Products · Owens Corning · CertainTeed · GAF.**

**James Hardie stays in St. Louis's `credentials`** while being absent from its product strip. An
Alliance Elite certification and a line we stock are different claims and the two rows argue
differently — that separation is the whole reason the 08-18 call split them.

### Two logos did not exist, and one still effectively does not

Four of the six were already self-hosted. The other two were hunted rather than assumed:

**Malarkey — solved properly.** Coldstream's own WordPress has nothing (`?search=malarkey` returns
zero). Malarkey's own site serves its horizontal full-colour mark directly, so that is what is in
`/public/partners/malarkey.svg`. Manufacturer's own artwork, source recorded.

**⚠ GAF — solved badly, and it is flagged rather than quietly shipped.** gaf.com returns **403 to
everything**: curl, a real headless Chrome, and a fetch tool. Coldstream's own library has exactly
one GAF asset and it is the "GoldElite™ Commercial Contractor" lockup, which asserts a tier and
duplicates the badge row on the same page. **Cropping it the way Owens Corning was cropped does not
work** — OC's lockup contains OC's own brand mark, whereas GAF's contains the GoldElite device, so
a crop stays a tier claim.

What shipped is `commons.wikimedia.org/wiki/File:GAF_logo.svg` — visually the correct red GAF
square, but **a contributor's redraw ("HapHaxion", own work) under CC BY-SA 4.0**. Two things wrong
with that and both are recorded in partners.js: it is not authoritative artwork, and CC BY-SA
nominally wants attribution and share-alike that a commercial marketing page does not give it.
**Replace it with the file from GAF's contractor portal** — drop it in, update three fields, done.

### `marketOnly`, and the bug it fixes

Appending Malarkey to `PARTNERS` put it on the **national** strip too — a line one office runs,
shown as though the company ran it in three metros. Caught by reading the built output rather than
by any gate. `marketOnly: true` keeps an entry out of the national default; a market that wants it
names it. National is back to eight.

### Two changes beyond St. Louis, stated rather than buried

- **GAF now renders as a logo on the national strip**, where it was a typographic wordmark. That
  follows from giving the entry a `file` and it applies everywhere the strip appears.
- **`Royal` is now `Royal Building Products`** in its display name, per the wording used in the
  request. Its `alt` already said so.

---

## 39. Round 38 — the sub-service depth port finished, and it changed shape

Round 33 gave two of six sub-services a depth block and left four. This finishes them — and not in
the shape round 33 used, for a reason that only became true afterwards.

### Why these four are PER-MARKET and vinyl/Hardie are not

`depthFor(svc, marketSlug)` now accepts two shapes. Vinyl and James Hardie stay **shared** across
the three markets: how a plank is fastened and what sits behind it does not change by metro, and
pretending it did would be the city-swapped copy this rebuild exists to remove.

The other four are **per-market**, because round 34 built national pages that took the shared
argument off them. `/roofing/replacement/` and `/roofing/repair/` now carry the material and process
case, and `/storm-damage/` carries the claims case. A shared block on the market page would have
duplicated those and left the market page with nothing only it could say — the exact rule in
CLAUDE.md. What a market page can say is what THIS climate and THIS building stock demand of the
job, and **swapping a city name between these twelve blocks produces sentences that are false**:
ice damming on north slopes is not St. Louis's problem, brick parapets are not Columbus's, and a
subdivision that aged in one fifteen-year run is not Cincinnati's.

### Measured, and it went the opposite way to the obvious guess

Adding ~400 words of shared copy would have pushed cross-market similarity **up**. Per-market copy
pushed it **down by roughly 22 points on every one of the four**:

```
                          before   after
roof-replacement           53.7%   30.8%
roof-repair                55.2%   30.9%
insurance-storm-damage     57.7%   32.8%
siding-replacement         52.2%   30.3%
```

Those four are now among the most distinct pages on the site — tighter than the market landings at
28.9% only just, and far below the shared-depth pair (vinyl 72.9%, Hardie 66.6%). **The two shared
blocks are now the outliers among sub-services**, which is defensible on the material argument but
worth a look if anyone wants the number down.

Against their national counterparts, measured with the same method the similarity script does not
cover: **roof-replacement 12.2–13.0%, roof-repair 14.3–15.0%, storm damage 7.5–7.7%** — all lower
than vinyl and Hardie's 23.6–24.3%, which still carry a rewritten version of the shared argument.

All 18 market sub-service pages now run **2,426–2,598 words**, tightly clustered, where the four
untouched ones sat around 2,100 against the depth pair's 2,470–2,530.

### A market with no entry renders nothing

`depthFor` returns null for a market absent from a per-market block, and `MarketDepth` renders
nothing without blocks. So these can be filled in one market at a time, and a missing market is a
gap rather than a broken page.

---

## 40. Round 39 — the selector now moves the logos too

Reported: choosing Cincinnati on the home page swapped the phone and left the manufacturer strip
showing all eight. Two separate faults behind one symptom.

### 1 · Cincinnati and Columbus had no set at all

Round 37 gave St. Louis a `partners` array and left the other two markets without one, so their
landing pages rendered **no strip whatsoever** — there was nothing for a selector to switch to.

Confirmed on 2026-08-21 that **St. Louis is the variant and the other two match the company-wide
set**, so both are now written out explicitly rather than left to fall through to the default.
That is deliberate: *"these two happen to match today"* and *"these two have no list"* are
different facts, and only the first survives someone editing the default later.

    cincinnati  8    columbus  8    st-louis  6

### 2 · The national strip ignored the control sitting next to it

The selector reads as "this is where I am". A strip that ignores it is the page disagreeing with
its own chrome. `swappable` opts the home page in; on a market page the selector NAVIGATES, so
there is nothing to swap and it stays off.

**The server still renders the company-wide set.** A crawler, and any visitor who never touches the
control, get the national eight; only a deliberate choice changes it. The sets are derived from the
same `markets.js` data the market pages use, so the home page cannot drift from `/st-louis/`.

### A cloned node, and why not createElement

The swap rebuilds each track by **cloning the `<li>` the server already rendered** rather than
building one. Astro scopes component CSS behind a generated `data-astro-cid-*` attribute, and an
element made with `createElement` would not carry it — the new logos would arrive unstyled. Cloning
sidesteps that and means the script never has to know what the attribute is called. Verified in
headless Chrome: the attribute survives, and the duplicate track's images keep `alt=""` so the
aria-hidden copy stays silent.

Measured after: default 8 · st-louis 6 · cincinnati 8 · "other" back to 8.

### Not done

The **heading does not change with the set** — pick St. Louis on the home page and six St. Louis
logos appear under the national wording. Left alone because the home page's own heading is written
to speak for the company, and swapping copy as well as logos turns a national page into a market
one. Worth revisiting if the mismatch reads oddly.

---

## 41. Round 40 — the real BBB seal, and three smaller fixes

### The seal is BBB's own, and the badge now links to the record

`CLAIMS.bbb` was carrying an A+ confirmed verbally with no URL behind it. **Checked against BBB
itself on 2026-08-21**: the profile states A+ and "BBB Accredited Since: 3/27/2017", which matches
what the business said and is now recorded with the URL that proves it.

The typographic badge is gone. `/badges/bbb-accredited-seal.svg` is **BBB's own artwork from
m.bbb.org** — the same asset their profile page serves — and the badge **links to the accreditation
record**, which is the strongest form this claim can take: a reader can check it rather than take
our word for it. `profileUrl` lives in claims.js rather than badges.js, because the URL is the
evidence and evidence belongs with the claim.

It is the "NoRating" seal, so the mark says ACCREDITED BUSINESS and prints no grade. The A+ is in
the alt text and on the far end of the link.

**⚠ A 0x0 BUG THAT LOOKED LIKE A CSS PROBLEM AND WAS NOT.** The seal loaded perfectly — `complete`
true, `naturalWidth` 300 — and rendered as an empty 138px gap in the row. Wrapping it in
`<picture>` to match the other badges' DOM shape was tried and **changed nothing**, which is the
useful half of the story. The cause was in the asset: BBB ship the seal with a `viewBox` and **no
width/height**, so it has no intrinsic size, and `.badge img` sets `width:auto` — which resolves to
zero. Fixed on the file rather than with a CSS override, because an SVG with no intrinsic size does
this anywhere it is used. Any future single-file badge wants the same check. Eight badges, one row,
138px tall.

### Three smaller ones

**The gutters scrub video is gone** — both templates and both asset files. `ProcessScrub` renders
nothing without a poster and a source, so those pages simply carry no scrub section now.

**"The value option" came off the vinyl pages.** Lead and meta description on the national page, and
the lead on all three market pages. The phrase survives in `services.js`'s hub card and in the
depth intro, which are different sentences in different places — say if those should go too.

**Service-area towns are links now on `/service-areas/`.** They were 77 plain `<li>` items while the
identical towns on `/{market}/` were links — the same names behaving differently on two pages, which
reads as one of them being broken. **The rule is imported from `locations.js` rather than rewritten**:
`areaForTown` returns a slug, `""` for a market whose locations live on one metro page, or `null` for
a town with nowhere to point, and `""` IS FALSY — getting that comparison wrong silently unlinked all
26 Columbus towns once already.

---

## 42. Round 41 — the SEO surface, measured against a competitor that ranks

The brief was to model on SWORD Roofing. They were found at **swordroof.com** — a Cincinnati
roofing and siding company, so a direct local competitor rather than a generic example. Their
pattern, read off the live pages:

```
home      SWORD Roofing | Your Trusted Cincinnati Roofing Company      55 chars
services  Roofing, Gutter & Siding Services in Cincinnati, OH | SWORD  63
about     About Us | SWORD Roofing                                     24
```

Short. City AND state code. A brand suffix of one word. H1 restating the title's keyword phrase.

### What was actually wrong here, measured rather than assumed

Decoding HTML entities first, because `&amp;` inflates every title with an ampersand by four
characters and the first pass over-reported the problem by more than double — 24 "over-length"
titles were really 11.

```
                       before   after
titles over 60 chars      11       0     (max now exactly 60, median 54)
descriptions over 160      7       0     (max now 159, median 138)
duplicate descriptions     9       0
duplicate titles           0       0
```

**The nine duplicate descriptions were the real find.** All three markets shipped IDENTICAL meta
descriptions on storm damage, James Hardie and vinyl — the same three page sets whose body copy
round 38 had just made 30% similar. The description is the most direct signal a crawler has that two
pages are the same page, and it was contradicting the copy underneath it.

The cause was derivation: `title` came from `h1` and `description` from `lead`. `h1` is a sentence,
so titles ran long; `lead` carries no city, so the three markets collapsed onto one string. Both are
now **written** in a `seo` block per sub-service, using `cityState` — which is where the state code
comes from, and a state code is what a local search matches on.

Service hubs had the same shape of fault: `${lead} Serving ${m.name} from our ${office} office.`
appended a tail to an already-complete sentence and pushed three hubs to 173–175. `SERVICE_META`
replaces it with a written, region-bearing line per service.

### What was taken from SWORD, and what was refused

**Taken:** titles inside 60, city + state code on local pages, one keyword idea per title, and
descriptions that end in a concrete next step.

**Refused, on the voice spec:** their descriptions run `FREE Roof … inspection!` and "top-notch",
"expert solutions". Capitalised FREE, exclamation marks and vague superlatives are exactly what
`brand/voice-spec.json` bans, and a competitor ranking well is not evidence those particular words
are why. The phone number in a description IS worth having and market pages now carry it where the
line has room — that is a genuine local-intent signal rather than hype.

### One change that was already the rule, now applied to the title

`/roofing/` and `/windows/` listed all three cities in the title. `[service].astro`'s own header
says a national page "must never compete with [the market hubs] on a city term" — the body was
careful about that and the title was not. Cities dropped; they remain in the description.

---

## 44. Round 42 — the rest of the SEO surface, and gates so it stays fixed

Round 41 wrote the titles and descriptions. It did not leave anything behind to hold them, and by
the time this round opened **two pages had already drifted back over the limits** — `/about-us/` at
63 characters and `/financing/` at 62 with a 163-character description. That is what an unenforced
rule does, and it is the reason the largest part of this round is two new gates rather than new
copy.

The comparison is the same one round 41 used: **swordroof.com**, a Cincinnati roofing and siding
company that ranks. Round 41 read their titles. This round read their `<head>` and their JSON-LD.

### The three real defects, worst first

**1. Every shared link rendered as a blank rectangle.** `BaseLayout` has pointed `og:image` at
`/og-default.jpg` since the first build. **No such file was ever in `public/`.** Every link posted
to Facebook, LinkedIn, Slack or iMessage since this repo existed has shown a bare URL with no card.

Nothing caught it and nothing could have: the dead-link gate reads `href`, not `content`, and the
contrast gate measures hero media only. A broken share card is invisible from inside the site —
you find out when somebody else pastes your link.

The card is now **generated**, by `scripts/build-og-image.mjs`, from `ui-tokens.json` and the
on-dark logo, in headless Chrome at 1200×630. Generated rather than exported by hand for the same
reason `tokens.css` is generated: an exported JPEG is the first thing to go stale when the brand
repaints, and nobody would notice. The copy on it is the three always-true claims and the three
metro names — nothing gated can reach it. `npm run og` is in `npm run build`; no Chrome means a
warning and the committed file, not a failed build.

**2. `"telephone": "tel:+15132580450"` in every business node.** `markets.js` exposes `telHref` for
anchors and it was passed straight into schema. schema.org expects a phone *number*; a `tel:` URI
there is a parse failure that costs the property silently, which is exactly why it survived four
rounds of review — nothing renders it, so nothing looks wrong. Now the displayed number, which is
also the string the GBP listing has to match.

**3. Three hand-written copies of the Organization node** — `index.astro`, `about-us.astro`,
`[market]/index.astro` — and they had already diverged: only the about-us copy carried an `@id`.

### What SWORD had that we did not

Their home page ships one `RoofingContractor` carrying `sameAs`, `openingHoursSpecification`,
`priceRange`, a logo, an `OfferCatalog` of twelve services and 56 served places. Ours carried a
name, a phone, an address and an `areaServed` list. **The gap was never in the copy — it was in
what the page told Google the business *is*.**

Taken, and now in the new `src/data/seo.js`:

```
sameAs                 the profiles that are the same real-world business
logo / image           on the Organization and on all three market nodes
hasOfferCatalog        each market's services, with the market's own URLs
parentOrganization     the three offices now point at one company @id
provider: orgRef()     national Service pages reference that @id too
og:site_name, og:locale, og:image:width/height/alt, twitter:image
robots: max-image-preview:large, max-snippet:-1, max-video-preview:-1
```

`parentOrganization` and `orgRef` are the ones worth naming. Before this round the home page's
Organization, the three market `RoofingContractor` nodes and the `provider` on every national
service page had no identifier joining them. To a crawler that is not one company with three
offices — it is four similar businesses that happen to share a domain.

**Refused: `priceRange`, which they set to `"$$$"`.** It is a claim about what Coldstream charges
and nobody has stated it — the same ruling that keeps the live site's "$11,000–$14,000" out of this
repo. Also refused: their `serviceArea` property, which schema.org superseded with `areaServed`.
Copying a competitor's mistake is not benchmarking.

### Two things went into the claims gate rather than into a template

**`PROFILES`** — the `sameAs` list. `sameAs` is not decoration: it asserts "this URL is the same
real-world business as this website", and pointing it at a profile that is not ours merges our
entity with someone else's in the Knowledge Graph. So it is gated like a rating is. The BBB entry
is `CLAIMS.bbb.profileUrl` by reference, not a second copy. The Facebook, Instagram and LinkedIn
entries were found under the exact brand handle on 2026-08-21 and each records that, **flagged for
ownership confirmation**.

**`HOURS` — null.** A plausible 8-to-5 typed into a schema block is the same class of invention as
a plausible star rating, and it is worse in public: it feeds the "Open now" line beside a local
result, so a customer acts on it.

**Still the biggest hole: no Google Business Profile URL for any of the three offices.** That is
the link between this website and the map pack, and it cannot be guessed from a search result — it
comes off the GBP dashboard. It is on `CLAIMS_PENDING` and the build names it every run.

### The gates (verify-build §12 and §13)

```
§12  every page has a title and a description
     title ≤ 60, description ≤ 160 — measured AFTER decoding entities
     no two INDEXABLE pages share a title or a description
§13  every og:image resolves to a file this build contains
```

**Entities are decoded first, and that is the part to remember.** `&amp;` is five characters in the
file and one on screen. Round 41's first pass measured raw HTML and reported 24 over-length titles
where there were 11 — more than double, entirely from ampersands. A gate that cries wolf gets
edited out.

**Duplicates compare indexable pages only.** Two noindexed placeholders sharing a description is
not a ranking problem; the nine duplicate market descriptions round 41 found were.

All four failure modes were proved by mutating built HTML and re-running verify: over-length title
caught at 74/60 *after* decoding, duplicate description caught, missing og:image caught.

### What was deliberately NOT changed

**`<lastmod>` is still absent from the sitemap.** The obvious implementation — stamp today's build
date on all 61 URLs — is a lie that Google learns to ignore within a few crawls, because it says
every page changed every time anyone ran a build. A truthful `lastmod` means resolving each URL to
the source files that produce it and reading git's date for those; that is a real piece of work and
it is worth doing properly or not at all.

**`/about-us/` and `/financing/` are still noindex.** Their titles are inside 60 now, but the
reason they carry noindex is unchanged: the about page is mostly company-history claims nobody has
sourced, and the financing page cannot quote terms without a lender. Trimming a title does not earn
a page the right to be indexed. Porting `/about` remains the top of the not-done list.

**No `AggregateRating` anywhere,** for the reason it has never been there: no GBP pull yet.

## 46. Round 43 — the second SEO pass, on everything the first one did not look at

Round 42 fixed the `<head>` and the entity graph. This round audited what was left — icons,
headings, internal linking, structured-data validity, thin content, crawl depth — and found six
things. Two were real holes, four were tidying.

### The site had no icon of any kind

Not a favicon, not an apple-touch-icon, nothing. That is not only a blank browser tab: **Google
prints a favicon beside every result on mobile**, and a site without one gets a generic globe while
every competitor in the list shows their mark. It is the smallest piece of brand real estate in a
search result and ours was empty.

`scripts/build-icons.mjs` now generates the set — `.ico` at 48 (the size Google's guidance asks
for), PNGs at 96, 180 and 192 — from the on-dark lockup and the brand navy, in headless Chrome,
the same way the OG card is generated. **The mark, not the lockup:** "COLDSTREAM EXTERIORS" set
across 16 pixels is a grey smear, and 16 pixels is the size that matters. Drawn white on navy
rather than blue on transparent, because a transparent icon vanishes into a dark browser chrome.

The `.ico` is a PNG inside an ICO container — valid since Vista, 22 bytes of header written by
hand so this repo takes no image dependency for one file. verify-build §13 was extended to cover
icon links for the same reason it covers og:image: a `<link rel="icon">` at a path nothing wrote
fails exactly as silently.

### Four H1s named the page without naming what it was for

The H1 is the strongest on-page heading signal there is, and four indexable pages spent it on
something else. **The national service hubs are the important case.** Round 41 removed the three
city names from their titles, quoting the template's own rule — a national page "must never compete
with [the market hubs] on a city term" — and left the H1 reading *"Roofing across Cincinnati,
Columbus and St. Louis"*. The fix was half-applied: the page went on bidding for the city terms its
own market pages are built to win, from a stronger element than the one that was corrected.

```
/roofing/          Roofing across Cincinnati…    →  Roofing contractors who walk the roof first
/siding/           Siding across Cincinnati…     →  Siding, fitted by the crew that measured it
/windows/          Replacement windows across…   →  Replacement windows, measured opening by opening
/gutters/          Gutters across Cincinnati…    →  Seamless gutters, sized to the roof above them
/columbus/locations/   Where We Work Across Central Ohio  →  Areas We Serve in Columbus
/free-estimate/    Tell us what you need…        →  Your free, no-obligation estimate
/service-areas/    Cities we service             →  Roofing and exterior service areas
```

`/free-estimate/` is the one to notice: **priority 0.9 in the sitemap, second only to the home
page, and its H1 contained no search term at all.** The warm line was not deleted — it moved down
one level, where it is still the first thing read after the heading.

The cities stay in the meta descriptions, which is where round 41 put them: read by a person
deciding whether to click, not weighed as a heading.

### One page had two inbound links and the rest had twenty

Measured across the built site: every sub-service carried 18–21 inbound internal links except
`siding-replacement`, which carried **two**. The difference was not quality — it was the header.
Four of the five sub-services sit in a nav dropdown that renders on all 75 pages; siding-replacement
does not, so the only page linking to it was its own hub.

**The fix is not a nav edit.** That nav was decided on the 2026-08-18 call and its shape is
deliberate — Roofing lists jobs, Siding lists materials. Instead every sub-service page now carries
a sibling row, **derived from `SUBSERVICES` rather than from `NAV`**, so no page can be starved by
being left out of a menu. It is also the link the reader actually wants: someone reading about
siding replacement is choosing between materials on the next page.

Cross-market similarity moved 30.1% → 32.1% on that set, well inside the 80% gate.

### Three smaller ones

**Every page jumped h2 → h4 at the footer.** The footer column titles were `<h4>` under a document
whose sections are `<h2>`, on all 75 pages — a heading level skipped is a screen reader announcing
a subsection of something that was never opened. They are `<h2>` now; only the selector in base.css
moved with them.

**Two schema nodes published empty arrays.** `/blog/` emitted `blogPost: []` and the three gallery
pages emitted `image: []` — each stating that the list exists and is empty, which is not what "no
posts migrated yet" means. Both are now omitted when empty, the same rule the rest of the site
follows for a null claim.

**robots.txt and two sitemap comments said nineteen noindex pages.** It is fourteen.

### What the audit found nothing wrong with

Worth writing down, because a clean result is only useful if it is recorded:

```
0  thin pages            min 310 words, median 1159
0  orphans               every indexable page ≤ 3 clicks from home
0  duplicate H1s         across 61 indexable pages
0  generic anchor text   no "click here", no "read more"
0  links missing a trailing slash
0  images without width and height   (no layout shift from media)
0  images without alt                (119 decorative, alt="" by intent)
4  external links, all rel="noopener"
```

### Still deliberately not done

**`<lastmod>` in the sitemap.** Reconsidered this round and refused again. The tractable version —
stamp the build date on all 61 URLs — tells Google every page changed every time anyone ran a
build, and Google stops trusting the field within a few crawls. The honest version means resolving
each URL to the source files that produce it and reading git's date for those. It is worth doing
properly or not at all.

**`image` on the business nodes is the OG card, not a photograph of real work.** It is a valid
image and better than nothing; it becomes a real one when the Contractors Cloud job pull lands.

**The service hubs sit at 66–74% cross-market similarity** — under the gate, but the highest on the
site, and the same three sets whose descriptions were duplicated before round 41. That is a copy
round, not a metadata one.

## 48. Round 44 — the pages have to be readable by machines that are not Google

The ask was to optimise every page for AI. That phrase covers a lot of nonsense, so this round
worked from what is actually true about how answer engines read a page, and refused the rest.

**What is true:** ChatGPT Search, Perplexity, Google AI Overviews and Claude all read ordinary HTML
and lean much harder on structured data than a classical crawler does, because they are trying to
answer rather than to rank. They mostly do not execute JavaScript. They reward a page that states
its facts unambiguously and can be fetched in one request.

**Where this site already had an advantage worth writing down:** it is static HTML with no client
framework. Everything an answer engine needs is in the first response — no hydration, no
client-rendered content, nothing behind a bundle. That was decided for other reasons in round 1
and it happens to be the single largest factor here.

### One @graph per page, instead of three unrelated facts

A page used to emit its breadcrumb, its business or service node, and its FAQ as three separate
`<script>` blocks. Every one of them was valid. **Nothing said they described the same page**, and
nothing tied any of them to that page's URL, title, publisher or language. A reader — a crawler, an
answer engine, a model asked "what does this company do in Columbus" — got three unlabelled facts
and had to infer the join.

```
before                              after
<script> BreadcrumbList             <script> @graph [
<script> RoofingContractor            WebSite
<script> FAQPage                      WebPage  ── isPartOf ─→ WebSite
                                               ── about ────→ Organization
                                               ── breadcrumb → BreadcrumbList
                                      Organization (lean)
                                      BreadcrumbList
                                      RoofingContractor ── parentOrganization → Organization
                                    ]
                                    <script> FAQPage ── mainEntityOfPage → WebPage   (joined by @id)
```

**The lean Organization is the part that was actually broken.** `about` and `publisher` both point
at the Organization's `@id`, and that node was written out in full on `/` and `/about-us/` and
nowhere else — so on **73 of 75 pages those references pointed at nothing a reader of that page
could resolve**. A crawler is not obliged to fetch another URL to resolve an `@id`. Every page now
carries the organisation, but a lean version: identity, name, URL, logo. **Not the addresses** —
three `PostalAddress` nodes on all 75 pages would restate the NAP everywhere, which is exactly what
the location-page ruling forbids and what verify-build §3 gates.

The FAQ stays in its own block because the component owns it and the layout cannot see the items.
It joins the graph by `@id` instead, which is how JSON-LD merges nodes across blocks on one page.

### Places are entities now, not strings

`{ "@type": "City", "name": "Columbus" }` is a string in a box. There are Columbuses in Ohio,
Georgia, Indiana, Mississippi and Nebraska — and **the site's own geo-detection code already
carries a comment about exactly that ambiguity**, refusing to route a Columbus, Georgia visitor to
a Central Ohio roofing page. The schema was making the mistake the JavaScript was careful about.

The three metros and two states now carry Wikidata identifiers, **verified against Wikidata by
label and description on 2026-08-21 rather than recalled**:

```
Q43196  Cincinnati  "city in and seat of Hamilton County, Ohio, United States"
Q16567  Columbus    "capital city of the U.S. state of Ohio and seat of Franklin County"
Q38022  St. Louis   "independent city in Missouri, United States"
Q1397   Ohio        Q1581  Missouri
```

**The 77 towns do not, and must not be guessed at in bulk.** "Milford" alone is a town in Ohio,
Connecticut, Delaware, Massachusetts, Michigan, Nebraska, New Hampshire and Pennsylvania, and a
wrong Wikidata ID is worse than none — it actively asserts the wrong place. Adding one means
looking it up, the way these five were.

While fixing this, a related gap: **`areaServed` on the Cincinnati business named 24 suburbs and
not Cincinnati.** `servedAreas` is the ring of towns, and nothing added the metro itself. It does
now, deduped, first in the list.

### `<lastmod>` — refused in round 42, refused in round 43, done in round 44

Both earlier rounds wrote down the same objection and both were right at the time: stamping the
build date on all 61 URLs tells a crawler that every page changed every time anyone ran
`npm run build`, and Google uses `lastmod` only while it stays accurate. Both concluded it was
worth doing properly or not at all.

`scripts/build-lastmod.mjs` does it properly. Per URL, the date is the newest commit touching the
**content sources** that page is built from — its route template plus every module under
`src/data/` it imports, transitively.

**What is excluded is the design of the thing.** Components, layouts and stylesheets are not
counted: editing `BaseLayout` changes the bytes of all 75 pages without changing what any of them
*says*, and a sitemap reporting 61 modifications because a font preload moved is the same lie in a
more expensive wrapper. Shared *data* is counted, and that is not the same mistake — if
`markets.js` changes, the copy on every page reading it really can change.

**⚠ ONE SUBTLETY THAT WOULD HAVE RECREATED THE BUG IT WAS BUILT TO AVOID.** The generated map lives
in `src/data/generated/`, and `seo.js` imports it. Following that import would make every page
depend on the date map — so committing a new map would bump every page's date, on every build,
forever. The walker skips `src/data/generated/` for exactly that reason, and the map is now
verified stable across consecutive runs.

No git, or a file with no commits: the entry is omitted and both consumers drop the field.
verify-build §18 requires the sitemap to be all-dated or none-dated, because a sitemap where *some*
URLs carry a date is the state that misleads — the undated ones read as never having changed.

### robots.txt names the AI crawlers and allows them

`User-agent: *` already permitted every one of them, so **none of the new lines changes what any
crawler may do.** They are there because a named directive is a stated position, and this is a
position worth stating rather than leaving to a wildcard somebody later narrows without thinking
about the consequence.

The reasoning, recorded in the file itself: a roofing customer increasingly starts at an assistant
rather than a search box, and a blocked crawler cannot cite you — it can still describe you, from
directory listings and reviews rather than your own words. This site is a careful, sourced account
of what Coldstream does. It is the version worth having quoted.

**The one that is worth understanding before anyone ever changes it:** `Google-Extended` controls
*only* Gemini and AI Overviews grounding. It does **not** affect ordinary Google Search ranking,
and disallowing it does not remove the site from Search — a confusion that costs sites their AI
visibility for nothing in return. `Applebot-Extended` is Apple Intelligence; `Applebot` itself
(Siri, Spotlight) is a separate agent.

To reverse any of it, change `Allow` to `Disallow` on that agent alone. Never on the wildcard.

### llms.txt, with an honest label on it

`llms.txt` is a **convention, not a standard**. It was proposed in September 2024 and no AI provider
has published a commitment to read it. It is here because the cost is one generated file and the
downside is a 404 nobody requested, while the upside — an assistant asked about Coldstream fetching
one URL and getting a correct, sourced answer instead of assembling one from directory listings —
is the whole reason for the round.

**It is generated, and that is the part that matters.** Hand-written, it becomes a second, stale
description of the company sitting beside the real one, which is the failure mode this entire repo
exists to prevent. Every fact in it comes from the modules the pages render from — so **the claims
gate applies to it automatically**: an unsourced rating is null in `claims.js` and prints as nothing
there for the same reason it renders as nothing on a page.

It carries a section headed "Notes for anyone quoting this site", naming the three things a
summariser most easily gets wrong: each metro has its own number, there are exactly three offices,
and the warranty is 25-year **workmanship** — not lifetime and not materials.

### What was refused

**`priceRange`, still.** Named again here because it is the property an answer engine would most
like to have. Nobody has stated what Coldstream charges.

**Invented FAQ padding.** The temptation with "optimise for AI" is to bolt a question-and-answer
block onto every page because answer engines like extractable Q&A. The FAQs on this site are
written per page and per market and are already 64 pages deep; adding generic ones would raise the
cross-market similarity the site has spent four rounds lowering.

**`speakable`.** Google restricts it to news publishers. It would be decoration.

**Geo coordinates on the three offices.** Real and useful, and not derivable without a geocoding
service. Guessing a latitude is the same class of error as guessing a Wikidata ID.

## 50. Round 45 — staging is not production, and the handoff has to say so

Round 44 named fifteen AI crawlers in `robots.txt` and allowed them. Correct for production. **It
was wrong for the review host, and nobody noticed for a round.**

### The gap, stated plainly

Staging sends `X-Robots-Tag: noindex, nofollow` on every response. That is what stops Google and
Bing **indexing** the review build, and it works — verified live on
`coldstream-exteriors-staging.netlify.app/cincinnati/`.

**It is not what stops an AI crawler reading it.** GPTBot, ClaudeBot, PerplexityBot and the rest
take their instruction from `robots.txt`, not from an HTTP header. So the next staging deploy would
have carried a file explicitly inviting all fifteen of them onto a host whose entire purpose is
unreviewed work in progress — and the HTML says "staging" nowhere, so anything ingested there reads
as the live site.

This is worth naming as a class of mistake rather than a one-off: **a control that works for one
kind of reader was assumed to work for all of them.** The header and the robots file answer
different questions, and the round that added the second one did not re-ask the first.

### Fixed at the host layer, for the reason the noindex already is

`netlify.toml` has always argued that staging must not change the HTML, because then the artifact
under review is not the artifact handed over. The same argument applies to `robots.txt`, which is
part of the deliverable too.

So: `public/robots-staging.txt` — `Disallow: /`, every agent, and **no `Sitemap:` line**, because
advertising the production sitemap from the staging host points a crawler straight at the live
WordPress site. A `netlify.toml` rewrite with `force = true` serves it at `/robots.txt` on that
host only. `force` is required — the real file exists and would otherwise win.

The promotion warning in `netlify.toml` now names **both** blocks, because either one left in place
would silently disable the live site and neither leaves a trace in the HTML.

**⚠ AND IT IS NOT A LOCK.** `robots.txt` is an instruction honoured by convention. If the review
build ever needs to be genuinely private, the answer is Netlify password protection — the only
mechanism that actually withholds the bytes. That is written into the staging file itself.

### A new gate, for the mirror-image failure

verify-build §19: `dist/robots.txt` must not carry a blanket `Disallow: /`, and must name the
sitemap.

**Uploading the staging file to production is the worst deployment mistake available here.** The
site would go out of every search engine while every page still loaded perfectly — invisible from
the inside, and running for weeks before traffic told anyone. It is also self-concealing: blocking a
URL stops Google reading it at all, so it cannot see a corrected file either until it next checks
`robots.txt`.

### The handoff, which is the point of the round

Two additions to `/handoff/wordpress/`, both generated:

**The upload step now tables every loose file at the web root** and what breaks without each one —
`sitemap.xml`, `robots.txt`, `llms.txt`, `og-default.jpg`, the four icons, the two logos,
`_redirects`. It previously named four directories and two files, and rounds 42–44 added six more
that a reasonable person would have skipped as incidental. It also names `robots-staging.txt` as
**the one file in `dist/` not to upload**, and closes with the check to run after uploading.

**A new section 8 records the whole search and AI layer** — what each page carries and why — with
the warning that matters most under route 2:

> **Do not let Yoast, RankMath or All-in-One re-derive any of this.** Every title and description is
> written per page, measured, and checked for length and uniqueness on every build. A plugin
> generating them from a template reintroduces the exact defect this work removed — nine pages
> sharing one description across the three cities.

Two more that would be lost silently: the single `@graph` must not be split back into separate
blocks, and `dateModified` must not be replaced with the WordPress post-modified date, which moves
whenever anyone opens and saves a page.

It closes with the six outstanding items — GBP URLs, opening hours, profile confirmation, founding
year, job photographs, lender terms — each with **what it unlocks and which file it goes in**. Every
one is gated rather than missing: fill the value in one place and it appears everywhere it belongs
on the next build.

## 52. Round 46 — /blog/ collides at cutover, and nothing said so

Measured while answering "should we do a blog, given SWORD have 69 posts". The answer to that is a
strategy note, not a code change. **This is the thing found on the way to it, and it is a real
cutover defect.**

```
WordPress serves today   /blog/  → a live index with 45 unique posts beneath it
This build produces      /blog/  → an empty index, noindex, not in the sitemap,
                                   and linked as "Advice" from all 75 footers
```

Upload `dist/blog/` at cutover and an empty page replaces a working blog. **45 indexed posts leave
the site in a single move**, and every one of them is currently the only informational content the
domain has.

Nothing in the handoff said so. Step 3 said "WordPress must not attempt to serve any URL in the
sitemap" — correct, and it does not cover this case, because `/blog/` is deliberately *absent* from
the sitemap. The one path where the rule runs backwards was the one path with no note on it.

**The instruction, now in the handoff and on the pre-cutover checklist:** leave `/blog/` and
everything under it with WordPress, and do not upload `dist/blog/`. The footer link lands on the
existing WordPress blog — unstyled against the new site, but alive and indexed. An ugly page that
ranks beats a tidy page that does not exist.

### What the live blog actually contains, since it had never been counted

Read out of `src/data/live-copy/blog.json`, which has been in the repo since the copy pull:

```
47 entries on the index · 45 unique · 2 published twice
     "How Much Do Seamless Gutters Cost in Cincinnati, Ohio?"
     "Which Roof Color Makes a House Look Bigger?"

by market   Cincinnati 8 · St. Louis 6 · Columbus 3 · not market-specific 28
by topic    materials 15 · storm and insurance 14 · cost 6 · maintenance 4
```

**The six cost posts are the highest-intent pages the domain owns and the ones the claims gate will
refuse.** "How Much Does an Asphalt Roof Replacement Cost in Cincinnati, OH?" is exactly the query
this business wants, and the live version of that page almost certainly prints the figures
`src/data/claims.js` exists to keep out. Porting them is not a copy-paste: each one either sources
its numbers or is rewritten to explain what drives the price without quoting one. That is a
decision to take deliberately, before the port, not during it.

`BLOG.count` in redirects.js says 48 and the index lists 47. Both are left as they are — the count
came from the build order and the index was pulled from the live page; reconciling them is what the
URL export is for, and inventing a number to make them agree is the failure this repo is built
against.

## 53. Round 47 — the home hero leads with the visitor's situation

One swap, asked for by name: the home H1 was "Roofing, Siding, Windows and Gutters Across
Cincinnati, Columbus and St. Louis" and it is now **"Storm damage or an aging roof — either way,
start here"** — the line that had been sitting above it as the eyebrow since round 1, itself a
rewrite of the live site's own kicker ("STORM DAMAGE? AGING ROOF? WE'VE GOT YOU COVERED").

Why the big type moves: the title tag, description and schema already carry the category, so the
H1 repeating it earned nothing — and the three city names in a home H1 bid against the market
landings' own head terms, the same cannibalisation round 43 removed from the national hubs. The
eyebrow keeps the category and the cities, so the hero still names what we do; the headline now
names why the visitor came. "Storm damage" and "roof" are real query terms, not decoration.

The comparison point was Mr. Roof's home page, which leads the same way — but the line is ours,
with the provenance recorded in national.js since the first commit.

## 54. Round 48 — the thinnest pages get the layer the live site had and we dropped

The brief: look at other sites' copy and fill the gaps where our pages lack information. Measured
first, so the targets picked themselves: **/free-estimate/ carried 336 words at sitemap priority
0.9** — the thinnest indexable page on the site was its second most important — and the national
hubs were next (windows 788, gutters 804), while `live-copy/` held **7,000+ pulled words per
market** on exactly those topics that never got ported.

**The live pages were read again, live, not just from the pull** — three fetched directly
(free-estimate, gutter-guards, energy-efficient-window). They confirmed the pull: one skeleton
repeated with the noun swapped ("Most Trusted X Contractors / The Hidden Cost of Poor Installation
/ Our Proven Process / cost FAQ"). So the TOPICS are the gap and the prose is unusable — it leans
on "25+ years" (gated), reads in the banned voice, and the cost FAQs print dollar figures the
claims gate exists to keep out.

**What was added — written new, as trade fact rather than company claim:**

```
NATIONAL_DEPTH (services.js), rendered by MarketDepth in the hub slot:
  roofing   material matching · ventilation · flashing replaced not caulked · decking on tear-off
  siding    fiber cement vs vinyl · vinyl hangs loose · Hardie's details · the wall behind it
  windows   insert vs full-frame · U-factor and heat gain · fitting over brand · when a unit is done
  gutters   sized to the roof · seamless vs seams · guards as a trade-off · where the water lands

/free-estimate/  what happens after the form · what the written quote contains · the storm path
                 — assembled from commitments the site already makes, nothing newly claimed
```

```
                 before   after
/free-estimate/    336  →   507
/windows/          788  →  1112
/gutters/          804  →  1044
/roofing/        1035  →  1286
/siding/         1024  →  1200
```

Commercial-roofing deliberately gets no block — a different buyer on a different search.

Trade fact needs no source sign-off, which is why none of this waited on the business: how a
low-E coating works is not a claim about Coldstream. Anything that WAS a claim stayed out — no
years, no prices, no ratings.

**⚠ One build broke silently on the way** — the depth import was aimed at the market template's
path, the national one imports differently, and `npm run build >/dev/null` swallowed the error;
verify then failed loudly with 573 dead links. The lesson is old but re-earned: never silence the
build, and never trust an edit that did not assert its match.

## 55. Round 49 — the homepage + roofing round, from the owner brief of 2026-08-24

The largest single round since the build order. Everything below traces to the written brief;
where the brief and the repo disagreed about the current state, the disagreement is recorded
rather than papered over.

### Claims: three approvals, two exceptions, one thing the brief did not know

**Approved and live** (`claims.js`, each with provenance): `satisfiedCustomers: 11000`
(owner-attested, replaces the gated `customersServed`; integer in data, formatted at display),
`warrantyPositioning: "Industry-leading warranties"`, and BBB accreditation (already confirmed
against the record in §41).

**⚠ THE OWNER-APPROVED SUPERLATIVE EXCEPTION.** voice-spec.json bans superlatives, and
"Industry-leading warranties" is one. It ships as a NAMED EXCEPTION approved by Craig 2026-08-24,
on the condition the brief itself set: body copy must carry the substantiation — manufacturer
certification tiers extend coverage beyond a standard installer warranty, on top of the concrete
25-year workmanship figure. **Do not "correct" this phrase back out**, and do not print it
without its substantiation.

**"Fully Insured" in the hero trust row** — previously on the pending list ("Licensed and
insured" was the approved wording). The brief specifies it; owner instruction wins; logged here.

**The BBB "text lockup" instruction was already superseded.** The brief assumed no BBB artwork in
the repo; round 40 had already installed BBB's own hosted seal, linked to the accreditation
record — strictly stronger than a text lockup. The seal stays; `bbbLogo` gates only Craig's
replacement file (`brand/logos/bbb-a-plus.png`, awaited in MISSING_ASSETS.md, never sourced from
WordPress uploads).

### The hero, and one resolved contradiction

The brief's H1 — **"Roofing, siding and gutter experts"** — arrived hours after Craig had picked
"Storm damage or an aging roof — either way, start here" as the H1 in-session. The brief is the
later, formal instruction: it takes the H1, and the storm line returns to the eyebrow rather
than being deleted. Sub composed in index.astro from `claims.js` values. Trust row: Locally
Owned & Operated · BBB A+ Accredited · Fully Insured — no rating, no review count (still gated).
"We answer live — no phone trees" removed sitewide (it lived once, in Hero.astro). The market
selector reads **Select location** and styles as a field (`--cs-ui-field-border`,
`--cs-ui-focus`). The second control beside it is the `<noscript>` **Go** button
(UtilityBar.astro:72) — JS-off fallback, identified and left in place per the brief.

### The market-enumeration rule became a gate (verify §20)

No h1–h3, eyebrow or hero block may name two or more markets. Six surfaces were cleaned: the four
national service-hero subs, the whole-house eyebrow, the team-section body and the CTA band.
Meta descriptions deliberately stay out of scope (round 41 put cities there on purpose), as does
the about page's factual office list. Proven in the failing direction in test:gates.

### "Our own crews / never subcontracted" retired — sitewide

Craig dropped the positioning this round. It was one of the three ungated true claims; ~30
occurrences swept — why-cards, hero bullets, FAQ answers, meta descriptions, leads — replaced
with "factory-certified crews" (already accepted) or the one-project-manager fact. **If a future
round wants it back**: the canonical wordings were "Our own crews, never subcontracted" and "The
people who quote the job are the people who do it. No subcontractor gets handed the keys to your
house." — this entry is the record.

### Homepage restructure

Section order per §4 — What We Do up, Find Your Area down to just above the final CTA (a
REVERSAL of the round that argued the chooser belonged under the badge row). What We Do is a new
eight-card photo grid (Hardie beside Siding, per the brief), pure-CSS hover/focus overlay using
the hero scrim's 105° direction and `--cs-web-hero-accent`, static overlay on `hover: none`,
body copy always in the DOM. **Photos: the live site turned out to hold only THREE real project
photographs** — scraped and verified 2026-08-24 — so three cards carry them (live filenames kept
for provenance) and five carry a deliberately obvious placeholder registered in
MISSING_ASSETS.md. The vinyl card's photo is a real Coldstream job whose material is unverified;
its alt claims the work, not the product.

The standing roofing block gave way to **Offers & Promotions** — a claims-gated shell
(`offers.js`) whose only permanent card is the evergreen free inspection. **The Reg Z gate
(verify §21): an `apr` or `termMonths` with no lender `disclosure` fails the build.** Proven
failing in test:gates. Old OfferBand left the page; nav order changed to put Storm Damage beside
Service Areas (a reversal of the 2026-08-18 call's "storm third", by owner instruction).

### Reviews rebuilt, dark, and still absent

Navy band (`--cs-web-hero-base`), white elevated cards, accent name-rule, top nine from the GBP
pull, city labels off the cards, 3-up carousel (keyboard, pause-on-hover, auto-advance off under
reduced motion) that degrades to a static grid with no JS. Renders NOTHING until the pull lands —
unchanged, and the point. **⚠ THE ORANGE-STAR EXCEPTION**: star glyphs use `--cs-accent` orange,
a second use of a colour that is otherwise emphasis-only. Reasoning: review stars are
conventionally warm and read as an icon, not as headline emphasis; the rejected alternative was
hero-accent light-blue stars, which read as INACTIVE (empty) stars.

### Instant Roof Quote — built, fallback state

`/instant-roof-quote/` exists, noindex, named in GLOBAL_PENDING and the inventory, `?market=`
routing wired. **The Roofful embed is not in the repo**, so per the brief's own fallback: every
CTA keeps pointing at `/free-estimate/`, and the live per-market URLs KEEP their existing 301s
there — repointing them at a noindex page would fail the redirect gates, correctly. The page is
an ALLOWED_ORPHAN until the embed lands (a CTA to an empty quote tool is a broken promise).

### Roofing page

Three more depth blocks (repair-vs-replace, what a replacement includes, how the job runs) and
three consolidated live-FAQ questions (winter installs, tear-off vs overlay, lifespan) — 1,620
words, 10 FAQPage questions, no cost figures ($8,500–$18,000 and $12,000–$15,000 on the live page
remain unsourced and gated). The live "Blue Ash" FAQ heading was not ported. Tri-market hero
enumeration gone (gate enforces it now).

### Deliberately NOT done

Star ratings and review counts (live shows 4.9 and 4.8 — they disagree; both stay null). "25+
years" (three sources, three answers — see §the claims file). Financing figures (Reg Z). Named
testimonials. Cost ranges. New pages for the SEO gaps — SEO-GAP.md lists them for Craig's
approval instead. The hover-3D/satellite section — Craig has said we do not estimate from
satellite imagery; if it ever returns it must be framed as post-inspection visualisation.

### §55 addendum, 2026-08-25 — the BBB seal, supplied and overridden

Craig supplied the seal file. It is an AI-generated recreation of BBB's mark, not BBB's artwork;
the trademark concern was raised on 2026-08-24 and the file was declined — **Craig re-sent it the
next day with "use this instead", which is the owner's decision and it stands.** Original archived
at `brand/logos/bbb-a-plus.png`, cropped derivative in `public/badges/`, gated on
`CLAIMS.bbbLogo`. The badge still links to the accreditation record. THE REVERT IS ONE LINE —
clear `bbbLogo` and the row falls back to BBB's own hosted seal, which never left the repo.

## 56. Round 50 — the live sitemap diff: 26 URLs were heading for 404, and the count is now checked

Asked "are there any other live pages worth carrying over", the honest first step was to stop
working from the audit and pull the live sitemaps again. **The live site was restructured in
November 2025** — after the audit this repo's redirect map was written against — into nested
`/{market}/{hub}/{sub}/` URLs. Diffing all 443 current live URLs against the build and the map:

```
443 live URLs   →   43 served by the build at the same path
                    302 redirect-covered
                    98 covered by NOTHING
```

Of the 98: 47 blog (PENDING by decision), 25 windows (UNDECIDED by decision, now including the
restructure's new spellings), and **26 genuine holes** — the gutters and siding sub-pages in their
new nested shape (`/{m}/gutters/gutter-guards/`, `/{m}/siding/fiber-cement-siding/`, …). The fold
decisions for almost all of them were already recorded in SLUG_MAP; the RULES simply predated the
shape. The generator now emits a hub-nested rule per variant, four new slugs joined the map with
their siblings' targets (downspouts, gutter-replacement, siding-repair, soffit-fascia-services),
and the rule count went 273 → 378.

**And the check is now permanent:** the live export the generator always wanted exists at
`data/live-urls.txt` (pulled from the live sitemaps 2026-08-25), so every build verifies coverage
of all 443 and FAILS on any URL matched by neither a rule nor a named decision. The blog and
windows absences report as the decisions they are, not as noise.

## 57. Round 51 — the 2026-08-25 update round

The owner brief, item by item. Where the brief said "may already be done, check first," it was
checked; the already-done and the newly-done are both named in the report.

### Two sitewide language reversals, both owner-directed

**"We walk the roof" is gone (15 places)** — "we don't do that." Every inspection sentence now
reads "a thorough inspection" or equivalent, including the national roofing H1 ("Roofing
contractors who inspect before they quote") and the why-card. The satellite-imagery denial
STAYS — that part was reaffirmed only a round ago; what changed is who is claimed to be standing
on what.

**"25-year" is gone from customer-facing copy (33 places)** — replaced with the approved
"industry-leading warranties" positioning per the brief's "all pages." ⚠ RECORDED TENSION: the
superlative exception (§55) was granted on condition the CONCRETE 25-year figure substantiated
it, and this brief removes the figure. The certification clause ("our certifications with the
manufacturers we install let us extend coverage") remains as the substantiation everywhere the
phrase appears. voice-spec.json still lists the 25-year warranty as a true claim — it IS true;
the site just no longer prints the number. If a future reviewer wonders why the copy and the
voice-spec disagree: this entry.

### Claims: paymentTerms cleared

"Zero risk · no deposits necessary · no payments until completion" on the pricing card is the
sign-off `CLAIMS.paymentTerms` had been waiting for since round 1. Set, with provenance; the
hero-bullet builder picks it up automatically.

### Homepage

What We Do's roofing card reads **Roof Replacement and Repair**. WhyTrust restyled (ghost
numerals, sky top-rules that turn accent on hover, lift) — the numeral is a CSS counter so
reordering the data renumbers the cards. **Offers & Promotions retired after one round** for
"our proven process" — ⚠ **"CINCH" IS UNCONFIRMED**: the word appears nowhere on the live site,
so `PROCESS_NAME` in ProvenProcess.astro is a slot, rendered generic until Craig confirms. The
offers SHELL and its Reg Z gate survive untouched in offers.js.

### The team, ported from the live about pages

Jon Davis (Founder · Cincinnati), Greg Morse (Co-Owner · St. Louis), Tyler Brooks (Co-Owner ·
Columbus) — bios verbatim from the live site, photos with their live filenames. National about
shows all three above "What we do"; Cincinnati shows Jon; Columbus shows Jon and Tyler — the rule
is data (`team.js`). **St. Louis was not in the brief and shows nobody**; adding Greg there is a
one-line data edit when asked. A leftover "nobody hands your address to a subcontractor" line on
the market about template — missed by the §55 sweep — went with this round.

### Roofing

`/roofing/` carries the live Cincinnati residential-roofing service set as seven icon hover-cards
with Learn-more links — replacement, repair, storm, hail, wind, insurance claims, and Commercial &
Multi-Family, which stays on the page and links out to `/commercial-roofing/` naming its two
markets. **Commercial scoped to Cincinnati and Columbus**: St. Louis lost the service — the SECOND
reversal on that flag (round 6 restored it) — its page folds to `/st-louis/roofing/` via the
existing fallback, and the transcribed inventory records the exception (57 required now).
Commercial Roofing joined the Roofing dropdown, market-aware.

### Estimate page

"What happens next" holds the inspection and the written quote only; the storm block came out —
the storm path has its own page and nav item.

## 58. Round 52 — about goes live, Cinch resolves to Cincy, the reviews rotate

**/about-us/ is INDEXED.** The noindex existed because the company story was unsourced; three
bylined owners ported verbatim from the live site ended that. Values and community-work lines
drawn from the bios themselves; the Hover 3D partnership added WITH the SEO-GAP reframe stated
on the page — a visualisation aid after the in-person inspection, never a substitute. Founding
year stays gated; a page needs its printed facts real, not every fact printed. Sitemap holds at
61 (St. Louis commercial out, about in).

**"Cinch" was a typo for "Cincy."** So there is no branded process name — the owner meant the
process from the live Cincinnati pages ("Our Proven Cincinnati Roofing Installation Process").
The section stays "Our proven process", city dropped, because it renders nationally and a
Cincinnati-named process there would trip the market gate. The name slot remains; nothing is
awaited.

**The reviews are a marquee now** — the 08-25 paged carousel lasted a day. Two server-rendered
runs sliding continuously, the partner strip's own idiom so the site has one rotation mechanism;
pause on hover and focus; reduced-motion gets a static grid; still zero JavaScript and still
NOTHING renders without pulled reviews. The band went vibrant per the ask: the hero's gradient
with its scrim, orange eyebrow and stars, glowing white cards.

**The market chooser left the homepage** — its third move (under the badges → bottom of page →
off). The allowed routes remain: the utility-bar selector, the footer, /service-areas/.

## 59. Round 53 — placeholder reviews, by owner instruction, labeled as what they are

The owner asked three times for the review carousel to be visible; the no-invented-reviews gate
kept it absent for want of pulled data; on 2026-08-27 the instruction became explicit: nine
placeholder Google reviews now, real ones dropped in later. **The owner's decision stands and is
shipped** — with the one guardrail that separates a placeholder from a fabricated endorsement:

  · every sample card carries a visible dashed SAMPLE tag
  · no invented names — the byline reads "Your customer"
  · the copy describes itself ("This is a sample review…")
  · star rows are muted grey, not the orange of a real rating
  · no aggregate figure renders — that stays gated on the pull

Real pulled reviews REPLACE the samples automatically (pulled data wins in the component), and
only the homepage opts in (`placeholders={true}`); market pages keep absence-until-real. The
FTC concern was raised each time and is answered by the labeling, not ignored — an obviously-
sample card is design, the same as the five photo placeholders; a plausible fake one would not
have shipped under any instruction.

## 60. Round 54 — the reviews section becomes office-by-office, samples and all

The owner saw the fixture render of ReviewsByMarket and asked for it to replace the homepage
sample marquee (2026-08-27): "for the new reviews section you created it needs to be swapped out
for this section." So the swap is a promotion — the section built for real Google data takes the
marquee's slot between the partner strip and the FAQ, and the §59 ruling extends to it: labeled
sample placeholders over an invisible section, until `npm run reviews:pull` writes real data.

What that took, and where the lines held:

- **A second sample dataset, not a relaxed gate.** The FIXTURE set is gate-banned from built HTML
  and stays banned. `src/data/fixtures/reviews-places.placeholder.js` is its deployable sibling:
  every name starts with "Sample", every quote declares itself, `author_url`/`profileUrl` are null
  so nothing links to a Google URL that does not exist, and the on-page "Placeholder reviews — not
  real" banner renders in sample mode exactly as in fixture mode. `placeholders={true}` is opt-in
  per page; only the homepage passes it. Real data always wins over the samples.
- **The invented aggregates did not survive, and the gate is why.** The fixture set carries
  4.8/137 and 4.9/64; the first build with them failed verify — `an unsourced claim reached the
  built HTML: "4.8"`. The gate is right and was not touched: an invented star average against a
  real Google profile is a checkable false claim, banner or no banner (the same guardrail §59
  applied to the marquee header). All three sample columns render the neutral no-figures line;
  the real aggregates light up the moment the pull writes them.
- **`rbm-fixture` renamed `rbm-notreal`.** The banner's class name itself contained the gate-banned
  word and shipped in sample mode — caught by grepping dist before verify even ran.
- **The marquee left the homepage, not the repo.** Reviews.astro still serves free-estimate; the
  homepage import is gone. The empty `<ReviewsByMarket />` placement below WhyTrust is gone too —
  one instance, in the slot the owner was looking at when he asked.

Written down as a reversal, because it is one: ReviewsByMarket's file comment said "no sample
review anywhere in this file, nothing for a fixture to inject." That was the design, three owner
instructions later it is the design for market pages only. The comment now says so.

## 61. Round 55 — commercial goes Cincinnati-only, the siding video comes out, real Hardie homes go in

Owner instructions, 2026-08-27, six in one message.

- **Commercial roofing is Cincinnati-only now.** Reverses the 2026-08-25 brief that kept Columbus
  (logged as a reversal). One data edit — Columbus's services list — retired both pages by
  existing rules: [service].astro only builds a national hub when more than one market runs the
  service, so /commercial-roofing/ stopped building, and /columbus/commercial-roofing/ stopped
  with it. `serviceHref` gained the SINGLE-RUNNER RULE: when exactly one market runs a service,
  every other context links into that market's page — which is the owner's ask ("when clicked
  from national page… should be redirected to Cincinnati") made structural instead of hand-edited
  per link. Nav, footer, What We Do card and the roofing-page card all route to
  /cincinnati/commercial-roofing/. The retired national URL carries an EXACT redirect;
  Columbus's commercial URLs fall back to /columbus/roofing/ by the same SLUG_MAP machinery
  St. Louis has always used. One build caught two rules for one URL — the EXACT row for
  /columbus/commercial-roofing/ duplicated the generator's fallback and was dropped. 73 pages.
- **The roofing services h2, take four:** "Find the roofing service you need". Retitles
  "If it's on your roof, we handle it" (owner: try something else).
- **The bare sub-service intro got a design.** Both sub-service templates opened with one muted
  paragraph alone in a section (owner: "alone and bare"). Now a two-column lead: the intro at
  lead size under an orange accent rule, beside a navy ALWAYS_TRUE panel. The panel's title is a
  styled <p>, not a heading — it sits before the first h2 and a heading would skip a level.
- **The siding scrub video is gone** (owner: "It isn't accurate") from the national and market
  siding pages. The placeholder footage never showed our work. Files stay in public/video/ until
  real footage or a decision that there never will be any.
- **ProjectShowcase stands in its slot** — a rotating strip of completed homes on the reviews-
  marquee mechanics (dual runs, aria-hidden clone, hover/focus pause, reduced-motion → static
  scrollable row). Photos live in data/projects.js WITH THEIR SOURCE PER ENTRY, because a photo
  of "our work" is a claim.
- **Real James Hardie photos, from Contractors Cloud, on owner instruction.** Job COL2641 — a
  completed Hardie re-side in the Columbus market — supplied three finished-elevation shots
  (crew-uploaded 2026-08-17). They run on the Hardie sub-service pages (all four) and in the
  siding showcase, with two labeled "photo pending" cards holding space for the homes the owner
  is providing later. Filenames and captions are anonymised to market only. The St. Louis Hardie
  job's photos were damage close-ups, not showcase material, and were not used. **⚠ CONSENT ON
  RECORD AS OPEN:** the pull provides photos, not the homeowner's sign-off to publish them.
  Staging is noindex; before production cutover, confirm consent for COL2641 or swap the three
  entries in projects.js. Material is claimed as Hardie because the job record names it; the two
  live-site photos keep the round-49 rule (caption claims the work, not the product).

Deliberately not done: the roofing scrub stays (nobody called it inaccurate); St. Louis's
commercial redirect fallback was not repointed at Cincinnati — a legacy St. Louis commercial URL
still lands on /st-louis/roofing/ per the original fold decision, and changing that would be its
own call.

<<<<<<< HEAD
## 62. Round 56 — the site-wide localization brief, on a branch

Owner brief 2026-08-27, applied on `sitewide-local-seo` (not merged — the brief says branch).

- **The brief's phone table matches the data exactly** — including (513) 258-0450 for
  Cincinnati. That is the owner writing the number down, which CLOSES the open question CLAUDE.md
  has carried since the prototype said (513) 717-5462. Nothing needed changing; the fourth source
  settles it.
- **St. Louis offers no metal roofing** (the brief's one product-scope fact). Every place metal was
  OFFERED became market-aware — the roofing lead, the materials FAQ answer, the SERVICES blurb,
  the roof-replacement Materials card — reading "shingle and low-slope" in St. Louis and
  "shingle, metal and low-slope" in Ohio. Metal as flashing ("metal cut into mortar") and metal
  as dented gutters stays on every market: those are trade facts, not offerings. Card bodies and
  FAQ answers may now be functions of the market; the templates resolve them.
- **Local SEO: measured first, then written.** A counter (body copy = header-to-footer text)
  found EVERY market page already at 3+ city mentions and most above 5 — St. Louis structurally
  so, because its region string contains its city name. So no page needed city-stuffing, and none
  got it: the pass added the owner's town lists (Anderson Township…Blue Ash / Dublin…Upper
  Arlington / Kirkwood…Florissant) inside new copy instead, per the brief's own
  "specificity over repetition". Net city-mention change across all 51 market pages: zero.
  Meta descriptions on Cincinnati and Columbus hubs now carry the city (their regions do not
  contain it); St. Louis keeps region-only phrasing to avoid saying the name twice in a clause.
- **The inspection section is now on the market roofing hubs**, localized: MARKET_ROOFING_DEPTH
  carries three blocks per market under the national headings — freeze-thaw for the Ohio Valley,
  straight-line wind for central Ohio, hail for St. Louis. All climate claims are general truths
  of each region; no invented storms, dates or addresses. Similarity check peak: 27.6%.
- **Siding heroes**: "Fiber cement and vinyl siding throughout Greater {City}" per the brief. The
  derived title ran past 60 with that h1, so services can carry `titleTag` — siding's is
  "Siding Contractors in {city, ST} | Coldstream Exteriors" (56–58 chars).
- **The siding detail section** on market hubs: "What a full siding replacement does for a {City}
  home", both brief paragraphs verbatim beneath it. ServiceDetail learned multi-paragraph intros.
- **"Learn more" on the roofing service cards is visible by default** — the two-day-old slide-in
  reveal is reversed on instruction; hover now only recolors it.

Not done, and why: the brief's 3–5 mention target reads as a ceiling, and ~30 pages sit above it
today, St. Louis worst (region name). Reducing them means rewriting existing approved copy — a
bigger call than this branch, so they are REPORTED (the brief asks exactly that) rather than
trimmed. National pages keep their no-city rule; the brief's per-market items were applied to
market pages, and "What a siding job covers" survives unchanged on the national /siding/ page,
which cannot take a {City} heading.
>>>>>>> sitewide-local-seo

## 63. Round 57 — the 9-review carousel returns to the homepage

Owner, 2026-08-29: "the ask was for a 9 review carousel placeholder etc. i want the same one that
was created earlier." Reverses the §60 homepage swap two days after it was made — the second
reversal in this slot, so the history in one line: §59 built the 9-sample marquee ("so much
better"), §60 swapped it for office-by-office on instruction, this round swaps back on
instruction. The restored section is IDENTICAL to §59's — same component, same nine labeled
samples, same automatic replacement by the real Google pull.

ReviewsByMarket is untouched and keeps its placeholder mode; no page renders it today. When real
reviews land, the choice between one carousel and three office columns is worth re-asking with
real data on screen — both are one line to enable.
=======
## 64. Round 58 — the links join the in-place market swap

Owner, 2026-08-29: choosing a city in the utility bar changed the phone and the logos but the
What We Do cards still linked the national pages. Now any anchor with a true three-market variant
carries data-mhref from MARKET_VARIANTS (data/markets.js) — the single map that also records the
two places national and market slugs disagree (/roofing/replacement/ → roofing/roof-replacement/,
/storm-damage/ → roofing/insurance-storm-damage/). One shared script (MarketVariantLinks.astro,
double-include guarded) rewrites them on selection and restores them on "Other / not sure".
Annotated: the What We Do card and sub links, and the roofing-services cards on the national hubs.

Deliberately NOT annotated: stone-veneer (national-only page) and commercial roofing
(Cincinnati-only — already points there from everywhere). Market pages are untouched: their
selector navigates instead of swapping, which is the correct behaviour and predates this round.
Functionally tested headless: select Cincinnati → six links verified rewritten, clear → restored.

### Round 58, second pass — the swap becomes visible

The href rewrite shipped alone and the owner reported it broken. He was right from where he sat:
an href is invisible until clicked, and the phone swap he compared against is visible. Now a chip
appears under the section heading the moment a market is chosen — "Showing Cincinnati — the cards
below link to our Cincinnati pages." — with role="status" so it is announced, not just painted.
On the What We Do grid and the national hub service cards, hidden server-side, restored to hidden
when the selection clears. Lesson restated from the marquee rounds: a change the owner cannot SEE
on staging does not exist for him — ship the visible half with the mechanical half.

### Round 58, third pass — the nav follows the market, and headings can too

The owner's actual path finally surfaced: he browses the NATIONAL pages (the nav keeps him
there), so the brief's "What a full siding replacement does for a {City} home" — which lives on
the market siding pages — never crossed his screen. Two fixes:
- The HEADER NAV joins the swap. Every nav link with a three-market variant carries data-mhref,
  so choosing Cincinnati makes Roofing/Siding/Windows/Gutters/Storm Damage (and the dropdowns,
  and Get Free Estimate) route to the Cincinnati pages from anywhere. The script now ships with
  the header — site-wide by construction.
- Headings can swap in place: data-mkt-tpl holds a template with {City}; the national /siding/
  detail h2 becomes the brief's heading when a market is chosen and restores when cleared. The
  static HTML (what crawlers index) is untouched — the swap only follows a visitor's own action.
One bug shipped and was caught in the same round: the header's script instance ran at parse time,
before the page body existed, so its queries captured only the nav. Queries moved to change time.

## 65. Round 59 — the Rambow package: two zips, and the blog folder is not in them

Owner, 2026-08-29: package the site for Rambow, zips, bare minimum, neatly organized, with a
design-system README. `scripts/build-rambow-package.sh` builds it reproducibly (fresh build +
verify first, always) into ~/Cold-Stream-Folder/rambow-handoff/:

- `1-read-first.zip` — README (cutover order, the pages-and-redirects-same-deploy rule), the
  cutover checklist with spot-check URLs, the DESIGN-SYSTEM doc (website tokens, with the
  two-design-systems warning up top), PAGES.md, and the Apache 301 fragment.
- `2-website-files.zip` — dist, minus six things the script names with reasons and then PROVES
  absent before it exits: blog/ (§52 collision made impossible rather than documented),
  handoff/, pagemap.html, review.html, _redirects (Netlify syntax), robots-staging.txt (the
  Disallow-everything file — uploading it would be the worst possible mistake).

The docs live in handoff-docs/ and are committed; the zips are build artifacts and are not.

## 66. Round 60 — the mobile pass: measured first, and the measuring tool was the first finding

Owner, 2026-08-30: most visitors are on phones; make the site very mobile-friendly, same design
system, nothing major.

**Finding zero, before any change: there is NO mobile overflow.** First screenshots at
--window-size=390 showed every section cut off at the right edge — round 35's bug apparently
back. It was not: headless Chrome silently enforces a ~500px minimum window (a blank control
page reports clientWidth=500 at a requested 390), so pages laid out at 485 and screenshots
cropped at 390. The honest method is a 390px IFRAME inside a wider window; measured that way,
all twelve representative pages report scrollWidth = clientWidth = 375 in a 390 viewport. Zero
overflow, three markets, hubs, subs, forms. WRITE THIS DOWN because the artifact is convincing:
any future "mobile is broken" screenshot taken with --window-size below 500 is fiction.

What actually shipped:
- **The mobile action bar** (MobileActionBar.astro) — call + free estimate pinned to the bottom
  edge, ≤820px only. The call side carries data-cs-phone/-text, so the utility-bar selector
  swaps it with every other number in one pass. The roofful right-edge tab hides at the same
  breakpoint — same promise, thumb-reachable placement. Safe-area padded; body gets a matching
  floor so the footer never hides under it. Suppressed on estimate pages like the tab it replaces.
- **iOS zoom guard**: the market select is forced to 16px on phones (form inputs were already
  1rem, which is why they never zoomed).
- **Tighter band rhythm ≤640px** on the newest sections (.pshow/.sublead/.mkt-note).

Deliberately not done: no separate mobile layouts, no hamburger redesign, no font shrinking —
the layout system was already sound (round 35's fix held), and the owner asked for friendly, not
different.

## 67. Round 61 — phone card grids become swipe carousels

Owner, 2026-08-30: the What We Do section was "too many photos" of scrolling on a phone — eight
stacked cards, roughly eight screens. Every large card grid now becomes ONE horizontal
snap-scrolling row on phones (≤820px): What We Do (8 photo cards), the roofing service cards
(7), the why-trust cards (6), and the ServiceDetail card blocks on every hub and sub-service
page. The next card peeks past the screen edge — the peek is the "swipe me" affordance, no dots
and no arrows needed. Content, links and the market-swap attributes are untouched; it is the
same DOM in a scroll-snap flex row.

Measured on the homepage at a true 390px viewport: page height 10,112px → 7,757px, the What We
Do section itself ~3,000px → 351px. Horizontal overflow still zero (scroll = client = 375).

CSS-only, native scrolling — keyboards and screen readers get normal behaviour and
reduced-motion needs no branch because nothing moves on its own. One bug caught in-round: the
first build silently lost the specificity fight against Astro's scoped component styles
((0,2,0) vs a global class), so the carousel rules carry [class][class] with a comment saying
why. Desktop is completely unchanged.

## 68. Checks

```
✓ all 58 inventory pages built            ✓ no redirect loops
✓ no dead internal links                  ✓ no redirect chains
✓ no href="#" links                       ✓ no redirect into a noindex-for-content page
✓ only the 3 real office addresses        ✓ 273 redirect rules, all targets real
✓ only the 4 real phone numbers           ✓ exactly one h1 on each of 75 pages
✓ no unsourced claim in any page          ✓ every page self-canonicals
✓ no voice-spec banned term               ✓ sitemap lists 61, none noindexed
✓ blog block PENDING by decision          ✓ hero copy clears AA on the CSS ground
✓ no orphan pages                         ✓ every indexable page is in the sitemap
✓ no fixture content in dist/             ✓ gate tests pass in both directions
✓ every page has a title and description  ✓ no two indexable pages share a title or description
✓ titles ≤ 60, descriptions ≤ 160         ✓ every og:image resolves to a real file
✓ every favicon link resolves             ✓ no heading level skipped on any page
✓ no empty value in any schema node       ✓ every indexable page ≥ 3 inbound internal links
✓ every @id reference resolves locally    ✓ llms.txt links only at pages that exist
✓ sitemap dates all present or all absent ✓ robots.txt is the production file, not staging's
✓ no heading/hero enumerates the markets   ✓ no financing figure without its disclosure (Reg Z)
```

75 pages verified — 31 checks green: 58 inventory pages + 16 named beyond it, plus 404. The blog block is the only `PENDING` in the 301 map,
which is what §6 allows.
