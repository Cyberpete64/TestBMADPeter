import type { PersistedHole, PersistedRound } from "@/lib/round-domain";
import { getHoleReferencesForDraft, type RoundEntryDraft } from "@/lib/round-entry";
import { getReceivedStrokes, getStablefordPoints } from "./scoring";

export function scoreRoundDraft(
  draft: RoundEntryDraft,
  roundId: string,
  createdAt: string,
): PersistedRound {
  const handicapStrokes = Math.floor(Number(draft.setup.enteredHandicap));
  const holeReferences = getHoleReferencesForDraft(draft);

  const holes: PersistedHole[] = holeReferences.map((holeReference) => {
    const entry = draft.holes.find(
      (hole) => hole.holeNumber === holeReference.holeNumber,
    );

    const strokes = Number(entry?.strokes ?? 0);
    const putts = Number(entry?.putts ?? 0);
    const receivedStrokes = getReceivedStrokes(
      holeReference.strokeIndex,
      handicapStrokes,
    );
    const stablefordPoints = getStablefordPoints(
      holeReference.par,
      strokes,
      receivedStrokes,
    );

    return {
      holeNumber: holeReference.holeNumber,
      par: holeReference.par,
      strokeIndex: holeReference.strokeIndex,
      strokes,
      putts,
      receivedStrokes,
      stablefordPoints,
    };
  });

  const totalScore = holes.reduce((sum, hole) => sum + hole.strokes, 0);
  const totalPutts = holes.reduce((sum, hole) => sum + hole.putts, 0);
  const totalStablefordPoints = holes.reduce(
    (sum, hole) => sum + hole.stablefordPoints,
    0,
  );

  return {
    id: roundId,
    playerName: draft.setup.playerName,
    playedOn: draft.setup.playedOn,
    courseSlug: draft.setup.courseSlug,
    courseLabel: draft.setup.courseLabel,
    courseShortLabel: draft.setup.courseShortLabel,
    teeCode: draft.setup.teeCode,
    teeLabel: draft.setup.teeLabel,
    enteredHandicap: Number(draft.setup.enteredHandicap),
    totalScore,
    totalPutts,
    totalStablefordPoints,
    createdAt,
    holes,
  };
}
