import { TaskDetailClient } from "@/app/task/[taskNumber]/TaskDetailClient";
import { SiteHeader } from "@/components/SiteHeader";
import { getTaskByNumber } from "@/lib/tasks";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ taskNumber: string }>;
};

export const dynamic = "force-dynamic";

export default async function TaskPage({ params }: PageProps) {
  const { taskNumber } = await params;
  const task = await getTaskByNumber(taskNumber);

  if (!task) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#f6f6f3] text-[#181816]">
      <SiteHeader />
      <main className="px-4 pb-20 pt-20 sm:px-6 sm:pt-24">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/"
            className="mb-6 inline-flex text-sm text-neutral-500 transition hover:text-[#181816]"
          >
            ← 返回提交新任务
          </Link>

          <div className="mb-8">
            <p className="text-sm text-neutral-500">任务编号</p>
            <h1 className="mt-1 font-mono text-2xl font-semibold tracking-wide text-[#181816] sm:text-3xl">
              {task.task_number}
            </h1>
          </div>

          <div className="mb-8 rounded-2xl bg-white/82 p-5 shadow-[0_18px_60px_rgba(24,24,22,0.06)] ring-1 ring-black/[0.04] sm:p-6">
            <p className="text-sm text-neutral-500">装修需求</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-neutral-700 sm:text-base">
              {task.prompt}
            </p>
          </div>

          <TaskDetailClient initialTask={task} />
        </div>
      </main>
    </div>
  );
}
