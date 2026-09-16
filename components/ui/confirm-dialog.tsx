"use client";

import { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Dialog, type DialogHandle } from "@/components/ui/dialog";

interface ConfirmDialogProps {
  trigger: (open: () => void) => React.ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => Promise<{ error?: string } | void>;
}

/** A destructive-action confirmation modal. `onConfirm` may redirect (e.g. after
 * deleting the record the user is currently viewing) — in that case the dialog
 * simply never gets a chance to close, which is fine. */
export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "Delete",
  onConfirm,
}: ConfirmDialogProps) {
  const dialogRef = useRef<DialogHandle>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleConfirm() {
    setError(null);
    startTransition(async () => {
      const result = await onConfirm();
      if (result?.error) {
        setError(result.error);
        return;
      }
      dialogRef.current?.close();
    });
  }

  return (
    <>
      {trigger(() => {
        setError(null);
        dialogRef.current?.open();
      })}
      <Dialog ref={dialogRef} title={title} description={description}>
        <div className="space-y-3">
          {error && <Alert variant="error">{error}</Alert>}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              disabled={isPending}
              onClick={() => dialogRef.current?.close()}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              disabled={isPending}
              onClick={handleConfirm}
            >
              {isPending ? "Deleting…" : confirmLabel}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
