import { z } from "zod";

export type FieldErrors<T extends Record<string, unknown>> = Partial<
  Record<keyof T, string>
>;

export const mapZodFieldErrors = <T extends Record<string, unknown>>(
  error: z.ZodError,
): FieldErrors<T> => {
  const fieldErrors: Partial<Record<keyof T, string>> = {};

  for (const issue of error.issues) {
    const pathKey = issue.path[0];
    if (!pathKey || typeof pathKey !== "string") {
      continue;
    }

    const typedKey = pathKey as keyof T;
    if (!fieldErrors[typedKey]) {
      fieldErrors[typedKey] = issue.message;
    }
  }

  return fieldErrors;
};

export const toFormDataEntries = (
  payload: Record<string, unknown>,
): Record<string, string> => {
  const entries: Record<string, string> = {};

  for (const [key, value] of Object.entries(payload)) {
    if (value === null || value === undefined || value === "") {
      continue;
    }

    if (value instanceof Date) {
      entries[key] = value.toISOString();
      continue;
    }

    if (Array.isArray(value)) {
      entries[key] = value.join(", ");
      continue;
    }

    entries[key] = String(value);
  }

  return entries;
};
