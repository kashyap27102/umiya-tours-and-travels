"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import { cn } from "@/components/ui";

const ADMIN_NAV_ITEMS = [
  {
    href: "/admin",
    label: "Dashboard",
    description: "Overview and quick actions",
  },
  {
    href: "/admin/all-packages",
    label: "All Packages",
    description: "View all published packages",
  },
  {
    href: "/admin/create-client-package",
    label: "Create Client Package",
    description: "Build a custom package form",
  },
] as const;

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full min-h-dvh flex-col bg-brand-blue-900 text-brand-cream-100">
      <div className="border-b border-white/15 px-5 py-5">
        <BrandLogo size="sm" className="h-14 w-auto" variant="white" />
      </div>

      <div className="px-5 pt-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-cream-100/55">
          Navigation
        </p>
      </div>

      <nav
        aria-label="Admin navigation"
        className="mt-3 flex flex-col gap-1 px-3"
      >
        {ADMIN_NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group rounded-xl border px-3 py-3 transition-all",
                isActive
                  ? "border-brand-lime-400/70 bg-brand-blue-700/80 shadow-[inset_0_0_0_1px_rgb(255_255_255/10%)]"
                  : "border-transparent text-brand-cream-100/90 hover:border-white/15 hover:bg-white/6",
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-block h-1.5 w-1.5 rounded-full transition-colors",
                    isActive
                      ? "bg-brand-lime-400"
                      : "bg-brand-cream-100/45 group-hover:bg-brand-cream-100/70",
                  )}
                />
                <h3 className="text-sm font-semibold">{item.label}</h3>
              </div>
              <p
                className={cn(
                  "mt-1 pl-3.5 text-xs",
                  isActive
                    ? "text-brand-cream-100/85"
                    : "text-brand-cream-100/60",
                )}
              >
                {item.description}
              </p>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/15 px-5 py-4 text-xs text-brand-cream-100/65">
        Umiya Tours Admin Workspace
      </div>
    </div>
  );
}
