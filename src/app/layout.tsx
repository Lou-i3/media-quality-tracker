import type { Metadata } from "next";
import { Nunito, Lora, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Media Quality Tracker",
  description: "Track media file quality, playback compatibility, and maintenance status",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} ${lora.variable} ${geistMono.variable} antialiased`}
      >
        <Sidebar />
        <main className="ml-64 min-h-screen bg-background">
          {children}
        </main>
      </body>
    </html>
  );
}
