const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

interface ContactInquiryEmailData {
  name: string;
  email: string;
  phone: string;
  serviceInterested: string;
  message: string;
}

const detailRow = (label: string, value: string) => `
  <tr>
    <td style="padding:10px 0;border-bottom:1px solid #E7E2D3;font-size:12px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:0.04em;width:150px;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:10px 0;border-bottom:1px solid #E7E2D3;font-size:15px;color:#1E2A38;vertical-align:top;">${escapeHtml(value)}</td>
  </tr>`;

interface VehicleInquiryEmailData {
  tripType: string;
  vehicleType: string;
  pickupLocation: string;
  dropLocation: string;
  departureDate: Date;
  returnDate?: Date | null;
  passengers: number;
  purpose?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  specialRequests?: string;
}

const formatDateTime = (date: Date) =>
  date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

export function vehicleInquiryEmail({
  tripType,
  vehicleType,
  pickupLocation,
  dropLocation,
  departureDate,
  returnDate,
  passengers,
  purpose,
  contactName,
  contactPhone,
  contactEmail,
  specialRequests,
}: VehicleInquiryEmailData) {
  const subject = contactName
    ? `New Vehicle Inquiry from ${contactName}`
    : "New Vehicle Inquiry";

  const rows: Array<[string, string]> = [
    ["Trip Type", tripType],
    ["Vehicle Type", vehicleType],
    ["Pickup Location", pickupLocation],
    ["Drop Location", dropLocation],
    ["Departure", formatDateTime(departureDate)],
  ];

  if (returnDate) {
    rows.push(["Return", formatDateTime(returnDate)]);
  }

  rows.push(["Passengers", String(passengers)]);

  if (purpose) {
    rows.push(["Purpose", purpose]);
  }

  if (contactName) {
    rows.push(["Contact Name", contactName]);
  }

  if (contactPhone) {
    rows.push(["Contact Phone", contactPhone]);
  }

  if (contactEmail) {
    rows.push(["Contact Email", contactEmail]);
  }

  const text = [
    "New Vehicle Inquiry",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    ...(specialRequests ? ["", "Special Requests:", specialRequests] : []),
  ].join("\n");

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:#F6F4E8;font-family:'DM Sans',Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F6F4E8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(30,42,56,0.08);">
            <tr>
              <td style="background-color:#1A6B72;padding:28px 32px;">
                <p style="margin:0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#F6F4E8;opacity:0.85;">Umiya Tours &amp; Travels</p>
                <h1 style="margin:6px 0 0;font-size:22px;line-height:1.3;color:#ffffff;font-weight:700;">New Vehicle Inquiry</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${rows.map(([label, value]) => detailRow(label, value)).join("")}
                </table>
                ${
                  specialRequests
                    ? `<p style="margin:24px 0 8px;font-size:12px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:0.04em;">Special Requests</p>
                <p style="margin:0;padding:16px;background-color:#F6F4E8;border-radius:10px;font-size:15px;line-height:1.6;color:#1E2A38;white-space:pre-wrap;">${escapeHtml(specialRequests)}</p>`
                    : ""
                }
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px;background-color:#F6F4E8;border-top:1px solid #E7E2D3;">
                <p style="margin:0;font-size:12px;line-height:1.5;color:#6B7280;">Submitted from the vehicle booking form on your website.${contactEmail ? ` Reply directly to this email to respond to the customer.` : ""}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, text, html };
}

export function contactInquiryEmail({
  name,
  email,
  phone,
  serviceInterested,
  message,
}: ContactInquiryEmailData) {
  const subject = `New Contact Inquiry from ${name}`;

  const text = [
    "New Contact Inquiry",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Service Interested: ${serviceInterested}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:#F6F4E8;font-family:'DM Sans',Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F6F4E8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(30,42,56,0.08);">
            <tr>
              <td style="background-color:#1A6B72;padding:28px 32px;">
                <p style="margin:0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#F6F4E8;opacity:0.85;">Umiya Tours &amp; Travels</p>
                <h1 style="margin:6px 0 0;font-size:22px;line-height:1.3;color:#ffffff;font-weight:700;">New Contact Inquiry</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${detailRow("Name", name)}
                  ${detailRow("Email", email)}
                  ${detailRow("Phone", phone)}
                  ${detailRow("Service Interested", serviceInterested)}
                </table>
                <p style="margin:24px 0 8px;font-size:12px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:0.04em;">Message</p>
                <p style="margin:0;padding:16px;background-color:#F6F4E8;border-radius:10px;font-size:15px;line-height:1.6;color:#1E2A38;white-space:pre-wrap;">${escapeHtml(message)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px;background-color:#F6F4E8;border-top:1px solid #E7E2D3;">
                <p style="margin:0;font-size:12px;line-height:1.5;color:#6B7280;">Submitted from the contact form on your website. Reply directly to this email to respond to ${escapeHtml(name)}.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, text, html };
}
