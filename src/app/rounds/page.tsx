import Link from "next/link";

import { getRounds } from "@/lib/round-repository";

export const dynamic = "force-dynamic";

export default async function RoundsPage() {
  const rounds = await getRounds();

  return (
    <div className="page-stack">
      <section className="page-card">
        <div className="step-header">
          <span className="pill">Rondhistorik</span>
          <h1 className="page-title">Sparade ronder</h1>
          <p className="page-intro">
            Gå igenom alla sparade ronder och öppna scorekortet eller hoppa
            direkt till redigering.
          </p>
        </div>
      </section>

      {rounds.length === 0 ? (
        <section className="empty-card">
          <h2>Inga sparade ronder ännu.</h2>
          <p className="page-intro">
            Spara din första fulla rond så visas den här automatiskt.
          </p>
          <div className="actions-row">
            <Link className="button" href="/rounds/new">
              Starta ny rond
            </Link>
            <Link className="button-secondary" href="/">
              Tillbaka till översikten
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
                      {round.playerName} på {round.courseShortLabel}
                    </h2>
                    <p className="muted">
                      {round.playedOn} / {round.teeLabel}
                    </p>
                  </div>
                  <span className="pill">{round.totalScore} slag</span>
                </div>

                <div className="history-item__stats">
                  <div>
                    <div className="stat-label">Stableford</div>
                    <strong>{round.totalStablefordPoints}</strong>
                  </div>
                  <div>
                    <div className="stat-label">Puttar</div>
                    <strong>{round.totalPutts}</strong>
                  </div>
                  <div>
                    <div className="stat-label">Handicap</div>
                    <strong>{round.enteredHandicap}</strong>
                  </div>
                </div>

                <div className="actions-row">
                  <Link className="button-secondary" href={`/rounds/${round.id}`}>
                    Visa scorekort
                  </Link>
                  <Link className="button-secondary" href={`/rounds/${round.id}/edit`}>
                    Redigera rond
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
