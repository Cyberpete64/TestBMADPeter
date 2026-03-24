import { RoundReviewHandoff } from "@/components/round-review-handoff";

export default function ReviewPage() {
  return (
    <div className="page-stack">
      <section className="page-card">
        <div className="step-header">
          <span className="pill">Step 4 of 4</span>
          <h1 className="page-title">Review captured entry before save</h1>
          <p className="page-intro">
            Confirm the round details, then save to calculate totals and
            Stableford points.
          </p>
        </div>
        <RoundReviewHandoff />
      </section>
    </div>
  );
}
