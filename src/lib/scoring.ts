export function getReceivedStrokes(
  strokeIndex: number,
  handicapStrokes: number,
) {
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
