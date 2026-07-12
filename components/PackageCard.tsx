import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { Badge, Button, Card, CardTitle } from "@/components/ui";
import { formatDurationLabel } from "@/lib/packages-constants";
import type { PackageWithItinerary } from "@/types/package";

interface PackageCardProps {
  item: PackageWithItinerary;
  compact?: boolean;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function PackageCard({
  item,
  compact,
}: Readonly<PackageCardProps>) {
  const card = (
    <Card
      variant="elevated"
      padding="none"
      className="flex h-full flex-col transition-shadow hover:shadow-[0_16px_40px_rgb(var(--brand-blue-rgb)/0.20)]"
    >
      <div className="relative">
        <Image
          src={item.images[0] ?? "/logo.png"}
          alt={`${item.name} destination view`}
          width={1200}
          height={900}
          className="h-56 w-full object-cover rounded-2xl"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <Badge variant="solid" size="sm">
            {item.category}
          </Badge>
          {compact && (
            <Badge
              variant={item.status === "active" ? "success" : "outline"}
              size="sm"
            >
              {item.status === "active" ? "Active" : "Inactive"}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <CardTitle>{item.name}</CardTitle>
        </div>

        <div className="mt-auto rounded-2xl bg-brand-mist-200/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted-600">
            Starting Price
          </p>
          <p className="mt-1 text-2xl font-bold text-brand-ink-900">
            {formatCurrency(item.pricePerPerson)}
          </p>
          <p className="text-xs text-brand-muted-600">
            per person ·{" "}
            {formatDurationLabel(item.durationNights, item.durationDays)}
          </p>
        </div>

        {compact && (
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline" size="sm" title="Edit package">
              <Link
                href={`/admin/package-management/${item.slug}/edit`}
                aria-label="Edit package"
              >
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </Card>
  );

  if (compact) {
    return card;
  }

  return (
    <Link href={`/packages/${item.slug}`} className="flex h-full flex-col">
      {card}
    </Link>
  );
}
