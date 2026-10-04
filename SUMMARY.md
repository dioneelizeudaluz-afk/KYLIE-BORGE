# SUMMARY — KYLIE BORGE

## 1. Visao geral

Plataforma web privada de conteudo premium. Area publica + admin.

## 2. Stack

- React + TypeScript + Vite
- Tailwind CSS v3
- React Router v6
- Supabase (auth, DB, storage, edge functions)

## 3. Estado

- FASE 1, 2, 3, 3.5, 8.1 concluidas.
- FASE 9 concluida: Admin UI (`/admin`) com Dashboard, Codigos, Clientes, Pagamentos, Planos.

## 4. Decisoes tecnicas

- Admin UI usa RLS (nao confia no frontend).
- `createCodes` chama a Edge Function `generate-codes` via `supabase.functions.invoke`.
- Modais feitos inline.
- Clipboard via `navigator.clipboard`.

## 5. Pendencias

- FASE 4: Landing dinamica, teaser, paywall.
- FASE 5: Upload de conteudos.
- FASE 7: Biblioteca/player.
- FASE 10: Webhook EscalePay.
- Envio de email.

## 6. Regras

- Nao inventar APIs.
- Nao hardcode de precos.
- Autorizacao real: RLS + validacao server-side.
- Mobile-first. Sem roxo.
- Aceitar ambos os headers EscalePay.
- Ignorar `test: true` em producao.
