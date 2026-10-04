import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";
import { ensureAdmin } from "../_shared/auth.ts";
import { generateFormattedCode, normalizeCode } from "../_shared/codes.ts";

interface RequestBody {
  plan_slug?: string;
  quantity?: number;
  expires_at?: string | null;
}

interface GeneratedCode {
  id: string;
  code: string;
  plan_id: string;
  plan_slug: string;
  status: string;
  created_at: string;
  expires_at: string | null;
}

const MAX_QUANTITY = 200;
const MAX_RETRIES_PER_CODE = 5;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ ok: false, error: "METHOD_NOT_ALLOWED" }, 405);
  }

  const admin = await ensureAdmin(req);
  if (!admin.ok) {
    return jsonResponse({ ok: false, error: admin.reason ?? "NAO_AUTORIZADO" }, 403);
  }

  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return jsonResponse({ ok: false, error: "JSON_INVALIDO" }, 400);
  }

  const planSlug = (body.plan_slug ?? "").trim().toLowerCase();
  const quantity = Number.isFinite(body.quantity) ? Number(body.quantity) : 0;
  const expiresAt = body.expires_at ?? null;

  if (!planSlug) {
    return jsonResponse({ ok: false, error: "PLAN_SLUG_OBRIGATORIO" }, 400);
  }
  if (quantity < 1 || quantity > MAX_QUANTITY) {
    return jsonResponse(
      { ok: false, error: `QUANTITY_DEVE_SER_ENTRE_1_E_${MAX_QUANTITY}` },
      400
    );
  }

  const { data: plan, error: planError } = await supabaseAdmin
    .from("plans")
    .select("id, slug, name, duration_hours, active")
    .eq("slug", planSlug)
    .maybeSingle();

  if (planError) {
    return jsonResponse({ ok: false, error: "ERRO_A_CONSULTAR_PLANO" }, 500);
  }
  if (!plan) {
    return jsonResponse({ ok: false, error: "PLANO_NAO_ENCONTRADO" }, 404);
  }
  if (!plan.active) {
    return jsonResponse({ ok: false, error: "PLANO_INACTIVO" }, 400);
  }

  const created: GeneratedCode[] = [];
  const usedRaw = new Set<string>();

  for (let i = 0; i < quantity; i += 1) {
    let inserted: GeneratedCode | null = null;
    let attempts = 0;

    while (!inserted && attempts < MAX_RETRIES_PER_CODE) {
      attempts += 1;
      const formatted = generateFormattedCode();
      const raw = normalizeCode(formatted);

      if (usedRaw.has(raw)) continue;
      usedRaw.add(raw);

      const { data, error } = await supabaseAdmin
        .from("access_codes")
        .insert({
          code: raw,
          plan_id: plan.id,
          status: "available",
          expires_at: expiresAt
        })
        .select("id, code, plan_id, status, created_at, expires_at")
        .single();

      if (error) {
        const message = (error.message ?? "").toLowerCase();
        if (message.includes("duplicate") || message.includes("unique")) {
          continue;
        }
        return jsonResponse(
          { ok: false, error: "ERRO_A_INSERIR", details: error.message },
          500
        );
      }

      if (data) {
        inserted = {
          id: data.id,
          code: formatCodeFromRaw(data.code),
          plan_id: data.plan_id,
          plan_slug: plan.slug,
          status: data.status,
          created_at: data.created_at,
          expires_at: data.expires_at
        };
      }
    }

    if (!inserted) {
      return jsonResponse(
        {
          ok: false,
          error: "NAO_FOI_POSSIVEL_GERAR_CODIGO_UNICO",
          generated_so_far: created.length
        },
        500
      );
    }

    created.push(inserted);
  }

  return jsonResponse({
    ok: true,
    plan: plan.name,
    plan_slug: plan.slug,
    quantity: created.length,
    codes: created.map((c) => c.code)
  });
});

function formatCodeFromRaw(raw: string): string {
  const parts: string[] = [];
  for (let i = 0; i < raw.length; i += 4) {
    parts.push(raw.slice(i, i + 4));
  }
  return parts.join("-");
}
