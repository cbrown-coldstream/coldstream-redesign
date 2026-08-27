# Coldstream Exteriors — website handoff for Rambow

This package replaces the current WordPress-rendered pages of **coldstreamexteriors.com**
with a pre-built static site. Two zips:

| File | What it is |
|---|---|
| `1-read-first.zip` | This README, the cutover checklist, the design system, the page inventory, and the 301 redirect rules |
| `2-website-files.zip` | The website itself — plain HTML/CSS/images, ready to upload. No PHP, no database, no build step |

## The one rule that matters most

**The pages and the redirects go live in the same change.** Publishing the 301 rules before the
pages point ~380 redirects at pages that do not exist yet; publishing the pages without the rules
leaves every old URL returning 404 and throws away the rankings they earned. Same deploy, both.

## Cutover, in order

1. Read `docs/CUTOVER-CHECKLIST.md` — it is short and every step is there for a reason.
2. Upload the contents of `2-website-files.zip` to the web root.
3. Add the contents of `redirects/htaccess-301s.txt` to the `.htaccess`, **above** the WordPress
   rewrite block. If WordPress answers first, none of the redirects fire.
4. Stop WordPress from routing the paths this site now owns (the checklist lists them).
5. **Leave `/blog/` with WordPress.** The 45 live blog posts stay exactly where they are — this
   package deliberately contains no `blog/` folder, so nothing can collide. The new site's footer
   links to `/blog/` and WordPress keeps serving it.
6. Verify a handful of old URLs 301 to the right new pages (samples in the checklist).
7. Submit `https://coldstreamexteriors.com/sitemap.xml` in Google Search Console.

## Previewing the site

**Don't double-click the HTML files** — they will open without styling, because the pages
reference their stylesheets the way a web server serves them, not the way a local folder does.
That is expected, and it disappears the moment the files are on the host. To see the site as it
will look:

- Easiest: the live preview at **https://coldstream-exteriors-staging.netlify.app** — the exact
  same files as this zip.
- Or serve the unzipped folder with any local web server (e.g. `python3 -m http.server` in the
  folder, then open `http://localhost:8000`).

## What is in the site files

61 indexable pages plus a small set that are intentionally `noindex` (they are waiting on real
photos or data — a gallery page with no photos should not rank). `robots.txt` and `sitemap.xml`
are production-ready as shipped. Every page is self-contained static HTML: if it renders locally
when you open it, it will render on the host.

## Questions

Craig Brown — craig@coldstreamsolar.com. Anything technical about how the pages were built can
come through him.
