import { createMetadata } from "@/lib/metadata";
import VehicleBookingForm from "@/components/forms/VehicleBookingForm";
import PageHero from "@/components/PageHero";

export const metadata = createMetadata({
  title: "Vehicle Booking | Umiya Tours & Travels",
  description:
    "Book cabs and group vehicles in one place — Sedan, SUV, Innova Crysta, Luxury, Tempo Traveller, Mini Bus, and Full Bus. Ideal for one-way trips, round trips, airport transfers, tours, pilgrimages, school trips, weddings, and corporate events.",
  path: "/vehicle-booking",
  keywords: [
    "cab booking gandhinagar",
    "vehicle booking gandhinagar",
    "airport pickup drop gujarat",
    "round trip taxi",
    "innova crysta booking",
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
        badge="Cabs & Group Travel"
        heading="Book Reliable Cabs and Group Vehicles for Every Journey"
        description="Choose your trip type, route, schedule, and preferred vehicle — from a Sedan to a Full Bus. Our team will confirm availability and pricing quickly."
      />
      <div className="travel-shell">
        <VehicleBookingForm />
      </div>
    </main>
  );
}
