"use client";

type LoginFormProps = {
  error?: string;
  message?: string;
  nextPath?: string;
};

export function LoginForm({
  error,
  message,
  nextPath = "/my/tasks",
}: LoginFormProps) {
  return (
    <form action="/auth/login" method="post" className="space-y-5">
      <input type="hidden" name="next" value={nextPath} />

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-[#181816]"
        >
          邮箱
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="h-12 w-full rounded-xl border border-black/[0.08] bg-[#fbfbf8] px-4 text-sm text-[#181816] outline-none transition focus:border-[#7a8a6a] focus:bg-white focus:ring-2 focus:ring-[#dce5d3]"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-[#181816]"
        >
          密码
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={6}
          className="h-12 w-full rounded-xl border border-black/[0.08] bg-[#fbfbf8] px-4 text-sm text-[#181816] outline-none transition focus:border-[#7a8a6a] focus:bg-white focus:ring-2 focus:ring-[#dce5d3]"
        />
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}
      {message && (
        <p className="rounded-xl bg-[#eef3e9] px-4 py-3 text-sm text-[#5f7053]">
          {message}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="submit"
          className="flex h-12 w-full items-center justify-center rounded-xl bg-[#181816] text-sm font-semibold text-white shadow-[0_14px_32px_rgba(24,24,22,0.14)] transition hover:bg-[#2b2b28] active:scale-[0.99]"
        >
          登录
        </button>
        <button
          type="submit"
          formAction="/auth/signup"
          className="flex h-12 w-full items-center justify-center rounded-xl border border-black/[0.08] bg-white text-sm font-semibold text-[#181816] transition hover:bg-[#f2f2ed] active:scale-[0.99]"
        >
          注册账号
        </button>
      </div>
    </form>
  );
}
