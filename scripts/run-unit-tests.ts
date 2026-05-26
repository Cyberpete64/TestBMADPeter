import assert from "node:assert/strict";

import { calculateDashboardInsights } from "../src/lib/dashboard-insights-core.ts";
import { getReceivedStrokes, getStablefordPoints } from "../src/lib/scoring.ts";

function runTest(name: string, assertion: () => void) {
  try {
    assertion();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

runTest(
  "allocates extra handicap strokes to the hardest indexed holes first",
  () => {
    assert.equal(getReceivedStrokes(1, 20), 2);
    assert.equal(getReceivedStrokes(2, 20), 2);
    assert.equal(getReceivedStrokes(3, 20), 1);
    assert.equal(getReceivedStrokes(18, 20), 1);
  },
);

runTest("returns base handicap strokes evenly for multiples of 18", () => {
  assert.equal(getReceivedStrokes(1, 36), 2);
  assert.equal(getReceivedStrokes(9, 36), 2);
  assert.equal(getReceivedStrokes(18, 36), 2);
});

runTest("stableford points never drop below zero", () => {
  assert.equal(getStablefordPoints(4, 9, 0), 0);
});

runTest("stableford scoring rewards stronger net scores", () => {
  assert.equal(getStablefordPoints(4, 5, 1), 2);
  assert.equal(getStablefordPoints(4, 4, 1), 3);
  assert.equal(getStablefordPoints(4, 3, 1), 4);
});

runTest(
  "dashboard insights calculate averages and identify best and toughest holes",
  () => {
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
  },
);

runTest("dashboard tie-breaks stableford using score relative to par", () => {
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

runTest("dashboard coaching compares recent rounds with overall trends", () => {
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

console.log("All automated checks passed.");
