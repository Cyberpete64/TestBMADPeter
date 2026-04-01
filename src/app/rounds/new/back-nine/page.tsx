import { RoundEntryStep } from "@/components/round-entry-step";

export default function BackNinePage() {
  return (
    <div className="page-stack">
      <section className="page-card">
        <div className="step-header">
          <span className="pill">Bak 9</span>
          <h1 className="page-title">Avsluta ronden med de sista nio hålen</h1>
          <p className="page-intro">
            Hål 10 till 18 använder samma kortupplägg så att flödet förblir
            konsekvent.
          </p>
        </div>
        <RoundEntryStep
          backHref="/rounds/new/front-nine"
          holeRange={[10, 18]}
          intro="Registrera hål 10 till 18. Dina värden från fram 9 ligger kvar medan du avslutar ronden."
          nextHref="/rounds/new/review"
          primaryActionLabel="Fortsätt till sparöversikt"
          progressLabel="Steg 3 av 4"
          progressWidth="75%"
          title="Bak 9"
        />
      </section>
    </div>
  );
}
