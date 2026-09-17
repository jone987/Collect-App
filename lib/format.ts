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

function toUTCDayNumber(isoDate: string): number {
  const [year, month, day] = isoDate.split("-").map(Number);
  return Date.UTC(year, month - 1, day) / 86_400_000;
}

/** Days between `dueDate` and today, clamped to 0 for dates that aren't past yet. */
export function daysOverdue(dueDate: string | null): number {
  if (!dueDate) return 0;
  const diff = toUTCDayNumber(todayISODate()) - toUTCDayNumber(dueDate);
  return Math.max(0, Math.round(diff));
}
