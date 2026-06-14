import { getAdminClaims } from "@/lib/admin-auth";
import { getAuthClaims } from "@/lib/auth";
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

  if (task.user_id) {
    const [claims, adminClaims] = await Promise.all([
      getAuthClaims(),
      getAdminClaims(),
    ]);

    if (claims?.sub !== task.user_id && !adminClaims) {
      return NextResponse.json({ error: "无权查看该任务" }, { status: 401 });
    }
  }

  return NextResponse.json({ task });
}
