# KYLIE BORGE

Plataforma web privada de conteudo premium.

## Estado

- FASE 1, 2, 3, 3.5, 8.1 concluidas.
- FASE 9 concluida: Admin UI (`/admin`).
- FASE 4 pendente: Landing dinamica, teaser, paywall.
- FASE 5 pendente: Upload de conteudos.
- FASE 10 pendente: Webhook EscalePay.

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

## Admin

Rota: `/admin`

- `/admin` — Dashboard
- `/admin/codes` — Codigos (gerar, listar, activar/desactivar, apagar)
- `/admin/clients` — Clientes
- `/admin/payments` — Pagamentos
- `/admin/plans` — Planos (editar preco, descricao, checkout_url, estado)

Acesso apenas a utilizadores com `profiles.role = 'admin'`.

### Promover a admin

```sql
update public.profiles set role = 'admin' where user_id = '<uuid>';
```

## Build

```bash
npm run build
```
