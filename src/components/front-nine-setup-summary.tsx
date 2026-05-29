"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getHandicapCalculationGenderLabel } from "@/lib/golf-course-data";
import {
  readRoundSetupFromStorage,
  type RoundSetup,
} from "@/lib/round-setup";

export function FrontNineSetupSummary() {
  const [setup, setSetup] = useState<RoundSetup | null>(null);

  useEffect(() => {
    setSetup(readRoundSetupFromStorage());
  }, []);

  if (!setup) {
    return (
      <div className="empty-card">
        <h2>Ingen rondinställning hittades.</h2>
        <p className="muted">
          Börja med inställningssteget innan du fortsätter till fram 9.
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
    <div className="page-stack">
      <div className="step-progress" aria-label="Rondens framsteg">
        <span className="pill">Steg 1 av 3 klart</span>
        <div className="step-progress__track" aria-hidden="true">
          <div className="step-progress__fill" style={{ width: "34%" }} />
        </div>
      </div>

      <div className="detail-card">
        <h2>Sammanfattning av inställningar</h2>
        <div className="summary-list">
          <div className="summary-row">
            <span className="muted">Spelare</span>
            <strong>{setup.playerName}</strong>
          </div>
          <div className="summary-row">
            <span className="muted">Speldatum</span>
            <strong>{setup.playedOn}</strong>
          </div>
          <div className="summary-row">
            <span className="muted">Bana</span>
            <strong>{setup.courseLabel}</strong>
          </div>
          <div className="summary-row">
            <span className="muted">Tee</span>
            <strong>{setup.teeLabel}</strong>
          </div>
          <div className="summary-row">
            <span className="muted">Registrerat handicap</span>
            <strong>{setup.enteredHandicap}</strong>
          </div>
          <div className="summary-row">
            <span className="muted">HCP-tabell</span>
            <strong>
              {getHandicapCalculationGenderLabel(
                setup.handicapCalculationGender,
              )}
            </strong>
          </div>
        </div>
      </div>

      <div className="detail-card">
        <h2>Vad händer härnäst?</h2>
        <p className="muted">
          Nästa del ersätter den här mellanvyn med hålkort för slag och puttar
          på hål 1 till 9.
        </p>
        <div className="actions-row">
          <Link className="button" href="/rounds/new">
            Redigera inställning
          </Link>
        </div>
      </div>
    </div>
  );
}
