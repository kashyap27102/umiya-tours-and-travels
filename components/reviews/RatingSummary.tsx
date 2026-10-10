import { StarRow } from "./ReviewCard";

/** Average rating and a 5-to-1 star breakdown, over every visible review. */
export default function RatingSummary({
  average,
  total,
  distribution,
}: Readonly<{
  average: number;
  total: number;
  distribution: readonly number[];
}>) {
  return (
    <section
      aria-label="Rating summary"
      className="grid gap-8 rounded-3xl bg-white p-8 shadow-[0_12px_32px_rgb(var(--brand-blue-rgb)/0.10)] md:grid-cols-[auto_1fr] md:items-center md:gap-14 md:p-10"
    >
      <div className="text-center md:text-left">
        <p className="text-6xl font-bold text-brand-ink-900">
          {average.toFixed(1)}
        </p>
        <div className="mt-2 flex justify-center md:justify-start">
          <StarRow count={Math.round(average)} size={22} />
        </div>
        <p className="mt-2 text-sm text-brand-muted-600">
          From {total} traveller {total === 1 ? "story" : "stories"}
        </p>
      </div>

      <ul className="space-y-2.5">
        {distribution.map((count, index) => {
          const stars = 5 - index;
          const percent = total ? Math.round((count / total) * 100) : 0;
          return (
            <li key={stars} className="flex items-center gap-3 text-sm">
              <span className="w-12 shrink-0 text-brand-muted-600">
                {stars} star{stars === 1 ? "" : "s"}
              </span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-brand-mist-200">
                <span
                  className="block h-full rounded-full bg-brand-lime-400"
                  style={{ width: `${percent}%` }}
                />
              </span>
              <span className="w-9 shrink-0 text-right text-brand-muted-600">
                {percent}%
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
