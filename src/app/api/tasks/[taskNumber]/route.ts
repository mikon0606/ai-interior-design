import { getTaskByNumber } from "@/lib/tasks";
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
