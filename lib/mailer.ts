import nodemailer from "nodemailer";

declare global {
  // eslint-disable-next-line no-var
  var mailTransporter: nodemailer.Transporter | undefined;
}

const transporter =
  global.mailTransporter ||
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

if (process.env.NODE_ENV !== "production") {
  global.mailTransporter = transporter;
}

export async function sendMail(options: nodemailer.SendMailOptions) {
  return transporter.sendMail({
    from: `"Umiya Tours & Travels" <${process.env.GMAIL_USER}>`,
    ...options,
  });
}
