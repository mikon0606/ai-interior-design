import { createServerClient } from "@supabase/ssr";
import { getSupabaseAuthEnv } from "@/lib/supabase/auth-env";
import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

function getSafeNext(next: FormDataEntryValue | null) {
  if (typeof next !== "string" || !next.startsWith("/") || next.startsWith("//")) {
    return "/my/tasks";
  }

  return next.startsWith("/admin") ? "/my/tasks" : next;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const next = formData.get("next");
  const destination = getSafeNext(next);

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", destination);

  if (typeof email !== "string" || typeof password !== "string") {
    loginUrl.searchParams.set("error", "请输入邮箱和密码");
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  if (password.length < 6) {
    loginUrl.searchParams.set("error", "密码至少需要 6 位");
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  let response = NextResponse.redirect(new URL(destination, request.url), {
    status: 303,
  });

  const { url, key } = getSupabaseAuthEnv();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.redirect(new URL(destination, request.url), {
          status: 303,
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
        Object.entries(headers).forEach(([name, value]) => {
          response.headers.set(name, value);
        });
      },
    },
  });

  const origin = request.nextUrl.origin;
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      emailRedirectTo: new URL("/auth/confirm?next=" + encodeURIComponent(destination), origin).toString(),
    },
  });

  if (error) {
    loginUrl.searchParams.set("error", error.message || "注册失败，请稍后重试");
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  if (data.session) {
    return response;
  }

  loginUrl.searchParams.set("message", "注册成功，请检查邮箱完成确认");
  return NextResponse.redirect(loginUrl, { status: 303 });
}
