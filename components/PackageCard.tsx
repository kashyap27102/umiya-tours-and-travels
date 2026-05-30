import Image from "next/image";
import Link from "next/link";
import { Badge, Button, Card, CardBody, CardTitle } from "@/components/ui";
import type { TravelPackage } from "@/lib/packages-data";

interface PackageCardProps {
  item: TravelPackage;
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
  return (
    <Card variant="elevated" padding="none" className="flex h-full flex-col">
      <div className="relative">
        <Image
          src={item.image}
          alt={`${item.name} destination view`}
          width={1200}
          height={900}
          className="h-56 w-full object-cover"
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
          <CardTitle className="text-xl">{item.name}</CardTitle>
          <CardBody className="mt-1 text-xs uppercase tracking-wide text-brand-muted-600">
            {item.destination}
          </CardBody>
          {!compact && <CardBody className="mt-3">{item.summary}</CardBody>}
        </div>

        <ul className="space-y-2">
          {item.highlights.slice(0, 3).map((point) => (
            <li
              key={point}
              className="flex items-start gap-2 text-sm text-brand-muted-600"
            >
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green-500" />
              <span>{point}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto rounded-2xl bg-brand-mist-200/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted-600">
            Starting Price
          </p>
          <p className="mt-1 text-2xl font-bold text-brand-ink-900">
            {formatCurrency(item.pricePerPerson)}
          </p>
          <p className="text-xs text-brand-muted-600">
            per person · {item.durationLabel}
          </p>
        </div>

        {!compact && (
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="solid" size="md">
              <Link href={`/packages/${item.slug}`}>View Details</Link>
            </Button>
            <Button asChild variant="outline" size="md">
              <Link href={`/contact?service=package&package=${item.slug}`}>
                Book Now
              </Link>
            </Button>
          </div>
        )}

        {compact && (
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline" size="sm">
              <Link href={`/admin/package-management/${item.slug}/edit`}>
                Edit
              </Link>
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
