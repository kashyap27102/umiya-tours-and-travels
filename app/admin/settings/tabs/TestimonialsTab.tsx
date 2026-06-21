"use client";

import { useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge, Button, Card, CardBody, CardTitle, Input, Textarea } from "@/components/ui";
import { testimonialsSettingsSchema, type TestimonialsSettingsValues } from "@/schemas/settings";
import { updateTestimonialsSettings } from "@/lib/actions";
import { notify } from "@/lib/notifications";

export function TestimonialsTab({ defaults }: { defaults: TestimonialsSettingsValues }) {
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, control, formState: { errors } } = useForm<TestimonialsSettingsValues>({
    resolver: zodResolver(testimonialsSettingsSchema),
    defaultValues: defaults,
  });

  const { fields, append, remove } = useFieldArray({ control, name: "testimonials" });

  const onSubmit = (data: TestimonialsSettingsValues) => {
    startTransition(async () => {
      const result = await updateTestimonialsSettings(data);
      if (result.success) {
        notify.success("Testimonials saved", "Changes are live on the site.");
      } else {
        notify.error("Failed to save", result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card variant="elevated" padding="lg">
        <div className="space-y-1 mb-5">
          <CardTitle className="text-lg">Testimonials</CardTitle>
          <CardBody>Customer reviews displayed on the homepage.</CardBody>
        </div>

        <div className="space-y-4">
          {fields.map((field, i) => (
            <div key={field.id} className="rounded-xl border border-brand-blue-900/10 bg-brand-mist-200/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="brand" size="md">Testimonial {i + 1}</Badge>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                >
                  Remove
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <Input
                  label="Name"
                  inputSize="sm"
                  errorMessage={errors.testimonials?.[i]?.name?.message}
                  {...register(`testimonials.${i}.name`)}
                />
                <Input
                  label="Location"
                  inputSize="sm"
                  errorMessage={errors.testimonials?.[i]?.location?.message}
                  {...register(`testimonials.${i}.location`)}
                />
                <Input
                  label="Rating (1–5)"
                  type="number"
                  min={1}
                  max={5}
                  inputSize="sm"
                  errorMessage={errors.testimonials?.[i]?.rating?.message}
                  {...register(`testimonials.${i}.rating`, { valueAsNumber: true })}
                />
              </div>
              <Textarea
                label="Review"
                rows={2}
                errorMessage={errors.testimonials?.[i]?.review?.message}
                {...register(`testimonials.${i}.review`)}
              />
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ name: "", location: "", rating: 5, review: "" })}
          >
            + Add Testimonial
          </Button>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" variant="primary" size="md" disabled={isPending}>
            {isPending ? "Saving…" : "Save Testimonials"}
          </Button>
        </div>
      </Card>
    </form>
  );
}
