"use client";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { deleteCustomer } from "../actions";

export function DeleteCustomerButton({
  customerId,
  customerName,
}: {
  customerId: string;
  customerName: string;
}) {
  return (
    <ConfirmDialog
      trigger={(open) => (
        <Button variant="secondary" size="sm" onClick={open}>
          Delete customer
        </Button>
      )}
      title="Delete customer?"
      description={`This permanently deletes ${customerName} and all of their follow-ups. This can't be undone.`}
      onConfirm={() => deleteCustomer(customerId)}
    />
  );
}
