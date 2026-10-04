# SUMMARY — KYLIE BORGE

## 1. Visao geral

Plataforma web privada de conteudo premium. Area publica + admin.

## 2. Stack

- React + TypeScript + Vite
- Tailwind CSS v3
- React Router v6
- Supabase (auth, DB, storage, edge functions)
- Deno (runtime das Edge Functions)

## 3. Estado

- FASE 1, 2, 3, 3.5 concluidas.
- FASE 8.1 concluida:
  - Edge Function `generate-codes` em `supabase/functions/generate-codes/index.ts`.
  - Ficheiros partilhados: `_shared/cors.ts`, `_shared/supabaseAdmin.ts`, `_shared/auth.ts`, `_shared/codes.ts`.
  - Verificacao de admin no servidor (JWT + `profiles.role`).
  - Codigos no formato `X7KM-92QP-L4ZT` (12 chars, sem 0/O/1/I/L).
  - Retry simples em colisao de `code`.
  - `README-EDGE.md` com instrucoes de deploy via painel (versao single-file) e via CLI.

## 4. Fluxo actual

Cliente escolhe plano -> checkout EscalePay -> paga -> admin invoca `generate-codes` -> copia codigos -> envia ao cliente -> cliente em `/redeem` introduz -> funcao SQL cria subscription.

## 5. Pendencias

- FASE 4: Landing dinamica, teaser, paywall.
- FASE 9: Admin UI completo (incluindo gerar codigos pelo browser).
- FASE 10: Webhook EscalePay (geracao automatica).
- Envio de email (codigo) — servico a definir.

## 6. Regras

- Nao inventar APIs, endpoints, credenciais.
- Nao hardcode de precos.
- Autorizacao real: RLS + validacao server-side nas Edge Functions.
- Mobile-first. Sem roxo.
- Signed URLs via Edge Function (fase de conteudos).
- Aceitar ambos os headers EscalePay por robustez.
- Ignorar `test: true` em producao.
