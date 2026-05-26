import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Answer Sync — AI-Powered Auto-Answer Extension",
  description:
    "Detect questions on any webpage and fill answers instantly with AI. Chrome extension with Review and Auto-Fill modes.",
  keywords: "AI, Chrome extension, auto answer, quiz solver, form filler",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-[#0a0a14] text-white font-[family-name:var(--font-inter)]">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
