import {
  availableTees,
  defaultHandicapCalculationGender,
  isHandicapCalculationGender,
  primaryCourse,
} from "@/lib/golf-course-data";
import { formatHandicapValue } from "@/lib/handicap";
import type { PersistedRound } from "@/lib/round-domain";
import {
  normalizeRoundEntryDraft,
  type RoundEntryDraft,
} from "@/lib/round-entry";
import { normalizeRoundSetup } from "@/lib/round-setup";

export function createDraftFromPersistedRound(
  round: PersistedRound,
): RoundEntryDraft {
  return {
    setup: {
      playerName: round.playerName,
      playedOn: round.playedOn,
      courseSlug: round.courseSlug,
      courseLabel: round.courseLabel,
      courseShortLabel: round.courseShortLabel,
      teeCode: round.teeCode,
      teeLabel: round.teeLabel,
      enteredHandicap: formatHandicapValue(round.enteredHandicap),
      handicapCalculationGender: isHandicapCalculationGender(
        round.handicapCalculationGender,
      )
        ? round.handicapCalculationGender
        : defaultHandicapCalculationGender,
    },
    holes: round.holes.map((hole) => ({
      holeNumber: hole.holeNumber,
      strokes: String(hole.strokes),
      putts: String(hole.putts),
    })),
  };
}

export function normalizeDraftCourseMetadata(draft: RoundEntryDraft): RoundEntryDraft {
  const normalizedDraft = normalizeRoundEntryDraft(draft);

  if (!normalizedDraft) {
    throw new Error("Invalid round draft.");
  }

  const tee = availableTees.find(
    (item) => item.code === normalizedDraft.setup.teeCode,
  );

  return {
    ...normalizedDraft,
    setup: normalizeRoundSetup({
      ...normalizedDraft.setup,
      courseSlug: primaryCourse.slug,
      courseLabel: primaryCourse.displayName,
      courseShortLabel: primaryCourse.shortLabel,
      teeLabel: tee?.label ?? normalizedDraft.setup.teeLabel,
    }),
  };
}
