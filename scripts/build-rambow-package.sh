#!/bin/bash
# RAMBOW HANDOFF PACKAGE — builds the two zips Craig sends to the production host team.
#
# Output: ~/Cold-Stream-Folder/rambow-handoff/
#   README.md            (loose copy, so the package can be previewed before sending)
#   1-read-first.zip     docs + the Apache 301 fragment
#   2-website-files.zip  the built site, minus everything Rambow must not upload
#
# WHAT IS EXCLUDED FROM THE SITE ZIP, AND WHY — this list is the point of the script:
#   blog/               DECISIONS §52: /blog/ stays with WordPress; shipping no folder makes
#                       the collision impossible rather than merely documented.
#   handoff/            The staging walkthrough of these same instructions — docs zip carries them.
#   pagemap.html        Internal build tooling, not site pages.
#   review.html         Internal review wall.
#   _redirects          Netlify syntax; the host is Apache — htaccess-301s.txt is the real one.
#   robots-staging.txt  The Disallow-everything staging file. Uploading it would be catastrophic
#                       if anything ever served it as /robots.txt.
set -euo pipefail
cd "$(dirname "$0")/.."

npm run build
npm run verify

OUT="$HOME/Cold-Stream-Folder/rambow-handoff"
STAGE="$(mktemp -d)"
rm -rf "$OUT"; mkdir -p "$OUT"

# ── 1: read-first zip ────────────────────────────────────────────────────────
mkdir -p "$STAGE/read-first/docs" "$STAGE/read-first/redirects"
cp handoff-docs/README.md            "$STAGE/read-first/README.md"
cp handoff-docs/CUTOVER-CHECKLIST.md "$STAGE/read-first/docs/"
cp handoff-docs/DESIGN-SYSTEM.md     "$STAGE/read-first/docs/"
cp PAGES.md                          "$STAGE/read-first/docs/"
cp redirects/htaccess.txt            "$STAGE/read-first/redirects/htaccess-301s.txt"

# HTML TWINS OF EVERY DOC — a .md file opens as raw text on most machines; the .html twin opens
# formatted in a browser with a double-click, which is how a non-technical reader will actually
# read this. Same content, generated, never hand-edited.
html_wrap() {
  local title="$1"
  cat <<HTML
<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>$title</title>
<style>
  body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.6;color:#101B26;
       max-width:820px;margin:40px auto;padding:0 24px;background:#fff}
  h1,h2,h3{font-weight:800;line-height:1.15}
  h1{border-bottom:3px solid #E8843B;padding-bottom:10px}
  code{background:#F2F6F9;border:1px solid #E4EAEF;border-radius:4px;padding:1px 5px;font-size:.92em}
  pre code{display:block;padding:12px;overflow-x:auto}
  table{border-collapse:collapse;width:100%}
  th,td{border:1px solid #E4EAEF;padding:8px 12px;text-align:left;vertical-align:top}
  th{background:#F2F6F9}
  input[type=checkbox]{margin-right:6px}
</style>
HTML
}
for md in "$STAGE/read-first/README.md" "$STAGE/read-first/docs/"*.md; do
  base="${md%.md}"
  title="$(head -1 "$md" | sed 's/^# //')"
  { html_wrap "$title"; npx --yes marked --gfm < "$md"; } > "$base.html"
done
(cd "$STAGE/read-first" && zip -qr "$OUT/1-read-first.zip" .)

# ── 1b: the WordPress/Bricks kit ─────────────────────────────────────────────
# Rambow's developer is rebuilding in Bricks (their ask, 2026-08-30), so the kit extracts what
# the HTML buries: per-page content sheets, design tokens, SEO pack, screenshots, build guide.
# Screenshots are only refreshed when scripts/../rambow-handoff-kit/screens/ has content — the
# shot run is slow, so it is a separate step (bash /tmp/kit-shots.sh or the mjs regenerates data).
node scripts/build-bricks-kit.mjs
mkdir -p "$STAGE/kit"
rsync -a rambow-handoff-kit/ "$STAGE/kit/"
cp handoff-docs/BRICKS-BUILD-GUIDE.md "$STAGE/kit/BRICKS-BUILD-GUIDE.md"
{ html_wrap "Building Coldstream in Bricks"; npx --yes marked --gfm < handoff-docs/BRICKS-BUILD-GUIDE.md; } > "$STAGE/kit/BRICKS-BUILD-GUIDE.html"
(cd "$STAGE/kit" && zip -qr "$OUT/3-wordpress-bricks-kit.zip" .)

# ── 2: site files zip ────────────────────────────────────────────────────────
mkdir -p "$STAGE/site"
rsync -a dist/ "$STAGE/site/" \
  --exclude blog/ --exclude handoff/ --exclude pagemap.html --exclude review.html \
  --exclude _redirects --exclude robots-staging.txt
(cd "$STAGE/site" && zip -qr "$OUT/2-website-files.zip" .)

cp handoff-docs/README.md "$OUT/README.md"
rm -rf "$STAGE"

echo
echo "Package ready in $OUT:"
ls -lh "$OUT"
echo
echo "site zip page count (index.html files):"
unzip -l "$OUT/2-website-files.zip" | grep -c "index.html$"
echo "confirming the exclusions really are absent:"
for bad in "blog/" "handoff/" "pagemap.html" "review.html" "_redirects" "robots-staging.txt"; do
  if unzip -l "$OUT/2-website-files.zip" | grep -q " $bad"; then echo "  ✗ $bad LEAKED"; exit 1; fi
done
echo "  ✓ none of the six excluded items are in the zip"
