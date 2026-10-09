"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
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
  createInclusion,
  deleteInclusion,
  updateInclusion,
} from "@/lib/actions/inclusion-actions";
import { notify } from "@/lib/notifications";
import type { InclusionWithUsage } from "@/services/taxonomy-service";

export default function InclusionManager({
  items,
}: Readonly<{ items: InclusionWithUsage[] }>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<InclusionWithUsage | null>(null);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState<InclusionWithUsage | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? items.filter((i) => i.text.toLowerCase().includes(q)) : items;
  }, [items, search]);

  function openCreate() {
    setEditing(null);
    setText("");
    setFormOpen(true);
  }

  function openEdit(item: InclusionWithUsage) {
    setEditing(item);
    setText(item.text);
    setFormOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = editing
        ? await updateInclusion(editing.id, { text })
        : await createInclusion({ text });

      if (result.success) {
        notify.success(result.message);
        setFormOpen(false);
        router.refresh();
      } else {
        notify.error("Could not save item", result.error);
      }
    });
  }

  function handleDelete() {
    if (!deleting) return;
    startTransition(async () => {
      const result = await deleteInclusion(deleting.id);
      if (result.success) {
        notify.success(result.message);
        router.refresh();
      } else {
        notify.error("Could not delete item", result.error);
      }
      setDeleting(null);
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            placeholder="Search items…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search items"
          />
        </div>
        <Button variant="primary" size="md" onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add Item
        </Button>
      </div>

      <p className="text-xs text-brand-muted-600">
        {filtered.length} item{filtered.length === 1 ? "" : "s"}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-brand-mist-200 bg-white py-16 text-center">
          <p className="text-sm text-brand-muted-600">
            {items.length === 0
              ? "No items yet. Add your first one."
              : "No items match your search."}
          </p>
        </div>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Wording</TableHeader>
              <TableHeader className="w-36">Used in</TableHeader>
              <TableHeader className="text-right">Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.text}</TableCell>
                <TableCell className="whitespace-nowrap text-brand-muted-600">
                  {item.packageCount} package{item.packageCount === 1 ? "" : "s"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      title="Edit item"
                      onClick={() => openEdit(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      title="Delete item"
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

      <Modal
        open={formOpen}
        onClose={() => !isPending && setFormOpen(false)}
        title={editing ? "Edit Item" : "Add Item"}
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
              form="inclusion-form"
              disabled={isPending}
            >
              {isPending ? "Saving…" : editing ? "Save changes" : "Add"}
            </Button>
          </div>
        }
      >
        <form id="inclusion-form" onSubmit={handleSubmit} className="space-y-3">
          <Input
            label="Wording"
            placeholder="e.g. Airport transfers"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={160}
            required
            autoFocus
          />
          {editing && editing.packageCount > 0 && (
            <p className="text-xs text-brand-muted-600">
              This changes the wording in {editing.packageCount} package
              {editing.packageCount === 1 ? "" : "s"}.
            </p>
          )}
        </form>
      </Modal>

      <AlertDialog
        open={deleting !== null}
        variant="danger"
        title="Delete Item"
        description={`Are you sure you want to delete "${deleting?.text}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isLoading={isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
