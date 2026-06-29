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
    : "text-[#4f4740] hover:text-[#211d1a]";

  return (
    <header
      className={
        "fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl " +
        (isDark
          ? "border-white/10 bg-[#050505]/80"
          : "border-[#211d1a]/10 bg-[#f1ece3]/88")
      }
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-[70px] sm:px-6">
        <Link
          href="/"
          className={
            "font-display shrink-0 text-2xl font-semibold tracking-normal sm:text-3xl " +
            (isDark ? "text-white" : "text-[#211d1a]")
          }
        >
          设境
        </Link>
        <nav className="font-sans flex min-w-0 items-center gap-4 text-[12px] font-bold uppercase tracking-[0.16em] sm:gap-7">
          <Link
            href="/"
            className={
              "hidden border-b border-[#c66f51] pb-1 transition sm:inline-flex " +
              linkClass
            }
          >
            提交任务
          </Link>
          {currentUserEmail ? (
            <>
              <Link href="/my/tasks" className={"transition " + linkClass}>
                我的任务
              </Link>
              <form action="/auth/signout" method="post" className="shrink-0">
                <button
                  type="submit"
                  className={"transition " + linkClass}
                >
                  退出
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className={
                "inline-flex h-9 items-center border px-4 transition " +
                (isDark
                  ? "bg-white text-black hover:bg-zinc-200"
                  : "border-[#211d1a] bg-[#211d1a] text-[#f7f1e8] hover:bg-[#332c26]")
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
