export type DashboardRoundInput = {
  createdAt?: string;
  playedOn?: string;
  totalPutts: number;
  holes: Array<{
    holeNumber: number;
    par: number;
    putts: number;
    stablefordPoints: number;
    strokes: number;
  }>;
};

export type HoleInsight = {
  holeNumber: number;
  averageStableford: number;
  averagePutts: number;
  averageRelativeToPar: number;
  sampleCount: number;
};

export type CoachingInsight = {
  title: string;
  value: string;
  detail: string;
  tone: "positive" | "warning" | "neutral";
};

export type DashboardInsights = {
  averagePuttsPerRound: number;
  averagePuttsPerHole: number;
  averageStablefordPerRound: number;
  recentAveragePuttsPerRound: number;
  recentAverageStablefordPerRound: number;
  recentRoundCount: number;
  bestHole: HoleInsight | null;
  toughestHole: HoleInsight | null;
  holeInsights: HoleInsight[];
  coachingInsights: CoachingInsight[];
};

const RECENT_ROUND_LIMIT = 5;
const decimalFormatter = new Intl.NumberFormat("sv-SE", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

function formatAverage(value: number) {
  return decimalFormatter.format(value);
}

function formatDelta(value: number) {
  const roundedValue = Number(value.toFixed(1));

  if (roundedValue === 0) {
    return "0,0";
  }

  return `${roundedValue > 0 ? "+" : ""}${formatAverage(roundedValue)}`;
}

function formatHoleNumber(hole: HoleInsight | null) {
  return hole ? `#${hole.holeNumber}` : "-";
}

function getRoundStablefordTotal(round: DashboardRoundInput) {
  return round.holes.reduce((sum, hole) => sum + hole.stablefordPoints, 0);
}

function getRecentRounds(rounds: DashboardRoundInput[]) {
  return rounds
    .map((round, index) => ({ index, round }))
    .sort((left, right) => {
      const leftDate = left.round.playedOn ?? "";
      const rightDate = right.round.playedOn ?? "";

      if (leftDate !== rightDate) {
        return leftDate.localeCompare(rightDate);
      }

      const leftCreatedAt = left.round.createdAt ?? "";
      const rightCreatedAt = right.round.createdAt ?? "";

      if (leftCreatedAt !== rightCreatedAt) {
        return leftCreatedAt.localeCompare(rightCreatedAt);
      }

      return left.index - right.index;
    })
    .slice(-RECENT_ROUND_LIMIT)
    .map(({ round }) => round);
}

function averageStableford(rounds: DashboardRoundInput[]) {
  return (
    rounds.reduce((sum, round) => sum + getRoundStablefordTotal(round), 0) /
    rounds.length
  );
}

function averagePutts(rounds: DashboardRoundInput[]) {
  return rounds.reduce((sum, round) => sum + round.totalPutts, 0) / rounds.length;
}

function buildCoachingInsights({
  averagePuttsPerRound,
  averageStablefordPerRound,
  bestHole,
  recentAveragePuttsPerRound,
  recentAverageStablefordPerRound,
  recentRoundCount,
  toughestHole,
}: {
  averagePuttsPerRound: number;
  averageStablefordPerRound: number;
  bestHole: HoleInsight | null;
  recentAveragePuttsPerRound: number;
  recentAverageStablefordPerRound: number;
  recentRoundCount: number;
  toughestHole: HoleInsight | null;
}): CoachingInsight[] {
  const stablefordDelta =
    recentAverageStablefordPerRound - averageStablefordPerRound;
  const puttDelta = recentAveragePuttsPerRound - averagePuttsPerRound;

  return [
    {
      title: `Senaste ${recentRoundCount} mot totalen`,
      value: `${formatDelta(stablefordDelta)} p`,
      detail:
        Math.abs(stablefordDelta) < 0.5
          ? "Din senaste period ligger nära ditt totala Stableford-snitt."
          : stablefordDelta > 0
            ? "Den senaste perioden ligger över ditt totala Stableford-snitt."
            : "Den senaste perioden ligger under ditt totala Stableford-snitt.",
      tone:
        Math.abs(stablefordDelta) < 0.5
          ? "neutral"
          : stablefordDelta > 0
            ? "positive"
            : "warning",
    },
    {
      title: "Puttning senaste period",
      value: `${formatDelta(puttDelta)} puttar`,
      detail:
        Math.abs(puttDelta) < 0.5
          ? "Puttningen är stabil jämfört med ditt långsnitt."
          : puttDelta < 0
            ? "Du puttar bättre än ditt långsnitt i de senaste ronderna."
            : "Puttarna kostar mer än vanligt i de senaste ronderna.",
      tone:
        Math.abs(puttDelta) < 0.5
          ? "neutral"
          : puttDelta < 0
            ? "positive"
            : "warning",
    },
    {
      title: "Störst träningsvärde",
      value: formatHoleNumber(toughestHole),
      detail: toughestHole
        ? `Snitt ${formatAverage(
            toughestHole.averageStableford,
          )} Stableford och ${formatAverage(
            toughestHole.averageRelativeToPar,
          )} slag mot par.`
        : "Spara fler ronder för att hitta hålet som kostar mest.",
      tone: toughestHole ? "warning" : "neutral",
    },
    {
      title: "Behåll styrkan",
      value: formatHoleNumber(bestHole),
      detail: bestHole
        ? `Snitt ${formatAverage(bestHole.averageStableford)} Stableford och ${formatAverage(
            bestHole.averagePutts,
          )} puttar.`
        : "Spara fler ronder för att hitta ditt starkaste hål.",
      tone: bestHole ? "positive" : "neutral",
    },
  ];
}

export function calculateDashboardInsights(
  rounds: DashboardRoundInput[],
): DashboardInsights {
  const totalPutts = rounds.reduce((sum, round) => sum + round.totalPutts, 0);
  const totalHoles = rounds.reduce((sum, round) => sum + round.holes.length, 0);
  const averageStablefordPerRound = averageStableford(rounds);
  const recentRounds = getRecentRounds(rounds);
  const recentRoundCount = recentRounds.length;
  const recentAverageStablefordPerRound = averageStableford(recentRounds);
  const recentAveragePuttsPerRound = averagePutts(recentRounds);
  const holeBuckets = new Map<
    number,
    {
      holeNumber: number;
      totalStableford: number;
      totalPutts: number;
      totalRelativeToPar: number;
      sampleCount: number;
    }
  >();

  for (const round of rounds) {
    for (const hole of round.holes) {
      const currentBucket = holeBuckets.get(hole.holeNumber) ?? {
        holeNumber: hole.holeNumber,
        totalStableford: 0,
        totalPutts: 0,
        totalRelativeToPar: 0,
        sampleCount: 0,
      };

      currentBucket.totalStableford += hole.stablefordPoints;
      currentBucket.totalPutts += hole.putts;
      currentBucket.totalRelativeToPar += hole.strokes - hole.par;
      currentBucket.sampleCount += 1;

      holeBuckets.set(hole.holeNumber, currentBucket);
    }
  }

  const holeInsights = [...holeBuckets.values()]
    .map((bucket) => ({
      holeNumber: bucket.holeNumber,
      averageStableford: bucket.totalStableford / bucket.sampleCount,
      averagePutts: bucket.totalPutts / bucket.sampleCount,
      averageRelativeToPar: bucket.totalRelativeToPar / bucket.sampleCount,
      sampleCount: bucket.sampleCount,
    }))
    .sort((left, right) => left.holeNumber - right.holeNumber);

  const bestHole =
    holeInsights.reduce<HoleInsight | null>((currentBest, holeInsight) => {
      if (
        currentBest === null ||
        holeInsight.averageStableford > currentBest.averageStableford
      ) {
        return holeInsight;
      }

      if (
        holeInsight.averageStableford === currentBest.averageStableford &&
        holeInsight.averageRelativeToPar < currentBest.averageRelativeToPar
      ) {
        return holeInsight;
      }

      return currentBest;
    }, null) ?? null;

  const toughestHole =
    holeInsights.reduce<HoleInsight | null>((currentWorst, holeInsight) => {
      if (
        currentWorst === null ||
        holeInsight.averageStableford < currentWorst.averageStableford
      ) {
        return holeInsight;
      }

      if (
        holeInsight.averageStableford === currentWorst.averageStableford &&
        holeInsight.averageRelativeToPar > currentWorst.averageRelativeToPar
      ) {
        return holeInsight;
      }

      return currentWorst;
    }, null) ?? null;

  return {
    averagePuttsPerRound: totalPutts / rounds.length,
    averagePuttsPerHole: totalPutts / totalHoles,
    averageStablefordPerRound,
    recentAveragePuttsPerRound,
    recentAverageStablefordPerRound,
    recentRoundCount,
    bestHole,
    toughestHole,
    holeInsights,
    coachingInsights: buildCoachingInsights({
      averagePuttsPerRound: totalPutts / rounds.length,
      averageStablefordPerRound,
      bestHole,
      recentAveragePuttsPerRound,
      recentAverageStablefordPerRound,
      recentRoundCount,
      toughestHole,
    }),
  };
}
