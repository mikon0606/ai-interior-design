import { AdminNewTaskWatcher } from "@/app/admin/AdminNewTaskWatcher";
import { AdminTaskDetail } from "@/app/admin/tasks/[taskNumber]/AdminTaskDetail";
import { getTaskByNumber, listTasks } from "@/lib/tasks";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ taskNumber: string }>;
};

export const dynamic = "force-dynamic";

export default async function AdminTaskPage({ params }: PageProps) {
  const { taskNumber } = await params;
  const [task, tasks] = await Promise.all([
    getTaskByNumber(taskNumber),
    listTasks(),
  ]);

  if (!task) {
    notFound();
  }

  const latestTaskNumber = tasks[0]?.task_number ?? null;

  return (
    <div className="min-h-screen bg-[#f7f7f3] text-[#181816]">
      <AdminNewTaskWatcher initialLatestTaskNumber={latestTaskNumber} />
      <header className="bg-[#f7f7f3]/90">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:h-16 sm:px-6">
          <Link
            href="/admin"
            className="text-sm text-neutral-500 transition hover:text-[#181816]"
          >
            ← 返回任务列表
          </Link>
          <Link
            href={`/task/${task.task_number}`}
            className="text-sm text-[#6f7f62] transition hover:text-[#181816]"
            target="_blank"
            rel="noopener noreferrer"
          >
            查看用户端
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <AdminTaskDetail initialTask={task} />
      </main>
    </div>
  );
}
