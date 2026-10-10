"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardBody, CardTitle, Input, Textarea, Button } from "@/components/ui";
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
          <CardBody>Tagline and social profile links shown in the website footer.</CardBody>
        </div>

        <Textarea
          label="Footer Tagline"
          rows={3}
          errorMessage={errors.footerTagline?.message}
          {...register("footerTagline")}
        />

        <div className="mt-6 space-y-1">
          <h3 className="text-sm font-semibold text-brand-ink-900">Social profiles</h3>
          <p className="text-xs text-brand-muted-600">
            Optional. Paste the full link (https://…). Leave a box empty to
            hide that link.
          </p>
        </div>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <Input
            label="Instagram"
            placeholder="https://instagram.com/yourpage"
            errorMessage={errors.instagramUrl?.message}
            {...register("instagramUrl")}
          />
          <Input
            label="Facebook"
            placeholder="https://facebook.com/yourpage"
            errorMessage={errors.facebookUrl?.message}
            {...register("facebookUrl")}
          />
          <Input
            label="YouTube"
            placeholder="https://youtube.com/@yourchannel"
            errorMessage={errors.youtubeUrl?.message}
            {...register("youtubeUrl")}
          />
          <Input
            label="Google Business Profile"
            placeholder="https://g.page/yourbusiness"
            errorMessage={errors.googleBusinessUrl?.message}
            {...register("googleBusinessUrl")}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" variant="primary" size="md" disabled={isPending}>
            {isPending ? "Saving…" : "Save Footer"}
          </Button>
        </div>
      </Card>
    </form>
  );
}
