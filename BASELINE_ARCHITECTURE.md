# Baseline Architecture

Freeze date: 2026-05-25

This document records the current stable architecture baseline. It is a snapshot, not a new architecture proposal.

## 1. Current Stable Boundary

Current runtime product surface:

- `app/page.tsx`
- `app/map/page.tsx`
- `app/intelligence/page.tsx`
- `app/intelligence/IntelligenceExplorer.tsx`
- `app/cases/page.tsx`
- `app/cases/CasesExplorer.tsx`
- `app/cases/[id]/page.tsx`
- `app/submit/page.tsx`
- `components/CityNetworkMap.tsx`
- `lib/domain/*`
- `lib/repositories/*`
- `data/*.json`

Current data boundary:

- Server pages may import repositories.
- Repositories validate mock JSON data using zod.
- Client components receive serializable props or local static category data.
- UI compatibility view types remain in place so existing JSX does not need field renames.

Current repository boundary:

- `lib/repositories/cases.ts`
- `lib/repositories/intelligence.ts`
- `lib/repositories/regions.ts`
- `lib/repositories/submissions.ts`

Each repository is module-specific. There is no generic repository and no shared mapper framework.

## 2. Server-Only Rules

Repositories must remain server-only.

Current server-only repository files:

- `lib/repositories/cases.ts`
- `lib/repositories/intelligence.ts`
- `lib/repositories/regions.ts`
- `lib/repositories/submissions.ts`

Rule:

- Repository files must start with `import 'server-only';`.
- Client components must not import repositories.
- Runtime schema validation must remain server-side.
- zod must not enter the client graph.

Current verification:

- `npm run build` passes.
- Client static chunks do not contain `zod`, `safeParse`, or `INVALID_` validation markers.
- `/intelligence` no longer includes the previous zod chunk.

## 3. Repository Usage Rules

Allowed:

- Server pages import repositories for data loading.
- Repositories import raw JSON data and their own domain module.
- Repositories return UI-compatible view data when a page needs legacy props.
- Repositories may expose entity-returning functions only when useful for server-side work.

Forbidden:

- Client components importing repositories.
- Repositories importing from `app/` or `components/`.
- Repositories importing other repositories.
- Repositories performing UI formatting beyond compatibility mapping.
- Repositories creating cross-domain orchestration.

Current repository dependency snapshot:

```text
app/page.tsx
  -> cases repository
  -> intelligence repository
  -> regions repository

app/map/page.tsx
  -> regions repository

app/intelligence/page.tsx
  -> intelligence repository
  -> IntelligenceExplorer client component

app/cases/page.tsx
  -> cases repository
  -> CasesExplorer client component

app/cases/[id]/page.tsx
  -> cases repository

app/submit/page.tsx
  -> no repository
```

## 4. Entity to UI Compatibility Rules

Current pattern:

```text
Legacy DTO -> Entity -> View -> UI props
```

This pattern exists only to keep current UI stable while introducing runtime validation.

Rules:

- UI must continue to consume compatible view props unless a specific migration step is approved.
- Do not globally rename UI fields.
- Do not force entity field names into JSX.
- Entity-layer semantic names may differ from UI compatibility props.
- Compatibility views are allowed to preserve legacy fields such as `city`, `model`, `status`, `x`, and `y`.

Known current compatibility views:

- `CaseView`
- `IntelligenceView`
- `CityRegionView`
- `SubmissionView`

## 5. Runtime Graph Forbidden Items

Forbidden in client runtime graph:

- `zod`
- repository modules
- `server-only`
- raw repository validation errors
- direct JSON validation logic
- domain schema objects

Allowed in client runtime graph:

- React client components.
- local UI state.
- memoized filtering.
- serializable props from server pages.
- static category JSON where currently used by UI.

Known type-only exception:

- `app/cases/CasesExplorer.tsx` imports `CaseView` as a type. This is type-only and does not affect runtime, but should be watched.

## 6. Bundle Hygiene Rules

Build baseline from latest verification:

```text
/                                    1.2 kB   First Load JS 97.1 kB
/cases                               2 kB     First Load JS 97.9 kB
/cases/[id]                          175 B    First Load JS 96.1 kB
/intelligence                        2.18 kB  First Load JS 89.5 kB
/map                                 1.19 kB  First Load JS 97.1 kB
/submit                              1.5 kB   First Load JS 88.8 kB
Shared First Load JS                          87.3 kB
```

Hygiene rules:

- Any new client chunk carrying zod is a regression.
- Any page-level First Load JS increase above 10 kB requires explanation.
- Server-side validation must not create client bundle growth.
- Route-level client components should only contain UI interaction logic.

## 7. Allowed Import Direction

Allowed direction:

```text
app server page -> repository -> domain -> zod
app server page -> client component
client component -> UI-only data/types
component -> serializable props
repository -> data/*.json
repository -> domain module
domain module -> zod
```

Allowed examples:

- `app/intelligence/page.tsx` imports `getIntelligenceViews`.
- `app/intelligence/page.tsx` passes props into `IntelligenceExplorer`.
- `lib/repositories/intelligence.ts` imports `data/intelligence.json`.
- `lib/repositories/intelligence.ts` imports `lib/domain/intelligence`.

## 8. Forbidden Dependency Direction

Forbidden direction:

```text
client component -> repository
client component -> domain schema
client component -> zod
repository -> repository
repository -> app
repository -> components
domain -> repository
domain -> app
domain -> components
data -> code
```

Forbidden examples:

- `app/intelligence/IntelligenceExplorer.tsx` importing `getIntelligenceViews`.
- `components/CityNetworkMap.tsx` importing `getCityRegionViews`.
- `lib/domain/case.ts` importing any repository.
- A repository importing another repository to compose data.

## 9. Current Known Technical Debt

- Legacy video/render assets remain in the repository:
  - `remotion/`
  - `video_build/`
  - `video_review/`
  - `.tmp/`
  - old `lib/elevenlabs.ts`, `lib/heygen.ts`, `lib/renderVideo.ts`, `lib/scriptGenerator.ts`
- Remotion dependencies remain in `package.json`.
- `stats.json` is still demo data and not derived from validated repositories.
- Category JSON is still imported by client pages.
- `Submission` boundary exists but is not wired into the submit page.
- Some compatibility view types are exported from domain modules.
- The app still uses local JSON as source data.

## 10. Explicitly Not In Scope

Do not handle during this freeze:

- Organization module.
- GovernanceMethod module.
- Expert module.
- URL State migration.
- Design System convergence.
- Remotion cleanup.
- Database work.
- API routes.
- Server actions.
- Authentication.
- Global state management.
- Generic repository abstraction.
- Universal mapper abstraction.
- New pages.
- UI redesign.
