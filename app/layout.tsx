import { ToasterProvider } from "@/components/providers/ToasterProvider";
import {
  createMetadata,
  organizationJsonLd,
  toJsonLd,
} from "@/lib/metadata";
import { getCachedSettings } from "@/services/settings-service";
import type { Metadata } from "next";
import { Google_Sans, Poppins } from "next/font/google";
import "./globals.css";

const displayFont = Google_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const bodyFont = Poppins({
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // A settings failure must never break every page; the links are optional.
  const settings = await getCachedSettings().catch(() => null);
  const sameAs = [
    settings?.instagramUrl,
    settings?.facebookUrl,
    settings?.youtubeUrl,
    settings?.googleBusinessUrl,
  ].filter((url): url is string => !!url);
  const jsonLd = organizationJsonLd(sameAs);

  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <ToasterProvider />
        {children}
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
