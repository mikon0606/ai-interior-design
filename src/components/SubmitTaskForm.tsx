"use client";

import { PhotoUpload } from "@/components/PhotoUpload";
import type { Task } from "@/lib/task-types";
import type { ReactNode } from "react";
import { useCallback, useState } from "react";

type FieldErrors = {
  keyNeeds?: string;
  submit?: string;
};

const SPACE_TYPES = [
  "客厅",
  "卧室",
  "餐厨",
  "书房",
  "儿童房",
  "卫浴",
  "全屋",
];

const STYLE_OPTIONS = [
  "现代极简",
  "奶油风",
  "中古风",
  "侘寂风",
  "轻法式",
  "意式",
  "新中式",
];

const FOCUS_OPTIONS = [
  "客户提案",
  "空间氛围",
  "收纳规划",
  "灯光效果",
  "材质搭配",
  "软装陈设",
];

const STRUCTURE_OPTIONS = ["尽量保留原结构", "可局部调整", "重新规划"];

export function SubmitTaskForm() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [spaceType, setSpaceType] = useState(SPACE_TYPES[0]);
  const [styleDirection, setStyleDirection] = useState(STYLE_OPTIONS[0]);
  const [structureMode, setStructureMode] = useState(STRUCTURE_OPTIONS[0]);
  const [focusTags, setFocusTags] = useState<string[]>(["客户提案"]);
  const [keyNeeds, setKeyNeeds] = useState("");
  const [extraNotes, setExtraNotes] = useState("");
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

  const toggleFocusTag = (tag: string) => {
    setFocusTags((prev) =>
      prev.includes(tag)
        ? prev.filter((item) => item !== tag)
        : [...prev, tag],
    );
  };

  const buildPrompt = () => {
    const lines = [
      `空间类型：${spaceType}`,
      `风格方向：${styleDirection}`,
      `结构处理：${structureMode}`,
      `提案侧重：${focusTags.length ? focusTags.join("、") : "未选择"}`,
      `重点需求：${keyNeeds.trim()}`,
    ];

    if (extraNotes.trim()) {
      lines.push(`补充说明：${extraNotes.trim()}`);
    }

    return lines.join("\n");
  };

  const handleSubmit = async () => {
    const errors: FieldErrors = {};

    if (!keyNeeds.trim()) {
      errors.keyNeeds = "请填写重点需求";
    }

    if (errors.keyNeeds) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("prompt", buildPrompt());
      if (file) {
        formData.append("image", file);
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

  return (
    <>
      <section
        id="submit"
        className="scroll-mt-16 px-4 pb-10 pt-20 sm:px-6 sm:pb-16 sm:pt-24"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 grid gap-6 border-b border-black/[0.08] pb-7 lg:grid-cols-[1fr_0.74fr] lg:items-end">
            <div>
              <p className="text-sm font-medium text-[#7a8a6a]">
                面向室内设计师
              </p>
              <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-[#181816] sm:text-6xl">
                客户提案图
                <span className="ml-3 align-middle text-sm font-medium text-neutral-500 sm:text-base">
                  人工回传
                </span>
              </h1>
            </div>
            <div className="grid grid-cols-3 divide-x divide-black/[0.08] border-y border-black/[0.08] py-3 text-sm text-neutral-600 lg:mb-1">
              <p className="px-3">
                <span className="block text-xs text-neutral-400">01</span>
                上传现场图
              </p>
              <p className="px-3">
                <span className="block text-xs text-neutral-400">02</span>
                填写方向
              </p>
              <p className="px-3">
                <span className="block text-xs text-neutral-400">03</span>
                查看结果
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white/82 p-3 shadow-[0_24px_80px_rgba(24,24,22,0.06)] ring-1 ring-black/[0.04] backdrop-blur sm:p-4">
            <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              <PhotoUpload
                file={file}
                previewUrl={previewUrl}
                onFileChange={handleFileChange}
              />

              <div className="rounded-xl border border-black/[0.06] bg-[#fbfbf8] p-4 sm:p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="空间类型" htmlFor="space-type">
                    <select
                      id="space-type"
                      value={spaceType}
                      onChange={(e) => setSpaceType(e.target.value)}
                      className="h-11 w-full rounded-lg border border-black/[0.08] bg-white px-3 text-sm text-[#181816] outline-none transition focus:border-[#7a8a6a] focus:ring-2 focus:ring-[#dce5d3]"
                    >
                      {SPACE_TYPES.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="风格方向" htmlFor="style-direction">
                    <select
                      id="style-direction"
                      value={styleDirection}
                      onChange={(e) => setStyleDirection(e.target.value)}
                      className="h-11 w-full rounded-lg border border-black/[0.08] bg-white px-3 text-sm text-[#181816] outline-none transition focus:border-[#7a8a6a] focus:ring-2 focus:ring-[#dce5d3]"
                    >
                      {STYLE_OPTIONS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="mt-5">
                  <p className="mb-2 text-sm font-medium text-[#181816]">
                    结构处理
                  </p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {STRUCTURE_OPTIONS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setStructureMode(item)}
                        className={`min-h-11 rounded-lg border px-3 py-2 text-sm transition ${
                          structureMode === item
                            ? "border-[#7a8a6a] bg-[#eef3e9] text-[#181816]"
                            : "border-black/[0.08] bg-white text-neutral-600 hover:border-[#7a8a6a]/60"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <p className="mb-2 text-sm font-medium text-[#181816]">
                    提案侧重
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {FOCUS_OPTIONS.map((item) => {
                      const isSelected = focusTags.includes(item);

                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleFocusTag(item)}
                          className={`rounded-lg border px-3 py-2 text-sm transition ${
                            isSelected
                              ? "border-[#7a8a6a] bg-[#eef3e9] text-[#181816]"
                              : "border-black/[0.08] bg-white text-neutral-600 hover:border-[#7a8a6a]/60"
                          }`}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Field label="重点需求" htmlFor="key-needs" className="mt-5">
                  <textarea
                    id="key-needs"
                    rows={4}
                    value={keyNeeds}
                    onChange={(e) => {
                      setKeyNeeds(e.target.value);
                      if (e.target.value.trim()) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          keyNeeds: undefined,
                        }));
                      }
                    }}
                    placeholder="例如：保留原地面，增加岛台和无主灯，客厅要适合给客户做第一版方案沟通。"
                    aria-invalid={Boolean(fieldErrors.keyNeeds)}
                    className={`min-h-[116px] w-full resize-y rounded-lg border bg-white px-3 py-3 text-sm leading-relaxed text-[#181816] outline-none transition placeholder:text-neutral-400 focus:ring-2 ${
                      fieldErrors.keyNeeds
                        ? "border-red-400 bg-red-50 ring-red-100 focus:border-red-400 focus:ring-red-100"
                        : "border-black/[0.08] focus:border-[#7a8a6a] focus:ring-[#dce5d3]"
                    }`}
                  />
                  {fieldErrors.keyNeeds && (
                    <p className="mt-2 text-sm text-red-600" role="alert">
                      {fieldErrors.keyNeeds}
                    </p>
                  )}
                </Field>

                <Field label="补充说明" htmlFor="extra-notes" className="mt-4">
                  <textarea
                    id="extra-notes"
                    rows={3}
                    value={extraNotes}
                    onChange={(e) => setExtraNotes(e.target.value)}
                    placeholder="可填写客户偏好、预算感、需要避开的材质或颜色。"
                    className="min-h-[88px] w-full resize-y rounded-lg border border-black/[0.08] bg-white px-3 py-3 text-sm leading-relaxed text-[#181816] outline-none transition placeholder:text-neutral-400 focus:border-[#7a8a6a] focus:ring-2 focus:ring-[#dce5d3]"
                  />
                </Field>
              </div>
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className={`mt-4 flex h-[52px] w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all sm:h-14 ${
                isSubmitting
                  ? "cursor-wait bg-neutral-200 text-neutral-500"
                  : "bg-[#181816] text-white shadow-[0_14px_32px_rgba(24,24,22,0.16)] hover:bg-[#2b2b28] active:scale-[0.99]"
              }`}
            >
              {isSubmitting && (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-400 border-t-white" />
              )}
              {isSubmitting ? "提交中…" : "生成提案任务"}
            </button>
            {fieldErrors.submit && (
              <p className="mt-3 text-center text-sm text-red-600" role="alert">
                {fieldErrors.submit}
              </p>
            )}
          </div>

          {submittedTask && <InlineWaitingCard task={submittedTask} />}
        </div>
      </section>
    </>
  );
}

function InlineWaitingCard({ task }: { task: Task }) {
  return (
    <div className="mt-4 rounded-2xl bg-white/82 p-5 shadow-[0_18px_60px_rgba(24,24,22,0.06)] ring-1 ring-black/[0.04] sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#181816]">
            已提交，正在排队处理
          </p>
          <p className="mt-1 text-sm leading-6 text-neutral-600">
            任务编号{" "}
            <span className="font-mono font-semibold text-[#181816]">
              {task.task_number}
            </span>
            。设计师会根据你的文字需求{task.input_image ? "和参考图" : ""}
            人工生成效果图。
          </p>
        </div>
        <a
          href={`/task/${task.task_number}`}
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-[#181816] px-5 text-sm font-semibold text-white transition hover:bg-[#2b2b28]"
        >
          查看进度
        </a>
      </div>
      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
        <div className="h-full w-1/2 animate-[progress_2.8s_ease-in-out_infinite] rounded-full bg-[#7a8a6a]" />
      </div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  className = "",
  children,
}: {
  label: string;
  htmlFor: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-medium text-[#181816]"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
