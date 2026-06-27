"use client";

import { ImagePreviewDialog } from "@/components/ImagePreviewDialog";
import { TaskStatusBadge } from "@/components/TaskStatusBadge";
import { compressImageFile } from "@/lib/client-image";
import {
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  type Task,
  type TaskStatus,
} from "@/lib/task-types";
import { formatDateTime } from "@/lib/format";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminTaskDetail({ initialTask }: { initialTask: Task }) {
  const router = useRouter();
  const [task, setTask] = useState(initialTask);
  const [status, setStatus] = useState<TaskStatus>(initialTask.status);
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [isSavingInputImage, setIsSavingInputImage] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [hasCopiedPrompt, setHasCopiedPrompt] = useState(false);
  const [hasCopiedBrief, setHasCopiedBrief] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const buildGenerationBrief = () => {
    const inputImageLine = task.input_image
      ? `参考原图链接：${task.input_image}`
      : "参考原图：用户未上传图片，仅根据文字需求生成概念图";

    return [
      "请根据下面信息生成一张室内设计客户提案效果图。",
      "",
      `任务编号：${task.task_number}`,
      inputImageLine,
      "",
      "客户需求：",
      task.prompt,
      "",
      "生成要求：",
      "1. 尽量保留原房间/户型的主要结构和视角，不凭空改变空间关系。",
      "2. 按客户需求生成室内设计客户提案效果图，风格清晰、适合沟通方案。",
      "3. 输出尽量真实、干净、有设计感，避免文字、水印、夸张变形。",
      "4. 如原图信息不足，优先生成可沟通的概念效果图。",
    ].join("\n");
  };

  const handlePromptCopy = async () => {
    setError(null);

    try {
      await navigator.clipboard.writeText(task.prompt);
      setHasCopiedPrompt(true);
      window.setTimeout(() => setHasCopiedPrompt(false), 1600);
    } catch {
      setError("复制失败，请手动选择文字复制");
    }
  };

  const saveStatus = async (
    nextStatus: TaskStatus,
    successMessage = "状态已更新",
  ) => {
    setIsSavingStatus(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/tasks/${task.task_number}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "更新失败");
        return;
      }

      setTask(data.task);
      setStatus(data.task.status);
      setMessage(successMessage);
      router.refresh();
    } catch {
      setError("网络错误");
    } finally {
      setIsSavingStatus(false);
    }
  };

  const handleStatusSave = async () => {
    await saveStatus(status);
  };

  const handleProcessingStart = async () => {
    if (task.status === "completed") {
      setError("已完成任务不建议重新标记为处理中");
      return;
    }

    await saveStatus("processing", "已标记为处理中，可以开始生成效果图");
  };

  const handleBriefCopy = async () => {
    setError(null);

    try {
      await navigator.clipboard.writeText(buildGenerationBrief());
      setHasCopiedBrief(true);
      window.setTimeout(() => setHasCopiedBrief(false), 1600);
    } catch {
      setError("复制失败，请手动选择文字复制");
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
      const uploadFile = await compressImageFile(file);
      const formData = new FormData();
      formData.append("image", uploadFile);

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
          <p className="text-sm text-neutral-500">任务编号</p>
          <h1 className="mt-1 font-mono text-2xl font-semibold">
            {task.task_number}
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            提交于 {formatDateTime(task.created_at)}
          </p>
        </div>
        <TaskStatusBadge status={task.status} />
      </div>

      <div className="rounded-[20px] bg-[#181816] p-5 text-white shadow-[0_18px_60px_rgba(24,24,22,0.12)] sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm text-white/60">处理工作台</p>
            <h2 className="mt-1 text-lg font-medium">
              取原图和需求，生成后回传结果
            </h2>
            <div className="mt-4 grid gap-2 text-sm text-white/72 sm:grid-cols-2">
              <p>1. 标记处理中</p>
              <p>2. 保存原图</p>
              <p>3. 复制完整生图包</p>
              <p>4. 上传效果图完成任务</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            <button
              type="button"
              onClick={handleProcessingStart}
              disabled={
                isSavingStatus ||
                task.status === "processing" ||
                task.status === "completed"
              }
              className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-[#181816] transition hover:bg-[#efefe9] disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/45"
            >
              {task.status === "completed"
                ? "已完成"
                : task.status === "processing"
                  ? "已在处理中"
                  : "开始处理"}
            </button>
            <button
              type="button"
              onClick={handleBriefCopy}
              className="rounded-xl bg-[#eef3e9] px-4 py-2 text-sm font-medium text-[#273120] transition hover:bg-white"
            >
              {hasCopiedBrief ? "已复制生图包" : "复制生图包"}
            </button>
            {task.input_image && (
              <a
                href={task.input_image}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              >
                打开原图
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-[20px] bg-white/80 p-5 shadow-[0_18px_60px_rgba(24,24,22,0.06)] ring-1 ring-black/[0.04] sm:p-6">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-sm text-neutral-500">装修需求</p>
          <button
            type="button"
            onClick={handlePromptCopy}
            className="rounded-lg bg-[#181816] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#2b2b28]"
          >
            {hasCopiedPrompt ? "已复制" : "复制需求"}
          </button>
        </div>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">
          {task.prompt}
        </p>
      </div>

      <div>
        <div className="mb-3 flex max-w-2xl flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-neutral-600">原图</p>
          {task.input_image && (
            <button
              type="button"
              onClick={handleInputImageSave}
              disabled={isSavingInputImage}
              className="rounded-lg bg-[#181816] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#2b2b28] disabled:cursor-wait disabled:bg-neutral-200 disabled:text-neutral-500"
            >
              {isSavingInputImage ? "保存中…" : "保存原图"}
            </button>
          )}
        </div>
        <div className="relative aspect-video max-w-2xl overflow-hidden rounded-2xl bg-white ring-1 ring-black/[0.04]">
          {task.input_image ? (
            <ImagePreviewDialog
              src={task.input_image}
              alt="原图"
              label="客户上传原图"
              previewClassName="relative aspect-video w-full"
              imageClassName="object-contain"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm text-neutral-500">
              用户未上传图片，仅提交了文字需求
            </div>
          )}
        </div>
      </div>

      {task.result_image && (
        <div>
          <p className="mb-3 text-sm font-medium text-neutral-600">当前效果图</p>
          <div className="relative aspect-video max-w-2xl overflow-hidden rounded-2xl bg-white ring-1 ring-black/[0.04]">
            <ImagePreviewDialog
              src={task.result_image}
              alt="效果图"
              label="当前效果图"
              previewClassName="relative aspect-video w-full"
              imageClassName="object-contain"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>
        </div>
      )}

      <div className="rounded-[20px] bg-white/80 p-5 shadow-[0_18px_60px_rgba(24,24,22,0.06)] ring-1 ring-black/[0.04] sm:p-6">
        <h2 className="text-lg font-medium">修改状态</h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className="rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-sm text-[#181816] focus:border-[#7a8a6a] focus:outline-none"
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
            className="rounded-xl bg-[#181816] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#2b2b28] disabled:opacity-50"
          >
            {isSavingStatus ? "保存中…" : "保存状态"}
          </button>
        </div>
      </div>

      <div className="rounded-[20px] bg-white/80 p-5 shadow-[0_18px_60px_rgba(24,24,22,0.06)] ring-1 ring-black/[0.04] sm:p-6">
        <h2 className="text-lg font-medium">上传效果图</h2>
        <p className="mt-2 text-sm text-neutral-500">
          上传后将自动关联到此任务，并将状态设为「已完成」
        </p>
        <div className="mt-4 grid gap-2 rounded-2xl bg-[#fbfbf8] p-4 text-sm text-neutral-600 sm:grid-cols-2">
          <p>已保存或打开原图</p>
          <p>已复制完整生图包</p>
          <p>已在 ChatGPT 生成效果图</p>
          <p>确认结果图适合给客户查看</p>
        </div>
        <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-black/[0.12] bg-[#fbfbf8] px-6 py-10 transition hover:border-[#7a8a6a]/60 hover:bg-white">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={isUploading}
            onChange={handleResultUpload}
          />
          <span className="text-sm text-neutral-500">
            {isUploading ? "上传中…" : "点击选择效果图文件"}
          </span>
        </label>
      </div>

      {message && (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </p>
      )}
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
