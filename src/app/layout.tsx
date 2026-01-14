import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dose Oracle | Radiation Therapy Dose Constraints",
  description:
    "A comprehensive, searchable database of normal tissue dose constraints from QUANTEC, HyTEC, and other authoritative sources. For radiation oncology professionals.",
  keywords: [
    "radiation oncology",
    "dose constraints",
    "QUANTEC",
    "HyTEC",
    "normal tissue tolerance",
    "radiation therapy",
    "OAR constraints",
    "radiobiology",
  ],
  authors: [{ name: "Dose Oracle" }],
  openGraph: {
    title: "Dose Oracle | Radiation Therapy Dose Constraints",
    description:
      "Searchable database of normal tissue dose constraints from QUANTEC, HyTEC, TG-101, and more.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
