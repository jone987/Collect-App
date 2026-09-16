"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export function RouteError({
  error,
  reset,
  title = "Something went wrong",
}: {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="rounded-lg border border-red-100 bg-red-50 p-6 text-center">
        <p className="text-sm font-medium text-red-800">{title}</p>
        <p className="mt-1 text-sm text-red-600">
          {error.message || "An unexpected error occurred."}
        </p>
        <Button className="mt-4" variant="secondary" onClick={() => reset()}>
          Try again
        </Button>
      </div>
    </div>
  );
}
