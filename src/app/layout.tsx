import type { Metadata } from "next";
import { Syne, Inter, Instrument_Sans } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["600", "700", "800"],
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "8xWork — VR/AR & Web Development Agency",
  description:
    "8xWork builds immersive digital experiences for high-ticket clients. VR, AR, web development, and product design that converts.",
  keywords: [
    "VR agency",
    "AR agency",
    "web development",
    "immersive experiences",
    "8xWork",
  ],
  openGraph: {
    title: "8xWork — VR/AR & Web Development Agency",
    description:
      "Premium immersive digital experiences for high-ticket clients.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${syne.variable} ${instrumentSans.variable} ${inter.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
