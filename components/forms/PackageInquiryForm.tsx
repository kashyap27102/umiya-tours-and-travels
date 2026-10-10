"use client";

import { useMemo, useState, useTransition } from "react";
import { Button, Input, Textarea } from "@/components/ui";
import { submitPackageInquiry } from "@/lib/actions/package-inquiry-actions";
import { mapZodFieldErrors, type FieldErrors } from "@/lib/form-utils";
import {
  packageInquirySchema,
  type PackageInquiryInput,
} from "@/schemas/package-inquiry";

type PackageInquiryFormValues = {
  packageSlug: string;
  travelDate: string;
  travelers: string;
  name: string;
  email: string;
  phone: string;
  message: string;
};

const FIELD_LABELS: Record<string, string> = {
  packageSlug: "Package",
  travelers: "Travelers",
  travelDate: "Travel date",
  name: "Name",
  phone: "Phone",
  email: "Email",
  message: "Message",
};

const makeInitialValues = (
  packages: { slug: string; name: string }[],
  packageSlug?: string,
  initial?: { message?: string; travelers?: number },
): PackageInquiryFormValues => ({
  packageSlug: packageSlug ?? packages[0]?.slug ?? "",
  travelDate: "",
  travelers: initial?.travelers ? String(initial.travelers) : "",
  name: "",
  email: "",
  phone: "",
  message: initial?.message ?? "",
});

interface PackageInquiryFormProps {
  preselectedPackageSlug?: string;
  packages: { slug: string; name: string }[];
  /** Starting text for the message box (e.g. the chosen stay level). */
  initialMessage?: string;
  /** Starting value for the travellers field (e.g. the chosen group size). */
  initialTravelers?: number;
  onSuccess?: () => void;
}

export default function PackageInquiryForm({
  preselectedPackageSlug,
  packages,
  initialMessage,
  initialTravelers,
  onSuccess,
}: PackageInquiryFormProps) {
  const [values, setValues] = useState<PackageInquiryFormValues>(() =>
    makeInitialValues(packages, preselectedPackageSlug, {
      message: initialMessage,
      travelers: initialTravelers,
    }),
  );
  const [honeypot, setHoneypot] = useState("");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    FieldErrors<Record<string, unknown>>
  >({});

  const setField = <K extends keyof PackageInquiryFormValues>(
    key: K,
    next: PackageInquiryFormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: next }));
  };

  const commonError = useMemo(
    () => fieldErrors as Record<string, string | undefined>,
    [fieldErrors],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    const rawPayload: PackageInquiryInput = {
      packageSlug: values.packageSlug,
      travelDate: values.travelDate
        ? (values.travelDate as unknown as Date)
        : undefined,
      travelers: values.travelers ? Number(values.travelers) : undefined,
      name: values.name,
      email: values.email,
      phone: values.phone,
      message: values.message,
      serviceInterested: "Pre-Designed Packages",
    };

    const parsed = packageInquirySchema.safeParse(rawPayload);
    if (!parsed.success) {
      const fieldErrors = mapZodFieldErrors(parsed.error);
      const names = Object.keys(fieldErrors).map(
        (key) => FIELD_LABELS[key] ?? key,
      );
      setFieldErrors(fieldErrors);
      setStatus("error");
      setErrorMessage(
        `Please fix ${names.length === 1 ? "this field" : "these fields"} and submit again: ${names.join(", ")}.`,
      );
      return;
    }

    startTransition(async () => {
      const result = await submitPackageInquiry(parsed.data, honeypot);

      if (result.success) {
        setStatus("success");
        setValues(makeInitialValues(packages, preselectedPackageSlug));
        setHoneypot("");
        onSuccess?.();
      } else {
        setStatus("error");
        setErrorMessage(result.error);
      }
    });
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-brand-muted-600">
        Share your preferred dates and traveler count. We will call you back
        with quote and final itinerary options.
      </p>

      {status === "success" && (
        <div className="rounded-xl border border-brand-green-500/30 bg-brand-green-500/10 px-4 py-3 text-sm text-brand-green-700">
          Your package inquiry was submitted successfully. We will contact you
          shortly.
        </div>
      )}

      {status === "error" && errorMessage && (
        <div
          role="alert"
          className="rounded-xl border border-red-400/40 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      )}

      <form noValidate onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
        />

        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label
              htmlFor="package-slug"
              className="text-xs font-semibold uppercase tracking-wide text-brand-muted-600"
            >
              Select Package
            </label>
            <select
              id="package-slug"
              className="min-h-11 w-full rounded-xl border border-brand-blue-900/20 bg-white px-4 py-2.5 text-sm font-medium text-brand-ink-900 transition-all outline-none focus:border-brand-blue-500 focus:ring-2 focus:ring-brand-blue-500/20"
              value={values.packageSlug}
              onChange={(event) => setField("packageSlug", event.target.value)}
            >
              {packages.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
            {commonError.packageSlug && (
              <p className="text-xs text-red-500">{commonError.packageSlug}</p>
            )}
          </div>

          <Input
            label="Travelers"
            type="number"
            min={1}
            max={40}
            placeholder="e.g. 4"
            value={values.travelers}
            onChange={(event) => setField("travelers", event.target.value)}
            errorMessage={commonError.travelers}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Input
            label="Travel Date (Optional)"
            type="date"
            value={values.travelDate}
            onChange={(event) => setField("travelDate", event.target.value)}
            errorMessage={commonError.travelDate}
          />

          <Input
            label="Name"
            placeholder="Enter your name"
            value={values.name}
            onChange={(event) => setField("name", event.target.value)}
            errorMessage={commonError.name}
          />

          <Input
            label="Phone"
            type="tel"
            placeholder="Enter your phone number"
            value={values.phone}
            onChange={(event) => setField("phone", event.target.value)}
            errorMessage={commonError.phone}
          />
        </div>

        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={values.email}
          onChange={(event) => setField("email", event.target.value)}
          errorMessage={commonError.email}
        />

        <Textarea
          label="Message"
          placeholder="Mention room preference, meal preference, flight requirement, or any special requests."
          value={values.message}
          onChange={(event) => setField("message", event.target.value)}
          errorMessage={commonError.message}
        />

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Submit Package Inquiry"}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => {
              setValues(makeInitialValues(packages, preselectedPackageSlug));
              setHoneypot("");
              setStatus("idle");
              setErrorMessage(null);
              setFieldErrors({});
            }}
            disabled={isPending}
          >
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
}
