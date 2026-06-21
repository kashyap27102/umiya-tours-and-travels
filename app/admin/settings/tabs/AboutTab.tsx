"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardBody, CardTitle, Input, Textarea, Button } from "@/components/ui";
import { aboutSettingsSchema, type AboutSettingsValues } from "@/schemas/settings";
import { updateAboutSettings } from "@/lib/actions";
import { notify } from "@/lib/notifications";

export function AboutTab({ defaults }: { defaults: AboutSettingsValues }) {
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, formState: { errors } } = useForm<AboutSettingsValues>({
    resolver: zodResolver(aboutSettingsSchema),
    defaultValues: defaults,
  });

  const onSubmit = (data: AboutSettingsValues) => {
    startTransition(async () => {
      const result = await updateAboutSettings(data);
      if (result.success) {
        notify.success("About settings saved", "Changes are live on the site.");
      } else {
        notify.error("Failed to save", result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card variant="elevated" padding="lg">
        <div className="space-y-1 mb-5">
          <CardTitle className="text-lg">About Page</CardTitle>
          <CardBody>Story and mission content displayed on the About page.</CardBody>
        </div>

        <div className="space-y-4">
          <Input
            label="Story Heading"
            errorMessage={errors.aboutHeading?.message}
            {...register("aboutHeading")}
          />
          <Textarea
            label="Story Description"
            rows={4}
            errorMessage={errors.aboutDescription?.message}
            {...register("aboutDescription")}
          />
          <Input
            label="Mission Heading"
            errorMessage={errors.missionHeading?.message}
            {...register("missionHeading")}
          />
          <Textarea
            label="Mission Description"
            rows={4}
            errorMessage={errors.missionDescription?.message}
            {...register("missionDescription")}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" variant="primary" size="md" disabled={isPending}>
            {isPending ? "Saving…" : "Save About"}
          </Button>
        </div>
      </Card>
    </form>
  );
}
