# Edge Functions — KYLIE BORGE

## generate-codes

Gera codigos de acesso unicos (`X7KM-92QP-L4ZT`) para um plano.
Apenas admins podem chamar.

### Como deployar

#### Opcao A — Via painel Supabase (recomendado se nao tens CLI)

1. Abre `supabase.com/dashboard` -> teu projecto -> **Edge Functions** (menu lateral).
2. Clica **Create a new function**.
3. Nome: `generate-codes`.
4. Vai ao GitHub, abre `supabase/functions/generate-codes/index.ts`, copia o conteudo, cola no editor do painel.
5. Clica **Deploy**.
6. Repete para os ficheiros partilhados, se o painel o permitir. Caso contrario, cola tudo num unico ficheiro `index.ts` (o painel faz bundle automatico de imports relativos, mas nao de pastas em alguns casos).

Se o painel nao aceitar imports de `../_shared/`, cola este ficheiro unico no editor:

```ts
// index.ts (versao unica, sem imports relativos)
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function generateFormattedCode(): string {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  let raw = "";
  for (let i = 0; i < 12; i += 1) raw += ALPHABET[bytes[i] % ALPHABET.length];
  return `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}`;
}

function normalizeCode(input: string): string {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ ok: false, error: "METHOD_NOT_ALLOWED" }, 405);

  const authHeader = req.headers.get("Authorization") ?? req.headers.get("authorization");
  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
    return jsonResponse({ ok: false, error: "SEM_TOKEN" }, 403);
  }
  const token = authHeader.slice(7).trim();

  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return jsonResponse({ ok: false, error: "ENV_EM_FALTA" }, 500);

  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const { data: userData, error: userError } = await admin.auth.getUser(token);
  if (userError || !userData.user) return jsonResponse({ ok: false, error: "TOKEN_INVALIDO" }, 403);

  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") return jsonResponse({ ok: false, error: "NAO_ADMIN" }, 403);

  let body: { plan_slug?: string; quantity?: number; expires_at?: string | null } = {};
  try { body = await req.json(); } catch { return jsonResponse({ ok: false, error: "JSON_INVALIDO" }, 400); }

  const planSlug = (body.plan_slug ?? "").trim().toLowerCase();
  const quantity = Number.isFinite(body.quantity) ? Number(body.quantity) : 0;
  const expiresAt = body.expires_at ?? null;

  if (!planSlug) return jsonResponse({ ok: false, error: "PLAN_SLUG_OBRIGATORIO" }, 400);
  if (quantity < 1 || quantity > 200) return jsonResponse({ ok: false, error: "QUANTITY_INVALIDA" }, 400);

  const { data: plan } = await admin.from("plans").select("id, slug, name, active").eq("slug", planSlug).maybeSingle();
  if (!plan) return jsonResponse({ ok: false, error: "PLANO_NAO_ENCONTRADO" }, 404);
  if (!plan.active) return jsonResponse({ ok: false, error: "PLANO_INACTIVO" }, 400);

  const created: string[] = [];
  for (let i = 0; i < quantity; i += 1) {
    let inserted = false;
    let attempts = 0;
    while (!inserted && attempts < 5) {
      attempts += 1;
      const formatted = generateFormattedCode();
      const raw = normalizeCode(formatted);
      const { error } = await admin.from("access_codes").insert({
        code: raw, plan_id: plan.id, status: "available", expires_at: expiresAt
      });
      if (error) {
        if ((error.message ?? "").toLowerCase().includes("duplicate")) continue;
        return jsonResponse({ ok: false, error: "ERRO_A_INSERIR", details: error.message }, 500);
      }
      created.push(formatted);
      inserted = true;
    }
  }

  return jsonResponse({ ok: true, plan: plan.name, plan_slug: plan.slug, quantity: created.length, codes: created });
});
```

#### Opcao B — Via Supabase CLI

```bash
supabase functions deploy generate-codes --project-ref <o-teu-project-ref>
```

### Como usar

1. Painel Supabase -> **Edge Functions** -> `generate-codes` -> **Invoke**.
2. No campo do corpo (JSON), cola:

```json
{ "plan_slug": "pro", "quantity": 10 }
```

3. Clica **Send** (o painel adiciona automaticamente o JWT do utilizador logado).
4. A resposta tem os codigos:

```json
{
  "ok": true,
  "plan": "Pro",
  "plan_slug": "pro",
  "quantity": 10,
  "codes": ["X7KM-92QP-L4ZT", "..."]
}
```

5. Copia os codigos e envia aos clientes.

### Parametros aceitos

| Campo | Tipo | Obrigatorio | Descricao |
|---|---|---|---|
| `plan_slug` | string | Sim | `teste`, `pro`, `premium` |
| `quantity` | number | Sim | 1 a 200 |
| `expires_at` | string\|null | Nao | Data ISO de expiracao da chave (opcional) |

### Seguranca

- A funcao valida o JWT do chamador via `auth.getUser(token)`.
- Consulta `profiles.role`. Se nao for `admin`, devolve 403.
- Usa `SUPABASE_SERVICE_ROLE_KEY` (auto-injectado pelo Supabase). Nunca exposto ao cliente.
- Codigos gerados com `crypto.getRandomValues` (Deno nativo).
- Alfabeto sem caracteres ambiguos (sem 0/O/1/I/L).
- Colisoes tratadas com retry simples.

### Testar sem admin

Se nao tiveres conta admin, promove-te a admin:

```sql
update public.profiles set role = 'admin' where user_id = '<uuid-do-user>';
```

O `<uuid-do-user>` encontra-se em `Authentication -> Users` no painel Supabase.
