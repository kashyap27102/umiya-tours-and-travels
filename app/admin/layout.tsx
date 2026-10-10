import type { Metadata } from "next";
import type { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminMobileHeader from "@/components/admin/AdminMobileHeader";
import { createMetadata } from "@/lib/metadata";
import { EnquiryService } from "@/services/enquiry-service";

export const metadata: Metadata = createMetadata({
  title: "Admin Dashboard",
  description: "Umiya Tours & Travels admin dashboard.",
  path: "/admin",
  noIndex: true,
});

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // The badge is a convenience; never break the admin if the count fails.
  const newEnquiries = await EnquiryService.countNew().catch(() => 0);

  return (
    <section className="w-full bg-[#f2f6ef]">
      <AdminMobileHeader newEnquiries={newEnquiries} />
      <div className="grid min-h-dvh lg:grid-cols-[290px_1fr]">
        <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-dvh">
          <AdminSidebar newEnquiries={newEnquiries} />
        </aside>
        <main className="px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </section>
  );
}
