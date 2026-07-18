import { createMetadata } from "@/lib/metadata";
import CabBookingForm from "@/components/forms/CabBookingForm";
import PageHero from "@/components/PageHero";

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
    <main className="flex flex-col gap-10">
      <PageHero
        heading="Book Safe, Comfortable Cabs in Minutes"
        description="Choose your trip type, route, schedule, and preferred vehicle. Our team will get back to you with confirmation and fare details."
      />
      <div className="travel-shell">
        <CabBookingForm />
      </div>
    </main>
  );
}
