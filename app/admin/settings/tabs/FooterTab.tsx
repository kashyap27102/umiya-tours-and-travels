"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardBody, CardTitle, Textarea, Button } from "@/components/ui";
import { footerSettingsSchema, type FooterSettingsValues } from "@/schemas/settings";
import { updateFooterSettings } from "@/lib/actions";
import { notify } from "@/lib/notifications";

export function FooterTab({ defaults }: { defaults: FooterSettingsValues }) {
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, formState: { errors } } = useForm<FooterSettingsValues>({
    resolver: zodResolver(footerSettingsSchema),
    defaultValues: defaults,
  });

  const onSubmit = (data: FooterSettingsValues) => {
    startTransition(async () => {
      const result = await updateFooterSettings(data);
      if (result.success) {
        notify.success("Footer settings saved", "Changes are live on the site.");
      } else {
        notify.error("Failed to save", result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card variant="elevated" padding="lg">
        <div className="space-y-1 mb-5">
          <CardTitle className="text-lg">Footer</CardTitle>
          <CardBody>Tagline shown in the website footer.</CardBody>
        </div>

        <Textarea
          label="Footer Tagline"
          rows={3}
          errorMessage={errors.footerTagline?.message}
          {...register("footerTagline")}
        />

        <div className="mt-6 flex justify-end">
          <Button type="submit" variant="primary" size="md" disabled={isPending}>
            {isPending ? "Saving…" : "Save Footer"}
          </Button>
        </div>
      </Card>
    </form>
  );
}
