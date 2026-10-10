"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * A search box backed by a URL parameter. Typing is instant; the URL (and so
 * the server query) only updates once typing pauses, replacing the history
 * entry so Back doesn't step through every search. The box also follows the
 * URL when it changes from outside (Back button, shared link).
 */
export function useUrlSearch(param = "search", delayMs = 350) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlValue = searchParams.get(param) ?? "";
  const [query, setQuery] = useState(urlValue);
  const lastPushed = useRef(urlValue);

  useEffect(() => {
    if (urlValue !== lastPushed.current) {
      lastPushed.current = urlValue;
      setQuery(urlValue);
    }
  }, [urlValue]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed === lastPushed.current.trim()) return;

    const timer = setTimeout(() => {
      lastPushed.current = trimmed;
      // Read the live URL so this can't overwrite a filter changed meanwhile.
      const params = new URLSearchParams(window.location.search);
      if (trimmed) params.set(param, trimmed);
      else params.delete(param);
      params.delete("page"); // a new search starts at page 1
      router.replace(`${pathname}?${params.toString()}`);
    }, delayMs);
    return () => clearTimeout(timer);
  }, [query, param, delayMs, pathname, router]);

  return [query, setQuery] as const;
}
