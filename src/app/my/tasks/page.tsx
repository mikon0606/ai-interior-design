import { ImagePreviewDialog } from "@/components/ImagePreviewDialog";
import { SiteHeader } from "@/components/SiteHeader";
import { TaskStatusBadge } from "@/components/TaskStatusBadge";
import { getAuthClaims } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { listTasksByUser } from "@/lib/tasks";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MyTasksPage() {
  const claims = await getAuthClaims();

  if (!claims) {
    redirect("/login?next=/my/tasks");
  }

  const tasks = await listTasksByUser(claims.sub);

  return (
    <div className="min-h-screen bg-[#f6f6f3] text-[#181816]">
      <SiteHeader currentUserEmail={claims.email} />
      <main className="px-4 pb-20 pt-20 sm:px-6 sm:pt-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#6f7f62]">我的任务</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                查看已提交任务和回传效果图
              </h1>
              <p className="mt-2 text-sm text-neutral-500">
                共 {tasks.length} 条任务
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#181816] px-5 text-sm font-semibold text-white transition hover:bg-[#2b2b28]"
            >
              提交新任务
            </Link>
          </div>

          {tasks.length === 0 ? (
            <div className="rounded-[20px] bg-white/82 p-8 text-center shadow-[0_18px_60px_rgba(24,24,22,0.06)] ring-1 ring-black/[0.04]">
              <h2 className="text-lg font-semibold">还没有任务</h2>
              <p className="mt-2 text-sm text-neutral-500">
                提交第一张户型图或空间照片后，这里会持续显示处理进度。
              </p>
              <Link
                href="/"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#181816] px-5 text-sm font-semibold text-white transition hover:bg-[#2b2b28]"
              >
                去提交
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {tasks.map((task) => {
                const imageUrl = task.result_image ?? task.input_image;

                return (
                  <article
                    key={task.id}
                    className="group overflow-hidden rounded-[20px] bg-white/82 shadow-[0_18px_60px_rgba(24,24,22,0.06)] ring-1 ring-black/[0.04] transition hover:-translate-y-0.5 hover:shadow-[0_24px_80px_rgba(24,24,22,0.09)]"
                  >
                    <div className="relative aspect-[4/3] bg-[#eeeee8]">
                      {imageUrl ? (
                        <ImagePreviewDialog
                          src={imageUrl}
                          alt={task.task_number + " 任务图片"}
                          label={task.task_number + " 任务图片"}
                          previewClassName="relative aspect-[4/3] w-full bg-[#eeeee8]"
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                          暂无图片
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <span className="font-mono text-sm font-semibold tracking-wide">
                          {task.task_number}
                        </span>
                        <TaskStatusBadge status={task.status} />
                      </div>
                      <p className="line-clamp-3 min-h-[4.5rem] whitespace-pre-wrap text-sm leading-6 text-neutral-600">
                        {task.prompt}
                      </p>
                      <div className="mt-5 flex items-center justify-between text-xs text-neutral-500">
                        <span>{formatDateTime(task.created_at)}</span>
                        <Link
                          href={"/task/" + task.task_number}
                          className="font-medium text-[#6f7f62] transition hover:text-[#181816]"
                        >
                          查看详情
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
