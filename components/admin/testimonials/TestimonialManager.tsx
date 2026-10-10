"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  MapPin,
  Package as PackageIcon,
  Pencil,
  Plus,
  Star,
  Trash2,
  User,
} from "lucide-react";
import {
  Button,
  Input,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { AlertDialog } from "@/components/ui/AlertDialog";
import { MediaThumb } from "@/components/admin/gallery/MediaThumb";
import {
  deleteTestimonial,
  moveTestimonial,
  setTestimonialActive,
} from "@/lib/actions/testimonial-actions";
import { notify } from "@/lib/notifications";
import type {
  AdminTestimonial,
  TestimonialFormOptions,
} from "@/services/testimonial-service";
import { TestimonialFormModal } from "./TestimonialFormModal";

type Visibility = "all" | "visible" | "hidden";

const VISIBILITY_OPTIONS = [
  { label: "All reviews", value: "all" },
  { label: "Visible on site", value: "visible" },
  { label: "Hidden", value: "hidden" },
];

interface TestimonialManagerProps {
  items: AdminTestimonial[];
  options: TestimonialFormOptions;
}

export default function TestimonialManager({
  items,
  options,
}: Readonly<TestimonialManagerProps>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminTestimonial | null>(null);
  const [deleting, setDeleting] = useState<AdminTestimonial | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (visibility === "visible" && !item.isActive) return false;
      if (visibility === "hidden" && item.isActive) return false;
      if (!q) return true;
      return [
        item.name,
        item.location,
        item.review,
        item.destination?.name,
        item.package?.name,
      ].some((field) => field?.toLowerCase().includes(q));
    });
  }, [items, search, visibility]);

  // Moving only makes sense against the full list, not a filtered view.
  const canReorder = !search.trim() && visibility === "all";
  const visibleCount = items.filter((i) => i.isActive).length;

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(item: AdminTestimonial) {
    setEditing(item);
    setFormOpen(true);
  }

  function handleToggle(item: AdminTestimonial, checked: boolean) {
    startTransition(async () => {
      const result = await setTestimonialActive(item.id, checked);
      if (result.success) {
        notify.success(result.message);
      } else {
        notify.error("Could not change visibility", result.error);
      }
      router.refresh();
    });
  }

  function handleMove(item: AdminTestimonial, direction: "up" | "down") {
    startTransition(async () => {
      const result = await moveTestimonial(item.id, direction);
      if (!result.success) notify.error("Could not move", result.error);
      router.refresh();
    });
  }

  function handleDelete() {
    if (!deleting) return;
    startTransition(async () => {
      const result = await deleteTestimonial(deleting.id);
      if (result.success) {
        notify.success(result.message);
      } else {
        notify.error("Could not delete testimonial", result.error);
      }
      setDeleting(null);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            placeholder="Search by name, city, review, destination or package…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search testimonials"
          />
        </div>
        <Select
          className="sm:w-48"
          options={VISIBILITY_OPTIONS}
          value={visibility}
          onChange={(value) => setVisibility(value as Visibility)}
        />
        <Button variant="primary" size="md" onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add Testimonial
        </Button>
      </div>

      <p className="text-xs text-brand-muted-600">
        {filtered.length} of {items.length} testimonial
        {items.length === 1 ? "" : "s"} · {visibleCount} visible on the site
        {!canReorder && items.length > 1 && " · clear the filters to reorder"}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-brand-mist-200 bg-white py-16 text-center">
          <p className="text-sm text-brand-muted-600">
            {items.length === 0
              ? "No testimonials yet. Add your first one."
              : "No testimonials match your filters."}
          </p>
        </div>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Customer</TableHeader>
              <TableHeader>Review</TableHeader>
              <TableHeader className="whitespace-nowrap">Trip</TableHeader>
              <TableHeader className="w-28">Visible</TableHeader>
              <TableHeader className="text-right">Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((item, index) => (
              <TableRow key={item.id} className={item.isActive ? "" : "opacity-60"}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-mist-200/60 text-brand-muted-600">
                      {item.image ? (
                        <MediaThumb
                          src={item.image.url}
                          alt={item.image.alt || `${item.name}'s photo`}
                        />
                      ) : (
                        <User className="h-5 w-5" aria-hidden />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-brand-ink-900">
                        {item.name}
                      </p>
                      <p className="truncate text-xs text-brand-muted-600">
                        {item.location}
                      </p>
                      <p
                        className="mt-0.5 flex items-center gap-0.5 text-brand-lime-400"
                        aria-label={`${item.rating} out of 5 stars`}
                      >
                        {Array.from({ length: item.rating }, (_, i) => (
                          <Star key={i} className="h-3 w-3 fill-current" />
                        ))}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="max-w-xs">
                  <p className="line-clamp-2 text-sm text-brand-ink-700">
                    {item.review}
                  </p>
                </TableCell>
                <TableCell className="text-sm">
                  <div className="space-y-1">
                    {item.destination ? (
                      <p className="flex items-center gap-1.5 whitespace-nowrap">
                        <MapPin className="h-3.5 w-3.5 text-brand-muted-600" />
                        {item.destination.name}
                      </p>
                    ) : null}
                    {item.package ? (
                      <p className="flex items-center gap-1.5 whitespace-nowrap">
                        <PackageIcon className="h-3.5 w-3.5 text-brand-muted-600" />
                        <span className="max-w-40 truncate">
                          {item.package.name}
                        </span>
                      </p>
                    ) : null}
                    {!item.destination && !item.package && (
                      <span className="text-brand-muted-600">—</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={item.isActive}
                    disabled={isPending}
                    onCheckedChange={(checked) => handleToggle(item, checked)}
                    aria-label={`${item.isActive ? "Hide" : "Show"} ${item.name}'s testimonial`}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {canReorder && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          title="Move up"
                          disabled={isPending || index === 0}
                          onClick={() => handleMove(item, "up")}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          title="Move down"
                          disabled={isPending || index === filtered.length - 1}
                          onClick={() => handleMove(item, "down")}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      title="Edit testimonial"
                      onClick={() => openEdit(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      title="Delete testimonial"
                      onClick={() => setDeleting(item)}
                      className="border-red-300 text-red-700 hover:border-red-500 hover:bg-red-100 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {formOpen && (
        <TestimonialFormModal
          editing={editing}
          options={options}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            router.refresh();
          }}
        />
      )}

      <AlertDialog
        open={deleting !== null}
        variant="danger"
        title="Delete testimonial"
        description={`Delete ${deleting?.name}'s testimonial? The photo stays in the gallery. This cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isLoading={isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
