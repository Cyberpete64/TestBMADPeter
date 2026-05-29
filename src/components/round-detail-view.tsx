import type { PersistedRound } from "@/lib/round-domain";
import { formatHandicapValue } from "@/lib/handicap";
import { getHandicapCalculationGenderLabel } from "@/lib/golf-course-data";

type RoundDetailViewProps = {
  round: PersistedRound;
};

export function RoundDetailView({ round }: RoundDetailViewProps) {
  return (
    <div className="page-stack">
      <section className="page-card">
        <div className="step-header">
          <span className="pill">Sparad rond</span>
          <h1 className="page-title">
            {round.playerName} på {round.courseShortLabel}
          </h1>
          <p className="page-intro">
            Spelad {round.playedOn} från {round.teeLabel.toLowerCase()}.
          </p>
        </div>

        <div className="grid grid--stats">
          <article className="stat-card">
            <div className="stat-label">Totalresultat</div>
            <div className="stat-value">{round.totalScore}</div>
          </article>
          <article className="stat-card">
            <div className="stat-label">Totalt antal puttar</div>
            <div className="stat-value">{round.totalPutts}</div>
          </article>
          <article className="stat-card">
            <div className="stat-label">Stablefordpoäng</div>
            <div className="stat-value">{round.totalStablefordPoints}</div>
          </article>
          <article className="stat-card">
            <div className="stat-label">Registrerat handicap</div>
            <div className="stat-value">{formatHandicapValue(round.enteredHandicap)}</div>
          </article>
          <article className="stat-card">
            <div className="stat-label">Spelhandicap</div>
            <div className="stat-value">{round.playingHandicap}</div>
          </article>
          <article className="stat-card">
            <div className="stat-label">HCP-tabell</div>
            <div className="stat-value">
              {getHandicapCalculationGenderLabel(
                round.handicapCalculationGender,
              )}
            </div>
          </article>
          <article className="stat-card">
            <div className="stat-label">CR/Slope</div>
            <div className="stat-value">
              {round.courseRating} / {round.slopeRating}
            </div>
          </article>
        </div>
      </section>

      <section className="page-card">
        <h2>Sammanfattning hål för hål</h2>
        <div className="review-grid">
          {round.holes.map((hole) => (
            <div className="review-grid__item" key={hole.holeNumber}>
              <strong>Hål {hole.holeNumber}</strong>
              <span className="muted">
                Par {hole.par} / HCP {hole.strokeIndex}
              </span>
              <span>Slag: {hole.strokes}</span>
              <span>Puttar: {hole.putts}</span>
              <span>Erhållna slag: {hole.receivedStrokes}</span>
              <span>Stableford: {hole.stablefordPoints}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
