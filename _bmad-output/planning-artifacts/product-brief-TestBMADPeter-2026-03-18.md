---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments:
  - _bmad-output/brainstorming/brainstorming-session-2026-03-17-155853.md
date: 2026-03-18
author: Hellgrenp
---

# Product Brief: Golf Round Tracker

## Executive Summary

Golf Round Tracker is a mobile-friendly web application for registering golf rounds played on Swedish golf courses and turning those rounds into useful personal statistics. The MVP starts with one preloaded course, `öfg.nu`, and supports the `red` and `yellow` tees for full 18-hole rounds.

The product is designed for fast round entry and clear personal insight. Users enter their round details, hole-by-hole strokes, and putts, while the system provides tee-specific par and stroke index data and automatically calculates Standard Stableford points per hole and for the full round.

The first release is intentionally narrow: a single-user app without authentication, one preloaded course, and a dashboard focused on the most valuable stats. This creates a clean path to validate the product before expanding to more Swedish courses and broader device usage, including future iPhone-oriented usage through the web.

---

## Core Vision

### Problem Statement

Golfers who want to track their rounds and measure personal progress often end up using generic notes, spreadsheets, or apps that do not reflect their preferred workflow, local courses, or the exact statistics they care about. This makes it harder to consistently register rounds and review meaningful performance trends over time.

### Problem Impact

- Round history becomes fragmented or incomplete.
- Per-hole analysis is tedious to calculate manually.
- Stableford scoring requires extra effort or separate tools.
- Handicap development is hard to visualize consistently over time.
- Course-specific context such as tee, par, and stroke index is not always captured in a reliable way.

### Why Existing Solutions Fall Short

- They may feel too broad when the real need is a focused personal round tracker.
- They may not be optimized for the specific statistics the user cares about.
- They may add unnecessary friction such as authentication, broad feature sets, or complicated navigation.
- They may not start from the specific Swedish course context the user wants to use first.

### Proposed Solution

Build a focused web app that allows a golfer to register a full 18-hole round on a preloaded Swedish course, using a mobile-friendly flow that starts with round setup and then captures front nine and back nine scoring. The app stores the entered handicap for each round, automatically calculates Standard Stableford points per hole and per round, and presents a dashboard with the most important personal performance indicators.

### Key Differentiators

- Built around the user's exact workflow rather than a generic golf platform.
- Starts with a real Swedish course and tee-specific setup.
- Keeps the MVP intentionally lightweight: single-user, no authentication, narrow scope.
- Emphasizes insight after the round, not just round storage.
- Uses entered handicap snapshots to show a simple and useful handicap trend over time.

## Target Users

### Primary Users

**Primary user:** A golfer who wants to log personal rounds, review performance trends, and understand results hole by hole without administrative overhead.

**Example persona:**
`Peter` is a regular golfer who plays full rounds and wants an easy way to record results immediately after a game. He cares about total score, Stableford points, putting data, and whether his handicap trend is moving in the right direction. He wants a quick mobile-friendly workflow and a simple dashboard that shows progress over time.

**Goals**

- Save a completed round quickly and accurately.
- See score and Stableford results without manual calculation.
- Review historical progress across multiple rounds.
- Track how entered handicap values change over time.

**Pain points**

- Manual round tracking is cumbersome.
- Existing tools can feel too heavy or not aligned with his preferred statistics.
- It is annoying to calculate Stableford and per-hole performance manually.

### Secondary Users

None in MVP. Version 1 is a simple single-user product without authentication or multi-user account support.

### User Journey

1. The user opens the app on a phone or desktop browser.
2. The dashboard shows key performance stats and access to saved rounds.
3. The user starts a new round and selects the preloaded course `öfg.nu`.
4. The user selects tee color (`red` or `yellow`), enters date and handicap, and begins round entry.
5. The user records strokes and putts for the front nine, then the back nine.
6. The app calculates total score and Stableford points per hole and for the round.
7. The user reviews the saved round summary with per-hole results.
8. Over time, the dashboard shows total rounds played, average Stableford points, best round, and handicap trend.

## Success Metrics

### User Success

- Users can register a full 18-hole round in a fast, mobile-friendly flow.
- Every saved round produces automatic Stableford scoring per hole and for the full round.
- Users can immediately understand key progress signals from the dashboard.
- Users can edit or delete incorrect rounds without breaking the usefulness of their statistics.

### Business Objectives

