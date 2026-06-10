"use client";

import { TaskStatusBadge } from "@/components/TaskStatusBadge";
import { formatDateTime } from "@/lib/format";
import type { Task } from "@/lib/task-types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AdminTasksTable({ initialTasks }: { initialTasks: Task[] }) {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02] text-zinc-500">
              <th className="px-4 py-3 font-medium">任务编号</th>
              <th className="px-4 py-3 font-medium">原图</th>
              <th className="px-4 py-3 font-medium">装修需求</th>
              <th className="px-4 py-3 font-medium">提交时间</th>
              <th className="px-4 py-3 font-medium">状态</th>
              <th className="px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {initialTasks.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-zinc-500"
                >
                  暂无任务
                </td>
              </tr>
            ) : (
              initialTasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-b border-white/[0.04] transition hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3 font-mono text-white">
                    {task.task_number}
                  </td>
                  <td className="px-4 py-3">
                    {task.input_image ? (
                      <div className="relative h-14 w-20 overflow-hidden rounded-lg bg-zinc-900">
                        <Image
                          src={task.input_image}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    ) : (
                      <div className="flex h-14 w-20 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-xs text-zinc-500">
                        无参考图
                      </div>
                    )}
                  </td>
                  <td className="max-w-[200px] px-4 py-3">
                    <p className="line-clamp-2 text-zinc-400">{task.prompt}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-zinc-400">
                    {formatDateTime(task.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <TaskStatusBadge status={task.status} />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/tasks/${task.task_number}`}
                      className="text-violet-400 transition hover:text-violet-300"
                    >
                      查看详情
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-white/[0.06] px-4 py-3">
        <button
          type="button"
          onClick={() => router.refresh()}
          className="text-xs text-zinc-500 transition hover:text-zinc-300"
        >
          刷新列表
        </button>
      </div>
    </div>
  );
}
