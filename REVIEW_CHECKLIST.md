# Review Checklist

Use this checklist before every meaningful commit or delivery.

## Product Direction

- [ ] Does the change support national community governance collaboration?
- [ ] Does it avoid drifting into property management operations?
- [ ] Does it avoid drifting into course, certification, payment, or CRM features?
- [ ] Is the scope appropriate for the MVP or explicitly documented as future work?

## Architecture

- [ ] Does the change follow `DOMAIN_MODEL.md` terminology?
- [ ] Are entity names consistent?
- [ ] Are durable values separated from display labels?
- [ ] Are relationships not represented only by loose strings when a stable ID is needed?
- [ ] Did the change avoid Prisma, ORM, database code, or backend work unless explicitly approved?

## Dependencies

- [ ] Were any dependencies added?
- [ ] If yes, is the reason documented?
- [ ] Can the existing stack solve the same problem?
- [ ] Does the dependency conflict with MVP simplicity?

## Data Integrity

- [ ] Is any new mock data clearly mock?
- [ ] Is there any fake data presented as real?
- [ ] Are counts hardcoded when they appear derived?
- [ ] Are URLs, sources, dates, and statuses honest for demo use?
- [ ] Are tags not being used as the only source of business truth?

## Logic Reuse

- [ ] Is any filtering or mapping logic duplicated?
- [ ] Is similar UI behavior implemented twice in different ways?
- [ ] Could a pure helper function be used without over-abstracting?
- [ ] Are local states still local unless cross-page sharing is truly needed?

## State Management

- [ ] Does the change avoid unnecessary global state?
- [ ] Should filters be represented in the URL?
- [ ] Does the change remain compatible with future SSR?
- [ ] Does it avoid Redux, Zustand, and React Query unless explicitly approved?

## Design System

- [ ] Does the UI follow `DESIGN_SYSTEM.md`?
- [ ] Are colors within the gray-teal palette?
- [ ] Did the change avoid saturated tech blue, neon, cyberpunk, and heavy shadow?
- [ ] Are card radius, spacing, typography, and button hierarchy consistent?
- [ ] Are there new one-off CSS classes that duplicate existing patterns?

## Global Configuration

- [ ] Did the change modify `app/globals.css`?
- [ ] Did the change modify `next.config.mjs`, `tsconfig.json`, or package scripts?
- [ ] If yes, is the reason explicit and reviewed?
- [ ] Did the change secretly alter global behavior?

## Legacy Assets

- [ ] Did the change touch Remotion, video, audio, or render pipeline files?
- [ ] If yes, was that explicitly requested?
- [ ] Did the change accidentally rely on old video assets?
- [ ] Did it increase deployment or install burden because of unrelated assets?

## Accessibility and UX

- [ ] Are links and buttons semantically correct?
- [ ] Do filters and forms have clear labels or placeholders?
- [ ] Does the page have a clear empty state if data filters to nothing?
- [ ] Does responsive layout remain readable?

## Verification

- [ ] Was `npm run build` run when code changed?
- [ ] Were key routes manually checked when UI changed?
- [ ] Were form interactions checked if form behavior changed?
- [ ] Were warnings or limitations documented?

## Technical Debt

- [ ] Does this introduce future migration pain?
- [ ] Does it make domain modeling harder?
- [ ] Does it make design drift easier?
- [ ] Does it add complexity before the product needs it?
- [ ] If debt is intentional, is it recorded in `TODO.md` or an architecture note?
