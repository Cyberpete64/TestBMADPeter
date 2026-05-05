"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";

import { normalizeDraftCourseMetadata } from "@/lib/round-drafts";
import {
  isRoundEntryDraftComplete,
  type RoundEntryDraft,
} from "@/lib/round-entry";
import { saveRound } from "@/lib/round-repository";
import { scoreRoundDraft } from "@/lib/score-round";

export async function saveRoundDraftAction(draft: RoundEntryDraft) {
  if (!isRoundEntryDraftComplete(draft)) {
    throw new Error("Rondutkastet är inte komplett.");
  }

  const now = new Date().toISOString();
  const roundId = randomUUID();
  const normalizedDraft = normalizeDraftCourseMetadata(draft);
  const scoredRound = scoreRoundDraft(normalizedDraft, roundId, now);

  await saveRound(scoredRound);
  revalidatePath("/");
  revalidatePath("/rounds");
  revalidatePath(`/rounds/${roundId}`);

  return { roundId };
}
