import assert from "node:assert/strict";
import test from "node:test";

import { calculateDashboardInsights } from "../src/lib/dashboard-insights-core.ts";

test("calculates dashboard averages and identifies best and toughest holes", () => {
  const insights = calculateDashboardInsights([
    {
      totalPutts: 4,
      holes: [
        {
          holeNumber: 1,
          par: 5,
          putts: 2,
          stablefordPoints: 3,
          strokes: 5,
        },
        {
          holeNumber: 2,
          par: 4,
          putts: 2,
          stablefordPoints: 1,
          strokes: 5,
        },
      ],
    },
    {
      totalPutts: 4,
      holes: [
        {
          holeNumber: 1,
          par: 5,
          putts: 1,
          stablefordPoints: 4,
          strokes: 4,
        },
        {
          holeNumber: 2,
          par: 4,
          putts: 3,
          stablefordPoints: 0,
          strokes: 6,
        },
      ],
    },
  ]);

  assert.equal(insights.averagePuttsPerRound, 4);
  assert.equal(insights.averagePuttsPerHole, 2);
  assert.equal(insights.bestHole?.holeNumber, 1);
  assert.equal(insights.toughestHole?.holeNumber, 2);
  assert.equal(insights.holeInsights[0]?.averageStableford, 3.5);
  assert.equal(insights.holeInsights[1]?.averageRelativeToPar, 1.5);
});

test("breaks stableford ties with score relative to par", () => {
  const insights = calculateDashboardInsights([
    {
      totalPutts: 4,
      holes: [
        {
          holeNumber: 7,
          par: 3,
          putts: 2,
          stablefordPoints: 2,
          strokes: 3,
        },
        {
          holeNumber: 8,
          par: 5,
          putts: 2,
          stablefordPoints: 2,
          strokes: 4,
        },
      ],
    },
  ]);

  assert.equal(insights.bestHole?.holeNumber, 8);
  assert.equal(insights.toughestHole?.holeNumber, 7);
});

test("builds coaching insights from recent performance", () => {
  const insights = calculateDashboardInsights([
    {
      playedOn: "2026-05-01",
      totalPutts: 38,
      holes: [
        {
          holeNumber: 1,
          par: 4,
          putts: 2,
          stablefordPoints: 1,
          strokes: 6,
        },
      ],
    },
    {
      playedOn: "2026-05-08",
      totalPutts: 30,
      holes: [
        {
          holeNumber: 1,
          par: 4,
          putts: 1,
          stablefordPoints: 4,
          strokes: 3,
        },
      ],
    },
  ]);

  assert.equal(insights.averageStablefordPerRound, 2.5);
  assert.equal(insights.recentRoundCount, 2);
  assert.equal(insights.coachingInsights.length, 4);
  assert.equal(insights.coachingInsights[0]?.title, "Senaste 2 mot totalen");
  assert.equal(insights.coachingInsights[2]?.value, "#1");
});
