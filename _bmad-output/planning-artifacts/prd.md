---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
inputDocuments:
  - _bmad-output/planning-artifacts/product-brief-TestBMADPeter-2026-03-18.md
  - _bmad-output/planning-artifacts/architecture-draft-TestBMADPeter-2026-03-19.md
  - _bmad-output/planning-artifacts/frontend-spec-TestBMADPeter-2026-03-19.md
workflowType: prd
projectClassification: web-application
date: 2026-03-19
author: Hellgrenp
---

# Product Requirements Document - Golf Round Tracker

**Author:** Hellgrenp
**Date:** 2026-03-19

## Executive Summary

Golf Round Tracker is a mobile-first web application for recording full 18-hole golf rounds and turning them into useful personal statistics. Version 1 focuses on one golfer, one preloaded course, and one highly repeatable round-entry workflow rather than broad platform scope.

The MVP starts with the preloaded Swedish course `Östersund-Frösö Golfklubb` (`Öfg`) and supports the `red` and `yellow` tees. Users enter player name, date, handicap, strokes per hole, and putts per hole. The application supplies tee-specific par and stroke index data, calculates Standard Stableford points per hole and for the full round, and presents a dashboard with the key metrics the user cares about most.

The product is intentionally narrow. No authentication, no multi-user support, no 9-hole rounds, and no external course integrations are included in MVP. The goal is to deliver a personal golf companion that is fast to use on a phone, trustworthy in its calculations, and structured so more Swedish courses and richer statistics can be added later.

### What Makes This Special

- Focused on the exact workflow the target user wants, not a broad generic golf platform.
- Optimized for fast mobile round entry after a real round of golf.
- Uses preloaded tee-specific course data to produce consistent scoring.
- Makes post-round insight the center of the experience through dashboard statistics and per-hole summaries.

## Project Classification

- **Product type:** Web application
- **Primary platform:** Mobile web first, desktop web supported
- **Primary user model:** Single-user personal tool
- **Data model type:** Transactional record system with derived statistics
- **Core interaction pattern:** Wizard-style data entry plus dashboard review

## Success Criteria

### User Success

- Users can complete a full round entry without confusion on an iPhone-sized screen.
- Users receive hole-by-hole and round-level Stableford results immediately after saving.
- Users can review performance trends over time without manual calculation.
- Users can correct saved data through edit and delete flows without losing trust in the dashboard.

### Business Success

- The MVP proves that a focused golf round tracker creates repeat usage.
- The initial data model and UX allow the product to expand to more Swedish courses without redesigning the foundation.
- The web-first approach is validated before any native mobile investment.

### Technical Success

- Course reference data and scoring logic produce deterministic results.
- The application maintains historical accuracy after round edits and deletes.
- The system is simple enough to evolve without microservice-level complexity.

### Measurable Outcomes

- A user can create and save a valid 18-hole round end-to-end.
- Every saved round includes a calculated Stableford result for all 18 holes.
- Dashboard metrics update correctly after create, edit, and delete operations.
- Handicap trend reflects the handicap value entered for each round in chronological order.

## Product Scope

### MVP - Minimum Viable Product

- Mobile-friendly web application
- Single-user usage without authentication
- One preloaded course: `Östersund-Frösö Golfklubb` (`Öfg`)
- Tee support limited to `red` and `yellow`
- Full 18-hole rounds only
- Round setup with player, date, course, tee, and entered handicap
- Front-nine and back-nine round entry flow
- Strokes and putts entered per hole
- Tee-specific par and stroke index used in calculations
- Standard Stableford points calculated per hole and per round
- Dashboard showing:
  - total rounds played
  - average Stableford points
  - handicap trend
  - best round by lowest total score
- Saved round detail with per-hole summary
- Edit and delete round support

### Growth Features (Post-MVP)

- Additional Swedish golf courses
- More tee configurations
- Expanded performance analytics
- Progressive web app enhancements for phone usage
- Optional access gate or authentication for broader hosting scenarios

### Vision (Future)

- Broader Swedish course coverage
- Richer hole-by-hole trend analysis
- More advanced scoring and performance breakdowns
- Potential multi-user capability if the product expands beyond personal use

## User Journeys

### Journey 1: First-Time User Creates First Round

The user opens the app and lands on an empty dashboard. The interface makes it clear that the next step is to create a first round. The user selects `New Round`, fills in player name, date, course, tee, and handicap, then records strokes and putts for holes 1-9 and 10-18. After save, the user sees total score, total Stableford points, and hole-by-hole results.

