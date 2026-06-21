"use client";

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
        <EditableList label="Highlights" fieldName="highlights" hook={hook} />
      </Card>
      <Card variant="elevated" padding="lg">
        <EditableList label="Inclusions" fieldName="inclusions" hook={hook} />
      </Card>
      <Card variant="elevated" padding="lg">
        <EditableList label="Exclusions" fieldName="exclusions" hook={hook} />
      </Card>
    </div>
  );
}
