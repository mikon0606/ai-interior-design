import { createServerClient } from "@supabase/ssr";
import { getPublicOrigin } from "@/lib/public-origin";
import { getSupabaseAuthEnv } from "@/lib/supabase/auth-env";
import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

function getSafeNext(next: FormDataEntryValue | null) {
  if (typeof next !== "string" || !next.startsWith("/") || next.startsWith("//")) {
    return "/my/tasks";
  }

  return next;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const destination = getSafeNext(formData.get("next"));
  const publicOrigin = getPublicOrigin(request);

  const loginUrl = new URL("/login", publicOrigin);
  loginUrl.searchParams.set("next", destination);

  if (typeof email !== "string" || typeof password !== "string") {
    loginUrl.searchParams.set("error", "请输入邮箱和密码");
    return NextResponse.redirect(loginUrl, { status: 303 });
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

  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    if (error.code === "email_not_confirmed") {
      const signupUrl = new URL("/signup", publicOrigin);
      signupUrl.searchParams.set("next", destination);
      signupUrl.searchParams.set(
        "error",
        "邮箱尚未确认，请先点击确认邮件；未收到可在这里重发",
      );
      return NextResponse.redirect(signupUrl, { status: 303 });
    }

    loginUrl.searchParams.set("error", "邮箱或密码不正确");
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  return response;
}
