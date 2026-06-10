"use client";

import { TaskStatusBadge } from "@/components/TaskStatusBadge";
import {
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  type Task,
  type TaskStatus,
} from "@/lib/task-types";
import { formatDateTime } from "@/lib/format";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminTaskDetail({ initialTask }: { initialTask: Task }) {
  const router = useRouter();
  const [task, setTask] = useState(initialTask);
  const [status, setStatus] = useState<TaskStatus>(initialTask.status);
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [isSavingInputImage, setIsSavingInputImage] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStatusSave = async () => {
    setIsSavingStatus(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/tasks/${task.task_number}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "更新失败");
        return;
      }

      setTask(data.task);
      setMessage("状态已更新");
      router.refresh();
    } catch {
      setError("网络错误");
    } finally {
      setIsSavingStatus(false);
    }
  };

  const handleInputImageSave = async () => {
    setIsSavingInputImage(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch(
        `/api/admin/tasks/${task.task_number}/input-image/download`,
      );

      if (!res.ok) {
        setError("原图保存失败");
        return;
      }

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = objectUrl;
      downloadLink.download = `${task.task_number}-原图`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      setError("原图保存失败");
    } finally {
      setIsSavingInputImage(false);
    }
  };

  const handleResultUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        `/api/admin/tasks/${task.task_number}/result`,
        { method: "POST", body: formData },
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "上传失败");
        return;
      }

      setTask(data.task);
      setStatus(data.task.status);
      setMessage("效果图已上传，任务已标记为已完成");
      router.refresh();
    } catch {
      setError("网络错误");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500">任务编号</p>
          <h1 className="mt-1 font-mono text-2xl font-semibold">
            {task.task_number}
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            提交于 {formatDateTime(task.created_at)}
          </p>
        </div>
        <TaskStatusBadge status={task.status} />
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6">
        <p className="mb-2 text-sm text-zinc-500">装修需求</p>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
          {task.prompt}
        </p>
      </div>

      <div>
        <div className="mb-3 flex max-w-2xl flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-zinc-400">原图</p>
          {task.input_image && (
            <button
              type="button"
              onClick={handleInputImageSave}
              disabled={isSavingInputImage}
              className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-wait disabled:bg-zinc-700 disabled:text-zinc-400"
            >
              {isSavingInputImage ? "保存中…" : "保存原图"}
            </button>
          )}
        </div>
        <div className="relative aspect-video max-w-2xl overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-900">
          {task.input_image ? (
            <Image
              src={task.input_image}
              alt="原图"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm text-zinc-500">
              用户未上传图片，仅提交了文字需求
            </div>
          )}
        </div>
      </div>

      {task.result_image && (
        <div>
          <p className="mb-3 text-sm font-medium text-zinc-400">当前效果图</p>
          <div className="relative aspect-video max-w-2xl overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-900">
            <Image
              src={task.result_image}
              alt="效果图"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6">
        <h2 className="text-lg font-medium">修改状态</h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-violet-500/50 focus:outline-none"
          >
            {TASK_STATUSES.map((s) => (
              <option key={s} value={s}>
                {TASK_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleStatusSave}
            disabled={isSavingStatus}
            className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:opacity-50"
          >
            {isSavingStatus ? "保存中…" : "保存状态"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6">
        <h2 className="text-lg font-medium">上传效果图</h2>
        <p className="mt-2 text-sm text-zinc-500">
          上传后将自动关联到此任务，并将状态设为「已完成」
        </p>
        <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-black/20 px-6 py-10 transition hover:border-violet-500/40 hover:bg-violet-500/5">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={isUploading}
            onChange={handleResultUpload}
          />
          <span className="text-sm text-zinc-400">
            {isUploading ? "上传中…" : "点击选择效果图文件"}
          </span>
        </label>
      </div>

      {message && (
        <p className="rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {message}
        </p>
      )}
      {error && (
        <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
