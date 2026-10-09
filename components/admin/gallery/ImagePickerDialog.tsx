"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Button, Input, Modal } from "@/components/ui";
import { cn } from "@/components/ui/cn";
import { LinkPanel } from "./LinkPanel";
import { MediaThumb } from "./MediaThumb";
import { TabButtons } from "./TabButtons";
import { UploadPanel } from "./UploadPanel";
import type { MediaItem, MediaPage } from "@/services/media-service";

export interface ImagePickerDialogProps {
  open: boolean;
  onClose: () => void;
  /** Called with the chosen image(s); the dialog then closes itself. */
  onSelect: (items: MediaItem[]) => void;
  /** "single" picks one image on click; "multiple" lets you tick several. */
  mode?: "single" | "multiple";
  /** Most images that can still be added (multiple mode). */
  max?: number;
  /** Images already in use here; shown ticked and not selectable. */
  excludeIds?: string[];
  title?: string;
}

type Tab = "gallery" | "upload" | "link";
const PAGE_SIZE = 24;

/** Choose an image from the gallery, upload a file, or add one by link. */
export function ImagePickerDialog(props: Readonly<ImagePickerDialogProps>) {
  // Mounted only while open so every opening starts fresh.
  return props.open ? <PickerContent {...props} /> : null;
}

function PickerContent({
  onClose,
  onSelect,
  mode = "multiple",
  max = Infinity,
  excludeIds = [],
  title = "Choose images",
}: Readonly<ImagePickerDialogProps>) {
  const [tab, setTab] = useState<Tab>("gallery");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selected, setSelected] = useState<MediaItem[]>([]);
  // The result is stored with the request it answers, so "loading" is simply
  // "the stored result is for an older request".
  const [loaded, setLoaded] = useState<{ key: string; data: MediaPage } | null>(
    null,
  );
  const [failed, setFailed] = useState<string | null>(null);

  const requestKey = `${debouncedQuery}|${page}|${refreshKey}`;
  const loading = loaded?.key !== requestKey && failed !== requestKey;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (tab !== "gallery") return;
    const controller = new AbortController();
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(PAGE_SIZE),
    });
    if (debouncedQuery) params.set("q", debouncedQuery);

    fetch(`/api/media?${params.toString()}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("failed");
        return response.json() as Promise<MediaPage>;
      })
      .then((data) => setLoaded({ key: requestKey, data }))
      .catch((error: unknown) => {
        if ((error as Error).name !== "AbortError") setFailed(requestKey);
      });
    return () => controller.abort();
  }, [tab, page, debouncedQuery, requestKey]);

  const excluded = new Set(excludeIds);
  const selectedIds = new Set(selected.map((s) => s.id));
  const canAddMore = selected.length < max;

  function choose(item: MediaItem) {
    if (excluded.has(item.id)) return;
    if (mode === "single") {
      onSelect([item]);
      onClose();
      return;
    }
    setSelected((prev) =>
      prev.some((s) => s.id === item.id)
        ? prev.filter((s) => s.id !== item.id)
        : prev.length < max
          ? [...prev, item]
          : prev,
    );
  }

  // Something was just uploaded or added by link.
  function handleAdded(items: MediaItem[]) {
    if (mode === "single") {
      onSelect(items.slice(0, 1));
      onClose();
      return;
    }
    setSelected((prev) => {
      const next = [...prev];
      for (const item of items) {
        if (
          next.length < max &&
          !excluded.has(item.id) &&
          !next.some((s) => s.id === item.id)
        ) {
          next.push(item);
        }
      }
      return next;
    });
    setRefreshKey((k) => k + 1);
    setTab("gallery");
  }

  const data = loaded?.data;

  return (
    <Modal
      open
      onClose={onClose}
      title={title}
      size="lg"
      footer={
        mode === "multiple" ? (
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-brand-muted-600">
              {selected.length} selected
              {Number.isFinite(max) && ` (room for ${max})`}
            </p>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" size="md" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="md"
                disabled={selected.length === 0}
                onClick={() => {
                  onSelect(selected);
                  onClose();
                }}
              >
                Add {selected.length || ""} image
                {selected.length === 1 ? "" : "s"}
              </Button>
            </div>
          </div>
        ) : undefined
      }
    >
      <div className="space-y-4">
        <TabButtons
          tabs={[
            { value: "gallery", label: "From gallery" },
            { value: "upload", label: "Upload" },
            { value: "link", label: "From a link" },
          ]}
          value={tab}
          onChange={setTab}
        />

        {tab === "upload" && (
          <UploadPanel onAdded={handleAdded} multiple={mode === "multiple"} />
        )}
        {tab === "link" && <LinkPanel onAdded={handleAdded} />}

        {tab === "gallery" && (
          <div className="space-y-3">
            <Input
              placeholder="Search by title, alt text or tag…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search the gallery"
            />

            {failed === requestKey ? (
              <p className="py-10 text-center text-sm text-red-600">
                Could not load the gallery. Close and try again.
              </p>
            ) : loading && !data ? (
              <p className="py-10 text-center text-sm text-brand-muted-600">
                Loading…
              </p>
            ) : data && data.items.length === 0 ? (
              <p className="py-10 text-center text-sm text-brand-muted-600">
                {debouncedQuery
                  ? "No images match your search."
                  : "The gallery is empty. Use Upload or From a link to add images."}
              </p>
            ) : (
              <ul
                className={cn(
                  "grid max-h-[50vh] grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4",
                  loading && "opacity-60",
                )}
              >
                {data?.items.map((item) => {
                  const isIn = excluded.has(item.id);
                  const isPicked = selectedIds.has(item.id);
                  const blocked =
                    isIn || (mode === "multiple" && !isPicked && !canAddMore);
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        disabled={blocked}
                        onClick={() => choose(item)}
                        title={isIn ? "Already added" : item.title}
                        className={cn(
                          "relative block w-full cursor-pointer overflow-hidden rounded-lg border-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue-500 disabled:cursor-not-allowed",
                          isPicked || isIn
                            ? "border-brand-blue-700"
                            : "border-transparent hover:border-brand-blue-500/50",
                          blocked && "opacity-50",
                        )}
                      >
                        <div className="aspect-4/3 bg-brand-mist-200/40">
                          <MediaThumb src={item.url} alt={item.alt || item.title} />
                        </div>
                        <p className="truncate bg-white px-1.5 py-1 text-xs text-brand-ink-900">
                          {item.title}
                        </p>
                        {(isPicked || isIn) && (
                          <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-blue-700 text-white shadow">
                            <Check className="h-3 w-3" />
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            {data && data.totalPages > 1 && (
              <div className="flex items-center justify-between text-xs text-brand-muted-600">
                <span>
                  Page {data.page} of {data.totalPages}
                </span>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={data.page <= 1 || loading}
                    onClick={() => setPage(data.page - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={data.page >= data.totalPages || loading}
                    onClick={() => setPage(data.page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
