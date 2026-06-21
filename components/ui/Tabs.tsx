"use client";

import * as React from "react";
import { cn } from "./cn";

/* ── Context ──────────────────────────────────────────────────────────────── */

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("Tabs sub-components must be used inside <Tabs>");
  return ctx;
}

/* ── Tabs ─────────────────────────────────────────────────────────────────── */

export interface TabsProps {
  value: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({
  value,
  onValueChange,
  children,
  className,
}: Readonly<TabsProps>) {
  return (
    <TabsContext.Provider
      value={{ activeTab: value, setActiveTab: onValueChange ?? (() => {}) }}
    >
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

/* ── TabsList ─────────────────────────────────────────────────────────────── */

export interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div role="tablist" className={cn("flex items-center", className)}>
      {children}
    </div>
  );
}

/* ── TabsTrigger ──────────────────────────────────────────────────────────── */

export interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  /** When provided, overrides the default context-based navigation */
  onClick?: () => void;
  className?: string;
  stepNumber?: number;
  isCompleted?: boolean;
}

export function TabsTrigger({
  value,
  children,
  disabled,
  onClick,
  className,
  stepNumber,
  isCompleted,
}: Readonly<TabsTriggerProps>) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  const handleClick = () => {
    if (disabled) return;
    if (onClick) onClick();
    else setActiveTab(value);
  };

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      disabled={disabled && !isCompleted}
      onClick={handleClick}
      className={cn(
        "flex shrink-0 items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue-500",
        isActive
          ? "text-brand-blue-600"
          : isCompleted
            ? "cursor-pointer text-brand-muted-600 hover:text-brand-blue-600"
            : "cursor-default text-brand-muted-600/40",
        className,
      )}
    >
      {stepNumber !== undefined && (
        <span
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
            isActive
              ? "bg-brand-blue-500 text-white"
              : isCompleted
                ? "bg-brand-green-500 text-white"
                : "bg-brand-muted-600/15 text-brand-muted-600/50",
          )}
        >
          {isCompleted ? "✓" : stepNumber}
        </span>
      )}
      <span className="hidden sm:inline">{children}</span>
    </button>
  );
}

/* ── TabsConnector ────────────────────────────────────────────────────────── */

export function TabsConnector({ active }: { active?: boolean }) {
  return (
    <div
      className={cn(
        "h-px flex-1 transition-colors duration-300",
        active ? "bg-brand-blue-600/30" : "bg-brand-muted-600/15",
      )}
    />
  );
}

/* ── TabsContent ──────────────────────────────────────────────────────────── */

export interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsContent({
  value,
  children,
  className,
}: Readonly<TabsContentProps>) {
  const { activeTab } = useTabsContext();
  if (activeTab !== value) return null;
  return (
    <div role="tabpanel" className={className}>
      {children}
    </div>
  );
}
