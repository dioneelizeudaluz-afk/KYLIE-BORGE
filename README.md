# KYLIE BORGE

Plataforma web privada de conteudo premium.

## Estado

- FASE 1, 2, 3, 3.5, 8.1 concluidas.
- FASE 9 concluida: Admin UI (`/admin`).
- FASE 4 pendente: Landing dinamica, teaser, paywall.
- FASE 5 pendente: Upload de conteudos.
- FASE 10 pendente: Webhook EscalePay.

## Stack

- React + TypeScript + Vite
- Tailwind CSS v3
- React Router v6
- Supabase (auth, DB, storage, edge functions)

## Instalacao

```bash
npm install
cp .env.example .env
npm run dev
```

## Scripts

- `npm run dev`
- `npm run build`
- `npm run preview`

## Base de dados

Migrations em `supabase/migrations/` (0001 a 0007). Aplicar por ordem.

## Edge Functions

- `generate-codes` — gera codigos para um plano (admin apenas).

## Admin

Rota: `/admin`

- `/admin` — Dashboard
- `/admin/codes` — Codigos (listar, filtrar, gerar, activar/desactivar, apagar)
- `/admin/clients` — Clientes
- `/admin/payments` — Pagamentos
- `/admin/plans` — Planos (editar preco, descricao, checkout_url, estado)

Acesso apenas a utilizadores com `profiles.role = 'admin'`.

### Promover a admin

```sql
update public.profiles set role = 'admin' where user_id = '<uuid>';
```

## Rotas publicas

- `/`, `/age-gate`, `/plans`, `/checkout-return`, `/redeem`
- `/login`, `/register`, `/forgot-password`, `/reset-password`
- `/dashboard` (protegido)

## Seguranca

- RLS em todas as tabelas.
- `redeem_access_code` e `SECURITY DEFINER`.
- `generate-codes` verifica admin no servidor.
- `service_role key` nunca no frontend.

## Build

```bash
npm run build
```
