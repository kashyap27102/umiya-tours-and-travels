import LegalPage, { type LegalSection } from "@/components/legal/LegalPage";
import { createMetadata } from "@/lib/metadata";
import { getLegalContact, LEGAL_UPDATED } from "@/lib/legal";

export const metadata = createMetadata({
  title: "Privacy Policy | Umiya Tours & Travels",
  description:
    "How Umiya Tours & Travels collects, uses and protects the personal details you share when you enquire about a trip, a cab or a group vehicle.",
  path: "/privacy-policy",
});

const SECTIONS: LegalSection[] = [
  {
    heading: "Who we are",
    body: [
      "This website is run by Umiya Tours & Travels (OPC) Pvt. Ltd., a travel agency based in Gandhinagar, Gujarat, India. This policy explains what personal information we collect through the website, why we collect it, and the choices you have.",
    ],
  },
  {
    heading: "Information we collect",
    body: ["We only collect what you choose to send us through our forms:"],
    items: [
      "Contact and package enquiry forms: your name, phone number, email address, the service or package you are interested in, your travel date and number of travellers (if given), and your message.",
      "Vehicle booking form: your trip type, vehicle choice, pickup and drop locations, travel dates, number of passengers, purpose of travel, special requests, and optionally your name, phone number and email address.",
      "Technical data: like most websites, our servers may log basic technical details such as your IP address, browser type and the pages requested. We use this to keep the site secure and working.",
    ],
  },
  {
    heading: "How we use your information",
    items: [
      "To reply to your enquiry and prepare quotes, itineraries and bookings.",
      "To contact you by phone, WhatsApp or email about the trip or vehicle you asked about.",
      "To keep a record of enquiries so that we can follow up and give you consistent information.",
      "To protect the website from spam and misuse.",
      "To meet legal, tax and accounting obligations when a booking is made.",
    ],
    body: [
      "We do not sell your personal information, and we do not use it to send marketing messages unrelated to your enquiry.",
    ],
  },
  {
    heading: "Who we share it with",
    body: [
      "We share information only where needed to run the website and serve you:",
    ],
    items: [
      "Service providers that host and operate the website, store our data, store images and deliver email notifications (for example our hosting, database, file storage and email providers). They may only use the data to provide those services to us.",
      "Hotels, transport operators, guides and other suppliers, but only the details needed to arrange your booking and only once you have asked us to proceed.",
      "Authorities, if we are required to do so by law.",
    ],
  },
  {
    heading: "Cookies",
    body: [
      "The public pages of this website do not use advertising or tracking cookies. A small session cookie is used only for our staff to sign in to the administration area. If we add analytics or advertising tools in future, we will update this page.",
    ],
  },
  {
    heading: "How long we keep it",
    body: [
      "We keep enquiry details only as long as needed to handle your request and for our business records, and for longer where the law requires (for example for completed bookings). You can ask us to delete your enquiry details at any time.",
    ],
  },
  {
    heading: "How we protect it",
    body: [
      "We use reasonable technical and organisational measures to protect your information, including encrypted connections (HTTPS), restricted access to our administration area and protection against automated spam. No system is completely secure, so we cannot guarantee absolute security.",
    ],
  },
  {
    heading: "Your rights",
    body: [
      "Under applicable Indian law, including the Digital Personal Data Protection Act, 2023, you may ask us to:",
    ],
    items: [
      "tell you what personal information we hold about you,",
      "correct information that is wrong or incomplete,",
      "delete your information, or",
      "stop contacting you.",
    ],
  },
  {
    heading: "Links to other websites",
    body: [
      "Our pages may link to other websites, such as WhatsApp or social media profiles. We are not responsible for their content or privacy practices, so please read their policies.",
    ],
  },
  {
    heading: "Children",
    body: [
      "Our forms are meant for adults planning travel. We do not knowingly collect information from children. If you believe a child has sent us details, please contact us and we will remove them.",
    ],
  },
  {
    heading: "Changes to this policy",
    body: [
      "We may update this policy from time to time. The date at the top shows when it was last changed.",
    ],
  },
];

export default async function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="What we collect when you contact us, how we use it, and the choices you have."
      updated={LEGAL_UPDATED}
      sections={SECTIONS}
      contact={await getLegalContact()}
    />
  );
}
