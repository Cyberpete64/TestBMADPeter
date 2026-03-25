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
        setDeleteError("Ronden kunde inte tas bort just nu.");
      }
    });
  }

  return (
    <div className="page-stack">
      <div className="actions-row">
        <Link className="button-secondary" href="/">
          Till översikten
        </Link>
        <Link className="button-secondary" href={`/rounds/${roundId}/edit`}>
          Redigera rond
        </Link>
        <button
          aria-describedby="delete-round-hint"
          className="button-danger"
          disabled={isPending}
          onClick={() => setIsConfirmingDelete(true)}
          type="button"
        >
          Ta bort rond
        </button>
      </div>
      <p className="muted" id="delete-round-hint">
        När du tar bort en sparad rond försvinner den från översikten,
        historiken och all beräknad statistik.
      </p>
      {isConfirmingDelete ? (
        <div aria-live="assertive" className="detail-card" role="alert">
          <h2>Ta bort den här sparade ronden?</h2>
          <p className="muted">
            Åtgärden kan inte ångras när ronden väl är borttagen.
          </p>
          <div className="actions-row">
            <button
              className="button-secondary"
              disabled={isPending}
              onClick={() => setIsConfirmingDelete(false)}
              type="button"
            >
              Avbryt
            </button>
            <button
              className="button-danger"
              disabled={isPending}
              onClick={handleDeleteRound}
              type="button"
            >
              {isPending ? "Tar bort..." : "Ja, ta bort ronden"}
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
