"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";

import { saveRoundDraftAction } from "@/app/rounds/new/review/actions";
import {
  clearRoundEntryDraft,
  getHoleReferencesForDraft,
  isRoundEntryDraftComplete,
  readRoundEntryDraft,
  type RoundEntryDraft,
} from "@/lib/round-entry";
import { clearRoundSetupFromStorage } from "@/lib/round-setup";

export function RoundReviewHandoff() {
  const router = useRouter();
  const [draft, setDraft] = useState<RoundEntryDraft | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setDraft(readRoundEntryDraft());
  }, []);

  const totals = useMemo(() => {
    if (!draft) {
      return { strokes: 0, putts: 0 };
    }

    return draft.holes.reduce(
      (accumulator, hole) => ({
        strokes: accumulator.strokes + Number(hole.strokes || 0),
        putts: accumulator.putts + Number(hole.putts || 0),
      }),
      { strokes: 0, putts: 0 },
    );
  }, [draft]);

  function handleSaveRound() {
    if (!draft) {
      return;
    }

    if (!isRoundEntryDraftComplete(draft)) {
      setSaveError("Complete all 18 holes before saving the round.");
      return;
    }

    setSaveError(null);

    startTransition(async () => {
      try {
        const result = await saveRoundDraftAction(draft);
        clearRoundEntryDraft();
        clearRoundSetupFromStorage();
        router.push(`/rounds/${result.roundId}`);
      } catch {
        setSaveError(
          "The round could not be saved right now. Please try again.",
        );
      }
    });
  }

  if (!draft) {
    return (
      <div className="empty-card">
        <h2>No hole entry draft found.</h2>
        <p className="muted">
          Complete round setup and hole entry before reviewing and saving the
          round.
        </p>
        <div className="actions-row">
          <Link className="button" href="/rounds/new">
            Go to Round Setup
          </Link>
        </div>
      </div>
    );
  }

  const holeReferences = getHoleReferencesForDraft(draft);

  return (
    <div className="page-stack">
      <div className="step-progress" aria-label="Round progress">
        <span className="pill">Step 4 of 4</span>
        <div className="step-progress__track" aria-hidden="true">
          <div className="step-progress__fill" style={{ width: "100%" }} />
        </div>
      </div>

      <div className="detail-card">
        <h2>Round entry ready to save</h2>
        <p className="muted">
          Review the setup and hole totals, then save the round to calculate
          totals and Stableford points server-side.
        </p>
        <div className="summary-list">
          <div className="summary-row">
            <span className="muted">Player</span>
            <strong>{draft.setup.playerName}</strong>
          </div>
          <div className="summary-row">
            <span className="muted">Course</span>
            <strong>{draft.setup.courseLabel}</strong>
          </div>
          <div className="summary-row">
            <span className="muted">Tee</span>
            <strong>{draft.setup.teeLabel}</strong>
          </div>
          <div className="summary-row">
            <span className="muted">Entered handicap</span>
            <strong>{draft.setup.enteredHandicap}</strong>
          </div>
          <div className="summary-row">
            <span className="muted">Total strokes entered</span>
            <strong>{totals.strokes}</strong>
          </div>
          <div className="summary-row">
            <span className="muted">Total putts entered</span>
            <strong>{totals.putts}</strong>
          </div>
        </div>
      </div>

      <div className="detail-card">
        <h2>Hole capture preview</h2>
        <div className="review-grid">
          {holeReferences.map((hole) => {
            const entry = draft.holes.find(
              (item) => item.holeNumber === hole.holeNumber,
            );

            return (
              <div className="review-grid__item" key={hole.holeNumber}>
                <strong>Hole {hole.holeNumber}</strong>
                <span className="muted">Par {hole.par} / SI {hole.strokeIndex}</span>
                <span>Strokes: {entry?.strokes || "-"}</span>
                <span>Putts: {entry?.putts || "-"}</span>
              </div>
            );
          })}
        </div>
      </div>

      {saveError ? (
        <div aria-live="assertive" className="form-error" role="alert">
          {saveError}
        </div>
      ) : null}

      <div className="sticky-action sticky-action--split">
        <Link className="button-secondary" href="/rounds/new/back-nine">
          Back to Back 9
        </Link>
        <button
          className="button"
          disabled={isPending}
          onClick={handleSaveRound}
          type="button"
        >
          {isPending ? "Saving Round..." : "Save Round"}
        </button>
      </div>
    </div>
  );
}
