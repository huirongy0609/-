# AI Agent Rules

本文件定义未来 AI Agent 在本项目中的工作规则。

## 1. Workflow Rule

For any non-trivial change:

1. Read current files first.
2. Explain the plan.
3. Identify affected pages, data, and styles.
4. Only then implement.
5. Verify with build or focused checks.

Do not start by writing code.

## 2. Page Governance

All new pages must first produce information architecture:

- Page purpose
- Target user
- Primary entity
- Required data
- Empty state
- Navigation entry
- Whether filters belong in URL
- Whether the page belongs in MVP scope

No IA, no page.

## 3. Data Governance

- Do not create fake data unless the task explicitly asks for mock demo content.
- If mock data is needed, label it as mock.
- Do not hardcode counts that claim to be derived from real lists.
- Do not use Chinese display labels as durable enum values when adding new structured data.
- Do not use city names as relational keys for new domain structures.

## 4. Component Governance

- Do not duplicate components or visual patterns.
- Reuse existing primitives before creating new ones.
- If a component appears needed in two places, extract it intentionally.
- Do not create generic abstractions for one-off MVP needs.
- Keep component names aligned with domain language.

## 5. CSS Governance

- Do not casually modify `app/globals.css`.
- Any global CSS change must map to `DESIGN_SYSTEM.md`.
- Do not introduce saturated blue, neon, cyberpunk, heavy gradients, or heavy shadows.
- Do not create one-off card/button/filter styles when existing classes cover the use case.
- Keep cards at 8px radius unless the design system changes.

## 6. Dependency Governance

- Do not add dependencies without explaining why existing stack cannot solve the task.
- Prefer plain React, Next.js, TypeScript, CSS, and local JSON for MVP.
- Do not add state management libraries without a documented need.
- Do not add UI libraries that conflict with the current design language.

## 7. Engineering Scope

禁止 over engineering:

- No ORM unless database work is explicitly approved.
- No Prisma unless explicitly approved in a later phase.
- No authentication unless the product scope changes.
- No crawler or AI API unless the product scope changes.
- No generalized backend before domain and data contracts are stable.

## 8. Review Behavior

Before finalizing any change, check:

- Does this support the platform mission?
- Did it create duplicate logic?
- Did it mutate global styles unnecessarily?
- Did it add hidden mock data?
- Did it touch legacy video/content assets by accident?
- Does `npm run build` still pass when relevant?

## 9. Legacy Asset Rule

Do not edit these areas unless specifically asked:

- `remotion/`
- `video_build/`
- `video_review/`
- `.tmp/`
- `section1_hyperframes_style/`
- `hyperframes_trust_budget/`
- `lib/elevenlabs.ts`
- `lib/heygen.ts`
- `lib/renderVideo.ts`

## 10. Tone of Work

This product should feel like:

- national coordination
- governance expertise
- transparent public-interest infrastructure
- calm intelligence
- open contribution network

It should not feel like:

- property management admin panel
- generic SaaS dashboard
- course selling page
- cyber AI demo
- decorative landing page detached from real platform content
