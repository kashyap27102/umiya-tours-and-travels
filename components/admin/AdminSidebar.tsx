"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Boxes,
  PackagePlus,
  SlidersHorizontal,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { AlertDialog } from "@/components/ui/AlertDialog";
import { cn } from "@/components/ui";
import { logoutAction } from "@/app/login/actions";

const ADMIN_NAV_ITEMS = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/package-management",
    label: "Packages",
    icon: Boxes,
  },
  {
    href: "/admin/create-client-package",
    label: "Create Package",
    icon: PackagePlus,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: SlidersHorizontal,
  },
] as const;

interface AdminSidebarProps {
  onNavClick?: () => void;
}

export default function AdminSidebar({ onNavClick }: AdminSidebarProps) {
  const pathname = usePathname();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleLogoutConfirm() {
    startTransition(async () => {
      await logoutAction();
    });
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-brand-blue-900 text-brand-cream-100">
      <div className="border-b border-white/10 px-5 py-5">
        <BrandLogo size="sm" className="h-14 w-auto" variant="white" />
      </div>

      <nav
        aria-label="Admin navigation"
        className="mt-4 flex flex-col gap-0.5 px-3"
      >
        {ADMIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-white/10 text-brand-cream-100"
                  : "text-brand-cream-100/60 hover:bg-white/6 hover:text-brand-cream-100/90",
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-brand-lime-400" />
              )}
              <Icon
                size={17}
                className={cn(
                  "shrink-0 transition-colors",
                  isActive
                    ? "text-brand-lime-400"
                    : "text-brand-cream-100/45 group-hover:text-brand-cream-100/70",
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/10 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-lime-400/15 text-brand-lime-400">
            <ShieldCheck size={15} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-brand-cream-100/80">
              Admin
            </p>
            <p className="truncate text-[11px] text-brand-cream-100/40">
              Umiya Tours and Travels
            </p>
          </div>
          <button
            type="button"
            title="Sign out"
            onClick={() => setShowLogoutDialog(true)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-brand-cream-100/35 transition-colors hover:bg-white/8 hover:text-brand-cream-100/70"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>

      <AlertDialog
        open={showLogoutDialog}
        variant="warning"
        title="Sign out?"
        description="You'll be returned to the login page. Any unsaved changes will be lost."
        confirmLabel="Sign out"
        cancelLabel="Stay"
        isLoading={isPending}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutDialog(false)}
      />
    </div>
  );
}