**Outcome:** The user successfully records the first round and understands that the app calculates key results automatically.

### Journey 2: Returning User Checks Progress Before Entering a New Round

The user opens the dashboard and immediately sees total rounds played, average Stableford points, best round, and a handicap trend chart. The user gets a quick sense of current performance, then starts another round from the dashboard.

**Outcome:** The app provides value before any new data entry begins.

### Journey 3: User Reviews a Saved Round

After saving or selecting a prior round from history, the user opens the round detail view. The page shows round metadata, key totals, and per-hole results including par, stroke index, received strokes, strokes, putts, and Stableford points.

**Outcome:** The user can understand where the round went well or poorly without external calculations.

### Journey 4: User Corrects a Round

The user notices a mistake in a saved round and enters edit mode. The existing round data is prefilled in the same setup and front-nine/back-nine structure used for creation. The user updates values, saves, and returns to an updated round summary. If the user deletes the round, the app confirms the action before removal.

**Outcome:** The user can maintain accurate history without data loss surprises or inconsistent statistics.

### Journey Requirements Summary

- Every journey must be mobile-friendly.
- Every save flow must validate required data before persistence.
- Every read flow must present derived statistics clearly.
- Every edit or delete flow must update downstream dashboard data.

## Domain-Specific Requirements

This product is not in a regulated domain such as healthcare, fintech, or government. No industry compliance framework is required for MVP.

Domain-specific requirements still exist at the product level:

- Golf scoring must use the agreed Standard Stableford model for MVP.
- Tee-specific hole metadata must include par and stroke index.
- Historical rounds must preserve the score context used when they were saved.
- Handicap trend in MVP represents entered handicap values, not official handicap recalculation.

## Innovation & Novel Patterns

No breakthrough market innovation is required for this PRD. The product advantage comes from disciplined focus:

- narrow scope
- low-friction mobile entry
- trusted scoring automation
- immediate personal insight

The novelty is execution quality rather than a new category or AI-driven product pattern.

## Web Application Specific Requirements

### Project-Type Overview

The product is a server-backed web application with a mobile-first UI, read-heavy dashboard views, and form-heavy transactional round entry.

For this project, `frontend-spec-TestBMADPeter-2026-03-19.md` is the formal UX source of truth for the MVP and should be used as the primary reference for page behavior, interaction patterns, and UX decisions.

### Technical Architecture Considerations

- The product requires both read views and write flows.
- The frontend must support step-based form entry on mobile.
- Data reads and writes should stay close to the server to preserve trusted calculations.
- The UI must remain usable with a small number of top-level routes and shallow navigation.

### Implementation Considerations

- Server-render dashboard, rounds list, and round detail pages.
- Use interactive client-side form state for round setup and hole entry.
- Keep scoring rules server-side as the source of truth.

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

The MVP is intentionally optimized for one user, one preloaded course, and one core round workflow. The purpose is to validate usefulness and repeat usage without spending effort on broad platform concerns too early.

### MVP Feature Set (Phase 1)

- Dashboard
- Round list
- New round setup
- Front-nine entry
- Back-nine entry
- Round summary
- Edit round
- Delete round
- Stableford scoring engine
- Handicap trend from entered handicap values

### Post-MVP Features

- Multiple courses
- More advanced statistics
- Additional scoring views
- Hosting model improvements for broader usage

### Risk Mitigation Strategy

- Keep data model extensible from the start.
- Snapshot hole-level course metadata into saved rounds.
- Avoid global state complexity in the frontend.
- Treat no-auth deployment as an operational risk to be handled before public exposure.

## Functional Requirements

### Course Reference Data

**FR-1** Users can create rounds only against preloaded course reference data in MVP.

**FR-2** The application supports exactly one selectable course in MVP: `Östersund-Frösö Golfklubb` (`Öfg`).

**FR-3** The application supports exactly two selectable tees for that course in MVP: `red` and `yellow`.

**FR-4** The application stores hole reference data per tee for holes 1-18, including par and stroke index.

**FR-5** Saved rounds retain the hole reference data used at the time of save so historical scoring remains stable if course reference data changes later.

### Round Setup and Entry

**FR-6** Users can start a new round from the dashboard or rounds list.

**FR-7** Users can enter player name, played date, selected course, selected tee, and entered handicap before hole entry begins.

**FR-8** Users can only continue from round setup when all required setup fields are valid.

