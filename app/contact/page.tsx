import { createMetadata } from "@/lib/metadata";
import Breadcrumb from "@/components/Breadcrumb";
import ContactForm from "@/components/forms/ContactForm";
import { Badge, Card, CardBody, CardTitle } from "@/components/ui";
import { CONTACT } from "@/lib/constants";
import { getPackageBySlug } from "@/lib/packages-data";
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
  const query = await searchParams;
  const selectedService = normalizeService(query.service);
  const selectedPackage = query.package
    ? getPackageBySlug(query.package)
    : undefined;

  const initialMessage = selectedPackage
    ? `I am interested in the package "${selectedPackage.name}". Please share details for itinerary, pricing, and booking process.`
    : undefined;

  const initialServiceInterested = selectedPackage
    ? "Pre-Designed Packages"
    : selectedService;

  return (
    <main className="travel-shell flex flex-col gap-10 py-10 md:py-14">
      <Breadcrumb crumbs={[{ label: "Contact" }]} />

      <section className="brand-hero relative overflow-hidden rounded-3xl px-6 py-10 md:px-10 md:py-12">
        <div className="brand-hero-glow pointer-events-none absolute inset-0" />
        <div className="relative max-w-3xl">
          <Badge variant="solid" size="md" className="mb-4">
            Plan Your Next Trip
          </Badge>
          <h1 className="text-4xl font-bold text-brand-cream-100 md:text-5xl">
            Contact Umiya Tours & Travels
          </h1>
          <p className="mt-4 max-w-2xl text-base text-brand-mist-200 md:text-lg">
            Tell us what you need and we will suggest the right package, cab, or
            group vehicle option for your journey.
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <ContactForm
          initialServiceInterested={initialServiceInterested}
          initialMessage={initialMessage}
        />

        <Card
          variant="elevated"
          padding="lg"
          className="h-fit space-y-5 bg-brand-blue-900 text-brand-mist-200"
        >
          <div>
            <CardTitle className="text-brand-cream-100">
              Reach Us Directly
            </CardTitle>
            <CardBody className="mt-2 text-brand-mist-200">
              Prefer direct contact? Call, email, or chat with us on WhatsApp.
            </CardBody>
          </div>

          <div className="space-y-3 text-sm text-brand-mist-200">
            <p>
              <span className="font-semibold text-brand-cream-100">Phone:</span>{" "}
              <a
                href={`tel:${CONTACT.phone}`}
                className="hover:text-brand-lime-400 transition-colors"
              >
                {CONTACT.phone}
              </a>
            </p>

            <p>
              <span className="font-semibold text-brand-cream-100">Email:</span>{" "}
              <a
                href={`mailto:${CONTACT.email}`}
                className="wrap-break-word hover:text-brand-lime-400 transition-colors"
              >
                {CONTACT.email}
              </a>
            </p>

            <p>
              <span className="font-semibold text-brand-cream-100">
                Address:
              </span>{" "}
              {CONTACT.address}
            </p>

            <p>
              <span className="font-semibold text-brand-cream-100">
                WhatsApp:
              </span>{" "}
              <a
                href={`https://wa.me/${CONTACT.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-lime-400 transition-colors"
              >
                Start chat
              </a>
            </p>
          </div>
        </Card>
      </section>
    </main>
  );
}
