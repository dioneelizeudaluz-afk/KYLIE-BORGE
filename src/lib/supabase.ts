import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types/database";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseConfigError: string | null =
  !url || !anonKey
    ? "Supabase nao configurado. Define VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no ficheiro .env e reinicia o servidor."
    : null;

export const supabase: SupabaseClient<Database> | null = supabaseConfigError
  ? null
  : createClient<Database>(url as string, anonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });

export function requireSupabase(): SupabaseClient<Database> {
  if (!supabase) {
    throw new Error(supabaseConfigError ?? "Supabase indisponivel");
  }
  return supabase;
}
