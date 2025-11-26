import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Script from "next/script";

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
        {/* Google AdSense Verification Script */}
        <meta name="google-adsense-account" content="ca-pub-4536181767258856" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4536181767258856"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${montserrat.variable} antialiased montserrat`}>
        {children}
      </body>
    </html>
  );
}
