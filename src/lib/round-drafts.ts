import {
  availableTees,
  defaultHandicapCalculationGender,
  isHandicapCalculationGender,
  primaryCourse,
} from "@/lib/golf-course-data";
import { formatHandicapValue } from "@/lib/handicap";
import type { PersistedRound } from "@/lib/round-domain";
import type { RoundEntryDraft } from "@/lib/round-entry";
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
  const tee = availableTees.find((item) => item.code === draft.setup.teeCode);

  return {
    ...draft,
    setup: normalizeRoundSetup({
      ...draft.setup,
      courseSlug: primaryCourse.slug,
      courseLabel: primaryCourse.displayName,
      courseShortLabel: primaryCourse.shortLabel,
      teeLabel: tee?.label ?? draft.setup.teeLabel,
    }),
  };
}
