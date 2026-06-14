import { getAdminClaims } from "@/lib/admin-auth";
import { listTasks } from "@/lib/tasks";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const claims = await getAdminClaims();

  if (!claims) {
    return NextResponse.json({ error: "请先登录后台" }, { status: 401 });
  }

  const tasks = await listTasks();
  return NextResponse.json({ tasks });
}
