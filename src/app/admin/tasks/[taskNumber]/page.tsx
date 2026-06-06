import { AdminTaskDetail } from "@/app/admin/tasks/[taskNumber]/AdminTaskDetail";
import { getTaskByNumber } from "@/lib/tasks";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ taskNumber: string }>;
};

export const dynamic = "force-dynamic";

export default async function AdminTaskPage({ params }: PageProps) {
  const { taskNumber } = await params;
  const task = await getTaskByNumber(taskNumber);

  if (!task) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <header className="border-b border-white/[0.06] bg-[#050505]/90">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:h-16 sm:px-6">
          <Link
            href="/admin"
            className="text-sm text-zinc-400 transition hover:text-white"
          >
            ← 返回任务列表
          </Link>
          <Link
            href={`/task/${task.task_number}`}
            className="text-sm text-violet-400 transition hover:text-violet-300"
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
