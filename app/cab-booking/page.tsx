import { createMetadata } from "@/lib/metadata";
import Breadcrumb from "@/components/Breadcrumb";
import CabBookingForm from "@/components/forms/CabBookingForm";
import { Badge } from "@/components/ui";

export const metadata = createMetadata({
  title: "Cab Booking | Umiya Tours & Travels",
  description:
    "Book one-way, round-trip, airport, and railway cabs with Umiya Tours & Travels. Fast confirmation, reliable drivers, and comfortable vehicle options.",
  path: "/cab-booking",
  keywords: [
    "cab booking gandhinagar",
    "airport pickup drop gujarat",
    "round trip taxi",
    "innova crysta booking",
    "umiya tours cab",
  ],
});

export default function CabBookingPage() {
  return (
    <main className="travel-shell flex flex-col gap-10 py-10 md:py-14">
      <Breadcrumb crumbs={[{ label: "Cab Booking" }]} />

      <section className="brand-hero relative overflow-hidden rounded-3xl px-6 py-10 md:px-10 md:py-12">
        <div className="brand-hero-glow pointer-events-none absolute inset-0" />
        <div className="relative max-w-3xl">
          <Badge variant="solid" size="md" className="mb-4">
            Instant Cab Request
          </Badge>
          <h1 className="text-4xl font-bold text-brand-cream-100 md:text-5xl">
            Book Safe, Comfortable Cabs in Minutes
          </h1>
          <p className="mt-4 max-w-2xl text-base text-brand-mist-200 md:text-lg">
            Choose your trip type, route, schedule, and preferred vehicle. Our
            team will get back to you with confirmation and fare details.
          </p>
        </div>
      </section>

      <CabBookingForm />
    </main>
  );
}
