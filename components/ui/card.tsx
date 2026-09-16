export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white ${className}`}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  helpText,
  tone = "default",
}: {
  label: string;
  value: string;
  helpText?: string;
  tone?: "default" | "warning" | "danger";
}) {
  const valueClasses =
    tone === "danger"
      ? "text-red-600"
      : tone === "warning"
        ? "text-amber-600"
        : "text-gray-900";

  return (
    <Card className="p-5">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className={`mt-2 text-3xl font-semibold tabular-nums ${valueClasses}`}>
        {value}
      </p>
      {helpText && <p className="mt-1 text-xs text-gray-400">{helpText}</p>}
    </Card>
  );
}
