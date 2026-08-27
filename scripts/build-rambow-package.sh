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
(cd "$STAGE/read-first" && zip -qr "$OUT/1-read-first.zip" .)

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
