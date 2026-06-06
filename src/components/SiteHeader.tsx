import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#050505]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-white sm:text-base"
        >
          AI装修大师
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          <a
            href="#cases"
            className="text-sm text-zinc-400 transition hover:text-white"
          >
            案例
          </a>
          <a
            href="#submit"
            className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black transition hover:bg-zinc-200"
          >
            提交任务
          </a>
        </nav>
      </div>
    </header>
  );
}
