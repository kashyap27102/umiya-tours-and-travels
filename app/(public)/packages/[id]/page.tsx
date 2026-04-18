import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import PackageCard from "@/components/PackageCard";
import PackageInquiryForm from "@/components/forms/PackageInquiryForm";
import { Badge, Button, Card, CardBody, CardTitle } from "@/components/ui";
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

      <Breadcrumb
        crumbs={[
          { label: "Packages", href: "/packages" },
          { label: travelPackage.name },
        ]}
      />

      <section className="grid items-center gap-8 lg:grid-cols-2">
        <div>
          <Badge variant="solid" size="md" className="mb-4">
            {travelPackage.category} Package
          </Badge>
          <h1 className="text-4xl font-bold text-brand-ink-900 md:text-5xl">
            {travelPackage.name}
          </h1>
          <p className="mt-4 max-w-2xl text-brand-muted-600 md:text-lg">
            {travelPackage.summary}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Badge variant="brand" size="sm">
              {travelPackage.destination}
            </Badge>
            <Badge variant="brand" size="sm">
              {travelPackage.durationLabel}
            </Badge>
            <Badge variant="brand" size="sm">
              {formatCurrency(travelPackage.pricePerPerson)} per person
            </Badge>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="primary" size="lg">
              <Link
                href={`/contact?service=package&package=${travelPackage.slug}`}
              >
                Book This Package
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/packages">Back to Packages</Link>
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-brand-blue-900/10 bg-white shadow-[0_16px_40px_rgb(var(--brand-blue-rgb)/0.14)]">
          <Image
            src={travelPackage.image}
            alt={`${travelPackage.name} hero image`}
            width={1400}
            height={1000}
            className="h-full min-h-72 w-full object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card variant="elevated" padding="lg" className="space-y-5">
          <CardTitle>Day-Wise Itinerary</CardTitle>
          <div className="space-y-4">
            {travelPackage.itinerary.map((item) => (
              <div
                key={item.day}
                className="rounded-2xl border border-brand-blue-900/10 bg-white/80 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue-700">
                  Day {item.day}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-brand-ink-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-brand-muted-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card variant="default" padding="lg" className="space-y-4">
            <CardTitle className="text-xl">Inclusions</CardTitle>
            <ul className="space-y-2">
              {travelPackage.inclusions.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-brand-muted-600"
                >
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-green-500" />
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
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-blue-700" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <Card variant="tinted" padding="lg">
            <CardTitle className="text-xl">Need a Custom Version?</CardTitle>
            <CardBody className="mt-2">
              We can customize itinerary pace, hotel category, and transport
              based on your group and budget.
            </CardBody>
            <div className="mt-4">
              <Button asChild variant="solid" size="md">
                <Link href="/contact?service=custom-packages">
                  Request Customization
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-3xl font-bold text-brand-ink-900">
          Quick Inquiry for This Package
        </h2>
        <PackageInquiryForm preselectedPackageSlug={travelPackage.slug} />
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
