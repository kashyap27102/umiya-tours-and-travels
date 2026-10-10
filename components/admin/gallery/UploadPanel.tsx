"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { MEDIA_ALLOWED_TYPES, MEDIA_MAX_BYTES } from "@/lib/media";
import type { MediaItem } from "@/services/media-service";

interface UploadPanelProps {
  /** Called once all chosen files have been processed, with the ones that saved. */
  onAdded: (items: MediaItem[]) => void;
  /** Allow choosing several files at once. */
  multiple?: boolean;
}

type FileStatus = {
  name: string;
  state: "uploading" | "done" | "error";
  message?: string;
};

const ALLOWED = new Set<string>(MEDIA_ALLOWED_TYPES);

export function UploadPanel({
  onAdded,
  multiple = true,
}: Readonly<UploadPanelProps>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [statuses, setStatuses] = useState<FileStatus[]>([]);

  async function uploadAll(files: File[]) {
    if (files.length === 0 || busy) return;
    setBusy(true);
    setStatuses(files.map((f) => ({ name: f.name, state: "uploading" })));

    const added: MediaItem[] = [];
    // One request per file: keeps each request small and shows per-file results.
    for (const [index, file] of files.entries()) {
      const set = (status: Partial<FileStatus>) =>
        setStatuses((prev) =>
          prev.map((s, i) => (i === index ? { ...s, ...status } : s)),
        );

      if (!ALLOWED.has(file.type)) {
        set({ state: "error", message: "Only JPG, PNG, WebP or AVIF images." });
        continue;
      }
      if (file.size > MEDIA_MAX_BYTES) {
        set({ state: "error", message: "Larger than 5 MB." });
        continue;
      }

      try {
        const body = new FormData();
        body.append("file", file);
        const response = await fetch("/api/media", { method: "POST", body });
        const data = (await response.json().catch(() => null)) as {
          created?: MediaItem[];
          errors?: { error: string }[];
          error?: string;
        } | null;

        if (response.ok && data?.created?.length) {
          added.push(...data.created);
          set({ state: "done" });
        } else {
          set({
            state: "error",
            message:
              data?.errors?.[0]?.error ?? data?.error ?? "Upload failed.",
          });
        }
      } catch {
        set({ state: "error", message: "Upload failed. Check your connection." });
      }
    }

    setBusy(false);
    if (added.length > 0) onAdded(added);
  }

  function pick(list: FileList | null) {
    if (!list) return;
    const files = Array.from(list);
    void uploadAll(multiple ? files : files.slice(0, 1));
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-4">
      <div
        role="button"
        tabIndex={0}
        onClick={() => !busy && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !busy) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          pick(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors",
          dragging
            ? "border-brand-blue-500 bg-brand-blue-500/5"
            : "border-brand-blue-900/20 hover:border-brand-blue-500/60",
          busy && "pointer-events-none opacity-60",
        )}
      >
        <UploadCloud className="h-8 w-8 text-brand-blue-700" />
        <p className="text-sm font-medium text-brand-ink-900">
          {multiple
            ? "Drop images here, or click to choose files"
            : "Drop an image here, or click to choose a file"}
        </p>
        <p className="text-xs text-brand-muted-600">
          JPG, PNG, WebP or AVIF, up to 5 MB each
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={MEDIA_ALLOWED_TYPES.join(",")}
          multiple={multiple}
          className="hidden"
          onChange={(e) => pick(e.target.files)}
        />
      </div>

      {statuses.length > 0 && (
        <ul className="space-y-1.5 text-sm">
          {statuses.map((s, i) => (
            <li key={i} className="flex items-start justify-between gap-3">
              <span className="min-w-0 truncate text-brand-ink-900">{s.name}</span>
              <span
                className={cn(
                  "shrink-0 text-xs font-medium",
                  s.state === "done" && "text-brand-green-700",
                  s.state === "error" && "text-red-600",
                  s.state === "uploading" && "text-brand-muted-600",
                )}
              >
                {s.state === "uploading" && "Uploading…"}
                {s.state === "done" && "Added"}
                {s.state === "error" && s.message}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
