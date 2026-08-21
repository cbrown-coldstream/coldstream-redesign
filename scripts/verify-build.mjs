// Checks the BUILT HTML, not the source. Run: npm run verify (after npm run build).
//
// Everything here is a check that a source-level review has already passed once and would pass
// again while the built output is wrong — because a component was reused, a prop defaulted, or a
// data file drifted. The ones that matter most:
//
//   · NAP — there are exactly three addresses. If a fourth appears in the HTML, something is
//     inventing one, which is the failure mode the location-page ruling exists to prevent.
//   · Dead links — the whole consolidation is an argument about internal linking. The live site
//     has href="#" entries; a rebuild that ships its own is not an improvement.
//   · Unsourced claims — the rating, the promotion, the financing figures. They are gated in
//     source, and this proves the gate holds in the output.
//   · Sitemap vs noindex — a noindex URL in the sitemap is a contradiction Search Console flags.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join, relative, sep } from "node:path";
import { MARKETS, NATIONAL_PHONE, MARKET_LIST } from "../src/data/markets.js";
import { BLOG } from "../src/data/redirects.js";
import { urls } from "../src/data/sitemap.js";
import { CLAIMS } from "../src/data/claims.js";
import { measureHero, measureHeroGround } from "./lib/contrast.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
if (!existsSync(dist)) { console.error("  ✗ no dist/ — run npm run build first"); process.exit(1); }

const walk = (d) => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : p.endsWith(".html") ? [p] : [];
});
// The page map, the review wall and the handoff site are internal documentation that ships inside
// the build for convenience. They are not pages of the website: they carry no canonical, nothing
// links to them, and they are noindex by construction. Checking them would fail the canonical, h1
// and orphan gates for the right reason and the wrong subject.
const DOCS = (f) => f.endsWith("pagemap.html") || f.endsWith("review.html") || f.includes(`${sep}handoff${sep}`);
const files = walk(dist).filter((f) => !DOCS(f));
const pages = files.map((f) => ({
  file: f,
  url: "/" + relative(dist, f).replace(/index\.html$/, "").replace(/\\/g, "/"),
  html: readFileSync(f, "utf8"),
}));

let failed = 0;
const fail = (msg, items = []) => {
  failed++;
  console.log(`  ✗ ${msg}`);
  for (const i of items.slice(0, 20)) console.log(`      ${i}`);
  if (items.length > 20) console.log(`      … and ${items.length - 20} more`);
};
const pass = (msg) => console.log(`  ✓ ${msg}`);

// 1. Internal links resolve to something this build produced.
const built = new Set(pages.map((p) => p.url));
built.add("/404.html");
const dead = [];
const hashes = [];
for (const p of pages) {
  for (const m of p.html.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (href === "#") { hashes.push(`${p.url} -> href="#"`); continue; }
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    const path = href.split("#")[0].split("?")[0];
    if (!path || path === "/") continue;
    if (/\.(xml|txt|jpg|png|webp|svg|mp4|webm|ico|css|js|woff2?)$/.test(path)) continue;
    if (!built.has(path)) dead.push(`${p.url} -> ${href}`);
  }
}
dead.length ? fail(`${dead.length} internal links point at pages that do not exist`, dead) : pass("no dead internal links");
hashes.length ? fail(`${hashes.length} href="#" links`, hashes) : pass('no href="#" links');

// 2. NAP. Exactly three street addresses may appear anywhere in the output.
const streets = MARKET_LIST.map((m) => m.office.street);
const strayAddress = [];
for (const p of pages) {
  for (const m of p.html.matchAll(/"streetAddress":"([^"]+)"/g))
    if (!streets.includes(m[1])) strayAddress.push(`${p.url}: ${m[1]}`);
}
strayAddress.length
  ? fail("schema contains a street address that is not one of the three real offices", strayAddress)
  : pass(`only the ${streets.length} real office addresses appear in schema`);

// 3. Location pages assert no place of business.
const locPages = pages.filter((p) => p.url.includes("/locations/"));
const locWithAddress = locPages.filter((p) => p.html.includes('"PostalAddress"') || p.html.includes('"@type":"RoofingContractor","name"'));
locWithAddress.length
  ? fail("location pages emit a business address or a LocalBusiness node", locWithAddress.map((p) => p.url))
  : pass(`${locPages.length} location pages emit no address and no LocalBusiness`);

