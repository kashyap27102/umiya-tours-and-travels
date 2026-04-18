import Link from "next/link";
import { Button, Card, CardBody, CardTitle } from "@/components/ui";

export default function AdminPage() {
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

        <div className="grid gap-4 md:grid-cols-2">
          <Card variant="default" padding="md" className="space-y-3">
            <CardTitle className="text-lg">All Packages</CardTitle>
            <CardBody className="text-sm">
              Review all pre-defined travel packages in one place.
            </CardBody>
            <Button asChild variant="outline" size="md" className="w-fit">
              <Link href="/admin/all-packages">Open All Packages</Link>
            </Button>
          </Card>

          <Card variant="default" padding="md" className="space-y-3">
            <CardTitle className="text-lg">Create Client Package</CardTitle>
            <CardBody className="text-sm">
              Build a custom day-wise package and save it for quick reference.
            </CardBody>
            <Button asChild variant="solid" size="md" className="w-fit">
              <Link href="/admin/create-client-package">Open Create Form</Link>
            </Button>
          </Card>
        </div>
      </Card>
    </div>
  );
}
