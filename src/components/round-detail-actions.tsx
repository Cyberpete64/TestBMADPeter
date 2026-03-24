"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { deleteRoundAction } from "@/app/rounds/[id]/actions";

type RoundDetailActionsProps = {
  roundId: string;
};

export function RoundDetailActions({ roundId }: RoundDetailActionsProps) {
  const router = useRouter();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDeleteRound() {
    setDeleteError(null);

    startTransition(async () => {
      try {
        await deleteRoundAction(roundId);
        router.push("/");
        router.refresh();
      } catch {
        setDeleteError("The round could not be deleted right now.");
      }
    });
  }

  return (
    <div className="page-stack">
      <div className="actions-row">
        <Link className="button-secondary" href="/">
          Back to Dashboard
        </Link>
        <Link className="button-secondary" href={`/rounds/${roundId}/edit`}>
          Edit Round
        </Link>
        <button
          aria-describedby="delete-round-hint"
          className="button-danger"
          disabled={isPending}
          onClick={() => setIsConfirmingDelete(true)}
          type="button"
        >
          Delete Round
        </button>
      </div>
      <p className="muted" id="delete-round-hint">
        Deleting a saved round removes it from the dashboard, history, and all
        calculated statistics.
      </p>
      {isConfirmingDelete ? (
        <div aria-live="assertive" className="detail-card" role="alert">
          <h2>Delete this saved round?</h2>
          <p className="muted">
            This action cannot be undone once the round is deleted.
          </p>
          <div className="actions-row">
            <button
              className="button-secondary"
              disabled={isPending}
              onClick={() => setIsConfirmingDelete(false)}
              type="button"
            >
              Cancel
            </button>
            <button
              className="button-danger"
              disabled={isPending}
              onClick={handleDeleteRound}
              type="button"
            >
              {isPending ? "Deleting..." : "Yes, Delete Round"}
            </button>
          </div>
        </div>
      ) : null}
      {deleteError ? (
        <div aria-live="assertive" className="form-error" role="alert">
          {deleteError}
        </div>
      ) : null}
    </div>
  );
}
