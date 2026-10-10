"use client";

import { useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { Button, Input, Label } from "@/components/ui";

interface PointsEditorProps {
  label?: string;
  value: string[];
  onChange: (value: string[]) => void;
  /** Error message per point, by position. */
  itemErrors?: (string | undefined)[];
  /** Error for the list as a whole (e.g. "Add at least one point"). */
  listError?: string;
  placeholder?: string;
}

/**
 * Ordered bullet list editor. Enter adds the next point, Backspace on an empty
 * point removes it, and the arrows reorder.
 */
export function PointsEditor({
  label = "Points",
  value,
  onChange,
  itemErrors = [],
  listError,
  placeholder = "e.g. Visit the old fort",
}: Readonly<PointsEditorProps>) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const focusAfterRender = useRef<number | null>(null);

  // Move focus once React has rendered the row we just added or removed.
  useEffect(() => {
    if (focusAfterRender.current !== null) {
      inputs.current[focusAfterRender.current]?.focus();
      focusAfterRender.current = null;
    }
  });

  const update = (index: number, text: string) =>
    onChange(value.map((p, i) => (i === index ? text : p)));

  const insertAfter = (index: number) => {
    const next = [...value];
    next.splice(index + 1, 0, "");
    focusAfterRender.current = index + 1;
    onChange(next);
  };

  const remove = (index: number) => {
    if (value.length <= 1) {
      onChange([""]);
      focusAfterRender.current = 0;
      return;
    }
    focusAfterRender.current = Math.max(0, index - 1);
    onChange(value.filter((_, i) => i !== index));
  };

  const move = (index: number, by: -1 | 1) => {
    const target = index + by;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    focusAfterRender.current = target;
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertAfter(value.length - 1)}
          title="Add a point"
        >
          <Plus className="h-4 w-4" />
          <span>Add point</span>
        </Button>
      </div>

      <ul className="space-y-2">
        {value.map((point, index) => (
          <li key={index} className="flex items-start gap-2">
            <span
              aria-hidden
              className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-blue-700"
            />
            <div className="flex-1">
              <Input
                ref={(el) => {
                  inputs.current[index] = el;
                }}
                inputSize="sm"
                placeholder={placeholder}
                value={point}
                onChange={(e) => update(index, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    insertAfter(index);
                  } else if (
                    e.key === "Backspace" &&
                    point === "" &&
                    value.length > 1
                  ) {
                    e.preventDefault();
                    remove(index);
                  }
                }}
                aria-label={`Point ${index + 1}`}
                errorMessage={itemErrors[index]}
              />
            </div>
            <div className="mt-1 flex shrink-0 items-center">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                title="Move up"
                className="cursor-pointer rounded p-1 text-brand-muted-600 hover:bg-brand-mist-200 disabled:cursor-default disabled:opacity-30"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === value.length - 1}
                title="Move down"
                className="cursor-pointer rounded p-1 text-brand-muted-600 hover:bg-brand-mist-200 disabled:cursor-default disabled:opacity-30"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => remove(index)}
                title="Remove point"
                className="cursor-pointer rounded p-1 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {listError && (
        <p role="alert" className="text-xs text-red-500">
          {listError}
        </p>
      )}
      <p className="text-xs text-brand-muted-600">
        Press Enter for the next point.
      </p>
    </div>
  );
}
