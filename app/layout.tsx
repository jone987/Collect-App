import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "COLLECT",
  description: "Track who owes you and follow up on time.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
