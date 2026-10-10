// Server-only: talks to Vercel Blob. Import this from route handlers / server
// actions / services, never from client components.
import { del, put } from "@vercel/blob";
import { isOurBlobUrl, type MediaMimeType } from "@/lib/media";

/** Saves image bytes to our public storage and returns the served URL. */
export async function storeImage(
  bytes: Buffer,
  fileName: string,
  contentType: MediaMimeType,
): Promise<string> {
  const blob = await put(fileName, bytes, {
    access: "public",
    addRandomSuffix: true,
    contentType,
  });
  return blob.url;
}

/** Deletes a stored file if (and only if) it lives in our storage. */
export async function removeStoredImage(url: string): Promise<void> {
  if (isOurBlobUrl(url)) await del(url);
}
