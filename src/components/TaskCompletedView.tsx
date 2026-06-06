import Image from "next/image";
import type { Task } from "@/lib/task-types";

interface TaskCompletedViewProps {
  task: Task;
}

export function TaskCompletedView({ task }: TaskCompletedViewProps) {
  const resultUrl = task.result_image!;

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02]">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <ImagePanel label="原图" src={task.input_image} alt="原图" />
          <ImagePanel
            label="效果图"
            src={resultUrl}
            alt="AI 装修效果图"
            highlight
          />
        </div>
      </div>

      <div className="flex justify-center">
        <a
          href={resultUrl}
          download={`${task.task_number}-效果图`}
          className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-8 text-sm font-semibold text-black transition hover:bg-zinc-200 sm:text-base"
        >
          下载效果图
        </a>
      </div>
    </div>
  );
}

function ImagePanel({
  label,
  src,
  alt,
  highlight = false,
}: {
  label: string;
  src: string;
  alt: string;
  highlight?: boolean;
}) {
  return (
    <div className="border-b border-white/[0.06] md:border-b-0 md:border-r md:last:border-r-0">
      <div className="flex items-center border-b border-white/[0.06] px-4 py-3">
        <span
          className={`rounded-md px-2.5 py-1 text-xs font-medium ${
            highlight
              ? "bg-violet-600/90 text-white"
              : "bg-white/10 text-zinc-400"
          }`}
        >
          {label}
        </span>
      </div>
      <div className="relative aspect-[4/3] w-full bg-zinc-900 sm:aspect-[16/10]">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </div>
  );
}
