"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardTitle,
  Input,
  Textarea,
} from "@/components/ui";
import { appConfig } from "@/lib/config";
import { SERVICE_INTEREST_OPTIONS } from "@/lib/form-constants";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { contactSchema, type ContactInput } from "@/schemas/contact";

type ContactFormValues = {
  name: string;
  email: string;
  phone: string;
  serviceInterested: (typeof SERVICE_INTEREST_OPTIONS)[number];
  message: string;
};

const initialValues: ContactFormValues = {
  name: "",
  email: "",
  phone: "",
  serviceInterested: "General Inquiry",
  message: "",
};

export default function ContactForm() {
  const [values, setValues] = useState(initialValues);

  const {
    submit,
    isSubmitting,
    isSuccess,
    isError,
    errorMessage,
    fieldErrors,
    reset,
  } = useFormSubmit({
    schema: contactSchema,
    endpoint: appConfig.forms.formspree.contactEndpoint,
    toPayload: (data) => ({
      ...data,
      service: "Contact Inquiry",
    }),
  });

  const setField = <K extends keyof ContactFormValues>(
    key: K,
    next: ContactFormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: next }));
  };

  const commonError = useMemo(
    () => fieldErrors as Record<string, string | undefined>,
    [fieldErrors],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: ContactInput = {
      ...values,
    };

    const result = await submit(payload);

    if (result.ok) {
      setValues(initialValues);
    }
  };

  return (
    <Card variant="elevated" padding="lg" className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <CardTitle className="text-2xl md:text-3xl">Contact Form</CardTitle>
          <CardBody className="mt-2">
            Share your travel requirements and we will call you back with the
            best options.
          </CardBody>
        </div>
        <Badge variant="brand" size="md">
          Quick Response
        </Badge>
      </div>

      {isSuccess && (
        <div className="rounded-xl border border-brand-green-500/30 bg-brand-green-500/10 px-4 py-3 text-sm text-brand-green-700">
          Your inquiry was submitted successfully. Our team will contact you
          soon.
        </div>
      )}

      {isError && errorMessage && (
        <div className="rounded-xl border border-red-400/40 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Input
            label="Name"
            placeholder="Enter your name"
            value={values.name}
            onChange={(e) => setField("name", e.target.value)}
            errorMessage={commonError.name}
          />

          <Input
            label="Phone"
            type="tel"
            placeholder="Enter your phone number"
            value={values.phone}
            onChange={(e) => setField("phone", e.target.value)}
            errorMessage={commonError.phone}
          />

          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={values.email}
            onChange={(e) => setField("email", e.target.value)}
            errorMessage={commonError.email}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="service-interested"
            className="text-xs font-semibold uppercase tracking-wide text-brand-muted-600"
          >
            Service Interested
          </label>
          <select
            id="service-interested"
            className="min-h-11 w-full rounded-xl border border-brand-blue-900/20 bg-white px-4 py-2.5 text-sm font-medium text-brand-ink-900 transition-all outline-none focus:border-brand-blue-500 focus:ring-2 focus:ring-brand-blue-500/20"
            value={values.serviceInterested}
            onChange={(e) =>
              setField(
                "serviceInterested",
                e.target.value as ContactFormValues["serviceInterested"],
              )
            }
          >
            {SERVICE_INTEREST_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {commonError.serviceInterested && (
            <p className="text-xs text-red-500">
              {commonError.serviceInterested}
            </p>
          )}
        </div>

        <Textarea
          label="Message"
          placeholder="Tell us about your trip plan, dates, destinations, group size, and preferences."
          value={values.message}
          onChange={(e) => setField("message", e.target.value)}
          errorMessage={commonError.message}
        />

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Inquiry"}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => {
              setValues(initialValues);
              reset();
            }}
            disabled={isSubmitting}
          >
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
}
