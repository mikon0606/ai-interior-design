import { createServerClient } from "@supabase/ssr";
import { getSupabaseAuthEnv } from "@/lib/supabase/auth-env";
import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const next = formData.get("next");

  const loginUrl = new URL("/login", request.url);
  if (typeof next === "string" && next.startsWith("/")) {
    loginUrl.searchParams.set("next", next);
  }

  if (typeof email !== "string" || typeof password !== "string") {
    loginUrl.searchParams.set("error", "请输入邮箱和密码");
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  const destination =
    typeof next === "string" && next.startsWith("/") ? next : "/admin";
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

  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    loginUrl.searchParams.set("error", "邮箱或密码不正确");
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  return response;
}
