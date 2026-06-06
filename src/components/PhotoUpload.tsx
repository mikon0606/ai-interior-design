"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

interface PhotoUploadProps {
  file: File | null;
  previewUrl: string | null;
  onFileChange: (file: File | null, previewUrl: string | null) => void;
  hasError?: boolean;
  errorMessage?: string;
}

export function PhotoUpload({
  file,
  previewUrl,
  onFileChange,
  hasError = false,
  errorMessage,
}: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (selected: File | undefined) => {
      if (!selected) return;
      if (!selected.type.startsWith("image/")) {
        alert("请上传图片文件（JPG、PNG、WEBP 等）");
        return;
      }
      if (selected.size > 10 * 1024 * 1024) {
        alert("图片大小不能超过 10MB");
        return;
      }
      const url = URL.createObjectURL(selected);
      onFileChange(selected, url);
    },
    [onFileChange],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFile(e.dataTransfer.files[0]);
    },
    [handleFile],
  );

  const clearPhoto = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    onFileChange(null, null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const errorBorder = hasError
    ? "border-red-500/60 ring-2 ring-red-500/20"
    : "";

  return (
    <div className="w-full">
      <h3 className="mb-4 text-lg font-medium text-white sm:text-xl">
        上传房间照片
      </h3>

      {!previewUrl ? (
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={`flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-12 transition-colors sm:min-h-[280px] ${errorBorder} ${
            isDragging
              ? "border-violet-500 bg-violet-500/10"
              : hasError
                ? "border-red-500/60 bg-red-500/5"
                : "border-white/15 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]"
          }`}
        >
          <UploadIcon />
          <p className="mt-4 text-center text-sm font-medium text-zinc-300 sm:text-base">
            点击或拖拽照片到此处
          </p>
          <p className="mt-1.5 text-center text-xs text-zinc-500 sm:text-sm">
            JPG · PNG · WEBP，最大 10MB
          </p>
        </div>
      ) : (
        <div
          className={`overflow-hidden rounded-2xl border bg-zinc-900/50 ${errorBorder || "border-white/10"}`}
        >
          <div className="relative aspect-[16/10] w-full">
            <Image
              src={previewUrl}
              alt="已上传的房间照片预览"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] px-4 py-3">
            <p className="truncate text-sm text-zinc-400">
              {file?.name ?? "已选择照片"}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-zinc-300 transition hover:bg-white/5"
              >
                更换
              </button>
              <button
                type="button"
                onClick={clearPhoto}
                className="rounded-lg border border-red-500/30 px-3 py-1.5 text-sm text-red-400 transition hover:bg-red-500/10"
              >
                移除
              </button>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <p className="mt-2 text-sm text-red-400" role="alert">
          {errorMessage}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}

function UploadIcon() {
  return (
    <svg
      className="h-10 w-10 text-zinc-500 sm:h-12 sm:w-12"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
      />
    </svg>
  );
}
