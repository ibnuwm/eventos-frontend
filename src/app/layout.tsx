import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/context";

export const metadata: Metadata = {
  title: "EventOS - Platform Manajemen Event & Vendor Pernikahan No.1 di Indonesia",
  description: "EventOS adalah all-in-one platform untuk event organizer dan wedding organizer. Kelola vendor, quotation, proyek, tiket, RSVP, pembayaran, dan AI copilot dalam satu dashboard.",
  keywords: "event management, wedding organizer, vendor management, WO, EO, platform event Indonesia, manajemen pernikahan",
  openGraph: { title: "EventOS - Platform Manajemen Event & Vendor", description: "All-in-one platform untuk event organizer Indonesia", type: "website", locale: "id_ID" },
  twitter: { card: "summary_large_image", title: "EventOS - Platform Manajemen Event", description: "All-in-one platform untuk event organizer Indonesia" },
  robots: "index, follow",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased overflow-x-hidden">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
