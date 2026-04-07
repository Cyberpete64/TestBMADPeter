---
documentType: frontend-spec
project_name: TestBMADPeter
user_name: Hellgrenp
date: 2026-03-19
inputDocuments:
  - _bmad-output/planning-artifacts/product-brief-TestBMADPeter-2026-03-18.md
  - _bmad-output/planning-artifacts/architecture-draft-TestBMADPeter-2026-03-19.md
---

# Frontend Specification: Golf Round Tracker

## Purpose

This document defines how the frontend for Golf Round Tracker should be designed and built for the MVP. It translates the product brief and architecture draft into a page-level, component-level, and implementation-level specification for a mobile-first web application.

For this project, `frontend-spec-TestBMADPeter-2026-03-19.md` is the formal UX source of truth for the MVP.

## Product Experience Summary

The frontend should feel like a focused personal sports tracker, not an admin system. The user should be able to:

- open the app and immediately see useful progress data
- start a new round quickly
- enter strokes and putts with minimal friction
- move naturally from front nine to back nine
- finish with an immediate summary and hole-by-hole insight

The UI should prioritize speed, clarity, and confidence on iPhone-sized screens.

## Design Principles

### 1. Mobile First

The design target is a phone browser first, desktop second.

- Primary layout width should optimize for small screens.
- Important actions must remain easy to reach with one thumb.
- Dense desktop-style tables should be avoided on mobile.
- Navigation depth should stay shallow.

### 2. One Main Action Per Screen

Every page should have one obvious primary action.

- Dashboard: `New Round`
- Round setup: `Continue to Front 9`
- Front nine: `Continue to Back 9`
- Back nine: `Save Round`
- Round detail: `Edit Round`

### 3. Low-Friction Data Entry

Round entry must feel calm and repeatable.

- Keep field count visible but manageable.
- Group data by hole rather than giant grids.
- Show progress through the round flow.
- Preserve entered data during step navigation.

### 4. Insight Over Administration

The app exists to create useful feedback after each round.

- Dashboard should feel meaningful even with a small number of rounds.
- Round summary should reveal hole-level performance clearly.
- Key stats should be visible before historical browsing.

### 5. Deterministic Trust

The UI must reinforce that calculations are reliable.

- Clearly label what the user enters versus what the system calculates.
- Recompute and display totals consistently after save or edit.
- Show per-hole Stableford as derived output, not editable input.

## Information Architecture

### Primary Routes

- `/`
- `/rounds`
- `/rounds/new`
- `/rounds/[id]`
- `/rounds/[id]/edit`

### Route Responsibilities

- `/`: dashboard and quick entry point
- `/rounds`: historical round list
- `/rounds/new`: setup plus front-nine/back-nine round entry flow
- `/rounds/[id]`: saved round summary and details
- `/rounds/[id]/edit`: edit existing round using the same flow as new round entry

## Navigation Model

### Global Navigation

Keep navigation minimal for MVP.

Recommended top-level navigation:

- `Dashboard`
- `Rounds`
- `New Round`

### Mobile Navigation Pattern

Use a compact header plus a sticky bottom primary action area where relevant.

- Dashboard and round list can rely on header navigation.
- Form screens should emphasize the current step and primary action.

### Suggested Header Behavior

- App title or logo on the left
- Context action or back link on the right when appropriate
- Keep header height modest to preserve vertical space on phones

## Visual Direction

### Tone

The interface should feel:

- sporty
- clean
- calm
- practical

### Recommended Style Direction

- bright surfaces with strong contrast
- deep green or forest-inspired accent color
- restrained secondary palette
- rounded cards with clear elevation or border separation
- strong numeric emphasis for golf stats and totals

### Typography Guidance

- prioritize legibility over decorative expression
- use a clear sans-serif family
- make numerical values prominent
- keep labels short and scannable

### UI Density

- compact enough to feel efficient
- never cramped on mobile
- vertical rhythm should help the user scan hole cards quickly

## Page Specifications

## 1. Dashboard

### Purpose

Give the user an immediate overview of current progress and the fastest route into recording a new round.

### Core Content

- total rounds played
- average Stableford points
- handicap trend chart
- best round by lowest total score
- recent rounds preview
- primary CTA: `New Round`

### Layout

#### Mobile

- stacked card layout
- quick stats at top
- chart in a dedicated card
- best round and recent rounds below

