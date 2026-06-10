import { getTaskByNumber } from "@/lib/tasks";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ taskNumber: string }>;
};

const CONTENT_TYPE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

function getImageExtension(contentType: string, imageUrl: string): string {
  const normalizedType = contentType.split(";")[0]?.trim().toLowerCase();
  if (normalizedType && CONTENT_TYPE_EXTENSIONS[normalizedType]) {
    return CONTENT_TYPE_EXTENSIONS[normalizedType];
  }

  try {
    const pathname = new URL(imageUrl).pathname;
    const match = pathname.match(/\.([a-z0-9]+)$/i);
    return match?.[1]?.toLowerCase() ?? "jpg";
  } catch {
    return "jpg";
  }
}

export async function GET(_request: Request, context: RouteContext) {
  const { taskNumber } = await context.params;
  const task = await getTaskByNumber(taskNumber);

  if (!task) {
    return NextResponse.json({ error: "任务不存在" }, { status: 404 });
  }

  if (!task.input_image) {
    return NextResponse.json({ error: "此任务没有上传原图" }, { status: 404 });
  }

  const imageResponse = await fetch(task.input_image);

  if (!imageResponse.ok || !imageResponse.body) {
    return NextResponse.json({ error: "原图读取失败" }, { status: 502 });
  }

  const contentType =
    imageResponse.headers.get("content-type") ?? "application/octet-stream";
  const extension = getImageExtension(contentType, task.input_image);

  return new Response(imageResponse.body, {
    headers: {
      "Content-Disposition": `attachment; filename="${task.task_number}-original.${extension}"`,
      "Content-Type": contentType,
      "Cache-Control": "no-store",
    },
  });
}
