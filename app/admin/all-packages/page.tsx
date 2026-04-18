import { Card, CardBody, CardTitle } from "@/components/ui";
import { travelPackages } from "@/lib/packages-data";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function AdminAllPackagesPage() {
  return (
    <div className="space-y-6">
      <Card variant="elevated" padding="lg" className="space-y-2">
        <CardTitle className="text-2xl md:text-3xl">All Packages</CardTitle>
        <CardBody>
          Browse all published travel packages with destination, duration, and
          pricing.
        </CardBody>
      </Card>

      <div className="grid gap-4">
        {travelPackages.map((item) => (
          <Card
            key={item.slug}
            variant="default"
            padding="md"
            className="space-y-2"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-brand-ink-900">
                {item.name}
              </h2>
              <span className="text-sm font-semibold text-brand-blue-700">
                {formatCurrency(item.pricePerPerson)} / person
              </span>
            </div>

            <p className="text-sm text-brand-muted-600">
              {item.destination} | {item.durationLabel} | {item.category}
            </p>

            <p className="text-sm text-brand-muted-600">{item.summary}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
