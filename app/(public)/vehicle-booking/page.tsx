import { createMetadata } from "@/lib/metadata";
import VehicleBookingForm from "@/components/forms/VehicleBookingForm";
import PageHero from "@/components/PageHero";

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
    <main className="flex flex-col gap-10">
      <PageHero
        badge="Group Travel Solutions"
        heading="Book Reliable Group Vehicles for Every Journey"
        description="Choose the right vehicle, share your route and dates, and submit your details. Our team will confirm availability and pricing quickly."
      />
      <div className="travel-shell">
        <VehicleBookingForm />
      </div>
    </main>
  );
}
