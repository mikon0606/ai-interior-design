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
    <div className="overflow-hidden rounded-[20px] bg-white/80 shadow-[0_24px_80px_rgba(24,24,22,0.07)] ring-1 ring-black/[0.04] backdrop-blur">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-black/[0.06] bg-[#fbfbf8] text-neutral-500">
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
                  className="px-4 py-12 text-center text-neutral-500"
                >
                  暂无任务
                </td>
              </tr>
            ) : (
              initialTasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-b border-black/[0.04] transition hover:bg-[#fbfbf8]"
                >
                  <td className="px-4 py-3 font-mono text-[#181816]">
                    {task.task_number}
                  </td>
                  <td className="px-4 py-3">
                    {task.input_image ? (
                      <div className="relative h-14 w-20 overflow-hidden rounded-lg bg-[#f1f1ed]">
                        <Image
                          src={task.input_image}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    ) : (
                      <div className="flex h-14 w-20 items-center justify-center rounded-lg border border-black/[0.06] bg-[#fbfbf8] text-xs text-neutral-500">
                        无参考图
                      </div>
                    )}
                  </td>
                  <td className="max-w-[200px] px-4 py-3">
                    <p className="line-clamp-2 text-neutral-600">{task.prompt}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-500">
                    {formatDateTime(task.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <TaskStatusBadge status={task.status} />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/tasks/${task.task_number}`}
                      className="font-medium text-[#6f7f62] transition hover:text-[#181816]"
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

      <div className="border-t border-black/[0.06] px-4 py-3">
        <button
          type="button"
          onClick={() => router.refresh()}
          className="text-xs text-neutral-500 transition hover:text-[#181816]"
        >
          刷新列表
        </button>
      </div>
    </div>
  );
}
