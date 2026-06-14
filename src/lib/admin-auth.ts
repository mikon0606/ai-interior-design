import "server-only";

import { getAuthClaims, type AuthClaims } from "@/lib/auth";

function getAdminEmailSet() {
  const raw = process.env.ADMIN_EMAILS ?? process.env.ADMIN_NOTIFY_EMAIL ?? "";
  return new Set(
    raw
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export async function getAdminClaims(): Promise<AuthClaims | null> {
  const claims = await getAuthClaims();
  const email = claims?.email?.toLowerCase();

  if (!claims || !email) {
    return null;
  }

  return getAdminEmailSet().has(email) ? claims : null;
}
