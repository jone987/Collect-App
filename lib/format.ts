const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

/** `value` is a `date` column value (YYYY-MM-DD), not a full timestamp. */
export function formatDate(value: string | null): string {
  if (!value) return "—";
  return dateFormatter.format(new Date(`${value}T00:00:00`));
}

/** Today's date as YYYY-MM-DD, matching how Postgres `date` columns compare. */
export function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isOverdue(dueDate: string | null, status: string): boolean {
  return status === "pending" && !!dueDate && dueDate < todayISODate();
}

export function isDueToday(dueDate: string | null, status: string): boolean {
  return status === "pending" && dueDate === todayISODate();
}
