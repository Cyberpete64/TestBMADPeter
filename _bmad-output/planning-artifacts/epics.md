---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/frontend-spec-TestBMADPeter-2026-03-19.md
  - _bmad-output/planning-artifacts/architecture-draft-TestBMADPeter-2026-03-19.md
  - README.md
  - src/app/page.tsx
  - src/app/rounds/new/review/actions.ts
  - src/app/rounds/[id]/actions.ts
date: 2026-04-01
author: Hellgrenp
---

# TestBMADPeter - Epic Breakdown

## Overview

This document reflects the implemented MVP as of 2026-04-01. It syncs the original epic plan to the current Next.js application, including the four-step new-round flow, session-backed draft handling, local JSON persistence, dashboard insights, round edit/delete support, and the release checks that currently exist in the repository.

## Requirements Inventory

### Functional Requirements

- FR-1 to FR-5: preloaded course and tee-specific reference data for Ostersund-Froso Golfklubb
- FR-6 to FR-12: round setup plus front-nine, back-nine, and review-before-save flow
- FR-13 to FR-18: Stableford scoring, received strokes, and derived round totals
- FR-19 to FR-27: round history list, round detail, edit, and delete
- FR-28 to FR-32: overview dashboard, handicap trend, recent rounds, and hole-level insights
- FR-33 to FR-35: mobile-friendly navigation, sticky actions, and empty-state guidance

### NonFunctional Requirements

- NFR-1 to NFR-2: responsive page loads and save/update interactions using dynamic Next.js routes and server actions
- NFR-3 to NFR-5: complete rounds are persisted as full documents in `data/rounds.json`, with scoring recalculated from stored round data
- NFR-6 to NFR-8: explicit confirmation for destructive actions, no public-auth model in MVP, and release readiness based on private/local usage
- NFR-9 to NFR-11: labels, inline hints, live-region errors, and accessible chart descriptions
- NFR-12 to NFR-13: mobile-first card layout, sticky primary actions, and clear empty states
- NFR-14 to NFR-15: shared domain helpers keep tee logic, scoring logic, and dashboard calculations reusable for future expansion

### Additional Requirements

- User-facing course naming is normalized to the club display name and short label in the app
- Standard Stableford is the only scoring model in MVP
- Entered handicap is stored with each round and reused for scoring/trend display
- The create-round wizard stores setup and hole entries in `sessionStorage` until save completes
- Saved rounds live in `data/rounds.json`; there is no database, cloud sync, or authentication in MVP
- Only full 18-hole rounds are supported in the current product

### UX Design Requirements

- Mobile-first shell with top navigation for Overview, New Round, and Rounds
- Card-based setup, history, detail, and insight views instead of dense tables
- Four-step create-round flow with visible progress and sticky actions
- Dedicated review step before save with totals preview and per-hole preview
- Clear empty states that push the user toward `New Round`
- Inline field errors, form-level alerts, and destructive-action confirmation
- Accessible SVG handicap chart with title, description, and screen-reader summary

### FR Coverage Map

- FR-1 to FR-18 -> Epic 1
- FR-19 to FR-27 -> Epic 2
- FR-28 to FR-32 -> Epic 3
- FR-33 to FR-35 -> Epic 4
- NFR-1 to NFR-5 -> Epics 1, 2, and 3
- NFR-6 to NFR-13 -> Epic 4 with cross-cutting implementation criteria
- NFR-14 to NFR-15 -> Epics 1, 3, and 4

## Epic List

1. **Epic 1: Record and Score a Golf Round**
   User outcome: a golfer can complete a full 18-hole round in a guided four-step flow and receive automatic Stableford scoring.
   FR coverage: FR-1 to FR-18

2. **Epic 2: Review and Maintain Round History**
   User outcome: a golfer can browse saved rounds, inspect scorecards, correct mistakes, and remove unwanted rounds.
   FR coverage: FR-19 to FR-27

3. **Epic 3: Track Progress on the Dashboard**
   User outcome: a golfer can open the overview and immediately understand recent activity, trend movement, and hole-level performance patterns.
   FR coverage: FR-28 to FR-32

