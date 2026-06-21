"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardBody, CardTitle, Input, Textarea, Button } from "@/components/ui";
import { heroSettingsSchema, type HeroSettingsValues } from "@/schemas/settings";
import { updateHeroSettings } from "@/lib/actions";
import { notify } from "@/lib/notifications";

export function HeroTab({ defaults }: { defaults: HeroSettingsValues }) {
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, formState: { errors } } = useForm<HeroSettingsValues>({
    resolver: zodResolver(heroSettingsSchema),
    defaultValues: defaults,
  });

  const onSubmit = (data: HeroSettingsValues) => {
    startTransition(async () => {
      const result = await updateHeroSettings(data);
      if (result.success) {
        notify.success("Hero settings saved", "Changes are live on the site.");
      } else {
        notify.error("Failed to save", result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card variant="elevated" padding="lg">
        <div className="space-y-1 mb-5">
          <CardTitle className="text-lg">Hero Banner</CardTitle>
          <CardBody>The main banner visitors see on the homepage.</CardBody>
        </div>

        <div className="space-y-4">
          <Input
            label="Eyebrow Text"
            errorMessage={errors.heroEyebrow?.message}
            {...register("heroEyebrow")}
          />
          <Input
            label="Heading"
            errorMessage={errors.heroHeading?.message}
            {...register("heroHeading")}
          />
          <Textarea
            label="Subheading"
            rows={2}
            errorMessage={errors.heroSubheading?.message}
            {...register("heroSubheading")}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" variant="primary" size="md" disabled={isPending}>
            {isPending ? "Saving…" : "Save Hero"}
          </Button>
        </div>
      </Card>
    </form>
  );
}
