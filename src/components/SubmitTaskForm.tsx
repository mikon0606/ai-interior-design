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

type SubmitDraft = {
  prompt: string;
  image?: {
    dataUrl: string;
    name: string;
    type: string;
    lastModified: number;
  };
};

const POLL_INTERVAL_MS = 4000;
const DRAFT_STORAGE_KEY = "ai-interior-submit-draft";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("图片暂存失败"));
    reader.readAsDataURL(file);
  });
}

async function dataUrlToFile(
  dataUrl: string,
  name: string,
  type: string,
  lastModified: number,
) {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], name, { type, lastModified });
}

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

  useEffect(() => {
    let isMounted = true;

    async function restoreDraft() {
      const raw = window.sessionStorage.getItem(DRAFT_STORAGE_KEY);
      if (!raw) return;

      try {
        const draft = JSON.parse(raw) as SubmitDraft;
        if (!isMounted) return;

        setPrompt(draft.prompt ?? "");

        if (draft.image?.dataUrl) {
          const restoredFile = await dataUrlToFile(
            draft.image.dataUrl,
            draft.image.name,
            draft.image.type,
            draft.image.lastModified,
          );
          if (!isMounted) return;
          const url = URL.createObjectURL(restoredFile);
          setFile(restoredFile);
          setPreviewUrl(url);
        }

        window.sessionStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {
        window.sessionStorage.removeItem(DRAFT_STORAGE_KEY);
      }
    }

    restoreDraft();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const redirectToLoginWithDraft = async () => {
    setIsSubmitting(true);

    try {
      const draft: SubmitDraft = { prompt: prompt.trim() };

      if (file) {
        const compressedFile = await compressImageFile(file);
        draft.image = {
          dataUrl: await fileToDataUrl(compressedFile),
          name: compressedFile.name,
          type: compressedFile.type,
          lastModified: compressedFile.lastModified,
        };
      }

      window.sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch {
      window.sessionStorage.setItem(
        DRAFT_STORAGE_KEY,
        JSON.stringify({ prompt: prompt.trim() }),
      );
    }

    window.location.href = "/login?next=/";
  };

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
    setSubmittedTask(null);

    if (!userEmail) {
      await redirectToLoginWithDraft();
      return;
    }

    setIsSubmitting(true);

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
      className="scroll-mt-16 px-4 pb-12 pt-24 sm:px-6 sm:pb-18 sm:pt-28"
    >
      <div className="mx-auto max-w-5xl">
        <div className="border border-[#211d1a]/12 bg-[#faf7ef]/72 p-3 shadow-[0_30px_80px_rgba(33,29,26,0.08)] backdrop-blur sm:p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#211d1a]/12 px-1 pb-4 text-sm font-semibold tracking-[0.08em] text-[#786f66]">
            {userEmail ? (
              <span>当前账号：{userEmail}</span>
            ) : (
              <span>填写完成后，提交时登录即可保存任务</span>
            )}
            {userEmail ? (
              <Link
                href="/my/tasks"
                className="font-sans text-[12px] font-bold uppercase tracking-[0.14em] text-[#c66f51] transition hover:text-[#211d1a]"
              >
                查看任务
              </Link>
            ) : (
              <Link
                href="/login?next=/"
                className="font-sans text-[12px] font-bold uppercase tracking-[0.14em] text-[#c66f51] transition hover:text-[#211d1a]"
              >
                登录 / 注册
              </Link>
            )}
          </div>
          <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <PhotoUpload
              file={file}
              previewUrl={previewUrl}
              onFileChange={handleFileChange}
            />

            <div className="flex flex-col">
              <label
                htmlFor="prompt"
                className="mb-3 block text-sm font-semibold text-[#211d1a]"
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
                  "min-h-[260px] flex-1 resize-y border px-4 py-4 text-sm leading-relaxed text-[#211d1a] placeholder:text-[#9a8f84] focus:outline-none focus:ring-2 sm:min-h-[360px] sm:text-base " +
                  (fieldErrors.prompt
                    ? "border-red-400 bg-red-50 ring-red-100 focus:border-red-400 focus:ring-red-100"
                    : "border-[#211d1a]/12 bg-[#f5efe5] focus:border-[#c66f51] focus:bg-[#fffaf1] focus:ring-[#e6c6b9]")
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
              "font-sans mt-4 flex h-[52px] w-full items-center justify-center gap-2 border text-[12px] font-bold uppercase tracking-[0.16em] transition-all sm:h-14 " +
              (isSubmitting
                ? "cursor-wait border-[#cfc4b8] bg-[#e5ded3] text-[#786f66]"
                : "border-[#211d1a] bg-[#211d1a] text-[#f7f1e8] shadow-[0_14px_32px_rgba(33,29,26,0.16)] hover:bg-[#332c26] active:scale-[0.99]")
            }
          >
            {isSubmitting && (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#9a8f84] border-t-[#211d1a]" />
            )}
            {isSubmitting ? "处理中" : "提交任务"}
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
      </div>
    </section>
  );
}

function InlineWaitingIndicator({ task }: { task: Task }) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm text-[#786f66]">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#d7cec3] border-t-[#c66f51]" />
      <span>已提交，任务号 {task.task_number}</span>
      <Link
        href={"/task/" + task.task_number}
        className="font-sans text-[12px] font-bold uppercase tracking-[0.14em] text-[#c66f51] transition hover:text-[#211d1a]"
      >
        打开任务页
      </Link>
      <Link
        href="/my/tasks"
        className="font-sans text-[12px] font-bold uppercase tracking-[0.14em] text-[#c66f51] transition hover:text-[#211d1a]"
      >
        我的任务
      </Link>
    </div>
  );
}
