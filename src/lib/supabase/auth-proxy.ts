import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAuthEnv } from "@/lib/supabase/auth-env";

const ADMIN_PATHS = ["/admin", "/api/admin"];

function isAdminPath(pathname: string) {
  return ADMIN_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + "/"),
  );
}

function getSafeLoginRedirect(request: NextRequest) {
  const next = request.nextUrl.searchParams.get("next");

  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/my/tasks";
  }

  return next.startsWith("/admin") ? "/my/tasks" : next;
}

export async function updateAuthSession(request: NextRequest) {
  let response = NextResponse.next({ request });
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
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
        Object.entries(headers).forEach(([name, value]) => {
          response.headers.set(name, value);
        });
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const isLoggedIn = Boolean(data?.claims);
  const { pathname } = request.nextUrl;

  if (isAdminPath(pathname) && !isLoggedIn) {
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "请先登录后台" }, { status: 401 });
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/login" && isLoggedIn) {
    const destinationUrl = request.nextUrl.clone();
    destinationUrl.pathname = getSafeLoginRedirect(request);
    destinationUrl.search = "";
    return NextResponse.redirect(destinationUrl);
  }

  return response;
}
