"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

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
  const [isMounted, setIsMounted] = useState(false);
  const titleId = useId();

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

      {isOpen &&
        isMounted &&
        createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="fixed inset-0 z-[2147483647] flex h-[100dvh] w-screen bg-black/88 px-3 py-3 backdrop-blur-sm sm:px-6 sm:py-6"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative flex min-h-0 w-full flex-1 items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-4 text-white">
              <h2
                id={titleId}
                className="rounded-full bg-black/45 px-3 py-1.5 text-sm font-medium sm:text-base"
              >
                {label}
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="pointer-events-auto rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/24"
              >
                关闭
              </button>
            </div>

            <div className="flex h-full w-full items-center justify-center overflow-hidden">
              {/* Use a plain img so the preview always preserves the full source aspect ratio inside the viewport. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt}
                className="block max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
