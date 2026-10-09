"use client";

import { Fragment, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Hotel, Pencil, Plus, Trash2 } from "lucide-react";
import {
  Button,
  Input,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { AlertDialog } from "@/components/ui/AlertDialog";
import {
  createDestination,
  deleteDestination,
  updateDestination,
} from "@/lib/actions/taxonomy-actions";
import { notify } from "@/lib/notifications";
import type { DestinationWithHotels as Destination } from "@/services/taxonomy-service";
import HotelManagerModal from "./HotelManagerModal";

interface FormState {
  name: string;
  state: string;
  country: string;
}

const DEFAULT_COUNTRY = "India";

const EMPTY_FORM: FormState = {
  name: "",
  state: "",
  country: DEFAULT_COUNTRY,
};

/** Groups by country: India first, then the rest alphabetically. */
function groupByCountry(destinations: Destination[]) {
  const groups = new Map<string, Destination[]>();
  for (const d of destinations) {
    groups.set(d.country, [...(groups.get(d.country) ?? []), d]);
  }
  return [...groups.entries()].sort(([a], [b]) => {
    if (a === DEFAULT_COUNTRY) return -1;
    if (b === DEFAULT_COUNTRY) return 1;
    return a.localeCompare(b);
  });
}

export default function DestinationManager({
  destinations,
}: Readonly<{ destinations: Destination[] }>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Destination | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [deleting, setDeleting] = useState<Destination | null>(null);
  // Stored by id so the modal shows fresh hotels after router.refresh().
  const [hotelsForId, setHotelsForId] = useState<string | null>(null);
  const hotelsFor = destinations.find((d) => d.id === hotelsForId) ?? null;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return destinations;
    return destinations.filter((d) =>
      [d.name, d.state, d.country].some((v) => v?.toLowerCase().includes(q)),
    );
  }, [destinations, search]);

  const groups = useMemo(() => groupByCountry(filtered), [filtered]);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  }

  function openEdit(destination: Destination) {
    setEditing(destination);
    setForm({
      name: destination.name,
      state: destination.state ?? "",
      country: destination.country,
    });
    setFormOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = editing
        ? await updateDestination(editing.id, form)
        : await createDestination(form);

      if (result.success) {
        notify.success(result.message);
        setFormOpen(false);
        router.refresh();
      } else {
        notify.error("Could not save destination", result.error);
      }
    });
  }

  function handleDelete() {
    if (!deleting) return;
    startTransition(async () => {
      const result = await deleteDestination(deleting.id);
      if (result.success) {
        notify.success(result.message);
        router.refresh();
      } else {
        notify.error("Could not delete destination", result.error);
      }
      setDeleting(null);
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            placeholder="Search by name, state or country…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="primary" size="md" onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add Destination
        </Button>
      </div>

      <p className="text-xs text-brand-muted-600">
        {filtered.length} destination{filtered.length === 1 ? "" : "s"} in{" "}
        {groups.length} countr{groups.length === 1 ? "y" : "ies"}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-brand-mist-200 bg-white py-16 text-center">
          <p className="text-sm text-brand-muted-600">
            {destinations.length === 0
              ? "No destinations yet. Add your first one."
              : "No destinations match your search."}
          </p>
        </div>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Country</TableHeader>
              <TableHeader>Name</TableHeader>
              <TableHeader>State</TableHeader>
              <TableHeader>Hotels</TableHeader>
              <TableHeader className="text-right">Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {groups.map(([country, items]) => (
              <Fragment key={country}>
                {items.map((d, index) => (
                  <TableRow key={d.id}>
                    {index === 0 && (
                      <TableCell
                        rowSpan={items.length}
                        className="border-r border-brand-mist-200 align-top font-medium"
                      >
                        {country}
                        <span className="ml-2 text-xs font-normal text-brand-muted-600">
                          ({items.length})
                        </span>
                      </TableCell>
                    )}
                    <TableCell className="font-medium">{d.name}</TableCell>
                    <TableCell className="text-brand-muted-600">
                      {d.state ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Manage hotels"
                        onClick={() => setHotelsForId(d.id)}
                      >
                        <Hotel className="h-4 w-4" />
                        {d.hotels.length}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          title="Edit destination"
                          onClick={() => openEdit(d)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          title="Delete destination"
                          onClick={() => setDeleting(d)}
                          className="border-red-300 text-red-700 hover:border-red-500 hover:bg-red-100 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal
        open={formOpen}
        onClose={() => !isPending && setFormOpen(false)}
        title={editing ? "Edit Destination" : "Add Destination"}
        size="sm"
        footer={
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
              form="destination-form"
              disabled={isPending}
            >
              {isPending ? "Saving…" : editing ? "Save changes" : "Create"}
            </Button>
          </div>
        }
      >
        <form
          id="destination-form"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            maxLength={80}
            required
            autoFocus
          />
          <Input
            label="Country"
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            maxLength={80}
            required
          />
          <Input
            label="State"
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
            maxLength={80}
          />
        </form>
      </Modal>

      <HotelManagerModal
        destination={hotelsFor}
        onClose={() => setHotelsForId(null)}
      />

      <AlertDialog
        open={deleting !== null}
        variant="danger"
        title="Delete Destination"
        description={`Are you sure you want to delete "${deleting?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isLoading={isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
