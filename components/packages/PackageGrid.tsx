import PackageCard from "@/components/PackageCard";
import type { CatalogPackage } from "@/services/catalog-service";

/** A responsive grid of package cards. Plain server markup, no client script. */
export default function PackageGrid({
  packages,
}: Readonly<{ packages: CatalogPackage[] }>) {
  return (
    <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {packages.map((item) => (
        <li key={item.id} className="flex">
          <div className="w-full">
            <PackageCard item={item} />
          </div>
        </li>
      ))}
    </ul>
  );
}
