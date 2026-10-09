import { NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import { SafeFetchError, downloadImage } from "@/lib/safe-image-fetch";

/**
 * Shows an image from a pasted link before it is saved. The page's security
 * policy blocks images loaded straight from other websites, so the server
 * downloads it (with the same safety checks as saving) and passes it on.
 */
export async function GET(request: Request) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url).searchParams.get("url") ?? "";
  try {
    const { bytes, contentType } = await downloadImage(url);
    return new Response(new Uint8Array(bytes), {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(bytes.length),
        "Cache-Control": "private, max-age=300",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; sandbox",
      },
    });
  } catch (error) {
    if (error instanceof SafeFetchError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Image preview failed:", error);
    return NextResponse.json(
      { error: "Could not load that link." },
      { status: 502 },
    );
  }
}
