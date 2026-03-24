---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/frontend-spec-TestBMADPeter-2026-03-19.md
  - _bmad-output/planning-artifacts/architecture-draft-TestBMADPeter-2026-03-19.md
date: 2026-03-23
author: Hellgrenp
---

# TestBMADPeter - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Golf Round Tracker, decomposing the PRD, frontend specification, and architecture draft into implementable stories.

## Requirements Inventory

### Functional Requirements

- FR-1 to FR-5: preloaded course and tee-specific reference data
- FR-6 to FR-12: round setup and front-nine/back-nine entry flow
- FR-13 to FR-18: scoring and derived round calculations
- FR-19 to FR-27: round history, round detail, edit, and delete
- FR-28 to FR-32: dashboard and progress insights
- FR-33 to FR-35: mobile-friendly navigation and empty-state guidance

### NonFunctional Requirements

- NFR-1 to NFR-2: page and mutation responsiveness
- NFR-3 to NFR-5: transactional integrity and stable historical calculations
- NFR-6 to NFR-8: server-side validation, destructive action confirmation, protected hosting posture
- NFR-9 to NFR-11: accessibility and contrast expectations
- NFR-12 to NFR-13: mobile usability and discoverable primary actions
- NFR-14 to NFR-15: extensible data model and future-ready app structure

### Additional Requirements

- User-facing course name should use `Östersund-Frösö Golfklubb` or the short label `Öfg`
- Standard Stableford is the scoring model for MVP
- Entered handicap is the only handicap input used in MVP scoring
- Hole-level course snapshots must preserve historical scoring accuracy
- No authentication is part of the MVP product model

### UX Design Requirements

- Mobile-first card-based layout
- One obvious primary action per screen
- Front-nine and back-nine wizard flow
- Hole-card input pattern rather than large data tables
- Empty states that push the user toward `New Round`
- Round detail with per-hole results
- Accessible labels, focus states, and touch-friendly targets

### FR Coverage Map

- FR-1 to FR-18 -> Epic 1
- FR-19 to FR-27 -> Epic 2
- FR-28 to FR-32 -> Epic 3
- FR-33 to FR-35 -> Epic 4
- NFR-1 to NFR-5 -> Epics 1, 2, and 3
- NFR-6 to NFR-13 -> Epic 4 with implementation criteria applied across all epics
- NFR-14 to NFR-15 -> Epics 1 and 4

## Epic List

1. **Epic 1: Record and Score a Golf Round**
   User outcome: a golfer can create a complete 18-hole round for `Östersund-Frösö Golfklubb` and receive trusted scoring results.
   FR coverage: FR-1 to FR-18

2. **Epic 2: Review and Maintain Round History**
   User outcome: a golfer can browse, inspect, correct, and remove saved rounds without breaking data trust.
   FR coverage: FR-19 to FR-27

3. **Epic 3: Track Progress on the Dashboard**
   User outcome: a golfer can quickly understand current performance and progress before entering another round.
   FR coverage: FR-28 to FR-32

4. **Epic 4: Deliver a Trustworthy Mobile MVP**
   User outcome: the application feels usable, accessible, and safe enough to rely on as a daily personal tool.
   FR coverage: FR-33 to FR-35 plus cross-cutting NFRs

## Epic 1: Record and Score a Golf Round

Enable the core MVP value: start a round, enter hole-by-hole data, save it, and receive trusted round results.

### Story 1.1: Start a Valid Round

As a golfer,
I want to set up a round with the correct course, tee, date, player name, and handicap,
So that I can begin a valid score entry flow.

**Acceptance Criteria:**

**Given** the user opens the new round flow
**When** the setup form loads
**Then** the course selector shows `Östersund-Frösö Golfklubb` as the only selectable course
**And** the tee selector shows only `red` and `yellow`

**Given** the user is on the setup form
**When** required fields are incomplete or invalid
**Then** the primary continue action is blocked
**And** validation feedback identifies the missing or invalid fields

**Given** the user enters valid setup data
**When** the user selects `Continue to Front 9`
**Then** the application stores the setup state for the current round flow
**And** the user is taken to hole entry for holes 1 to 9

### Story 1.2: Enter Front Nine and Back Nine Data

As a golfer,
I want to enter strokes and putts hole by hole across front nine and back nine,
So that I can record a complete 18-hole round without friction.

**Acceptance Criteria:**

