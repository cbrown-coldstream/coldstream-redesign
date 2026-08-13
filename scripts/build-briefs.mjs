// PER-PAGE COPY BRIEFS, generated from the build.
//
// Run: npm run briefs   →   site/briefs/{market}-{service}.md, plus INDEX.md
//
// Fifteen service pages are noindex because they have no market-specific copy. "Write 15 pages of
// service copy" is not an actionable ask; fifteen short ones with the source material already
// identified is. So each brief names, for one page: the H1 that already exists, the fields that
// have to be filled, a word target per field, how many FAQ answers are needed, and — the part
// that matters — WHICH JOB RECORDS WOULD SATISFY EACH LOCAL-PROOF REQUIREMENT, expressed as a
// query against the ingestion contract rather than as a wish.
//
// IT IS ALSO A TEST OF THE PULL. Every requirement below is tagged with where its answer can come
// from. Requirements tagged NOT IN THE PULL are the honest finding: things the uniqueness bar asks
// for that a Contractors Cloud export cannot supply at any volume — local building stock, what
// storm season does there, what the permit office is like. Those need a person, and it is better
// to know that now than after the export lands and turns out to be insufficient.
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { MARKETS, servicesFor, copyFor } from "../src/data/markets.js";
import { SERVICE_CONTENT } from "../src/data/services.js";
import { LOCATIONS, allMarketJobs } from "../src/data/locations.js";
import { SURFACES, qualifiesFor } from "../src/data/contracts.js";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const outDir = resolve(root, "briefs");
mkdirSync(outDir, { recursive: true });

// The market-specific fields a service page needs, with a word target each. They add to the
// 300-word bar site-plan sets, and they are separate fields rather than one blob because each one
// lands in a different place on the page and answers a different question.
const FIELDS = [
  { key: "description", words: 25, where: "<meta description>", asks: "Why this page, for this market, in one sentence a person would click." },
  { key: "lead", words: 35, where: "hero sub-heading", asks: "The one line under the H1. Market-specific, not the shared service line." },
  { key: "intro", words: 120, where: "above the service cards", asks: "What this service actually involves HERE — the local specifics." },
  { key: "proof.heading", words: 8, where: "local work section", asks: "A heading naming the proof, e.g. \"Recent roofing in Clermont County\"." },
  { key: "proof.body", words: 90, where: "local work section", asks: "Real completed jobs, described. EVERY SPECIFIC MUST TRACE TO A RECORD." },
  { key: "faq[]", words: 60, where: "FAQ, above the shared questions", asks: "Two or three questions only someone in this market would ask." },
];
const WORD_TARGET = FIELDS.reduce((n, f) => n + f.words * (f.key === "faq[]" ? 2 : 1), 0);

// The uniqueness bar, decomposed. `source` is the honest part.
const BAR = [
  { need: "A unique H1 not reused across markets", source: "SATISFIED BY THE TEMPLATE", note: "h1 is a function of the market — see services.js." },
  { need: "The local phone number and address", source: "SATISFIED BY THE TEMPLATE", note: "utility bar, footer NAP and the market's LocalBusiness @id." },
  { need: "At least one piece of local proof", source: "THE JOB PULL", note: "jobs clearing the serviceProof bar for this market and service." },
  { need: "300+ words written for that market", source: "THE JOB PULL + A PERSON", note: "the records give the specifics; someone has to write the sentences." },
  { need: "Unique FAQ answers", source: "PARTLY NOT IN THE PULL", note: "recurring questions come from the crews and the office, not from job rows." },
  { need: "Local building stock, storm season, permit process", source: "NOT IN THE PULL", note: "no CRM field holds this. GM or crew lead, per market." },
];

const TODAY = "2026-08-11";   // build reference date; recency is never read from the clock