4. **Epic 4: Deliver a Trustworthy Mobile MVP**
   User outcome: the app feels coherent, understandable, and dependable as a private single-user MVP.
   FR coverage: FR-33 to FR-35 plus cross-cutting NFRs

## Epic 1: Record and Score a Golf Round

Enable the core MVP value: start a round, enter all 18 holes, review the draft, save it, and receive calculated scoring results.

### Story 1.1: Capture Round Setup and Start the Wizard

As a golfer,
I want to set up a round with the supported course, tee, date, player name, and handicap,
So that I can begin the score-entry flow with valid metadata.

**Acceptance Criteria:**

**Given** the user opens `/rounds/new`
**When** the setup form loads
**Then** the course selector is locked to the single supported course
**And** the tee selector offers only `yellow` and `red`
**And** the played-on date defaults to today

**Given** the user enters incomplete or invalid setup data
**When** the user tries to continue
**Then** the form shows inline field errors plus a form-level alert
**And** the primary action stays disabled until the setup is valid

**Given** the user enters valid setup data
**When** the user continues to the next step
**Then** the setup is stored in `sessionStorage`
**And** the user is routed to `/rounds/new/front-nine`

### Story 1.2: Enter Front Nine and Back Nine as Hole Cards

As a golfer,
I want to enter strokes and putts hole by hole across front nine and back nine,
So that I can record a full round in a mobile-friendly flow.

**Acceptance Criteria:**

**Given** the user is on the front-nine or back-nine step
**When** the page renders
**Then** each hole is shown as a card with hole number, par, stroke index, distance, strokes input, and putts input
**And** the page shows setup context such as player, course, date, and tee

**Given** the user types values for strokes or putts
**When** the draft updates
**Then** only numeric characters are retained
**And** the current draft is persisted in `sessionStorage`

**Given** the user leaves and returns to a previous wizard step
**When** the step reloads
**Then** previously entered values remain available
**And** the back/next actions preserve the same round draft

**Given** the setup step has not been completed
**When** the user opens a hole-entry route directly
**Then** the page shows an empty-state recovery message
**And** the user is sent back to the setup step instead of seeing a broken form

### Story 1.3: Review and Save a Fully Scored Round

As a golfer,
I want to review my draft before saving and then let the server calculate the result,
So that I can trust the saved scorecard.

**Acceptance Criteria:**

**Given** the user reaches `/rounds/new/review`
**When** the review page renders
**Then** the page shows setup details, total entered strokes, total entered putts, and a per-hole preview for all 18 holes

**Given** the round draft is incomplete
**When** the user tries to save
**Then** the save action is rejected
**And** the user sees an error explaining that all 18 holes must be completed first

**Given** the round draft is complete
**When** the save action runs
**Then** the server creates a new round id and scores the round from the draft
**And** each saved hole includes received strokes and Stableford points
**And** round totals for score, putts, and Stableford are derived automatically

**Given** the round is saved successfully
**When** persistence completes
**Then** the full round document is written to `data/rounds.json`
**And** the wizard draft is cleared from `sessionStorage`
**And** the user is redirected to the saved round detail page

### Story 1.4: Review the Saved Scorecard Immediately

As a golfer,
I want to see a full scorecard immediately after save,
So that I can confirm the recorded round while it is still fresh.

**Acceptance Criteria:**

**Given** a round has just been saved
**When** the detail page opens
**Then** the page shows total score, total putts, Stableford points, and entered handicap
**And** the page header shows player, course short label, played-on date, and tee

**Given** the detail page renders the hole summary
**When** the scorecard is displayed
**Then** each hole shows par, stroke index, strokes, putts, received strokes, and Stableford points
**And** the layout stays readable on a phone-sized screen

## Epic 2: Review and Maintain Round History

Enable the user to browse previous rounds, inspect them in detail, edit mistakes, and remove rounds that should no longer contribute to the dashboard.

