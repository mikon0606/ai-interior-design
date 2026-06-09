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
    ? "border-red-400 ring-2 ring-red-100"
    : "";

  return (
    <div className="w-full">
      <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
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
          className={`flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed px-6 py-12 transition-colors sm:min-h-[360px] ${errorBorder} ${
            isDragging
              ? "border-[#7a8a6a] bg-white"
              : hasError
                ? "border-red-400 bg-red-50"
                : "border-black/10 bg-white hover:border-[#7a8a6a]/70"
          }`}
        >
          <UploadIcon />
          <p className="mt-4 text-center text-sm font-medium text-[#181816]">
            点击上传照片
          </p>
          <p className="mt-1.5 text-center text-xs text-neutral-500">
            JPG · PNG · WEBP，最大 10MB
          </p>
        </div>
      ) : (
        <div
          className={`overflow-hidden rounded-lg border bg-white ${errorBorder || "border-black/10"}`}
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
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-black/[0.06] px-4 py-3">
            <p className="truncate text-sm text-neutral-600">
              {file?.name ?? "已选择照片"}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-md border border-black/10 px-3 py-1.5 text-sm text-neutral-700 transition hover:bg-black/[0.04]"
              >
                更换
              </button>
              <button
                type="button"
                onClick={clearPhoto}
                className="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-600 transition hover:bg-red-50"
              >
                移除
              </button>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <p className="mt-2 text-sm text-red-600" role="alert">
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
      className="h-9 w-9 text-[#7a8a6a] sm:h-10 sm:w-10"
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
