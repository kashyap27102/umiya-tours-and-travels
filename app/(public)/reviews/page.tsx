import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import CtaBanner from "@/components/CtaBanner";
import PageHero from "@/components/PageHero";
import RatingSummary from "@/components/reviews/RatingSummary";
import ReviewCard from "@/components/reviews/ReviewCard";
import { cn } from "@/components/ui";
import { appConfig } from "@/lib/config";
import { breadcrumbJsonLd, createMetadata, toJsonLd } from "@/lib/metadata";
import { TestimonialService } from "@/services/testimonial-service";

const PAGE_SIZE = 12;

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

const pageNumber = (value?: string) =>
  Math.max(1, Math.trunc(Number(value ?? 1)) || 1);

const hrefFor = (page: number) => (page > 1 ? `/reviews?page=${page}` : "/reviews");

export async function generateMetadata({ searchParams }: PageProps) {
  const { page: raw } = await searchParams;
  const data = await TestimonialService.getPublicPage({
    page: pageNumber(raw),
    pageSize: PAGE_SIZE,
  });
  return createMetadata({
    title: "Traveller Reviews & Testimonials | Umiya Tours & Travels",
    description: data.total
      ? `Read ${data.total} real stories from travellers who booked tours, cabs and holidays with Umiya Tours & Travels, rated ${data.average.toFixed(1)} out of 5.`
      : "Read what travellers say about their holidays with Umiya Tours & Travels.",
    path: hrefFor(data.page),
    keywords: [
      "Umiya Tours reviews",
      "Umiya Tours and Travels testimonials",
      "travel agency reviews Gandhinagar",
      "tour package reviews",
    ],
  });
}

export default async function ReviewsPage({ searchParams }: PageProps) {
  const { page: raw } = await searchParams;
  const data = await TestimonialService.getPublicPage({
    page: pageNumber(raw),
    pageSize: PAGE_SIZE,
  });
  const base = appConfig.siteUrl;
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", url: base },
    { name: "Reviews", url: `${base}/reviews` },
  ]);

  return (
    <main className="flex flex-col gap-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbs) }}
      />

      <PageHero
        badge="Traveller Stories"
        heading="Happy Faces, Real Journeys"
        description="Honest words from the families, friends and pilgrims who travelled with us."
      />

      <div className="travel-shell flex w-full min-w-0 flex-col gap-10">
        <div>
          <Breadcrumb crumbs={[{ label: "Reviews" }]} />
          {data.total > 0 && (
            <RatingSummary
              average={data.average}
              total={data.total}
              distribution={data.distribution}
            />
          )}
        </div>

        {data.total === 0 ? (
          <p className="rounded-2xl border border-brand-mist-200 bg-white py-16 text-center text-sm text-brand-muted-600">
            Traveller stories will appear here soon. In the meantime,{" "}
            <Link href="/contact" className="font-medium underline">
              get in touch
            </Link>{" "}
            and plan your own trip with us.
          </p>
        ) : (
          <section aria-label="Traveller reviews">
            <h2 className="sr-only">All traveller reviews</h2>
            <div className="columns-1 gap-6 md:columns-2 xl:columns-3">
              {data.items.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </section>
        )}

        {data.totalPages > 1 && (
          <nav
            aria-label="Reviews pages"
            className="flex flex-wrap items-center justify-center gap-2"
          >
            {data.page > 1 && (
              <Link
                href={hrefFor(data.page - 1)}
                rel="prev"
                className="rounded-full border border-brand-blue-900/15 bg-white px-4 py-2 text-sm font-medium hover:border-brand-blue-500"
              >
                Previous
              </Link>
            )}
            {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                href={hrefFor(n)}
                aria-current={n === data.page ? "page" : undefined}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium",
                  n === data.page
                    ? "border-brand-blue-700 bg-brand-blue-700 text-white!"
                    : "border-brand-blue-900/15 bg-white hover:border-brand-blue-500",
                )}
              >
                {n}
              </Link>
            ))}
            {data.page < data.totalPages && (
              <Link
                href={hrefFor(data.page + 1)}
                rel="next"
                className="rounded-full border border-brand-blue-900/15 bg-white px-4 py-2 text-sm font-medium hover:border-brand-blue-500"
              >
                Next
              </Link>
            )}
          </nav>
        )}

        <CtaBanner
          heading="Ready to write your own story?"
          description="Tell us your dates, group size, and budget. We will plan the rest."
          actions={[
            { label: "Browse Packages", href: "/packages" },
            {
              label: "Talk to Us",
              href: "/contact",
              variant: "hero-outline",
            },
          ]}
        />
      </div>
    </main>
  );
}