#### Desktop

- two-column or three-column card grid
- chart can span full width or two columns
- recent rounds can sit in a side or lower section

### Key Components

- `DashboardHeader`
- `StatCard`
- `HandicapTrendCard`
- `BestRoundCard`
- `RecentRoundsList`
- `PrimaryActionBar`

### States

- empty state with encouragement to create first round
- loaded state
- error state if stats fail to load

### Empty State Copy Goal

The empty state should encourage action, not apologize.

Example tone:

"Start by logging your first round at `öfg.nu` and your stats dashboard will begin to build."

## 2. Round List

### Purpose

Provide a clean historical view of saved rounds and entry points into round detail and editing.

### Core Content

- chronological list of rounds
- each row/card shows:
  - played date
  - course name
  - tee
  - total score
  - Stableford total
  - entered handicap

### Layout

#### Mobile

- card list, one round per card
- summary values visible at a glance

#### Desktop

- can remain card based
- no need for a full dense data table in MVP

### Key Components

- `RoundsPageHeader`
- `RoundList`
- `RoundListCard`
- `EmptyRoundsState`

### Actions

- tap card to open round detail
- visible `New Round` action

## 3. New Round Setup

### Purpose

Capture the minimum metadata needed before hole-by-hole entry begins.

### Fields

- player name
- played date
- course selector
- tee selector
- entered handicap

### Rules

- course selector should only allow `öfg.nu` in MVP
- tee selector should only allow `red` and `yellow`
- handicap must be required
- the form must validate before the user can continue

### Layout

- single-column stacked form
- helper text only where it adds confidence
- CTA pinned or visually strong near the bottom

### Key Components

- `RoundSetupForm`
- `CourseSelect`
- `TeeSelect`
- `HandicapInput`
- `FormSectionCard`
- `StepProgress`

### Primary Action

- `Continue to Front 9`

## 4. Front Nine Entry

### Purpose

Let the user enter strokes and putts for holes 1-9 in a repeatable, low-friction format.

### Layout Pattern

Use **hole cards**, not a large spreadsheet.

Each card should show:

- hole number
- par
- stroke index
- strokes input
- putts input

Optional compact metadata:

- calculated received strokes

### Interaction Rules

- numeric keyboard should be triggered on mobile
- focus order must move smoothly hole to hole
- data should persist if the user navigates backward
- inline validation should stay lightweight

### Key Components

- `RoundEntryHeader`
- `HoleCard`
- `NumericStepperInput` or `NumericInput`
- `EntryProgressBar`
- `StickyActionBar`

### Primary Action

- `Continue to Back 9`

## 5. Back Nine Entry

### Purpose

Mirror the front-nine experience for holes 10-18 and complete the round.

### Content

Same card structure as the front nine.

### Additional UX Opportunity

Show a compact summary block before save:

- running total score
- running total putts

Do not show editable Stableford totals here if calculations only happen on save. If live calculation is added later, it should still remain read-only.

### Primary Action

- `Save Round`

## 6. Round Detail / Summary

### Purpose

Present the saved round as a useful performance summary and provide edit/delete actions.

### Core Content

- round metadata
  - player
  - date
  - course
  - tee
  - entered handicap
- total score
- total putts
- total Stableford points
- per-hole breakdown

### Per-Hole Breakdown Fields

- hole number
- par
- stroke index
- strokes
- putts
- received strokes
- Stableford points

### Layout

#### Mobile

- top summary cards for key totals
- hole-by-hole list below
- edit and delete actions placed safely

#### Desktop

- top summary can become a grid
- hole list can remain card or compact grid format

### Key Components

- `RoundSummaryHeader`
- `RoundTotalsCard`
- `RoundMetaCard`
- `HoleResultCard`
- `EditRoundButton`
- `DeleteRoundButton`
- `DeleteRoundDialog`

## 7. Edit Round

### Purpose

Allow correction of saved data while reusing the same round-entry mental model as new round creation.

### Recommended Pattern

Use the same screens and components as the create flow with prefilled values.

### Behavior

- setup values editable
- front/back nine values editable
- save action re-scores round
- user returns to updated round detail

### Primary Action

- `Save Changes`

## Component Inventory

### Shared UI Components

- `AppShell`
- `PageHeader`
- `SectionCard`
- `PrimaryButton`
- `SecondaryButton`
- `DangerButton`
- `EmptyState`
- `InlineError`
- `ConfirmDialog`

