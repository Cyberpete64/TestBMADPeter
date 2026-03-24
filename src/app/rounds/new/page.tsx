import { RoundSetupForm } from "@/components/round-setup-form";

export default function NewRoundPage() {
  return (
    <div className="page-stack">
      <section className="page-card">
        <div className="step-header">
          <span className="pill">Story 1.1</span>
          <h1 className="page-title">Set up a valid round</h1>
          <p className="page-intro">
            Start with the essentials: player name, played date, the preloaded
            course, tee, and your entered handicap.
          </p>
        </div>
        <RoundSetupForm />
      </section>
    </div>
  );
}
