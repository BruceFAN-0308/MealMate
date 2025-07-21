// app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Clerk
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "MealMate - Recipe Sharing Platform",
  description:
      "Discover delicious recipes from around the world and create your own recipe collection. Built with Next.js, Supabase, and TailwindCSS.",
  keywords: "recipes, cooking, food, sharing, recipe management",
  authors: [{ name: "MealMate Team" }],
  creator: "MealMate",
  publisher: "MealMate",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <ClerkProvider>
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900`}
        >


        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        </body>
        </html>
      </ClerkProvider>
  );
}
