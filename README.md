# KYLIE BORGE

Plataforma web privada de conteudo premium.

## Estado

- FASE 1 concluida: base tecnica, design system, rotas base, Landing, Age Gate, Planos (estrutura), 404.
- FASE 2 concluida: cliente Supabase tipado, tipos Database, migrations SQL (schema + RLS + Storage + seed), servico de planos, `/plans` a consumir dados reais.
- FASE 3 concluida: autenticacao (register, login, logout, reset de password), AuthContext + useAuth, ProtectedRoute, AdminRoute, AuthLayout.
- FASE 4 pendente: Landing dinamica a partir de `platform_settings`, teaser, paywall.

## Stack

- React + TypeScript + Vite
- Tailwind CSS v3
- React Router v6
- Supabase (cliente + auth + storage)
- PostgreSQL (via Supabase)

## Requisitos

- Node.js 18+
- npm
- Projecto Supabase (URL + anon key)

## Instalacao

```bash
npm install
cp .env.example .env
# preencher VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
npm run dev
```

## Scripts

- `npm run dev` — servidor de desenvolvimento (porta 5173)
- `npm run build` — build de producao via Vite (`vite build`)
- `npm run preview` — pre-visualizacao do build

## Variaveis de ambiente

Publicas (frontend):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

A anon key e publica por design. A seguranca real vem do RLS.
Secrets (EscalePay webhook, service role key, etc.) NUNCA em `VITE_`. Apenas server-side.

## Base de dados

Migrations em `supabase/migrations/`:

- `0001_init_schema.sql`
- `0002_rls_policies.sql`
- `0003_storage_buckets.sql`
- `0004_seed_defaults.sql`

Aplicar via Supabase CLI (`supabase db push`) ou colar no SQL editor, por ordem.

## Autenticacao

- `AuthProvider` em `src/auth/AuthContext.tsx`, com `useAuth()` em `src/auth/useAuth.ts`.
- Sessoes geridas por Supabase Auth (persistSession + autoRefreshToken + detectSessionInUrl).
- `ProtectedRoute` (exige sessao) e `AdminRoute` (exige `profile.role === 'admin'`).
- Trigger SQL `handle_new_user` cria o profile automaticamente ao registar.
- O campo `profiles.role` NAO e editavel pelo utilizador (bloqueado por RLS).

### Rotas de autenticacao

- `/login`
- `/register`
- `/forgot-password`
- `/reset-password` (link enviado por email)

### Definir um admin

Depois de um utilizador estar registado, promover manualmente no SQL editor:

```sql
update public.profiles set role = 'admin' where user_id = '<uuid-do-user>';
```

## Estrutura

```
src/
  auth/
  components/
    ui/
  layouts/
  pages/
    auth/
  routes/
  services/
  lib/
  types/
  index.css
  main.tsx
  App.tsx
supabase/
  migrations/
```

## Design

- Preto profundo + rosa premium como destaque.
- Sem roxo. Sem azul como cor principal.
- Mobile-first.

## Rotas (FASE 3)

- `/` — Landing
- `/age-gate` — Confirmacao +18
- `/plans` — Planos (dados reais da DB)
- `/login`, `/register`, `/forgot-password`, `/reset-password` — Auth
- `/dashboard` — Protegido (placeholder na FASE 3)
- `*` — 404

## Seguranca

- Age Gate e barreira de UX, nao seguranca.
- Autorizacao real: RLS no Supabase.
- Nunca confiar em estado de frontend ou localStorage para autorizacao.
- `service_role key` nunca no frontend.
- Signed URLs para conteudo protegido: apenas via Edge Function (fase futura).

## Pagamentos

Integracao EscalePay sera implementada como camada arquitetural na FASE 10.
A documentacao oficial foi analisada. Webhook: POST JSON com assinatura HMAC-SHA256
(`X-EscalePay-Signature`) ou token estatico (`X-Webhook-Secret`).
Eventos previstos: `payment_confirmed`, `payment_pending`, `payment_refused`,
`subscription_cancelled`, `subscription_reactivated`, `refund_completed`, `chargeback_received`.
O backend aceitara ambos os headers por robustez. Campo `test: true` ignorado em producao.

## Build

```bash
npm run build
```
