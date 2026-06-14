import "server-only";

import { createAuthSupabase } from "@/lib/supabase/auth-server";

export async function getAdminClaims() {
  const supabase = await createAuthSupabase();
  const { data } = await supabase.auth.getClaims();
  return data?.claims ?? null;
}
