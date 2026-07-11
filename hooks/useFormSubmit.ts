"use client";

import { useCallback, useState } from "react";
import { z } from "zod";
import {
  mapZodFieldErrors,
  toFormDataEntries,
  type FieldErrors,
} from "@/lib/form-utils";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

interface UseFormSubmitOptions<TSchema extends z.ZodTypeAny> {
  schema: TSchema;
  endpoint: string;
  /** Optional payload transformation before submission. */
  toPayload?: (value: z.output<TSchema>) => Record<string, unknown>;
}

export function useFormSubmit<TSchema extends z.ZodTypeAny>({
  schema,
  endpoint,
  toPayload,
}: UseFormSubmitOptions<TSchema>) {
  type InputValues = z.input<TSchema>;

  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    FieldErrors<Record<string, unknown>>
  >({});

  const reset = useCallback(() => {
    setStatus("idle");
    setErrorMessage(null);
    setFieldErrors({});
  }, []);

  const submit = useCallback(
    async (values: InputValues) => {
      setStatus("submitting");
      setErrorMessage(null);
      setFieldErrors({});

      const parsed = schema.safeParse(values);
      if (!parsed.success) {
        setFieldErrors(
          mapZodFieldErrors<Record<string, unknown>>(parsed.error),
        );
        setStatus("error");
        return { ok: false as const, type: "validation" as const };
      }

      if (!endpoint) {
        setErrorMessage("Form endpoint is not configured yet.");
        setStatus("error");
        return { ok: false as const, type: "config" as const };
      }

      try {
        const payload = toPayload
          ? toPayload(parsed.data)
          : (parsed.data as Record<string, unknown>);
        const body = toFormDataEntries(payload);

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          setStatus("error");
          setErrorMessage("Unable to submit the form. Please try again.");
          return { ok: false as const, type: "network" as const };
        }

        setStatus("success");
        return { ok: true as const };
      } catch {
        setStatus("error");
        setErrorMessage("Something went wrong. Please try again.");
        return { ok: false as const, type: "network" as const };
      }
    },
    [endpoint, schema, toPayload],
  );

  return {
    status,
    isSubmitting: status === "submitting",
    isSuccess: status === "success",
    isError: status === "error",
    fieldErrors,
    errorMessage,
    submit,
    reset,
  };
}
