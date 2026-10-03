import { supabase } from "../lib/supabase";
import type { Database } from "../types/database";

export type Plan = Database["public"]["Tables"]["plans"]["Row"];

export async function listActivePlans(): Promise<Plan[]> {
  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .eq("active", true)
    .order("level", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
