import CreatePackageClient from "./create-client";
import { TaxonomyService } from "@/services";

export default async function CreatePackagePage() {
  const [destinations, categories, inclusions] = await Promise.all([
    TaxonomyService.getDestinations(),
    TaxonomyService.getCategories(),
    TaxonomyService.getInclusions(),
  ]);

  return (
    <CreatePackageClient
      destinations={destinations.success ? destinations.data : []}
      categories={categories.success ? categories.data : []}
      inclusions={
        inclusions.success
          ? inclusions.data.map(({ id, text }) => ({ id, text }))
          : []
      }
    />
  );
}
