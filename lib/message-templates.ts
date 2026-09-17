export const MESSAGE_TONES = ["friendly", "firm", "formal"] as const;
export type MessageTone = (typeof MESSAGE_TONES)[number];

export const MESSAGE_TEMPLATES: Record<
  MessageTone,
  { label: string; description: string; body: string }
> = {
  friendly: {
    label: "Friendly",
    description: "1–5 days overdue",
    body: "Hi {name}, hope the {job} is looking great! Just a friendly reminder that the balance of {amount} is still outstanding. Could you let me know when I can get this settled, ideally by the end of the week? Happy to help if there's anything holding it up.",
  },
  firm: {
    label: "Firm",
    description: "6–13 days overdue",
    body: "Hi {name}, this is a follow-up regarding the balance of {amount} for the {job} project, now {days_overdue} days past due. Could you let me know when we can expect this to be settled? Happy to help if anything's holding it up on your end. Thank you.",
  },
  formal: {
    label: "Formal",
    description: "14+ days overdue",
    body: "Hi {name}, I'm reaching out again regarding the outstanding balance of {amount} for the {job}, now {days_overdue} days past due. This follows a couple of earlier reminders that haven't been answered yet. I'd like to get this resolved as soon as possible — could you let me know when I can expect payment, or reach out if there's something going on I should know about?",
  },
};

/** Matches the brief: 1-5 days -> friendly, 6-13 -> firm, 14+ -> formal.
 * Not-yet-due / due-today follow-ups (0 days) fall into the friendly bucket. */
export function selectTone(daysOverdue: number): MessageTone {
  if (daysOverdue >= 14) return "formal";
  if (daysOverdue >= 6) return "firm";
  return "friendly";
}

export interface MessageMergeFields {
  name: string;
  job: string;
  amount: string;
  days_overdue: string;
}

export function renderMessageTemplate(
  tone: MessageTone,
  fields: MessageMergeFields
): string {
  return MESSAGE_TEMPLATES[tone].body.replace(
    /\{(\w+)\}/g,
    (match, key: string) => fields[key as keyof MessageMergeFields] ?? match
  );
}
