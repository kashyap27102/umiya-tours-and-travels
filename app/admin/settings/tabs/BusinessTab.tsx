"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardBody, CardTitle, Input, Textarea, Button } from "@/components/ui";
import { businessSettingsSchema, type BusinessSettingsValues } from "@/schemas/settings";
import { updateBusinessSettings } from "@/lib/actions";
import { notify } from "@/lib/notifications";

export function BusinessTab({ defaults }: { defaults: BusinessSettingsValues }) {
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, formState: { errors } } = useForm<BusinessSettingsValues>({
    resolver: zodResolver(businessSettingsSchema),
    defaultValues: defaults,
  });

  const onSubmit = (data: BusinessSettingsValues) => {
    startTransition(async () => {
      const result = await updateBusinessSettings(data);
      if (result.success) {
        notify.success("Business settings saved", "Changes are live on the site.");
      } else {
        notify.error("Failed to save", result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card variant="elevated" padding="lg">
        <div className="space-y-1 mb-5">
          <CardTitle className="text-lg">Business Information</CardTitle>
          <CardBody>Core contact details used across the site, footer, and meta tags.</CardBody>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Site / Business Name"
              errorMessage={errors.siteName?.message}
              {...register("siteName")}
            />
            <Input
              label="Phone Number"
              errorMessage={errors.phone?.message}
              {...register("phone")}
            />
            <Input
              label="Email Address"
              type="email"
              errorMessage={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="WhatsApp Number"
              errorMessage={errors.whatsappNumber?.message}
              {...register("whatsappNumber")}
            />
          </div>
          <Textarea
            label="Address"
            rows={2}
            errorMessage={errors.address?.message}
            {...register("address")}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" variant="primary" size="md" disabled={isPending}>
            {isPending ? "Saving…" : "Save Business"}
          </Button>
        </div>
      </Card>
    </form>
  );
}
