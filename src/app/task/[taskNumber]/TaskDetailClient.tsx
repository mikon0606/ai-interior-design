"use client";

import { TaskCompletedView } from "@/components/TaskCompletedView";
import { TaskStatusBadge } from "@/components/TaskStatusBadge";
import { TaskWaitingView } from "@/components/TaskWaitingView";
import type { Task } from "@/lib/task-types";
import { useCallback, useEffect, useState } from "react";

interface TaskDetailClientProps {
  initialTask: Task;
}

const POLL_INTERVAL_MS = 5000;

export function TaskDetailClient({ initialTask }: TaskDetailClientProps) {
  const [task, setTask] = useState<Task>(initialTask);

  const fetchTask = useCallback(async () => {
    try {
      const res = await fetch(`/api/tasks/${task.task_number}`, {
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = await res.json();
      setTask(data.task);
    } catch {
      // ignore polling errors
    }
  }, [task.task_number]);

  useEffect(() => {
    setTask(initialTask);
  }, [initialTask]);

  useEffect(() => {
    if (task.status === "completed") return;

    fetchTask();
    const timer = setInterval(fetchTask, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [task.status, fetchTask]);

  const isWaiting =
    task.status === "pending" || task.status === "processing";

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <span className="text-sm text-zinc-500">任务状态</span>
        <TaskStatusBadge status={task.status} />
      </div>

      {isWaiting && <TaskWaitingView />}

      {task.status === "completed" && task.result_image && (
        <TaskCompletedView task={task} />
      )}

      {task.status === "completed" && !task.result_image && (
        <div className="rounded-2xl bg-amber-50 p-6 text-center text-sm text-amber-800 ring-1 ring-amber-200">
          任务已标记完成，效果图正在准备中，请稍后刷新页面
        </div>
      )}
    </>
  );
}
