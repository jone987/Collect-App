"use client";

import { useRef } from "react";
import { createFollowUp } from "../actions";

export function NewFollowUpForm({ customerId }: { customerId: string }) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createFollowUp(customerId, formData);
        formRef.current?.reset();
      }}
      className="grid grid-cols-1 gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <input
        name="reason"
        placeholder="Reason (e.g. call about invoice)"
        required
        className="rounded-md border border-gray-300 px-3 py-2 text-sm sm:col-span-2"
      />
      <input
        name="due_date"
        type="date"
        className="rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
      <select
        name="status"
        defaultValue="pending"
        className="rounded-md border border-gray-300 px-3 py-2 text-sm"
      >
        <option value="pending">Pending</option>
        <option value="done">Done</option>
        <option value="skipped">Skipped</option>
      </select>
      <input
        name="notes"
        placeholder="Notes"
        className="rounded-md border border-gray-300 px-3 py-2 text-sm sm:col-span-3"
      />
      <button
        type="submit"
        className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700"
      >
        Add follow-up
      </button>
    </form>
  );
}
