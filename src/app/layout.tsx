import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { BottomNav } from "@/components/BottomNav";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

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
    <html lang="vi" className={inter.variable}>
      <body className="antialiased min-h-screen bg-[#F8FAFC]">
        <Providers>
          <main className="pb-16">{children}</main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}