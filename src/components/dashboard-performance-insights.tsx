import type { PersistedRound } from "@/lib/round-domain";
import { getDashboardInsights } from "@/lib/dashboard-insights";

type DashboardPerformanceInsightsProps = {
  rounds: PersistedRound[];
};

function formatAverage(value: number) {
  return value.toFixed(1);
}

function formatRelativeToPar(value: number) {
  if (value === 0) {
    return "E";
  }

  return `${value > 0 ? "+" : ""}${value.toFixed(1)}`;
}

export function DashboardPerformanceInsights({
  rounds,
}: DashboardPerformanceInsightsProps) {
  const insights = getDashboardInsights(rounds);

  if (!insights) {
    return (
      <section className="page-card">
        <div className="step-header">
          <span className="pill">Prestandainsikter</span>
          <h2>Håltrender syns efter din första rond.</h2>
          <p className="muted">
            När du har sparat ronder visar översikten putt- och
            Stablefordmönster per hål.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="page-card">
      <div className="detail-card__header">
        <div>
          <span className="pill">Prestandainsikter</span>
          <h2>Puttning och hålmönster</h2>
          <p className="muted">
            De här snitten kommer från alla sparade ronder och visar var din
            scoring är som starkast och var banan straffar mest.
          </p>
        </div>
      </div>

      <div className="grid grid--stats">
        <article className="stat-card">
          <div className="stat-label">Snitt puttar / rond</div>
          <div className="stat-value">
            {formatAverage(insights.averagePuttsPerRound)}
          </div>
        </article>
        <article className="stat-card">
          <div className="stat-label">Snitt puttar / hål</div>
          <div className="stat-value">
            {formatAverage(insights.averagePuttsPerHole)}
          </div>
        </article>
        <article className="stat-card">
          <div className="stat-label">Bästa scoringhål</div>
          <div className="stat-value">
            {insights.bestHole ? `#${insights.bestHole.holeNumber}` : "-"}
          </div>
          <p className="muted">
            Snitt Stableford{" "}
            {insights.bestHole
              ? formatAverage(insights.bestHole.averageStableford)
              : "-"}
          </p>
        </article>
        <article className="stat-card">
          <div className="stat-label">Tuffaste hålet</div>
          <div className="stat-value">
            {insights.toughestHole ? `#${insights.toughestHole.holeNumber}` : "-"}
          </div>
          <p className="muted">
            Snitt Stableford{" "}
            {insights.toughestHole
              ? formatAverage(insights.toughestHole.averageStableford)
              : "-"}
          </p>
        </article>
      </div>

      <div className="hole-insights-grid">
        {insights.holeInsights.map((hole) => (
          <article className="hole-insight-card" key={hole.holeNumber}>
            <div className="hole-insight-card__top">
              <strong>Hål {hole.holeNumber}</strong>
              <span className="pill">Ronder {hole.sampleCount}</span>
            </div>
            <div className="hole-insight-card__stats">
              <div>
                <div className="stat-label">Snitt Stableford</div>
                <strong>{formatAverage(hole.averageStableford)}</strong>
              </div>
              <div>
                <div className="stat-label">Snitt puttar</div>
                <strong>{formatAverage(hole.averagePutts)}</strong>
              </div>
              <div>
                <div className="stat-label">Snitt mot par</div>
                <strong>{formatRelativeToPar(hole.averageRelativeToPar)}</strong>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
