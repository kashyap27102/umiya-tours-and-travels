import InclusionManager from "@/components/admin/taxonomy/InclusionManager";
import { TaxonomyService } from "@/services";

export default async function AdminInclusionsPage() {
  const result = await TaxonomyService.getInclusions();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-brand-ink-900 md:text-3xl">
          Inclusions & Exclusions
        </h1>
        <p className="text-sm text-brand-muted-600">
          One shared list of wording. When building a package, pick which items
          are included and which are excluded; editing an item here updates
          every package that uses it.
        </p>
      </div>

      {result.success ? (
        <InclusionManager items={result.data} />
      ) : (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5">
          <p className="text-sm font-medium text-red-700">{result.error}</p>
        </div>
      )}
    </div>
  );
}
