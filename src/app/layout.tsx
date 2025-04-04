import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Sidebar from "@/components/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StyleBuddy",
  description: "Your personal outfit recommendation assistant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex">
          {/* Sidebar */}
          <Sidebar />
          {/* Main Content */}
          <div className="flex-grow bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
            <Toaster />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
