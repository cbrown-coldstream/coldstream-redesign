#!/bin/bash
# TEMPLATE SCREENSHOTS for the WordPress/Bricks kit — desktop (1440→1100w jpg) and a true-390px
# mobile render (iframe centered in Chrome's 500px minimum window, then center-cropped; headless
# Chrome refuses windows narrower than ~500, see DECISIONS §66).
# Slow (16 Chrome renders), so it is its own step: run it, then scripts/build-rambow-package.sh,
# which stages whatever screens/ holds. ABSOLUTE BINARY PATHS throughout: the session shell has
# intermittently lost PATH mid-loop, and a silent sips failure shipped an empty screens folder once.
set -euo pipefail
cd "$(dirname "$0")/.."
/usr/bin/python3 -m http.server 8765 --directory dist >/dev/null 2>&1 &
SRV=$!
trap 'kill $SRV 2>/dev/null; /bin/rm -f dist/mshot.html /tmp/shot-d.png /tmp/shot-m.png' EXIT
/bin/sleep 1
C="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
K=rambow-handoff-kit/screens
/bin/mkdir -p "$K"
for pair in home:/ market-landing:/cincinnati/ service-hub-national:/roofing/ service-hub-market:/cincinnati/siding/ \
            sub-service:/cincinnati/siding/james-hardie-siding/ free-estimate:/free-estimate/ service-areas:/service-areas/ about:/about-us/; do
  n="${pair%%:*}"; path="${pair##*:}"
  "$C" --headless=new --disable-gpu --hide-scrollbars --window-size=1440,9500 --virtual-time-budget=9000 --screenshot=/tmp/shot-d.png "http://localhost:8765${path}index.html" 2>/dev/null
  /usr/bin/sips -s format jpeg -s formatOptions 72 --resampleWidth 1100 /tmp/shot-d.png --out "$K/$n-desktop.jpg" >/dev/null
  /usr/bin/printf '<!doctype html><body style="margin:0"><iframe src="%s" style="width:390px;height:8000px;border:0;display:block;margin:0 auto"></iframe>' "$path" > dist/mshot.html
  "$C" --headless=new --disable-gpu --hide-scrollbars --window-size=500,8000 --virtual-time-budget=9000 --screenshot=/tmp/shot-m.png "http://localhost:8765/mshot.html" 2>/dev/null
  /usr/bin/sips --cropToHeightWidth 8000 390 /tmp/shot-m.png >/dev/null
  /usr/bin/sips -s format jpeg -s formatOptions 72 /tmp/shot-m.png --out "$K/$n-mobile.jpg" >/dev/null
  echo "ok: $n"
done
