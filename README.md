# KYLIE BORGE

Plataforma web privada de conteudo premium.

## Estado

- FASE 1 concluida: base tecnica, design system, rotas base, Landing, Age Gate, Planos (estrutura), 404.
- FASE 2 concluida: cliente Supabase tipado, tipos Database, migrations SQL (schema + RLS + Storage + seed), servico de planos, `/plans` a consumir dados reais.
- FASE 3 pendente: Auth (register, login, logout, reset, rotas protegidas, roles).

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

Nota: o build usa apenas `vite build`. Nao usamos `tsc -b` nem `tsconfig.node.json`.

## Variaveis de ambiente

Publicas (frontend):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

A anon key e publica por design. A seguranca real vem do RLS.
Secrets (EscalePay, service role key, etc.) NUNCA em `VITE_`. Apenas server-side.

## Base de dados

Migrations em `supabase/migrations/`:

- `0001_init_schema.sql` — tabelas, FKs, indices, triggers
- `0002_rls_policies.sql` — RLS + funcoes helper (`is_admin`, `user_max_plan_level`, `user_can_access_plan`)
- `0003_storage_buckets.sql` — buckets + policies de storage
- `0004_seed_defaults.sql` — planos base + `platform_settings`

Aplicar via Supabase CLI (`supabase db push`) ou colar no SQL editor do painel Supabase, por ordem.

### Tabelas

`profiles`, `plans`, `subscriptions`, `contents`, `videos`, `photos`, `audios`, `access_codes`, `payments`, `platform_settings`.

### Hierarquia de planos

Coluna `plans.level` (0 free, 1 teste, 2 pro, 3 premium).
`user_max_plan_level()` devolve o nivel maximo das subscriptions activas.
`user_can_access_plan(required_plan_id)` valida acesso.

## Storage

Buckets:

- `videos` (privado)
- `photos` (privado)
- `audios` (privado)
- `thumbnails` (privado)
- `covers` (publico — capa da landing)

Somente admin faz upload/delete nos buckets privados e `covers`.
**Entrega de conteudo protegido ao utilizador final sera via Edge Function** (fase futura)
que valida a subscription e devolve signed URL de curta duracao. Isto evita replicar
logica de subscription dentro das policies de storage.

## Estrutura

```
src/
  components/
    ui/
  layouts/
  pages/
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
- Cards arredondados, glassmorphism discreto, microanimacoes suaves.
- Mobile-first.

## Rotas (FASE 2)

- `/` — Landing
- `/age-gate` — Confirmacao +18
- `/plans` — Planos (dados reais da DB)
- `*` — 404

## Seguranca

- Age Gate e barreira de UX, nao seguranca.
- Autorizacao real: RLS no Supabase.
- Nunca confiar em estado de frontend ou localStorage para autorizacao.
- `service_role key` nunca no frontend.
- Signed URLs para conteudo protegido: apenas via Edge Function.

## Pagamentos

Integracao EscalePay sera implementada como camada arquitetural na FASE 10.
Nenhuma API/endpoint/webhook sera inventado. Requer documentacao e credenciais oficiais.

## Build

```bash
npm run build
```
