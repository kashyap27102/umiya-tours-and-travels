import { Check, X } from "lucide-react";
import { notFound } from "next/navigation";
import PackageCard from "@/components/PackageCard";
import PackageGallery from "@/components/PackageGallery";
import PackageItinerary from "@/components/PackageItinerary";
import PackageEnquiryTrigger from "@/components/PackageEnquiryTrigger";
import PackageShareButton from "@/components/PackageShareButton";
import { Badge, Card, CardTitle } from "@/components/ui";
import {
  breadcrumbJsonLd,
  createMetadata,
  productJsonLd,
  toJsonLd,
} from "@/lib/metadata";
import { appConfig } from "@/lib/config";
import { formatCurrency } from "@/lib/format";
import { formatDurationLabel } from "@/lib/packages-constants";
import { PackageService } from "@/services";

type RouteParams = {
  id: string;
};

export const generateStaticParams = async () => {
  const slugs = await PackageService.getActivePackageSlugs();
  return slugs.success ? slugs.data.map(({ slug }) => ({ id: slug })) : [];
};

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { id } = await params;
  const result = await PackageService.getCachedPackageBySlug(id);
  const travelPackage = result.success ? result.data : null;

  if (!travelPackage || travelPackage.status !== "active") {
    return createMetadata({
      title: "Package Not Found | Umiya Tours & Travels",
      description: "The requested package does not exist.",
      path: `/packages/${id}`,
      noIndex: true,
    });
  }

  const durationLabel = formatDurationLabel(
    travelPackage.durationNights,
    travelPackage.durationDays,
  );

  return createMetadata({
    title: `${travelPackage.name} | Umiya Tours & Travels`,
    description: travelPackage.summary,
    path: `/packages/${travelPackage.slug}`,
    image: travelPackage.images[0],
    keywords: [
      travelPackage.destination.toLowerCase(),
      `${travelPackage.category.toLowerCase()} travel package`,
      `${durationLabel.toLowerCase()} package`,
      "travel itinerary",
      "holiday package booking",
    ],
  });
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { id } = await params;
  const result = await PackageService.getCachedPackageBySlug(id);
  const travelPackage = result.success ? result.data : null;

  if (!travelPackage || travelPackage.status !== "active") {
    notFound();
  }

  const durationLabel = formatDurationLabel(
    travelPackage.durationNights,
    travelPackage.durationDays,
  );

  const [relatedResult, activePackagesResult] = await Promise.all([
    PackageService.getRelatedPackages(travelPackage.category, travelPackage.slug, 3),
    PackageService.getCachedActivePackages(),
  ]);
  const relatedPackages = relatedResult.success ? relatedResult.data : [];
  const enquiryPackages = (
    activePackagesResult.success ? activePackagesResult.data : []
  ).map(({ slug, name }) => ({ slug, name }));

  const canonicalUrl = `${appConfig.siteUrl}/packages/${travelPackage.slug}`;
  const derivedRatingValue = Math.max(
    4,
    Math.min(5, Number((4 + travelPackage.popularityScore / 100).toFixed(1))),
  );
  const derivedRatingCount = Math.max(
    24,
    Math.round(travelPackage.popularityScore * 2),
  );

  const breadcrumbJsonLdData = breadcrumbJsonLd([
    { name: "Home", url: appConfig.siteUrl },
    { name: "Packages", url: `${appConfig.siteUrl}/packages` },
    { name: travelPackage.name, url: canonicalUrl },
  ]);

  const productJsonLdData = productJsonLd({
    name: travelPackage.name,
    description: travelPackage.summary,
    images: travelPackage.images,
    sku: travelPackage.slug,
    category: `${travelPackage.category} Travel Package`,
    price: travelPackage.pricePerPerson,
    url: canonicalUrl,
    ratingValue: derivedRatingValue,
    ratingCount: derivedRatingCount,
    additionalProperties: [
      { name: "Destination", value: travelPackage.destination },
      { name: "Duration", value: durationLabel },
      { name: "Highlights", value: travelPackage.highlights.join(", ") },
    ],
  });

  return (
    <main className="travel-shell flex flex-col gap-10 py-10 md:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbJsonLdData) }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(productJsonLdData) }}
      />

      <section>
        <PackageGallery images={travelPackage.images} alt={travelPackage.name} />
      </section>

      <section className="grid items-start gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card variant="elevated" padding="lg" className="space-y-2">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <CardTitle className="text-2xl">{travelPackage.name}</CardTitle>
              <PackageShareButton
                packageName={travelPackage.name}
                destination={travelPackage.destination}
                durationLabel={durationLabel}
                priceLabel={`${formatCurrency(travelPackage.pricePerPerson)} per person`}
                image={travelPackage.images[0] ?? "/logo.png"}
                url={canonicalUrl}
              />
            </div>

            <p className="max-w-2xl text-brand-muted-600 md:text-lg">
              {travelPackage.summary}
            </p>
            <Badge variant="brand" size="sm" className="mb-1">
              {durationLabel}
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
              per person · {durationLabel}
            </p>
            <PackageEnquiryTrigger
              packageSlug={travelPackage.slug}
              packages={enquiryPackages}
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
