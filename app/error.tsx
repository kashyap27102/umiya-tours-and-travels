"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-brand-blue-900 px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-lime-400">
        Something went wrong
      </p>
      <h1 className="mt-3 text-2xl font-bold text-brand-cream-100 md:text-3xl">
        We hit a snag loading this page
      </h1>
      <p className="mt-3 max-w-md text-sm text-brand-cream-100/70">
        Please try again, or call us directly if the problem continues.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button variant="primary" size="lg" onClick={() => unstable_retry()}>
          Try Again
        </Button>
        <Button asChild variant="hero-outline" size="lg">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </main>
  );
}
