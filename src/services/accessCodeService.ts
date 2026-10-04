import { requireSupabase } from "../lib/supabase";
import type { Database } from "../types/database";

export type AccessCode = Database["public"]["Tables"]["access_codes"]["Row"];

export interface RedeemSuccess {
  ok: true;
  plan_name: string;
  plan_slug: string;
  expires_at: string;
  subscription_id: string;
}

export interface RedeemFailure {
  ok: false;
  error: string;
}

export type RedeemResult = RedeemSuccess | RedeemFailure;

interface RawRedeemResult {
  ok?: boolean;
  error?: string;
  plan_name?: string;
  plan_slug?: string;
  expires_at?: string;
  subscription_id?: string;
}

export const REDEEM_ERROR_MESSAGES: Record<string, string> = {
  NAO_AUTENTICADO: "Precisas de estar autenticado para resgatar um codigo.",
  CHAVE_INVALIDA: "Codigo invalido. Verifica e tenta novamente.",
  CHAVE_INDISPONIVEL: "Este codigo ja nao esta disponivel.",
  CHAVE_EXPIRADA: "Este codigo expirou.",
  CHAVE_DE_OUTRO_UTILIZADOR: "Este codigo pertence a outro utilizador.",
  PLANO_INEXISTENTE: "O plano associado ao codigo nao existe.",
  ERRO_INTERNO: "Erro inesperado. Tenta novamente mais tarde."
};

export async function redeemCode(code: string): Promise<RedeemResult> {
  const supabase = requireSupabase();

  const { data, error } = await supabase.rpc("redeem_access_code", {
    code_input: code
  });

  if (error) {
    return { ok: false, error: "ERRO_INTERNO" };
  }

  const raw = (data ?? {}) as RawRedeemResult;

  if (raw.ok === true && raw.plan_name && raw.plan_slug && raw.expires_at && raw.subscription_id) {
    return {
      ok: true,
      plan_name: raw.plan_name,
      plan_slug: raw.plan_slug,
      expires_at: raw.expires_at,
      subscription_id: raw.subscription_id
    };
  }

  return { ok: false, error: raw.error ?? "ERRO_INTERNO" };
}

export async function listMyCodes(): Promise<AccessCode[]> {
  const supabase = requireSupabase();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return [];

  const { data, error } = await supabase
    .from("access_codes")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export function formatCodeForDisplay(code: string): string {
  const clean = code.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const parts: string[] = [];
  for (let i = 0; i < clean.length && parts.length < 3; i += 4) {
    parts.push(clean.slice(i, i + 4));
  }
  return parts.join("-");
}