// 4. Phone numbers. Only the four real ones may appear in a tel: href.
const realTel = new Set([NATIONAL_PHONE, ...MARKET_LIST.map((m) => m.phone)].map((p) => "tel:+1" + p.replace(/\D/g, "")));
const badTel = [];
for (const p of pages)
  for (const m of p.html.matchAll(/href="(tel:[^"]+)"/g))
    if (!realTel.has(m[1])) badTel.push(`${p.url}: ${m[1]}`);
badTel.length ? fail("tel: links to a number that is not one of the four real ones", badTel)
              : pass(`only the ${realTel.size} real phone numbers appear in tel: links`);

// 5. Unsourced claims must not reach the HTML.
const BANNED_CLAIMS = ["4.8", "$99", "$1,000", "$0 down", "BBB A+", "25+ years", "0%-interest",
                       "Sarah M.", "Dave R.", "Priya K.", "Marcus T.", "Joanne K."];

// ── A RATING THE BUILD ACTUALLY PULLED IS NOT AN UNSOURCED CLAIM ─────────────────────────────
//
// "4.8" is on that list because it was invented prototype copy — a star rating about a real review
// profile that no source backed. The check is a substring scan, so it could not tell that figure
// typed into a template from the same figure read off the Google profile this build pulled. Once
// reviews are pulled for real, a correct and sourced 4.8 failed this gate. That is a false positive,
// and a gate that cries wolf on good data is a gate people start switching off.
//
// SO THE EXEMPTION IS THE SOURCE, NOT THE NUMBER. A rating-shaped banned claim is allowed through
// only if src/data/generated/reviews.json — written by scripts/pull-reviews.mjs from the Places API
// and validated by npm run contracts — actually carries that value as a market's profile rating.
// Everything else on the list is untouched: prices, BBB, "25+ years" and the invented reviewer names
// have no sourced form and can never be exempted.
//
// WHAT THIS DELIBERATELY DOES NOT DO:
//   · It does not exempt a rating merely because reviews.json exists. The value has to match.
//   · It does not exempt a rating that appears on a page while a DIFFERENT one was pulled — a
//     hardcoded 4.8 beside a pulled 4.9 still fails, which is the case that matters most.
//   · It does not help a fixture build. COLDSTREAM_FIXTURES=1 supplies synthetic reviews from
//     memory and writes no file, so its 4.8 has no source and is still refused. Verified.
//   · It cannot stop someone hand-writing a fake reviews.json. Nothing here can; that is deliberate
//     fabrication rather than the accident this gate exists to catch, and contracts.js plus the
//     FIXTURE scan are the checks that bite there.
const RATING_SHAPED = /^[0-5](\.\d)?$/;
const sourcedRatings = new Set();
const PULLED = resolve(root, "src/data/generated/reviews.json");
if (existsSync(PULLED)) {
  try {
    const pulled = JSON.parse(readFileSync(PULLED, "utf8"));
    for (const [slug, m] of Object.entries(pulled.markets ?? {})) {
      // Same all-or-nothing rule the component and the contract apply: a rating with no count and
      // no profile link is not a sourced figure, it is a number.
      if (typeof m?.rating === "number" && Number.isInteger(m?.count) && m?.profileUrl) {
        sourcedRatings.add(String(m.rating));
      } else if (m?.rating != null) {
        console.log(`      note: ${slug} has a rating but no count/profileUrl — not treated as sourced`);
      }
    }
  } catch (e) {
    console.log(`      note: generated/reviews.json unreadable, no rating is exempt — ${e.message.split("\n")[0]}`);
  }
}

// ── A BBB GRADE THE CLAIMS FILE CARRIES IS NOT AN UNSOURCED CLAIM ────────────────────────────
//
// Same shape of false positive the pulled-rating exemption above fixes, and the same fix. "BBB A+"
// is on the list because the live WordPress site prints it with no accreditation record behind it.
// Once a record exists, a correct "BBB A+" would still fail this gate — and a gate that refuses
// the sourced version of the thing it was protecting is one people switch off.
//
// THE EXEMPTION IS THE SOURCE, NOT THE STRING. It is released only when claims.js carries an
// accredited record AND a letter grade, and only for the exact grade recorded: `rating: "A+"`
// exempts "BBB A+" and nothing else. Accreditation confirmed WITHOUT a grade — the state as of
// 2026-08-19 — exempts nothing, which is correct, because the badge then prints "BBB Accredited
// Business" and the banned string never reaches the HTML in the first place.
const bbbGrade = CLAIMS.bbb?.accredited && CLAIMS.bbb?.rating ? `BBB ${CLAIMS.bbb.rating}` : null;
const isSourced = (c) =>
  (RATING_SHAPED.test(c) && sourcedRatings.has(c)) || (bbbGrade !== null && c === bbbGrade);

