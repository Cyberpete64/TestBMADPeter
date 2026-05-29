import assert from "node:assert/strict";
import test from "node:test";

import {
  calculatePlayingHandicap,
  getReceivedStrokes,
  getStablefordPoints,
} from "../src/lib/scoring.ts";

test("allocates extra handicap strokes to the hardest indexed holes first", () => {
  assert.equal(getReceivedStrokes(1, 20), 2);
  assert.equal(getReceivedStrokes(2, 20), 2);
  assert.equal(getReceivedStrokes(3, 20), 1);
  assert.equal(getReceivedStrokes(18, 20), 1);
});

test("returns base handicap strokes evenly when handicap is a multiple of 18", () => {
  assert.equal(getReceivedStrokes(1, 36), 2);
  assert.equal(getReceivedStrokes(9, 36), 2);
  assert.equal(getReceivedStrokes(18, 36), 2);
});

test("allocates plus handicap strokes back from the easiest indexed holes", () => {
  assert.equal(getReceivedStrokes(14, -4), 0);
  assert.equal(getReceivedStrokes(15, -4), -1);
  assert.equal(getReceivedStrokes(18, -4), -1);
});

test("calculates playing handicap from WHS tee rating values", () => {
  assert.equal(
    calculatePlayingHandicap(18.4, {
      courseRating: 73.6,
      slopeRating: 143,
      par: 73,
    }),
    24,
  );
  assert.equal(
    calculatePlayingHandicap(0, {
      courseRating: 68.6,
      slopeRating: 133,
      par: 73,
    }),
    -4,
  );
});

test("stableford points never drop below zero", () => {
  assert.equal(getStablefordPoints(4, 9, 0), 0);
});

test("stableford scoring rewards net birdie performance", () => {
  assert.equal(getStablefordPoints(4, 5, 1), 2);
  assert.equal(getStablefordPoints(4, 4, 1), 3);
  assert.equal(getStablefordPoints(4, 3, 1), 4);
});
