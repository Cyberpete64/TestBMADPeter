---
workflowType: architecture-draft
project_name: TestBMADPeter
user_name: Hellgrenp
date: 2026-03-19
inputDocuments:
  - _bmad-output/planning-artifacts/product-brief-TestBMADPeter-2026-03-18.md
---

# Architecture Draft: Golf Round Tracker

## Executive Summary

The recommended MVP architecture is a **modular monolith**: one full-stack web application, one relational database, one deployable unit, and clear internal module boundaries. This is the simplest architecture that still gives us strong data integrity, room for future growth, and a good mobile web experience for iPhone-sized screens.

For the first version, the system should be built as a **server-first web app** with a small number of interactive client components. Round entry, editing, scoring, statistics, and course reference data can all live in one codebase without introducing API gateway or microservice complexity.

## Architecture Goals

- Keep the MVP boring, stable, and easy to change.
- Optimize for fast mobile web usage after a golf round.
- Preserve strong scoring consistency and data integrity.
- Make it easy to add more Swedish courses later.
- Leave a clean path for future authentication and mobile expansion.

## Recommended Technical Direction

### Application Shape

- **Architecture style:** Modular monolith
- **Primary domain:** Full-stack web application
- **Rendering model:** Server-first with selective client interactivity
- **Deployment model:** Single web application plus managed relational database

### Recommended Stack

- **Frontend + backend framework:** Next.js App Router
- **UI runtime:** React
- **Language:** TypeScript
- **Server runtime:** Node.js LTS
- **Database:** PostgreSQL
- **ORM / schema management:** Prisma ORM
- **Validation:** Zod
- **Styling:** Tailwind CSS
- **Testing:** Vitest for unit/integration tests, Playwright for end-to-end flows

### Why This Stack Fits

- Next.js gives us one codebase for UI, server logic, and future route handlers.
- React is well suited for the round-entry flow and dashboard interactivity.
- PostgreSQL gives us durable relational modeling for rounds, holes, tees, and future expansion.
- Prisma keeps the schema and migrations explicit and consistent.
- Zod provides one validation layer across forms, server actions, and route handlers.

## High-Level System Design

### Deployable Units

1. **Web application**
   - Serves the dashboard, round entry, round detail, and edit flows
   - Executes server-side scoring, persistence, and stats aggregation
2. **Relational database**
   - Stores course reference data, rounds, hole-level results, and derived metadata

### External Dependencies

- No external course API in MVP
- No authentication provider in MVP
- No object storage required in MVP

## Proposed Module Boundaries

### 1. Course Catalog Module

Responsible for preloaded reference data:

- courses
- tees
- holes
- par per hole
- stroke index per hole

This module should be seed-driven in MVP so `öfg.nu` can be added once and trusted by the rest of the system.

### 2. Round Management Module

Responsible for:

- create round
- load round
- update round
- delete round
- list rounds

This is the transactional core of the app.

### 3. Scoring Engine Module

Responsible for:

- total score calculation
- Stableford points per hole
- Stableford total for round
- allocation of handicap strokes per hole

This logic should be centralized and pure, not scattered across UI components.

### 4. Statistics Module

Responsible for dashboard and historical summaries:

- total rounds played
- average Stableford points
- handicap trend
- best round by lowest total score

### 5. Presentation Module

Responsible for:

- dashboard UI
- round setup UI
- front nine entry UI
- back nine entry UI
- round summary UI

## Data Model Proposal

### Core Tables

#### `courses`

- `id`
- `slug`
- `name`
- `source_reference`
- `is_active`

#### `course_tees`

- `id`
- `course_id`
- `tee_code` (`red`, `yellow`)
- `display_name`

#### `course_holes`

- `id`
- `course_tee_id`
- `hole_number` (1-18)
- `par`
- `stroke_index`

Store holes per tee, not just per course. That keeps the model correct if tees differ now or later.

#### `rounds`

- `id`
- `player_name`
- `played_on`
- `course_id`
- `course_tee_id`
- `entered_handicap`
- `total_score`
- `total_putts`
- `total_stableford_points`
- `created_at`
- `updated_at`

#### `round_holes`

- `id`
- `round_id`
- `hole_number`
- `strokes`
- `putts`
- `par_snapshot`
- `stroke_index_snapshot`
- `received_strokes`
- `stableford_points`

Use hole snapshots at save time so historical rounds remain stable even if course reference data changes later.

## Stableford and Handicap Rules for MVP

### Recommended Rule

For MVP, treat the **entered handicap as the handicap used for point allocation**. Do not attempt official handicap recalculation or advanced Swedish golf integrations yet.

### Hole Stroke Allocation

Suggested algorithm:

1. Give each hole `floor(entered_handicap / 18)` received strokes.
2. Distribute the remainder to the hardest holes based on stroke index.
3. Calculate net strokes on each hole.
4. Compute Standard Stableford points from net score relative to par.

This rule is simple, deterministic, and aligned with the agreed MVP assumption.

