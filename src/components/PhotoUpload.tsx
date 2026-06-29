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
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-[#211d1a]">上传照片</h3>
        <span className="font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#c66f51]">
          可选
        </span>
      </div>

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
          className={`flex min-h-[260px] cursor-pointer flex-col items-center justify-center border px-6 py-12 transition-all sm:min-h-[360px] ${errorBorder} ${
            isDragging
              ? "border-[#c66f51] bg-[#fffaf1] shadow-[inset_0_0_0_1px_rgba(198,111,81,0.22)]"
              : hasError
                ? "border-red-400 bg-red-50"
                : "border-[#211d1a]/12 bg-[#f5efe5] hover:border-[#c66f51]/70 hover:bg-[#fffaf1]"
          }`}
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#c66f51]/55 bg-[#faf7ef] text-4xl font-bold leading-none text-[#c66f51]">
            +
          </span>
          <p className="mt-5 text-center text-sm font-semibold text-[#211d1a]">
            点击上传照片
          </p>
          <p className="mt-1.5 text-center text-xs text-[#786f66]">
            也可只填写文字需求
          </p>
        </div>
      ) : (
        <div
          className={`overflow-hidden border bg-[#faf7ef] ${errorBorder || "border-[#211d1a]/12"}`}
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
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
            <p className="truncate text-sm text-[#786f66]">
              {file?.name ?? "已选择照片"}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="font-sans border border-[#211d1a]/14 bg-[#f5efe5] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#4f4740] transition hover:border-[#c66f51]/60 hover:text-[#211d1a]"
              >
                更换
              </button>
              <button
                type="button"
                onClick={clearPhoto}
                className="font-sans border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-red-600 transition hover:bg-red-100"
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
