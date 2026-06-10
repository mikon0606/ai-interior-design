export function TaskWaitingView() {
  return (
    <div className="rounded-2xl bg-white/82 p-8 shadow-[0_18px_60px_rgba(24,24,22,0.06)] ring-1 ring-black/[0.04] sm:p-12">
      <div className="flex flex-col items-center text-center">
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 rounded-full border-2 border-black/10" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#7a8a6a]" />
        </div>
        <p className="mt-6 text-lg font-medium text-[#181816]">
          任务已提交，正在处理
        </p>
        <p className="mt-2 text-sm text-neutral-500">请稍后查看任务进度</p>
        <p className="mt-6 max-w-md text-xs leading-relaxed text-neutral-500 sm:text-sm">
          设计师会根据你的文字需求和参考图人工生成效果图。你可以保持页面打开，也可以稍后通过任务编号查看结果。
        </p>
      </div>
    </div>
  );
}
