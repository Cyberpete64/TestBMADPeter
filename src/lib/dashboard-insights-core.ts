export type DashboardRoundInput = {
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

export type DashboardInsights = {
  averagePuttsPerRound: number;
  averagePuttsPerHole: number;
  bestHole: HoleInsight | null;
  toughestHole: HoleInsight | null;
  holeInsights: HoleInsight[];
};

export function calculateDashboardInsights(
  rounds: DashboardRoundInput[],
): DashboardInsights {
  const totalPutts = rounds.reduce((sum, round) => sum + round.totalPutts, 0);
  const totalHoles = rounds.reduce((sum, round) => sum + round.holes.length, 0);
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
    bestHole,
    toughestHole,
    holeInsights,
  };
}
