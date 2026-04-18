import { createMetadata } from "@/lib/metadata";
import Breadcrumb from "@/components/Breadcrumb";
import VehicleBookingForm from "@/components/forms/VehicleBookingForm";
import { Badge } from "@/components/ui";

export const metadata = createMetadata({
  title: "Vehicle Booking | Umiya Tours & Travels",
  description:
    "Book group transport with Tempo Traveller, Mini Bus, and Full Bus options. Ideal for tours, pilgrimages, school trips, weddings, and corporate events.",
  path: "/vehicle-booking",
  keywords: [
    "vehicle booking gandhinagar",
    "tempo traveller booking gujarat",
    "mini bus booking",
    "group travel bus booking",
    "umiya tours vehicle booking",
  ],
});

export default function VehicleBookingPage() {
  return (
    <main className="travel-shell flex flex-col gap-10 py-10 md:py-14">
      <section className="brand-hero relative overflow-hidden rounded-3xl px-6 py-10 md:px-10 md:py-12">
        <div className="brand-hero-glow pointer-events-none absolute inset-0" />
        <div className="relative max-w-3xl">
          <Badge variant="solid" size="md" className="mb-4">
            Group Travel Solutions
          </Badge>
          <h1 className="text-4xl font-bold text-brand-cream-100 md:text-5xl">
            Book Reliable Group Vehicles for Every Journey
          </h1>
          <p className="mt-4 max-w-2xl text-base text-brand-mist-200 md:text-lg">
            Choose the right vehicle, share your route and dates, and submit
            your details. Our team will confirm availability and pricing
            quickly.
          </p>
        </div>
      </section>

      <VehicleBookingForm />
    </main>
  );
}
