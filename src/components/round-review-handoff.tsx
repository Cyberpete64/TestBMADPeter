"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";

import { getActiveRoundDraftAction } from "@/app/rounds/new/draft/actions";
import { saveRoundDraftAction } from "@/app/rounds/new/review/actions";
import {
  clearRoundEntryDraft,
  getHoleReferencesForDraft,
  isRoundEntryDraftComplete,
  persistRoundEntryDraft,
  readRoundEntryDraft,
  type RoundEntryDraft,
} from "@/lib/round-entry";
import {
  getHandicapCalculationGenderLabel,
  getTeeRating,
} from "@/lib/golf-course-data";
import { isValidHandicapInput, parseHandicapInput } from "@/lib/handicap";
import {
  clearRoundSetupFromStorage,
  persistRoundSetupToStorage,
} from "@/lib/round-setup";
import { calculatePlayingHandicap } from "@/lib/scoring";

export function RoundReviewHandoff() {
  const router = useRouter();
  const [draft, setDraft] = useState<RoundEntryDraft | null>(null);
  const [isLoadingDraft, setIsLoadingDraft] = useState(true);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const storedDraft = readRoundEntryDraft();

    if (storedDraft) {
      setDraft(storedDraft);
      setIsLoadingDraft(false);
      return;
    }

    let isCurrent = true;

    void getActiveRoundDraftAction()
      .then((serverDraft) => {
        if (!isCurrent) {
          return;
        }

        if (serverDraft) {
          persistRoundSetupToStorage(serverDraft.setup);
          persistRoundEntryDraft(serverDraft);
          setDraft(serverDraft);
        }

        setIsLoadingDraft(false);
      })
      .catch(() => {
        if (isCurrent) {
          setIsLoadingDraft(false);
        }
      });

    return () => {
      isCurrent = false;
    };
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

  const handicapSummary = useMemo(() => {
    if (!draft || !isValidHandicapInput(draft.setup.enteredHandicap)) {
      return null;
    }

    const teeRating = getTeeRating(
      draft.setup.teeCode,
      draft.setup.handicapCalculationGender,
    );

    return {
      label: getHandicapCalculationGenderLabel(
        draft.setup.handicapCalculationGender,
      ),
      playingHandicap: calculatePlayingHandicap(
        parseHandicapInput(draft.setup.enteredHandicap),
        teeRating,
      ),
      teeRating,
    };
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

  if (isLoadingDraft) {
    return (
      <div className="empty-card">
        <h2>Hämtar rondutkast...</h2>
        <p className="muted">Vänta ett ögonblick medan vi letar efter sparad score.</p>
      </div>
    );
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
          {handicapSummary ? (
            <>
              <div className="summary-row">
                <span className="muted">HCP-tabell</span>
                <strong>{handicapSummary.label}</strong>
              </div>
              <div className="summary-row">
                <span className="muted">Spelhandicap</span>
                <strong>{handicapSummary.playingHandicap}</strong>
              </div>
              <div className="summary-row">
                <span className="muted">CR/Slope</span>
                <strong>
                  {handicapSummary.teeRating.courseRating} /{" "}
                  {handicapSummary.teeRating.slopeRating}
                </strong>
              </div>
            </>
          ) : null}
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
