import assert from "node:assert/strict";
import test from "node:test";

import { getReceivedStrokes, getStablefordPoints } from "../src/lib/scoring.ts";

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

test("stableford points never drop below zero", () => {
  assert.equal(getStablefordPoints(4, 9, 0), 0);
});

test("stableford scoring rewards net birdie performance", () => {
  assert.equal(getStablefordPoints(4, 5, 1), 2);
  assert.equal(getStablefordPoints(4, 4, 1), 3);
  assert.equal(getStablefordPoints(4, 3, 1), 4);
});
