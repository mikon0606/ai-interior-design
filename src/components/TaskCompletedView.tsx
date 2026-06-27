import { ImagePreviewDialog } from "@/components/ImagePreviewDialog";
import type { Task } from "@/lib/task-types";

interface TaskCompletedViewProps {
  task: Task;
}

export function TaskCompletedView({ task }: TaskCompletedViewProps) {
  const resultUrl = task.result_image!;

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl bg-white/82 shadow-[0_18px_60px_rgba(24,24,22,0.06)] ring-1 ring-black/[0.04]">
        <div
          className={`grid grid-cols-1 ${
            task.input_image ? "md:grid-cols-2" : ""
          }`}
        >
          {task.input_image && (
            <ImagePanel label="原图" src={task.input_image} alt="原图" />
          )}
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
          className="inline-flex h-12 items-center justify-center rounded-xl bg-[#181816] px-8 text-sm font-semibold text-white transition hover:bg-[#2b2b28] sm:text-base"
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
    <div className="border-b border-black/[0.06] md:border-b-0 md:border-r md:border-black/[0.06] md:last:border-r-0">
      <div className="flex items-center px-4 py-3">
        <span
          className={`rounded-md px-2.5 py-1 text-xs font-medium ${
            highlight
              ? "bg-[#181816] text-white"
              : "bg-black/[0.06] text-neutral-600"
          }`}
        >
          {label}
        </span>
      </div>
      <ImagePreviewDialog
        src={src}
        alt={alt}
        label={label}
        previewClassName="relative aspect-[4/3] w-full bg-[#f1f1ed] sm:aspect-[16/10]"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}
