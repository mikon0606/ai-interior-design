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
        className="scroll-mt-16 px-4 pb-10 pt-20 sm:px-6 sm:pb-16 sm:pt-24"
      >
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-4 border-y border-black/[0.08] py-4 lg:grid-cols-[1.05fr_0.95fr]">
            <PhotoUpload
              file={file}
              previewUrl={previewUrl}
              onFileChange={handleFileChange}
              hasError={Boolean(fieldErrors.photo)}
              errorMessage={fieldErrors.photo}
            />

            <div className="flex flex-col">
              <label
                htmlFor="prompt"
                className="mb-3 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-500"
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
                    setFieldErrors((prev) => ({ ...prev, prompt: undefined }));
                  }
                }}
                placeholder={PROMPT_PLACEHOLDER}
                aria-invalid={Boolean(fieldErrors.prompt)}
                className={`min-h-[260px] flex-1 resize-y rounded-lg border bg-white px-4 py-4 text-sm leading-relaxed text-[#181816] placeholder:text-neutral-400 focus:outline-none focus:ring-2 sm:min-h-[360px] sm:text-base ${
                  fieldErrors.prompt
                    ? "border-red-400 ring-red-100 focus:border-red-400 focus:ring-red-100"
                    : "border-black/10 focus:border-[#7a8a6a] focus:ring-[#dce5d3]"
                }`}
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
            className={`mt-4 flex h-[52px] w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all sm:h-14 ${
              isSubmitting
                ? "cursor-wait bg-neutral-300 text-neutral-500"
                : "bg-[#181816] text-white hover:bg-[#2b2b28] active:scale-[0.99]"
            }`}
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
        </div>
      </section>
    </>
  );
}
