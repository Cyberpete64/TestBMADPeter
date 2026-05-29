import "server-only";

import { requireCurrentUser } from "@/lib/auth";
import {
  availableTees,
  defaultHandicapCalculationGender,
  getTeeRating,
  isHandicapCalculationGender,
  primaryCourse,
  type HandicapCalculationGender,
} from "@/lib/golf-course-data";
import type { PersistedHole, PersistedRound } from "@/lib/round-domain";
import { calculatePlayingHandicap } from "@/lib/scoring";

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
  handicap_calculation_gender: HandicapCalculationGender | null;
  playing_handicap: number | null;
  course_rating: number | null;
  slope_rating: number | null;
  course_par: number | null;
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

type RoundWithHolesRow = RoundRow & {
  round_holes: RoundHoleRow[] | null;
};

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
    handicap_calculation_gender: normalizedRound.handicapCalculationGender,
    playing_handicap: normalizedRound.playingHandicap,
    course_rating: normalizedRound.courseRating,
    slope_rating: normalizedRound.slopeRating,
    course_par: normalizedRound.coursePar,
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

function mapPersistedHole(row: RoundHoleRow): PersistedHole {
  return {
    holeNumber: row.hole_number,
    par: row.par,
    strokeIndex: row.stroke_index,
    strokes: row.strokes,
    putts: row.putts,
    receivedStrokes: row.received_strokes,
    stablefordPoints: row.stableford_points,
  };
}

function mapPersistedRound(row: RoundWithHolesRow): PersistedRound {
  const handicapCalculationGender = isHandicapCalculationGender(
    row.handicap_calculation_gender,
  )
    ? row.handicap_calculation_gender
    : defaultHandicapCalculationGender;
  const teeRating = getTeeRating(row.tee_code, handicapCalculationGender);
  const courseRating = row.course_rating ?? teeRating.courseRating;
  const slopeRating = row.slope_rating ?? teeRating.slopeRating;
  const coursePar = row.course_par ?? teeRating.par;
  const playingHandicap =
    row.playing_handicap ??
    calculatePlayingHandicap(row.entered_handicap, {
      courseRating,
      slopeRating,
      par: coursePar,
    });

  return normalizeRound({
    id: row.id,
    playerName: row.player_name,
    playedOn: row.played_on,
    courseSlug: row.course_slug,
    courseLabel: row.course_label,
    courseShortLabel: row.course_short_label,
    teeCode: row.tee_code,
    teeLabel: row.tee_label,
    enteredHandicap: row.entered_handicap,
    handicapCalculationGender,
    playingHandicap,
    courseRating,
    slopeRating,
    coursePar,
    totalScore: row.total_score,
    totalPutts: row.total_putts,
    totalStablefordPoints: row.total_stableford_points,
    createdAt: row.created_at,
    holes: [...(row.round_holes ?? [])]
      .sort((left, right) => left.hole_number - right.hole_number)
      .map(mapPersistedHole),
  });
}

export async function saveRound(round: PersistedRound) {
  const { supabase, user } = await requireCurrentUser();
  const roundRow = mapRoundRow(round, user.id);
  const holeRows = mapHoleRows(round);

  const { error: roundError } = await supabase.from("rounds").insert(roundRow);

  if (roundError) {
    throw roundError;
  }

  const { error: holeError } = await supabase.from("round_holes").insert(holeRows);

  if (holeError) {
    await supabase
      .from("rounds")
      .delete()
      .eq("id", round.id)
      .eq("user_id", user.id);

    throw holeError;
  }
}

export async function updateRound(round: PersistedRound) {
  const { supabase, user } = await requireCurrentUser();
  const roundRow = mapRoundRow(round, user.id);
  const holeRows = mapHoleRows(round);

  const { data: updatedRound, error: roundError } = await supabase
    .from("rounds")
    .update(roundRow)
    .eq("id", round.id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (roundError) {
    throw roundError;
  }

  if (!updatedRound) {
    throw new Error("Round not found.");
  }

  const { error: holeError } = await supabase.from("round_holes").upsert(holeRows, {
    onConflict: "round_id,hole_number",
  });

  if (holeError) {
    throw holeError;
  }
}

export async function deleteRound(id: string) {
  const { supabase, user } = await requireCurrentUser();
  const { data: deletedRound, error } = await supabase
    .from("rounds")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!deletedRound) {
    throw new Error("Round not found.");
  }
}

export async function getRounds() {
  const { supabase, user } = await requireCurrentUser();
  const { data, error } = await supabase
    .from("rounds")
    .select(
      "id,user_id,player_name,played_on,course_slug,course_label,course_short_label,tee_code,tee_label,entered_handicap,handicap_calculation_gender,playing_handicap,course_rating,slope_rating,course_par,total_score,total_putts,total_stableford_points,created_at,round_holes(round_id,hole_number,par,stroke_index,strokes,putts,received_strokes,stableford_points)",
    )
    .eq("user_id", user.id)
    .order("played_on", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data as RoundWithHolesRow[]).map(mapPersistedRound);
}

export async function getRoundById(id: string) {
  const { supabase, user } = await requireCurrentUser();
  const { data, error } = await supabase
    .from("rounds")
    .select(
      "id,user_id,player_name,played_on,course_slug,course_label,course_short_label,tee_code,tee_label,entered_handicap,handicap_calculation_gender,playing_handicap,course_rating,slope_rating,course_par,total_score,total_putts,total_stableford_points,created_at,round_holes(round_id,hole_number,par,stroke_index,strokes,putts,received_strokes,stableford_points)",
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapPersistedRound(data as RoundWithHolesRow);
}
