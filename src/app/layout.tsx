import type { Metadata } from "next";
import { Inter, Instrument_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: ["400"],
  style: ["normal", "italic"],
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

// TODO: replace with your real production domain (no trailing slash)
const siteUrl = "https://developmentrabbit.com";
const siteName = "Development Rabbit";
const siteDescription =
  "Development Rabbit builds immersive digital experiences for high-ticket clients — AR, VR, AI, embedded systems, and web development that converts.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Development Rabbit | AR/VR, AI & Custom Software Development Agency",
    template: "%s | Development Rabbit",
  },
  description: siteDescription,
  keywords: [
    "AR development agency",
    "VR development agency",
    "AI agent development",
    "embedded systems development",
    "custom software development",
    "web development agency",
    "software consultancy",
    "Development Rabbit",
  ],
  authors: [{ name: "Development Rabbit" }],
  creator: "Development Rabbit",
  publisher: "Development Rabbit",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: "Development Rabbit — AR/VR, AI & Custom Software Development Agency",
    description:
      "Premium immersive digital experiences for high-ticket clients: AR, VR, AI agents, embedded systems, and web development.",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Development Rabbit — AR/VR & Software Development Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Development Rabbit — AR/VR, AI & Custom Software Development Agency",
    description:
      "Premium immersive digital experiences for high-ticket clients: AR, VR, AI agents, embedded systems, and web development.",
    images: ["/opengraph-image.png"],
    // site: "@developmentrabbit",    // TODO: add your X/Twitter handle
    // creator: "@8xwork",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  verification: {
    // google: "your-google-search-console-verification-code", // TODO
  },
};

// Organization-level structured data, shown on every page so Google can
// build an entity/knowledge-panel picture of the business.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: siteName,
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description: siteDescription,
  sameAs: [
    // "https://www.linkedin.com/company/8xwork",
    // "https://twitter.com/8xwork",
    // "https://www.instagram.com/8xwork",
  ],
  makesOffer: [
    "AR Development",
    "VR Development",
    "AI Agent Development",
    "Embedded Systems",
    "Software Consultancy",
    "Web Development",
  ].map((service) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: service,
    },
  })),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSerif.variable} ${instrumentSans.variable} ${inter.variable} antialiased bg-background text-foreground`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        {children}
      </body>
    </html>
  );
}
