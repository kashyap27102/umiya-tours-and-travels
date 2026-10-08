"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          display: "flex",
          minHeight: "100dvh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          textAlign: "center",
          backgroundColor: "#0f2f63",
          color: "#f6f4e8",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#9fc44a" }}>
          Umiya Tours &amp; Travels
        </p>
        <h1 style={{ marginTop: "0.75rem", fontSize: "1.5rem", fontWeight: 700 }}>
          Something went wrong
        </h1>
        <p
          style={{
            marginTop: "0.75rem",
            maxWidth: "28rem",
            fontSize: "0.875rem",
            opacity: 0.7,
          }}
        >
          Please try again, or call us directly if the problem continues.
        </p>
        <button
          onClick={() => unstable_retry()}
          style={{
            marginTop: "2rem",
            borderRadius: "0.75rem",
            backgroundColor: "#9fc44a",
            color: "#0f2f63",
            fontWeight: 600,
            fontSize: "0.875rem",
            padding: "0.75rem 2rem",
            border: "none",
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
