import { requireSupabase } from "../lib/supabase";

export interface ReserveResult {
  ok: boolean;
  code?: string;
  plan_name?: string;
  plan_slug?: string;
  error?: string;
}

interface RawReserveResult {
  ok?: boolean;
  code?: string;
  plan_name?: string;
  plan_slug?: string;
  error?: string;
}

export const RESERVE_ERROR_MESSAGES: Record<string, string> = {
  NAO_AUTENTICADO: "Precisas de estar autenticado para receber o teu codigo.",
  JA_RECLAMOU_RECENTEMENTE: "Ja recebeste um codigo nas ultimas 24 horas.",
  PLANO_NAO_ENCONTRADO: "Plano nao encontrado.",
  SEM_CODIGOS_DISPONIVEIS:
    "Nao existem codigos disponiveis para este plano. Contacta o suporte.",
  ERRO_INTERNO: "Erro inesperado. Tenta novamente mais tarde."
};

export async function reserveCodeByPlan(planSlug: string): Promise<ReserveResult> {
  const supabase = requireSupabase();

  const { data, error } = await supabase.rpc("reserve_code_by_plan", {
    plan_slug_input: planSlug
  });

  if (error) {
    return { ok: false, error: "ERRO_INTERNO" };
  }

  const raw = (data ?? {}) as RawReserveResult;

  if (raw.ok === true && raw.code && raw.plan_name && raw.plan_slug) {
    return {
      ok: true,
      code: raw.code,
      plan_name: raw.plan_name,
      plan_slug: raw.plan_slug
    };
  }

  return { ok: false, error: raw.error ?? "ERRO_INTERNO" };
}

export function formatCode(raw: string): string {
  const parts: string[] = [];
  for (let i = 0; i < raw.length; i += 4) parts.push(raw.slice(i, i + 4));
  return parts.join("-");
}
