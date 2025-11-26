import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import AdSense from "@/components/adsense";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DAAD Course Summariser",
  description: "Summarise DAAD courses using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <AdSense pId="4536181767258856" />
      </head>
      <body className={`${montserrat.variable} antialiased montserrat`}>
        {children}
      </body>
    </html>
  );
}
