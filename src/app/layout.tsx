import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

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
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div>
          <Toaster />
        </div>
        {children}
      </body>
    </html>
  );
}
