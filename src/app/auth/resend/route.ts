import { createClient } from "@supabase/supabase-js";
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
  const destination = getSafeNext(formData.get("next"));
  const publicOrigin = getPublicOrigin(request);
  const signupUrl = new URL("/signup", publicOrigin);
  signupUrl.searchParams.set("next", destination);

  if (typeof email !== "string" || !email.trim()) {
    signupUrl.searchParams.set("error", "请输入邮箱后再重发确认邮件");
    return NextResponse.redirect(signupUrl, { status: 303 });
  }

  const confirmationUrl = new URL("/login", publicOrigin);
  confirmationUrl.searchParams.set("message", "邮箱确认成功，请登录");
  confirmationUrl.searchParams.set("next", destination);

  const { url, key } = getSupabaseAuthEnv();
  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: email.trim(),
    options: { emailRedirectTo: confirmationUrl.toString() },
  });

  if (error) {
    signupUrl.searchParams.set(
      "error",
      error.code === "over_email_send_rate_limit"
        ? "发送太频繁，请稍后再试"
        : "确认邮件发送失败，请稍后再试",
    );
    return NextResponse.redirect(signupUrl, { status: 303 });
  }

  signupUrl.searchParams.set("message", "确认邮件已重新发送，请检查邮箱");
  return NextResponse.redirect(signupUrl, { status: 303 });
}
