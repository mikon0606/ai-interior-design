import { type NextRequest } from "next/server";
import { updateAuthSession } from "@/lib/supabase/auth-proxy";

export async function middleware(request: NextRequest) {
  return updateAuthSession(request);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/login", "/auth/:path*"],
};
