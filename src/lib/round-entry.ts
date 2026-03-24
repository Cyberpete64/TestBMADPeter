import {
  getHoleReferencesForTee,
  type HoleReference,
  type TeeCode,
} from "@/lib/golf-course-data";
import type { RoundSetup } from "@/lib/round-setup";

export type HoleEntry = {
  holeNumber: number;
  strokes: string;
  putts: string;
};

export type RoundEntryDraft = {
  setup: RoundSetup;
  holes: HoleEntry[];
};

const STORAGE_KEY = "golf-round-tracker/round-entry";

export function createInitialHoleEntries(teeCode: TeeCode): HoleEntry[] {
  return getHoleReferencesForTee(teeCode).map((hole) => ({
    holeNumber: hole.holeNumber,
    strokes: "",
    putts: "",
  }));
}

export function createRoundEntryDraft(setup: RoundSetup): RoundEntryDraft {
  return {
    setup,
    holes: createInitialHoleEntries(setup.teeCode),
  };
}

export function persistRoundEntryDraft(draft: RoundEntryDraft) {
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

export function clearRoundEntryDraft() {
  window.sessionStorage.removeItem(STORAGE_KEY);
}

export function readRoundEntryDraft(): RoundEntryDraft | null {
  const rawValue = window.sessionStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as RoundEntryDraft;
  } catch {
    return null;
  }
}

export function ensureRoundEntryDraft(setup: RoundSetup): RoundEntryDraft {
  const existing = readRoundEntryDraft();

  if (
    existing &&
    existing.setup.courseSlug === setup.courseSlug &&
    existing.setup.playedOn === setup.playedOn &&
    existing.setup.playerName === setup.playerName
  ) {
    return existing;
  }

  const nextDraft = createRoundEntryDraft(setup);
  persistRoundEntryDraft(nextDraft);
  return nextDraft;
}

export function isRoundEntryDraftComplete(draft: RoundEntryDraft) {
  return (
    draft.holes.length === 18 &&
    draft.holes.every(
      (hole) => hole.strokes.trim() !== "" && hole.putts.trim() !== "",
    )
  );
}

export function updateHoleEntry(
  draft: RoundEntryDraft,
  holeNumber: number,
  field: "strokes" | "putts",
  value: string,
): RoundEntryDraft {
  return {
    ...draft,
    holes: draft.holes.map((hole) =>
      hole.holeNumber === holeNumber ? { ...hole, [field]: value } : hole,
    ),
  };
}

export function getHoleReferencesForDraft(draft: RoundEntryDraft): HoleReference[] {
  return getHoleReferencesForTee(draft.setup.teeCode);
}
