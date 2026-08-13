# Brand — what this repo owns, and the two systems it keeps apart

This directory is **the source of truth** for `tokens.json` and `voice-spec.json`. Changed here,
pushed outward with `npm run brand:publish`. It reversed on 2026-08-13 — coldstream-os used to hold
the originals — and `scripts/brand-sync.mjs`, which pulled them down, is deleted rather than kept,
because a pull run out of habit would overwrite the truth with a copy and repaint the whole site
silently. See `DECISIONS.md` §16.

This file exists because the **website** design language had never been written down anywhere. It
lived only in `src/styles/ui-tokens.css` and in a prototype HTML file. CLAUDE.md records that an
earlier round "corrected" the website onto the social system and it took a full round to undo. That
is the cost of a rule that lives nowhere, and it is what this document is for.

## The one thing to understand first

**There are two design systems and neither governs the other.**

| | Social / print | Website |
|---|---|---|
| Tokens | `--cs-*` | `--cs-web-*` |
| Display face | Saira Condensed ExtraBold | Montserrat |
| Case | UPPERCASE | Sentence case |
| Ground | `#0E1B2A` near-black | mid-navy gradient |
| Emphasis | accent orange `#E8843B` | light blue `#8fc0ea` |
| Rendered by | `render-post` in coldstream-os | Astro, in this repo |

They share a palette — primary blue, accent orange, the neutrals all come from `tokens.css` — and
they disagree about type, case, ground and emphasis. **When they disagree, that is not a bug.**

Do not "correct" the web values onto the social ones, and do not push them back the other way. A
change to the website must never reach a social composite; a change to the social system must never
restyle a headline in a browser.

**Why the web hero emphasis is blue and not accent orange:** orange has exactly one job in this
brand — the last word of a rendered headline. On the web hero it sat on a near-black ground and read
as a warning. The approved prototype fixed it to light blue. Reusing accent for a second meaning
dilutes the thing it is for, which is the same reason `ui-tokens.json` refuses to reuse it for a
success state.

## Files here, and what is deliberately not here

| File | What it is |
|---|---|
| `tokens.json` | **Owned here.** Colour, type, logo asset paths. The brand palette both systems draw from. |
| `voice-spec.json` | **Owned here.** Voice, CTA, hashtags, banned words, always-true claims. |
| `logos/` | Four raster marks — primary, reversed, mark, mark-white. No vector source was ever supplied. |

The rest of the social pipeline — `overlay-spec.json`, `headline-rules.json`, `post-archetypes.json`,
`photo-guidelines.json`, `adaptive-scrim.json`, `platform-channels.json` — **stays in coldstream-os
and is not mirrored here.** It describes composite geometry and caption rules that a website has no
use for, and a copy nobody reads is a copy that drifts.

`ui-tokens.json` sits in the repo root, not here, and that placement is deliberate: it is *additive
to* the brand palette and must never contradict it. Interface states — success, error, focus ring,
disabled, field borders — are not brand colour and have no business in the social render pipeline. A
form-validation red should not be able to reach a composite.

## The website system

**Every value below is measured, not chosen.** They are read off the hero of
`public/preview/cincinnati-market-landing.html`, the approved prototype. When the prototype and the
build disagree, the prototype wins and the number is copied, not eyeballed.

Type — `--cs-web-display` Montserrat, `--cs-web-body` Inter:

| Token | Value |
|---|---|
| `--cs-web-display-weight` / `-strong` / `-hero` | 700 / 800 / 900 |
| `--cs-web-display-lh` · `-ls` | 1.08 · -0.01em |
| `--cs-web-body-lh` | 1.55 |
| `--cs-web-eyebrow-size` · `-ls` | 0.82rem · 0.14em |

Hero — a mid-navy gradient ground under a directional scrim, not a flat fill:

| Token | Value |
|---|---|
| `--cs-web-hero-base` | `#101922` |
| `--cs-web-hero-ground` | `linear-gradient(135deg, #2f80c4, #256199 55%, #1c4c78)` |
| `--cs-web-hero-scrim` | `linear-gradient(105deg, rgba(11,20,30,.9), rgba(15,32,52,.82) 46%, rgba(20,45,73,.62))` |
| `--cs-web-hero-accent` | `#8fc0ea` — the headline's emphasis phrase |
| `--cs-web-hero-eyebrow` · `-sub` · `-bullet` · `-call-sub` | `#d6e6f5` · `#c8d8e7` · `#e7eff7` · `#a9c0d6` |

The hero ground is CSS, and the gate proves contrast against it: white clears AA at 13.6:1 and the
light-blue accent at 7.1:1. **No page passes a photo behind hero copy**, which is what makes a fixed
contrast check valid at all.

## Generated — never hand-edit

`src/styles/tokens.css` ← `brand/tokens.json` · `src/styles/ui-tokens.css` ← `ui-tokens.json`

Both are rewritten by `npm run tokens`, which `npm run build` runs first. Editing the CSS gets your
change overwritten by the next build with no warning.

`--cs-ui-focus` is declared as `#E8843B` rather than referencing `--cs-accent`, on purpose: a focus
ring should be the loudest thing on the page, and a brand colour change must not be able to silently
weaken an accessibility affordance.

## Changing a brand value

```
# 1. edit brand/tokens.json or brand/voice-spec.json here
npm run tokens && npm run build && npm run verify

# 2. push it to the social pipeline
npm run brand:publish                 # → coldstream-os/design-systems/exteriors/

# 3. in coldstream-os — REQUIRED, and the step people skip
./supabase/seed-brand.sh exteriors    # file → content_portal_brands table
```

Step 3 is not optional and not automatic. `render-post` rasterises from the **database**, not from
the file. Publish without seeding and the website repaints while the social posts do not — with
every file on disk looking correct. `brand:publish` writes files and stops: no commit, no push, no
seed, because cross-repo automation that also commits is how a brand change lands in a repo nobody
was watching.

`voice-spec.json`'s banned words are enforced by `npm run verify`, which greps the built HTML. A
word added there fails the build the next time it appears in copy — that is the point of it.
