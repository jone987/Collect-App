"use client";

import { useRef } from "react";
import { createCustomer } from "./actions";

export function NewCustomerForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createCustomer(formData);
        formRef.current?.reset();
      }}
      className="grid grid-cols-1 gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <input
        name="name"
        placeholder="Name"
        required
        className="rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
      <input
        name="contact"
        placeholder="Contact (email or phone)"
        className="rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
      <input
        name="job"
        placeholder="Job"
        className="rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
      <input
        name="amount_owed"
        type="number"
        step="0.01"
        min="0"
        placeholder="Amount owed"
        className="rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
      <select
        name="status"
        defaultValue="active"
        className="rounded-md border border-gray-300 px-3 py-2 text-sm"
      >
        <option value="active">Active</option>
        <option value="overdue">Overdue</option>
        <option value="paid">Paid</option>
        <option value="closed">Closed</option>
      </select>
      <input
        name="notes"
        placeholder="Notes"
        className="rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
      <button
        type="submit"
        className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 sm:col-span-2 lg:col-span-1"
      >
        Add customer
      </button>
    </form>
  );
}
