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
  (await CatalogService.getCategorySlugs()).map((slug) => ({ slug }));

const lowestPrice = (prices: number[]) =>
  Math.min(...prices.filter((p) => p > 0));

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const page = await CatalogService.getCategoryPage(slug);
  if (!page) {
    return createMetadata({
      title: "Category not found | Umiya Tours & Travels",
      description: "This category is not available right now.",
      path: `/categories/${slug}`,
      noIndex: true,
    });
  }

  const from = lowestPrice(page.packages.map((p) => p.startingPrice || p.pricePerPerson));
  return createMetadata({
    title: `${page.name} Tour Packages | Umiya Tours & Travels`,
    description: `Choose from ${page.packages.length} ${page.name.toLowerCase()} tour package${page.packages.length === 1 ? "" : "s"} from ${formatCurrency(from)} per person, planned and supported by Umiya Tours & Travels.`,
    path: `/categories/${page.slug}`,
    image: page.packages[0]?.images[0],
    keywords: [
      `${page.name.toLowerCase()} tour packages`,
      `${page.name.toLowerCase()} holiday packages`,
      `${page.name.toLowerCase()} trip booking`,
    ],
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const page = await CatalogService.getCategoryPage(slug);
  if (!page) notFound();

  const base = appConfig.siteUrl;
  const from = lowestPrice(page.packages.map((p) => p.startingPrice || p.pricePerPerson));

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", url: base },
    { name: "Packages", url: `${base}/packages` },
    { name: page.name, url: `${base}/categories/${page.slug}` },
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
        badge="Type of trip"
        description={`${page.packages.length} handpicked ${page.name.toLowerCase()} package${page.packages.length === 1 ? "" : "s"}, from ${formatCurrency(from)} per person.`}
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
          title="Other types of trip"
          links={page.others.map((c) => ({
            href: `/categories/${c.slug}`,
            label: c.name,
            count: c.count,
          }))}
        />

        <CtaBanner
          heading="Not sure which trip suits you?"
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
