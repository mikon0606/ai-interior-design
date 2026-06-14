import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseAuthEnv } from "@/lib/supabase/auth-env";

export async function createAuthSupabase() {
  const cookieStore = await cookies();
  const { url, key } = getSupabaseAuthEnv();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies. Proxy and route handlers handle writes.
        }
      },
    },
  });
}
