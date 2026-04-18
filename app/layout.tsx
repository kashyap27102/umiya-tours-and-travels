import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import {
  createMetadata,
  localBusinessJsonLd,
  organizationJsonLd,
  toJsonLd,
} from "@/lib/metadata";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import "./globals.css";

const displayFont = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  ...createMetadata({
    title: "Umiya Tours & Travels",
    description:
      "Explore curated tours, custom travel packages, and reliable cab and group vehicle booking with Umiya Tours & Travels.",
    path: "/",
    keywords: [
      "travel agency",
      "cab booking",
      "vehicle booking",
      "custom tour packages",
      "Gandhinagar travel services",
    ],
  }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = [organizationJsonLd(), localBusinessJsonLd()];

  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <Navbar />
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
        <FloatingWhatsApp />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: toJsonLd(jsonLd),
          }}
        />
      </body>
    </html>
  );
}
