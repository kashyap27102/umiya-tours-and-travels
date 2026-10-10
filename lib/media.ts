export const MEDIA_ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;
export type MediaMimeType = (typeof MEDIA_ALLOWED_TYPES)[number];

export const MEDIA_MAX_BYTES = 5 * 1024 * 1024;
export const GALLERY_PAGE_SIZES = [24, 48, 96] as const;
export const DEFAULT_GALLERY_PAGE_SIZE = GALLERY_PAGE_SIZES[0];
export const MAX_TAGS = 10;
export const MAX_TAG_LENGTH = 30;

const BLOB_HOST_SUFFIX = ".public.blob.vercel-storage.com";

/**
 * Works out the real image type from the first bytes, so a file can't pass as
 * an image just by claiming a content type. Returns null if it isn't one of
 * the allowed formats.
 */
export function sniffImageType(bytes: Uint8Array): MediaMimeType | null {
  const startsWith = (sig: number[], offset = 0) =>
    sig.every((b, i) => bytes[offset + i] === b);
  const ascii = (offset: number, text: string) =>
    [...text].every((c, i) => bytes[offset + i] === c.charCodeAt(0));

  if (startsWith([0xff, 0xd8, 0xff])) return "image/jpeg";
  if (startsWith([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return "image/png";
  }
  if (ascii(0, "RIFF") && ascii(8, "WEBP")) return "image/webp";
  if (ascii(4, "ftyp") && (ascii(8, "avif") || ascii(8, "avis"))) {
    return "image/avif";
  }
  return null;
}

/** Lowercase, trimmed, de-duplicated tags, capped in number and length. */
export function normalizeTags(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  for (const raw of input) {
    if (typeof raw !== "string") continue;
    const tag = raw.trim().toLowerCase().replace(/\s+/g, " ").slice(0, MAX_TAG_LENGTH);
    if (tag) seen.add(tag);
  }
  return [...seen].slice(0, MAX_TAGS);
}

/** True when the URL is a file we stored (so we are allowed to delete it). */
export function isOurBlobUrl(url: string): boolean {
  try {
    const { protocol, hostname } = new URL(url);
    return protocol === "https:" && hostname.endsWith(BLOB_HOST_SUFFIX);
  } catch {
    return false;
  }
}

/** "Goa Beach 01.JPG" -> "Goa Beach 01" */
export function titleFromFileName(name: string): string {
  const base = name.replace(/\.[a-z0-9]{2,5}$/i, "").replace(/[_-]+/g, " ").trim();
  return (base || "Untitled image").slice(0, 120);
}

export function fileExtension(type: MediaMimeType): string {
  return { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" }[type];
}
