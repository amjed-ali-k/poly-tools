import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./providers";
import { Footsies } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Poly Tools",
  keywords: [
    "SBTE",
    "SBTE Tools",
    "SBTE Result",
    "Poly tools",
    "Polytechnic Tools",
    "Student Attendance Marker",
    "SBTE Result Evaluation",
    "Diploma results sort",
    "SBTE Result sort",
    "Diploma exam results",
  ],
  description:
    "Poly Tools, i.e., Polytechnic Tools, is a collections of online tools exclusively for lecturers, aimed at streamlining the time-consuming and tedious tasks",
  creator: "Amjed Ali K (@amjed-ali-k)",
  openGraph: {
    title: "Poly Tools - Simplify your laborious tasks",
    description:
      "Poly Tools, i.e., Polytechnic Tools, is a collections of online tools exclusively for lecturers, aimed at streamlining the time-consuming and tedious tasks",
    images: [
      {
        url: "https://amjed-ali-k.github.io/sbte-refactor/og-image.png",
      },
    ],
    type: "website",
    locale: "en_IN",
    url: "https://sbte-tools.vercel.app/",
    siteName: "Poly Tools",
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
      <body className={inter.className + " dark flex flex-col"}>
        <Providers>
          <main className="flex-1">{children}</main>
          <Footsies />
          <Toaster />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
