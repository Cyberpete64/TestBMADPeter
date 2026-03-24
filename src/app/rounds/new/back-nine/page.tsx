import { RoundEntryStep } from "@/components/round-entry-step";

export default function BackNinePage() {
  return (
    <div className="page-stack">
      <section className="page-card">
        <div className="step-header">
          <span className="pill">Back 9</span>
          <h1 className="page-title">Finish the round with back-nine entry</h1>
          <p className="page-intro">
            Holes 10 to 18 use the same card pattern so the round flow stays
            consistent.
          </p>
        </div>
        <RoundEntryStep
          backHref="/rounds/new/front-nine"
          holeRange={[10, 18]}
          intro="Capture holes 10 to 18. Front-nine entries remain preserved while you finish the round."
          nextHref="/rounds/new/review"
          primaryActionLabel="Continue to Save Review"
          progressLabel="Step 3 of 4"
          progressWidth="72%"
          title="Back nine"
        />
      </section>
    </div>
  );
}
