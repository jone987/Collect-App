"use client";

import { useTransition } from "react";
import { deleteCustomer } from "../actions";

export function DeleteCustomerButton({ customerId }: { customerId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        if (confirm("Delete this customer and all their follow-ups?")) {
          startTransition(() => deleteCustomer(customerId));
        }
      }}
      className="text-sm text-red-600 hover:underline"
    >
      Delete customer
    </button>
  );
}
