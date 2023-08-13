import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SBTE Tools",
  description:
    "SBTE Tools is a simple app exclusively for lecturers, aimed at streamlining the time-consuming and tedious task of evaluating student results downloaded from SBTE",
  creator: "Amjed Ali K (@amjed-ali-k)",
  openGraph: {
    title: "SBTE Tools - Simplify Your Result Evaluation Process",
    description:
      "SBTE Tools is a simple app exclusively for lecturers, aimed at streamlining the time-consuming and tedious task of evaluating student results downloaded from SBTE",
    images: [
      {
        url: "https://amjed-ali-k.github.io/sbte-refactor/og-image.png",
      },
    ],
    type: "website",
    locale: "en_IN",
    url: "https://sbte-tools.vercel.app/",
    siteName: "SBTE Tools",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-3DZN7M50RE" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-3DZN7M50RE');
        `}
      </Script>
      <body className={inter.className}>
        <div>
          <Toaster />
        </div>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
