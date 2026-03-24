import Link from "next/link";

import { DashboardPerformanceInsights } from "@/components/dashboard-performance-insights";
import { HandicapTrendChart } from "@/components/handicap-trend-chart";
import { getRounds } from "@/lib/round-repository";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const rounds = await getRounds();
  const totalRounds = rounds.length;
  const averageStableford =
    totalRounds > 0
      ? (
          rounds.reduce(
            (sum, round) => sum + round.totalStablefordPoints,
            0,
          ) / totalRounds
        ).toFixed(1)
      : "-";
  const latestRound = rounds[0] ?? null;
  const latestHandicap = latestRound?.enteredHandicap ?? "-";
  const recentRounds = rounds.slice(0, 3);
  const bestRound = rounds.reduce<number | null>((lowestScore, round) => {
    if (lowestScore === null || round.totalScore < lowestScore) {
      return round.totalScore;
    }

    return lowestScore;
  }, null);

  return (
    <div className="page-stack">
      <section className="hero">
        <span className="hero__tag">Mobile-first golf round tracker</span>
        <h1>Track rounds at Östersund-Frösö Golfklubb with a calm, fast flow.</h1>
        <p>
          Save full 18-hole rounds for Öfg, score them automatically with
          Stableford, and keep your dashboard current after every round.
        </p>
        <div className="hero__actions">
          <Link className="button" href="/rounds/new">
            Start a New Round
          </Link>
          {latestRound ? (
            <>
              <Link className="button-secondary" href={`/rounds/${latestRound.id}`}>
                Open Latest Round
              </Link>
              <Link className="button-secondary" href="/rounds">
                Browse Rounds
              </Link>
            </>
          ) : (
            <span className="button-secondary" aria-disabled="true">
              Save a round to unlock history
            </span>
          )}
        </div>
      </section>

      <HandicapTrendChart rounds={rounds} />
      <DashboardPerformanceInsights rounds={rounds} />

      <section className="grid grid--stats" aria-label="Dashboard stats">
        <article className="stat-card">
          <div className="stat-label">Total rounds played</div>
          <div className="stat-value">{totalRounds}</div>
          <p className="muted">
            Every saved round appears in your dashboard totals immediately.
          </p>
        </article>
        <article className="stat-card">
          <div className="stat-label">Average Stableford points</div>
          <div className="stat-value">{averageStableford}</div>
          <p className="muted">
            Calculated from all saved rounds using the current scoring engine.
          </p>
        </article>
        <article className="stat-card">
          <div className="stat-label">Latest handicap</div>
          <div className="stat-value">{latestHandicap}</div>
          <p className="muted">
            Tracks the handicap value entered for your most recent saved round.
          </p>
        </article>
        <article className="stat-card">
          <div className="stat-label">Best round</div>
          <div className="stat-value">{bestRound ?? "-"}</div>
          <p className="muted">
            Best round is defined as the lowest total score so far.
          </p>
        </article>
      </section>

      <section className="page-card">
        {totalRounds > 0 ? (
          <>
            <div className="detail-card__header">
              <div>
                <h2>Recent rounds</h2>
                <p className="page-intro">
                  Jump back into your latest scorecards or continue building the
                  trend with the next round.
                </p>
              </div>
              <Link className="button-secondary" href="/rounds">
                View All Rounds
              </Link>
            </div>
            <div className="history-list">
              {recentRounds.map((round) => (
                <article className="history-item" key={round.id}>
                  <div className="history-item__top">
                    <div>
                      <h2 className="history-item__title">
                        {round.playerName} at {round.courseShortLabel}
                      </h2>
                      <p className="muted">
                        {round.playedOn} / {round.teeLabel}
                      </p>
                    </div>
                    <span className="pill">{round.totalScore} strokes</span>
                  </div>
                  <div className="history-item__stats">
                    <div>
                      <div className="stat-label">Stableford</div>
                      <strong>{round.totalStablefordPoints}</strong>
                    </div>
                    <div>
                      <div className="stat-label">Putts</div>
                      <strong>{round.totalPutts}</strong>
                    </div>
                    <div>
                      <div className="stat-label">Handicap</div>
                      <strong>{round.enteredHandicap}</strong>
                    </div>
                  </div>
                  <div className="actions-row">
                    <Link className="button-secondary" href={`/rounds/${round.id}`}>
                      Open Scorecard
                    </Link>
                    <Link className="button-secondary" href={`/rounds/${round.id}/edit`}>
                      Edit Round
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="page-title">Start with your first scored round.</h2>
            <p className="page-intro">
              The round wizard validates setup, captures all 18 holes, then
              saves and scores the round server-side.
            </p>
          </>
        )}
        <div className="actions-row">
          <Link className="button" href="/rounds/new">
            New Round
          </Link>
          {latestRound ? (
            <>
              <Link className="button-secondary" href={`/rounds/${latestRound.id}`}>
                View Latest Scorecard
              </Link>
              <Link className="button-secondary" href="/rounds">
                View Round History
              </Link>
            </>
          ) : null}
        </div>
      </section>
    </div>
  );
}
