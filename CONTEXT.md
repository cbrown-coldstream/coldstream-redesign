# Coldstream Exteriors — full context

**Self-contained.** Everything needed to be useful on this project is below; no other file has to be
read first. Written 2026-08-13.

---

## 1. The business

Coldstream Exteriors is a roofing and exteriors contractor — roofing, siding, gutters, replacement
windows, garage doors, commercial roofing — operating in **three metros**, each with a real office
and its own phone number.

| Market | Phone | Office |
|---|---|---|
| Cincinnati | (513) 258-0450 | 1308 US-50 Suite 100, Milford, OH 45150 |
| Columbus | (614) 812-0811 | 5825 Fieldcrest Dr, Galloway, OH 43119 |
| St. Louis | (314) 380-8111 | 3636 S Geyer Rd #100, St. Louis, MO 63127 |
| National | (844) 426-8222 | — |

**Three addresses and four phone numbers exist** — the four above, and no others. They all live in
`src/data/markets.js`. A hard-coded number in a template is the specific bug that data structure
exists to prevent, and the build fails if a number appears that isn't in that file.

**The prototype's phone numbers were fake.** `(513) 717-5462`, `(614) 555-0188`, `(314) 555-0166` and
`(800) 555-0147` are placeholders from the design comp. If you see one in a comp or an old file, it
is not a number to call or preserve. Separately, the live WordPress home page *displays*
`(888) 625-5960` while linking `tel:+18444268222` — that page is being retired, and the national
number above is the one it links to, not the one it prints. `telHref` is derived from the displayed
number precisely so the two cannot disagree.

---

## 2. What the project is

A static rebuild of **coldstreamexteriors.com**, replacing a WordPress site of **443 URLs**.

An SEO audit found the live site was mostly one page repeated: 100+ neighbourhood pages built from a
single skeleton with synonyms swapped, four free-estimate pages, four thank-you pages, six window
pages saying the same thing with the noun changed. Thin duplicate pages compete with each other and
none of them wins.

The rebuild is the consolidation: **67 pages** carrying the same copy, plus **273 redirect rules**
pointing every retired URL at whichever page absorbed it. Astro, static output, no client framework,
no server runtime.

### The rule that explains most of the others

> **A page that cannot say something only it could say should not be a page — it should be a section
> on a page that can.**

Sub-services became sections. Neighbourhood pages became a list on a market page. Location pages
exist only where there is real completed work behind them. When tempted to add a page, that is the
test.

---

## 3. Repos, and who owns what

Two repos. They are separate products and share exactly one thing.

**`coldstream-redesign`** — github.com/cbrown-coldstream/coldstream-redesign — *this repo, public.*
The website. Astro. Also **the source of truth for the brand files.**

**`coldstream-os`** — the social/print pipeline. A Supabase project whose `render-post` edge function
rasterises social and print assets. Unrelated to the website's build or deploy.

This repo was split out of coldstream-os on 2026-08-13. Two leftovers to know about:

- `coldstream-os/site/` is still a **full stale copy of this project** from before the split. Nothing
  points at it. It is a plausible thing to edit by mistake. Deleting it hasn't been done.
- Brand ownership **reversed** on 2026-08-13. coldstream-os used to hold the original brand files and
  this repo pulled them down via `npm run brand:sync`. That is backwards now and the script is
  deleted — a pull run out of habit would overwrite the truth with a copy and silently repaint the
  site.

### Changing a brand value

```
# 1. edit brand/tokens.json or brand/voice-spec.json HERE
npm run tokens && npm run build && npm run verify

# 2. push to the social pipeline
npm run brand:publish                 # → coldstream-os/design-systems/exteriors/

# 3. in coldstream-os — REQUIRED, and the step people skip
./supabase/seed-brand.sh exteriors    # file → content_portal_brands table
```

`render-post` reads the **database**, not the file. Publish without seeding and the website repaints
while social posts do not, with every file on disk looking correct. `brand:publish` writes files and
stops — no commit, no push, no seed.

### Hosting

