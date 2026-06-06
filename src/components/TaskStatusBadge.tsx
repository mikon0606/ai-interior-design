import {
  TASK_STATUS_LABELS,
  type TaskStatus,
} from "@/lib/task-types";

const STATUS_STYLES: Record<TaskStatus, string> = {
  pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  processing: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  completed: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium sm:text-sm ${STATUS_STYLES[status]}`}
    >
      {TASK_STATUS_LABELS[status]}
    </span>
  );
}
