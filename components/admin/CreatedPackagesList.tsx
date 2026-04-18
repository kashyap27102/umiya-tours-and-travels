import { Card } from "@/components/ui";
import type { CreatedPackage } from "@/hooks/useCustomPackageForm";

type CreatedPackagesListProps = {
  createdPackages: CreatedPackage[];
};

export default function CreatedPackagesList({
  createdPackages,
}: CreatedPackagesListProps) {
  if (createdPackages.length === 0) {
    return (
      <Card variant="default" padding="md">
        <p className="text-sm text-brand-muted-600">
          No package created yet. Use the sidebar and open Create Package Form.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-brand-ink-900">
        Recently Created Packages
      </h2>

      <div className="grid gap-4">
        {createdPackages.map((item) => (
          <Card
            key={item.id}
            variant="default"
            padding="md"
            className="space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-brand-ink-900">
                {item.packageName}
              </h3>
              <span className="text-xs font-medium text-brand-muted-600">
                Created: {item.createdAt}
              </span>
            </div>

            <p className="text-sm text-brand-muted-600">
              {item.departurePlace} to {item.arrivalPlace} |{" "}
              {item.departureDate} to {item.arrivalDate}
            </p>

            <p className="text-sm text-brand-muted-600">
              Travelers: {item.travelerCount} | Amount/Person:{" "}
              {item.amountPerPerson} | Vehicle: {item.vehicle}
            </p>

            <div className="space-y-1">
              {item.itinerary.map((day, index) => (
                <p
                  key={`${day.dayLabel}-${index}`}
                  className="text-sm text-brand-ink-900"
                >
                  <span className="font-semibold">{day.dayLabel}:</span>{" "}
                  {day.details}
                </p>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
