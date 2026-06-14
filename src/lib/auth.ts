import "server-only";

import { createAuthSupabase } from "@/lib/supabase/auth-server";

export type AuthClaims = {
  sub: string;
  email?: string;
  [key: string]: unknown;
};

export async function getAuthClaims(): Promise<AuthClaims | null> {
  const supabase = await createAuthSupabase();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims || typeof claims.sub !== "string") {
    return null;
  }

  return claims as AuthClaims;
}
