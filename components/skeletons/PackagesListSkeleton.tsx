import { Card, Skeleton } from "@/components/ui";

/** Placeholder for the search / filter bar above the package grid. */
function FilterBarSkeleton() {
  return (
    <Card
      variant="default"
      padding="md"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4"
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-11 w-full" />
        </div>
      ))}
    </Card>
  );
}

/** Placeholder shaped like a PackageCard: photo, title, then the price box. */
function PackageCardSkeleton() {
  return (
    <Card variant="elevated" padding="none" className="flex h-full flex-col">
      <Skeleton className="h-56 w-full rounded-2xl" />
      <div className="flex flex-1 flex-col gap-4 p-6">
        <Skeleton className="h-6 w-3/4" />
        <div className="mt-auto space-y-2 rounded-2xl bg-brand-mist-200/50 p-4">
          <Skeleton className="h-3 w-28 bg-brand-blue-900/15" />
          <Skeleton className="h-8 w-32 bg-brand-blue-900/15" />
          <Skeleton className="h-3 w-40 bg-brand-blue-900/15" />
        </div>
      </div>
    </Card>
  );
}

/** Filter bar + a grid of cards, matching the real catalog's layout. */
export function PackagesCatalogSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div className="flex w-full flex-col gap-6">
      <FilterBarSkeleton />
      <Skeleton className="h-4 w-44" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: cards }).map((_, index) => (
          <PackageCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