**FR-9** Users can enter strokes for each of the 18 holes in a front-nine and back-nine flow.

**FR-10** Users can enter putts for each of the 18 holes in the same front-nine and back-nine flow.

**FR-11** Users can navigate from front nine to back nine without losing previously entered values.

**FR-12** Users can save a round only when required data for all 18 holes is valid.

### Scoring and Derived Results

**FR-13** The application calculates total score from hole-by-hole strokes.

**FR-14** The application calculates total putts from hole-by-hole putts.

**FR-15** The application allocates received handicap strokes per hole from the entered handicap and stroke index values.

**FR-16** The application calculates Standard Stableford points for every hole.

**FR-17** The application calculates total Stableford points for the full round.

**FR-18** Users cannot edit derived Stableford values directly.

### Round History and Detail

**FR-19** Users can view a list of previously saved rounds.

**FR-20** The round list shows enough summary data to distinguish rounds at a glance, including date, course, tee, total score, Stableford total, and entered handicap.

**FR-21** Users can open a round detail page from the round list or after saving a round.

**FR-22** The round detail page shows round metadata, total score, total putts, total Stableford points, and a per-hole breakdown.

**FR-23** The per-hole breakdown shows hole number, par, stroke index, received strokes, strokes, putts, and Stableford points.

### Edit and Delete

**FR-24** Users can edit a previously saved round.

**FR-25** Edit mode reuses the same setup and front-nine/back-nine structure as round creation.

**FR-26** Saving an edited round recalculates all derived values before persistence.

**FR-27** Users can delete a saved round only after an explicit confirmation step.

### Dashboard and Statistics

**FR-28** The dashboard shows total rounds played.

**FR-29** The dashboard shows average Stableford points across saved rounds.

**FR-30** The dashboard shows a handicap trend using the handicap value entered for each round in chronological order.

**FR-31** The dashboard shows best round defined as the lowest total score.

**FR-32** Dashboard statistics reflect the current persisted round set after round creation, edit, or deletion.

### UX and Navigation

**FR-33** The application uses a mobile-friendly navigation model with a shallow route structure.

**FR-34** Every primary workflow screen has one clear primary action.

**FR-35** First-use and empty-data states guide the user toward creating a round rather than presenting a blank interface.

## Non-Functional Requirements

### Performance

**NFR-1** The dashboard should render its first meaningful content in under 2 seconds for typical persisted data volumes in MVP hosting conditions.

**NFR-2** Round save operations should complete and return feedback within 2 seconds for 95% of normal MVP usage conditions, excluding external network latency outside the application boundary.

### Reliability and Data Integrity

**NFR-3** Round creation, edit, and delete operations shall be transactional so partially updated round data cannot persist.

**NFR-4** Derived totals and dashboard statistics shall be recalculated from persisted data rather than manually maintained in the UI.

**NFR-5** Historical round calculations shall remain stable after course reference data changes through persisted round snapshots.

### Security

**NFR-6** All write operations shall be validated on the server before persistence.

**NFR-7** Destructive actions shall require explicit user confirmation.

**NFR-8** If the application is hosted outside a private environment, an operational access-control measure shall be put in place before public exposure.

### Accessibility

**NFR-9** The application shall support keyboard-accessible navigation and visible focus states across all interactive controls.

**NFR-10** Form fields shall have programmatically associated labels and actionable validation feedback.

**NFR-11** Text, controls, and chart visuals shall meet WCAG 2.1 AA contrast expectations where applicable.

### Usability

**NFR-12** The round-entry experience shall be usable on iPhone-sized screens without requiring desktop-only interaction patterns such as large tables or hover-only controls.

**NFR-13** Primary actions on long mobile forms shall remain easy to discover without excessive scrolling.

### Scalability and Extensibility

**NFR-14** The data model shall support addition of more courses and tees without redesign of the core round entities.

**NFR-15** The frontend and backend structure shall allow future addition of authentication and broader API exposure without rewriting the MVP domain model.

## Assumptions

- The MVP course display name is `Östersund-Frösö Golfklubb`, with `Öfg` as an acceptable short label.
- If implementation requires an internal ASCII slug or source reference, that may differ from the user-facing display name.
- Standard Stableford points are the required scoring model for MVP.
- Entered handicap is the only handicap input used for scoring in MVP.
- No official handicap recalculation engine is included in MVP.

## Open Questions

- Whether the deployed app will remain private or require an access gate before public hosting.
- Whether live Stableford preview during hole entry is desirable in MVP or deferred.
