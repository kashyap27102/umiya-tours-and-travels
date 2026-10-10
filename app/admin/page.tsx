import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Images,
  Inbox,
  ListChecks,
  MapPin,
  MessageSquareQuote,
  PackagePlus,
  SlidersHorizontal,
  Tags,
  type LucideIcon,
} from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { formatCurrency } from "@/lib/format";
import {
  PACKAGE_STATUS_BADGE,
  PACKAGE_STATUS_LABEL,
} from "@/lib/package-status";
import { DashboardService } from "@/services/dashboard-service";

interface StatCardProps {
  href: string;
  icon: LucideIcon;
  label: string;
  value: number;
  detail: string;
}

function StatCard({ href, icon: Icon, label, value, detail }: StatCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue-500"
    >
      <Card variant="elevated" padding="md" className="h-full space-y-3">
        <div className="flex items-center justify-between">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue-700/10 text-brand-blue-700">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <ArrowRight
            className="h-4 w-4 text-brand-muted-600/50 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-blue-700"
            aria-hidden
          />
        </div>
        <div>
          <p className="text-3xl font-semibold text-brand-ink-900">{value}</p>
          <p className="text-sm font-medium text-brand-ink-900">{label}</p>
          <p className="text-xs text-brand-muted-600">{detail}</p>
        </div>
      </Card>
    </Link>
  );
}

const QUICK_ACTIONS = [
  { href: "/admin/enquiries", label: "View enquiries", icon: Inbox },
  { href: "/admin/package-management/create", label: "New package", icon: PackagePlus },
  { href: "/admin/destinations", label: "Add destination or hotel", icon: MapPin },
  { href: "/admin/gallery", label: "Upload images", icon: Images },
  { href: "/admin/testimonials", label: "Add testimonial", icon: MessageSquareQuote },
  { href: "/admin/settings", label: "Edit site content", icon: SlidersHorizontal },
] as const;

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

export default async function AdminPage() {
  const data = await DashboardService.get();
  const { packages, gallery, testimonials } = data;

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-brand-ink-900 md:text-3xl">
          Dashboard
        </h1>
        <p className="text-sm text-brand-muted-600">
          A summary of everything on your website. Click any card to manage it.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {QUICK_ACTIONS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="inline-flex items-center gap-2 rounded-xl border border-brand-blue-900/15 bg-white px-3.5 py-2 text-sm font-medium text-brand-ink-900 transition-colors hover:border-brand-blue-500 hover:text-brand-blue-700"
          >
            <Icon className="h-4 w-4" aria-hidden />
            {label}
          </Link>
        ))}
      </div>

      <section aria-label="Overview" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          href="/admin/enquiries?status=new"
          icon={Inbox}
          label="New enquiries"
          value={data.enquiries.new}
          detail={`${data.enquiries.total} received in total`}
        />
        <StatCard
          href="/admin/package-management"
          icon={Boxes}
          label="Packages"
          value={packages.total}
          detail={`${packages.active} live · ${packages.draft} draft · ${packages.inactive} inactive`}
        />
        <StatCard
          href="/admin/destinations"
          icon={MapPin}
          label="Destinations"
          value={data.destinations}
          detail={`${plural(data.hotels, "hotel")} in total`}
        />
        <StatCard
          href="/admin/categories"
          icon={Tags}
          label="Categories"
          value={data.categories}
          detail="Used to group and filter packages"
        />
        <StatCard
          href="/admin/inclusions"
          icon={ListChecks}
          label="Inclusions & exclusions"
          value={data.inclusions}
          detail="Reusable wording for packages"
        />
        <StatCard
          href="/admin/gallery"
          icon={Images}
          label="Gallery images"
          value={gallery.total}
          detail={`${gallery.unused} not used anywhere`}
        />
        <StatCard
          href="/admin/testimonials"
          icon={MessageSquareQuote}
          label="Testimonials"
          value={testimonials.total}
          detail={`${testimonials.visible} visible on the site`}
        />
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card variant="elevated" padding="md" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-brand-ink-900">
              Needs your attention
            </h2>
          </div>
          {data.attention.length === 0 ? (
            <p className="flex items-center gap-2 text-sm text-brand-green-700">
              <CheckCircle2 className="h-4 w-4" aria-hidden />
              All good — nothing needs fixing right now.
            </p>
          ) : (
            <ul className="divide-y divide-brand-blue-900/[0.07]">
              {data.attention.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 py-3 text-sm transition-colors hover:text-brand-blue-700"
                  >
                    <AlertTriangle
                      className="h-4 w-4 shrink-0 text-amber-600"
                      aria-hidden
                    />
                    <span className="flex-1">{item.label}</span>
                    <Badge variant="accent" size="sm">
                      {item.count}
                    </Badge>
                    <ArrowRight className="h-4 w-4 shrink-0 text-brand-muted-600/50" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card variant="elevated" padding="md" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-brand-ink-900">
              Recently updated packages
            </h2>
            <Link
              href="/admin/package-management"
              className="text-xs font-semibold text-brand-blue-700 hover:underline"
            >
              View all
            </Link>
          </div>
          {data.recentPackages.length === 0 ? (
            <p className="text-sm text-brand-muted-600">
              No packages yet.{" "}
              <Link
                href="/admin/package-management/create"
                className="font-medium text-brand-blue-700 underline"
              >
                Create the first one
              </Link>
              .
            </p>
          ) : (
            <ul className="divide-y divide-brand-blue-900/[0.07]">
              {data.recentPackages.map((pkg) => (
                <li key={pkg.id}>
                  <Link
                    href={`/admin/package-management/${pkg.slug}/edit`}
                    className="flex items-center gap-3 py-3 transition-colors hover:text-brand-blue-700"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-brand-ink-900">
                        {pkg.name}
                      </p>
                      <p className="text-xs text-brand-muted-600">
                        {pkg.startingPrice > 0
                          ? `From ${formatCurrency(pkg.startingPrice)}`
                          : "No price yet"}{" "}
                        · updated{" "}
                        {new Date(pkg.updatedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                    <Badge variant={PACKAGE_STATUS_BADGE[pkg.status]} size="sm">
                      {PACKAGE_STATUS_LABEL[pkg.status]}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
