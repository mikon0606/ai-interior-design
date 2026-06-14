import { AdminNewTaskWatcher } from "@/app/admin/AdminNewTaskWatcher";
import { AdminTasksTable } from "@/app/admin/AdminTasksTable";
import { getAdminClaims } from "@/lib/admin-auth";
import { listTasks } from "@/lib/tasks";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const claims = await getAdminClaims();

  if (!claims) {
    redirect("/login?next=/admin");
  }

  const tasks = await listTasks();
  const latestTaskNumber = tasks[0]?.task_number ?? null;

  return (
    <div className="min-h-screen bg-[#f7f7f3] text-[#181816]">
      <AdminNewTaskWatcher initialLatestTaskNumber={latestTaskNumber} />
      <header className="bg-[#f7f7f3]/90">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-base font-semibold sm:text-lg">后台管理</h1>
            <span className="rounded-full bg-[#eef3e9] px-2.5 py-0.5 text-xs text-[#6f7f62]">
              人工审核模式
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-neutral-500 transition hover:text-[#181816]"
            >
              返回用户端
            </Link>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="text-sm text-neutral-500 transition hover:text-[#181816]"
              >
                退出登录
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">全部任务</h2>
            <p className="mt-1 text-sm text-neutral-500">共 {tasks.length} 条</p>
          </div>
        </div>

        <AdminTasksTable initialTasks={tasks} />
      </main>
    </div>
  );
}
