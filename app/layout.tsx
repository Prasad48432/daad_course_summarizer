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
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2737076335315038"
          crossOrigin="anonymous"
        />
        <meta name="google-adsense-account" content="ca-pub-2737076335315038" />
      </head>
      <body className={`${montserrat.variable} antialiased montserrat`}>
        {children}
      </body>
    </html>
  );
}
