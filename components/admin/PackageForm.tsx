"use client";

import {
  Badge,
  Button,
  Card,
  CardTitle,
  Input,
  Textarea,
} from "@/components/ui";
import {
  PACKAGE_CATEGORIES,
  PACKAGE_STATUS_OPTIONS,
  type PackageCategory,
  type PackageStatus,
} from "@/lib/packages-constants";

/* ── Types ──────────────────────────────────────────────────── */

type ItineraryItem = {
  day: number;
  title: string;
  description: string;
};

export type PackageFormValues = {
  name: string;
  destination: string;
  category: PackageCategory | "";
  status: PackageStatus;
  durationDays: string;
  durationNights: string;
  pricePerPerson: string;
  image: string;
  summary: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryItem[];
};

export const emptyFormValues: PackageFormValues = {
  name: "",
  destination: "",
  category: "",
  status: "active",
  durationDays: "",
  durationNights: "",
  pricePerPerson: "",
  image: "",
  summary: "",
  highlights: [""],
  inclusions: [""],
  exclusions: [""],
  itinerary: [{ day: 1, title: "", description: "" }],
};

/* ── Editable list ──────────────────────────────────────────── */

function EditableList({
  label,
  items,
  onChange,
}: Readonly<{
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}>) {
  const update = (index: number, value: string) => {
    const next = [...items];
    next[index] = value;
    onChange(next);
  };

  const add = () => onChange([...items, ""]);

  const remove = (index: number) => {
    if (items.length <= 1) return;
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted-600">
          {label}
        </p>
        <Button type="button" variant="outline" size="sm" onClick={add}>
          + Add
        </Button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={`${label}-${i}`} className="flex items-center gap-2">
            <Input
              inputSize="sm"
              placeholder={`${label} item ${i + 1}`}
              value={item}
              onChange={(e) => update(i, e.target.value)}
              className="flex-1"
            />
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => remove(i)}
                className="shrink-0 text-xs font-medium text-red-500 hover:text-red-700 transition-colors cursor-pointer"
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

/* ── Package Form ───────────────────────────────────────────── */

interface PackageFormProps {
  values: PackageFormValues;
  onChange: <K extends keyof PackageFormValues>(
    key: K,
    value: PackageFormValues[K],
  ) => void;
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
  onReset: () => void;
  submitLabel: string;
}

export default function PackageForm({
  values,
  onChange,
  onSubmit,
  onReset,
  submitLabel,
}: Readonly<PackageFormProps>) {
  const updateItinerary = (
    index: number,
    field: keyof ItineraryItem,
    value: string,
  ) => {
    const updated = values.itinerary.map((item, i) =>
      i === index
        ? { ...item, [field]: field === "day" ? Number(value) : value }
        : item,
    );
    onChange("itinerary", updated);
  };

  const addItineraryDay = () => {
    onChange("itinerary", [
      ...values.itinerary,
      { day: values.itinerary.length + 1, title: "", description: "" },
    ]);
  };

  const removeItineraryDay = (index: number) => {
    if (values.itinerary.length <= 1) return;
    onChange(
      "itinerary",
      values.itinerary
        .filter((_, i) => i !== index)
        .map((item, i) => ({ ...item, day: i + 1 })),
    );
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Basic Info */}
      <Card variant="elevated" padding="lg" className="space-y-5">
        <CardTitle className="text-lg">Basic Information</CardTitle>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            label="Package Name *"
            placeholder="e.g. Goa Beach Escape"
            value={values.name}
            onChange={(e) => onChange("name", e.target.value)}
          />
          <Input
            label="Destination *"
            placeholder="e.g. Goa"
            value={values.destination}
            onChange={(e) => onChange("destination", e.target.value)}
          />
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="category-select"
              className="text-xs font-semibold uppercase tracking-wide text-brand-muted-600"
            >
              Category *
            </label>
            <select
              id="category-select"
              value={values.category}
              onChange={(e) =>
                onChange("category", e.target.value as PackageCategory)
              }
              className="min-h-11 rounded-xl border border-brand-blue-900/20 bg-white px-4 py-2.5 text-sm font-medium text-brand-ink-900 outline-none transition-all focus:border-brand-blue-500 focus:ring-2 focus:ring-brand-blue-500/20"
            >
              <option value="">Select category</option>
              {PACKAGE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            label="Duration (Days) *"
            type="number"
            min={1}
            placeholder="e.g. 5"
            value={values.durationDays}
            onChange={(e) => onChange("durationDays", e.target.value)}
          />
          <Input
            label="Duration (Nights) *"
            type="number"
            min={0}
            placeholder="e.g. 4"
            value={values.durationNights}
            onChange={(e) => onChange("durationNights", e.target.value)}
          />
          <Input
            label="Price Per Person (₹) *"
            type="number"
            min={1}
            placeholder="e.g. 12999"
            value={values.pricePerPerson}
            onChange={(e) => onChange("pricePerPerson", e.target.value)}
          />
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="status-select"
              className="text-xs font-semibold uppercase tracking-wide text-brand-muted-600"
            >
              Status
            </label>
            <select
              id="status-select"
              value={values.status}
              onChange={(e) =>
                onChange("status", e.target.value as PackageStatus)
              }
              className="min-h-11 rounded-xl border border-brand-blue-900/20 bg-white px-4 py-2.5 text-sm font-medium text-brand-ink-900 outline-none transition-all focus:border-brand-blue-500 focus:ring-2 focus:ring-brand-blue-500/20"
            >
              {PACKAGE_STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Input
          label="Image URL"
          placeholder="https://images.unsplash.com/..."
          value={values.image}
          onChange={(e) => onChange("image", e.target.value)}
        />

        <Textarea
          label="Summary *"
          placeholder="A short description of the package..."
          rows={3}
          value={values.summary}
          onChange={(e) => onChange("summary", e.target.value)}
        />
      </Card>

      {/* Highlights, Inclusions, Exclusions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card variant="elevated" padding="lg">
          <EditableList
            label="Highlights"
            items={values.highlights}
            onChange={(items) => onChange("highlights", items)}
          />
        </Card>

        <Card variant="elevated" padding="lg">
          <EditableList
            label="Inclusions"
            items={values.inclusions}
            onChange={(items) => onChange("inclusions", items)}
          />
        </Card>

        <Card variant="elevated" padding="lg">
          <EditableList
            label="Exclusions"
            items={values.exclusions}
            onChange={(items) => onChange("exclusions", items)}
          />
        </Card>
      </div>

      {/* Itinerary */}
      <Card variant="elevated" padding="lg" className="space-y-5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Day-wise Itinerary</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addItineraryDay}
          >
            + Add Day
          </Button>
        </div>

        <div className="space-y-4">
          {values.itinerary.map((item, index) => (
            <div
              key={`day-${item.day}`}
              className="grid gap-4 rounded-xl border border-brand-blue-900/10 bg-brand-mist-200/40 p-4 sm:grid-cols-[100px_1fr] lg:grid-cols-[100px_1fr_1fr]"
            >
              <div className="flex items-start gap-2 sm:flex-col sm:items-center sm:pt-6">
                <Badge variant="brand" size="md">
                  Day {item.day}
                </Badge>
                {values.itinerary.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItineraryDay(index)}
                    className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
              <Input
                label="Title"
                placeholder="e.g. Arrival in Goa"
                value={item.title}
                onChange={(e) =>
                  updateItinerary(index, "title", e.target.value)
                }
              />
              <Textarea
                label="Description"
                rows={2}
                placeholder="Day activities and details..."
                value={item.description}
                onChange={(e) =>
                  updateItinerary(index, "description", e.target.value)
                }
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" variant="primary" size="lg">
          {submitLabel}
        </Button>
        <Button type="button" variant="ghost" size="md" onClick={onReset}>
          Reset Form
        </Button>
      </div>
    </form>
  );
}
