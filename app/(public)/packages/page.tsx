import Breadcrumb from "@/components/Breadcrumb";
import PageHero from "@/components/PageHero";
import BrowseNav, { anchorFor } from "@/components/packages/BrowseNav";
import PackageGrid from "@/components/packages/PackageGrid";
import { appConfig } from "@/lib/config";
import {
  breadcrumbJsonLd,
  createMetadata,
  itemListJsonLd,
  toJsonLd,
} from "@/lib/metadata";
import { PACKAGES_HERO } from "@/lib/page-copy";
import { CatalogService } from "@/services/catalog-service";

export const metadata = createMetadata({
  title: "Travel Packages by Destination | Umiya Tours & Travels",
  description:
    "Browse tour packages by destination and state: hill stations, beaches, heritage, pilgrimage, family, honeymoon and international holidays, with clear starting prices.",
  path: "/packages",
  keywords: [
    "travel packages gujarat",
    "tour packages by destination",
    "family tour packages",
    "honeymoon packages india",
    "pilgrimage package booking",
    "international holiday packages",
  ],
});

export default async function PackagesPage() {
  const catalog = await CatalogService.getCatalog();
  const regions = catalog.regions.filter((r) => r.packages.length > 0);
  const base = appConfig.siteUrl;

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", url: base },
    { name: "Packages", url: `${base}/packages` },
  ]);
  const list = itemListJsonLd(
    regions.flatMap((r) =>
      r.packages.map((p) => ({ name: p.name, url: `${base}/packages/${p.slug}` })),
    ),
  );

  return (
    <main className="flex min-w-0 flex-col gap-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(list) }}
      />

      <PageHero
        heading={PACKAGES_HERO.heading}
        description={PACKAGES_HERO.description}
      />

      <div className="travel-shell flex w-full min-w-0 flex-col gap-10">
        <div>
          <Breadcrumb crumbs={[{ label: "Packages" }]} />
          <BrowseNav catalog={catalog} />
        </div>

        {regions.length === 0 ? (
          <p className="rounded-2xl border border-brand-mist-200 bg-white py-16 text-center text-sm text-brand-muted-600">
            New packages are on the way. Contact us and we will plan a trip
            for you.
          </p>
        ) : (
          regions.map((region) => (
            <section
              key={region.key}
              id={anchorFor(region.key)}
              aria-labelledby={`${anchorFor(region.key)}-heading`}
              className="scroll-mt-24 space-y-5"
            >
              <div className="space-y-1">
                <h2
                  id={`${anchorFor(region.key)}-heading`}
                  className="text-2xl font-semibold text-brand-ink-900 md:text-3xl"
                >
                  {region.key === "other"
                    ? region.label
                    : `${region.label} Tour Packages`}
                </h2>
                <p className="text-sm text-brand-muted-600">
                  {region.packages.length} package
                  {region.packages.length === 1 ? "" : "s"}
                </p>
              </div>
              <PackageGrid packages={region.packages} />
            </section>
          ))
        )}
      </div>
    </main>
  );
}
