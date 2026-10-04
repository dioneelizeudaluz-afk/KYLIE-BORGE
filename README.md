# KYLIE BORGE

Plataforma web privada de conteudo premium.

## Estado

- FASE 1 concluida: base tecnica, design system, rotas base.
- FASE 2 concluida: Supabase, migrations, RLS, Storage.
- FASE 3 concluida: autenticacao completa.
- FASE 3.5 concluida: checkout EscalePay + /redeem + funcao SQL `redeem_access_code`.
- FASE 8.1 concluida: Edge Function `generate-codes` (geracao de codigos, apenas admin).
- FASE 4 pendente: Landing dinamica, teaser, paywall.
- FASE 9 pendente: Admin UI completo.
- FASE 10 pendente: Webhook EscalePay (automacao total).

## Stack

- React + TypeScript + Vite
- Tailwind CSS v3
- React Router v6
- Supabase (cliente + auth + storage + edge functions)

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

## Base de dados

Migrations em `supabase/migrations/`:

- `0001_init_schema.sql`
- `0002_rls_policies.sql`
- `0003_storage_buckets.sql`
- `0004_seed_defaults.sql`
- `0005_plans_checkout.sql`
- `0006_redeem_function.sql`
- `0007_seed_checkout_urls.sql`

## Edge Functions

- `generate-codes` — gera codigos de acesso para um plano.
  Instrucoes completas em `supabase/functions/README-EDGE.md`.

## Fluxo comercial

1. Cliente escolhe plano em `/plans`.
2. Abre checkout EscalePay em nova aba.
3. Admin gera codigo (Edge Function `generate-codes`, ou via painel Supabase).
4. Admin envia codigo ao cliente.
5. Cliente vai a `/redeem`, introduz o codigo.
6. `redeem_access_code` cria `subscription` com duracao do plano.
7. Acesso desbloqueado.

## Rotas

- `/` — Landing
- `/age-gate` — +18
- `/plans` — Planos
- `/checkout-return` — Retorno EscalePay
- `/redeem` — Resgatar codigo
- `/login`, `/register`, `/forgot-password`, `/reset-password`
- `/dashboard` — Protegido
- `*` — 404

## Seguranca

- RLS em todas as tabelas.
- `redeem_access_code` e `SECURITY DEFINER` com `search_path = public`.
- `generate-codes` verifica admin no servidor (JWT + `profiles.role`).
- `service_role key` nunca no frontend.

## Pagamentos

EscalePay (checkout externo). Webhook sera implementado na FASE 10.

## Build

```bash
npm run build
```
