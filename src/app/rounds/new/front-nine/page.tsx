import { RoundEntryStep } from "@/components/round-entry-step";

export default function FrontNinePage() {
  return (
    <div className="page-stack">
      <section className="page-card">
        <div className="step-header">
          <span className="pill">Fram 9</span>
          <h1 className="page-title">Registrera de första nio hålen</h1>
          <p className="page-intro">
            Registrera slag och puttar för hål 1 till 9 innan du fortsätter
            till de sista nio.
          </p>
        </div>
        <RoundEntryStep
          backHref="/rounds/new"
          holeRange={[1, 9]}
          intro="Registrera hål 1 till 9. Rondens inställningar följer med genom hela flödet medan du arbetar vidare."
          nextHref="/rounds/new/back-nine"
          primaryActionLabel="Fortsätt till Bak 9"
          progressLabel="Steg 2 av 4"
          progressWidth="48%"
          title="Fram 9"
        />
      </section>
    </div>
  );
}
