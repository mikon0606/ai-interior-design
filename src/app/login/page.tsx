import { LoginForm } from "@/app/login/LoginForm";
import { createAuthSupabase } from "@/lib/supabase/auth-server";
import Link from "next/link";
import { redirect } from "next/navigation";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = await createAuthSupabase();
  const { data } = await supabase.auth.getClaims();

  if (data?.claims) {
    redirect("/admin");
  }

  const params = await searchParams;
  const nextPath =
    params.next && params.next.startsWith("/") ? params.next : "/admin";

  return (
    <div className="min-h-screen bg-[#f6f6f3] px-4 py-12 text-[#181816] sm:px-6">
      <main className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center">
        <div className="w-full rounded-[20px] bg-white/85 p-6 shadow-[0_24px_80px_rgba(24,24,22,0.07)] ring-1 ring-black/[0.04] sm:p-7">
          <div className="mb-6">
            <Link
              href="/"
              className="text-sm font-semibold text-[#181816] transition hover:text-[#6f7f62]"
            >
              AI装修大师
            </Link>
            <h1 className="mt-8 text-2xl font-semibold tracking-tight">
              登录后台
            </h1>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              用 Supabase Auth 管理员账号进入任务处理后台。
            </p>
          </div>

          <LoginForm error={params.error} nextPath={nextPath} />
        </div>
      </main>
    </div>
  );
}