Staging is **https://coldstream-exteriors-staging.netlify.app** — `noindex`, review only, deployed
automatically from `main`. **Production is not Netlify.** The plan of record is Rambow serving the
built HTML from the host WordPress already runs on. `/handoff/` walks that: upload, put the 301
fragment *above* the WordPress rewrite block, stop WordPress routing those paths, cut over, submit
the sitemap. Redirects and pages go live in the same change — publishing the 301s early points 273
rules at a 404.

**It is not deployed to production yet.**

---

## 4. The design system

**There are two, and neither governs the other.** This is the single most misread thing in the
project. An earlier round "corrected" the website onto the social system and it took a full round to
undo.

| | Social / print | Website |
|---|---|---|
| CSS tokens | `--cs-*` | `--cs-web-*` |
| Display face | Saira Condensed ExtraBold | Montserrat |
| Body face | Public Sans | Inter |
| Case | UPPERCASE | Sentence case |
| Ground | `#0E1B2A` near-black | mid-navy gradient |
| Emphasis | accent orange `#E8843B` | light blue `#8fc0ea` |
| Rendered by | `render-post`, in coldstream-os | Astro, in this repo |

They share a palette — primary blue, accent orange, the neutrals — and they disagree about type,
case, ground and emphasis. **When they disagree, that is not a bug.** Do not reconcile them.

### Shared palette — `brand/tokens.json` → `--cs-*`

| Token | Value | |
|---|---|---|
| `primary` | `#3A89C7` | |
| `primary_deep` | `#2A6699` | |
| `accent` | `#E8843B` | emphasis only — see below |
| `surface` | `#F2F6F9` | |
| `deep_dark` | `#0E1B2A` | social ground |
| `text` | `#101B26` | |
| `text_muted` | `#5B6B78` | |
| neutrals | ink `#101B26` · slate `#5B6B78` · steel `#8A99A6` · mist `#DDE5EB` · cloud `#F2F6F9` · paper `#FFFFFF` · line `#E4EAEF` | |

**Accent orange has exactly one job: emphasis — the last word of a rendered headline.** It is
deliberately not reused for a success state, and not used for web hero emphasis. Giving it a second
meaning dilutes the thing it is for.

### Website system — `ui-tokens.json` → `--cs-web-*`

**Every value is measured, not chosen** — read off the hero of
`public/preview/cincinnati-market-landing.html`, the approved prototype. When the prototype and the
build disagree, the prototype wins and the number is copied, not eyeballed.

Type: Montserrat display / Inter body · weights 700 / 800 / 900 · display line-height 1.08,
letter-spacing −0.01em · body line-height 1.55 · eyebrow 0.82rem at 0.14em tracking.

| Hero token | Value |
|---|---|
| `hero-base` | `#101922` |
| `hero-ground` | `linear-gradient(135deg, #2f80c4, #256199 55%, #1c4c78)` |
| `hero-scrim` | `linear-gradient(105deg, rgba(11,20,30,.9), rgba(15,32,52,.82) 46%, rgba(20,45,73,.62))` |
| `hero-accent` | `#8fc0ea` — the headline's emphasis phrase |
| `hero-eyebrow` / `-sub` / `-bullet` / `-call-sub` | `#d6e6f5` / `#c8d8e7` / `#e7eff7` / `#a9c0d6` |

Hero emphasis is light blue and **not** accent orange because on a near-black ground the orange read
as a warning. The prototype fixed it.

The hero ground is CSS, and a gate proves contrast against it: white clears AA at 13.6:1, the accent
at 7.1:1. **No page passes a photo behind hero copy** — that is what makes a fixed contrast check
valid at all.

### Interface states — `ui-tokens.json` → `--cs-ui-*`

Additive to the brand palette, never a replacement. A website needs a success state, an error state,
a focus ring, a disabled control, a field border; a rendered social post never does, and a
form-validation red should not be able to reach a composite.

