import { sendMail } from "@/lib/mailer";
import { EnquiryService, type NewEnquiry } from "@/services/enquiry-service";

type Mail = Parameters<typeof sendMail>[0];

export type IntakeResult = "ok" | "rate_limited" | "failed";

/**
 * Saves a public form submission, then emails the agency about it. The two are
 * independent: the enquiry is "ok" if either one worked, so a mail outage never
 * loses an enquiry and a database outage never loses the email.
 */
export async function receiveEnquiry(
  enquiry: NewEnquiry,
  mail: Mail,
): Promise<IntakeResult> {
  try {
    if (await EnquiryService.isRateLimited(enquiry.phone, enquiry.email)) {
      return "rate_limited";
    }
  } catch (error) {
    // Never block a real customer because the spam check failed.
    console.error("Enquiry rate-limit check failed:", error);
  }

  let saved = false;
  try {
    await EnquiryService.create(enquiry);
    saved = true;
  } catch (error) {
    console.error("Failed to save enquiry:", error);
  }

  let mailed = false;
  try {
    await sendMail(mail);
    mailed = true;
  } catch (error) {
    console.error("Failed to send enquiry email:", error);
  }

  return saved || mailed ? "ok" : "failed";
}

export const RATE_LIMITED_MESSAGE =
  "You've sent several requests just now. Please wait a few minutes, or call us directly.";
