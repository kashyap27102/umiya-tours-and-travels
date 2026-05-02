import Link from "next/link";
import { Button, Card, CardBody, CardTitle } from "@/components/ui";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <Card variant="elevated" padding="lg" className="space-y-4">
        <div>
          <CardTitle className="text-2xl md:text-3xl">
            Admin Dashboard
          </CardTitle>
          <CardBody className="mt-2">
            Use the sidebar to navigate between package management sections.
          </CardBody>
        </div>
      </Card>
    </div>
  );
}
