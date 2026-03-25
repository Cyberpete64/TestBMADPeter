import { RoundReviewHandoff } from "@/components/round-review-handoff";

export default function ReviewPage() {
  return (
    <div className="page-stack">
      <section className="page-card">
        <div className="step-header">
          <span className="pill">Steg 4 av 4</span>
          <h1 className="page-title">Granska registreringen innan du sparar</h1>
          <p className="page-intro">
            Bekräfta rondens uppgifter och spara för att beräkna totaler och
            Stablefordpoäng.
          </p>
        </div>
        <RoundReviewHandoff />
      </section>
    </div>
  );
}
