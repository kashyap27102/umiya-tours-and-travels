"use client";

import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardTitle,
  Input,
  Select,
  Textarea,
} from "@/components/ui";
import { submitContactForm } from "@/lib/actions/contact-actions";
import { SERVICE_INTEREST_OPTIONS } from "@/lib/form-constants";
import {
  contactSchema,
  type ContactData,
  type ContactInput,
} from "@/schemas/contact";

interface ContactFormProps {
  initialServiceInterested?: ContactData["serviceInterested"];
  initialMessage?: string;
}

export default function ContactForm({
  initialServiceInterested,
  initialMessage,
}: ContactFormProps) {
  const defaultValues: ContactInput = {
    name: "",
    email: "",
    phone: "",
    serviceInterested: initialServiceInterested ?? "General Inquiry",
    message: initialMessage ?? "",
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput, unknown, ContactData>({
    resolver: zodResolver(contactSchema),
    defaultValues,
  });

  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");

  const onSubmit = (data: ContactData) => {
    startTransition(async () => {
      const result = await submitContactForm(data, honeypot);

      if (result.success) {
        setStatus("success");
        setErrorMessage(null);
        reset(defaultValues);
        setHoneypot("");
      } else {
        setStatus("error");
        setErrorMessage(result.error);
      }
    });
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

      {status === "success" && (
        <div className="rounded-xl border border-brand-green-500/30 bg-brand-green-500/10 px-4 py-3 text-sm text-brand-green-700">
          Your inquiry was submitted successfully. Our team will contact you
          soon.
        </div>
      )}

      {status === "error" && errorMessage && (
        <div className="rounded-xl border border-red-400/40 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
          <Input
            label="Name"
            placeholder="Enter your name"
            errorMessage={errors.name?.message}
            {...register("name")}
          />

          <Input
            label="Phone"
            type="tel"
            placeholder="Enter your phone number"
            errorMessage={errors.phone?.message}
            {...register("phone")}
          />

          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            errorMessage={errors.email?.message}
            {...register("email")}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="service-interested"
            className="text-xs font-semibold uppercase tracking-wide text-brand-muted-600"
          >
            Service Interested
          </label>
          <Controller
            name="serviceInterested"
            control={control}
            render={({ field }) => (
              <Select
                id="service-interested"
                value={field.value}
                onChange={field.onChange}
                options={SERVICE_INTEREST_OPTIONS.map((option) => ({
                  label: option,
                  value: option,
                }))}
              />
            )}
          />
          {errors.serviceInterested && (
            <p className="text-xs text-red-500">
              {errors.serviceInterested.message}
            </p>
          )}
        </div>

        <Textarea
          label="Message"
          placeholder="Tell us about your trip plan, dates, destinations, group size, and preferences."
          errorMessage={errors.message?.message}
          {...register("message")}
        />

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Submit Inquiry"}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => {
              reset(defaultValues);
              setStatus("idle");
              setErrorMessage(null);
              setHoneypot("");
            }}
            disabled={isPending}
          >
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
}
