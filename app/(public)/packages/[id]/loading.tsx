import { PackageDetailSkeleton } from "@/components/skeletons/PackageDetailSkeleton";

export default function Loading() {
  return (
    <main
      className="travel-shell flex w-full flex-col gap-10 py-10 md:py-14"
      aria-busy="true"
    >
      <span role="status" className="sr-only">
        Loading package details…
      </span>
      <PackageDetailSkeleton />
    </main>
  );
}
