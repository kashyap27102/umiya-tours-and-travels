import type { PackageStatus } from "@/lib/packages-constants";

export const PACKAGE_STATUS_LABEL: Record<PackageStatus, string> = {
  draft: "Draft",
  active: "Active",
  inactive: "Inactive",
};

/** Badge variant (see components/ui/Badge) for each package status. */
export const PACKAGE_STATUS_BADGE: Record<
  PackageStatus,
  "accent" | "success" | "outline"
> = {
  draft: "accent",
  active: "success",
  inactive: "outline",
};
