# Future Evolution Guardrails

This document defines guardrails for future work. It is not a new architecture plan.

## 1. Hard Prohibitions

Do not introduce:

- mega abstraction
- generic repository
- universal mapper
- frameworkization
- plugin architecture
- premature DDD
- cross-domain shared kernel
- client-side schema validation
- `BaseRepository`
- `BaseEntity`
- service locator
- dependency injection container
- global schema registry
- platform layer
- monorepo-style shared kernel

## 2. Compatibility First

Every migration must preserve current UI behavior unless the task explicitly approves a visible change.

Rules:

- Keep UI compatibility props stable.
- Do not globally rename fields.
- Do not perform global search-replace migrations.
- Do not alter route paths as part of data cleanup.
- Do not change hook signatures unless the task specifically asks.
- Do not change query params without a dedicated URL State phase.

## 3. Small Blast Radius

Future changes must be local and reversible.

Allowed pattern:

```text
one module
one boundary
one build verification
one rollback path
```

Forbidden pattern:

```text
multiple modules
shared framework
global rename
UI rewrite
state rewrite
dependency rewrite
```

## 4. Rollbackability

Every change must include:

- changed files
- why
- risk level
- migration impact
- rollback method
- build verification

Rollback should be possible by reverting a small set of files, not by reconstructing behavior manually.

## 5. Runtime Isolation

Server-only code must stay server-only.

Rules:

- Repositories must include `import 'server-only';`.
- Client components must not import repositories.
- zod must only run in server graph.
- Client components receive serializable props.
- Client filtering may continue locally for MVP views.

Any client bundle containing zod is a regression.

## 6. Bundle Verification

For any change touching data loading, domain modules, repositories, or client components:

- Run `npm run build`.
- Check route size changes.
- Verify client chunks do not contain zod or schema validation markers.
- Explain any First Load JS increase above 10 kB.

Current target baseline:

- `/intelligence` should remain near `89.5 kB` First Load JS.
- Shared First Load JS should remain near `87.3 kB`.

## 7. Repository Evolution

Repositories remain module-local.

Allowed:

- A module-specific repository.
- A module-specific schema.
- A module-specific mapper.
- A module-specific compatibility view.

Forbidden:

- Generic repository.
- Cross-repository orchestration.
- Repository inheritance.
- Repository registry.
- Repository factory.

## 8. Mapper Evolution

Mappers remain explicit and local.

Allowed:

- `toCaseView`
- `toIntelligenceView`
- `toCityRegionView`
- `toSubmissionView`

Forbidden:

- universal mapper
- reflection-based mapping
- field rename registry
- shared transformation framework
- magical adapter layer

## 9. Domain Evolution

Domain work must reduce existing entropy, not create speculative structure.

Allowed:

- Validate existing data shape.
- Clarify one module at a time.
- Preserve compatibility views.
- Add server/client boundary only when leakage exists.

Forbidden:

- Building future-only domain layers.
- Adding entities that current product does not use.
- Expanding into Organization, GovernanceMethod, or Expert without a scoped task.
- Turning docs into code prematurely.

## 10. State Evolution

Do not touch state management during unrelated work.

Allowed later, under a dedicated task:

- URL State for list filters.
- Server page reading search params.
- Client component receiving initial filter props.

Forbidden during normal module cleanup:

- Redux.
- Zustand.
- React Query.
- global store.
- hook API changes.
- query param changes.

## 11. Design Evolution

Do not redesign during architecture work.

Allowed later, under a dedicated Design System convergence task:

- token cleanup.
- primitive extraction.
- variant alignment.
- spacing and typography consistency.

Forbidden during data or boundary work:

- visual redesign.
- global CSS rewrites.
- new style language.
- high-saturation colors.
- heavy animation.

## 12. Legacy Asset Evolution

Do not delete legacy assets without a cleanup batch plan.

Required before deletion:

- dependency tracing.
- usage verification.
- risk grade.
- cleanup batch.
- rollback path.

Legacy areas remain out of normal product work:

- `remotion/`
- `video_build/`
- `video_review/`
- `.tmp/`
- `section1_hyperframes_style/`
- `hyperframes_trust_budget/`
- old audio/video/render pipeline files.

## 13. Stop Conditions

Stop and report instead of continuing if:

- a change requires touching more than one module boundary.
- a client component needs to import a repository.
- zod appears in a client chunk.
- a field rename would affect multiple pages.
- a cleanup requires deleting legacy assets.
- a migration cannot be rolled back by reverting a small file set.