### Story 2.1: Browse Saved Rounds from Newest to Oldest

As a golfer,
I want to browse my saved rounds in one place,
So that I can quickly find a previous scorecard.

**Acceptance Criteria:**

**Given** one or more rounds exist
**When** the user opens `/rounds`
**Then** the rounds are listed newest first
**And** each round card shows player, course short label, date, tee, score, Stableford, putts, and handicap

**Given** the user is on the history page
**When** actions are shown for a round
**Then** the card offers direct links to open the scorecard or edit the round

**Given** no rounds exist
**When** the history page loads
**Then** the page shows an empty state
**And** the empty state directs the user to start a new round or return to the overview

### Story 2.2: Open a Saved Round and Navigate from It

As a golfer,
I want to open a saved round from history or from the dashboard,
So that I can inspect the full scorecard later.

**Acceptance Criteria:**

**Given** the user selects a saved round
**When** the detail route opens
**Then** the application loads the round by id from the persisted store
**And** the displayed scorecard matches the saved round totals and hole values

**Given** the round detail page is visible
**When** the action row renders
**Then** the user can return to the overview, open edit mode, or start the delete flow

**Given** a round id does not exist
**When** the detail route is opened
**Then** the application returns the not-found experience instead of rendering an invalid scorecard

### Story 2.3: Edit a Saved Round in a Single Form

As a golfer,
I want to edit a saved round,
So that I can correct mistakes without creating a new round from scratch.

**Acceptance Criteria:**

**Given** the user opens `/rounds/[id]/edit`
**When** the edit form loads
**Then** player, date, tee, handicap, and all 18 hole values are prefilled from the saved round
**And** the course remains locked to the single MVP course

**Given** the user changes setup or hole values
**When** the user saves valid changes
**Then** the server rescoring flow recalculates received strokes, Stableford, and totals before persistence
**And** the user is redirected back to the updated round detail page

**Given** the user enters invalid setup or hole data during edit
**When** the user attempts to save
**Then** inline errors are shown for the affected fields
**And** the editable form state is preserved so the user can correct the round

### Story 2.4: Delete a Saved Round with Explicit Confirmation

As a golfer,
I want to delete a saved round only after a clear confirmation step,
So that I do not accidentally remove data I still need.

**Acceptance Criteria:**

**Given** the user is on a round detail page
**When** the user selects `Ta bort rond`
**Then** the UI opens an explicit confirmation panel
**And** the round is not deleted until the user confirms

**Given** the user confirms deletion
**When** the delete action completes successfully
**Then** the round is removed from `data/rounds.json`
**And** the user is redirected to the overview
**And** the round no longer contributes to history or dashboard calculations

**Given** deletion fails
**When** the server action throws
**Then** the user sees an error message instead of a silent failure

## Epic 3: Track Progress on the Dashboard

Turn saved round data into a useful overview that helps the golfer understand recent activity, trend movement, and hole-level performance before starting the next round.

### Story 3.1: Keep the Overview Useful in Empty and Populated States

As a golfer,
I want the overview to stay useful whether or not I already have rounds saved,
So that I always know the next best action.

**Acceptance Criteria:**

**Given** no rounds exist
**When** the user opens `/`
**Then** the overview shows a primary `Starta ny rond` action
**And** the dashboard sections show empty states for trend, insights, and recent-history guidance

**Given** one or more rounds exist
**When** the overview renders
**Then** the hero section offers actions to start a new round, open the latest round, and view all rounds
**And** the lower overview section shows recent saved rounds alongside the primary call to action

### Story 3.2: Surface Core Round Statistics at a Glance

As a golfer,
I want to see my key round statistics immediately,
So that I can understand where my current form stands.

**Acceptance Criteria:**

**Given** saved rounds exist
**When** the stats grid renders
**Then** it shows total rounds played, average Stableford points, latest handicap, and best round

**Given** best round is calculated
**When** the dashboard picks the result
**Then** the best round is defined as the lowest total score in the saved round set
**And** the displayed value stays consistent with persisted totals

