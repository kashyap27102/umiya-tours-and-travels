import { PackageService, TaxonomyService } from "@/services";
import { notFound } from "next/navigation";
import EditPackageClient from "./edit-client";

export default async function EditPackagePage({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;

  const [response, destinations, categories, inclusions] = await Promise.all([
    PackageService.getPackageForEdit(slug),
    TaxonomyService.getDestinations(),
    TaxonomyService.getCategories(),
    TaxonomyService.getInclusions(),
  ]);

  if (!response.success) {
    notFound();
  }

  return (
    <EditPackageClient
      package={response.data}
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
