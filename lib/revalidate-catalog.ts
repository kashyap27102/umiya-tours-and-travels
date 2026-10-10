import { revalidatePath } from "next/cache";

/**
 * Refreshes every public page that lists packages. Call after anything that
 * changes what a package list shows: packages, destinations, categories.
 */
export function revalidateCatalog() {
  revalidatePath("/packages");
  revalidatePath("/destinations", "layout");
  revalidatePath("/categories", "layout");
  revalidatePath("/");
}
