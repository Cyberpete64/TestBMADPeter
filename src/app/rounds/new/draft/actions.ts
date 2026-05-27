"use server";

import {
  clearActiveRoundDraft,
  getActiveRoundDraft,
  saveActiveRoundDraft,
} from "@/lib/round-draft-repository";
import type { RoundEntryDraft } from "@/lib/round-entry";

export async function getActiveRoundDraftAction() {
  try {
    return await getActiveRoundDraft();
  } catch {
    return null;
  }
}

export async function saveActiveRoundDraftAction(draft: RoundEntryDraft) {
  await saveActiveRoundDraft(draft);
}

export async function clearActiveRoundDraftAction() {
  await clearActiveRoundDraft();
}
