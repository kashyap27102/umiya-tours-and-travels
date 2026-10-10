import { NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import { MediaService } from "@/services/media-service";

/** One image plus where it is used (for the detail view). */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const [item, usage] = await Promise.all([
    MediaService.getById(id),
    MediaService.getUsage(id),
  ]);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ item, usage });
}
