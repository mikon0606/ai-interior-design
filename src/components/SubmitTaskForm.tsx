"use client";

import { PhotoUpload } from "@/components/PhotoUpload";
import { PROMPT_PLACEHOLDER } from "@/lib/task-types";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

type FieldErrors = {
  photo?: string;
  prompt?: string;
  submit?: string;
};

export function SubmitTaskForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleFileChange = useCallback(
    (newFile: File | null, url: string | null) => {
      if (previewUrl && previewUrl !== url) URL.revokeObjectURL(previewUrl);
      setFile(newFile);
      setPreviewUrl(url);
      setFieldErrors((prev) => ({ ...prev, photo: undefined }));
    },
    [previewUrl],
  );

  const handleSubmit = async () => {
    const errors: FieldErrors = {};

    if (!file) {
      errors.photo = "请上传房间照片";
    }
    if (!prompt.trim()) {
      errors.prompt = "请输入装修需求";
    }

    if (errors.photo || errors.prompt) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("prompt", prompt.trim());
      formData.append("image", file!);

      const res = await fetch("/api/tasks", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setFieldErrors({ submit: data.error ?? "提交失败，请稍后重试" });
        return;
      }

      router.push(`/task/${data.task.task_number}`);
    } catch {
      setFieldErrors({ submit: "网络错误，请稍后重试" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section
        id="submit"
        className="scroll-mt-16 px-4 pb-4 pt-20 sm:px-6 sm:pt-24"
      >
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center sm:mb-10">
            <h1 className="text-balance text-2xl font-semibold leading-tight text-white sm:text-4xl">
              上传房间照片，提交装修任务
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400 sm:text-base">
              上传照片并输入需求，我们将人工为您生成装修效果图
            </p>
          </div>

          <div className="space-y-8 rounded-3xl border border-white/[0.08] bg-white/[0.02] p-5 sm:space-y-10 sm:p-8">
            <PhotoUpload
              file={file}
              previewUrl={previewUrl}
              onFileChange={handleFileChange}
              hasError={Boolean(fieldErrors.photo)}
              errorMessage={fieldErrors.photo}
            />

            <div>
              <label
                htmlFor="prompt"
                className="mb-4 block text-lg font-medium text-white sm:text-xl"
              >
                请输入你的装修需求
              </label>
              <textarea
                id="prompt"
                rows={6}
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  if (e.target.value.trim()) {
                    setFieldErrors((prev) => ({ ...prev, prompt: undefined }));
                  }
                }}
                placeholder={PROMPT_PLACEHOLDER}
                aria-invalid={Boolean(fieldErrors.prompt)}
                className={`w-full resize-y rounded-2xl border bg-black/40 px-4 py-4 text-sm leading-relaxed text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 sm:text-base ${
                  fieldErrors.prompt
                    ? "border-red-500/60 ring-red-500/20 focus:border-red-500/60 focus:ring-red-500/20"
                    : "border-white/10 focus:border-violet-500/50 focus:ring-violet-500/20"
                }`}
              />
              {fieldErrors.prompt && (
                <p className="mt-2 text-sm text-red-400" role="alert">
                  {fieldErrors.prompt}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="mx-auto max-w-4xl">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className={`flex h-16 w-full items-center justify-center gap-2 rounded-2xl text-lg font-semibold transition-all sm:h-[72px] sm:text-xl ${
              isSubmitting
                ? "cursor-wait bg-zinc-800 text-zinc-400"
                : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-900/40 hover:from-violet-500 hover:to-indigo-500 active:scale-[0.99]"
            }`}
          >
            {isSubmitting && (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-600 border-t-white" />
            )}
            {isSubmitting ? "提交中…" : "提交任务"}
          </button>
          {fieldErrors.submit && (
            <p className="mt-3 text-center text-sm text-red-400" role="alert">
              {fieldErrors.submit}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
