export const SITE_NAME = "Umiya Tours & Travels";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://umiyatoursandtravels.com";

export const DEFAULT_OG_IMAGE = "/og/travel-agency-cover.jpg";

export const CONTACT = {
  phone: "+91 99741 48390",
  whatsappNumber: "919974148390",
  email: "info@umiyatoursandtravels.com",
  address: "204, Keshav Aaradhyam, Kudasan, Gandhinagar, Gujarat 382419",
};

export const CORE_ROUTES = [
  "/",
  "/about",
  "/services",
  "/packages",
  "/cab-booking",
  "/vehicle-booking",
  "/contact",
] as const;

export const PACKAGE_SLUGS = [
  "goa-beach-escape-4n-5d",
  "manali-snow-trail-5n-6d",
  "rajasthan-royal-heritage-6n-7d",
  "char-dham-yatra-10n-11d",
  "kerala-backwater-retreat-4n-5d",
  "dubai-city-luxury-4n-5d",
] as const;
