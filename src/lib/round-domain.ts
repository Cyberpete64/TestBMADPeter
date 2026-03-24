export type PersistedHole = {
  holeNumber: number;
  par: number;
  strokeIndex: number;
  strokes: number;
  putts: number;
  receivedStrokes: number;
  stablefordPoints: number;
};

export type PersistedRound = {
  id: string;
  playerName: string;
  playedOn: string;
  courseSlug: string;
  courseLabel: string;
  courseShortLabel: string;
  teeCode: "red" | "yellow";
  teeLabel: string;
  enteredHandicap: number;
  totalScore: number;
  totalPutts: number;
  totalStablefordPoints: number;
  createdAt: string;
  holes: PersistedHole[];
};

export type PersistedRoundsStore = {
  rounds: PersistedRound[];
};
