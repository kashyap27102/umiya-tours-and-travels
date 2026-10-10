"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Check, ImageOff, Plus, X } from "lucide-react";
import { Button, Card, Input, Modal } from "@/components/ui";
import { MediaThumb } from "@/components/admin/gallery/MediaThumb";
import { saveTrending } from "@/lib/actions/trending-actions";
import { formatCurrency } from "@/lib/format";
import { notify } from "@/lib/notifications";
import {
  TRENDING_MAX_PACKAGES,
  TRENDING_SUBTITLE_MAX,
  TRENDING_TITLE_MAX,
  trendingSchema,
} from "@/schemas/trending";
import type {
  TrendingAdminState,
  TrendingChoice,
} from "@/services/trending-service";

function Thumb({ image, name }: Readonly<{ image: string | null; name: string }>) {
  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand-mist-200/60 text-brand-muted-600">
      {image ? (
        <MediaThumb src={image} alt={name} />
      ) : (
        <ImageOff className="h-5 w-5" aria-hidden />
      )}
    </div>
  );
}

export default function TrendingManager({
  initial,
}: Readonly<{ initial: TrendingAdminState }>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(initial.title);
  const [subtitle, setSubtitle] = useState(initial.subtitle);
  const [selected, setSelected] = useState<TrendingChoice[]>(initial.selected);
  const [pickerOpen, setPickerOpen] = useState(false);

  const dirty =
    title !== initial.title ||
    subtitle !== initial.subtitle ||
    selected.map((s) => s.id).join() !== initial.selected.map((s) => s.id).join();

  function move(index: number, by: -1 | 1) {
    setSelected((prev) => {
      const next = [...prev];
      const target = index + by;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function save() {
    const input = { title, subtitle, packageIds: selected.map((s) => s.id) };
    const check = trendingSchema.safeParse(input);
    if (!check.success) {
      notify.error("Please check the form", check.error.issues[0].message);
      return;
    }
    startTransition(async () => {
      const result = await saveTrending(input);
      if (result.success) {
        notify.success(result.message, "Changes are live on the home page.");
        router.refresh();
      } else {
        notify.error("Could not save", result.error);
      }
    });
  }

  return (
    <div className="space-y-6">
      <Card variant="elevated" padding="lg" className="space-y-4">
        <h2 className="text-lg font-semibold text-brand-ink-900">Heading</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <Input
              label="Section title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={TRENDING_TITLE_MAX}
              required
            />
            <p className="text-right text-xs text-brand-muted-600">
              {title.length}/{TRENDING_TITLE_MAX}
            </p>
          </div>
          <div className="space-y-1">
            <Input
              label="Subtitle (optional)"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              maxLength={TRENDING_SUBTITLE_MAX}
            />
            <p className="text-right text-xs text-brand-muted-600">
              {subtitle.length}/{TRENDING_SUBTITLE_MAX}
            </p>
          </div>
        </div>
      </Card>

      <Card variant="elevated" padding="lg" className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-brand-ink-900">
              Packages in this section
            </h2>
            <p className="text-sm text-brand-muted-600">
              {selected.length} of {TRENDING_MAX_PACKAGES} chosen. They appear
              in this order.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => setPickerOpen(true)}
            disabled={selected.length >= TRENDING_MAX_PACKAGES}
          >
            <Plus className="h-4 w-4" /> Add packages
          </Button>
        </div>

        {selected.length === 0 && (
          <p className="rounded-xl border border-dashed border-brand-blue-900/20 bg-brand-mist-200/35 px-4 py-6 text-center text-sm text-brand-muted-600">
            Nothing chosen yet, so the home page shows your 6 most popular
            packages. Add packages to choose them yourself.
          </p>
        )}

        <ol className="space-y-2">
          {selected.map((pkg, index) => (
            <li
              key={pkg.id}
              className="flex items-center gap-3 rounded-2xl border border-brand-blue-900/10 bg-white p-2.5"
            >
              <span className="w-6 text-center text-sm font-semibold text-brand-muted-600">
                {index + 1}
              </span>
              <Thumb image={pkg.image} name={pkg.name} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-brand-ink-900">
                  {pkg.name}
                </p>
                <p className="truncate text-xs text-brand-muted-600">
                  {pkg.destination} · from {formatCurrency(pkg.startingPrice)}
                  {pkg.status !== "active" && (
                    <span className="ml-2 font-medium text-amber-700">
                      Not live, hidden on the site
                    </span>
                  )}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  title="Move up"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  title="Move down"
                  disabled={index === selected.length - 1}
                  onClick={() => move(index, 1)}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  title="Remove from section"
                  onClick={() =>
                    setSelected((prev) => prev.filter((p) => p.id !== pkg.id))
                  }
                  className="border-red-300 text-red-700 hover:border-red-500 hover:bg-red-100 hover:text-red-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <div className="flex items-center justify-end gap-3">
        {dirty && (
          <p className="text-sm text-brand-muted-600">You have unsaved changes.</p>
        )}
        <Button
          type="button"
          variant="primary"
          size="md"
          disabled={!dirty || isPending}
          onClick={save}
        >
          {isPending ? "Saving…" : "Save section"}
        </Button>
      </div>

      {pickerOpen && (
        <PackagePicker
          available={initial.available}
          selected={selected}
          onClose={() => setPickerOpen(false)}
          onDone={(added) => setSelected((prev) => [...prev, ...added])}
        />
      )}
    </div>
  );
}

/** Pick live packages to add; mounted only while open so it starts fresh. */
function PackagePicker({
  available,
  selected,
  onClose,
  onDone,
}: Readonly<{
  available: TrendingChoice[];
  selected: TrendingChoice[];
  onClose: () => void;
  onDone: (added: TrendingChoice[]) => void;
}>) {
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const room = TRENDING_MAX_PACKAGES - selected.length;

  const chosenIds = useMemo(() => new Set(selected.map((s) => s.id)), [selected]);
  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return available.filter(
      (p) =>
        !chosenIds.has(p.id) &&
        (!q || `${p.name} ${p.destination}`.toLowerCase().includes(q)),
    );
  }, [available, chosenIds, query]);

  function toggle(id: string) {
    setPicked((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : prev.length < room
          ? [...prev, id]
          : prev,
    );
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Add packages"
      size="lg"
      footer={
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-brand-muted-600">
            {picked.length} selected (room for {room})
          </p>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              disabled={picked.length === 0}
              onClick={() => {
                // Keep the order they were ticked in.
                onDone(
                  picked
                    .map((id) => available.find((p) => p.id === id))
                    .filter((p): p is TrendingChoice => Boolean(p)),
                );
                onClose();
              }}
            >
              Add {picked.length || ""}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-3">
        <Input
          placeholder="Search by name or destination…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search packages"
          autoFocus
        />
        {list.length === 0 ? (
          <p className="py-10 text-center text-sm text-brand-muted-600">
            {query
              ? "No live package matches your search."
              : "Every live package is already in the section."}
          </p>
        ) : (
          <ul className="max-h-[50vh] space-y-2 overflow-y-auto pr-1">
            {list.map((pkg) => {
              const isPicked = picked.includes(pkg.id);
              const blocked = !isPicked && picked.length >= room;
              return (
                <li key={pkg.id}>
                  <button
                    type="button"
                    disabled={blocked}
                    onClick={() => toggle(pkg.id)}
                    className={
                      "flex w-full cursor-pointer items-center gap-3 rounded-2xl border p-2.5 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 " +
                      (isPicked
                        ? "border-brand-blue-700 bg-brand-blue-700/5"
                        : "border-brand-blue-900/10 hover:border-brand-blue-500/50")
                    }
                  >
                    <Thumb image={pkg.image} name={pkg.name} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-brand-ink-900">
                        {pkg.name}
                      </span>
                      <span className="block truncate text-xs text-brand-muted-600">
                        {pkg.destination} · from {formatCurrency(pkg.startingPrice)}
                      </span>
                    </span>
                    {isPicked && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-blue-700 text-white">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Modal>
  );
}
