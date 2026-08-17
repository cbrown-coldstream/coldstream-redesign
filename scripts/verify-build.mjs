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

const leaked = [];
for (const p of pages)
  for (const c of BANNED_CLAIMS) {
    if (RATING_SHAPED.test(c) && sourcedRatings.has(c)) continue;
    if (p.html.includes(c)) leaked.push(`${p.url}: "${c}"`);
  }
const exempt = BANNED_CLAIMS.filter((c) => RATING_SHAPED.test(c) && sourcedRatings.has(c));
leaked.length
  ? fail("an unsourced claim reached the built HTML", leaked)
  : pass(
      exempt.length
        ? `no unsourced claim in any page — ${exempt.join(", ")} allowed as a pulled Google rating`
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

console.log(`\n  ${failed ? `✗ ${failed} CHECKS FAILED` : `✓ all checks passed across ${pages.length} pages`}\n`);
process.exit(failed ? 1 : 0);
