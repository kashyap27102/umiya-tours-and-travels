"use client";

import { Suspense, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ImagePlus } from "lucide-react";
import { Badge, Button, Input, Select } from "@/components/ui";
import type { SelectOption } from "@/components/ui";
import AdminPagination from "@/components/admin/AdminPagination";
import { useUrlSearch } from "@/hooks/useUrlSearch";
import { GALLERY_PAGE_SIZES } from "@/lib/media";
import { AddImageDialog } from "./AddImageDialog";
import { ImageDetailModal } from "./ImageDetailModal";
import { MediaThumb } from "./MediaThumb";
import type { MediaItem, MediaPage } from "@/services/media-service";

const ALL = "all";

interface GalleryManagerProps {
  data: MediaPage;
  tags: { tag: string; count: number }[];
  activeTag: string;
  hasFilters: boolean;
}

export default function GalleryManager({
  data,
  tags,
  activeTag,
  hasFilters,
}: Readonly<GalleryManagerProps>) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useUrlSearch("q");
  const [adding, setAdding] = useState(false);
  const [selected, setSelected] = useState<MediaItem | null>(null);

  const tagOptions: SelectOption[] = [
    { label: "All tags", value: ALL },
    ...tags.map((t) => ({ label: `${t.tag} (${t.count})`, value: t.tag })),
  ];

  function changeTag(value: string) {
    const params = new URLSearchParams(window.location.search);
    if (value === ALL) params.delete("tag");
    else params.set("tag", value);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            placeholder="Search by title, alt text or tag…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setQuery("");
            }}
            aria-label="Search images"
          />
        </div>
        <Select
          options={tagOptions}
          value={activeTag || ALL}
          onChange={changeTag}
          placeholder="Tag"
          className="w-full sm:w-52"
        />
        <Button variant="primary" size="md" onClick={() => setAdding(true)}>
          <ImagePlus className="h-4 w-4" /> Add images
        </Button>
      </div>

      <p className="text-xs text-brand-muted-600">
        {data.total} image{data.total === 1 ? "" : "s"}
        {hasFilters ? " match your filters" : " in the gallery"}
      </p>

      {data.items.length === 0 ? (
        <div className="rounded-2xl border border-brand-mist-200 bg-white py-16 text-center">
          <p className="text-sm text-brand-muted-600">
            {hasFilters
              ? "No images match your search."
              : "No images yet. Add your first one."}
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {data.items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setSelected(item)}
                className="group w-full cursor-pointer overflow-hidden rounded-xl border border-brand-blue-900/10 bg-white text-left transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue-500"
              >
                <div className="aspect-4/3 overflow-hidden bg-brand-mist-200/40">
                  <MediaThumb
                    src={item.url}
                    alt={item.alt || item.title}
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-1.5 p-2.5">
                  <p
                    className="truncate text-sm font-medium text-brand-ink-900"
                    title={item.title}
                  >
                    {item.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-1">
                    <Badge
                      variant={item.usageCount > 0 ? "success" : "outline"}
                      size="sm"
                    >
                      {item.usageCount > 0
                        ? `Used ${item.usageCount}×`
                        : "Unused"}
                    </Badge>
                    {item.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="brand" size="sm">
                        {tag}
                      </Badge>
                    ))}
                    {item.tags.length > 2 && (
                      <span className="text-xs text-brand-muted-600">
                        +{item.tags.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <Suspense>
        <AdminPagination
          page={data.page}
          totalPages={data.totalPages}
          total={data.total}
          pageSize={data.pageSize}
          itemLabel="images"
          pageSizes={GALLERY_PAGE_SIZES}
        />
      </Suspense>

      <AddImageDialog
        open={adding}
        onClose={() => setAdding(false)}
        onAdded={() => {
          setAdding(false);
          router.refresh();
        }}
      />
      <ImageDetailModal image={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
