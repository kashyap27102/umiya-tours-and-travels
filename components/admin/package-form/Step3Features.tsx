"use client";

import { Star, CheckCircle, XCircle } from "lucide-react";
import { Card } from "@/components/ui";
import { EditableList } from "./EditableList";
import type { UsePackageFormReturn } from "@/hooks/usePackageForm";

interface Props {
  hook: UsePackageFormReturn;
}

export function Step3Features({ hook }: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card variant="elevated" padding="lg">
        <EditableList
          label="Highlights"
          fieldName="highlights"
          hook={hook}
          icon={<Star className="h-4 w-4" />}
        />
      </Card>
      <Card variant="elevated" padding="lg">
        <EditableList
          label="Inclusions"
          fieldName="inclusions"
          hook={hook}
          icon={<CheckCircle className="h-4 w-4" />}
        />
      </Card>
      <Card variant="elevated" padding="lg">
        <EditableList
          label="Exclusions"
          fieldName="exclusions"
          hook={hook}
          icon={<XCircle className="h-4 w-4" />}
        />
      </Card>
    </div>
  );
}