### Important Note

If you later need official playing handicap conversion by tee or federation-specific rules, that should become a separate architecture decision and likely a separate scoring policy layer.

## Request and Interaction Flow

### Dashboard Flow

1. Server loads aggregate statistics from `rounds`.
2. Server prepares chart data for handicap trend.
3. Client renders dashboard cards and chart.

### New Round Flow

1. User opens new round screen.
2. Server provides preloaded course and tee options.
3. User completes round setup.
4. User enters front nine data.
5. User enters back nine data.
6. Server validates payload.
7. Scoring engine computes totals and per-hole Stableford.
8. Server persists round and round holes in a transaction.
9. User is redirected to round summary.

### Edit Round Flow

1. User loads an existing round.
2. Existing values hydrate the round form.
3. User changes metadata or hole values.
4. Server re-validates and re-scores the round.
5. Round and related hole rows are updated transactionally.
6. Dashboard stats naturally reflect the updated persisted values.

### Delete Round Flow

1. User confirms deletion.
2. Server deletes round hole rows, then round row, in one transaction.
3. Dashboard aggregates update automatically on next load.

## API and Application Layer Design

### Preferred Pattern

- Use **Server Components** for data reads where possible.
- Use **Server Actions** for create, update, and delete flows in MVP.
- Add **Route Handlers** only where an explicit HTTP API is needed later.

### Why

- Fewer moving parts than building a separate REST API from day one.
- Strong alignment between UI and domain logic.
- Easier validation and transaction handling on the server.
- Clear future path if a dedicated mobile client or public API is later required.

### Validation Strategy

- Validate form input on the client for fast feedback.
- Re-validate all payloads on the server with shared Zod schemas.
- Keep scoring rules server-side as the source of truth.

## Frontend Architecture

### Rendering Strategy

- Dashboard: server-rendered with selective client chart interactivity
- Round setup: client-enhanced form
- Front/back nine entry: client components with wizard-style navigation
- Round summary: server-rendered with small interactive affordances only if needed

### State Strategy

Keep state local to the round flow. Do not introduce a global state library for MVP.

Use:

- route state and URL params for navigation
- local form state for round entry
- server as the source of truth for persistence and derived statistics

### UI Organization

Suggested route structure:

- `/`
- `/rounds`
- `/rounds/new`
- `/rounds/[id]`
- `/rounds/[id]/edit`

Suggested component groupings:

- `dashboard`
- `round-setup`
- `round-entry`
- `round-summary`
- `shared/ui`

## Security and Risk Notes

### Biggest Architectural Risk

The product currently has **no authentication**, but it is designed as a data-entry application with edit and delete operations. If deployed publicly without protection, anyone with access to the app could change or delete data.

### MVP Recommendation

One of these should be true in practice:

- the app is deployed privately or behind network-level protection, or
- a lightweight access gate is added before public exposure

This does not need to become full user authentication in the product model, but it does need an operational safety decision before public hosting.

### Additional Security Practices

- Server-side validation on every write
- Parameterized database access through ORM
- CSRF-safe mutation patterns through framework defaults and same-site policies
- Destructive action confirmation for round deletion

## Infrastructure and Deployment

### Recommended MVP Infrastructure

- One Next.js deployment target
- One managed PostgreSQL database
- Environment variables for database URL and app configuration
- Seed script for `öfg.nu` course, red tee, yellow tee, and hole metadata

### Operational Needs

- migration command
- seed command
- test command
- preview/staging environment if possible
- automated backups on the database provider

## Testing Strategy

### Unit Tests

Focus on pure logic:

- Stableford scoring
- handicap stroke allocation
- total score and total putts
- dashboard aggregation utilities

### Integration Tests

Focus on:

- round creation transaction
- round edit recalculation
- round delete behavior
- seeded course lookup

### End-to-End Tests

Focus on:

- create full round
- edit round
- delete round
- dashboard updates

## Suggested Directory Shape

```text
src/
  app/
    page.tsx
    rounds/
      page.tsx
      new/page.tsx
      [id]/page.tsx
      [id]/edit/page.tsx
  features/
    courses/
    rounds/
    scoring/
    stats/
  lib/
    db/
    validation/
    utils/
  components/
    ui/
    dashboard/
    rounds/
prisma/
  schema.prisma
  seeds/
tests/
  unit/
  integration/
  e2e/
```

## Deferred Decisions

These do not need to block MVP implementation:

- native mobile app strategy
- public API design
- multi-user support
- advanced analytics
- official handicap rule engine
- additional course ingestion automation

## Architecture Recommendation Summary

Winston's recommendation is straightforward:

- Build a modular monolith, not microservices.
- Use one full-stack web codebase.
- Keep writes server-side and scoring centralized.
- Use PostgreSQL with explicit course and round modeling.
- Treat `öfg.nu` as seeded reference data for MVP.
- Keep the app authentication-free only if the deployment is also practically private.

This gives us a calm, scalable starting point without paying complexity tax too early.
