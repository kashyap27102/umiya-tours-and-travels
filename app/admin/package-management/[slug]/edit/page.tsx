import { PackageService } from "@/services";
import { notFound } from "next/navigation";
import EditPackageClient from "./edit-client";

export default async function EditPackagePage({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;

  const response = await PackageService.getPackageBySlug(slug);

  if (!response.success || !response.data) {
    notFound();
  }

  return <EditPackageClient package={response.data} />;
}
