# SUMMARY — KYLIE BORGE

Documento para continuidade por outra sessao de IA.

## 1. Visao geral

Plataforma web privada de conteudo premium, com area publica/cliente e area administrativa.

## 2. Stack

- React + TypeScript + Vite
- Tailwind CSS v3
- React Router v6
- Supabase (cliente, auth, storage)
- PostgreSQL (via Supabase)

## 3. Estado actual

- FASE 1 concluida.
- FASE 2 concluida:
  - `@supabase/supabase-js` adicionado.
  - `src/lib/supabase.ts` (cliente tipado, valida env vars).
  - `src/types/database.ts` (Database tipado).
  - `src/services/planService.ts` (`listActivePlans`).
  - `src/pages/Plans.tsx` consome dados reais (loading / error / empty / ready).
  - Migrations em `supabase/migrations/`:
    - `0001_init_schema.sql`
    - `0002_rls_policies.sql`
    - `0003_storage_buckets.sql`
    - `0004_seed_defaults.sql`
  - `.env.example` actualizado.
  - `README.md` e `SUMMARY.md` actualizados.

## 4. Decisoes tecnicas

- Tailwind v3 (nao v4).
- Sem aliases de import. Sem `@types/node`.
- Sem `tsconfig.node.json`. `build`: `vite build`.
- Enums representados por `text` + `check` (facilita evolucao sem `ALTER TYPE`).
- Hierarquia de planos via `plans.level` (integer). Evita parsing de JSON em SQL.
- Funcoes helper `is_admin`, `user_max_plan_level`, `user_can_access_plan` — todas `SECURITY DEFINER` com `search_path` fixo.
- Trigger `handle_new_user` cria `profiles` automaticamente.
- Buckets privados excepto `covers`.
- **Entrega de conteudo protegido via Edge Function em fase futura** (signed URL). Nao replicamos logica de subscription nas policies de storage.

## 5. Schema (resumo)

- `profiles` — ligada a `auth.users` via `user_id` unique.
- `plans` — `slug` unique, `level` integer, `permissions` jsonb.
- `subscriptions` — `status` em (active, expired, cancelled, pending), `expires_at`.
- `contents` — `content_type` em (video, photo, audio), `required_plan_id` opcional, `published`.
- `videos` / `photos` / `audios` — 1:1 com `contents`.
- `payments` — `external_payment_id` unique quando nao nulo.
- `access_codes` — `code` unique, `status` em (available, used, disabled, expired).
- `platform_settings` — `key` unique, `value` jsonb.

## 6. RLS (resumo)

- `profiles`: user ve/edita o seu; `role` nao editavel por user.
- `plans`: leitura publica dos activos; escrita admin.
- `subscriptions` / `payments` / `access_codes`: user ve os seus; admin tudo.
- `contents` / `videos` / `photos` / `audios`: leitura so com acesso ao plano (via `user_can_access_plan`) ou admin; escrita admin.
- `platform_settings`: leitura publica; escrita admin.
- Storage: admin faz tudo nos buckets privados e `covers`; leitura publica apenas em `covers`.

## 7. Storage

Buckets: `videos`, `photos`, `audios`, `thumbnails` (privados); `covers` (publico).

## 8. Seed

- Planos: `free`, `teste`, `pro`, `premium` (levels 0..3).
- `platform_settings`: `hero_title`, `hero_subtitle`, `hero_cta`, `age_gate_text`, `teaser_seconds`.

## 9. Pendencias conhecidas

- Edge Function para entrega de signed URLs (fase de conteudos).
- EscalePay: nenhuma API definida. Requer documentacao oficial.
- Videochamadas: arquitectura futura.
- `platform_settings` ainda nao consumida na Landing (constantes locais em `src/lib/constants.ts`). Sera ligada na FASE 4.

## 10. Proximos passos (FASE 3)

- AuthContext / hook `useAuth`.
- Paginas: `/login`, `/register`, `/forgot-password`.
- `ProtectedRoute` e `AdminRoute`.
- Ligacao com `supabase.auth`.
- Redireccionamento pos-login.

## 11. Regras a respeitar

- Nao inventar APIs, endpoints, webhooks, credenciais.
- Nao hardcode de precos nos componentes.
- Autorizacao real apenas no Supabase (RLS).
- Mobile-first.
- Nao usar roxo; azul nao e cor principal.
- Conteudo protegido: sempre via signed URLs (Edge Function).
