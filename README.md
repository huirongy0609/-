# TrustPM AI

TrustPM AI is an evidence-based AI agent for property governance. It helps property managers and communities turn difficult operational questions into a transparent decision brief containing an assessment, recommendations, an implementation path, risk notes, and visible evidence sources.

## Current Status

**Submission Ready: NO**

The only remaining release-candidate item is to configure the server-side `OPENAI_API_KEY` in Vercel, redeploy, and verify a successful production response with `mode: "openai"`.

## The problem

Property governance decisions cross contracts, budgets, service standards, shared assets, regulations, and community relationships. A generic chatbot can produce fluent advice, but it may not show which professional knowledge supports the answer or where the limits are.

## The solution

TrustPM AI follows a Knowledge First flow:

```text
Question → controlled retrieval → evidence set → OpenAI reasoning → structured governance brief
```

The hackathon MVP intentionally focuses on one reliable closed loop. It includes three clickable scenarios:

1. Improve property fee collection without increasing conflict.
2. Handle a forecast annual budget overrun.
3. Make shared-area public revenue transparent and accountable.

## Honest demo boundary

- The default mode uses a small, controlled local retriever and curated answer packs so the demo remains stable without an API key.
- Published JD sources link to Foundation knowledge pages.
- Prototype GT and CASE items are labelled `DEMO-ONLY OBJECT` and are not represented as approved Foundation objects or verified public cases.
- With `OPENAI_API_KEY`, the server calls the OpenAI Responses API. The model may reorganize the selected evidence into the defined answer structure, but it is instructed not to add sources or legal citations.
- If the OpenAI request fails, the route returns the stable controlled answer and discloses the fallback.
- The product is decision support, not legal advice.

## Technology

- Next.js 14 App Router
- React 18 and TypeScript
- Tailwind CSS and the existing platform design system
- Existing Knowledge Foundation JD objects
- Local, explainable keyword retrieval for the hackathon MVP
- OpenAI Responses API with `gpt-5.6` by default
- Vercel-compatible server route and environment variables

The implementation uses the Responses API directly through `fetch`, so the MVP adds no SDK dependency.

## Run locally

Requirements: Node.js 18+ and npm.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

The demo works without any secret. To enable OpenAI mode, add:

```text
OPENAI_API_KEY=your_server_side_key
OPENAI_MODEL=gpt-5.6
```

Never expose the API key through a `NEXT_PUBLIC_` variable or commit `.env.local`.

## Validate

```bash
npx tsc --noEmit --pretty false
npm run trustpm:test
npm run beta:test
npm run build
```

## Deploy to Vercel

1. Import this repository into Vercel.
2. Keep the framework preset as Next.js.
3. Add `NEXT_PUBLIC_SITE_URL` with the production URL.
4. Optionally add `OPENAI_API_KEY` and `OPENAI_MODEL` as server environment variables.
5. Deploy. Without an API key, the production site remains fully demonstrable in controlled mode.

Current production deployment: [trustpm-ai.vercel.app](https://trustpm-ai.vercel.app)

The production environment currently runs in controlled demo mode. Add the server-side `OPENAI_API_KEY` and `OPENAI_MODEL` variables, redeploy, and verify that the result badge reads `OpenAI + controlled retrieval` before claiming a successful OpenAI-powered run.

## Main paths

- `/` — TrustPM AI landing page and interactive agent demo
- `/api/trustpm` — controlled retrieval and optional OpenAI enhancement
- `/knowledge/[id]` — published Foundation evidence pages
- `lib/trustpm/demo-data.ts` — explicit demo scenarios, retrieval keywords, and evidence boundary

## Current limitations

- Retrieval is keyword-based, not production RAG or vector search.
- The corpus is deliberately small and supports three demonstration scenarios.
- Legal and regulatory sources are not yet connected to a jurisdiction-aware registry.
- Generated output has not yet been evaluated with a production expert-review dataset.
- There is no authentication, persistence, organization workspace, or feedback loop in this MVP.

## Roadmap

1. Connect the complete approved JD, GT, LAW, and CASE registries.
2. Add hybrid retrieval, source-level permissions, and citation verification.
3. Build expert evaluations for groundedness, governance usefulness, and risk detection.
4. Add jurisdiction-aware compliance checks and human approval workflows.
5. Support multiple specialist agents for budgets, contracts, service quality, and community decisions.

## Devpost submission checklist

- Deployment URL: https://trustpm-ai.vercel.app
- GitHub repository: https://github.com/huirongy0609/-
- Hackathon branch: `agent/trustpm-ai-hackathon`
- Draft PR: https://github.com/huirongy0609/-/pull/8
- Demo flow: homepage → choose a scenario → run agent → review assessment, steps, risks, and sources
- Screenshots: hero, question input, structured answer, evidence cards, mobile view
- Built with: Next.js, React, TypeScript, Tailwind CSS, OpenAI Responses API, Knowledge Foundation
- Recommended video flow: problem (20s) → Knowledge First approach (20s) → live scenario (70s) → evidence disclosure and roadmap (30s)

### Release-candidate verification

- Production build: passed locally and on Vercel.
- Online smoke test: homepage and all three controlled scenarios returned HTTP 200.
- Scenario routing: `fee-collection`, `budget-variance`, and `public-revenue` returned the expected evidence packs.
- OpenAI online mode: not yet verified because the Vercel project does not currently have `OPENAI_API_KEY` configured.
- Honest fallback: verified; production returns `mode: "demo"` and discloses Controlled Demo Mode.
