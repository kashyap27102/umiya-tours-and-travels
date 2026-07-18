import { createMetadata } from "@/lib/metadata";
import ContactForm from "@/components/forms/ContactForm";
import PageHero from "@/components/PageHero";
import { Card, CardTitle } from "@/components/ui";
import { PackageService, SettingsService } from "@/services";
import { SERVICE_INTEREST_OPTIONS } from "@/lib/form-constants";

export const metadata = createMetadata({
  title: "Contact Us | Umiya Tours & Travels",
  description:
    "Get in touch with Umiya Tours & Travels for custom tours, cab booking, vehicle booking, and travel package inquiries in Gujarat and across India.",
  path: "/contact",
  keywords: [
    "travel agency contact gandhinagar",
    "umiya tours contact",
    "cab booking inquiry",
    "group vehicle booking inquiry",
    "travel package inquiry",
  ],
});

type SearchParams = {
  service?: string;
  package?: string;
};

const normalizeService = (
  rawService?: string,
): (typeof SERVICE_INTEREST_OPTIONS)[number] | undefined => {
  if (!rawService) {
    return undefined;
  }

  const normalized = rawService.toLowerCase();

  if (normalized === "package") {
    return "Pre-Designed Packages";
  }

  if (normalized === "custom-packages") {
    return "Customized Travel Packages";
  }

  if (normalized === "cab") {
    return "Cab Booking";
  }

  if (normalized === "vehicle") {
    return "Vehicle Booking";
  }

  const directMatch = SERVICE_INTEREST_OPTIONS.find(
    (option) => option.toLowerCase() === normalized,
  );

  return directMatch;
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const [query, settings] = await Promise.all([
    searchParams,
    SettingsService.getCachedSettings(),
  ]);
  const selectedService = normalizeService(query.service);
  const selectedPackageResult = query.package
    ? await PackageService.getCachedPackageBySlug(query.package)
    : undefined;
  const selectedPackage = selectedPackageResult?.success
    ? selectedPackageResult.data
    : undefined;

  const initialMessage = selectedPackage
    ? `I am interested in the package "${selectedPackage.name}". Please share details for itinerary, pricing, and booking process.`
    : undefined;

  const initialServiceInterested = selectedPackage
    ? "Pre-Designed Packages"
    : selectedService;

  return (
    <main className="flex flex-col gap-10">
      <PageHero
        heading="Contact Umiya Tours & Travels"
        description="Tell us what you need and we will suggest the right package, cab, or group vehicle option for your journey."
      />

      <section className="travel-shell grid gap-6 lg:grid-cols-[2fr_1fr]">
        <ContactForm
          initialServiceInterested={initialServiceInterested}
          initialMessage={initialMessage}
        />

        <Card variant="elevated" padding="lg" className="h-fit space-y-5">
          <div>
            <CardTitle>Umiya Tours & Travels (OPC) Pvt. Ltd.</CardTitle>
          </div>

          <div className="space-y-3 text-sm ">
            <p>
              <span className="font-semibold ">Phone:</span>{" "}
              {settings?.phone ?? "—"}
            </p>

            <p>
              <span className="font-semibold ">Email:</span>{" "}
              {settings?.email ?? "—"}
            </p>

            <p>
              <span className="font-semibold ">Address:</span>{" "}
              {settings?.address ?? "—"}
            </p>
          </div>
        </Card>
      </section>
    </main>
  );
}
