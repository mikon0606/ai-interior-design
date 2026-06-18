import { SignupForm } from "@/app/signup/SignupForm";
import { getAuthClaims } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

type SignupPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
    next?: string;
  }>;
};

export const dynamic = "force-dynamic";

function getSafeNext(next?: string) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/my/tasks";
  }

  return next.startsWith("/admin") ? "/my/tasks" : next;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;
  const nextPath = getSafeNext(params.next);
  const claims = await getAuthClaims();

  if (claims) {
    redirect(nextPath);
  }

  return (
    <div className="min-h-screen bg-[#f6f6f3] px-4 py-12 text-[#181816] sm:px-6">
      <main className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-sm items-center">
        <div className="w-full rounded-[18px] bg-white/88 p-6 shadow-[0_24px_80px_rgba(24,24,22,0.07)] ring-1 ring-black/[0.04] sm:p-7">
          <div className="mb-6">
            <Link
              href="/"
              className="text-sm font-semibold text-[#181816] transition hover:text-[#6f7f62]"
            >
              AI装修大师
            </Link>
            <h1 className="mt-8 text-2xl font-semibold tracking-tight">
              注册
            </h1>
          </div>

          <SignupForm
            error={params.error}
            message={params.message}
            nextPath={nextPath}
          />
        </div>
      </main>
    </div>
  );
}
