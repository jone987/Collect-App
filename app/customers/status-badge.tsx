const STATUS_STYLES: Record<string, string> = {
  active: "bg-blue-50 text-blue-700",
  overdue: "bg-red-50 text-red-700",
  paid: "bg-green-50 text-green-700",
  closed: "bg-gray-100 text-gray-600",
  pending: "bg-amber-50 text-amber-700",
  done: "bg-green-50 text-green-700",
  skipped: "bg-gray-100 text-gray-600",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
        STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}
