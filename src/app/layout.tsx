import type { Metadata, Viewport } from "next";
import "@fontsource/mona-sans/400.css";
import "@fontsource/mona-sans/500.css";
import "@fontsource/mona-sans/600.css";
import "@fontsource/mona-sans/700.css";
import "@fontsource/mona-sans/latin-ext-400.css";
import "@fontsource/mona-sans/latin-ext-500.css";
import "@fontsource/mona-sans/latin-ext-600.css";
import "@fontsource/mona-sans/latin-ext-700.css";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Nhà Trọ 24h",
  description: "Ứng dụng dành cho người thuê",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2563EB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased min-h-screen bg-[#FFF8F6]">
        <Providers>
          <TopBar />
          <main className="pb-16">{children}</main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}