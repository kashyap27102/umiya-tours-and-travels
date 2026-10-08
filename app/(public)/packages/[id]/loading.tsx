export default function Loading() {
  return (
    <main className="travel-shell flex flex-col gap-8 py-10">
      <div className="h-96 animate-pulse rounded-3xl bg-brand-blue-900/10" />
      <div className="flex flex-col gap-4">
        <div className="h-8 w-2/3 animate-pulse rounded-xl bg-brand-blue-900/10" />
        <div className="h-4 w-full animate-pulse rounded-xl bg-brand-blue-900/10" />
        <div className="h-4 w-5/6 animate-pulse rounded-xl bg-brand-blue-900/10" />
      </div>
      <div className="h-64 animate-pulse rounded-3xl border border-brand-blue-900/10 bg-white/60" />
    </main>
  );
}
