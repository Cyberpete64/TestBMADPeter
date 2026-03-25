import Link from "next/link";

import { DashboardPerformanceInsights } from "@/components/dashboard-performance-insights";
import { HandicapTrendChart } from "@/components/handicap-trend-chart";
import { primaryCourse } from "@/lib/golf-course-data";
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
        <span className="hero__tag">Mobilvänlig golftracker</span>
        <h1>Följ dina ronder på {primaryCourse.displayName} med ett lugnt och snabbt flöde.</h1>
        <p>
          Spara fulla 18-hålsronder för {primaryCourse.shortLabel}, räkna Stableford
          automatiskt och håll översikten uppdaterad efter varje rond.
        </p>
        <div className="hero__actions">
          <Link className="button" href="/rounds/new">
            Starta ny rond
          </Link>
          {latestRound ? (
            <>
              <Link className="button-secondary" href={`/rounds/${latestRound.id}`}>
                Öppna senaste ronden
              </Link>
              <Link className="button-secondary" href="/rounds">
                Se alla ronder
              </Link>
            </>
          ) : (
            <span className="button-secondary" aria-disabled="true">
              Spara en rond för att låsa upp historiken
            </span>
          )}
        </div>
      </section>

      <HandicapTrendChart rounds={rounds} />
      <DashboardPerformanceInsights rounds={rounds} />

      <section className="grid grid--stats" aria-label="Statistik i översikten">
        <article className="stat-card">
          <div className="stat-label">Totalt antal ronder</div>
          <div className="stat-value">{totalRounds}</div>
          <p className="muted">
            Varje sparad rond syns direkt i totalsiffrorna.
          </p>
        </article>
        <article className="stat-card">
          <div className="stat-label">Snitt Stablefordpoäng</div>
          <div className="stat-value">{averageStableford}</div>
          <p className="muted">
            Beräknas från alla sparade ronder med nuvarande poängmotor.
          </p>
        </article>
        <article className="stat-card">
          <div className="stat-label">Senaste handicap</div>
          <div className="stat-value">{latestHandicap}</div>
          <p className="muted">
            Visar handicapvärdet som registrerades på din senaste rond.
          </p>
        </article>
        <article className="stat-card">
          <div className="stat-label">Bästa rond</div>
          <div className="stat-value">{bestRound ?? "-"}</div>
          <p className="muted">
            Bästa rond definieras som lägsta totalresultat hittills.
          </p>
        </article>
      </section>

      <section className="page-card">
        {totalRounds > 0 ? (
          <>
            <div className="detail-card__header">
              <div>
                <h2>Senaste ronder</h2>
                <p className="page-intro">
                  Hoppa tillbaka till dina senaste scorekort eller fortsätt bygga
                  trenden med nästa rond.
                </p>
              </div>
              <Link className="button-secondary" href="/rounds">
                Visa alla ronder
              </Link>
            </div>
            <div className="history-list">
              {recentRounds.map((round) => (
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
                      Öppna scorekort
                    </Link>
                    <Link className="button-secondary" href={`/rounds/${round.id}/edit`}>
                      Redigera rond
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="page-title">Börja med din första registrerade rond.</h2>
            <p className="page-intro">
              Guiden validerar inställningarna, samlar in alla 18 hål och
              sparar sedan ronden med automatisk poängräkning på serversidan.
            </p>
          </>
        )}
        <div className="actions-row">
          <Link className="button" href="/rounds/new">
            Ny rond
          </Link>
          {latestRound ? (
            <>
              <Link className="button-secondary" href={`/rounds/${latestRound.id}`}>
                Visa senaste scorekort
              </Link>
              <Link className="button-secondary" href="/rounds">
                Visa rondhistorik
              </Link>
            </>
          ) : null}
        </div>
      </section>
    </div>
  );
}
