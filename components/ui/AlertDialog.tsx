"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Info } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { Button } from "@/components/ui/Button";

type AlertDialogVariant = "danger" | "warning" | "default";

export interface AlertDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: AlertDialogVariant;
  isLoading?: boolean;
}

const variantConfig: Record<
  AlertDialogVariant,
  { icon: React.ReactNode; iconBg: string; confirmClass: string }
> = {
  danger: {
    icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
    iconBg: "bg-red-100",
    confirmClass:
      "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
    iconBg: "bg-yellow-100",
    confirmClass:
      "bg-yellow-600 text-white hover:bg-yellow-700 focus-visible:ring-yellow-500",
  },
  default: {
    icon: <Info className="h-5 w-5 text-brand-blue-700" />,
    iconBg: "bg-brand-mist-200",
    confirmClass:
      "bg-brand-blue-700 text-brand-cream-100 hover:bg-brand-blue-900 focus-visible:ring-brand-blue-700",
  },
};

function AlertDialogContent({
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
  isLoading = false,
}: Readonly<Omit<AlertDialogProps, "open">>) {
  const config = variantConfig[variant];

  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) onCancel();
    };
    globalThis.addEventListener("keydown", onKey);
    return () => globalThis.removeEventListener("keydown", onKey);
  }, [onCancel, isLoading]);

  const handleBackdropClick = isLoading ? undefined : onCancel;
  const handleBackdropKeyDown = isLoading
    ? undefined
    : (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") onCancel();
      };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="alert-dialog-title"
      aria-describedby={description ? "alert-dialog-description" : undefined}
    >
      <button
        type="button"
        tabIndex={isLoading ? -1 : 0}
        aria-label="Close dialog"
        className="fixed inset-0 bg-black/40 cursor-default"
        onClick={handleBackdropClick}
        onKeyDown={handleBackdropKeyDown}
      />

      <div className="relative w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden card-brand">
          {/* Body */}
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  " flex items-center justify-center w-10 h-10 rounded-full",
                  config.iconBg,
                )}
              >
                {config.icon}
              </div>

              <div className="flex-1 min-w-0 pt-1">
                <h3
                  id="alert-dialog-title"
                  className="text-base font-semibold text-brand-ink-900"
                >
                  {title}
                </h3>
                {description && (
                  <p
                    id="alert-dialog-description"
                    className="mt-1 text-sm text-brand-muted-600 leading-relaxed"
                  >
                    {description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/60">
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={isLoading}
            >
              {cancelLabel}
            </Button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-xs",
                "min-h-8 px-4 py-1 transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                "disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
                config.confirmClass,
              )}
            >
              {isLoading ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Processing...
                </>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AlertDialog({ open, ...props }: AlertDialogProps) {
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!open || !mounted) return null;

  return createPortal(<AlertDialogContent {...props} />, document.body);
}
