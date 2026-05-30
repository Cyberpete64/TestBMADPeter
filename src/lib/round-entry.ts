import {
  readDurableClientItem,
  removeDurableClientItem,
  writeDurableClientItem,
} from "./browser-storage.ts";
import {
  getHoleReferencesForTee,
  type HoleReference,
  type TeeCode,
} from "./golf-course-data.ts";
import {
  normalizeRoundSetup,
  type RoundSetup,
} from "./round-setup.ts";

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeDraftText(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return "";
}

function normalizeHoleInput(value: unknown) {
  return normalizeDraftText(value).replace(/[^\d]/g, "");
}

function normalizeDraftTeeCode(value: unknown): TeeCode | null {
  return value === "red" || value === "yellow" ? value : null;
}

function normalizeHoleEntry(value: unknown): HoleEntry | null {
  if (!isRecord(value)) {
    return null;
  }

  const holeNumber = Number(value.holeNumber);

  if (!Number.isInteger(holeNumber) || holeNumber < 1 || holeNumber > 18) {
    return null;
  }

  return {
    holeNumber,
    strokes: normalizeHoleInput(value.strokes),
    putts: normalizeHoleInput(value.putts),
  };
}

export function normalizeRoundEntryDraft(
  value: unknown,
): RoundEntryDraft | null {
  if (!isRecord(value) || !isRecord(value.setup)) {
    return null;
  }

  const teeCode = normalizeDraftTeeCode(value.setup.teeCode);

  if (!teeCode) {
    return null;
  }

  const setup = normalizeRoundSetup({
    playerName: normalizeDraftText(value.setup.playerName),
    playedOn: normalizeDraftText(value.setup.playedOn),
    courseSlug: normalizeDraftText(value.setup.courseSlug),
    courseLabel: normalizeDraftText(value.setup.courseLabel),
    courseShortLabel: normalizeDraftText(value.setup.courseShortLabel),
    teeCode,
    teeLabel: normalizeDraftText(value.setup.teeLabel),
    enteredHandicap: normalizeDraftText(value.setup.enteredHandicap),
    handicapCalculationGender: normalizeDraftText(
      value.setup.handicapCalculationGender,
    ) as RoundSetup["handicapCalculationGender"],
  });
  const validEntriesByHole = new Map<number, HoleEntry>();

  if (Array.isArray(value.holes)) {
    for (const item of value.holes) {
      const entry = normalizeHoleEntry(item);

      if (entry) {
        validEntriesByHole.set(entry.holeNumber, entry);
      }
    }
  }

  return {
    setup,
    holes: createInitialHoleEntries(teeCode).map(
      (entry) => validEntriesByHole.get(entry.holeNumber) ?? entry,
    ),
  };
}

export function canReuseRoundEntryDraft(
  draft: RoundEntryDraft,
  setup: RoundSetup,
) {
  const normalizedDraftSetup = normalizeRoundSetup(draft.setup);
  const normalizedSetup = normalizeRoundSetup(setup);

  return (
    normalizedDraftSetup.courseSlug === normalizedSetup.courseSlug &&
    normalizedDraftSetup.playedOn === normalizedSetup.playedOn &&
    normalizedDraftSetup.playerName === normalizedSetup.playerName &&
    normalizedDraftSetup.teeCode === normalizedSetup.teeCode &&
    normalizedDraftSetup.handicapCalculationGender ===
      normalizedSetup.handicapCalculationGender
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
    setup: normalizeRoundSetup(setup),
    holes: createInitialHoleEntries(setup.teeCode),
  };
}

export function persistRoundEntryDraft(draft: RoundEntryDraft) {
  const normalizedDraft = normalizeRoundEntryDraft(draft);

  if (!normalizedDraft) {
    return;
  }

  writeDurableClientItem(
    STORAGE_KEY,
    JSON.stringify({
      ...normalizedDraft,
      setup: normalizeRoundSetup(normalizedDraft.setup),
    }),
  );
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
    const parsedDraft = JSON.parse(rawValue);
    const normalizedDraft = normalizeRoundEntryDraft(parsedDraft);

    if (!normalizedDraft) {
      clearRoundEntryDraft();
    }

    return normalizedDraft;
  } catch {
    clearRoundEntryDraft();
    return null;
  }
}

export function ensureRoundEntryDraft(setup: RoundSetup): RoundEntryDraft {
  const existing = readRoundEntryDraft();

  if (existing && canReuseRoundEntryDraft(existing, setup)) {
    const nextDraft = {
      ...existing,
      setup: normalizeRoundSetup(setup),
    };
    persistRoundEntryDraft(nextDraft);
    return nextDraft;
  }

  const nextDraft = createRoundEntryDraft(setup);
  persistRoundEntryDraft(nextDraft);
  return nextDraft;
}

export function isRoundEntryDraftComplete(draft: RoundEntryDraft) {
  const normalizedDraft = normalizeRoundEntryDraft(draft);

  if (!normalizedDraft) {
    return false;
  }

  return (
    normalizedDraft.holes.length === 18 &&
    normalizedDraft.holes.every(
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
