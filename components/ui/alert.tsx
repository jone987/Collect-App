export type AlertVariant = "error" | "success" | "info";

const VARIANT_CLASSES: Record<AlertVariant, string> = {
  error: "bg-red-50 text-red-700 border-red-100",
  success: "bg-green-50 text-green-700 border-green-100",
  info: "bg-blue-50 text-blue-700 border-blue-100",
};

export function Alert({
  variant = "info",
  children,
}: {
  variant?: AlertVariant;
  children: React.ReactNode;
}) {
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`rounded-md border px-3 py-2 text-sm ${VARIANT_CLASSES[variant]}`}
    >
      {children}
    </div>
  );
}
