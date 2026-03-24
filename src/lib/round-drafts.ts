import { availableTees, primaryCourse } from "@/lib/golf-course-data";
import type { PersistedRound } from "@/lib/round-domain";
import type { RoundEntryDraft } from "@/lib/round-entry";

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
      enteredHandicap: String(round.enteredHandicap),
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
    setup: {
      ...draft.setup,
      courseSlug: primaryCourse.slug,
      courseLabel: primaryCourse.displayName,
      courseShortLabel: primaryCourse.shortLabel,
      teeLabel: tee?.label ?? draft.setup.teeLabel,
    },
  };
}
