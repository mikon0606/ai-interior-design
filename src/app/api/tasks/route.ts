import { createTask } from "@/lib/tasks";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const prompt = formData.get("prompt");
    const image = formData.get("image");

    if (typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        { error: "请输入装修需求" },
        { status: 400 },
      );
    }

    const hasImage = image instanceof File && image.size > 0;

    if (hasImage && !image.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "请上传有效的图片文件" },
        { status: 400 },
      );
    }

    if (hasImage && image.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "图片大小不能超过 10MB" },
        { status: 400 },
      );
    }

    const task = await createTask(prompt, hasImage ? image : undefined);

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error("Create task error:", error);
    return NextResponse.json(
      { error: "提交失败，请稍后重试" },
      { status: 500 },
    );
  }
}
