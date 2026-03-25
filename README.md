# Öfg Round Tracker MVP

Mobile-first web app for logging full 18-hole golf rounds at Östersund-Frösö Golfklubb and reviewing personal stats over time.

## MVP scope

- Single-user app with no authentication
- One supported course: Östersund-Frösö Golfklubb (`Öfg`)
- Red and yellow tees
- Full 18-hole rounds only
- Hole-by-hole entry for strokes and putts
- Automatic Stableford scoring
- Dashboard with:
  - total rounds played
  - average Stableford points
  - handicap trend
  - best round by lowest total score
  - deeper hole-level performance insights
- Round history with create, review, edit, and delete flows

## Tech stack

- Next.js 16.2.1
- React 19.2.4
- TypeScript 5.9.3
- Local JSON persistence in `data/rounds.json`

## Getting started

1. Install dependencies:

```powershell
npm install
```

2. Start the development server:

```powershell
npm run dev
```

3. Open:

```text
http://localhost:3000
```

## Quality checks

Run the automated unit checks:

```powershell
npm run test
```

Run TypeScript checks:

```powershell
npm run typecheck
```

Run the release guardrail:

```powershell
npm run check
```

`npm run check` runs the unit checks, TypeScript validation, and a production build check. The script also restores `tsconfig.json` afterward because Next.js mutates it during build verification.

## Data storage

- Saved rounds live in `data/rounds.json`
- The app does not use authentication or a database yet
- Existing round data is normalized to the correct `Östersund-Frösö Golfklubb` / `Öfg` labels on read and write

## Known MVP limits

- Personal single-user MVP only
- No handicap calculation updates beyond storing the entered handicap for each round
- No 9-hole rounds
- No multi-course support yet
- No cloud sync or user accounts

## Release candidate status

This repository is packaged as `0.1.0-rc.1`.
