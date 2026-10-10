import type { Metadata } from "next";
import { BRAND_LOGO, CONTACT, DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/constants";
import { appConfig } from "@/lib/config";

const SITE_URL = appConfig.siteUrl;

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

/** One TravelAgency entry for the whole business (it is also a local business). */
export const organizationJsonLd = (sameAs: string[] = []): JsonLdNode => ({
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: SITE_NAME,
  url: SITE_URL,
  logo: toAbsoluteUrl(BRAND_LOGO.color),
  image: toAbsoluteUrl(DEFAULT_OG_IMAGE),
  telephone: CONTACT.phone,
  email: CONTACT.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "204, Keshav Aaradhyam, Kudasan",
    addressLocality: "Gandhinagar",
    addressRegion: "Gujarat",
    postalCode: "382419",
    addressCountry: "IN",
  },
  areaServed: "IN",
  ...(sameAs.length > 0 ? { sameAs } : {}),
});

export const breadcrumbJsonLd = (
  items: { name: string; url: string }[],
): JsonLdNode => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

type ProductJsonLdInput = {
  name: string;
  description: string;
  images: string[];
  sku: string;
  category: string;
  /** Lowest per-person price. */
  price: number;
  /** Highest per-person price, when prices vary by stay or group size. */
  highPrice?: number;
  /** How many stay options there are (for a price range). */
  offerCount?: number;
  url: string;
  additionalProperties?: { name: string; value: string }[];
};

export const productJsonLd = ({
  name,
  description,
  images,
  sku,
  category,
  price,
  highPrice,
  offerCount,
  url,
  additionalProperties = [],
}: ProductJsonLdInput): JsonLdNode => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name,
  description,
  image: images,
  sku,
  category,
  brand: {
    "@type": "Brand",
    name: SITE_NAME,
  },
  offers:
    // Several stay levels / group sizes at different prices: a price range.
    highPrice !== undefined && highPrice > price
      ? {
          "@type": "AggregateOffer",
          url,
          priceCurrency: "INR",
          lowPrice: price,
          highPrice,
          offerCount: offerCount ?? 1,
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "TravelAgency",
            name: SITE_NAME,
          },
        }
      : {
          "@type": "Offer",
          url,
          priceCurrency: "INR",
          price,
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "TravelAgency",
            name: SITE_NAME,
          },
        },
  additionalProperty: additionalProperties.map(({ name: propName, value }) => ({
    "@type": "PropertyValue",
    name: propName,
    value,
  })),
});

export const toJsonLd = (data: JsonLdNode | JsonLdNode[]) =>
  JSON.stringify(data);

/** A list of pages (e.g. the packages on a destination page) for search engines. */
export const itemListJsonLd = (
  items: { name: string; url: string }[],
): JsonLdNode => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  numberOfItems: items.length,
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    url: item.url,
  })),
});
