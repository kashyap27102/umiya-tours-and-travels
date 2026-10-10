"use client";

import { useState, useTransition } from "react";
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
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/lib/actions/taxonomy-actions";
import { notify } from "@/lib/notifications";
import type { Category } from "@/app/generated/prisma/client";

interface FormState {
  name: string;
  sortOrder: string;
}

const EMPTY_FORM: FormState = { name: "", sortOrder: "0" };

export default function CategoryManager({
  categories,
}: Readonly<{ categories: Category[] }>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [deleting, setDeleting] = useState<Category | null>(null);

  function openCreate() {
    const next = Math.max(-1, ...categories.map((c) => c.sortOrder)) + 1;
    setEditing(null);
    setForm({ name: "", sortOrder: String(next) });
    setFormOpen(true);
  }

  function openEdit(category: Category) {
    setEditing(category);
    setForm({ name: category.name, sortOrder: String(category.sortOrder) });
    setFormOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const input = { name: form.name, sortOrder: Number(form.sortOrder) };

    startTransition(async () => {
      const result = editing
        ? await updateCategory(editing.id, input)
        : await createCategory(input);

      if (result.success) {
        notify.success(result.message);
        setFormOpen(false);
        router.refresh();
      } else {
        notify.error("Could not save category", result.error);
      }
    });
  }

  function handleDelete() {
    if (!deleting) return;
    startTransition(async () => {
      const result = await deleteCategory(deleting.id);
      if (result.success) {
        notify.success(result.message);
        router.refresh();
      } else {
        notify.error("Could not delete category", result.error);
      }
      setDeleting(null);
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-brand-muted-600">
          {categories.length} categor{categories.length === 1 ? "y" : "ies"}
        </p>
        <Button variant="primary" size="md" onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-2xl border border-brand-mist-200 bg-white py-16 text-center">
          <p className="text-sm text-brand-muted-600">
            No categories yet. Add your first one.
          </p>
        </div>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader className="w-24">Order</TableHeader>
              <TableHeader>Name</TableHeader>
              <TableHeader>Slug</TableHeader>
              <TableHeader className="text-right">Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((c) => (
              <TableRow key={c.id} className="hover:bg-brand-mist-200/30">
                <TableCell className="text-brand-muted-600">
                  {c.sortOrder}
                </TableCell>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="text-brand-muted-600">{c.slug}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      title="Edit category"
                      onClick={() => openEdit(c)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      title="Delete category"
                      onClick={() => setDeleting(c)}
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
        title={editing ? "Edit Category" : "Add Category"}
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
              form="category-form"
              disabled={isPending}
            >
              {isPending ? "Saving…" : editing ? "Save changes" : "Create"}
            </Button>
          </div>
        }
      >
        <form id="category-form" onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            maxLength={40}
            required
            autoFocus
          />
          <Input
            label="Display order"
            type="number"
            min={0}
            max={999}
            value={form.sortOrder}
            onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
            required
          />
        </form>
      </Modal>

      <AlertDialog
        open={deleting !== null}
        variant="danger"
        title="Delete Category"
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
