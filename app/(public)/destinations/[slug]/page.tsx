import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import CtaBanner from "@/components/CtaBanner";
import PageHero from "@/components/PageHero";
import ExploreMore from "@/components/packages/ExploreMore";
import PackageGrid from "@/components/packages/PackageGrid";
import { appConfig } from "@/lib/config";
import { formatCurrency } from "@/lib/format";
import {
  breadcrumbJsonLd,
  createMetadata,
  itemListJsonLd,
  toJsonLd,
} from "@/lib/metadata";
import { CatalogService } from "@/services/catalog-service";

type RouteParams = { slug: string };

export const generateStaticParams = async () =>
  (await CatalogService.getDestinationSlugs()).map((slug) => ({ slug }));

const lowestPrice = (prices: number[]) =>
  Math.min(...prices.filter((p) => p > 0));

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const page = await CatalogService.getDestinationPage(slug);
  if (!page) {
    return createMetadata({
      title: "Destination not found | Umiya Tours & Travels",
      description: "This destination is not available right now.",
      path: `/destinations/${slug}`,
      noIndex: true,
    });
  }

  const from = lowestPrice(page.packages.map((p) => p.startingPrice || p.pricePerPerson));
  const place = page.state ? `${page.name}, ${page.state}` : page.name;
  return createMetadata({
    title: `${page.name} Tour Packages | Umiya Tours & Travels`,
    description: `Book ${page.packages.length} handpicked ${page.name} tour package${page.packages.length === 1 ? "" : "s"} (${place}) from ${formatCurrency(from)} per person. Hotels, sightseeing and local support included.`,
    path: `/destinations/${page.slug}`,
    image: page.packages[0]?.images[0],
    keywords: [
      `${page.name} tour packages`,
      `${page.name} holiday packages`,
      `${page.name} travel agency`,
      `trip to ${page.name}`,
    ],
  });
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const page = await CatalogService.getDestinationPage(slug);
  if (!page) notFound();

  const base = appConfig.siteUrl;
  const from = lowestPrice(page.packages.map((p) => p.startingPrice || p.pricePerPerson));
  const where = page.state ?? page.country;

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", url: base },
    { name: "Packages", url: `${base}/packages` },
    { name: page.name, url: `${base}/destinations/${page.slug}` },
  ]);
  const list = itemListJsonLd(
    page.packages.map((p) => ({ name: p.name, url: `${base}/packages/${p.slug}` })),
  );

  return (
    <main className="flex flex-col gap-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(list) }}
      />

      <PageHero
        heading={`${page.name} Tour Packages`}
        badge={where}
        description={`${page.packages.length} handpicked package${page.packages.length === 1 ? "" : "s"} to ${page.name}, from ${formatCurrency(from)} per person.`}
      />

      <div className="travel-shell flex flex-col gap-10">
        <div>
          <Breadcrumb
            crumbs={[
              { label: "Packages", href: "/packages" },
              { label: page.name },
            ]}
          />
          <PackageGrid packages={page.packages} />
        </div>

        <ExploreMore
          title={`More places in ${where}`}
          links={page.nearby.map((d) => ({
            href: `/destinations/${d.slug}`,
            label: d.name,
            count: d.count,
          }))}
        />

        <CtaBanner
          heading={`Planning a trip to ${page.name}?`}
          description="Tell us your dates, group size, and budget. We will suggest the best options."
          actions={[
            {
              label: "Get Package Recommendation",
              href: "/contact?service=package",
            },
            {
              label: "Request Custom Tour",
              href: "/contact?service=custom-packages",
              variant: "hero-outline",
            },
          ]}
        />
      </div>
    </main>
  );
}
