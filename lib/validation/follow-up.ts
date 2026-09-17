import { z } from "zod";

export const FOLLOW_UP_STATUSES = ["pending", "done", "skipped"] as const;

export const followUpSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(1, "Reason is required.")
    .max(200, "Reason must be 200 characters or fewer."),
  due_date: z
    .string()
    .trim()
    .min(1, "Due date is required.")
    .refine((value) => !Number.isNaN(Date.parse(value)), "Enter a valid date."),
  status: z.enum(FOLLOW_UP_STATUSES, {
    errorMap: () => ({ message: "Choose a valid status." }),
  }),
  notes: z
    .string()
    .trim()
    .max(2000, "Notes must be 2000 characters or fewer.")
    .optional()
    .or(z.literal("")),
});

export type FollowUpInput = z.infer<typeof followUpSchema>;

export function parseFollowUpForm(formData: FormData) {
  return followUpSchema.safeParse({
    reason: formData.get("reason"),
    due_date: formData.get("due_date"),
    status: formData.get("status"),
    notes: formData.get("notes"),
  });
}
