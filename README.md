# KYLIE BORGE

Plataforma web privada de conteudo premium.

## Estado

- FASE 1 concluida: base tecnica, design system, rotas base.
- FASE 2 concluida: Supabase, migrations, RLS, Storage.
- FASE 3 concluida: autenticacao completa.
- FASE 3.5 concluida: checkout EscalePay (links), /checkout-return, /redeem, funcao SQL `redeem_access_code`, geracao de subscription a partir de codigo.
- FASE 4 pendente: Landing dinamica via `platform_settings`, teaser, paywall.

## Stack

- React + TypeScript + Vite
- Tailwind CSS v3
- React Router v6
- Supabase (cliente + auth + storage)
- PostgreSQL (via Supabase)

## Instalacao

```bash
npm install
cp .env.example .env
# preencher VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
npm run dev
```

## Scripts

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — build de producao (`vite build`)
- `npm run preview` — pre-visualizacao

## Variaveis de ambiente

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Secrets (EscalePay webhook, service role) NUNCA em `VITE_`.

## Base de dados

Migrations em `supabase/migrations/`:

- `0001_init_schema.sql`
- `0002_rls_policies.sql`
- `0003_storage_buckets.sql`
- `0004_seed_defaults.sql`
- `0005_plans_checkout.sql`
- `0006_redeem_function.sql`
- `0007_seed_checkout_urls.sql`

Aplicar por ordem no SQL Editor do Supabase.

## Fluxo comercial (FASE 3.5)

1. Cliente em `/plans` clica "Escolher {plano}".
2. Abre checkout EscalePay em nova aba.
3. Apos pagamento, admin gera codigo (manual ou via webhook FASE 10).
4. Cliente vai a `/redeem`, introduz o codigo `XXXX-XXXX-XXXX`.
5. Funcao SQL `redeem_access_code` valida e cria `subscription` com duracao do plano.
6. Acesso desbloqueado. Dashboard mostra plano activo e dias restantes.

### Seguranca do resgate

- A funcao `redeem_access_code` e `SECURITY DEFINER` com `search_path` fixo.
- Usa `for update` para impedir resgate duplo em paralelo.
- Valida: autenticacao, existencia, estado, expiracao, propriedade.
- Formato armazenado: `X7KM92QPL4ZT` (12 caracteres, uppercase, sem hifens).
- Formato exibido: `X7KM-92QP-L4ZT`.

## Rotas

- `/` — Landing
- `/age-gate` — Confirmacao +18
- `/plans` — Planos (dados reais)
- `/checkout-return` — Retorno do checkout EscalePay
- `/redeem` — Resgatar codigo de acesso
- `/login`, `/register`, `/forgot-password`, `/reset-password` — Auth
- `/dashboard` — Protegido
- `*` — 404

## Seguranca

- Age Gate e barreira de UX.
- Autorizacao real: RLS no Supabase.
- `service_role key` nunca no frontend.
- Signed URLs para conteudo protegido: apenas via Edge Function (fase futura).

## Pagamentos

EscalePay: webhook sera implementado na FASE 10. Doc analisada:
HMAC-SHA256 (`X-EscalePay-Signature`) ou token (`X-Webhook-Secret`);
backend aceitara ambos. Campo `test: true` ignorado em producao.

## Build

```bash
npm run build
```
