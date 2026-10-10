import PageHero from "@/components/PageHero";
import { PackagesCatalogSkeleton } from "@/components/skeletons/PackagesListSkeleton";
import { PACKAGES_HERO } from "@/lib/page-copy";

export default function Loading() {
  return (
    <main className="flex flex-col gap-10" aria-busy="true">
      <span role="status" className="sr-only">
        Loading travel packages…
      </span>
      {/* The heading is fixed text, so it can show straight away. */}
      <PageHero
        heading={PACKAGES_HERO.heading}
        description={PACKAGES_HERO.description}
      />
      <div className="travel-shell flex w-full flex-col gap-10">
        <PackagesCatalogSkeleton />
      </div>
    </main>
  );
}
