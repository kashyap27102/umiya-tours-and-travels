"use client";

import { useEffect, useRef, useState } from "react";
import { Link2 } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { importImageFromLink } from "@/lib/actions/media-actions";
import { notify } from "@/lib/notifications";
import type { MediaItem } from "@/services/media-service";

interface LinkPanelProps {
  onAdded: (items: MediaItem[]) => void;
}

/**
 * Add an image by link: paste the link, preview it, then save. Saving copies
 * the image into our own storage so it keeps working on the live site.
 */
export function LinkPanel({ onAdded }: Readonly<LinkPanelProps>) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [previewedUrl, setPreviewedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const objectUrl = useRef<string | null>(null);

  // Free the preview's memory when it is replaced or the panel closes.
  function releasePreview() {
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = null;
  }
  useEffect(() => releasePreview, []);

  function onUrlChange(value: string) {
    setUrl(value);
    // A different link needs a fresh preview before it can be saved.
    if (previewedUrl !== null && value.trim() !== previewedUrl) {
      releasePreview();
      setPreviewSrc(null);
      setPreviewedUrl(null);
    }
    setError(null);
  }

  async function preview() {
    const link = url.trim();
    if (!link || loading) return;
    setLoading(true);
    setError(null);
    releasePreview();
    setPreviewSrc(null);
    setPreviewedUrl(null);

    try {
      const response = await fetch(
        `/api/media/preview?url=${encodeURIComponent(link)}`,
      );
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(data?.error ?? "Could not load that link.");
        return;
      }
      const blob = await response.blob();
      objectUrl.current = URL.createObjectURL(blob);
      setPreviewSrc(objectUrl.current);
      setPreviewedUrl(link);
    } catch {
      setError("Could not load that link. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (!previewedUrl || saving) return;
    setSaving(true);
    const result = await importImageFromLink({
      url: previewedUrl,
      title: title.trim() || undefined,
    });
    setSaving(false);

    if (result.success) {
      notify.success(result.message);
      releasePreview();
      setUrl("");
      setTitle("");
      setPreviewSrc(null);
      setPreviewedUrl(null);
      onAdded([result.data]);
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <Input
            label="Image link"
            placeholder="https://example.com/photo.jpg"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void preview();
              }
            }}
            leftIcon={<Link2 className="h-4 w-4" />}
            errorMessage={error ?? undefined}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="md"
          className="mt-6"
          disabled={loading || !url.trim()}
          onClick={preview}
        >
          {loading ? "Loading…" : "Preview"}
        </Button>
      </div>

      {previewSrc ? (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border border-brand-blue-900/10 bg-brand-mist-200/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewSrc}
              alt="Preview of the linked image"
              className="mx-auto max-h-64 w-auto object-contain"
            />
          </div>
          <Input
            label="Title (optional)"
            placeholder="Taken from the link if left empty"
            value={title}
            maxLength={120}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-brand-muted-600">
              Saving copies this image into your own storage.
            </p>
            <Button
              type="button"
              variant="primary"
              size="md"
              disabled={saving}
              onClick={save}
            >
              {saving ? "Saving…" : "Add to gallery"}
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-xs text-brand-muted-600">
          Paste a link to a JPG, PNG, WebP or AVIF image (up to 5 MB), then
          press Preview. Links must start with https://.
        </p>
      )}
    </div>
  );
}
