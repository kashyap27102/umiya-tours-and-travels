import LegalPage, { type LegalSection } from "@/components/legal/LegalPage";
import { createMetadata } from "@/lib/metadata";
import { getLegalContact, LEGAL_UPDATED } from "@/lib/legal";

export const metadata = createMetadata({
  title: "Terms & Conditions | Umiya Tours & Travels",
  description:
    "The terms that apply when you use the Umiya Tours & Travels website and book tour packages, cabs or group vehicles with us.",
  path: "/terms",
});

const SECTIONS: LegalSection[] = [
  {
    heading: "About these terms",
    body: [
      "These terms apply when you use this website or book a tour package, cab or group vehicle with Umiya Tours & Travels (OPC) Pvt. Ltd. (\"we\", \"us\"). By using the website or making a booking you agree to them. If you do not agree, please do not use the website or book with us.",
    ],
  },
  {
    heading: "Information on this website",
    body: [
      "We try to keep package details, itineraries, hotels, inclusions and prices accurate and up to date. They are shown as a guide. Prices are \"starting\" prices per person for the option shown, and the final price depends on your dates, group size, stay level, vehicle and availability. Photographs are illustrative.",
      "Nothing on this website is a binding offer until we confirm it to you in writing.",
    ],
  },
  {
    heading: "Enquiries and bookings",
    items: [
      "Sending an enquiry or booking request through the website does not confirm a booking.",
      "A booking is confirmed only when we send you a written confirmation, usually after you have agreed the itinerary and price and paid any advance we ask for.",
      "Availability of hotels, vehicles and services can change until a booking is confirmed.",
    ],
  },
  {
    heading: "Payments",
    body: [
      "Payment amounts, deadlines and methods are stated in your quote or confirmation. We may cancel a booking that is not paid by the agreed date. Taxes and any extra charges (such as entry tickets, tolls, parking or optional activities) will be stated clearly if they are not included.",
    ],
  },
  {
    heading: "Changes and cancellations",
    items: [
      "Cancellation and refund terms depend on the package, the hotels and transport operators involved, and the time left before travel. We will tell you the applicable terms before you pay.",
      "Fees charged to us by hotels, airlines, railways, transport operators or other suppliers may be passed on to you.",
      "If you ask to change dates or details, we will try to help, but a change may cost extra and depends on availability.",
      "We may need to change or cancel a trip because of weather, safety, strikes, road or flight disruptions, or other events outside our control. We will offer a suitable alternative or a refund of the amount we are able to recover, as applicable.",
    ],
  },
  {
    heading: "Your responsibilities as a traveller",
    items: [
      "Give us accurate details, including names exactly as they appear on identity documents.",
      "Carry valid identity proof and, for international trips, a valid passport and any visas or permits needed.",
      "Make sure you are fit to travel and follow local laws, guide instructions and safety advice.",
      "Treat vehicles, hotels and local communities with respect. You may be charged for damage you cause.",
    ],
  },
  {
    heading: "Third-party suppliers",
    body: [
      "Hotels, transport operators, guides and activity providers are independent businesses with their own terms. We choose them with care, but we are not responsible for their acts or omissions beyond what the law requires.",
    ],
  },
  {
    heading: "Our responsibility",
    body: [
      "We will arrange the services we have confirmed to you with reasonable skill and care. To the extent the law allows, we are not liable for loss or damage caused by events outside our reasonable control, for indirect or consequential loss, or for more than the amount you paid us for the affected booking. Nothing in these terms limits liability that cannot be limited by law.",
      "We recommend that you take travel insurance for your trip.",
    ],
  },
  {
    heading: "Using the website",
    items: [
      "Do not misuse the website, send spam or false enquiries, or try to disrupt or gain unauthorised access to it.",
      "The text, images and design on this website belong to us or our licensors. You may not copy or reuse them commercially without our permission.",
      "Reviews shown on the website are shared by travellers who chose to give them.",
    ],
  },
  {
    heading: "Governing law",
    body: [
      "These terms are governed by the laws of India. Any dispute will be subject to the courts at Gandhinagar, Gujarat, unless the law gives you the right to go elsewhere.",
    ],
  },
  {
    heading: "Changes to these terms",
    body: [
      "We may update these terms from time to time. The date at the top shows when they were last changed. A booking is governed by the terms in force when it was confirmed.",
    ],
  },
];

export default async function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      intro="The ground rules for using our website and booking trips and vehicles with us."
      updated={LEGAL_UPDATED}
      sections={SECTIONS}
      contact={await getLegalContact()}
    />
  );
}
