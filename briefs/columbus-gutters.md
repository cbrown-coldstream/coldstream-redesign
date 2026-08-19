# Gutters in Columbus

**/columbus/gutters/** · currently `noindex` — no market-specific copy.

Market: **Columbus** (Central Ohio) · phone (614) 812-0811 · office 5825 Fieldcrest Dr, Galloway, OH 43119

## What already exists on this page

- **H1** — `Gutters in Columbus`. Written, unique across markets, do not rewrite.
- **Shared lead** — Seamless gutters, guards and downspouts, sized to the roof they are draining.
- **3 service sections** — Seamless Gutters · Gutter Guards · Downspouts and Drainage
- **6 shared FAQ answers** — these stay; the local ones go above them.

## What has to be written

Target: **398+ words** of market-specific copy, in `SERVICE_CONTENT.gutters.local["columbus"]`.

| Field | Words | Where it lands | What it has to do |
|---|---|---|---|
| `description` | 25 | <meta description> | Why this page, for this market, in one sentence a person would click. |
| `lead` | 35 | hero sub-heading | The one line under the H1. Market-specific, not the shared service line. |
| `intro` | 120 | above the service cards | What this service actually involves HERE — the local specifics. |
| `proof.heading` | 8 | local work section | A heading naming the proof, e.g. "Recent roofing in Clermont County". |
| `proof.body` | 90 | local work section | Real completed jobs, described. EVERY SPECIFIC MUST TRACE TO A RECORD. |
| `faq[]` | 60 each, ×2–3 | FAQ, above the shared questions | Two or three questions only someone in this market would ask. |

## The source material

The query that fills this page, against the ingestion contract:

```
market      = columbus
service     = gutters
surface     = serviceProof   (publishable; materials actually specified; a scope line; completed within 24 months)
recency     = completed on or after 2024-08-11
```

**0 records currently satisfy this — the pull has not landed.**

Until it does, this page cannot clear the bar and must stay `noindex`. It is not
blocked on a writer; it is blocked on the export.

## Requirement by requirement — and where each answer comes from

| The bar asks for | Where it comes from | Note |
|---|---|---|
| A unique H1 not reused across markets | **SATISFIED BY THE TEMPLATE** | h1 is a function of the market — see services.js. |
| The local phone number and address | **SATISFIED BY THE TEMPLATE** | utility bar, footer NAP and the market's LocalBusiness @id. |
| At least one piece of local proof | **THE JOB PULL** | jobs clearing the serviceProof bar for this market and service. |
| 300+ words written for that market | **THE JOB PULL + A PERSON** | the records give the specifics; someone has to write the sentences. |
| Unique FAQ answers | **PARTLY NOT IN THE PULL** | recurring questions come from the crews and the office, not from job rows. |
| Local building stock, storm season, permit process | **NOT IN THE PULL** | no CRM field holds this. GM or crew lead, per market. |

## Compliance

- Voice, banned words and approved claims: `design-systems/exteriors/voice-spec.json`, verbatim. Do not re-derive.
- Only three claims are always-true: licensed & insured · free, no-obligation inspections · 25-year workmanship warranty.
- No "guarantee" as an absolute promise. No superlatives. No "lifetime" warranty.
- Anything about pricing, financing, promotions, BBB or years in business is gated in `claims.js` and must not be written into this copy.

Every specific must trace to a record. A sentence that could have been written without
looking at a Coldstream job does not belong on this page.