success `#16A34A` · success-deep `#12823B` · error `#C0392B` · error-surface `#FCEDEB` ·
warning `#B7791F` · focus `#E8843B` · disabled `#8A99A6` · field-border `#CBD6E0` ·
field-border-focus `#3A89C7`

`--cs-ui-focus` is declared as the literal orange rather than referencing `--cs-accent`, on purpose:
a focus ring should be the loudest thing on the page, and a brand colour change must not silently
weaken an accessibility affordance.

### Social composite geometry (lives in coldstream-os, not mirrored here)

Bottom gradient scrim only — no boxes, no panels, nothing over the centre; the house stays visible.
Headline bottom-left, Saira Condensed ExtraBold uppercase white with the last word in accent orange.
Contact stack bottom-right: reversed logo, `CALL FOR YOUR FREE ESTIMATE`, then the market's phone in
accent. Phone is per-market and read from `lanes.phone_display`, never from the brand files. Four
layout variants rotate per post and cannot move an element — only gradient depth, type scale and
accent treatment differ. Headlines are authored from a closed library, not generated; the model
writes captions only.

### Logos

`brand/logos/` — primary (colour, light backgrounds), reversed (white wordmark, dark photos), mark,
mark-white. All raster PNG, ≥1000px long edge. **No vector source was ever supplied.**

---

## 5. Voice — `brand/voice-spec.json`

Warm, humble, customer-oriented. A seasoned crew lead talking to a neighbour — plainspoken,
reassuring, respectful of their time and money. Focus on craftsmanship and people: the care taken,
the details, the homeowner's outcome. Unofficial slogan: *"we're part of your home."*

**Never** cocky, boastful, gimmicky, slogan-y, hypey or urgent-sounding. No superlatives, no
"we're the best", no urgency tricks. Short active sentences, occasional one-line punch. Address the
reader as "you" and "your home". Roughly 8th-grade reading level. No emoji. At most one exclamation
point, and prefer none.

**Banned words** — enforced by grepping the built HTML, so these fail the build:
cheap · cheapest · guarantee (as an absolute promise) · best in the world · #1 · revolutionary ·
game-changer · unbeatable · amazing · act now · hurry · world-class · synergy · solutions provider ·
leverage · utilize (say "use")

Standard CTA: **"Book your free inspection today."**

---

## 6. The claims gate — the most important rule

**Nothing unsourced ships.** Every factual assertion about the company lives in `src/data/claims.js`,
and anything unsourced is `null`. Empty means the component **does not render at all**.

This exists because the prototype copy carried invented facts. All of it is gated, not deleted — fill
a value in and it appears everywhere it belongs, automatically:

- a 4.8 star rating and "400+ five-star reviews" — no source
- "$1,000 off your roof replacement" — a promotion nobody confirmed is running
- "financing as low as $99/mo", "$0 down", "0% interest" — **advertised credit terms.** In the US
  these are regulated; a specific monthly payment triggers Regulation Z disclosure and the figure has
  to come from the actual lender
- "no payment until your project is complete" — a payment-terms promise
- "25+ years" in business — a company-history claim
- "BBB A+" — an accreditation claim
- "$11,000–$14,000" pricing
- three named testimonials — **invented.** "Sarah M.", "Dave R." and "Priya K." were prototype
  filler, and the same quotes appeared on two different pages under a heading claiming they were
  local homeowners. Fabricated endorsements are an FTC problem, not a copy nit

**Only three claims are always true**, pre-approved in the voice spec:

1. Licensed and insured
2. Free, no-obligation inspections and quotes
3. **25-year** workmanship warranty — *not* "lifetime", which is a materially bigger promise

Also ungated: "locally owned", "our own crews", "factory-certified installers" — three real offices
and three real crews back the first two, and manufacturer badges back the third at that generality.
Badge **tiers** stay gated; the GAF tier is claimed three different ways by three sources.

Still pending Craig's sign-off, omitted from every caption until confirmed: "A+ Rated by BBB",
"Fully Insured", "Financing Available".

---

## 7. Architecture

