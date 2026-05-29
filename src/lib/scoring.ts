import type { TeeRating } from "@/lib/golf-course-data";

export function calculatePlayingHandicap(
  handicapIndex: number,
  teeRating: TeeRating,
) {
  return Math.round(
    handicapIndex * (teeRating.slopeRating / 113) +
      (teeRating.courseRating - teeRating.par),
  );
}

export function getReceivedStrokes(
  strokeIndex: number,
  handicapStrokes: number,
) {
  if (handicapStrokes < 0) {
    const strokesGiven = Math.abs(handicapStrokes);
    const baseStrokesGiven = Math.floor(strokesGiven / 18);
    const extraStrokesGiven = strokesGiven % 18;
    const receivedStrokes =
      baseStrokesGiven + (strokeIndex > 18 - extraStrokesGiven ? 1 : 0);

    return receivedStrokes === 0 ? 0 : -receivedStrokes;
  }

  const baseStrokes = Math.floor(handicapStrokes / 18);
  const extraStrokes = handicapStrokes % 18;

  if (extraStrokes === 0) {
    return baseStrokes;
  }

  return strokeIndex <= extraStrokes ? baseStrokes + 1 : baseStrokes;
}

export function getStablefordPoints(
  par: number,
  strokes: number,
  receivedStrokes: number,
) {
  const points = 2 + par - (strokes - receivedStrokes);
  return Math.max(0, points);
}
