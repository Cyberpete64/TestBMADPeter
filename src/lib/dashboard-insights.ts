import type { PersistedRound } from "@/lib/round-domain";

import {
  calculateDashboardInsights,
  type DashboardInsights,
  type HoleInsight,
} from "./dashboard-insights-core";

export type { DashboardInsights, HoleInsight };

export function getDashboardInsights(
  rounds: PersistedRound[],
): DashboardInsights | null {
  if (rounds.length === 0) {
    return null;
  }

  return calculateDashboardInsights(rounds);
}
