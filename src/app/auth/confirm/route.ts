import { createServerClient } from "@supabase/ssr";
import type { EmailOtpType } from "@supabase/supabase-js";
import { getPublicOrigin } from "@/lib/public-origin";
import { getSupabaseAuthEnv } from "@/lib/supabase/auth-env";
import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

function getSafeNext(next: string | null) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/my/tasks";
  }

  return next.startsWith("/admin") ? "/my/tasks" : next;
}

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");
  const destination = getSafeNext(request.nextUrl.searchParams.get("next"));
  const publicOrigin = getPublicOrigin(request);

  const loginUrl = new URL("/login", publicOrigin);
  loginUrl.searchParams.set("next", destination);

  if (!tokenHash || !type) {
    loginUrl.searchParams.set("error", "确认链接无效");
    return NextResponse.redirect(loginUrl);
  }

  let response = NextResponse.redirect(new URL(destination, publicOrigin));
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
        response = NextResponse.redirect(new URL(destination, publicOrigin));
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
        Object.entries(headers).forEach(([name, value]) => {
          response.headers.set(name, value);
        });
      },
    },
  });

  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: type as EmailOtpType,
  });

  if (error) {
    loginUrl.searchParams.set("error", "邮箱确认失败，请重新登录或注册");
    return NextResponse.redirect(loginUrl);
  }

  return response;
}