const leaked = [];
for (const p of pages)
  for (const c of BANNED_CLAIMS) {
    if (isSourced(c)) continue;
    if (p.html.includes(c)) leaked.push(`${p.url}: "${c}"`);
  }
const exempt = BANNED_CLAIMS.filter(isSourced);
leaked.length
  ? fail("an unsourced claim reached the built HTML", leaked)
  : pass(
      exempt.length
        ? `no unsourced claim in any page — ${exempt.join(", ")} allowed as sourced (pulled rating / recorded BBB grade)`
        : "no unsourced claim (rating, promotion, financing, testimonial) in any page",
    );

// 6. Voice-spec banned words.
const voice = JSON.parse(readFileSync(resolve(root, "brand/voice-spec.json"), "utf8"));
const bannedWords = voice.never_use_words
  .map((w) => w.replace(/\s*\(.*\)$/, ""))
  .filter((w) => w.length > 3 && w !== "guarantee");
const badWord = [];
for (const p of pages) {
  const text = p.html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/g, "");
  for (const w of bannedWords)
    if (new RegExp(`\\b${w}\\b`, "i").test(text)) badWord.push(`${p.url}: "${w}"`);
  if (/\bguarantee/i.test(text)) badWord.push(`${p.url}: "guarantee"`);
}
badWord.length ? fail("voice-spec banned term in built copy", badWord)
               : pass(`no voice-spec banned term across ${pages.length} pages`);

// 7. Canonicals are self-referential and absolute.
const badCanon = [];
for (const p of pages) {
  if (p.url === "/404.html") continue;
  const m = p.html.match(/<link rel="canonical" href="([^"]+)"/);
  if (!m) { badCanon.push(`${p.url}: no canonical`); continue; }
  if (m[1] !== `https://coldstreamexteriors.com${p.url}`) badCanon.push(`${p.url}: canonical is ${m[1]}`);
}
badCanon.length ? fail("canonical wrong or missing", badCanon) : pass("every page self-canonicals");

// 8. Sitemap lists exactly the indexable pages.
const sitemap = readFileSync(resolve(dist, "sitemap.xml"), "utf8");
const listed = [...sitemap.matchAll(/<loc>https:\/\/coldstreamexteriors\.com([^<]*)<\/loc>/g)].map((m) => m[1]);
const noindexed = pages.filter((p) => /name="robots" content="noindex/.test(p.html)).map((p) => p.url);
const contradiction = listed.filter((u) => noindexed.includes(u));
const missing = pages.filter((p) => !noindexed.includes(p.url) && p.url !== "/404.html" && !listed.includes(p.url)).map((p) => p.url);
contradiction.length ? fail("sitemap lists a noindex URL", contradiction) : pass(`sitemap lists ${listed.length} URLs, none noindexed`);
missing.length ? fail("indexable page missing from sitemap", missing) : pass("every indexable page is in the sitemap");

// 9. REDIRECT HYGIENE. Five checks, because a 301 map is only as good as its worst rule and every
//    one of these failures is invisible until traffic hits it on migration day.
const redirects = readFileSync(resolve(root, "public/_redirects"), "utf8")
  .split("\n").filter((l) => l && !l.startsWith("#"));
const rules = redirects.map((l) => l.trim().split(/\s+/)).map(([from, to, status]) => ({ from, to, status }));

// 9a. Every target is a page this build produces — a 301 into a 404 loses the ranking value
//     exactly like the 404 it replaced, but looks handled.
const badTarget = rules
  .filter((r) => r.status === "301" && !r.to.includes(":") && !built.has(r.to))
  .map((r) => `${r.from} -> ${r.to}`);
badTarget.length ? fail("301 points at a page that does not exist", badTarget)
                 : pass(`all ${rules.length} redirect rules point at real pages`);

// 9b. No chains and no loops. A chain (A→B→C) leaks ranking value at every hop and Google gives
//     up after a handful; a loop is a dead page. Both are caught by asking whether any target is
//     itself matched by some rule's from-pattern.
const toRegex = (p) =>
  new RegExp("^" + p.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/:\w+/g, "[^/]+").replace(/\*/g, ".*") + "$");
