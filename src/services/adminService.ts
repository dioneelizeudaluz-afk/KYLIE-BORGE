import { requireSupabase } from "../lib/supabase";
import type { Database } from "../types/database";

export type Plan = Database["public"]["Tables"]["plans"]["Row"];
export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type AccessCode = Database["public"]["Tables"]["access_codes"]["Row"];
export type Payment = Database["public"]["Tables"]["payments"]["Row"];

export interface AdminStats {
  totalClients: number;
  activeSubscriptions: number;
  totalRevenue: number;
  availableCodes: number;
  activePlans: number;
  approvedPayments: number;
}

export interface ClientWithPlan {
  profile: Profile;
  activePlan: Plan | null;
  expiresAt: string | null;
}

export interface CodeWithPlan {
  code: AccessCode;
  plan: Plan | null;
}

export async function getStats(): Promise<AdminStats> {
  const supabase = requireSupabase();

  const [clients, activeSubs, codes, plans, payments] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase
      .from("subscriptions")
      .select("id", { count: "exact", head: true })
      .eq("status", "active")
      .gt("expires_at", new Date().toISOString()),
    supabase
      .from("access_codes")
      .select("id", { count: "exact", head: true })
      .eq("status", "available"),
    supabase
      .from("plans")
      .select("id", { count: "exact", head: true })
      .eq("active", true),
    supabase.from("payments").select("amount, status")
  ]);

  const approved = (payments.data ?? []).filter((p) => p.status === "approved");
  const totalRevenue = approved.reduce((sum, p) => sum + Number(p.amount ?? 0), 0);

  return {
    totalClients: clients.count ?? 0,
    activeSubscriptions: activeSubs.count ?? 0,
    totalRevenue,
    availableCodes: codes.count ?? 0,
    activePlans: plans.count ?? 0,
    approvedPayments: approved.length
  };
}

export async function listClients(): Promise<ClientWithPlan[]> {
  const supabase = requireSupabase();

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (profilesError) throw new Error(profilesError.message);
  if (!profiles || profiles.length === 0) return [];

  const { data: subs, error: subsError } = await supabase
    .from("subscriptions")
    .select("*, plan:plans(*)")
    .eq("status", "active")
    .gt("expires_at", new Date().toISOString())
    .order("expires_at", { ascending: false });

  if (subsError) throw new Error(subsError.message);

  const subByUser = new Map<string, { plan: Plan | null; expiresAt: string }>();
  for (const s of subs ?? []) {
    const row = s as Subscription & { plan: Plan | null };
    if (!subByUser.has(row.user_id)) {
      subByUser.set(row.user_id, { plan: row.plan, expiresAt: row.expires_at });
    }
  }

  return profiles.map((p) => {
    const found = subByUser.get(p.user_id);
    return {
      profile: p,
      activePlan: found?.plan ?? null,
      expiresAt: found?.expiresAt ?? null
    };
  });
}

export async function listAllPlans(): Promise<Plan[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase.from("plans").select("*").order("level");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export interface UpdatePlanInput {
  price?: number;
  description?: string | null;
  checkout_url?: string | null;
  active?: boolean;
}

export async function updatePlan(id: string, input: UpdatePlanInput): Promise<Plan> {
  const supabase = requireSupabase();

  const payload: UpdatePlanInput = {};
  if (input.price !== undefined) payload.price = input.price;
  if (input.description !== undefined) payload.description = input.description;
  if (input.checkout_url !== undefined) payload.checkout_url = input.checkout_url;
  if (input.active !== undefined) payload.active = input.active;

  const { data, error } = await supabase
    .from("plans")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Plano nao encontrado");
  return data;
}

export type CodeFilter = "all" | "available" | "used" | "disabled" | "expired";

export async function listAllCodes(
  filter: CodeFilter = "all",
  planId: string | null = null
): Promise<CodeWithPlan[]> {
  const supabase = requireSupabase();

  let query = supabase
    .from("access_codes")
    .select("*, plan:plans(*)")
    .order("created_at", { ascending: false })
    .limit(500);

  if (filter !== "all") query = query.eq("status", filter);
  if (planId) query = query.eq("plan_id", planId);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => {
    const r = row as AccessCode & { plan: Plan | null };
    const { plan, ...code } = r;
    return { code: code as AccessCode, plan };
  });
}

export interface CreateCodesResult {
  ok: boolean;
  codes?: string[];
  error?: string;
  details?: string;
}

export async function createCodes(planSlug: string, quantity: number): Promise<CreateCodesResult> {
  const supabase = requireSupabase();

  const { data, error } = await supabase.rpc("admin_generate_codes", {
    plan_slug_input: planSlug,
    quantity_input: quantity
  });

  if (error) {
    return { ok: false, error: "FALHA_NA_FUNCAO", details: error.message };
  }

  const payload = data as { ok?: boolean; codes?: string[]; error?: string; details?: string };
  if (!payload || payload.ok !== true) {
    return {
      ok: false,
      error: payload?.error ?? "ERRO_DESCONHECIDO",
      details: payload?.details
    };
  }

  return { ok: true, codes: payload.codes ?? [] };
}

export async function setCodeStatus(
  id: string,
  status: "available" | "disabled"
): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from("access_codes").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteAvailableCode(id: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase
    .from("access_codes")
    .delete()
    .eq("id", id)
    .eq("status", "available");
  if (error) throw new Error(error.message);
}

export async function listPayments(): Promise<Payment[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw new Error(error.message);
  return data ?? [];
}
