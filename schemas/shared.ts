import { z } from "zod";
import { FORM_LIMITS } from "@/lib/form-constants";

const stripExtraSpaces = (value: string) => value.trim().replace(/\s+/g, " ");

export const nameSchema = z
  .string({ error: "Enter your name" })
  .trim()
  .min(FORM_LIMITS.nameMin, `Enter your name (at least ${FORM_LIMITS.nameMin} letters)`)
  .max(FORM_LIMITS.nameMax, `Name is too long (${FORM_LIMITS.nameMax} characters max)`)
  .transform(stripExtraSpaces);

export const locationSchema = z
  .string()
  .trim()
  .min(FORM_LIMITS.locationMin, "Location is too short")
  .max(FORM_LIMITS.locationMax, "Location is too long")
  .transform(stripExtraSpaces);

/** A required place name with errors that say which place is meant. */
export const namedLocationSchema = (what: string) =>
  z
    .string({ error: `Enter the ${what}` })
    .trim()
    .min(FORM_LIMITS.locationMin, `Enter the ${what}`)
    .max(
      FORM_LIMITS.locationMax,
      `The ${what} is too long (${FORM_LIMITS.locationMax} characters max)`,
    )
    .transform(stripExtraSpaces);

export const messageSchema = z
  .string({ error: "Tell us a little about your trip" })
  .trim()
  .min(
    FORM_LIMITS.messageMin,
    `Tell us a little more (at least ${FORM_LIMITS.messageMin} characters)`,
  )
  .max(
    FORM_LIMITS.messageMax,
    `Message is too long (${FORM_LIMITS.messageMax} characters max)`,
  )
  .transform(stripExtraSpaces);

export const optionalMessageSchema = z
  .string()
  .trim()
  .max(FORM_LIMITS.specialRequestMax, "Special request is too long")
  .transform(stripExtraSpaces)
  .optional()
  .or(z.literal(""));

const PHONE_HINT = "Enter a valid phone number (10 to 15 digits)";

export const phoneSchema = z.preprocess(
  (value) => (typeof value === "string" ? value.replace(/\s+/g, "") : value),
  z
    .string({ error: "Enter your phone number" })
    .min(1, "Enter your phone number")
    .regex(/^[+]?[0-9]{10,15}$/, PHONE_HINT),
);

export const optionalNameSchema = z
  .string()
  .trim()
  .max(FORM_LIMITS.nameMax, "Name is too long")
  .transform(stripExtraSpaces)
  .optional()
  .or(z.literal(""));

export const optionalPhoneSchema = z
  .preprocess(
    (value) => (typeof value === "string" ? value.replace(/\s+/g, "") : value),
    z.union([
      z.literal(""),
      z.string().regex(/^[+]?[0-9]{10,15}$/, PHONE_HINT),
    ]),
  )
  .optional();

export const emailSchema = z
  .string({ error: "Enter your email address" })
  .trim()
  .min(1, "Enter your email address")
  .email("Enter a valid email address, like name@example.com")
  .transform((value) => value.toLowerCase().trim());

export const optionalEmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(
    z.union([z.literal(""), z.string().email("Enter a valid email address")]),
  )
  .optional();

export const passengersSchema = z.coerce
  .number({ error: "Enter the number of passengers" })
  .int("Passengers must be a whole number")
  .min(FORM_LIMITS.passengersMin, "At least one passenger is required")
  .max(
    FORM_LIMITS.passengersMax,
    `We can take up to ${FORM_LIMITS.passengersMax} passengers per booking. Call us for larger groups.`,
  );

export const dateSchema = z.coerce.date({
  error: "Select a valid date and time",
});

// A date input left empty arrives as "", which means "not given".
export const optionalDateSchema = z
  .preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.coerce.date({ error: "Select a valid date and time" }).optional(),
  )
  .optional();
