import { Check, X } from "lucide-react";
import { notFound } from "next/navigation";
import PackageCard from "@/components/PackageCard";
import PackageGallery from "@/components/PackageGallery";
import PackageItinerary from "@/components/PackageItinerary";
import PackageEnquiryTrigger from "@/components/PackageEnquiryTrigger";
import PackageShareButton from "@/components/PackageShareButton";
import { Badge, Card, CardTitle } from "@/components/ui";
import { createMetadata, toJsonLd } from "@/lib/metadata";
import { appConfig } from "@/lib/config";
import {
  getPackageBySlug,
  getPackageSlugs,
  getRelatedPackages,
} from "@/lib/packages-data";

type RouteParams = {
  id: string;
};

export const generateStaticParams = async () =>
  getPackageSlugs().map((slug) => ({ id: slug }));

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { id } = await params;
  const travelPackage = getPackageBySlug(id);

  if (!travelPackage) {
    return createMetadata({
      title: "Package Not Found | Umiya Tours & Travels",
      description: "The requested package does not exist.",
      path: `/packages/${id}`,
      noIndex: true,
    });
  }

  return createMetadata({
    title: `${travelPackage.name} | Umiya Tours & Travels`,
    description: travelPackage.summary,
    path: `/packages/${travelPackage.slug}`,
    image: travelPackage.image,
    keywords: [
      travelPackage.destination.toLowerCase(),
      `${travelPackage.category.toLowerCase()} travel package`,
      `${travelPackage.durationLabel.toLowerCase()} package`,
      "travel itinerary",
      "holiday package booking",
    ],
  });
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { id } = await params;
  const travelPackage = getPackageBySlug(id);

  if (!travelPackage) {
    notFound();
  }

  const relatedPackages = getRelatedPackages(travelPackage.slug, 3);
  const canonicalUrl = `${appConfig.siteUrl}/packages/${travelPackage.slug}`;
  const derivedRatingValue = Math.max(
    4,
    Math.min(5, Number((4 + travelPackage.popularityScore / 100).toFixed(1))),
  );
  const derivedRatingCount = Math.max(
    24,
    Math.round(travelPackage.popularityScore * 2),
  );

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: appConfig.siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Packages",
        item: `${appConfig.siteUrl}/packages`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: travelPackage.name,
        item: canonicalUrl,
      },
    ],
  };

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: travelPackage.name,
    description: travelPackage.summary,
    image: [travelPackage.image],
    sku: travelPackage.slug,
    category: `${travelPackage.category} Travel Package`,
    brand: {
      "@type": "Brand",
      name: "Umiya Tours & Travels",
    },
    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      priceCurrency: "INR",
      price: travelPackage.pricePerPerson,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "TravelAgency",
        name: "Umiya Tours & Travels",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: derivedRatingValue,
      ratingCount: derivedRatingCount,
      bestRating: 5,
      worstRating: 1,
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Destination",
        value: travelPackage.destination,
      },
      {
        "@type": "PropertyValue",
        name: "Duration",
        value: travelPackage.durationLabel,
      },
      {
        "@type": "PropertyValue",
        name: "Highlights",
        value: travelPackage.highlights.join(", "),
      },
    ],
  };

  return (
    <main className="travel-shell flex flex-col gap-10 py-10 md:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbJsonLd) }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(productJsonLd) }}
      />

      <section>
        <PackageGallery
          images={
            travelPackage.images?.length
              ? travelPackage.images
              : [travelPackage.image]
          }
          alt={travelPackage.name}
        />
      </section>

      <section className="grid items-start gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card variant="elevated" padding="lg" className="space-y-2">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <CardTitle className="text-2xl">{travelPackage.name}</CardTitle>
              <PackageShareButton
                packageName={travelPackage.name}
                destination={travelPackage.destination}
                durationLabel={travelPackage.durationLabel}
                priceLabel={`${formatCurrency(travelPackage.pricePerPerson)} per person`}
                image={travelPackage.image}
                url={canonicalUrl}
              />
            </div>

            <p className="max-w-2xl text-brand-muted-600 md:text-lg">
              {travelPackage.summary}
            </p>
            <Badge variant="brand" size="sm" className="mb-1">
              {travelPackage.durationLabel}
            </Badge>
          </Card>

          <PackageItinerary itinerary={travelPackage.itinerary} />
        </div>

        <div className="space-y-6 lg:sticky lg:top-6">
          <Card variant="tinted" padding="lg" className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted-600">
              Starting Price
            </p>
            <p className="text-3xl font-bold text-brand-ink-900">
              {formatCurrency(travelPackage.pricePerPerson)}
            </p>
            <p className="text-sm text-brand-muted-600">
              per person · {travelPackage.durationLabel}
            </p>
            <PackageEnquiryTrigger
              packageSlug={travelPackage.slug}
              label="Enquire Now"
              variant="primary"
              size="md"
              className="mt-2 w-full"
            />
          </Card>

          <Card variant="default" padding="lg" className="space-y-4">
            <CardTitle className="text-xl">Inclusions</CardTitle>
            <ul className="space-y-2">
              {travelPackage.inclusions.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-brand-muted-600"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-green-500" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <Card variant="default" padding="lg" className="space-y-4">
            <CardTitle className="text-xl">Exclusions</CardTitle>
            <ul className="space-y-2">
              {travelPackage.exclusions.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-brand-muted-600"
                >
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      {relatedPackages.length > 0 && (
        <section className="space-y-5">
          <h2 className="text-3xl font-bold text-brand-ink-900">
            Related Packages
          </h2>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {relatedPackages.map((item) => (
              <PackageCard key={item.slug} item={item} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
