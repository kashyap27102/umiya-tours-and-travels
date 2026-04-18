import { z } from "zod";
import { SERVICE_INTEREST_OPTIONS } from "@/lib/form-constants";
import {
  emailSchema,
  messageSchema,
  nameSchema,
  phoneSchema,
} from "@/schemas/shared";

export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  serviceInterested: z.enum(SERVICE_INTEREST_OPTIONS, {
    error: "Select a service",
  }),
  message: messageSchema,
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.infer<typeof contactSchema>;
