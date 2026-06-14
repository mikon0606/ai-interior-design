import { createAuthSupabase } from "@/lib/supabase/auth-server";
import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const supabase = await createAuthSupabase();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("message", "已退出登录");
  return NextResponse.redirect(loginUrl, { status: 303 });
}
