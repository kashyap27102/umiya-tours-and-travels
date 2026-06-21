"use client";

import { X, Plus } from "lucide-react";
import { Button, Input, Label } from "@/components/ui";
import type { ReactNode } from "react";
import type { UsePackageFormReturn } from "@/hooks/usePackageForm";

interface EditableListProps {
  label: string;
  fieldName: "highlights" | "inclusions" | "exclusions";
  hook: UsePackageFormReturn;
  icon?: ReactNode;
}

export function EditableList({
  label,
  fieldName,
  hook,
  icon,
}: Readonly<EditableListProps>) {
  const { step3Form, addItem, removeItem, updateItem } = hook;
  const items = step3Form.watch(fieldName);
  const errors = step3Form.formState.errors[fieldName];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="text-brand-blue-600">{icon}</span>}
          <Label>{label}</Label>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addItem(fieldName)}
          title="Add item"
        >
          <Plus className="h-4 w-4" />
          <span>Add</span>
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
                className="mt-2 shrink-0 cursor-pointer text-red-500 transition-colors hover:text-red-700"
                title="Remove item"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