**Given** the user is on the front-nine step
**When** the step renders
**Then** each hole is presented as a mobile-friendly hole card
**And** each card shows hole number, par, stroke index, strokes input, and putts input

**Given** the user has entered front-nine values
**When** the user selects `Continue to Back 9`
**Then** the application preserves the front-nine data
**And** the back-nine step opens with the same card pattern for holes 10 to 18

**Given** the user navigates between steps in the round flow
**When** the user returns to a previous step
**Then** previously entered values remain available for review and editing

### Story 1.3: Save a Round with Trusted Scoring

As a golfer,
I want the application to calculate my round automatically when I save it,
So that I can trust the result without doing manual scoring work.

**Acceptance Criteria:**

**Given** the user submits a complete valid round
**When** the save action runs
**Then** the server validates the setup and hole data before persistence
**And** invalid payloads are rejected without losing user-entered form data

**Given** a valid round submission
**When** scoring is executed
**Then** the application calculates total score, total putts, received strokes per hole, Stableford points per hole, and total Stableford points
**And** derived Stableford values are stored as system-calculated values rather than user-editable values

**Given** the round is ready to persist
**When** the save transaction completes
**Then** the round and hole rows are stored atomically
**And** the saved round includes tee-specific course snapshots needed to preserve historical scoring stability

### Story 1.4: See the Round Summary Immediately After Save

As a golfer,
I want to see a round summary as soon as the round is saved,
So that I can review the outcome while it is still fresh.

**Acceptance Criteria:**

**Given** a round is saved successfully
**When** the user is redirected to the round detail page
**Then** the page shows player name, date, course, tee, and entered handicap
**And** the page shows total score, total putts, and total Stableford points

**Given** the round detail page is loaded
**When** the per-hole section renders
**Then** each hole displays par, stroke index, received strokes, strokes, putts, and Stableford points
**And** the summary is readable on an iPhone-sized screen

## Epic 2: Review and Maintain Round History

Enable the user to browse previous rounds, inspect them in detail, and keep historical data accurate over time.

### Story 2.1: Browse Saved Rounds

As a golfer,
I want to browse my saved rounds in one place,
So that I can quickly find and compare previous rounds.

**Acceptance Criteria:**

**Given** at least one round exists
**When** the user opens the rounds page
**Then** the page lists saved rounds in a scannable history view
**And** each round item shows date, course, tee, total score, Stableford total, and entered handicap

**Given** no rounds exist
**When** the user opens the rounds page
**Then** the page shows a clear empty state
**And** the empty state directs the user toward creating a new round

### Story 2.2: Open a Saved Round from History

As a golfer,
I want to open a saved round from my history,
So that I can inspect hole-by-hole results later.

**Acceptance Criteria:**

**Given** the user is on the rounds page
**When** the user selects a round item
**Then** the application opens the correct round detail page
**And** the page reflects the same summary structure shown after initial save

**Given** the round detail page is opened from history
**When** the page loads
**Then** all persisted round values are read from storage
**And** the displayed totals match the saved round data

### Story 2.3: Edit a Saved Round

As a golfer,
I want to edit a saved round,
So that I can correct mistakes without rebuilding the round from scratch.

**Acceptance Criteria:**

**Given** the user opens edit mode for a saved round
**When** the edit flow loads
**Then** the setup values and hole values are prefilled from the selected round
**And** the structure matches the create-round flow

**Given** the user changes valid values and saves
**When** the update action completes
**Then** the application recalculates all derived totals before persistence
**And** the user is returned to the updated round detail page

**Given** the user enters invalid data during edit
**When** the user attempts to save
**Then** the server rejects the invalid update
**And** the user keeps the editable form state needed to correct the issue

### Story 2.4: Delete a Saved Round Safely

As a golfer,
I want to delete a saved round with confirmation,
So that I can remove bad or unwanted data without accidental loss.

**Acceptance Criteria:**

**Given** the user is on a saved round detail page
**When** the user selects delete
**Then** the application shows an explicit confirmation dialog
**And** the round is not deleted until the user confirms

**Given** the user confirms deletion
**When** the delete action completes
**Then** the round and related hole data are removed transactionally
**And** the user is redirected to a valid post-delete screen

## Epic 3: Track Progress on the Dashboard

Turn saved round data into immediate personal insight so the user gains value even before starting the next round.

### Story 3.1: See a Useful Dashboard in Empty and Populated States

