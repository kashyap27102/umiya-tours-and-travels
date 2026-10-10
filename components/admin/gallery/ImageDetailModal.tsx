"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, ExternalLink, Trash2 } from "lucide-react";
import { Badge, Button, Input, Modal, Textarea } from "@/components/ui";
import { AlertDialog } from "@/components/ui/AlertDialog";
import { MAX_TAGS } from "@/lib/media";
import { deleteMedia, updateMedia } from "@/lib/actions/media-actions";
import { notify } from "@/lib/notifications";
import { MediaThumb } from "./MediaThumb";
import type { MediaItem, MediaUsage } from "@/services/media-service";

interface ImageDetailModalProps {
  /** The image to show; null closes the dialog. */
  image: MediaItem | null;
  onClose: () => void;
}

const SOURCE_LABEL = {
  uploaded: "Uploaded",
  link_copy: "Copied from a link",
  legacy_link: "External link",
} as const;

export function ImageDetailModal({
  image,
  onClose,
}: Readonly<ImageDetailModalProps>) {
  // Keyed by id so each image gets a fresh form instead of resetting fields
  // inside an effect.
  return image ? (
    <DetailContent key={image.id} image={image} onClose={onClose} />
  ) : null;
}

function DetailContent({
  image,
  onClose,
}: Readonly<{ image: MediaItem; onClose: () => void }>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(image.title);
  const [alt, setAlt] = useState(image.alt);
  const [tags, setTags] = useState(image.tags.join(", "));
  const [usage, setUsage] = useState<MediaUsage | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Where the image is used.
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/media/${image.id}`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { usage: MediaUsage } | null) => data && setUsage(data.usage))
      .catch(() => undefined);
    return () => controller.abort();
  }, [image.id]);

  const inUse =
    usage !== null &&
    (usage.packages.length > 0 ||
      usage.itineraryDays.length > 0 ||
      usage.testimonials.length > 0);

  function handleSave() {
    startTransition(async () => {
      const result = await updateMedia(image.id, {
        title,
        alt,
        tags: tags.split(","),
      });
      if (result.success) {
        notify.success(result.message);
        router.refresh();
        onClose();
      } else {
        notify.error("Could not save", result.error);
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteMedia(image.id);
      setConfirmDelete(false);
      if (result.success) {
        notify.success(result.message);
        router.refresh();
        onClose();
      } else {
        notify.error("Could not delete", result.error);
      }
    });
  }

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(image.url);
      notify.success("Image link copied");
    } catch {
      notify.error("Could not copy the link");
    }
  }

  return (
    <>
      <Modal
        open
        onClose={() => !isPending && onClose()}
        title="Image details"
        size="lg"
        footer={
          <div className="flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              disabled={isPending}
              onClick={() => setConfirmDelete(true)}
              className="border-red-300 text-red-700 hover:border-red-500 hover:bg-red-100 hover:text-red-800"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="md"
                disabled={isPending}
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                type="button"
                variant="primary"
                size="md"
                disabled={isPending}
                onClick={handleSave}
              >
                {isPending ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </div>
        }
      >
        <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
          <div className="space-y-3">
            <div className="aspect-4/3 overflow-hidden rounded-xl border border-brand-blue-900/10 bg-brand-mist-200/40">
              <MediaThumb
                src={image.url}
                alt={image.alt || image.title}
                className="object-contain"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" size="sm">
                {SOURCE_LABEL[image.source]}
              </Badge>
              <Button type="button" variant="ghost" size="sm" onClick={copyUrl}>
                <Copy className="h-3.5 w-3.5" /> Copy link
              </Button>
              <a
                href={image.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-brand-blue-700 underline"
              >
                Open <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Title"
              value={title}
              maxLength={120}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              label="Alt text"
              rows={2}
              maxLength={200}
              placeholder="Describe the photo for screen readers and search engines"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
            />
            <div className="space-y-1.5">
              <Input
                label="Tags"
                placeholder="beach, goa, sunset"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <p className="text-xs text-brand-muted-600">
                Separate with commas. Up to {MAX_TAGS} tags.
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted-600">
                Used in
              </p>
              {usage === null ? (
                <p className="text-sm text-brand-muted-600">Loading…</p>
              ) : !inUse ? (
                <p className="text-sm text-brand-muted-600">
                  Not used anywhere yet.
                </p>
              ) : (
                <ul className="space-y-1 text-sm">
                  {usage.packages.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/admin/package-management/${p.slug}/edit`}
                        className="font-medium text-brand-blue-700 underline"
                      >
                        {p.name}
                      </Link>{" "}
                      <span className="text-xs text-brand-muted-600">
                        (package image, {p.status})
                      </span>
                    </li>
                  ))}
                  {usage.itineraryDays.map((d) => (
                    <li key={`${d.packageSlug}-${d.day}`}>
                      <Link
                        href={`/admin/package-management/${d.packageSlug}/edit`}
                        className="font-medium text-brand-blue-700 underline"
                      >
                        {d.packageName}
                      </Link>{" "}
                      <span className="text-xs text-brand-muted-600">
                        (itinerary day {d.day})
                      </span>
                    </li>
                  ))}
                  {usage.testimonials.map((t) => (
                    <li key={t.id}>
                      <Link
                        href="/admin/testimonials"
                        className="font-medium text-brand-blue-700 underline"
                      >
                        {t.name}
                      </Link>{" "}
                      <span className="text-xs text-brand-muted-600">
                        (testimonial photo)
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </Modal>

      <AlertDialog
        open={confirmDelete}
        variant="danger"
        title="Delete image"
        description={
          inUse
            ? `"${image.title}" is still used by a package or itinerary day, so it can't be deleted. Remove it from them first.`
            : `Delete "${image.title}"? The file will be removed from storage. This cannot be undone.`
        }
        confirmLabel={inUse ? "Try anyway" : "Delete"}
        cancelLabel="Cancel"
        isLoading={isPending}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  );
}
