"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button, Input, Label, MultiSelect } from "@/components/ui";
import { createInclusion } from "@/lib/actions/inclusion-actions";
import { notify } from "@/lib/notifications";
import type { ReactNode } from "react";

export interface InclusionOption {
  id: string;
  text: string;
}

interface InclusionPickerProps {
  label: string;
  icon: ReactNode;
  /** Every shared item. */
  items: InclusionOption[];
  /** Ids picked here, in pick order. */
  value: string[];
  /** Ids picked on the other list; hidden here so an item can't be on both. */
  otherIds: string[];
  onChange: (ids: string[]) => void;
  /** Called with a freshly created item so the parent can add it to `items`. */
  onCreated: (item: InclusionOption) => void;
  errorMessage?: string;
}

export function InclusionPicker({
  label,
  icon,
  items,
  value,
  otherIds,
  onChange,
  onCreated,
  errorMessage,
}: Readonly<InclusionPickerProps>) {
  const [newText, setNewText] = useState("");
  const [isPending, startTransition] = useTransition();

  const options = items
    .filter((item) => !otherIds.includes(item.id))
    .map((item) => ({ label: item.text, value: item.id }));

  function addNew() {
    const text = newText.trim();
    if (!text) return;

    startTransition(async () => {
      const result = await createInclusion({ text });
      if (result.success) {
        onCreated(result.data);
        onChange([...value, result.data.id]);
        setNewText("");
      } else {
        notify.error("Could not add item", result.error);
      }
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-brand-blue-600">{icon}</span>
        <Label>{label}</Label>
      </div>

      <MultiSelect
        options={options}
        value={value}
        onChange={onChange}
        placeholder={`Select ${label.toLowerCase()}`}
        searchPlaceholder="Search…"
        error={!!errorMessage}
        errorMessage={errorMessage}
      />

      <div className="flex items-start gap-2">
        <div className="flex-1">
          <Input
            inputSize="sm"
            placeholder="Not in the list? Type a new one"
            value={newText}
            maxLength={160}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => {
              // Enter adds the item instead of submitting/advancing the form.
              if (e.key === "Enter") {
                e.preventDefault();
                addNew();
              }
            }}
            aria-label={`Add a new ${label.toLowerCase()} item`}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending || newText.trim().length < 2}
          onClick={addNew}
          title="Add to the shared list and select it"
          className="mt-0.5"
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      <p className="text-xs text-brand-muted-600">
        {value.length} selected.{" "}
        <Link
          href="/admin/inclusions"
          target="_blank"
          className="font-medium text-brand-blue-700 underline"
        >
          Manage the shared list
        </Link>
      </p>
    </div>
  );
}
