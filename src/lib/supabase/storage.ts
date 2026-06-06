import "server-only";

import { createServiceSupabase } from "@/lib/supabase/server";

export const TASK_IMAGES_BUCKET = "task-images";

function extFromFile(file: File): string {
  const fromName = file.name.includes(".")
    ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase()
    : "";
  if ([".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(fromName)) {
    return fromName === ".jpeg" ? ".jpg" : fromName;
  }
  const mimeMap: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
  };
  return mimeMap[file.type] ?? ".jpg";
}

function getPublicUrl(path: string): string {
  const supabase = createServiceSupabase();
  const { data } = supabase.storage
    .from(TASK_IMAGES_BUCKET)
    .getPublicUrl(path);
  return data.publicUrl;
}

async function uploadImage(
  storagePath: string,
  file: File,
): Promise<string> {
  const supabase = createServiceSupabase();
  const buffer = Buffer.from(await file.arrayBuffer());
  const contentType = file.type || "image/jpeg";

  const { error } = await supabase.storage
    .from(TASK_IMAGES_BUCKET)
    .upload(storagePath, buffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`图片上传失败: ${error.message}`);
  }

  return getPublicUrl(storagePath);
}

export async function saveInputImage(
  taskNumber: string,
  file: File,
): Promise<string> {
  const ext = extFromFile(file);
  const path = `inputs/${taskNumber}${ext}`;
  return uploadImage(path, file);
}

export async function saveResultImage(
  taskNumber: string,
  file: File,
): Promise<string> {
  const ext = extFromFile(file);
  const path = `results/${taskNumber}${ext}`;
  return uploadImage(path, file);
}
