"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
        <h2>No round setup found.</h2>
        <p className="muted">
          Start with the setup step before continuing into front nine.
        </p>
        <div className="actions-row">
          <Link className="button" href="/rounds/new">
            Go to Round Setup
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <div className="step-progress" aria-label="Round progress">
        <span className="pill">Step 1 of 3 complete</span>
        <div className="step-progress__track" aria-hidden="true">
          <div className="step-progress__fill" style={{ width: "34%" }} />
        </div>
      </div>

      <div className="detail-card">
        <h2>Setup summary</h2>
        <div className="summary-list">
          <div className="summary-row">
            <span className="muted">Player</span>
            <strong>{setup.playerName}</strong>
          </div>
          <div className="summary-row">
            <span className="muted">Played date</span>
            <strong>{setup.playedOn}</strong>
          </div>
          <div className="summary-row">
            <span className="muted">Course</span>
            <strong>{setup.courseLabel}</strong>
          </div>
          <div className="summary-row">
            <span className="muted">Tee</span>
            <strong>{setup.teeLabel}</strong>
          </div>
          <div className="summary-row">
            <span className="muted">Entered handicap</span>
            <strong>{setup.enteredHandicap}</strong>
          </div>
        </div>
      </div>

      <div className="detail-card">
        <h2>What comes next</h2>
        <p className="muted">
          The next slice will replace this handoff page with hole cards for
          strokes and putts on holes 1 to 9.
        </p>
        <div className="actions-row">
          <Link className="button" href="/rounds/new">
            Edit Setup
          </Link>
        </div>
      </div>
    </div>
  );
}
