import { getAdminClaims } from "@/lib/admin-auth";
import { uploadTaskResult } from "@/lib/tasks";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ taskNumber: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const claims = await getAdminClaims();

  if (!claims) {
    return NextResponse.json({ error: "请先登录后台" }, { status: 401 });
  }

  const { taskNumber } = await context.params;

  try {
    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File) || image.size === 0) {
      return NextResponse.json(
        { error: "请上传效果图" },
        { status: 400 },
      );
    }

    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "请上传有效的图片文件" },
        { status: 400 },
      );
    }

    const task = await uploadTaskResult(taskNumber, image);

    if (!task) {
      return NextResponse.json({ error: "任务不存在" }, { status: 404 });
    }

    return NextResponse.json({ task });
  } catch (error) {
    console.error("Upload result error:", error);
    return NextResponse.json({ error: "上传失败" }, { status: 500 });
  }
}
