import { requireSupabase } from "../lib/supabase";
import type { Database } from "../types/database";

export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
export type Plan = Database["public"]["Tables"]["plans"]["Row"];

export interface ActiveSubscription {
  subscription: Subscription;
  plan: Plan;
  daysRemaining: number;
}

export async function getMyActiveSubscription(): Promise<ActiveSubscription | null> {
  const supabase = requireSupabase();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return null;

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*, plan:plans(*)")
    .eq("user_id", userData.user.id)
    .eq("status", "active")
    .gt("expires_at", new Date().toISOString())
    .order("expires_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;

  const row = data as Subscription & { plan: Plan | null };
  if (!row.plan) return null;

  const msRemaining = new Date(row.expires_at).getTime() - Date.now();
  const daysRemaining = Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));

  return {
    subscription: {
      id: row.id,
      user_id: row.user_id,
      plan_id: row.plan_id,
      status: row.status,
      started_at: row.started_at,
      expires_at: row.expires_at,
      created_at: row.created_at,
      updated_at: row.updated_at
    },
    plan: row.plan,
    daysRemaining
  };
}
