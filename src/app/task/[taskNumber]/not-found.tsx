import { SiteHeader } from "@/components/SiteHeader";
import Link from "next/link";

export default function TaskNotFound() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <SiteHeader />
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 pt-20">
        <h1 className="text-2xl font-semibold">任务不存在</h1>
        <p className="mt-2 text-zinc-500">请检查任务编号是否正确</p>
        <Link
          href="/"
          className="mt-8 rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black hover:bg-zinc-200"
        >
          返回首页
        </Link>
      </main>
    </div>
  );
}
