import { supabaseAdmin } from "./supabaseAdmin.ts";

export interface AdminCheckResult {
  ok: boolean;
  userId?: string;
  reason?: string;
}

export async function ensureAdmin(req: Request): Promise<AdminCheckResult> {
  const authHeader = req.headers.get("Authorization") ?? req.headers.get("authorization");
  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
    return { ok: false, reason: "SEM_TOKEN" };
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return { ok: false, reason: "SEM_TOKEN" };
  }

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
  if (userError || !userData.user) {
    return { ok: false, reason: "TOKEN_INVALIDO" };
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return { ok: false, reason: "SEM_PROFILE" };
  }

  if (profile.role !== "admin") {
    return { ok: false, reason: "NAO_ADMIN" };
  }

  return { ok: true, userId: userData.user.id };
}
