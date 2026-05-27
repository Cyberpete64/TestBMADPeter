import {
  readDurableClientItem,
  removeDurableClientItem,
  writeDurableClientItem,
} from "@/lib/browser-storage";
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

export function canReuseRoundEntryDraft(
  draft: RoundEntryDraft,
  setup: RoundSetup,
) {
  return (
    draft.setup.courseSlug === setup.courseSlug &&
    draft.setup.playedOn === setup.playedOn &&
    draft.setup.playerName === setup.playerName &&
    draft.setup.teeCode === setup.teeCode
  );
}

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
  writeDurableClientItem(STORAGE_KEY, JSON.stringify(draft));
}

export function clearRoundEntryDraft() {
  removeDurableClientItem(STORAGE_KEY);
}

export function readRoundEntryDraft(): RoundEntryDraft | null {
  const rawValue = readDurableClientItem(STORAGE_KEY);

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

  if (existing && canReuseRoundEntryDraft(existing, setup)) {
    const nextDraft = {
      ...existing,
      setup,
    };
    persistRoundEntryDraft(nextDraft);
    return nextDraft;
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
