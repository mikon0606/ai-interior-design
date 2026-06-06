import { getTaskByNumber, updateTaskStatus } from "@/lib/tasks";
import { TASK_STATUSES, type TaskStatus } from "@/lib/task-types";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ taskNumber: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { taskNumber } = await context.params;
  const task = await getTaskByNumber(taskNumber);

  if (!task) {
    return NextResponse.json({ error: "任务不存在" }, { status: 404 });
  }

  return NextResponse.json({ task });
}

export async function PATCH(request: Request, context: RouteContext) {
  const { taskNumber } = await context.params;

  try {
    const body = await request.json();
    const status = body.status as TaskStatus;

    if (!TASK_STATUSES.includes(status)) {
      return NextResponse.json({ error: "无效的状态" }, { status: 400 });
    }

    const task = await updateTaskStatus(taskNumber, status);

    if (!task) {
      return NextResponse.json({ error: "任务不存在" }, { status: 404 });
    }

    return NextResponse.json({ task });
  } catch (error) {
    console.error("Update task error:", error);
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}
