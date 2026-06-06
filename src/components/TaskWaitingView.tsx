export function TaskWaitingView() {
  return (
    <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 sm:p-12">
      <div className="flex flex-col items-center text-center">
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-violet-500" />
        </div>
        <p className="mt-6 text-lg font-medium text-white">
          AI正在生成效果图...
        </p>
        <p className="mt-2 text-sm text-zinc-500">预计需要 1-10 分钟</p>
        <p className="mt-6 max-w-md text-xs leading-relaxed text-zinc-600 sm:text-sm">
          设计师正在根据您的需求手工渲染效果图，请保持页面打开或稍后通过任务编号查看进度
        </p>
      </div>
    </div>
  );
}
