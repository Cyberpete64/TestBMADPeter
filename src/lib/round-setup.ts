import {
  readDurableClientItem,
  removeDurableClientItem,
  writeDurableClientItem,
} from "./browser-storage.ts";
import {
  defaultHandicapCalculationGender,
  isHandicapCalculationGender,
  type HandicapCalculationGender,
} from "./golf-course-data.ts";

export type RoundSetup = {
  playerName: string;
  playedOn: string;
  courseSlug: string;
  courseLabel: string;
  courseShortLabel: string;
  teeCode: "red" | "yellow";
  teeLabel: string;
  enteredHandicap: string;
  handicapCalculationGender: HandicapCalculationGender;
};

const STORAGE_KEY = "golf-round-tracker/round-setup";

export function normalizeRoundSetup(setup: RoundSetup): RoundSetup {
  return {
    ...setup,
    handicapCalculationGender: isHandicapCalculationGender(
      setup.handicapCalculationGender,
    )
      ? setup.handicapCalculationGender
      : defaultHandicapCalculationGender,
  };
}

export function persistRoundSetupToStorage(setup: RoundSetup) {
  writeDurableClientItem(
    STORAGE_KEY,
    JSON.stringify(normalizeRoundSetup(setup)),
  );
}

export function clearRoundSetupFromStorage() {
  removeDurableClientItem(STORAGE_KEY);
}

export function readRoundSetupFromStorage(): RoundSetup | null {
  const rawValue = readDurableClientItem(STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return normalizeRoundSetup(JSON.parse(rawValue) as RoundSetup);
  } catch {
    return null;
  }
}
