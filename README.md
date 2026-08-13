# coldstream-exteriors-site

Static rebuild of **coldstreamexteriors.com** — 67 pages replacing 443, across Cincinnati,
Columbus and St. Louis. Astro, static output, no client framework.

**Start with [`CLAUDE.md`](CLAUDE.md)** — it is the context anyone (or any agent) needs before
changing anything. **[`PAGES.md`](PAGES.md)** is the full page inventory.

```bash
npm install
npm run build     # → dist/
npm run verify    # the gates. green or it is not done.
npm run dev       # local
```

## Where things are

| | |
|---|---|
| `src/data/` | The content. Markets, services, sub-services, locations, claims, partners. |
| `src/pages/` | 13 templates. Three markets are data, not three sites. |
| `src/components/` | Shared sections. |
| `src/styles/` | `tokens.css` and `ui-tokens.css` are generated; `base.css` is not. |
| `brand/` | Vendored from the `coldstream-os` repo. `npm run brand:sync` re-pulls. |
| `scripts/` | Build-time generators and the gates. |
| `redirects/` | Source of the 273-rule 301 map. |
| `public/preview/` | The approved design prototype. It is the reference, not a leftover. |
| `handoff/` | The deliverable package for the host: manifest and the Apache fragment. |

## Generated — do not hand-edit

`src/styles/tokens.css` · `src/styles/ui-tokens.css` · `public/_redirects` ·
`public/pagemap.html` · `public/handoff/` · `PAGES.md`

## Staging

https://coldstream-exteriors-staging.netlify.app — noindex, for review only. Production is the
existing WordPress host; see `/handoff/` on staging, or `handoff/MANIFEST.md`.
