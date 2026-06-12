import "server-only";

import type { Task } from "@/lib/task-types";

const RESEND_API_URL = "https://api.resend.com/emails";
const FORMSUBMIT_URL = "https://formsubmit.co/ajax";

export async function notifyAdminNewTask(task: Task) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_NOTIFY_EMAIL;
  const from =
    process.env.ADMIN_NOTIFY_FROM ?? "AI Interior Design <onboarding@resend.dev>";

  if (!to) {
    console.warn("Skip admin email notification: missing ADMIN_NOTIFY_EMAIL");
    return;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const adminTaskUrl = siteUrl
    ? `${siteUrl}/admin/tasks/${task.task_number}`
    : "";

  const text = [
    `收到一个新的设计任务：${task.task_number}`,
    "",
    "装修需求：",
    task.prompt,
    "",
    adminTaskUrl ? `后台查看：${adminTaskUrl}` : "请进入后台查看任务详情。",
  ].join("\n");

  if (!apiKey) {
    await notifyWithFormSubmit({
      to,
      subject: `新设计任务 ${task.task_number}`,
      text,
      taskNumber: task.task_number,
    });
    return;
  }

  const res = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: `新设计任务 ${task.task_number}`,
      text,
    }),
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`发送新任务提醒失败: ${message}`);
  }
}

async function notifyWithFormSubmit({
  to,
  subject,
  text,
  taskNumber,
}: {
  to: string;
  subject: string;
  text: string;
  taskNumber: string;
}) {
  const formData = new FormData();
  formData.append("_subject", subject);
  formData.append("_captcha", "false");
  formData.append("_template", "table");
  formData.append("任务编号", taskNumber);
  formData.append("通知内容", text);

  const res = await fetch(`${FORMSUBMIT_URL}/${encodeURIComponent(to)}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: formData,
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`发送新任务提醒失败: ${message}`);
  }
}