const matchers = rules.map((r) => ({ re: toRegex(r.from), rule: r }));
const chains = [];
const loops = [];
for (const r of rules) {
  if (r.to.includes(":") || r.status === "410") continue;
  if (r.from === r.to) { loops.push(`${r.from} -> itself`); continue; }
  for (const m of matchers) {
    if (m.rule === r) continue;
    if (m.re.test(r.to)) {
      (m.rule.to === r.from ? loops : chains).push(`${r.from} -> ${r.to} -> ${m.rule.to}`);
    }
  }
}
loops.length ? fail(`${loops.length} redirect loops`, loops) : pass("no redirect loops");
chains.length ? fail(`${chains.length} redirect chains (A -> B -> C)`, chains) : pass("no redirect chains");

// 9c. NO REDIRECT MAY LAND ON A noindex PAGE. This is the one that fails today, on purpose.
//     A 301 into a noindexed page hands Google the ranking value of the old URL and then tells it
//     not to index the page holding it — the value goes nowhere. Fifteen service pages are
//     noindex for want of copy, and the slug-standardisation rules point straight at them. It
//     goes green as the copy lands, and until then it names exactly what is costing us.
//
//     TWO KINDS OF noindex, and only one of them is a problem. /thank-you/ is noindex BY DESIGN
//     and always will be — a conversion confirmation page has no business ranking, and the retired
//     URLs pointing at it never ranked either. Counting those as failures would leave this check
//     permanently red for a reason nobody can fix, which is how a check stops being read. Only
//     targets that are noindex FOR WANT OF SOURCED CONTENT are failures, because those are the
//     ones where real ranking value is being handed to a page that cannot receive it.
const byDesign = new Set(urls().filter((u) => u.why === "never indexed by design").map((u) => u.path));
const noindexSet = new Set(noindexed);
const landing = rules.filter((r) => r.status === "301" && !r.to.includes(":") && noindexSet.has(r.to));
const accepted = landing.filter((r) => byDesign.has(r.to));
const intoNoindex = landing.filter((r) => !byDesign.has(r.to));
const intoNoindexTargets = [...new Set(intoNoindex.map((r) => r.to))];
intoNoindex.length
  ? fail(`${intoNoindex.length} redirects land on a noindex page — ${intoNoindexTargets.length} pages, all awaiting sourced content`,
         intoNoindexTargets.map((t) => `${t} — ${intoNoindex.filter((r) => r.to === t).length} rules point here`))
  : pass("no redirect lands on a page that is noindex for want of content");
if (accepted.length) console.log(`      (${accepted.length} more land on pages that are noindex by design — accepted, not counted)`);

// 9d. Every blog URL has a row, and every row is PENDING until it has data behind it.
if (BLOG.status === "PENDING" && !BLOG.rows.length) {
  // The build order allows exactly one block to stay pending, and this is it: "map rows stay
  // PENDING". So this is a pass that names its own gap rather than a failure — the posts are not
  // being migrated, they stay on WordPress, and no rule may be guessed for them.
  pass(`blog block PENDING by decision — ${BLOG.count} live posts stay on WordPress, no rules emitted`);
  console.log(`      ${BLOG.disposition}`);
  console.log(`      Per-post URLs need the live export at site/data/live-urls.txt.`);
} else if (!BLOG.rows.length) {
  fail("blog block is not PENDING but has no rows", [BLOG.reason]);
} else {
  const undecided = BLOG.rows.filter((r) => r.decision === "PENDING");
  const emitted = BLOG.rows.filter((r) => r.decision !== "PENDING" && !rules.some((x) => x.from === r.path));
  emitted.length
    ? fail("a blog row has a decision but no rule was emitted for it", emitted.map((r) => `${r.path} — ${r.decision}`))
    : pass(`${BLOG.rows.length} blog URLs have rows · ${undecided.length} still PENDING`);
}

// 10. No fixture content may ever reach built output. The synthetic jobs and reviews exist to test
//     the gates; a build that shipped them would be publishing fabricated endorsements.
const fixtureLeak = pages.filter((p) => /FIXTURE/i.test(p.html)).map((p) => p.url);
fixtureLeak.length ? fail("FIXTURE content reached the built HTML — this build must not be deployed", fixtureLeak)
                   : pass("no fixture content in built output");

