import { RoundSetupForm } from "@/components/round-setup-form";

export default function NewRoundPage() {
  return (
    <div className="page-stack">
      <section className="page-card">
        <div className="step-header">
          <span className="pill">Steg 1</span>
          <h1 className="page-title">Ställ in en giltig rond</h1>
          <p className="page-intro">
            Börja med grunderna: spelarnamn, speldatum, den förladdade
            banan, vald tee och ditt registrerade handicap.
          </p>
        </div>
        <RoundSetupForm />
      </section>
    </div>
  );
}
