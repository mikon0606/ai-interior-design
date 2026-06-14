import Link from "next/link";

type SiteHeaderProps = {
  tone?: "light" | "dark";
  currentUserEmail?: string;
};

export function SiteHeader({
  tone = "light",
  currentUserEmail,
}: SiteHeaderProps) {
  const isDark = tone === "dark";
  const linkClass = isDark
    ? "text-zinc-300 hover:text-white"
    : "text-neutral-600 hover:text-[#181816]";

  return (
    <header
      className={
        "fixed inset-x-0 top-0 z-50 backdrop-blur-xl " +
        (isDark ? "bg-[#050505]/80" : "bg-[#f6f6f3]/88")
      }
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <Link
          href="/"
          className={
            "shrink-0 text-sm font-semibold tracking-tight sm:text-base " +
            (isDark ? "text-white" : "text-[#181816]")
          }
        >
          AI装修大师
        </Link>
        <nav className="flex min-w-0 items-center gap-3 text-sm sm:gap-5">
          <Link href="/" className={"hidden font-medium transition sm:inline-flex " + linkClass}>
            提交任务
          </Link>
          {currentUserEmail ? (
            <>
              <Link href="/my/tasks" className={"font-medium transition " + linkClass}>
                我的任务
              </Link>
              <form action="/auth/signout" method="post" className="shrink-0">
                <button
                  type="submit"
                  className={"font-medium transition " + linkClass}
                >
                  退出
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className={
                "inline-flex h-9 items-center rounded-full px-4 font-medium transition " +
                (isDark
                  ? "bg-white text-black hover:bg-zinc-200"
                  : "bg-[#181816] text-white hover:bg-[#2b2b28]")
              }
            >
              登录
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
