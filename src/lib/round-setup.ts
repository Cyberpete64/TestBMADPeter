import {
  readDurableClientItem,
  removeDurableClientItem,
  writeDurableClientItem,
} from "@/lib/browser-storage";

export type RoundSetup = {
  playerName: string;
  playedOn: string;
  courseSlug: string;
  courseLabel: string;
  courseShortLabel: string;
  teeCode: "red" | "yellow";
  teeLabel: string;
  enteredHandicap: string;
};

const STORAGE_KEY = "golf-round-tracker/round-setup";

export function persistRoundSetupToStorage(setup: RoundSetup) {
  writeDurableClientItem(STORAGE_KEY, JSON.stringify(setup));
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
    return JSON.parse(rawValue) as RoundSetup;
  } catch {
    return null;
  }
}
