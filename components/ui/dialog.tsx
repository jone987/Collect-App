"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";

export interface DialogHandle {
  open: () => void;
  close: () => void;
}

interface DialogProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const Dialog = forwardRef<DialogHandle, DialogProps>(function Dialog(
  { title, description, children },
  ref
) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    open: () => dialogRef.current?.showModal(),
    close: () => dialogRef.current?.close(),
  }));

  return (
    <dialog
      ref={dialogRef}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current?.close();
      }}
      className="w-[calc(100%-2rem)] max-w-md rounded-lg border border-gray-200 p-0 shadow-lg backdrop:bg-gray-900/40"
    >
      <div className="max-h-[calc(100vh-4rem)] overflow-y-auto p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
        <div className="mt-4">{children}</div>
      </div>
    </dialog>
  );
});
