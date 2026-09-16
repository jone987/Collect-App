/** Shared shape for `useActionState` form actions across the app. */
export type FormState = {
  status: "idle" | "error" | "success";
  message?: string;
  errors?: Partial<Record<string, string[]>>;
};

export const initialFormState: FormState = { status: "idle" };
