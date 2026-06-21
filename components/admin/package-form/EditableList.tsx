"use client";

import { Button, Input, Label } from "@/components/ui";
import type { UsePackageFormReturn } from "@/hooks/usePackageForm";

interface EditableListProps {
  label: string;
  fieldName: "highlights" | "inclusions" | "exclusions";
  hook: UsePackageFormReturn;
}

export function EditableList({ label, fieldName, hook }: EditableListProps) {
  const { form, addItem, removeItem, updateItem } = hook;
  const items = form.watch(fieldName);
  const errors = form.formState.errors[fieldName];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addItem(fieldName)}
        >
          + Add
        </Button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={`${fieldName}-${i}`} className="flex items-start gap-2">
            <div className="flex-1">
              <Input
                inputSize="sm"
                placeholder={`${label} item ${i + 1}`}
                value={item}
                onChange={(e) => updateItem(fieldName, i, e.target.value)}
                variant={
                  Array.isArray(errors) && errors[i] ? "error" : "default"
                }
                errorMessage={
                  Array.isArray(errors) && errors[i]
                    ? String(errors[i]?.message ?? "")
                    : undefined
                }
              />
            </div>
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(fieldName, i)}
                className="mt-2 shrink-0 cursor-pointer text-xs font-medium text-red-500 transition-colors hover:text-red-700"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