**Given** recent rounds are shown on the overview
**When** the recent-round cards render
**Then** each card shows score, Stableford, putts, and handicap
**And** each card links to both the scorecard and edit flow

### Story 3.3: Visualize Handicap Trend Over Time

As a golfer,
I want to see how my recorded handicap changes over time,
So that I can spot whether my trend is moving in the right direction.

**Acceptance Criteria:**

**Given** at least one round exists
**When** the handicap trend section renders
**Then** the overview shows an SVG trend chart ordered chronologically by played date and creation time
**And** each point displays the saved handicap value for that round

**Given** the trend summary is visible
**When** the chart header renders
**Then** it shows the first handicap, latest handicap, and the overall change across the saved range

**Given** the chart is used with assistive technology
**When** accessibility metadata is read
**Then** the SVG exposes a title and description
**And** the page includes a screen-reader-only list of the plotted handicap points

### Story 3.4: Show Hole-Level Performance Insights

As a golfer,
I want the overview to highlight deeper performance patterns,
So that I can see where I gain or lose shots over time.

**Acceptance Criteria:**

**Given** no rounds exist
**When** the insights section renders
**Then** it shows an empty state instead of empty metrics

**Given** one or more rounds exist
**When** the insights section renders
**Then** it shows average putts per round, average putts per hole, strongest hole, and toughest hole

**Given** hole-level insight cards are displayed
**When** the per-hole metrics are calculated
**Then** each card shows sample count, average Stableford, average putts, and average score relative to par
**And** the metrics are derived from persisted hole data across all saved rounds

## Epic 4: Deliver a Trustworthy Mobile MVP

Ensure the MVP is coherent, understandable, and safe to use within its intended private single-user scope.

### Story 4.1: Present a Coherent Mobile-First Experience

As a golfer,
I want the app to feel natural on a phone,
So that I can use it comfortably after a round.

**Acceptance Criteria:**

**Given** the user moves through the app on a phone-sized screen
**When** the main routes render
**Then** the UI uses stacked cards, compact summaries, and action rows instead of desktop-style data tables

**Given** the user is in the create-round wizard
**When** the page shows progress
**Then** the flow exposes visible step progress from setup through review
**And** the primary action remains easy to reach through sticky action controls

**Given** the user navigates between key product areas
**When** the shell is visible
**Then** the header offers direct navigation to Overview, New Round, and Rounds
**And** the current app structure remains simple enough for a single-user MVP

### Story 4.2: Provide Clear Validation and Accessible Feedback

As a golfer,
I want the app to explain problems clearly and expose usable semantics,
So that I can complete tasks confidently across devices and assistive tools.

**Acceptance Criteria:**

**Given** the user interacts with setup, entry, or edit forms
**When** validation errors occur
**Then** fields expose labels plus `aria-invalid` and `aria-describedby` relationships
**And** the user receives inline error text and form-level alerts where needed

**Given** the user performs a destructive action
**When** delete confirmation appears
**Then** the destructive action is visually separated from secondary actions
**And** the user must explicitly confirm before data is removed

**Given** the overview renders the handicap trend chart
**When** the chart is announced to assistive technology
**Then** it includes an accessible title and description
**And** the trend data is also available in non-visual text form

### Story 4.3: Support the Local MVP with Honest Operational Guardrails

As a product owner,
I want the repository and runtime model to be explicit about the MVP's current limits,
So that release expectations match the implemented product.

**Acceptance Criteria:**

**Given** the current MVP persistence model
**When** rounds are saved, updated, or deleted
**Then** the app reads and writes `data/rounds.json`
**And** the product remains a single-user, no-auth, no-cloud-sync application

**Given** release checks are run
**When** `npm run check` executes
**Then** it runs unit tests, TypeScript validation, and a production build verification
**And** the script restores `tsconfig.json` after the build check completes

**Given** automated quality coverage is reviewed today
**When** the repository is inspected
**Then** automated tests cover scoring logic and dashboard-insight calculations
**And** create, edit, delete, and end-to-end route flows still require manual verification before broader release
