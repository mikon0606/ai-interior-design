"use client";

import { PhotoUpload } from "@/components/PhotoUpload";
import { TaskCompletedView } from "@/components/TaskCompletedView";
import { compressImageFile } from "@/lib/client-image";
import type { Task } from "@/lib/task-types";
import { PROMPT_PLACEHOLDER } from "@/lib/task-types";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type FieldErrors = {
  prompt?: string;
  submit?: string;
};

type SubmitTaskFormProps = {
  userEmail?: string;
};

const POLL_INTERVAL_MS = 4000;

export function SubmitTaskForm({ userEmail }: SubmitTaskFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submittedTask, setSubmittedTask] = useState<Task | null>(null);

  const handleFileChange = useCallback(
    (newFile: File | null, url: string | null) => {
      if (previewUrl && previewUrl !== url) URL.revokeObjectURL(previewUrl);
      setFile(newFile);
      setPreviewUrl(url);
    },
    [previewUrl],
  );

  const handleSubmit = async () => {
    const errors: FieldErrors = {};

    if (!prompt.trim()) {
      errors.prompt = "请输入装修需求";
    }

    if (errors.prompt) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    setSubmittedTask(null);

    try {
      const formData = new FormData();
      formData.append("prompt", prompt.trim());
      if (file) {
        formData.append("image", await compressImageFile(file));
      }

      const res = await fetch("/api/tasks", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setFieldErrors({ submit: data.error ?? "提交失败，请稍后重试" });
        return;
      }

      setSubmittedTask(data.task);
    } catch {
      setFieldErrors({ submit: "网络错误，请稍后重试" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchSubmittedTask = useCallback(async () => {
    if (!submittedTask || submittedTask.status === "completed") return;

    try {
      const res = await fetch("/api/tasks/" + submittedTask.task_number, {
        cache: "no-store",
      });
      if (!res.ok) return;

      const data = await res.json();
      setSubmittedTask(data.task);
    } catch {
      // 保持当前等待状态，下一轮继续尝试。
    }
  }, [submittedTask]);

  useEffect(() => {
    if (!submittedTask || submittedTask.status === "completed") return;

    fetchSubmittedTask();
    const timer = window.setInterval(fetchSubmittedTask, POLL_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [submittedTask, fetchSubmittedTask]);

  return (
    <section
      id="submit"
      className="scroll-mt-16 px-4 pb-10 pt-20 sm:px-6 sm:pb-16 sm:pt-24"
    >
      <div className="mx-auto max-w-5xl">
        {!userEmail ? (
          <div className="rounded-[20px] bg-white/80 p-6 text-center shadow-[0_24px_80px_rgba(24,24,22,0.07)] ring-1 ring-black/[0.04] backdrop-blur sm:p-8">
            <p className="text-sm font-medium text-[#6f7f62]">提交前先登录</p>
            <h1 className="mx-auto mt-3 max-w-xl text-2xl font-semibold tracking-tight text-[#181816] sm:text-3xl">
              登录后提交任务，之后随时回到我的任务查看进度和效果图
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-neutral-500 sm:text-base">
              这样客户离开等待页面后，再次登录也能看到之前提交的任务和后台回传的结果。
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                href="/login?next=/"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[#181816] px-7 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(24,24,22,0.14)] transition hover:bg-[#2b2b28]"
              >
                登录 / 注册
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-[20px] bg-white/80 p-3 shadow-[0_24px_80px_rgba(24,24,22,0.07)] ring-1 ring-black/[0.04] backdrop-blur sm:p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-1 text-sm text-neutral-500">
              <span>当前账号：{userEmail}</span>
              <Link href="/my/tasks" className="font-medium text-[#6f7f62] transition hover:text-[#181816]">
                查看我的任务
              </Link>
            </div>
            <div className="grid gap-3 lg:grid-cols-[1.05fr_0.95fr]">
              <PhotoUpload
                file={file}
                previewUrl={previewUrl}
                onFileChange={handleFileChange}
              />

              <div className="flex flex-col">
                <label
                  htmlFor="prompt"
                  className="mb-3 block text-sm font-medium text-[#181816]"
                >
                  设计需求
                </label>
                <textarea
                  id="prompt"
                  rows={10}
                  value={prompt}
                  onChange={(e) => {
                    setPrompt(e.target.value);
                    if (e.target.value.trim()) {
                      setFieldErrors((prev) => ({
                        ...prev,
                        prompt: undefined,
                      }));
                    }
                  }}
                  placeholder={PROMPT_PLACEHOLDER}
                  aria-invalid={Boolean(fieldErrors.prompt)}
                  className={
                    "min-h-[260px] flex-1 resize-y rounded-2xl border px-4 py-4 text-sm leading-relaxed text-[#181816] placeholder:text-neutral-400 focus:outline-none focus:ring-2 sm:min-h-[360px] sm:text-base " +
                    (fieldErrors.prompt
                      ? "border-red-400 bg-red-50 ring-red-100 focus:border-red-400 focus:ring-red-100"
                      : "border-black/[0.06] bg-[#fbfbf8] focus:border-[#7a8a6a] focus:bg-white focus:ring-[#dce5d3]")
                  }
                />
                {fieldErrors.prompt && (
                  <p className="mt-2 text-sm text-red-600" role="alert">
                    {fieldErrors.prompt}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className={
                "mt-3 flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl text-sm font-semibold transition-all sm:h-14 " +
                (isSubmitting
                  ? "cursor-wait bg-neutral-200 text-neutral-500"
                  : "bg-[#181816] text-white shadow-[0_14px_32px_rgba(24,24,22,0.16)] hover:bg-[#2b2b28] active:scale-[0.99]")
              }
            >
              {isSubmitting && (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-400 border-t-white" />
              )}
              {isSubmitting ? "提交中…" : "提交任务"}
            </button>
            {fieldErrors.submit && (
              <p className="mt-3 text-center text-sm text-red-600" role="alert">
                {fieldErrors.submit}
              </p>
            )}
            {submittedTask &&
              (submittedTask.status === "completed" &&
              submittedTask.result_image ? (
                <div className="mt-4">
                  <TaskCompletedView task={submittedTask} />
                </div>
              ) : (
                <InlineWaitingIndicator task={submittedTask} />
              ))}
          </div>
        )}
      </div>
    </section>
  );
}

function InlineWaitingIndicator({ task }: { task: Task }) {
  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm text-neutral-500">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-[#181816]" />
      <span>已提交，等待处理中 · {task.task_number}</span>
      <Link
        href={"/task/" + task.task_number}
        className="font-medium text-[#6f7f62] transition hover:text-[#181816]"
      >
        打开任务页
      </Link>
      <Link
        href="/my/tasks"
        className="font-medium text-[#6f7f62] transition hover:text-[#181816]"
      >
        我的任务
      </Link>
    </div>
  );
}
