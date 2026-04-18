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
import { travelPackages } from "@/lib/packages-data";
import { useFormSubmit } from "@/hooks/useFormSubmit";
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

const makeInitialValues = (packageSlug?: string): PackageInquiryFormValues => ({
  packageSlug: packageSlug ?? travelPackages[0]?.slug ?? "",
  travelDate: "",
  travelers: "",
  name: "",
  email: "",
  phone: "",
  message: "",
});

interface PackageInquiryFormProps {
  preselectedPackageSlug?: string;
}

export default function PackageInquiryForm({
  preselectedPackageSlug,
}: PackageInquiryFormProps) {
  const [values, setValues] = useState<PackageInquiryFormValues>(() =>
    makeInitialValues(preselectedPackageSlug),
  );

  const {
    submit,
    isSubmitting,
    isSuccess,
    isError,
    errorMessage,
    fieldErrors,
    reset,
  } = useFormSubmit({
    schema: packageInquirySchema,
    endpoint: appConfig.forms.formspree.packageInquiryEndpoint,
    toPayload: (data) => ({
      ...data,
      service: "Package Inquiry",
    }),
  });

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: PackageInquiryInput = {
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

    const result = await submit(payload);

    if (result.ok) {
      setValues(makeInitialValues(preselectedPackageSlug));
    }
  };

  return (
    <Card variant="elevated" padding="lg" className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <CardTitle className="text-2xl md:text-3xl">
            Package Inquiry
          </CardTitle>
          <CardBody className="mt-2">
            Share your preferred dates and traveler count. We will call you back
            with quote and final itinerary options.
          </CardBody>
        </div>
        <Badge variant="brand" size="md">
          Quote Assistance
        </Badge>
      </div>

      {isSuccess && (
        <div className="rounded-xl border border-brand-green-500/30 bg-brand-green-500/10 px-4 py-3 text-sm text-brand-green-700">
          Your package inquiry was submitted successfully. We will contact you
          shortly.
        </div>
      )}

      {isError && errorMessage && (
        <div className="rounded-xl border border-red-400/40 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
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
              {travelPackages.map((item) => (
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
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Package Inquiry"}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => {
              setValues(makeInitialValues(preselectedPackageSlug));
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
