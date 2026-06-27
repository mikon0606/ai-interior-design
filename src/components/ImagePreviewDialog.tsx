"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";

interface ImagePreviewDialogProps {
  src: string;
  alt: string;
  label: string;
  sizes: string;
  previewClassName: string;
  imageClassName?: string;
  hint?: string;
}

export function ImagePreviewDialog({
  src,
  alt,
  label,
  sizes,
  previewClassName,
  imageClassName = "object-cover",
  hint = "点击放大",
}: ImagePreviewDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group/preview block w-full cursor-zoom-in text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7a8a6a] focus-visible:ring-offset-2"
        aria-label={`放大预览${label}`}
      >
        <div className={previewClassName}>
          <Image
            src={src}
            alt={alt}
            fill
            className={`${imageClassName} transition duration-200 group-hover/preview:scale-[1.01]`}
            sizes={sizes}
          />
          <span className="absolute bottom-3 right-3 rounded-full bg-black/62 px-3 py-1 text-xs font-medium text-white opacity-0 transition group-hover/preview:opacity-100 group-focus-visible/preview:opacity-100">
            {hint}
          </span>
        </div>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="fixed inset-0 z-50 bg-black/82 px-3 py-4 backdrop-blur-sm sm:px-6 sm:py-8"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="mx-auto flex h-full max-w-6xl flex-col gap-3"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 text-white">
              <h2 id={titleId} className="text-sm font-medium sm:text-base">
                {label}
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-white/12 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
              >
                关闭
              </button>
            </div>

            <div
              className="relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-black/30 ring-1 ring-white/12"
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
