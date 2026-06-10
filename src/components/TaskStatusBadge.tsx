import {
  TASK_STATUS_LABELS,
  type TaskStatus,
} from "@/lib/task-types";

const STATUS_STYLES: Record<TaskStatus, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  processing: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
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
