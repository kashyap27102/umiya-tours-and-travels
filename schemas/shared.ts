import { z } from "zod";
import { FORM_LIMITS } from "@/lib/form-constants";

const stripExtraSpaces = (value: string) => value.trim().replace(/\s+/g, " ");

export const nameSchema = z
  .string()
  .trim()
  .min(FORM_LIMITS.nameMin, "Name is too short")
  .max(FORM_LIMITS.nameMax, "Name is too long")
  .transform(stripExtraSpaces);

export const locationSchema = z
  .string()
  .trim()
  .min(FORM_LIMITS.locationMin, "Location is too short")
  .max(FORM_LIMITS.locationMax, "Location is too long")
  .transform(stripExtraSpaces);

export const messageSchema = z
  .string()
  .trim()
  .min(FORM_LIMITS.messageMin, "Please add more details")
  .max(FORM_LIMITS.messageMax, "Message is too long")
  .transform(stripExtraSpaces);

export const optionalMessageSchema = z
  .string()
  .trim()
  .max(FORM_LIMITS.specialRequestMax, "Special request is too long")
  .transform(stripExtraSpaces)
  .optional()
  .or(z.literal(""));

export const phoneSchema = z.preprocess(
  (value) => (typeof value === "string" ? value.replace(/\s+/g, "") : value),
  z.string().regex(/^[+]?[0-9]{10,15}$/, "Enter a valid phone number"),
);

export const emailSchema = z
  .string()
  .email("Enter a valid email address")
  .transform((value) => value.toLowerCase().trim());

export const passengersSchema = z.coerce
  .number()
  .int("Passengers must be a whole number")
  .min(FORM_LIMITS.passengersMin, "At least one passenger is required")
  .max(FORM_LIMITS.passengersMax, "Passenger count is too high");

export const dateSchema = z.coerce.date();

export const optionalDateSchema = z
  .union([z.coerce.date(), z.null(), z.undefined()])
  .optional();
