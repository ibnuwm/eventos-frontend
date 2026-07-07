import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/context";

export const metadata: Metadata = {
  title: "Vendor Event OS (EventOS.id) - Next.js 15 App Router",
  description: "Sistem Operasi Bisnis Event & Wedding Management All-in-One Berbasis AI dan Cloud SaaS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans antialiased overflow-x-hidden">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
