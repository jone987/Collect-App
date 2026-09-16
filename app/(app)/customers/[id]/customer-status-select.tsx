"use client";

import { useState, useTransition } from "react";
import { Select } from "@/components/ui/field";
import { CUSTOMER_STATUSES } from "@/lib/validation/customer";
import type { CustomerStatus } from "@/types/database";
import { updateCustomerStatus } from "../actions";

export function CustomerStatusSelect({
  customerId,
  status,
}: {
  customerId: string;
  status: CustomerStatus;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <Select
        value={status}
        disabled={isPending}
        invalid={!!error}
        onChange={(event) => {
          const next = event.target.value as CustomerStatus;
          setError(null);
          startTransition(async () => {
            const result = await updateCustomerStatus(customerId, next);
            if (result?.error) setError(result.error);
          });
        }}
        className="w-auto"
      >
        {CUSTOMER_STATUSES.map((value) => (
          <option key={value} value={value}>
            {value[0].toUpperCase() + value.slice(1)}
          </option>
        ))}
      </Select>
      {error && (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
