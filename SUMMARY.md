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
- FASE 2 concluida.
- FASE 3 concluida:
  - `src/auth/AuthContext.tsx` + `src/auth/useAuth.ts`.
  - `src/services/profileService.ts` (`getProfile`, `updateProfile`).
  - `src/components/LoadingScreen.tsx`, `src/components/ProtectedRoute.tsx`, `src/components/AdminRoute.tsx`.
  - `src/layouts/AuthLayout.tsx`.
  - `src/pages/auth/Login.tsx`, `Register.tsx`, `ForgotPassword.tsx`, `ResetPassword.tsx`, `DashboardPlaceholder.tsx`.
  - `src/layouts/PublicLayout.tsx` com estado de sessao.
  - `src/routes/AppRoutes.tsx` actualizado.
  - `src/App.tsx` envolve com `AuthProvider`.

## 4. Decisoes tecnicas

- `AuthProvider` subscreve `onAuthStateChange` ANTES de `getSession()` (evita race condition).
- `useAuth` lanca erro claro se usado fora do provider.
- `ProtectedRoute` guarda `state.from` para redireccionar de volta apos login.
- `AdminRoute` verifica `profile.role === 'admin'`.
- `updateProfile` NUNCA envia `role` no payload.
- `detectSessionInUrl: true` permite que `/reset-password` funcione com o link do email.
- `/reset-password` mostra mensagem de link invalido se nao houver sessao.

## 5. Schema (inalterado desde FASE 2)

Tabelas: `profiles`, `plans`, `subscriptions`, `contents`, `videos`, `photos`, `audios`, `access_codes`, `payments`, `platform_settings`.

## 6. Rotas

- `/` — Landing
- `/age-gate` — Confirmacao +18
- `/plans` — Planos
- `/login`, `/register`, `/forgot-password`, `/reset-password` — Auth
- `/dashboard` — Protegido (placeholder)
- `*` — 404

## 7. Definir admin

```sql
update public.profiles set role = 'admin' where user_id = '<uuid>';
```

## 8. EscalePay — estado

Documentacao analisada:

- Webhook: `POST application/json`.
- Auth: HMAC-SHA256 (`X-EscalePay-Signature`) OU token estatico (`X-Webhook-Secret`). Ambiguidade na doc → backend aceitara ambos.
- Eventos: `payment_confirmed`, `payment_pending`, `payment_refused`, `subscription_cancelled`, `subscription_reactivated`, `refund_completed`, `chargeback_received`.
- Payload base: `{ event, order_id, timestamp, source, version, webhook_id, test, customer, product, payment, order_bumps }`.
- Teste: numeros `258840000001` (confirmado), `258840000002` (pendente), `258840000003–008` (recusado). Campo `test: true` identifica-os.
- Reenvios: ate 3 tentativas (5, 30, 60 min).
- API REST existe (Bearer Token) mas endpoints nao vistos na doc.

Pendencias:

- `product.id` real de cada produto EscalePay (para mapear em `plans.escalepay_product_id`).
- Se o URL de checkout aceita `?ref=` ou metadata.
- Envio de email (codigo de acesso) — servico a definir.

## 9. Proximos passos

- FASE 3.5: `plans.checkout_url`, `/checkout-return`, `/redeem`, funcao SQL `redeem_access_code`.
- FASE 4: Landing dinamica via `platform_settings`, teaser, paywall.
- FASE 5: Conteudos (upload, Storage, signed URLs via Edge Function).
- FASE 6: Subscriptions + permissao central.
- FASE 7: Dashboard, library, player, profile.
- FASE 8: Codes (geracao, activacao, expiracao).
- FASE 9: Admin completo.
- FASE 10: Webhook EscalePay (Edge Function) + geracao automatica de codigo.
- FASE 11: Videochamadas (arquitectura).
- FASE 12: Seguranca, responsivo, performance.
- FASE 13: README/SUMMARY finais.

## 10. Regras a respeitar

- Nao inventar APIs, endpoints, webhooks, credenciais.
- Nao hardcode de precos nos componentes.
- Autorizacao real apenas no Supabase (RLS).
- Mobile-first.
- Nao usar roxo; azul nao e cor principal.
- Conteudo protegido: sempre via signed URLs (Edge Function).
- Aceitar ambos os headers da EscalePay por robustez (doc tem inconsistencia).
- Ignorar `test: true` em producao.
