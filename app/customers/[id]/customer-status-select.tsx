"use client";

import { useTransition } from "react";
import { updateCustomerStatus } from "../actions";
import type { CustomerStatus } from "@/types/database";

export function CustomerStatusSelect({
  customerId,
  status,
}: {
  customerId: string;
  status: CustomerStatus;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) =>
        startTransition(() =>
          updateCustomerStatus(customerId, e.target.value as CustomerStatus)
        )
      }
      className="rounded-md border border-gray-300 px-2 py-1 text-sm"
    >
      <option value="active">Active</option>
      <option value="overdue">Overdue</option>
      <option value="paid">Paid</option>
      <option value="closed">Closed</option>
    </select>
  );
}
