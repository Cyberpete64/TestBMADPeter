"use server";

import type { RoundEntryDraft } from "@/lib/round-entry";
import { normalizeDraftCourseMetadata } from "@/lib/round-drafts";
import { isRoundEntryDraftComplete } from "@/lib/round-entry";
import {
  deleteRound,
  getRoundById,
  updateRound,
} from "@/lib/round-repository";
import { scoreRoundDraft } from "@/lib/score-round";

export async function updateRoundDraftAction(
  roundId: string,
  draft: RoundEntryDraft,
) {
  if (!isRoundEntryDraftComplete(draft)) {
    throw new Error("Rondutkastet är inte komplett.");
  }

  const existingRound = await getRoundById(roundId);

  if (!existingRound) {
    throw new Error("Ronden hittades inte.");
  }

  const normalizedDraft = normalizeDraftCourseMetadata(draft);
  const rescoredRound = scoreRoundDraft(
    normalizedDraft,
    roundId,
    existingRound.createdAt,
  );

  await updateRound(rescoredRound);

  return { roundId };
}

export async function deleteRoundAction(roundId: string) {
  await deleteRound(roundId);
  return { success: true };
}
