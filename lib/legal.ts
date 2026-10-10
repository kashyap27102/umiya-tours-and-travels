import { CONTACT } from "@/lib/constants";
import { getCachedSettings } from "@/services/settings-service";

/** Shown on the legal pages. Change it whenever their wording changes. */
export const LEGAL_UPDATED = "October 2026";

/** Contact details for the legal pages: the saved settings, else the defaults. */
export async function getLegalContact() {
  const settings = await getCachedSettings().catch(() => null);
  return {
    email: settings?.email || CONTACT.email,
    phone: settings?.phone || CONTACT.phone,
    address: settings?.address || CONTACT.address,
  };
}