- Validate that a focused golf-round tracker creates enough value to support repeated use.
- Establish a clean product foundation that can later expand to more Swedish courses and broader mobile usage.
- Confirm that a web-first approach is sufficient for early adoption before investing in a dedicated mobile app.

### Key Performance Indicators

- Number of rounds logged over time.
- Percentage of started rounds that are completed and saved.
- Average Stableford points across saved rounds.
- Visibility of handicap trend based on entered handicap snapshots.
- Accuracy of derived stats after create, edit, and delete operations.

## MVP Scope

### Core Features

- Mobile-friendly web app.
- Single-user experience without authentication.
- Preloaded course selection limited to `öfg.nu`.
- Tee selection limited to `red` and `yellow`.
- Full 18-hole rounds only.
- Round setup with player, date, course, tee, and handicap.
- Hole-by-hole entry for strokes and putts.
- Entry flow split into front nine and back nine.
- Tee-specific par and stroke index data for each hole.
- Automatic Standard Stableford points per hole and total for the round.
- Dashboard with:
  - total rounds played
  - average Stableford points
  - handicap trend chart
  - best round by lowest total score
- Create, view, edit, and delete saved rounds.
- Round summary with per-hole Stableford points.

### Out of Scope for MVP

- Authentication and user accounts.
- Multi-user support.
- Free-text course entry.
- Support for courses other than `öfg.nu`.
- Tee colors other than `red` and `yellow`.
- 9-hole rounds.
- Automatic handicap calculation based on official rules.
- Native iPhone app.
- External integrations with Swedish golf systems or course providers.

### MVP Success Criteria

- The app supports complete and accurate registration of a full round at `öfg.nu`.
- The app automatically calculates per-hole and total Stableford points from entered round data and stored course data.
- The dashboard gives the user a useful at-a-glance summary after a few saved rounds.
- Edit and delete operations update round history and derived statistics correctly.

### Future Vision

- Add more Swedish golf courses.
- Expand course setup and tee support.
- Improve trend analysis and per-hole statistics over time.
- Introduce broader personal performance analytics.
- Optimize the experience further for iPhone and potential progressive web app behavior.
- Add authentication and multi-user support if the product expands beyond personal use.

## Detailed MVP Requirements

### Functional Requirements

1. The system shall provide a responsive web interface usable on desktop and mobile browsers.
2. The system shall allow selection of only one preloaded golf course in MVP: `öfg.nu`.
3. The system shall support only the `red` and `yellow` tees for the preloaded course.
4. The system shall store tee-specific hole metadata including hole number, par, and stroke index.
5. The system shall support only full 18-hole rounds in MVP.
6. The system shall allow creation of a round with player name, date, selected course, selected tee, and entered handicap.
7. The system shall allow the user to enter strokes per hole for holes 1-18.
8. The system shall allow the user to enter putts per hole for holes 1-18.
9. The system shall present round entry in two stages: front nine and back nine.
10. The system shall calculate total score from hole-by-hole strokes.
11. The system shall calculate Standard Stableford points per hole using the entered handicap and tee-specific hole data.
12. The system shall calculate total Stableford points for the full round.
13. The system shall save each round with the handicap value entered for that round as a historical snapshot.
14. The system shall display a dashboard showing total rounds played.
15. The system shall display a dashboard showing average Stableford points.
16. The system shall display a dashboard showing a handicap trend chart based on stored handicap snapshots by round date.
17. The system shall display a dashboard showing best round defined as the lowest total score.
18. The system shall allow users to view saved round details.
19. The system shall show round summary data including per-hole strokes, putts, par, and Stableford points.
20. The system shall allow users to edit saved rounds.
21. The system shall allow users to delete saved rounds with confirmation.
22. The system shall recalculate dashboard statistics and round-derived values after round edits and deletions.

### Non-Functional Requirements

- The app should feel efficient and easy to use on an iPhone-sized screen through the browser.
- The scoring and statistics calculations should be deterministic and consistent.
- The data model should be extensible so more Swedish courses can be added later without redesigning the core entities.
- The UI should prioritize clarity and low-friction round entry over feature density.

## Assumptions and Notes

- Stableford in MVP means Standard Stableford points.
- Handicap trend in MVP reflects the handicap value entered for each round, not an official handicap recalculation engine.
- Course support for `öfg.nu` is assumed to be seeded into the app rather than fetched dynamically in MVP.
- If exact Swedish playing handicap rules or tee-specific handicap conversion rules are needed later, that should be treated as a future enhancement and clarified in a subsequent PRD.
