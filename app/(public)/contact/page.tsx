import { createMetadata } from "@/lib/metadata";
import Breadcrumb from "@/components/Breadcrumb";
import ContactForm from "@/components/forms/ContactForm";
import { Badge, Card, CardBody, CardTitle } from "@/components/ui";
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
      <section className="brand-hero relative overflow-hidden px-6 py-10 md:px-10 md:py-12">
        <div className="brand-hero-glow pointer-events-none absolute inset-0" />
        <div className="relative max-w-3xl travel-shell ">
          <h1 className="text-4xl font-bold text-brand-cream-100 md:text-5xl">
            Contact Umiya Tours & Travels
          </h1>
          <p className="mt-4 max-w-2xl text-base text-brand-mist-200 md:text-lg">
            Tell us what you need and we will suggest the right package, cab, or
            group vehicle option for your journey.
          </p>
        </div>
      </section>

      <section className="travel-shell grid gap-6 lg:grid-cols-[2fr_1fr]">
        <ContactForm
          initialServiceInterested={initialServiceInterested}
          initialMessage={initialMessage}
        />

        <Card
          variant="elevated"
          padding="lg"
          className="h-fit space-y-5 bg-brand-blue-900 "
        >
          <div>
            <CardTitle className="text-brand-cream-100">
              Umiya Tours & Travels (OPC) Pvt. Ltd.
            </CardTitle>
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
