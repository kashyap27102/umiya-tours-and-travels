import Link from "next/link";

/** A link styled as a pill, with an optional count. */
export default function ChipLink({
  href,
  label,
  count,
}: Readonly<{ href: string; label: string; count?: number }>) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-brand-blue-900/15 bg-white px-3.5 py-1.5 text-sm font-medium transition-colors hover:border-brand-blue-500 hover:bg-brand-mist-200/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue-500"
    >
      {label}
      {count !== undefined && (
        <span className="rounded-full bg-brand-mist-200 px-1.5 py-0.5 text-xs text-brand-muted-600">
          {count}
        </span>
      )}
    </Link>
  );
}