// 10a. NO ORPHANS. A page nothing links to can only be reached by typing its URL, and a crawler
//      finds pages by following links — so an unlinked page is, for ranking purposes, close to a
//      page that does not exist. This caught nine of them: the per-market About and Free Estimate
//      pages, the blog index, and all 26 Columbus towns silently unlinked because a metro market
//      returns "" from areaForTown and "" is falsy.
//
//      /thank-you/ is the one legitimate orphan — you get there by submitting the form, and it is
//      noindex by design.
const ALLOWED_ORPHANS = new Set(["/thank-you/", "/404.html"]);
const linkedTo = new Set();
for (const p of pages)
  for (const m of p.html.matchAll(/href="(\/[^"#?]*)"/g)) linkedTo.add(m[1]);
const orphans = pages
  .map((p) => p.url)
  .filter((u) => u !== "/" && !ALLOWED_ORPHANS.has(u) && !linkedTo.has(u));
orphans.length
  ? fail(`${orphans.length} pages are linked from nowhere — reachable only by typing the URL`, orphans)
  : pass(`no orphan pages — every page is reachable by clicking`);

// 10b. EXACTLY ONE <h1> PER PAGE. Two h1s split the page's strongest on-page signal between them;
//      none leaves a crawler to guess from the <title>. Required by the handover spec.
const badH1 = [];
for (const p of pages) {
  const n = (p.html.match(/<h1[\s>]/g) ?? []).length;
  if (n !== 1) badH1.push(`${p.url}: ${n} h1 elements`);
}
badH1.length ? fail("pages without exactly one h1", badH1) : pass(`exactly one h1 on each of ${pages.length} pages`);

// 11. HERO CONTRAST, MEASURED — against whatever is actually painting.
//
//     Today that is the CSS ground, composited from ui-tokens.json's web block. It used to be a
//     poster image, and this check went on measuring that file for a while after nothing rendered
//     it: a green tick on a JPEG no visitor was being shown. If a page starts passing hero media
//     the loop below picks the asset out of the built HTML and measures that too, because a photo
//     under a translucent wash is the case where contrast stops being a known quantity.
const AA_BODY = 4.5, AA_LARGE = 3.0;   // the h1 is clamp(2.05rem…) — large text
const checkAA = (c, what) => {
  const bad = [];
  if (c.whiteRatio < AA_BODY) bad.push(`white body copy is ${c.whiteRatio.toFixed(2)}:1, needs ${AA_BODY}:1`);
  if (c.accentRatio < AA_LARGE) bad.push(`accent headline phrase is ${c.accentRatio.toFixed(2)}:1, needs ${AA_LARGE}:1`);
  bad.length
    ? fail(`hero copy fails AA on ${what}`, bad)
    : pass(`hero copy clears AA on ${what} — white ${c.whiteRatio.toFixed(1)}:1, accent ${c.accentRatio.toFixed(1)}:1`);
};

try {
  const web = JSON.parse(readFileSync(resolve(root, "ui-tokens.json"), "utf8")).web;
  checkAA(measureHeroGround(web), "the CSS hero ground (no page passes media)");

  // Any hero media a page does pass, measured on its own terms.
  const posters = new Set();
  for (const p of pages) {
    for (const m of p.html.matchAll(/class="hero-media"[\s\S]*?(?:poster|src)="([^"]+)"/g)) posters.add(m[1]);
  }
  for (const src of posters) {
    const file = resolve(root, "public", src.replace(/^\//, ""));
    if (existsSync(file)) checkAA(measureHero(file, web), `hero media ${src}`);
    else fail("a hero references media that is not in public/", [src]);
  }
} catch (e) {
  console.log(`  ⚠ hero contrast not measured — ${e.message.split("\n")[0]}`);
}


// 12. THE SEO SURFACE — title and description, on every page, measured.
//
//     ROUND 41 FIXED THESE BY HAND and nothing held them fixed. By round 42 two pages had drifted
//     back over the limits, which is what an unenforced rule does. The limits are Google's own
//     truncation points, not a style preference: past them the tail of the string is replaced with
//     an ellipsis in the result, so the words after it are written for nobody.
//
//     ENTITIES ARE DECODED FIRST, and this is the part worth remembering. `&amp;` is five
//     characters in the file and one on screen. Measuring the raw HTML made round 41's first pass
//     report 24 over-length titles where there were 11 — more than double, entirely from
//     ampersands. A gate that cries wolf gets edited out.
//
//     DUPLICATES ARE THE OTHER HALF, and the more damaging one. Nine pages shipped identical
//     descriptions across the three markets — the single clearest signal a crawler has that two
//     pages are the same page, on exactly the pages the copy rounds had just spent effort making
//     different. Only INDEXABLE pages are compared: two noindexed placeholders sharing a
//     description is not a ranking problem.
const TITLE_MAX = 60, DESC_MAX = 160;
const decodeEntities = (t) => t
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
  .replace(/&(quot|apos|lt|gt|nbsp|amp);/g, (_, e) =>
    ({ quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " ", amp: "&" }[e]));

const meta = pages.map((p) => {
  const rawTitle = (p.html.match(/<title[^>]*>([\s\S]*?)<\/title>/) ?? [])[1];
  const rawDesc = (p.html.match(/<meta name="description" content="([^"]*)"/) ?? [])[1];
  return {
    url: p.url,
    noindex: /name="robots" content="noindex/.test(p.html),
    title: rawTitle == null ? null : decodeEntities(rawTitle.trim()),
    description: rawDesc == null ? null : decodeEntities(rawDesc.trim()),
  };
});

const missingMeta = meta.filter((m) => !m.title || !m.description)
  .map((m) => `${m.url} — missing ${!m.title ? "title" : "description"}`);
missingMeta.length
  ? fail("a page has no title or no meta description", missingMeta)
  : pass(`every page has a title and a description`);

const overLong = [
  ...meta.filter((m) => m.title && m.title.length > TITLE_MAX)
    .map((m) => `${m.url} — title ${m.title.length}/${TITLE_MAX}: ${m.title}`),
  ...meta.filter((m) => m.description && m.description.length > DESC_MAX)
    .map((m) => `${m.url} — description ${m.description.length}/${DESC_MAX}`),
];
overLong.length
  ? fail("a title or description is past the point Google truncates it", overLong)
  : pass(`titles inside ${TITLE_MAX} and descriptions inside ${DESC_MAX} on all ${meta.length} pages`);

const dupes = (field) => {
  const seen = new Map();
  for (const m of meta.filter((x) => !x.noindex && x[field])) {
    const k = m[field];
    seen.set(k, [...(seen.get(k) ?? []), m.url]);
  }
  return [...seen].filter(([, v]) => v.length > 1)
    .map(([k, v]) => `${v.join(", ")} — all say "${k.slice(0, 70)}${k.length > 70 ? "…" : ""}"`);
};
const dupMeta = [...dupes("title"), ...dupes("description")];
dupMeta.length
  ? fail("indexable pages share a title or a description", dupMeta)
  : pass("no two indexable pages share a title or a description");

// 13. THE SOCIAL CARD RESOLVES TO A FILE THAT EXISTS.
//
//     og:image pointed at /og-default.jpg from the first build to round 42 and no such file was
//     ever in public/. Nothing caught it: the link checker reads href and not meta content, and a
//     broken share card is invisible from inside the site — you only see it in someone else's
//     Slack. The image is generated now (scripts/build-og-image.mjs); this is the check that says
//     so out loud on every build.
const ogRefs = new Set();
for (const p of pages) {
  for (const m of p.html.matchAll(/property="og:image" content="https:\/\/coldstreamexteriors\.com([^"]+)"/g)) {
    ogRefs.add(m[1]);
  }
}
const ogMissing = [...ogRefs].filter((r) => !existsSync(resolve(dist, r.replace(/^\//, ""))));
ogRefs.size === 0
  ? fail("no page declares an og:image — every shared link renders as a bare URL")
  : ogMissing.length
    ? fail("og:image points at a file this build does not contain", ogMissing)
    : pass(`og:image resolves for all ${ogRefs.size} card${ogRefs.size === 1 ? "" : "s"} in use`);

//     THE ICONS ARE THE SAME BUG WAITING TO HAPPEN — a <link rel="icon"> at a path nothing wrote
//     fails exactly as quietly as the og:image did, and the cost is a generic globe beside the
//     listing on every mobile search result. Round 43 added the icon set; this keeps it honest.
const iconRefs = new Set();
for (const p of pages) {
  for (const m of p.html.matchAll(/<link rel="(?:icon|apple-touch-icon)"[^>]*href="(\/[^"]+)"/g)) {
    iconRefs.add(m[1]);
  }
}
const iconMissing = [...iconRefs].filter((r) => !existsSync(resolve(dist, r.replace(/^\//, ""))));
iconRefs.size === 0
  ? fail("no page declares a favicon — search results get a generic globe")
  : iconMissing.length
    ? fail("a favicon link points at a file this build does not contain", iconMissing)
    : pass(`all ${iconRefs.size} icon files resolve`);


// 14. NO HEADING LEVEL IS SKIPPED.
//
//     Every page in the build jumped h2 → h4 at the footer until round 43, because the footer
//     column titles were h4 under a document whose sections are h2. A skipped level is a screen
//     reader announcing a subsection of something that was never opened, and it is the one
//     structural fault an outline check finds on all 75 pages at once — so it is worth a gate
//     rather than a note, since the next component to add a heading will guess the same way.
const skipped = [];
for (const p of pages) {
  const levels = [...p.html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
  const jumps = [];
  let prev = 0;
  for (const l of levels) { if (prev && l > prev + 1) jumps.push(`h${prev} → h${l}`); prev = l; }
  if (jumps.length) skipped.push(`${p.url} — ${[...new Set(jumps)].join(", ")}`);
}
skipped.length
  ? fail("a page skips a heading level", skipped)
  : pass("no heading level skipped on any page");

// 15. NO SCHEMA NODE PUBLISHES AN EMPTY VALUE.
//
//     /blog/ shipped `blogPost: []` and the three galleries shipped `image: []` — each stating
//     that the list exists and holds nothing, which is not what "no posts migrated yet" means and
//     is exactly the shape a structured-data validator flags. The rest of this site already knows
//     that an absent claim is absent rather than empty (see data/claims.js); this holds the schema
//     to the same rule. Relative URLs are caught here too: schema wants resolvable ones.
const URLISH = /^(url|item|logo|image|contentUrl|sameAs)$/;
const schemaBad = [];
for (const p of pages) {
  for (const m of p.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let parsed;
    try { parsed = JSON.parse(m[1]); }
    catch { schemaBad.push(`${p.url} — a JSON-LD block does not parse`); continue; }
    const walk = (v, path) => {
      const leaf = path.split(".").pop().replace(/\[\d+\]$/, "");
      if (v === null || v === "") schemaBad.push(`${p.url} — empty value at ${path}`);
      else if (Array.isArray(v)) {
        if (!v.length) schemaBad.push(`${p.url} — empty array at ${path}`);
        v.forEach((x, i) => walk(x, `${path}[${i}]`));
      } else if (typeof v === "object") for (const k of Object.keys(v)) walk(v[k], `${path}.${k}`);
      else if (typeof v === "string" && URLISH.test(leaf) && !/^https?:\/\//.test(v))
        schemaBad.push(`${p.url} — ${path} is not an absolute URL: ${v}`);
    };
    // A page emits one @graph plus, where a component owns its own node, a second block that
    // joins it by @id. Unwrap both shapes to the same flat list of nodes.
    const blocks = Array.isArray(parsed) ? parsed : [parsed];
    const nodes = blocks.flatMap((b) => (Array.isArray(b?.["@graph"]) ? b["@graph"] : [b]));
    for (const node of nodes) {
      if (!node["@type"]) schemaBad.push(`${p.url} — a schema node has no @type`);
      for (const k of Object.keys(node)) if (k !== "@context") walk(node[k], k);
    }
  }
}
schemaBad.length
  ? fail("a schema node publishes an empty or unresolvable value", [...new Set(schemaBad)])
  : pass("no empty or relative value in any schema node");

// 15b. EVERY @id REFERENCE RESOLVES ON THE PAGE THAT MAKES IT.
//
//      Round 44 tied each page's schema into one graph — WebPage isPartOf WebSite, about the
//      Organization, breadcrumb this BreadcrumbList. A reference is only worth having if the thing
//      it points at is defined where the reader is looking: a crawler is not obliged to go and
//      fetch another page to resolve an @id, and a dangling reference is a claim about a node that,
//      as far as that page is concerned, does not exist. `about` pointed at exactly such a node on
//      73 of 75 pages until the lean Organization was added to every one of them.
const danglingRefs = [];
for (const p of pages) {
  const defined = new Set(), referenced = [];
  for (const m of p.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let parsed;
    try { parsed = JSON.parse(m[1]); } catch { continue; }
    const blocks = Array.isArray(parsed) ? parsed : [parsed];
    const nodes = blocks.flatMap((b) => (Array.isArray(b?.["@graph"]) ? b["@graph"] : [b]));
    // A node DEFINES its @id when it carries anything besides the @id itself.
    const collect = (v, top) => {
      if (Array.isArray(v)) return v.forEach((x) => collect(x, false));
      if (!v || typeof v !== "object") return;
      if (typeof v["@id"] === "string") {
        if (Object.keys(v).length === 1) referenced.push(v["@id"]);
        else defined.add(v["@id"]);
      }
      for (const k of Object.keys(v)) if (k !== "@id") collect(v[k], false);
    };
    nodes.forEach((n) => collect(n, true));
  }
  for (const r of new Set(referenced)) if (!defined.has(r)) danglingRefs.push(`${p.url} → ${r}`);
}
danglingRefs.length
  ? fail("a schema @id reference points at a node the page never defines", danglingRefs)
  : pass("every schema @id reference resolves on its own page");

// 16. EVERY INDEXABLE PAGE IS LINKED FROM AT LEAST THREE OTHERS.
//
//     The orphan gate above asks whether a page is reachable at all. This asks whether it is
//     SUPPORTED, which is a different question and the one that found a real problem: every
//     sub-service carried 18–21 inbound links except siding-replacement, which carried two,
//     because four of the five sit in a nav dropdown that renders site-wide and it does not.
//
//     Three is deliberately a floor and not a target. A page reachable only from its own hub and
//     the internal sitemap is a page the site is not actually arguing for, and the fix is a link
//     from somewhere a reader would look — not a nav edit to make the number go up.
const inbound = new Map(pages.map((p) => [p.url, new Set()]));
for (const p of pages) {
  for (const m of p.html.matchAll(/href="(\/[^"#?]*)"/g)) {
    const target = m[1];
    if (target !== p.url && inbound.has(target)) inbound.get(target).add(p.url);
  }
}
const underlinked = pages
  .filter((p) => !/name="robots" content="noindex/.test(p.html))
  .map((p) => [p.url, inbound.get(p.url).size])
  .filter(([, n]) => n < 3)
  .map(([u, n]) => `${u} — linked from ${n} page${n === 1 ? "" : "s"}`);
underlinked.length
  ? fail("an indexable page is linked from fewer than three others", underlinked)
  : pass(`every indexable page is linked from at least three others`);


// 17. THE MACHINE-READABLE SUMMARY IS REAL AND ITS LINKS ARE REAL.
//
//     public/llms.txt is a single fetch that answers "what is this company and what pages does it
//     have" — the request an assistant makes when someone asks about Coldstream by name. It is
//     GENERATED from the same modules the pages render from, so it cannot drift into being a
//     second, stale description of the business; this proves that the links in it point at pages
//     that exist, which is the one way a generated file can still be wrong.
const llmsFile = resolve(dist, "llms.txt");
if (!existsSync(llmsFile)) {
  fail("llms.txt is missing — run npm run llms");
} else {
  const llms = readFileSync(llmsFile, "utf8");
  const linked = [...new Set([...llms.matchAll(/https:\/\/coldstreamexteriors\.com(\/[^\s)\]]*)/g)].map((m) => m[1]))]
    .filter((u) => !u.startsWith("/sitemap.xml"));
  const llmsDead = linked.filter((u) => !built.has(u));
  llmsDead.length
    ? fail("llms.txt links at a page this build does not contain", llmsDead)
    : pass(`llms.txt lists ${linked.length} URLs, all of them real`);
}

// 18. EVERY INDEXABLE URL CARRIES A CONTENT DATE, OR NONE OF THEM DOES.
//
//     <lastmod> is only worth having while it is accurate — Google uses it as a hint and stops
//     using it when it stops matching reality. The dates come from git, per page, from the content
//     sources that page is built out of (scripts/build-lastmod.mjs). Two states are correct: every
//     indexable URL has one, or, with no git available, none does. A sitemap where SOME pages
//     carry a date is the state that misleads — the undated ones read as never having changed.
const dated = [...sitemap.matchAll(/<url>[\s\S]*?<loc>[^<]*<\/loc>\s*(<lastmod>)?/g)].filter((m) => m[1]).length;
const totalUrls = listed.length;
dated === 0
  ? pass("no <lastmod> in the sitemap — no git dates available, and none invented")
  : dated === totalUrls
    ? pass(`every one of the ${totalUrls} sitemap URLs carries a content date`)
    : fail(`${totalUrls - dated} of ${totalUrls} sitemap URLs have no <lastmod> while the rest do`);

console.log(`\n  ${failed ? `✗ ${failed} CHECKS FAILED` : `✓ all checks passed across ${pages.length} pages`}\n`);
process.exit(failed ? 1 : 0);
