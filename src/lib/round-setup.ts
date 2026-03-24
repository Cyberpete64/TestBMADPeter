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
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(setup));
}

export function clearRoundSetupFromStorage() {
  window.sessionStorage.removeItem(STORAGE_KEY);
}

export function readRoundSetupFromStorage(): RoundSetup | null {
  const rawValue = window.sessionStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as RoundSetup;
  } catch {
    return null;
  }
}
