"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import BrandLogo from "@/components/BrandLogo";

export default function AdminMobileHeader() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>
      {/* Mobile top bar — only visible below lg */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-white/10 bg-brand-blue-900 px-4 lg:hidden">
        <BrandLogo size="sm" className="h-9 w-auto" variant="white" />
        <button
          type="button"
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isOpen}
          aria-controls="admin-sidebar-drawer"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-brand-cream-100/70 transition-colors hover:bg-white/10 hover:text-brand-cream-100"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Backdrop — tap to close */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          tabIndex={-1}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-in drawer */}
      <div
        id="admin-sidebar-drawer"
        aria-hidden={!isOpen}
        className={[
          "fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <AdminSidebar onNavClick={() => setIsOpen(false)} />
      </div>
    </>
  );
}