```
src/data/          the content. Markets, services, sub-services, locations, claims, partners.
src/pages/         13 templates. Three markets are data, not three sites.
src/components/    shared sections. Hero, badge row, FAQ, CTA band, partner carousel…
src/styles/        tokens.css + ui-tokens.css are GENERATED. base.css is not.
brand/             tokens.json, voice-spec.json, logos/ — owned here. See brand/README.md.
scripts/           build-time generators and the gates.
```

### Commands

```
npm run dev            # local
npm run build          # build + redirects + tokens; postbuild writes pagemap, /handoff/, PAGES.md
npm run verify         # THE GATES. Green or it is not done.
npm run test:gates     # proves the gates fail when they should
npm run inventory      # planned pages vs what built; extras must be named
npm run contracts      # data-shape checks for the Contractors Cloud / GBP pulls
npm run live:pull      # re-read the live WordPress copy into src/data/live-copy/
npm run brand:publish  # push brand/ out to coldstream-os
```

### Generated — never hand-edit

`src/styles/tokens.css` · `src/styles/ui-tokens.css` · `public/_redirects` · `pagemap.html` ·
`/handoff/` · `PAGES.md`

---

## 8. The gates

`npm run verify` fails the build. Do not work around them. If a change needs a gate relaxed, that is
a decision to state out loud, not a line to quietly edit.

They check: no dead internal links · no `href="#"` · only the 3 real addresses in schema · only the 4
real phone numbers in `tel:` links · no unsourced claim anywhere · no banned term · every page
self-canonicals · every URL ends in a trailing slash · sitemap lists only indexable pages · all 273
redirect targets real · no redirect loops or chains · no redirect into a page that is noindex for
want of content · no fixture content in output · no orphan pages · exactly one h1 per page · hero
copy clears AA.

**12 pages are deliberately `noindex`** — they are waiting on data. A thin page that ranks is worse
than a page that waits.

---

## 9. Where it stands

**Done.** All 67 pages build and pass every gate. Copy consolidated from the live site. Design
language matched to the prototype. Real partner logos on a rotating strip. National service pages and
`/service-areas/` with a keyless Google map. The handoff site at `/handoff/`. CD from GitHub to
staging.

**Not done, in rough priority order:**

1. **Sub-service and market/location copy port.** `src/data/live-copy/` holds ~150k words pulled from
   the live site. Service hubs are ported; the 18 sub-service pages, the market landings, `/about`
   and the conversion pages are not.
2. **Gallery and reviews pages are empty and noindex** — waiting on the Contractors Cloud job pull
   (photos with consent) and the Google Business Profile review pull. `src/data/contracts.js` has the
   shapes both must satisfy. **Nothing is invented in the meantime and nothing should be.**
3. **Layout and motion pass** — a gallery lightbox is the obvious missing modal.
4. **Mobile overflow at 390px.** The header row does not wrap, so the H1 runs off the right edge.
   Inherited from the prototype. It is a real bug and it is not fixed.

### Open questions

- **The Cincinnati number.** CLAUDE.md lists this as an open question — prototype `(513) 717-5462`
  vs data `(513) 258-0450`. `src/data/markets.js` is more definite and says the prototype value is
  one of four fakes from the design comp. Treating it as settled in favour of the data, but the two
  files disagree in tone and someone should confirm out loud.
- The **GAF certification tier** has three conflicting sources.
- The hero video button was added but never formally approved.
- `tokens.json` defines no `photo_treatment` key, so `render-post` falls back to defaults for this
  brand while `power` defines one. Whether exteriors should have photo enhancement is undecided.
- The repo is **public**. `src/data/live-copy/` and the `/handoff/` cutover runbook are world
  readable.

---

## 10. Working style this repo expects

- **Comments explain why, not what.** Most files open with the decision that produced them and the
  alternative that was rejected. Keep that up — it is the only reason the rules survive a handoff.
- **`DECISIONS.md` is the log.** Every round appends what changed *and what was deliberately not
  changed*. A reversal gets written down as a reversal.
- **Gates are the contract.**
- **Generated files say so and are never hand-edited.**
