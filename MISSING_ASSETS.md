# Missing assets

The single register the homepage round (owner brief 2026-08-24) requires. One line per awaited
file; an asset leaves this list by arriving, never by being substituted with something that could
be mistaken for it.

## Awaited from Craig

*(none — the BBB seal arrived 2026-08-25)*

**Resolved with an owner override:** `brand/logos/bbb-a-plus.png` (Craig's file, 2026-08-25) now
renders in the badge row via `CLAIMS.bbbLogo`. The artwork is an AI-generated recreation of the
BBB seal; the trademark concern was raised 2026-08-24 and **Craig re-sent the file and directed
its use** — the owner's decision stands and is logged in claims.js and DECISIONS. BBB's official
hosted seal remains in the repo (`public/badges/bbb-accredited-seal.svg`); clearing `bbbLogo` is
the one-line revert if BBB ever objects.

## Awaited from the Contractors Cloud job pull

Five of the eight **What We Do** cards render `public/photos/placeholder-project.svg` — a
deliberately obvious placeholder — because the live WordPress site holds only three real project
photographs in total (verified by scraping every service page + the homepage, 2026-08-24;
everything else in its uploads is icons, partner marks, and one stock office photo).

| Card | Status |
|---|---|
| Residential Roofing | ✔ real — `photos/live/Coldstream_Exteriors_Roofing_Installer-1024x606.*` (live filename kept for provenance) |
| Siding | ✔ real — `photos/live/Cincinnati-siding-1-1024x771.*` |
| Vinyl Siding | ⚠ real Coldstream photo (`photos/live/415775438-…*`, from the live homepage) but the **material is unverified** — alt text claims the work, not the product. Replace with a verified vinyl job. |
| Storm Damage Restoration | ✘ placeholder |
| James Hardie Siding | ✘ placeholder — do not fill with an unverified-material photo; the card names the brand |
| Replacement Windows | ✘ placeholder |
| Seamless Gutters | ✘ placeholder |
| Commercial Roofing | ✘ placeholder |

Job photos must come with consent through the `src/data/contracts.js` shape. No stock photography
that could read as a Coldstream job — that rule outranks having a photo.

## Awaited from vendors

| Asset | Destination | Notes |
|---|---|---|
| Roofful instant-quote embed | `/instant-roof-quote/` (`src/pages/instant-roof-quote.astro`) | Page is built, noindex, `?market=` routing wired. Until the embed lands, every instant-quote CTA points at `/free-estimate/` and the live per-market URLs keep their existing 301s there. |
| Hero video (real footage) | `public/video/` | The current clip is a placeholder behind an opt-in button; the button itself was never formally approved (CLAUDE.md open questions). |
