export type TaskStatus = "pending" | "processing" | "completed";

export interface Task {
  id: number;
  task_number: string;
  prompt: string;
  input_image: string;
  result_image: string | null;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "待处理",
  processing: "处理中",
  completed: "已完成",
};

export const TASK_STATUSES: TaskStatus[] = [
  "pending",
  "processing",
  "completed",
];

export const PROMPT_PLACEHOLDER = `保留户型结构
改成现代极简风
增加岛台
增加无主灯设计`;
