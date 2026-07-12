import PackageGallery from "@/components/PackageGallery";

const photos = [
  "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1626621331169-5d4f5f0f5d7a?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1626621615481-2184f413f0f0?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80",
];

export default function GalleryPreviewPage() {
  return (
    <main className="travel-shell flex flex-col gap-10 py-10">
      {[1, 2, 3, 4, 5, 6].map((count) => (
        <div key={count} className="space-y-2">
          <h2 className="text-sm font-semibold text-brand-ink-900">
            {count} image{count > 1 ? "s" : ""}
          </h2>
          <PackageGallery images={photos.slice(0, count)} alt={`preview-${count}`} />
        </div>
      ))}
    </main>
  );
}