As a golfer,
I want the dashboard to feel useful whether or not I already have rounds saved,
So that the app always gives me a clear next step.

**Acceptance Criteria:**

**Given** no rounds exist
**When** the user lands on the dashboard
**Then** the dashboard shows a meaningful empty state
**And** the primary action encourages the user to create a first round

**Given** saved rounds exist
**When** the user lands on the dashboard
**Then** the dashboard shows the key stats area and recent context
**And** `New Round` remains the primary call to action

### Story 3.2: View Core Performance Stats

As a golfer,
I want to see my most important golf statistics at a glance,
So that I can quickly understand my current performance.

**Acceptance Criteria:**

**Given** saved rounds exist
**When** the dashboard renders
**Then** the dashboard shows total rounds played
**And** the dashboard shows average Stableford points

**Given** saved rounds exist
**When** the dashboard computes best round
**Then** best round is defined by lowest total score
**And** the displayed result is consistent with stored round totals

### Story 3.3: View Handicap Trend Over Time

As a golfer,
I want to see how my entered handicap changes over time,
So that I can spot progress or regression across rounds.

**Acceptance Criteria:**

**Given** at least two rounds with stored handicap values exist
**When** the dashboard renders the trend section
**Then** the application shows a chronological handicap trend visualization
**And** the chart uses the entered handicap values from persisted rounds

**Given** the round set changes through create, edit, or delete
**When** the dashboard is next loaded
**Then** the handicap trend reflects the current persisted round set
**And** stale trend data is not shown

### Story 3.4: Review Deeper Performance Insights

As a golfer,
I want the dashboard to surface deeper round and hole-level patterns,
So that I can understand where I score well and where I lose strokes.

**Acceptance Criteria:**

**Given** saved rounds exist
**When** the dashboard renders the insights section
**Then** the dashboard shows average putts per round
**And** the dashboard shows average putts per hole

**Given** saved rounds exist
**When** the dashboard computes hole-level performance patterns
**Then** the dashboard identifies a best scoring hole and a toughest hole using persisted round data
**And** the logic is derived from stored Stableford and score-to-par results rather than manual labels

**Given** saved rounds exist
**When** the hole insight grid renders
**Then** each hole displays average Stableford, average putts, and average score relative to par
**And** the data reflects the current persisted round set after create, edit, or delete actions

## Epic 4: Deliver a Trustworthy Mobile MVP

Ensure the product feels reliable, accessible, and safe enough to use as a real personal tool.

### Story 4.1: Use the App Comfortably on Mobile

As a golfer,
I want the app to feel natural on my phone,
So that I can use it immediately after a round without friction.

**Acceptance Criteria:**

**Given** the user visits the app on an iPhone-sized screen
**When** the main flows render
**Then** the layout is mobile-friendly without requiring large desktop tables
**And** each workflow screen has one clear primary action

**Given** the user is in a long form step
**When** the user scrolls through the page
**Then** the primary action remains easy to discover
**And** the UI does not rely on hover-only interactions

### Story 4.2: Receive Clear Validation and Accessible Feedback

As a golfer,
I want the app to explain problems clearly and remain accessible,
So that I can complete the flow confidently regardless of device or input method.

**Acceptance Criteria:**

**Given** the user interacts with forms
**When** validation errors occur
**Then** fields have programmatically associated labels and actionable feedback
**And** focus states remain visible for keyboard and assistive users

**Given** the user navigates the application
**When** dialogs, buttons, charts, and inputs are shown
**Then** interactive controls meet touch-target and contrast expectations
**And** destructive actions are visually distinct from primary save actions

### Story 4.3: Release the MVP with Operational Guardrails

As a product owner,
I want the MVP to launch with the right trust and safety guardrails,
So that the app is dependable even before larger platform features exist.

**Acceptance Criteria:**

**Given** create, edit, and delete flows exist
**When** the server handles write operations
**Then** all writes are validated server-side
**And** partial round updates cannot persist

**Given** the MVP has no product-level authentication
**When** the app is prepared for hosting outside a private environment
**Then** an operational access-control measure is defined before public exposure
**And** this requirement is tracked as part of release readiness

**Given** the MVP is prepared for release
**When** quality verification is performed
**Then** critical flows have automated coverage for scoring, save, edit, delete, and dashboard refresh behavior
**And** performance expectations for dashboard load and round save are validated against MVP targets
