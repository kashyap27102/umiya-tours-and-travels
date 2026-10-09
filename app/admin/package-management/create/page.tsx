import CreatePackageClient from "./create-client";
import { TaxonomyService } from "@/services";

export default async function CreatePackagePage() {
  const [destinations, categories] = await Promise.all([
    TaxonomyService.getDestinations(),
    TaxonomyService.getCategories(),
  ]);

  return (
    <CreatePackageClient
      destinations={destinations.success ? destinations.data : []}
      categories={categories.success ? categories.data : []}
    />
  );
}
