"use client";

import { useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge, Button, Card, CardBody, CardTitle, Input } from "@/components/ui";
import { statsSettingsSchema, type StatsSettingsValues } from "@/schemas/settings";
import { updateStatsSettings } from "@/lib/actions";
import { notify } from "@/lib/notifications";

export function StatsTab({ defaults }: { defaults: StatsSettingsValues }) {
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, control, formState: { errors } } = useForm<StatsSettingsValues>({
    resolver: zodResolver(statsSettingsSchema),
    defaultValues: defaults,
  });

  const { fields, append, remove } = useFieldArray({ control, name: "stats" });

  const onSubmit = (data: StatsSettingsValues) => {
    startTransition(async () => {
      const result = await updateStatsSettings(data);
      if (result.success) {
        notify.success("Stats saved", "Changes are live on the site.");
      } else {
        notify.error("Failed to save", result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card variant="elevated" padding="lg">
        <div className="space-y-1 mb-5">
          <CardTitle className="text-lg">Stats / Numbers</CardTitle>
          <CardBody>Key figures shown on the About and Why Choose Us sections.</CardBody>
        </div>

        <div className="space-y-4">
          {fields.length === 0 && (
            <p className="text-sm text-brand-muted-600">No stats added yet. Click below to add one.</p>
          )}

          {fields.map((field, i) => (
            <div key={field.id} className="rounded-xl border border-brand-blue-900/10 bg-brand-mist-200/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="brand" size="md">Stat {i + 1}</Badge>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                >
                  Remove
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label="Value"
                  placeholder="e.g. 500+"
                  inputSize="sm"
                  errorMessage={errors.stats?.[i]?.value?.message}
                  {...register(`stats.${i}.value`)}
                />
                <Input
                  label="Label"
                  placeholder="e.g. Trips Completed"
                  inputSize="sm"
                  errorMessage={errors.stats?.[i]?.label?.message}
                  {...register(`stats.${i}.label`)}
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ value: "", label: "" })}
          >
            + Add Stat
          </Button>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" variant="primary" size="md" disabled={isPending}>
            {isPending ? "Saving…" : "Save Stats"}
          </Button>
        </div>
      </Card>
    </form>
  );
}
