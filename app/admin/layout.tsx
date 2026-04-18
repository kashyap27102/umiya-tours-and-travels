import type { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <section className="w-full bg-[#f2f6ef]">
      <div className="grid min-h-dvh lg:grid-cols-[290px_1fr]">
        <aside className="lg:sticky lg:top-0 lg:h-dvh">
          <AdminSidebar />
        </aside>
        <main className="px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </section>
  );
}
