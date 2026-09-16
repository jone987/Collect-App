import { z } from "zod";

export const CUSTOMER_STATUSES = [
  "active",
  "overdue",
  "paid",
  "closed",
] as const;

export const customerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(200, "Name must be 200 characters or fewer."),
  contact: z
    .string()
    .trim()
    .max(200, "Contact must be 200 characters or fewer.")
    .optional()
    .or(z.literal("")),
  job: z
    .string()
    .trim()
    .max(200, "Job must be 200 characters or fewer.")
    .optional()
    .or(z.literal("")),
  amount_owed: z.coerce
    .number({ invalid_type_error: "Enter a valid amount." })
    .min(0, "Amount owed can't be negative.")
    .max(100_000_000, "That amount looks too large."),
  status: z.enum(CUSTOMER_STATUSES, {
    errorMap: () => ({ message: "Choose a valid status." }),
  }),
  notes: z
    .string()
    .trim()
    .max(2000, "Notes must be 2000 characters or fewer.")
    .optional()
    .or(z.literal("")),
});

export type CustomerInput = z.infer<typeof customerSchema>;

export function parseCustomerForm(formData: FormData) {
  return customerSchema.safeParse({
    name: formData.get("name"),
    contact: formData.get("contact"),
    job: formData.get("job"),
    amount_owed: formData.get("amount_owed") || 0,
    status: formData.get("status"),
    notes: formData.get("notes"),
  });
}
