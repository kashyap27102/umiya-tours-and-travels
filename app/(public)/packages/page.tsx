import PackagesCatalog from "@/components/packages/PackagesCatalog";
import CtaBanner from "@/components/CtaBanner";
import PageHero from "@/components/PageHero";
import { createMetadata } from "@/lib/metadata";
import { PackageService } from "@/services";

export const metadata = createMetadata({
  title: "Travel Packages | Umiya Tours & Travels",
  description:
    "Browse curated beach, hill, heritage, pilgrimage, family, honeymoon, and international packages with filters by destination, duration, and budget.",
  path: "/packages",
  keywords: [
    "travel packages gujarat",
    "family tour packages",
    "honeymoon packages india",
    "pilgrimage package booking",
    "international holiday packages",
  ],
});

export default async function PackagesPage() {
  const activePackages = await PackageService.getCachedActivePackages();
  const packages = activePackages.success ? activePackages.data : [];

  return (
    <main className="flex flex-col gap-10 ">
      <PageHero
        heading="Find Your Perfect Travel Package"
        description="Explore handpicked holiday options and filter by destination style, duration, and budget to book with confidence."
      />

      <div className="travel-shell flex flex-col gap-10">
        <PackagesCatalog packages={packages} />

        <CtaBanner
          heading="Need Help Choosing the Right Package?"
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
