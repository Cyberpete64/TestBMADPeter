import Link from "next/link";

import { getRounds } from "@/lib/round-repository";

export const dynamic = "force-dynamic";

export default async function RoundsPage() {
  const rounds = await getRounds();

  return (
    <div className="page-stack">
      <section className="page-card">
        <div className="step-header">
          <span className="pill">Round history</span>
          <h1 className="page-title">Saved rounds</h1>
          <p className="page-intro">
            Review every saved round, then open the scorecard or jump straight
            into edits.
          </p>
        </div>
      </section>

      {rounds.length === 0 ? (
        <section className="empty-card">
          <h2>No saved rounds yet.</h2>
          <p className="page-intro">
            Save your first full round and it will appear here automatically.
          </p>
          <div className="actions-row">
            <Link className="button" href="/rounds/new">
              Start a New Round
            </Link>
            <Link className="button-secondary" href="/">
              Back to Dashboard
            </Link>
          </div>
        </section>
      ) : (
        <section className="page-card">
          <div className="history-list">
            {rounds.map((round) => (
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
                    View Scorecard
                  </Link>
                  <Link className="button-secondary" href={`/rounds/${round.id}/edit`}>
                    Edit Round
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
