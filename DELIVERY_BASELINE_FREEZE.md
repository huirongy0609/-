# Delivery Baseline Freeze

Freeze date: 2026-05-25

This project is now frozen at the current stable architecture baseline and should move into content/product delivery mode.

## Current Freeze Scope

The frozen baseline includes:

- Existing MVP routes:
  - `/`
  - `/map`
  - `/intelligence`
  - `/cases`
  - `/cases/[id]`
  - `/submit`
- Current server/client boundary:
  - server pages load repository data
  - client components receive serializable props
  - repositories remain server-only
- Current validated data modules:
  - Case
  - Intelligence
  - Region
  - Submission boundary only, not wired into the form
- Current UI and business flow:
  - no visual redesign
  - no route changes
  - no query param changes
  - no hook signature changes

## Verified Passing Items

The current baseline is accepted as stable because:

- `npm run build` has passed.
- Client chunks do not contain `zod`.
- Client chunks do not contain `safeParse`.
- Client chunks do not contain `INVALID_` validation markers.
- `/intelligence` baseline remains:
  - route size: `2.18 kB`
  - First Load JS: `89.5 kB`

## Explicitly No Longer Processing

Do not continue processing these areas during delivery mode:

- new entities
- new repositories
- new schemas
- new boundaries
- new abstractions
- Organization module
- GovernanceMethod module
- Expert module
- URL State migration
- Design System convergence
- Remotion/video cleanup
- database work
- API routes
- server actions
- global state management
- UI redesign

## Follow-On Prohibitions

During content/product delivery mode, do not:

- expand architecture
- create generic repositories
- introduce universal mappers
- add framework-style layers
- introduce client-side schema validation
- import repositories from client components
- rename fields globally
- perform global search-replace migrations
- change route structure
- change query params
- modify hook signatures
- delete legacy assets without a dedicated cleanup approval

## Allowed Small-Fix Scope

Small fixes are allowed only when they protect delivery stability:

- copy/content corrections
- broken link fixes
- obvious typo fixes
- build fixes
- type errors caused by existing code
- import boundary repair if a regression appears
- small data correction in existing mock JSON
- documentation clarification for delivery handoff

Any small fix must remain:

- local
- reversible
- build-verified
- visually non-disruptive unless explicitly requested

## When Next Architecture Evolution Is Allowed

Do not enter another architecture evolution phase unless all of the following are true:

- there is a specific scoped problem
- the current delivery milestone is not at risk
- the proposed change has a small blast radius
- rollback is clear
- bundle impact can be verified
- server/client boundary can remain isolated
- compatibility with current UI props is preserved

Architecture evolution should resume only by explicit instruction, not as a default continuation of delivery work.

## Delivery Mode Principle

The current stage is no longer about building architecture.

The project should now focus on delivering product/content value on top of the frozen baseline.
