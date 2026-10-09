"use client";

import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Badge, Switch } from "@/components/ui";
import { setPackageStatus } from "@/lib/actions/package-actions";
import { notify } from "@/lib/notifications";
import {
  PACKAGE_STATUS_BADGE,
  PACKAGE_STATUS_LABEL,
} from "@/lib/package-status";
import type { PackageStatus } from "@/lib/packages-constants";

interface PackageStatusSwitchProps {
  packageId: string;
  packageName: string;
  status: PackageStatus;
}

export default function PackageStatusSwitch({
  packageId,
  packageName,
  status,
}: Readonly<PackageStatusSwitchProps>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [shownStatus, setShownStatus] = useOptimistic(status);

  // Drafts can't be switched on here: publishing runs the full checks, which
  // happen in the edit form.
  if (status === "draft") {
    return (
      <Badge
        variant={PACKAGE_STATUS_BADGE.draft}
        size="sm"
        title="Open the package and set its status to Active to publish"
      >
        {PACKAGE_STATUS_LABEL.draft}
      </Badge>
    );
  }

  const isActive = shownStatus === "active";

  function handleChange(checked: boolean) {
    const next = checked ? "active" : "inactive";
    startTransition(async () => {
      setShownStatus(next);
      const result = await setPackageStatus(packageId, next);
      if (result.success) {
        notify.success(
          `"${packageName}" is now ${PACKAGE_STATUS_LABEL[next].toLowerCase()}`,
        );
      } else {
        notify.error("Could not change status", result.error);
      }
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={isActive}
        onCheckedChange={handleChange}
        disabled={isPending}
        aria-label={`${isActive ? "Deactivate" : "Activate"} ${packageName}`}
      />
      <span
        className={
          isActive
            ? "text-xs font-medium text-brand-green-700"
            : "text-xs font-medium text-brand-muted-600"
        }
      >
        {PACKAGE_STATUS_LABEL[isActive ? "active" : "inactive"]}
      </span>
    </div>
  );
}
