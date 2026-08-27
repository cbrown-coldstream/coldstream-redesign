# Cutover checklist

Work top to bottom. Steps 2–4 are ONE deploy — do not spread them across days.

## Before

- [ ] Confirm you can edit `.htaccess` on the host and that `mod_rewrite` is active.
- [ ] Back up the current WordPress site and its `.htaccess`.
- [ ] Skim `PAGES.md` — it lists every page this package serves.

## The deploy

- [ ] **Upload** the contents of `2-website-files.zip` to the web root. The tree is flat static
      files — `index.html` at root, one folder per page. Nothing to install.
- [ ] **Redirects:** paste `redirects/htaccess-301s.txt` into `.htaccess` **above** the
      `# BEGIN WordPress` block. Order matters: WordPress's catch-all must not run first.
- [ ] **Stop WordPress routing these paths** (the static files now own them):
      `/`, `/roofing/`, `/siding/`, `/windows/`, `/gutters/`, `/storm-damage/`,
      `/cincinnati/…`, `/columbus/…`, `/st-louis/…`, `/about-us/`, `/free-estimate/`,
      `/thank-you/`, `/financing/`, `/service-areas/`, `/privacy-policy/`, `/terms/`,
      `/sitemap/`, `/sitemap.xml`, `/robots.txt`, `/llms.txt`.
- [ ] **Do NOT touch `/blog/`.** WordPress keeps serving the 45 posts. This package contains no
      blog folder on purpose.

## Verify (10 minutes)

- [ ] `coldstreamexteriors.com/` loads the new homepage over HTTPS.
- [ ] Old URL spot-checks — each should 301 to the shown target:
      - `/cincinnati/residential-roofing/` → `/cincinnati/roofing/`
      - `/columbus/seamless-gutters/` → `/columbus/gutters/`
      - `/st-louis/roof-repair/` → `/st-louis/roofing/roof-repair/`
      - `/instant-roof-quote/` → `/free-estimate/`
      - `/commercial-roofing/` → `/cincinnati/commercial-roofing/`
- [ ] `/blog/` still shows the WordPress blog.
- [ ] `/robots.txt` allows crawling and names the sitemap (it must NOT say `Disallow: /`).
- [ ] Phone numbers: Cincinnati pages show (513) 258-0450, Columbus (614) 812-0811,
      St. Louis (314) 380-8111.

## After

- [ ] Google Search Console: submit `https://coldstreamexteriors.com/sitemap.xml`.
- [ ] Watch Search Console's Coverage report for a week — 404 spikes mean a redirect gap; send
      the URLs to Craig.
- [ ] Windows pages: 25 old window URLs intentionally have NO redirect yet (they are under
      review against ranking data). They keep resolving to WordPress until that call is made —
      if WordPress stops serving them, tell Craig first.
