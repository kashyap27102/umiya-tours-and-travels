import { Suspense } from "react";
import GalleryManager from "@/components/admin/gallery/GalleryManager";
import {
  DEFAULT_GALLERY_PAGE_SIZE,
  GALLERY_PAGE_SIZES,
} from "@/lib/media";
import { MediaService } from "@/services/media-service";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    tag?: string;
    page?: string;
    pageSize?: string;
  }>;
}

export default async function AdminGalleryPage({
  searchParams,
}: Readonly<PageProps>) {
  const params = await searchParams;

  const page = Math.max(1, Math.trunc(Number(params.page ?? 1)) || 1);
  const requestedSize = Number(params.pageSize);
  const pageSize = (GALLERY_PAGE_SIZES as readonly number[]).includes(
    requestedSize,
  )
    ? requestedSize
    : DEFAULT_GALLERY_PAGE_SIZE;
  const q = params.q?.trim() ?? "";
  const tag = params.tag?.trim().toLowerCase() ?? "";

  const [data, tags] = await Promise.all([
    MediaService.list({ q, tag, page, pageSize }),
    MediaService.getTags(),
  ]);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-brand-ink-900 md:text-3xl">
          Gallery
        </h1>
        <p className="text-sm text-brand-muted-600">
          All your images in one place. Packages and itinerary days pick from
          here, so a photo can be reused and edited in one spot.
        </p>
      </div>

      <Suspense>
        <GalleryManager
          data={data}
          tags={tags}
          activeTag={tag}
          hasFilters={q !== "" || tag !== ""}
        />
      </Suspense>
    </div>
  );
}
