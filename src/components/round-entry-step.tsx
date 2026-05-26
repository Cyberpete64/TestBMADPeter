"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import type { HoleReference } from "@/lib/golf-course-data";
import type { GeoPoint } from "@/lib/geo-distance";
import {
  formatDistanceMeters,
  getDistanceMeters,
} from "@/lib/geo-distance";
import { readRoundSetupFromStorage, type RoundSetup } from "@/lib/round-setup";
import {
  ensureRoundEntryDraft,
  getHoleReferencesForDraft,
  persistRoundEntryDraft,
  updateHoleEntry,
  type RoundEntryDraft,
} from "@/lib/round-entry";

type RoundEntryStepProps = {
  title: string;
  intro: string;
  holeRange: [number, number];
  progressLabel: string;
  progressWidth: string;
  primaryActionLabel: string;
  nextHref: string;
  backHref: string;
};

type HoleErrorMap = Record<number, { strokes?: string; putts?: string }>;
type LiveGpsStatus =
  | "idle"
  | "locating"
  | "active"
  | "unsupported"
  | "denied"
  | "unavailable";

type LiveGpsState = {
  status: LiveGpsStatus;
  position: GeoPoint | null;
  accuracyMeters: number | null;
  updatedAt: Date | null;
  message: string | null;
};

const initialGpsState: LiveGpsState = {
  status: "idle",
  position: null,
  accuracyMeters: null,
  updatedAt: null,
  message: null,
};

function buildDescribedByIds(...ids: Array<string | undefined>) {
  const value = ids.filter(Boolean).join(" ");
  return value === "" ? undefined : value;
}

