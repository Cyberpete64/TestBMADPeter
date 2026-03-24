import { RoundEntryStep } from "@/components/round-entry-step";

export default function FrontNinePage() {
  return (
    <div className="page-stack">
      <section className="page-card">
        <div className="step-header">
          <span className="pill">Front 9</span>
          <h1 className="page-title">Enter the opening nine holes</h1>
          <p className="page-intro">
            Capture strokes and putts for holes 1 to 9 before continuing to the
            back nine.
          </p>
        </div>
        <RoundEntryStep
          backHref="/rounds/new"
          holeRange={[1, 9]}
          intro="Capture holes 1 to 9. Your round setup stays attached to the entry flow while you move through the round."
          nextHref="/rounds/new/back-nine"
          primaryActionLabel="Continue to Back 9"
          progressLabel="Step 2 of 4"
          progressWidth="48%"
          title="Front nine"
        />
      </section>
    </div>
  );
}
