import Link from "next/link";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-brand-blue-900 px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-lime-400">
        404
      </p>
      <h1 className="mt-3 text-2xl font-bold text-brand-cream-100 md:text-3xl">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-3 max-w-md text-sm text-brand-cream-100/70">
        The page you&apos;re looking for may have moved or no longer exists.
        Explore our tours or head back home.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild variant="primary" size="lg">
          <Link href="/">Back to Home</Link>
        </Button>
        <Button asChild variant="hero-outline" size="lg">
          <Link href="/packages">Browse Packages</Link>
        </Button>
      </div>
    </main>
  );
}
