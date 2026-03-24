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
          <span className="pill">Performance insights</span>
          <h2>Hole-level trends appear after your first round.</h2>
          <p className="muted">
            Once you save rounds, the dashboard will surface putting and
            Stableford patterns by hole.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="page-card">
      <div className="detail-card__header">
        <div>
          <span className="pill">Performance insights</span>
          <h2>Putting and hole patterns</h2>
          <p className="muted">
            These averages come from every saved round and help show where your
            scoring is strongest and where the course bites back.
          </p>
        </div>
      </div>

      <div className="grid grid--stats">
        <article className="stat-card">
          <div className="stat-label">Avg putts / round</div>
          <div className="stat-value">
            {formatAverage(insights.averagePuttsPerRound)}
          </div>
        </article>
        <article className="stat-card">
          <div className="stat-label">Avg putts / hole</div>
          <div className="stat-value">
            {formatAverage(insights.averagePuttsPerHole)}
          </div>
        </article>
        <article className="stat-card">
          <div className="stat-label">Best scoring hole</div>
          <div className="stat-value">
            {insights.bestHole ? `#${insights.bestHole.holeNumber}` : "-"}
          </div>
          <p className="muted">
            Avg Stableford{" "}
            {insights.bestHole
              ? formatAverage(insights.bestHole.averageStableford)
              : "-"}
          </p>
        </article>
        <article className="stat-card">
          <div className="stat-label">Toughest hole</div>
          <div className="stat-value">
            {insights.toughestHole ? `#${insights.toughestHole.holeNumber}` : "-"}
          </div>
          <p className="muted">
            Avg Stableford{" "}
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
              <strong>Hole {hole.holeNumber}</strong>
              <span className="pill">Rounds {hole.sampleCount}</span>
            </div>
            <div className="hole-insight-card__stats">
              <div>
                <div className="stat-label">Avg Stableford</div>
                <strong>{formatAverage(hole.averageStableford)}</strong>
              </div>
              <div>
                <div className="stat-label">Avg putts</div>
                <strong>{formatAverage(hole.averagePutts)}</strong>
              </div>
              <div>
                <div className="stat-label">Avg to par</div>
                <strong>{formatRelativeToPar(hole.averageRelativeToPar)}</strong>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
