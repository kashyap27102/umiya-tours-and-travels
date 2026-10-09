"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import {
  Badge,
  Button,
  Input,
  Modal,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import type { SelectOption } from "@/components/ui";
import { AlertDialog } from "@/components/ui/AlertDialog";
import {
  createHotel,
  deleteHotel,
  updateHotel,
} from "@/lib/actions/taxonomy-actions";
import { notify } from "@/lib/notifications";
import type { Hotel } from "@/app/generated/prisma/client";
import type { DestinationWithHotels } from "@/services/taxonomy-service";

interface FormState {
  name: string;
  starRating: string; // "" = not rated
  address: string;
  isActive: boolean;
}

const EMPTY_FORM: FormState = {
  name: "",
  starRating: "",
  address: "",
  isActive: true,
};

const STAR_OPTIONS: SelectOption[] = [
  { label: "Not rated", value: "" },
  ...[1, 2, 3, 4, 5].map((n) => ({
    label: `${n} star${n === 1 ? "" : "s"}`,
    value: String(n),
  })),
];

interface HotelManagerModalProps {
  destination: DestinationWithHotels | null;
  onClose: () => void;
}

export default function HotelManagerModal({
  destination,
  onClose,
}: Readonly<HotelManagerModalProps>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Hotel | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [deleting, setDeleting] = useState<Hotel | null>(null);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  }

  function openEdit(hotel: Hotel) {
    setEditing(hotel);
    setForm({
      name: hotel.name,
      starRating: hotel.starRating ? String(hotel.starRating) : "",
      address: hotel.address ?? "",
      isActive: hotel.isActive,
    });
    setFormOpen(true);
  }

  function handleClose() {
    setFormOpen(false);
    setEditing(null);
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!destination) return;

    const input = {
      destinationId: destination.id,
      name: form.name,
      starRating: form.starRating ? Number(form.starRating) : null,
      address: form.address,
      isActive: form.isActive,
    };

    startTransition(async () => {
      const result = editing
        ? await updateHotel(editing.id, input)
        : await createHotel(input);

      if (result.success) {
        notify.success(result.message);
        setFormOpen(false);
        setEditing(null);
        router.refresh();
      } else {
        notify.error("Could not save hotel", result.error);
      }
    });
  }

  function handleDelete() {
    if (!deleting) return;
    startTransition(async () => {
      const result = await deleteHotel(deleting.id);
      if (result.success) {
        notify.success(result.message);
        router.refresh();
      } else {
        notify.error("Could not delete hotel", result.error);
      }
      setDeleting(null);
    });
  }

  const hotels = destination?.hotels ?? [];

  return (
    <>
      <Modal
        open={destination !== null}
        onClose={handleClose}
        title={destination ? `Hotels in ${destination.name}` : "Hotels"}
        size="lg"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-brand-muted-600">
              {hotels.length} hotel{hotels.length === 1 ? "" : "s"}
            </p>
            {!formOpen && (
              <Button variant="primary" size="sm" onClick={openCreate}>
                <Plus className="h-4 w-4" /> Add Hotel
              </Button>
            )}
          </div>

          {formOpen && (
            <form
              onSubmit={handleSubmit}
              className="space-y-4 rounded-xl border border-brand-mist-200 bg-brand-mist-200/30 p-4"
            >
              <p className="text-sm font-semibold text-brand-ink-900">
                {editing ? "Edit hotel" : "New hotel"}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  maxLength={120}
                  required
                  autoFocus
                />
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-brand-muted-600">
                    Star rating
                  </span>
                  <Select
                    options={STAR_OPTIONS}
                    value={form.starRating}
                    onChange={(value) =>
                      setForm({ ...form, starRating: value })
                    }
                  />
                </div>
              </div>
              <Input
                label="Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                maxLength={200}
              />
              <label className="flex items-center gap-2 text-sm text-brand-ink-900">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                  className="h-4 w-4 accent-brand-blue-700"
                />
                Active (shown when building packages)
              </label>
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="md"
                  type="button"
                  disabled={isPending}
                  onClick={() => setFormOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  disabled={isPending}
                >
                  {isPending ? "Saving…" : editing ? "Save changes" : "Add"}
                </Button>
              </div>
            </form>
          )}

          {hotels.length === 0 ? (
            <div className="rounded-2xl border border-brand-mist-200 bg-white py-10 text-center">
              <p className="text-sm text-brand-muted-600">
                No hotels in this destination yet.
              </p>
            </div>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Rating</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader className="text-right">Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {hotels.map((h) => (
                  <TableRow key={h.id}>
                    <TableCell>
                      <span className="block font-medium">{h.name}</span>
                      {h.address && (
                        <span className="block max-w-64 truncate text-xs text-brand-muted-600">
                          {h.address}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-brand-muted-600">
                      {h.starRating ? (
                        <span className="inline-flex items-center gap-1">
                          {h.starRating}
                          <Star className="h-3.5 w-3.5 fill-current" />
                        </span>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={h.isActive ? "success" : "outline"}
                        size="sm"
                      >
                        {h.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          title="Edit hotel"
                          onClick={() => openEdit(h)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          title="Delete hotel"
                          onClick={() => setDeleting(h)}
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
        </div>
      </Modal>

      <AlertDialog
        open={deleting !== null}
        variant="danger"
        title="Delete Hotel"
        description={`Are you sure you want to delete "${deleting?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isLoading={isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}
