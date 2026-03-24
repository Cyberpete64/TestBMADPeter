import type { PersistedRound } from "@/lib/round-domain";

type RoundDetailViewProps = {
  round: PersistedRound;
};

export function RoundDetailView({ round }: RoundDetailViewProps) {
  return (
    <div className="page-stack">
      <section className="page-card">
        <div className="step-header">
          <span className="pill">Saved round</span>
          <h1 className="page-title">
            {round.playerName} at {round.courseShortLabel}
          </h1>
          <p className="page-intro">
            Played on {round.playedOn} from the {round.teeLabel.toLowerCase()}.
          </p>
        </div>

        <div className="grid grid--stats">
          <article className="stat-card">
            <div className="stat-label">Total score</div>
            <div className="stat-value">{round.totalScore}</div>
          </article>
          <article className="stat-card">
            <div className="stat-label">Total putts</div>
            <div className="stat-value">{round.totalPutts}</div>
          </article>
          <article className="stat-card">
            <div className="stat-label">Stableford points</div>
            <div className="stat-value">{round.totalStablefordPoints}</div>
          </article>
          <article className="stat-card">
            <div className="stat-label">Entered handicap</div>
            <div className="stat-value">{round.enteredHandicap}</div>
          </article>
        </div>
      </section>

      <section className="page-card">
        <h2>Hole-by-hole summary</h2>
        <div className="review-grid">
          {round.holes.map((hole) => (
            <div className="review-grid__item" key={hole.holeNumber}>
              <strong>Hole {hole.holeNumber}</strong>
              <span className="muted">
                Par {hole.par} / SI {hole.strokeIndex}
              </span>
              <span>Strokes: {hole.strokes}</span>
              <span>Putts: {hole.putts}</span>
              <span>Received strokes: {hole.receivedStrokes}</span>
              <span>Stableford: {hole.stablefordPoints}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