function formatPositionTime(value: Date) {
  return value.toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function getGpsErrorState(error: GeolocationPositionError): LiveGpsState {
  if (error.code === error.PERMISSION_DENIED) {
    return {
      ...initialGpsState,
      status: "denied",
      message:
        "Platsåtkomst nekades. Tillåt platsåtkomst i webbläsaren för att visa GPS-avstånd.",
    };
  }

  if (error.code === error.TIMEOUT) {
    return {
      ...initialGpsState,
      status: "unavailable",
      message:
        "GPS-positionen hann inte hämtas. Prova igen med fri sikt mot himlen.",
    };
  }

  return {
    ...initialGpsState,
    status: "unavailable",
    message: "GPS-positionen är inte tillgänglig just nu.",
  };
}

function getGpsStatusText(gpsState: LiveGpsState) {
  if (gpsState.status === "idle") {
    return "Starta GPS för live-avstånd till green. Positionen sparas inte.";
  }

  if (gpsState.status === "locating") {
    return "Väntar på GPS-position...";
  }

  if (gpsState.status === "active" && gpsState.updatedAt) {
    const accuracyText =
      gpsState.accuracyMeters === null
        ? ""
        : ` / noggrannhet ±${Math.round(gpsState.accuracyMeters)} m`;
    return `Live uppdaterat ${formatPositionTime(gpsState.updatedAt)}${accuracyText}.`;
  }

  return gpsState.message ?? "GPS-avstånd är inte tillgängligt just nu.";
}

function HoleGreenDistance({
  gpsState,
  hole,
}: {
  gpsState: LiveGpsState;
  hole: HoleReference;
}) {
  if (gpsState.status === "locating") {
    return (
      <div className="green-distance" aria-live="polite">
        <span className="green-distance__status">Väntar på GPS-position...</span>
      </div>
    );
  }

  if (!gpsState.position) {
    return (
      <div className="green-distance" aria-live="polite">
        <span className="green-distance__status">
          {gpsState.message ?? "GPS-avstånd är inte tillgängligt."}
        </span>
      </div>
    );
  }

  const frontDistance = getDistanceMeters(gpsState.position, hole.green.front);
  const centerDistance = getDistanceMeters(gpsState.position, hole.green.center);
  const backDistance = getDistanceMeters(gpsState.position, hole.green.back);

  return (
    <div className="green-distance" aria-live="polite">
      <div className="green-distance__row">
        <div>
          <span>Front</span>
          <strong>{formatDistanceMeters(frontDistance)}</strong>
        </div>
        <div>
          <span>Center</span>
          <strong>{formatDistanceMeters(centerDistance)}</strong>
        </div>
        <div>
          <span>Bak</span>
          <strong>{formatDistanceMeters(backDistance)}</strong>
        </div>
      </div>
      <p className="muted">
        Raka GPS-meter till green. Använd inte slope, vind eller klubbrekommendation
        vid tävling.
      </p>
    </div>
  );
}

export function RoundEntryStep({
  title,
  intro,
  holeRange,
  progressLabel,
  progressWidth,
  primaryActionLabel,
  nextHref,
  backHref,
}: RoundEntryStepProps) {
  const router = useRouter();
  const [setup, setSetup] = useState<RoundSetup | null>(null);
  const [draft, setDraft] = useState<RoundEntryDraft | null>(null);
  const [errors, setErrors] = useState<HoleErrorMap>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [gpsState, setGpsState] = useState<LiveGpsState>(initialGpsState);
  const gpsWatchId = useRef<number | null>(null);

  useEffect(() => {
    const storedSetup = readRoundSetupFromStorage();

    if (!storedSetup) {
      return;
    }

    const nextDraft = ensureRoundEntryDraft(storedSetup);
    setSetup(storedSetup);
    setDraft(nextDraft);
  }, []);

  useEffect(
    () => () => {
      if (gpsWatchId.current !== null) {
        navigator.geolocation.clearWatch(gpsWatchId.current);
      }
    },
    [],
  );

  const holeReferences = useMemo(() => {
    if (!draft) {
      return [];
    }

    return getHoleReferencesForDraft(draft).filter(
      (hole) => hole.holeNumber >= holeRange[0] && hole.holeNumber <= holeRange[1],
    );
  }, [draft, holeRange]);

  const visibleHoles = useMemo(() => {
    if (!draft) {
      return [];
    }

    return draft.holes.filter(
      (hole) => hole.holeNumber >= holeRange[0] && hole.holeNumber <= holeRange[1],
    );
  }, [draft, holeRange]);

  const isStepComplete = visibleHoles.every(
    (hole) => hole.strokes.trim() !== "" && hole.putts.trim() !== "",
  );

  function setHoleValue(
    holeNumber: number,
    field: "strokes" | "putts",
    value: string,
  ) {
    if (!draft) {
      return;
    }

    const sanitizedValue = value.replace(/[^\d]/g, "");
    const nextDraft = updateHoleEntry(draft, holeNumber, field, sanitizedValue);
    setDraft(nextDraft);
    persistRoundEntryDraft(nextDraft);
    setErrors((current) => ({
      ...current,
      [holeNumber]: {
        ...current[holeNumber],
        [field]: undefined,
      },
    }));
    setFormError(null);
  }

  function validateCurrentStep() {
    const nextErrors: HoleErrorMap = {};

    for (const hole of visibleHoles) {
      if (hole.strokes.trim() === "") {
        nextErrors[hole.holeNumber] = {
          ...nextErrors[hole.holeNumber],
          strokes: "Ange slag för det här hålet.",
        };
      }

      if (hole.putts.trim() === "") {
        nextErrors[hole.holeNumber] = {
          ...nextErrors[hole.holeNumber],
          putts: "Ange puttar för det här hålet.",
        };
      }
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setFormError("Fyll i slag och puttar för varje hål innan du fortsätter.");
      return false;
    }

    return true;
  }

  function startLiveGps() {
    if (!("geolocation" in navigator)) {
      setGpsState({
        ...initialGpsState,
        status: "unsupported",
        message:
          "Den här webbläsaren saknar stöd för GPS-positionering.",
      });
      return;
    }

    setGpsState({
      ...initialGpsState,
      status: "locating",
      message: "Väntar på GPS-position...",
    });

    if (gpsWatchId.current !== null) {
      navigator.geolocation.clearWatch(gpsWatchId.current);
    }

    gpsWatchId.current = navigator.geolocation.watchPosition(
      (position) => {
        setGpsState({
          status: "active",
          position: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          accuracyMeters: position.coords.accuracy,
          updatedAt: new Date(position.timestamp),
          message: null,
        });
      },
      (error) => {
        if (gpsWatchId.current !== null) {
          navigator.geolocation.clearWatch(gpsWatchId.current);
          gpsWatchId.current = null;
        }

        setGpsState(getGpsErrorState(error));
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5_000,
        timeout: 15_000,
      },
    );
  }

  function stopLiveGps() {
    if (gpsWatchId.current !== null) {
      navigator.geolocation.clearWatch(gpsWatchId.current);
      gpsWatchId.current = null;
    }

    setGpsState(initialGpsState);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateCurrentStep()) {
      return;
    }

    if (draft) {
      persistRoundEntryDraft(draft);
    }

    router.push(nextHref);
  }

  if (!setup || !draft) {
    return (
      <div className="empty-card">
          <h2>Du måste börja med rondens inställningar.</h2>
          <p className="muted">
          Börja med inställningssteget innan du registrerar hål för hål.
          </p>
          <div className="actions-row">
            <Link className="button" href="/rounds/new">
            Gå till rondinställning
            </Link>
          </div>
        </div>
    );
  }

  return (
    <form className="page-stack" noValidate onSubmit={handleSubmit}>
      <div className="step-progress" aria-label="Rondens framsteg">
        <span className="pill">{progressLabel}</span>
        <div className="step-progress__track" aria-hidden="true">
          <div className="step-progress__fill" style={{ width: progressWidth }} />
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-card__header">
          <div>
            <h2>{title}</h2>
            <p className="muted">{intro}</p>
          </div>
          <span className="pill">{setup.teeLabel}</span>
        </div>
        <div className="summary-list">
          <div className="summary-row">
            <span className="muted">Spelare</span>
            <strong>{setup.playerName}</strong>
          </div>
          <div className="summary-row">
            <span className="muted">Bana</span>
            <strong>{setup.courseShortLabel}</strong>
          </div>
          <div className="summary-row">
            <span className="muted">Speldatum</span>
            <strong>{setup.playedOn}</strong>
          </div>
          <div className="summary-row">
            <span className="muted">Registrerat handicap</span>
            <strong>{setup.enteredHandicap}</strong>
          </div>
        </div>

        <div className="gps-control">
          <div>
            <span className="pill">GPS-avstånd</span>
            <h3>Live till green</h3>
            <p className="muted">
              Visar front, center och bakkant för hålen i det här steget. GPS
              används bara lokalt i mobilen och sparas inte med ronden.
            </p>
          </div>
          <button
            className="button-secondary"
            onClick={
              gpsState.status === "active" || gpsState.status === "locating"
                ? stopLiveGps
                : startLiveGps
            }
            type="button"
          >
            {gpsState.status === "active" || gpsState.status === "locating"
              ? "Stoppa GPS"
              : "Starta GPS"}
          </button>
          <p className="gps-control__status" aria-live="polite">
            {getGpsStatusText(gpsState)}
          </p>
        </div>
      </div>

      <div className="hole-grid">
        {holeReferences.map((hole) => {
          const currentEntry = visibleHoles.find(
            (entry) => entry.holeNumber === hole.holeNumber,
          );

          return (
            <article className="hole-card" key={hole.holeNumber}>
              <div className="hole-card__top">
                <div>
                  <div className="hole-card__eyebrow">Hål {hole.holeNumber}</div>
                  <div className="hole-card__title">
                    Par {hole.par} <span className="muted">/ HCP {hole.strokeIndex}</span>
                  </div>
                </div>
                <span className="pill">#{hole.holeNumber}</span>
              </div>
              <div className="field__hint">{hole.distanceMeters} meter</div>
              {gpsState.status !== "idle" ? (
                <HoleGreenDistance gpsState={gpsState} hole={hole} />
              ) : null}

              <div className="hole-card__fields">
                <div className="field">
                  <label htmlFor={`strokes-${hole.holeNumber}`}>Slag</label>
                  <input
                    id={`strokes-${hole.holeNumber}`}
                    aria-describedby={buildDescribedByIds(
                      errors[hole.holeNumber]?.strokes
                        ? `strokes-${hole.holeNumber}-error`
                        : undefined,
                    )}
                    aria-invalid={Boolean(errors[hole.holeNumber]?.strokes)}
                    inputMode="numeric"
                    min="1"
                    placeholder="0"
                    value={currentEntry?.strokes ?? ""}
                    onChange={(event) =>
                      setHoleValue(hole.holeNumber, "strokes", event.target.value)
                    }
                  />
                  {errors[hole.holeNumber]?.strokes ? (
                    <div
                      className="field__error"
                      id={`strokes-${hole.holeNumber}-error`}
                      role="alert"
                    >
                      {errors[hole.holeNumber]?.strokes}
                    </div>
                  ) : null}
                </div>

                <div className="field">
                  <label htmlFor={`putts-${hole.holeNumber}`}>Puttar</label>
                  <input
                    id={`putts-${hole.holeNumber}`}
                    aria-describedby={buildDescribedByIds(
                      errors[hole.holeNumber]?.putts
                        ? `putts-${hole.holeNumber}-error`
                        : undefined,
                    )}
                    aria-invalid={Boolean(errors[hole.holeNumber]?.putts)}
                    inputMode="numeric"
                    min="0"
                    placeholder="0"
                    value={currentEntry?.putts ?? ""}
                    onChange={(event) =>
                      setHoleValue(hole.holeNumber, "putts", event.target.value)
                    }
                  />
                  {errors[hole.holeNumber]?.putts ? (
                    <div
                      className="field__error"
                      id={`putts-${hole.holeNumber}-error`}
                      role="alert"
                    >
                      {errors[hole.holeNumber]?.putts}
                    </div>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {formError ? (
        <div aria-live="assertive" className="form-error" role="alert">
          {formError}
        </div>
      ) : null}

      <div className="sticky-action sticky-action--split">
        <Link className="button-secondary" href={backHref}>
          Tillbaka
        </Link>
        <button className="button" disabled={!isStepComplete} type="submit">
          {primaryActionLabel}
        </button>
      </div>
    </form>
  );
}
