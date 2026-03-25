import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { availableTees, primaryCourse } from "@/lib/golf-course-data";
import type { PersistedRound, PersistedRoundsStore } from "@/lib/round-domain";

const dataDirectory = path.join(process.cwd(), "data");
const roundsFilePath = path.join(dataDirectory, "rounds.json");

async function ensureDataDirectory() {
  await mkdir(dataDirectory, { recursive: true });
}

function normalizeRound(round: PersistedRound): PersistedRound {
  if (round.courseSlug !== primaryCourse.slug) {
    return round;
  }

  return {
    ...round,
    courseLabel: primaryCourse.displayName,
    courseShortLabel: primaryCourse.shortLabel,
    teeLabel:
      availableTees.find((tee) => tee.code === round.teeCode)?.label ??
      round.teeLabel,
  };
}

async function readStore(): Promise<PersistedRoundsStore> {
  try {
    const rawValue = await readFile(roundsFilePath, "utf8");
    const parsed = JSON.parse(rawValue) as PersistedRoundsStore;

    return {
      rounds: (parsed.rounds ?? []).map(normalizeRound),
    };
  } catch {
    return { rounds: [] };
  }
}

async function writeStore(store: PersistedRoundsStore) {
  await ensureDataDirectory();
  await writeFile(
    roundsFilePath,
    JSON.stringify(
      {
        rounds: store.rounds.map(normalizeRound),
      },
      null,
      2,
    ),
    "utf8",
  );
}

export async function saveRound(round: PersistedRound) {
  const store = await readStore();
  store.rounds.unshift(round);
  await writeStore(store);
}

export async function updateRound(round: PersistedRound) {
  const store = await readStore();
  const roundIndex = store.rounds.findIndex((item) => item.id === round.id);

  if (roundIndex === -1) {
    throw new Error("Round not found.");
  }

  store.rounds[roundIndex] = round;
  await writeStore(store);
}

export async function deleteRound(id: string) {
  const store = await readStore();
  const nextRounds = store.rounds.filter((round) => round.id !== id);

  if (nextRounds.length === store.rounds.length) {
    throw new Error("Round not found.");
  }

  store.rounds = nextRounds;
  await writeStore(store);
}

export async function getRounds() {
  const store = await readStore();
  return store.rounds;
}

export async function getRoundById(id: string) {
  const store = await readStore();
  return store.rounds.find((round) => round.id === id) ?? null;
}
