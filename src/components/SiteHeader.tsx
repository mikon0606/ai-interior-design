import Link from "next/link";

export function SiteHeader({ tone = "light" }: { tone?: "light" | "dark" }) {
  const isDark = tone === "dark";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl ${
        isDark
          ? "border-white/[0.06] bg-[#050505]/80"
          : "border-black/[0.06] bg-[#f6f6f3]/90"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <Link
          href="/"
          className={`text-sm font-semibold tracking-tight sm:text-base ${
            isDark ? "text-white" : "text-[#181816]"
          }`}
        >
          AI装修大师
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          <a
            href={isDark ? "/" : "#submit"}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              isDark
                ? "bg-white text-black hover:bg-zinc-200"
                : "bg-[#181816] text-white hover:bg-[#2b2b28]"
            }`}
          >
            提交任务
          </a>
        </nav>
      </div>
    </header>
  );
}