### Dashboard Components

- `StatCard`
- `TrendChart`
- `BestRoundCard`
- `RecentRoundsList`

### Round Flow Components

- `StepProgress`
- `RoundSetupForm`
- `RoundEntryStep`
- `HoleCard`
- `NumericInput`
- `StickyActionBar`
- `RoundSummary`

### Round Detail Components

- `RoundMetaCard`
- `RoundTotalsGrid`
- `HoleResultsList`

## Form and Input Behavior

### Numeric Inputs

For strokes and putts:

- use numeric input mode
- keep defaults empty, not zero
- prevent impossible negative values
- show validation only when helpful

### Validation Rules

- player name: required
- date: required
- course: required
- tee: required
- handicap: required
- strokes: required for each hole before save
- putts: required for each hole before save

### Error Handling

- inline errors for field-level issues
- top-of-step summary for submission failures
- keep user data intact when validation fails

## Mobile Interaction Rules

### Thumb Reach

- primary actions should sit near bottom of screen on long forms
- destructive actions should never be placed too close to primary save actions

### Scroll Behavior

- allow smooth vertical scrolling through hole cards
- keep header compact on long forms
- do not freeze too much chrome on small screens

### Keyboard Behavior

- avoid layouts that cause constant viewport jumping
- ensure sticky action bar does not hide focused inputs

## Responsive Rules

### Breakpoint Intent

- mobile: default experience
- tablet: more breathing room, same interaction model
- desktop: broader card layout, same navigation logic

### Desktop Adaptations

- dashboard cards can form a grid
- hole entry can remain stacked for consistency
- summary view can become denser

Do not redesign the interaction model for desktop in MVP. Consistency matters more than showing off screen space.

## Accessibility Requirements

- semantic labels for every input
- clear focus states for keyboard users
- minimum color contrast for chart lines, text, and actions
- no color-only communication of critical status
- touch targets sized appropriately for mobile
- dialogs must trap focus and be dismissible safely

## Frontend Data and Rendering Model

### Server-Rendered Screens

- dashboard
- round list
- round detail

### Client-Interactive Screens

- round setup
- front nine
- back nine
- edit flow

### Data Strategy

- server loads persisted data
- client handles temporary in-progress form state
- server remains source of truth for save operations and derived calculations

## Suggested Frontend File Structure

```text
src/
  app/
    page.tsx
    rounds/
      page.tsx
      new/
        page.tsx
      [id]/
        page.tsx
        edit/
          page.tsx
  components/
    app-shell/
    dashboard/
    rounds/
    ui/
  features/
    dashboard/
    rounds/
    scoring/
  lib/
    actions/
    validation/
    formatting/
```

## Build Approach in Next.js

### Recommended Split

- use **Server Components** for read-heavy pages
- use **Client Components** only for interactive form steps
- use **Server Actions** for create, update, and delete submissions
- use shared Zod schemas across client and server validation

### Why This Build Shape Works

- keeps data loading simple
- reduces API boilerplate
- keeps calculations trusted on the server
- makes the frontend easier to reason about in MVP

## Implementation Sequence

1. Build app shell, header, and navigation.
2. Build reusable UI primitives and card layout.
3. Build dashboard shell with placeholder content.
4. Build round setup form.
5. Build hole card and round-entry step components.
6. Build front-nine and back-nine flow.
7. Connect create-round save action.
8. Build round detail and summary components.
9. Build edit-round flow using shared components.
10. Build round list page.
11. Add empty, loading, and error states.
12. Add responsive polish and accessibility review.

## States to Design Explicitly

These states must be designed on purpose, not left accidental:

- first-use empty dashboard
- no rounds in history
- invalid round setup form
- invalid hole entry
- save in progress
- save failed
- delete confirmation
- deleted round success redirect

## Open Notes for Later Design Phases

- Chart style for handicap trend can be refined later, but data clarity matters more than visual flourish.
- If live Stableford preview is added during entry, it must remain clearly derived and read-only.
- If the app later becomes public, the frontend may need an access gate before reaching the main app shell.

## Final Recommendation

The frontend should be designed as a **wizard-style mobile golf tracker** built inside the same Next.js application as the backend. The user experience should center on a short path from dashboard to round setup to front nine to back nine to summary, with clean cards, clear progress, and confidence-building calculations throughout.
