import { Card, Skeleton } from "@/components/ui";

/** Several short text lines, the last one shorter, like a paragraph. */
function TextLines({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={index === lines - 1 ? "h-4 w-2/3" : "h-4 w-full"}
        />
      ))}
    </div>
  );
}

/** Placeholder with the same layout as the package details page. */
export function PackageDetailSkeleton() {
  return (
    <div className="flex w-full flex-col gap-10">
      {/* Photo gallery: one large photo and two stacked */}
      <div className="grid h-72 gap-2 md:h-112 md:grid-cols-[2fr_1fr] md:grid-rows-2 md:gap-3">
        <Skeleton className="rounded-3xl md:row-span-2" />
        <Skeleton className="hidden rounded-3xl md:block" />
        <Skeleton className="hidden rounded-3xl md:block" />
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Left: title, stay options, itinerary */}
        <div className="space-y-6">
          <Card variant="elevated" padding="lg" className="space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <TextLines lines={3} />
            <Skeleton className="h-6 w-28 rounded-xl" />
          </Card>

          <Card variant="elevated" padding="lg" className="space-y-6">
            <Skeleton className="h-6 w-64" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24 rounded-full" />
              <Skeleton className="h-10 w-24 rounded-full" />
              <Skeleton className="h-10 w-24 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-3 w-24" />
              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-12 w-full sm:w-44" />
                <Skeleton className="h-12 w-full sm:w-44" />
              </div>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </Card>

          <Card variant="elevated" padding="lg" className="space-y-4">
            <Skeleton className="h-6 w-48" />
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-14 w-full rounded-2xl" />
            ))}
          </Card>
        </div>

        {/* Right: price, inclusions, exclusions */}
        <div className="space-y-6">
          <Card variant="tinted" padding="lg" className="space-y-3">
            <Skeleton className="h-3 w-28 bg-brand-blue-900/15" />
            <Skeleton className="h-9 w-40 bg-brand-blue-900/15" />
            <Skeleton className="h-4 w-48 bg-brand-blue-900/15" />
            <Skeleton className="mt-2 h-11 w-full rounded-xl bg-brand-blue-900/15" />
          </Card>
          {Array.from({ length: 2 }).map((_, index) => (
            <Card key={index} variant="default" padding="lg" className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <TextLines lines={4} />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
