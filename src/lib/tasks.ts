import "server-only";

import { createServiceSupabase } from "@/lib/supabase/server";
import { saveInputImage, saveResultImage } from "@/lib/supabase/storage";
import type { Task, TaskStatus } from "@/lib/task-types";

const TASK_NUMBER_START = 10001;

type TaskRow = {
  id: number;
  task_number: string;
  user_id: string | null;
  prompt: string;
  input_image: string;
  result_image: string | null;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
};

function rowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    task_number: row.task_number,
    user_id: row.user_id,
    prompt: row.prompt,
    input_image: row.input_image,
    result_image: row.result_image,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function generateTaskNumber(): Promise<string> {
  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from("tasks")
    .select("task_number")
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error("获取任务编号失败: " + error.message);
  }

  if (!data) {
    return "A" + TASK_NUMBER_START;
  }

  const current = parseInt(data.task_number.replace(/^A/, ""), 10);
  const next = Number.isNaN(current) ? TASK_NUMBER_START : current + 1;
  return "A" + next;
}

export async function createTask(
  prompt: string,
  userId: string,
  imageFile?: File,
): Promise<Task> {
  const supabase = createServiceSupabase();
  const taskNumber = await generateTaskNumber();
  const inputImage = imageFile
    ? await saveInputImage(taskNumber, imageFile)
    : "";

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      task_number: taskNumber,
      user_id: userId,
      prompt: prompt.trim(),
      input_image: inputImage,
      result_image: null,
      status: "pending",
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "创建任务失败");
  }

  return rowToTask(data as TaskRow);
}

export async function getTaskByNumber(
  taskNumber: string,
): Promise<Task | null> {
  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("task_number", taskNumber)
    .maybeSingle();

  if (error) {
    throw new Error("查询任务失败: " + error.message);
  }

  return data ? rowToTask(data as TaskRow) : null;
}

export async function listTasks(): Promise<Task[]> {
  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("获取任务列表失败: " + error.message);
  }

  return (data ?? []).map((row) => rowToTask(row as TaskRow));
}

export async function listTasksByUser(userId: string): Promise<Task[]> {
  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("获取我的任务失败: " + error.message);
  }

  return (data ?? []).map((row) => rowToTask(row as TaskRow));
}

export async function updateTaskStatus(
  taskNumber: string,
  status: TaskStatus,
): Promise<Task | null> {
  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from("tasks")
    .update({ status })
    .eq("task_number", taskNumber)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error("更新状态失败: " + error.message);
  }

  return data ? rowToTask(data as TaskRow) : null;
}

export async function uploadTaskResult(
  taskNumber: string,
  imageFile: File,
): Promise<Task | null> {
  const existing = await getTaskByNumber(taskNumber);
  if (!existing) return null;

  const resultImage = await saveResultImage(taskNumber, imageFile);
  const supabase = createServiceSupabase();

  const { data, error } = await supabase
    .from("tasks")
    .update({
      result_image: resultImage,
      status: "completed",
    })
    .eq("task_number", taskNumber)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error("更新效果图失败: " + error.message);
  }

  return data ? rowToTask(data as TaskRow) : null;
}
