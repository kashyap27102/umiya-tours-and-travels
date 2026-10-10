import CategoryManager from "@/components/admin/taxonomy/CategoryManager";
import { TaxonomyService } from "@/services";

export default async function AdminCategoriesPage() {
  const result = await TaxonomyService.getCategories();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-brand-ink-900 md:text-3xl">
          Categories
        </h1>
        <p className="text-sm text-brand-muted-600">
          Manage package categories and the order they appear in.
        </p>
      </div>

      {result.success ? (
        <CategoryManager categories={result.data} />
      ) : (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5">
          <p className="text-sm font-medium text-red-700">{result.error}</p>
        </div>
      )}
    </div>
  );
}
