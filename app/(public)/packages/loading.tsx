export default function Loading() {
  return (
    <main className="flex flex-col gap-10">
      <div className="h-48 animate-pulse bg-brand-blue-900/10" />
      <div className="travel-shell flex flex-col gap-6">
        <div className="h-10 w-48 animate-pulse rounded-xl bg-brand-blue-900/10" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-80 animate-pulse rounded-3xl border border-brand-blue-900/10 bg-white/60"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