const briefFor = (mSlug, market, sKey) => {
  const svc = SERVICE_CONTENT[sKey];
  const h1 = svc.h1(market);
  const url = `/${mSlug}/${sKey}/`;
  const ctx = { today: TODAY, areaFor: (m, t) => Object.entries(LOCATIONS[m]?.areas ?? {}).find(([, a]) => a.towns.includes(t))?.[0] ?? null };

  // The query, and its current answer. This is the line that tells us whether the pull is enough.
  const candidates = allMarketJobs(mSlug)
    .filter((j) => j.service === sKey)
    .filter((j) => qualifiesFor(j, ctx).includes("serviceProof"));

  const L = [];
  L.push(`# ${h1}`);
  L.push("");
  L.push(`**${url}** · currently \`noindex\` — no market-specific copy.`);
  L.push("");
  L.push(`Market: **${market.name}** (${market.region}) · phone ${market.phone} · office ${market.office.street}, ${market.office.city}, ${market.office.state} ${market.office.zip}`);
  L.push("");
  L.push("## What already exists on this page");
  L.push("");
  L.push(`- **H1** — \`${h1}\`. Written, unique across markets, do not rewrite.`);
  L.push(`- **Shared lead** — ${copyFor(svc.lead, market)}`);
  L.push(`- **${svc.sections.length} service sections** — ${svc.sections.map((s) => s.title).join(" · ")}`);
  L.push(`- **${svc.faq.length} shared FAQ answers** — these stay; the local ones go above them.`);
  L.push("");
  L.push("## What has to be written");
  L.push("");
  L.push(`Target: **${WORD_TARGET}+ words** of market-specific copy, in \`SERVICE_CONTENT.${sKey.includes("-") ? `["${sKey}"]` : sKey}.local["${mSlug}"]\`.`);
  L.push("");
  L.push("| Field | Words | Where it lands | What it has to do |");
  L.push("|---|---|---|---|");
  for (const f of FIELDS) L.push(`| \`${f.key}\` | ${f.words}${f.key === "faq[]" ? " each, ×2–3" : ""} | ${f.where} | ${f.asks} |`);
  L.push("");
  L.push("## The source material");
  L.push("");
  L.push("The query that fills this page, against the ingestion contract:");
  L.push("");
  L.push("```");
  L.push(`market      = ${mSlug}`);
  L.push(`service     = ${sKey}`);
  L.push(`surface     = serviceProof   (${SURFACES.serviceProof.needs.join("; ")})`);
  L.push(`recency     = completed on or after ${TODAY.slice(0, 4) - 2}-${TODAY.slice(5)}`);
  L.push("```");
  L.push("");
  if (candidates.length) {
    L.push(`**${candidates.length} record(s) currently satisfy this.**`);
    L.push("");
    for (const j of candidates) {
      L.push(`- \`${j.jobId ?? j.town}\` — ${j.town}, ${j.completedOn}. Materials: ${(j.materials ?? []).join("; ")}. Scope: ${j.scope}`);
    }
  } else {
    L.push("**0 records currently satisfy this — the pull has not landed.**");
    L.push("");
    L.push("Until it does, this page cannot clear the bar and must stay `noindex`. It is not");
    L.push("blocked on a writer; it is blocked on the export.");
  }
  L.push("");
  L.push("## Requirement by requirement — and where each answer comes from");
  L.push("");
  L.push("| The bar asks for | Where it comes from | Note |");
  L.push("|---|---|---|");
  for (const b of BAR) L.push(`| ${b.need} | **${b.source}** | ${b.note} |`);
  L.push("");
  L.push("## Compliance");
  L.push("");
  L.push("- Voice, banned words and approved claims: `design-systems/exteriors/voice-spec.json`, verbatim. Do not re-derive.");
  L.push("- Only three claims are always-true: licensed & insured · free, no-obligation inspections · 25-year workmanship warranty.");
  L.push("- No \"guarantee\" as an absolute promise. No superlatives. No \"lifetime\" warranty.");
  L.push(`- Anything about pricing, financing, promotions, BBB or years in business is gated in \`claims.js\` and must not be written into this copy.`);
  if (sKey === "commercial-roofing") {
    L.push("- This hub exists in Cincinnati and Columbus only. St. Louis was ruled to have no commercial roofing.");
  }
  L.push("");
  L.push("Every specific must trace to a record. A sentence that could have been written without");
  L.push("looking at a Coldstream job does not belong on this page.");
  L.push("");
  return { path: `${mSlug}-${sKey}.md`, body: L.join("\n"), candidates: candidates.length, h1, url };
};

const briefs = [];
for (const [mSlug, market] of Object.entries(MARKETS)) {
  for (const s of servicesFor(market)) {
    if (SERVICE_CONTENT[s.key]?.local?.[mSlug]) continue;   // already written
    const b = briefFor(mSlug, market, s.key);
    writeFileSync(resolve(outDir, b.path), b.body);
    briefs.push(b);
  }
}

const idx = [
  "# Service page copy briefs",
  "",
  `Generated by \`npm run briefs\`. One per service page that is currently \`noindex\` for want of`,
  "market-specific copy. Regenerate after any data change — these are output, not source.",
  "",
  `**${briefs.length} pages need copy. ${briefs.filter((b) => b.candidates).length} have source records available today.**`,
  "",
  "| Page | H1 | Records available |",
  "|---|---|---|",
  ...briefs.map((b) => `| [\`${b.url}\`](${b.path}) | ${b.h1} | ${b.candidates || "**0 — blocked on the job pull**"} |`),
  "",
  "## What the job pull cannot answer",
  "",
  "Three of the six requirements in the uniqueness bar are satisfied by the template or by the",
  "export. The other three are not, and no volume of job records will change that:",
  "",
  ...BAR.filter((b) => b.source.includes("NOT IN THE PULL")).map((b) => `- **${b.need}** — ${b.note}`),
  "",
  "That is the honest limit of the export. It is worth knowing before it arrives: fifteen pages",
  "will need a short conversation with each market's GM or crew lead as well as the data.",
  "",
];
writeFileSync(resolve(outDir, "INDEX.md"), idx.join("\n"));

console.log(`\n  → ${briefs.length} copy briefs written to site/briefs/`);
for (const b of briefs) console.log(`    · ${b.path.padEnd(34)} ${b.candidates ? `${b.candidates} source record(s)` : "0 records — blocked on the job pull"}`);
console.log("");
