import * as React from "react";
import { cn } from "@/components/ui/cn";

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  showClose?: boolean;
}

const sizeClasses: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
};

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      onClose,
      title,
      children,
      footer,
      size = "md",
      className,
      showClose = true,
      ...props
    },
    ref,
  ) => {
    React.useEffect(() => {
      if (typeof window === "undefined") return;
      if (!open) return;
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }, [open]);

    React.useEffect(() => {
      if (!open) return;
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose?.();
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center p-4",
          className,
        )}
        role="dialog"
        aria-modal="true"
        {...props}
      >
        <div className="fixed inset-0 bg-black/40" onClick={onClose} />

        <div
          className={cn("relative w-full mx-auto", sizeClasses[size])}
          ref={ref}
        >
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {(title || showClose) && (
              <div className="flex items-start justify-between gap-4 p-6 border-b">
                <div className="text-lg font-semibold text-brand-ink-900">
                  {title}
                </div>
                {showClose ? (
                  <button
                    onClick={onClose}
                    aria-label="Close"
                    className="text-brand-muted-600 hover:text-brand-ink-900 text-2xl leading-none"
                  >
                    ×
                  </button>
                ) : null}
              </div>
            )}

            <div className="p-6 text-sm text-brand-muted-600">{children}</div>

            {footer ? (
              <div className="p-4 border-t bg-gray-50">{footer}</div>
            ) : null}
          </div>
        </div>
      </div>
    );
  },
);

Modal.displayName = "Modal";

export default Modal;
