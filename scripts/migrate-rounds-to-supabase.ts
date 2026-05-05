import { readFile } from "node:fs/promises";
import path from "node:path";

import { createClient } from "@supabase/supabase-js";

import {
  availableTees,
  primaryCourse,
} from "../src/lib/golf-course-data.ts";
import type {
  PersistedRound,
  PersistedRoundsStore,
} from "../src/lib/round-domain.ts";

type RoundRow = {
  id: string;
  user_id: string;
  player_name: string;
  played_on: string;
  course_slug: string;
  course_label: string;
  course_short_label: string;
  tee_code: "red" | "yellow";
  tee_label: string;
  entered_handicap: number;
  total_score: number;
  total_putts: number;
  total_stableford_points: number;
  created_at: string;
};

type RoundHoleRow = {
  round_id: string;
  hole_number: number;
  par: number;
  stroke_index: number;
  strokes: number;
  putts: number;
  received_strokes: number;
  stableford_points: number;
};

function getRequiredEnv(name: "NEXT_PUBLIC_SUPABASE_URL" | "SUPABASE_SERVICE_ROLE_KEY") {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function readArg(name: "--user-id" | "--file") {
  const index = process.argv.findIndex((value) => value === name);

  if (index === -1) {
    return null;
  }

  return process.argv[index + 1] ?? null;
}

function printUsage() {
  console.log("Usage:");
  console.log(
    "  npm run migrate:rounds -- --user-id <supabase-user-uuid> [--file data/rounds.json]",
  );
}

function normalizeRound(round: PersistedRound): PersistedRound {
  const teeLabel =
    availableTees.find((tee) => tee.code === round.teeCode)?.label ?? round.teeLabel;

  if (round.courseSlug !== primaryCourse.slug) {
    return {
      ...round,
      teeLabel,
    };
  }

  return {
    ...round,
    courseLabel: primaryCourse.displayName,
    courseShortLabel: primaryCourse.shortLabel,
    teeLabel,
  };
}

function mapRoundRow(round: PersistedRound, userId: string): RoundRow {
  const normalizedRound = normalizeRound(round);

  return {
    id: normalizedRound.id,
    user_id: userId,
    player_name: normalizedRound.playerName,
    played_on: normalizedRound.playedOn,
    course_slug: normalizedRound.courseSlug,
    course_label: normalizedRound.courseLabel,
    course_short_label: normalizedRound.courseShortLabel,
    tee_code: normalizedRound.teeCode,
    tee_label: normalizedRound.teeLabel,
    entered_handicap: normalizedRound.enteredHandicap,
    total_score: normalizedRound.totalScore,
    total_putts: normalizedRound.totalPutts,
    total_stableford_points: normalizedRound.totalStablefordPoints,
    created_at: normalizedRound.createdAt,
  };
}

function mapHoleRows(round: PersistedRound): RoundHoleRow[] {
  return round.holes.map((hole) => ({
    round_id: round.id,
    hole_number: hole.holeNumber,
    par: hole.par,
    stroke_index: hole.strokeIndex,
    strokes: hole.strokes,
    putts: hole.putts,
    received_strokes: hole.receivedStrokes,
    stableford_points: hole.stablefordPoints,
  }));
}

function assertStore(value: unknown): asserts value is PersistedRoundsStore {
  if (!value || typeof value !== "object" || !Array.isArray((value as PersistedRoundsStore).rounds)) {
    throw new Error("Invalid rounds store format in JSON file.");
  }
}

async function readRoundsFile(filePath: string) {
  const rawValue = await readFile(filePath, "utf8");
  const parsed = JSON.parse(rawValue) as unknown;

  assertStore(parsed);
  return parsed.rounds;
}

async function run() {
  const userId = readArg("--user-id");

  if (!userId) {
    printUsage();
    throw new Error("Missing required argument: --user-id");
  }

  const fileArg = readArg("--file");
  const filePath = fileArg
    ? path.resolve(process.cwd(), fileArg)
    : path.join(process.cwd(), "data", "rounds.json");

  const rounds = await readRoundsFile(filePath);

  if (rounds.length === 0) {
    console.log(`No rounds found in ${filePath}. Nothing to migrate.`);
    return;
  }

  const supabase = createClient(
    getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

  const roundRows = rounds.map((round) => mapRoundRow(round, userId));
  const holeRows = rounds.flatMap((round) => mapHoleRows(normalizeRound(round)));

  console.log(`Migrating ${roundRows.length} rounds from ${filePath} to user ${userId}...`);

  const { error: roundError } = await supabase.from("rounds").upsert(roundRows, {
    onConflict: "id",
  });

  if (roundError) {
    throw roundError;
  }

  const { error: holeError } = await supabase.from("round_holes").upsert(holeRows, {
    onConflict: "round_id,hole_number",
  });

  if (holeError) {
    throw holeError;
  }

  console.log("Migration completed successfully.");
}

run().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Migration failed: ${message}`);
  process.exitCode = 1;
});
