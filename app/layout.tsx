import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bagoes Esports - Platform Esports Indonesia",
  description: "Platform esports terdepan untuk mengelola event, turnamen, dan komunitas gaming di Indonesia. Bergabunglah dengan ribuan gamers dan tim esports profesional.",
  keywords: ["esports", "gaming", "turnamen", "komunitas", "Indonesia", "Valorant", "Mobile Legends", "PUBG Mobile"],
  authors: [{ name: "Bagoes Esports" }],
  openGraph: {
    title: "Bagoes Esports - Platform Esports Indonesia",
    description: "Platform esports terdepan untuk mengelola event, turnamen, dan komunitas gaming di Indonesia.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
