import { NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import {
  DEFAULT_GALLERY_PAGE_SIZE,
  MEDIA_ALLOWED_TYPES,
  MEDIA_MAX_BYTES,
  fileExtension,
  sniffImageType,
  titleFromFileName,
} from "@/lib/media";
import { storeImage } from "@/lib/media-storage";
import { MediaService } from "@/services/media-service";

const MAX_FILES_PER_REQUEST = 10;
const ALLOWED = new Set<string>(MEDIA_ALLOWED_TYPES);

const toInt = (value: string | null, fallback: number) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.trunc(n) : fallback;
};

/** Search the library (used by the picker). */
export async function GET(request: Request) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = new URL(request.url).searchParams;
  const result = await MediaService.list({
    q: params.get("q") ?? undefined,
    tag: params.get("tag") ?? undefined,
    page: toInt(params.get("page"), 1),
    pageSize: toInt(params.get("pageSize"), DEFAULT_GALLERY_PAGE_SIZE),
  });
  return NextResponse.json(result);
}

/** Upload one or more image files into the library. */
export async function POST(request: Request) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Could not read the upload." },
      { status: 400 },
    );
  }

  const files = formData
    .getAll("file")
    .filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (files.length > MAX_FILES_PER_REQUEST) {
    return NextResponse.json(
      { error: `Upload at most ${MAX_FILES_PER_REQUEST} files at a time.` },
      { status: 400 },
    );
  }

  const created = [];
  const errors: { name: string; error: string }[] = [];

  for (const file of files) {
    try {
      if (!ALLOWED.has(file.type)) {
        errors.push({
          name: file.name,
          error: "Only JPG, PNG, WebP or AVIF images.",
        });
        continue;
      }
      if (file.size > MEDIA_MAX_BYTES) {
        errors.push({ name: file.name, error: "Larger than 5 MB." });
        continue;
      }

      const bytes = Buffer.from(await file.arrayBuffer());
      // Trust the file's real bytes, not the type the browser reported.
      const realType = sniffImageType(bytes);
      if (!realType) {
        errors.push({
          name: file.name,
          error: "That file is not a valid image.",
        });
        continue;
      }

      const title = titleFromFileName(file.name);
      const slug =
        title.replace(/[^a-z0-9]+/gi, "-").toLowerCase().replace(/^-|-$/g, "") ||
        "image";
      const url = await storeImage(
        bytes,
        `gallery/${slug}.${fileExtension(realType)}`,
        realType,
      );
      const row = await prismaClient.mediaImage.create({
        data: {
          url,
          title,
          alt: "",
          source: "uploaded",
          sizeBytes: bytes.length,
        },
      });
      const item = await MediaService.getById(row.id);
      if (item) created.push(item);
    } catch (error) {
      console.error("Image upload failed:", error);
      errors.push({
        name: file.name,
        error: "Upload failed. Please try again.",
      });
    }
  }

  return NextResponse.json(
    { created, errors },
    { status: created.length > 0 ? 200 : 400 },
  );
}
