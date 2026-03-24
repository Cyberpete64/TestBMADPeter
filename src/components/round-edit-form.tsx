"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { updateRoundDraftAction } from "@/app/rounds/[id]/actions";
import {
  availableTees,
  getHoleReferencesForTee,
  primaryCourse,
} from "@/lib/golf-course-data";
import type { PersistedRound } from "@/lib/round-domain";
import { createDraftFromPersistedRound } from "@/lib/round-drafts";
import type { HoleEntry, RoundEntryDraft } from "@/lib/round-entry";

type RoundEditFormProps = {
  round: PersistedRound;
};

type SetupFieldErrors = {
  playerName?: string;
  playedOn?: string;
  teeCode?: string;
  enteredHandicap?: string;
};

type HoleErrors = Record<number, { strokes?: string; putts?: string }>;

function buildDescribedByIds(...ids: Array<string | undefined>) {
  const value = ids.filter(Boolean).join(" ");
  return value === "" ? undefined : value;
}

function getSelectedTeeLabel(teeCode: RoundEntryDraft["setup"]["teeCode"]) {
  return availableTees.find((tee) => tee.code === teeCode)?.label ?? "Yellow tee";
}

export function RoundEditForm({ round }: RoundEditFormProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<RoundEntryDraft>(() =>
    createDraftFromPersistedRound(round),
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [setupErrors, setSetupErrors] = useState<SetupFieldErrors>({});
  const [holeErrors, setHoleErrors] = useState<HoleErrors>({});
  const [isPending, startTransition] = useTransition();

  const holeReferences = useMemo(
    () => getHoleReferencesForTee(draft.setup.teeCode),
    [draft.setup.teeCode],
  );

  const frontNine = holeReferences.slice(0, 9);
  const backNine = holeReferences.slice(9);

  function updateSetupField(
    field: keyof RoundEntryDraft["setup"],
    value: string,
  ) {
    const teeCode =
      field === "teeCode"
        ? (value as RoundEntryDraft["setup"]["teeCode"])
        : draft.setup.teeCode;

    setDraft((current) => ({
      ...current,
      setup: {
        ...current.setup,
        [field]: field === "teeCode" ? teeCode : value,
        teeCode,
        teeLabel: getSelectedTeeLabel(teeCode),
        courseSlug: primaryCourse.slug,
        courseLabel: primaryCourse.displayName,
        courseShortLabel: primaryCourse.shortLabel,
      },
    }));
    if (
      field === "playerName" ||
      field === "playedOn" ||
      field === "teeCode" ||
      field === "enteredHandicap"
    ) {
      setSetupErrors((current) => ({
        ...current,
        [field]: undefined,
      }));
    }
    setFormError(null);
  }

  function updateHole(
    holeNumber: number,
    field: keyof HoleEntry,
    value: string,
  ) {
    if (field === "holeNumber") {
      return;
    }

    const sanitizedValue = value.replace(/[^\d]/g, "");

    setDraft((current) => ({
      ...current,
      holes: current.holes.map((hole) =>
        hole.holeNumber === holeNumber
          ? { ...hole, [field]: sanitizedValue }
          : hole,
      ),
    }));
    setHoleErrors((current) => ({
      ...current,
      [holeNumber]: {
        ...current[holeNumber],
        [field]: undefined,
      },
    }));
    setFormError(null);
  }

  function validateDraft() {
    const nextSetupErrors: SetupFieldErrors = {};
    const nextHoleErrors: HoleErrors = {};

    if (draft.setup.playerName.trim() === "") {
      nextSetupErrors.playerName = "Enter the player name before saving.";
    }

    if (draft.setup.playedOn.trim() === "") {
      nextSetupErrors.playedOn = "Choose the played date before saving.";
    }

    if (
      draft.setup.enteredHandicap.trim() === "" ||
      Number.isNaN(Number(draft.setup.enteredHandicap)) ||
      Number(draft.setup.enteredHandicap) < 0
    ) {
      nextSetupErrors.enteredHandicap = "Enter a valid handicap before saving.";
    }

    for (const hole of draft.holes) {
      if (hole.strokes.trim() === "") {
        nextHoleErrors[hole.holeNumber] = {
          ...nextHoleErrors[hole.holeNumber],
          strokes: "Enter strokes.",
        };
      }

      if (hole.putts.trim() === "") {
        nextHoleErrors[hole.holeNumber] = {
          ...nextHoleErrors[hole.holeNumber],
          putts: "Enter putts.",
        };
      }
    }

    setSetupErrors(nextSetupErrors);
    setHoleErrors(nextHoleErrors);

    if (Object.keys(nextSetupErrors).length > 0) {
      setFormError("Fix the setup details before saving this round.");
      return false;
    }

    if (Object.keys(nextHoleErrors).length > 0) {
      setFormError("Complete strokes and putts for all 18 holes before saving.");
      return false;
    }

    return true;
  }

  function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateDraft()) {
      return;
    }

    startTransition(async () => {
      try {
        await updateRoundDraftAction(round.id, draft);
        router.push(`/rounds/${round.id}`);
        router.refresh();
      } catch {
        setFormError("The round could not be updated right now.");
      }
    });
  }

  function renderHoleSection(
    title: string,
    intro: string,
    holes: typeof holeReferences,
  ) {
    return (
      <section className="detail-card">
        <div className="detail-card__header">
          <div>
            <h2>{title}</h2>
            <p className="muted">{intro}</p>
          </div>
          <span className="pill">{draft.setup.teeLabel}</span>
        </div>

        <div className="hole-grid">
          {holes.map((hole) => {
            const entry = draft.holes.find(
              (item) => item.holeNumber === hole.holeNumber,
            );

            return (
              <article className="hole-card" key={hole.holeNumber}>
                <div className="hole-card__top">
                  <div>
                    <div className="hole-card__eyebrow">Hole {hole.holeNumber}</div>
                    <div className="hole-card__title">
                      Par {hole.par} <span className="muted">/ SI {hole.strokeIndex}</span>
                    </div>
                    <div className="field__hint">{hole.distanceMeters} meters</div>
                  </div>
                  <span className="pill">#{hole.holeNumber}</span>
                </div>

                <div className="hole-card__fields">
                  <div className="field">
                    <label htmlFor={`strokes-${hole.holeNumber}`}>Strokes</label>
                    <input
                      id={`strokes-${hole.holeNumber}`}
                      aria-describedby={buildDescribedByIds(
                        holeErrors[hole.holeNumber]?.strokes
                          ? `strokes-${hole.holeNumber}-error`
                          : undefined,
                      )}
                      aria-invalid={Boolean(holeErrors[hole.holeNumber]?.strokes)}
                      inputMode="numeric"
                      value={entry?.strokes ?? ""}
                      onChange={(event) =>
                        updateHole(hole.holeNumber, "strokes", event.target.value)
                      }
                    />
                    {holeErrors[hole.holeNumber]?.strokes ? (
                      <div
                        className="field__error"
                        id={`strokes-${hole.holeNumber}-error`}
                        role="alert"
                      >
                        {holeErrors[hole.holeNumber]?.strokes}
                      </div>
                    ) : null}
                  </div>

                  <div className="field">
                    <label htmlFor={`putts-${hole.holeNumber}`}>Putts</label>
                    <input
                      id={`putts-${hole.holeNumber}`}
                      aria-describedby={buildDescribedByIds(
                        holeErrors[hole.holeNumber]?.putts
                          ? `putts-${hole.holeNumber}-error`
                          : undefined,
                      )}
                      aria-invalid={Boolean(holeErrors[hole.holeNumber]?.putts)}
                      inputMode="numeric"
                      value={entry?.putts ?? ""}
                      onChange={(event) =>
                        updateHole(hole.holeNumber, "putts", event.target.value)
                      }
                    />
                    {holeErrors[hole.holeNumber]?.putts ? (
                      <div
                        className="field__error"
                        id={`putts-${hole.holeNumber}-error`}
                        role="alert"
                      >
                        {holeErrors[hole.holeNumber]?.putts}
                      </div>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <form className="page-stack" noValidate onSubmit={handleSave}>
      <section className="page-card">
        <div className="step-header">
          <span className="pill">Edit round</span>
          <h1 className="page-title">Update saved round</h1>
          <p className="page-intro">
            Adjust the setup or hole-by-hole entry and save to recalculate the
            round totals and Stableford points.
          </p>
        </div>

        <div className="form-grid">
          <div className="field">
            <label htmlFor="playerName">Player name</label>
            <input
              id="playerName"
              aria-describedby={buildDescribedByIds(
                setupErrors.playerName ? "playerName-error" : undefined,
              )}
              aria-invalid={Boolean(setupErrors.playerName)}
              value={draft.setup.playerName}
              onChange={(event) =>
                updateSetupField("playerName", event.target.value)
              }
            />
            {setupErrors.playerName ? (
              <div className="field__error" id="playerName-error" role="alert">
                {setupErrors.playerName}
              </div>
            ) : null}
          </div>

          <div className="field">
            <label htmlFor="playedOn">Played date</label>
            <input
              id="playedOn"
              type="date"
              aria-describedby={buildDescribedByIds(
                setupErrors.playedOn ? "playedOn-error" : undefined,
              )}
              aria-invalid={Boolean(setupErrors.playedOn)}
              value={draft.setup.playedOn}
              onChange={(event) => updateSetupField("playedOn", event.target.value)}
            />
            {setupErrors.playedOn ? (
              <div className="field__error" id="playedOn-error" role="alert">
                {setupErrors.playedOn}
              </div>
            ) : null}
          </div>

          <div className="field">
            <label htmlFor="courseLabel">Course</label>
            <input
              id="courseLabel"
              aria-describedby="courseLabel-hint"
              value={primaryCourse.displayName}
              disabled
              readOnly
            />
            <div className="field__hint" id="courseLabel-hint">
              Version 1 is fixed to {primaryCourse.shortLabel} only.
            </div>
          </div>

          <div className="field">
            <label htmlFor="teeCode">Tee</label>
            <select
              id="teeCode"
              aria-describedby={buildDescribedByIds(
                setupErrors.teeCode ? "teeCode-error" : undefined,
              )}
              aria-invalid={Boolean(setupErrors.teeCode)}
              value={draft.setup.teeCode}
              onChange={(event) => updateSetupField("teeCode", event.target.value)}
            >
              {availableTees.map((tee) => (
                <option key={tee.code} value={tee.code}>
                  {tee.label}
                </option>
              ))}
            </select>
            {setupErrors.teeCode ? (
              <div className="field__error" id="teeCode-error" role="alert">
                {setupErrors.teeCode}
              </div>
            ) : null}
          </div>

          <div className="field">
            <label htmlFor="enteredHandicap">Entered handicap</label>
            <input
              id="enteredHandicap"
              inputMode="decimal"
              aria-describedby={buildDescribedByIds(
                setupErrors.enteredHandicap ? "enteredHandicap-error" : undefined,
              )}
              aria-invalid={Boolean(setupErrors.enteredHandicap)}
              value={draft.setup.enteredHandicap}
              onChange={(event) =>
                updateSetupField("enteredHandicap", event.target.value)
              }
            />
            {setupErrors.enteredHandicap ? (
              <div
                className="field__error"
                id="enteredHandicap-error"
                role="alert"
              >
                {setupErrors.enteredHandicap}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {renderHoleSection("Front 9", "Review and update holes 1-9.", frontNine)}
      {renderHoleSection("Back 9", "Review and update holes 10-18.", backNine)}

      {formError ? (
        <div aria-live="assertive" className="form-error" role="alert">
          {formError}
        </div>
      ) : null}

      <div className="sticky-action sticky-action--split">
        <Link className="button-secondary" href={`/rounds/${round.id}`}>
          Cancel
        </Link>
        <button className="button" disabled={isPending} type="submit">
          {isPending ? "Saving Changes..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
