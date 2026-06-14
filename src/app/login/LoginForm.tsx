"use client";

type LoginFormProps = {
  error?: string;
  nextPath?: string;
};

export function LoginForm({ error, nextPath = "/admin" }: LoginFormProps) {
  return (
    <form action="/auth/login" method="post" className="space-y-5">
      <input type="hidden" name="next" value={nextPath} />

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-[#181816]"
        >
          管理员邮箱
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
          className="h-12 w-full rounded-xl border border-black/[0.08] bg-[#fbfbf8] px-4 text-sm text-[#181816] outline-none transition focus:border-[#7a8a6a] focus:bg-white focus:ring-2 focus:ring-[#dce5d3]"
        />
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="flex h-12 w-full items-center justify-center rounded-xl bg-[#181816] text-sm font-semibold text-white shadow-[0_14px_32px_rgba(24,24,22,0.14)] transition hover:bg-[#2b2b28] active:scale-[0.99]"
      >
        登录后台
      </button>
    </form>
  );
}
