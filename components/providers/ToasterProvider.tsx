"use client";

import { Toaster } from "sonner";

export function ToasterProvider() {
  return (
    <Toaster
      theme="light"
      position="top-right"
      toastOptions={{
        style: {
          fontFamily: "inherit",
          fontSize: "14px",
          borderRadius: "12px",
          padding: "12px 16px",
          boxShadow: "0 4px 12px rgba(31, 79, 147, 0.15)",
          border: "1px solid",
        },
      }}
    />
  );
}
