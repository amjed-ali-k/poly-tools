import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SBTE Tools",
  keywords: [
    "SBTE",
    "SBTE Tools",
    "SBTE Result",
    "SBTE Result Evaluation",
    "Diploma results sort",
    "SBTE Result sort",
    "Diploma exam results",
  ],
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
    emails: ["amjedmgm@gmail.com"],
    countryName: "India",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* <Script src="https://www.googletagmanager.com/gtag/js?id=G-3DZN7M50RE" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-3DZN7M50RE');
        `}
      </Script> */}
      <body className={inter.className + " dark "}>
        <Providers>
          <main>{children}</main>
          <Toaster />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
