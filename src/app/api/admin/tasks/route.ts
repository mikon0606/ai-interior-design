import { listTasks } from "@/lib/tasks";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const tasks = await listTasks();
  return NextResponse.json({ tasks });
}
