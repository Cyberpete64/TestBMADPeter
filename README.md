# Öfg Round Tracker

Mobile-first web app for logging 18-hole golf rounds at Östersund-Frösö Golfklubb and reviewing personal performance over time.

## Current scope

- Supabase Auth login, sign-up, sign-out, and password reset flows
- User-scoped round storage in Supabase Postgres
- One supported course: Östersund-Frösö Golfklubb (`Öfg`)
- Red and yellow tees
- Full 18-hole rounds
- Hole-by-hole entry for strokes and putts
- Automatic Stableford scoring
- Live GPS distance to front, center, and back of green during round entry
- Round history with create, review, edit, and delete flows
- Dashboard with:
  - total rounds played
  - average Stableford points
  - latest registered handicap
  - best round by lowest total score
  - handicap trend
  - putt and hole-level performance insights
  - coaching cards comparing recent rounds with long-term averages

## Tech stack

- Next.js 16.2.1
- React 19.2.4
- TypeScript 5.9.3
- Supabase Auth and Postgres
- Zod for form validation
- Playwright for browser E2E coverage

## Getting started

1. Install dependencies:

```powershell
npm install
```

2. Create `.env.local` with the Supabase values used by the app:

```text
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

3. Start the development server:

```powershell
npm run dev
```

4. Open:

```text
http://localhost:3000
```

## Quality checks

Run the unit checks:

```powershell
npm run test
```

Run TypeScript validation:

```powershell
npm run typecheck
```

Run the production build:

```powershell
npm run build
```

Run the release guardrail:

```powershell
npm run check
```

`npm run check` runs unit checks, TypeScript validation, and a production build check. The script restores `tsconfig.json` and `next-env.d.ts` afterward because Next.js can mutate generated TypeScript references during build verification.

## E2E tests

The create-round E2E flow is in `test/e2e/create-round.spec.ts`. It logs in with an existing Supabase test user, creates a full 18-hole round, verifies the saved scorecard, and deletes the test round afterward.

Install the Chromium browser once:

```powershell
npm run test:e2e:install
```

Add local-only E2E credentials to `.env.local` or your shell:

```text
E2E_USER_EMAIL=your-test-user@example.com
E2E_USER_PASSWORD=your-test-password
```

Then run:

```powershell
npm run test:e2e
```

If `E2E_USER_EMAIL` or `E2E_USER_PASSWORD` is missing, the E2E test skips without starting the app server. Set `PLAYWRIGHT_BASE_URL` to run against an already running deployment or local server.

## Data storage

Saved rounds are stored in Supabase tables for the authenticated user. Round drafts are kept temporarily in browser session storage while the create-round flow is in progress. Live GPS position is used only in the browser while the user has the round page open and is not saved with the round.

## Known limits

- One course only
- Red and yellow tees only
- Full 18-hole rounds only
- No official handicap index recalculation yet
- No multi-player round entry yet
- GPS distance is straight-line distance only and depends on the device, browser permission, and current signal accuracy
- iPhone GPS in Safari/PWA requires a secure origin such as HTTPS for real device use

## Release candidate status

This repository is packaged as `0.1.0-rc.1`.
