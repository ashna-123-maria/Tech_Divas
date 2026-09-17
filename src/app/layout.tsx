import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CampusFind | Campus Lost & Found Platform",
  description: "Centralized lost and found recovery platform for campus students and staff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased selection:bg-sky-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
