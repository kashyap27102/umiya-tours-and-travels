import Link from "next/link";
import { Pencil } from "lucide-react";
import {
  Badge,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from "@/components/ui";
import type { PackageWithItinerary } from "@/types/package";

interface AdminPackageTableProps {
  packages: PackageWithItinerary[];
  startIndex: number;
}

export default function AdminPackageTable({
  packages,
  startIndex,
}: Readonly<AdminPackageTableProps>) {
  if (packages.length === 0) {
    return (
      <div className="rounded-2xl border border-brand-mist-200 bg-white py-16 text-center">
        <p className="text-sm text-brand-muted-600">
          No packages match your filters.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader className="w-10">#</TableHeader>
          <TableHeader>Name</TableHeader>
          <TableHeader>Destination</TableHeader>
          <TableHeader>Category</TableHeader>
          <TableHeader>Status</TableHeader>
          <TableHeader>Duration</TableHeader>
          <TableHeader>Price</TableHeader>
          <TableHeader className="text-right">Actions</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {packages.map((pkg, index) => (
          <TableRow key={pkg.id} className="hover:bg-brand-mist-200/30">
            <TableCell className="text-brand-muted-600 text-xs">
              {startIndex + index + 1}
            </TableCell>
            <TableCell>
              <span
                className="block max-w-50 truncate font-medium"
                title={pkg.name}
              >
                {pkg.name}
              </span>
            </TableCell>
            <TableCell className="text-brand-muted-600">
              {pkg.destination}
            </TableCell>
            <TableCell>
              <Badge variant="brand" size="sm">
                {pkg.category}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant={pkg.status === "active" ? "success" : "outline"}
                size="sm"
              >
                {pkg.status === "active" ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell className="whitespace-nowrap text-brand-muted-600">
              {pkg.durationDays}D / {pkg.durationNights}N
            </TableCell>
            <TableCell className="whitespace-nowrap font-medium">
              ₹{pkg.pricePerPerson.toLocaleString("en-IN")}
            </TableCell>
            <TableCell className="text-right">
              <Link href={`/admin/package-management/${pkg.slug}/edit`}>
                <Button variant="outline" size="sm" title="Edit package">
                  <Pencil className="h-4 w-4" />
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
