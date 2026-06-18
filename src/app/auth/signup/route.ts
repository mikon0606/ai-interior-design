import { createServerClient } from "@supabase/ssr";
import { getPublicOrigin } from "@/lib/public-origin";
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
  const confirmPassword = formData.get("confirmPassword");
  const destination = getSafeNext(formData.get("next"));
  const publicOrigin = getPublicOrigin(request);

  const signupUrl = new URL("/signup", publicOrigin);
  signupUrl.searchParams.set("next", destination);

  if (typeof email !== "string" || typeof password !== "string") {
    signupUrl.searchParams.set("error", "请输入邮箱和密码");
    return NextResponse.redirect(signupUrl, { status: 303 });
  }

  if (password.length < 6) {
    signupUrl.searchParams.set("error", "密码至少需要 6 位");
    return NextResponse.redirect(signupUrl, { status: 303 });
  }

  if (confirmPassword !== password) {
    signupUrl.searchParams.set("error", "两次输入的密码不一致");
    return NextResponse.redirect(signupUrl, { status: 303 });
  }

  let response = NextResponse.redirect(new URL(destination, publicOrigin), {
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
        response = NextResponse.redirect(new URL(destination, publicOrigin), {
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

  const confirmationUrl = new URL("/login", publicOrigin);
  confirmationUrl.searchParams.set("message", "邮箱确认成功，请登录");
  confirmationUrl.searchParams.set("next", destination);
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      emailRedirectTo: confirmationUrl.toString(),
    },
  });

  if (error) {
    signupUrl.searchParams.set(
      "error",
      error.code === "user_already_exists"
        ? "该邮箱已注册；如未确认邮箱，请点击重发确认邮件"
        : "注册失败，请稍后重试",
    );
    return NextResponse.redirect(signupUrl, { status: 303 });
  }

  if (data.session) {
    return response;
  }

  signupUrl.searchParams.set("message", "注册成功，请到邮箱点击确认链接");
  return NextResponse.redirect(signupUrl, { status: 303 });
}
