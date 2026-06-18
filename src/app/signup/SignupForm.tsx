"use client";

import Link from "next/link";

type SignupFormProps = {
  error?: string;
  message?: string;
  nextPath?: string;
};

export function SignupForm({
  error,
  message,
  nextPath = "/my/tasks",
}: SignupFormProps) {
  return (
    <form action="/auth/signup" method="post" className="space-y-5">
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
          autoComplete="new-password"
          required
          minLength={6}
          className="h-12 w-full rounded-xl border border-black/[0.08] bg-[#fbfbf8] px-4 text-sm text-[#181816] outline-none transition focus:border-[#7a8a6a] focus:bg-white focus:ring-2 focus:ring-[#dce5d3]"
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-2 block text-sm font-medium text-[#181816]"
        >
          确认密码
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          className="h-12 w-full rounded-xl border border-black/[0.08] bg-[#fbfbf8] px-4 text-sm text-[#181816] outline-none transition focus:border-[#7a8a6a] focus:bg-white focus:ring-2 focus:ring-[#dce5d3]"
        />
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm leading-6 text-red-600">
          {error}
        </p>
      )}
      {message && (
        <p className="rounded-xl bg-[#eef3e9] px-4 py-3 text-sm leading-6 text-[#5f7053]">
          {message}
        </p>
      )}

      <button
        type="submit"
        className="flex h-12 w-full items-center justify-center rounded-xl bg-[#181816] text-sm font-semibold text-white shadow-[0_14px_32px_rgba(24,24,22,0.14)] transition hover:bg-[#2b2b28] active:scale-[0.99]"
      >
        注册
      </button>

      <div className="flex items-center justify-center gap-3 text-sm">
        <Link
          href={"/login?next=" + encodeURIComponent(nextPath)}
          className="text-neutral-500 transition hover:text-[#181816]"
        >
          返回登录
        </Link>
        <span className="text-neutral-300">|</span>
        <button
          type="submit"
          formAction="/auth/resend"
          formNoValidate
          className="text-neutral-500 transition hover:text-[#181816]"
        >
          重发确认邮件
        </button>
      </div>
    </form>
  );
}
