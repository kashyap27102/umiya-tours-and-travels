import DestinationManager from "@/components/admin/taxonomy/DestinationManager";
import { TaxonomyService } from "@/services";

export default async function AdminDestinationsPage() {
  const result = await TaxonomyService.getDestinations();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-brand-ink-900 md:text-3xl">
          Destinations
        </h1>
        <p className="text-sm text-brand-muted-600">
          Manage the places packages can visit.
        </p>
      </div>

      {result.success ? (
        <DestinationManager destinations={result.data} />
      ) : (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5">
          <p className="text-sm font-medium text-red-700">{result.error}</p>
        </div>
      )}
    </div>
  );
}
