import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/constants";

type MetadataInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
};

export type JsonLdNode = Record<string, unknown>;

const toAbsoluteUrl = (pathOrUrl: string) => {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }

  const normalizedPath = pathOrUrl.startsWith("/")
    ? pathOrUrl
    : `/${pathOrUrl}`;
  return `${SITE_URL}${normalizedPath}`;
};

export const createMetadata = ({
  title,
  description,
  path = "/",
  image = DEFAULT_OG_IMAGE,
  keywords = [],
  noIndex = false,
}: MetadataInput): Metadata => {
  const canonical = toAbsoluteUrl(path);
  const ogImage = toAbsoluteUrl(image);

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical,
    },
    keywords,
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} travel experiences`,
        },
      ],
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    category: "travel",
  };
};

export const organizationJsonLd = (): JsonLdNode => ({
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: SITE_NAME,
  url: SITE_URL,
  telephone: "+91 99741 48390",
  address: {
    "@type": "PostalAddress",
    streetAddress: "204, Keshav Aaradhyam, Kudasan",
    addressLocality: "Gandhinagar",
    addressRegion: "Gujarat",
    postalCode: "382419",
    addressCountry: "IN",
  },
});

export const localBusinessJsonLd = (): JsonLdNode => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: SITE_NAME,
  image: toAbsoluteUrl(DEFAULT_OG_IMAGE),
  url: SITE_URL,
  telephone: "+91 99741 48390",
  address: {
    "@type": "PostalAddress",
    streetAddress: "204, Keshav Aaradhyam, Kudasan",
    addressLocality: "Gandhinagar",
    addressRegion: "Gujarat",
    postalCode: "382419",
    addressCountry: "IN",
  },
});

export const toJsonLd = (data: JsonLdNode | JsonLdNode[]) =>
  JSON.stringify(data);
