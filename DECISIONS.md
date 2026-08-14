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

## 21. Checks

```
✓ all 58 inventory pages built            ✓ no redirect loops
✓ no dead internal links                  ✓ no redirect chains
✓ no href="#" links                       ✓ no redirect into a noindex-for-content page
✓ only the 3 real office addresses        ✓ 273 redirect rules, all targets real
✓ only the 4 real phone numbers           ✓ exactly one h1 on each of 62 pages
✓ no unsourced claim in any page          ✓ every page self-canonicals
✓ no voice-spec banned term               ✓ sitemap lists 49, none noindexed
✓ blog block PENDING by decision          ✓ hero copy clears AA on the CSS ground
```

The blog block is the only `PENDING` in the 301 map, which is what §6 allows.
