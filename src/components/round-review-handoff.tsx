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
      setSaveError("Fyll i alla 18 hål innan du sparar ronden.");
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
          "Ronden kunde inte sparas just nu. Försök igen.",
        );
      }
    });
  }

  if (!draft) {
    return (
      <div className="empty-card">
        <h2>Inget rondutkast hittades.</h2>
        <p className="muted">
          Slutför rondinställningen och hålregistreringen innan du granskar och
          sparar ronden.
        </p>
        <div className="actions-row">
          <Link className="button" href="/rounds/new">
            Gå till rondinställning
          </Link>
        </div>
      </div>
    );
  }

  const holeReferences = getHoleReferencesForDraft(draft);

  return (
    <div className="page-stack">
      <div className="step-progress" aria-label="Rondens framsteg">
        <span className="pill">Steg 4 av 4</span>
        <div className="step-progress__track" aria-hidden="true">
          <div className="step-progress__fill" style={{ width: "100%" }} />
        </div>
      </div>

      <div className="detail-card">
        <h2>Rondregistreringen är redo att sparas</h2>
        <p className="muted">
          Granska inställningarna och håltotalerna och spara sedan ronden för
          att beräkna totaler och Stablefordpoäng på serversidan.
        </p>
        <div className="summary-list">
          <div className="summary-row">
            <span className="muted">Spelare</span>
            <strong>{draft.setup.playerName}</strong>
          </div>
          <div className="summary-row">
            <span className="muted">Bana</span>
            <strong>{draft.setup.courseLabel}</strong>
          </div>
          <div className="summary-row">
            <span className="muted">Tee</span>
            <strong>{draft.setup.teeLabel}</strong>
          </div>
          <div className="summary-row">
            <span className="muted">Registrerat handicap</span>
            <strong>{draft.setup.enteredHandicap}</strong>
          </div>
          <div className="summary-row">
            <span className="muted">Totalt registrerade slag</span>
            <strong>{totals.strokes}</strong>
          </div>
          <div className="summary-row">
            <span className="muted">Totalt registrerade puttar</span>
            <strong>{totals.putts}</strong>
          </div>
        </div>
      </div>

      <div className="detail-card">
        <h2>Förhandsgranskning per hål</h2>
        <div className="review-grid">
          {holeReferences.map((hole) => {
            const entry = draft.holes.find(
              (item) => item.holeNumber === hole.holeNumber,
            );

            return (
              <div className="review-grid__item" key={hole.holeNumber}>
                <strong>Hål {hole.holeNumber}</strong>
                <span className="muted">Par {hole.par} / HCP {hole.strokeIndex}</span>
                <span>Slag: {entry?.strokes || "-"}</span>
                <span>Puttar: {entry?.putts || "-"}</span>
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
          Tillbaka till Bak 9
        </Link>
        <button
          className="button"
          disabled={isPending}
          onClick={handleSaveRound}
          type="button"
        >
          {isPending ? "Sparar rond..." : "Spara rond"}
        </button>
      </div>
    </div>
  );
}
