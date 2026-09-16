"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";
import { Dialog, type DialogHandle } from "@/components/ui/dialog";
import { CUSTOMER_STATUSES } from "@/lib/validation/customer";
import { initialFormState } from "@/lib/form-state";
import { createCustomer } from "./actions";

export function NewCustomerDialog() {
  const dialogRef = useRef<DialogHandle>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(
    createCustomer,
    initialFormState
  );

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      dialogRef.current?.close();
    }
  }, [state]);

  const errors = state.errors ?? {};

  return (
    <>
      <Button onClick={() => dialogRef.current?.open()}>Add customer</Button>
      <Dialog
        ref={dialogRef}
        title="Add customer"
        description="Track who owes you and how to reach them."
      >
        <form ref={formRef} action={formAction} className="space-y-4">
          <Field label="Name" htmlFor="name" required error={errors.name?.[0]}>
            <Input
              id="name"
              name="name"
              required
              invalid={!!errors.name}
              placeholder="Jordan Smith"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Contact"
              htmlFor="contact"
              error={errors.contact?.[0]}
            >
              <Input
                id="contact"
                name="contact"
                invalid={!!errors.contact}
                placeholder="jordan@email.com"
              />
            </Field>
            <Field label="Job" htmlFor="job" error={errors.job?.[0]}>
              <Input
                id="job"
                name="job"
                invalid={!!errors.job}
                placeholder="Kitchen remodel"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Amount owed"
              htmlFor="amount_owed"
              error={errors.amount_owed?.[0]}
            >
              <Input
                id="amount_owed"
                name="amount_owed"
                type="number"
                step="0.01"
                min="0"
                defaultValue="0"
                invalid={!!errors.amount_owed}
              />
            </Field>
            <Field label="Status" htmlFor="status" error={errors.status?.[0]}>
              <Select
                id="status"
                name="status"
                defaultValue="active"
                invalid={!!errors.status}
              >
                {CUSTOMER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status[0].toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <Field label="Notes" htmlFor="notes" error={errors.notes?.[0]}>
            <Textarea
              id="notes"
              name="notes"
              rows={2}
              invalid={!!errors.notes}
            />
          </Field>

          {state.status === "error" && state.message && (
            <Alert variant="error">{state.message}</Alert>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => dialogRef.current?.close()}
            >
              Cancel
            </Button>
            <SubmitButton>Add customer</SubmitButton>
          </div>
        </form>
      </Dialog>
    </>
  );
}
