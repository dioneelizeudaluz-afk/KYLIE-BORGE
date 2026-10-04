# SUMMARY — KYLIE BORGE

## 1. Visao geral

Plataforma web privada de conteudo premium. Area publica/cliente + area admin.

## 2. Stack

- React + TypeScript + Vite
- Tailwind CSS v3
- React Router v6
- Supabase (auth, DB, storage)
- PostgreSQL

## 3. Estado

- FASE 1, 2, 3 concluidas.
- FASE 3.5 concluida:
  - Coluna `plans.checkout_url` e `plans.escalepay_product_id`.
  - Migrations `0005_plans_checkout.sql`, `0006_redeem_function.sql`, `0007_seed_checkout_urls.sql`.
  - Funcao SQL `redeem_access_code(code_input text) returns json` — `SECURITY DEFINER`, `for update` na chave, valida autenticacao/estado/expiracao/propriedade. Normaliza com `upper(replace(trim(code), '-', ''))`.
  - Servico `src/services/accessCodeService.ts` (`redeemCode`, `listMyCodes`, `formatCodeForDisplay`, `REDEEM_ERROR_MESSAGES`).
  - Servico `src/services/subscriptionService.ts` (`getMyActiveSubscription` com `daysRemaining`).
  - Paginas `/redeem` e `/checkout-return`.
  - `Plans.tsx` com CTA de checkout (abre `checkout_url` em nova aba) e fallback "Em breve" quando sem URL.
  - `DashboardPlaceholder` com bloco de subscricao activa.
  - `PublicLayout` com link "Resgatar" para utilizadores autenticados (escondido em mobile por espaco).

## 4. Fluxo

Cliente escolhe plano -> checkout EscalePay (nova aba) -> paga -> admin gera codigo (manual agora, automatico na FASE 10) -> cliente autenticado vai a `/redeem` -> funcao SQL valida e cria `subscription` com `expires_at = now() + duration_hours` -> dashboard mostra plano activo.

## 5. Seguranca

- `redeem_access_code` e `SECURITY DEFINER` com `search_path = public`.
- `for update` evita duplo resgate.
- Sem confianca no frontend para autorizacao.
- `checkout_url` e apenas um link externo (nada e marcado como pago no frontend).
- `/checkout-return` NAO cria subscription. So `/redeem` cria, via SQL.

## 6. Formato da chave

- Armazenado: `X7KM92QPL4ZT` (12 chars, uppercase, sem hifens).
- Exibido: `X7KM-92QP-L4ZT`.
- `formatCodeForDisplay` faz a mascara no cliente.

## 7. Proximos passos

- FASE 4: Landing dinamica via `platform_settings`, teaser, paywall.
- FASE 5: Conteudos (upload, signed URLs via Edge Function).
- FASE 6: Subscriptions + permissao central.
- FASE 7: Dashboard completo, library, player.
- FASE 8: Codes (geracao no admin).
- FASE 9: Admin completo.
- FASE 10: Webhook EscalePay (Edge Function) + geracao automatica de codigo.
- FASE 11: Videochamadas.
- FASE 12: Seguranca, responsivo, performance.

## 8. Pendencias

- `plans.escalepay_product_id` em NULL — preencher quando IDs reais forem conhecidos.
- Envio de email (codigo) — servico a definir.
- Admin UI para gerar/gerir codigos (FASE 9).

## 9. Regras

- Nao inventar APIs, endpoints, credenciais.
- Nao hardcode de precos nos componentes.
- Autorizacao real: RLS.
- Mobile-first. Sem roxo.
- Conteudo protegido via signed URLs (Edge Function).
- Aceitar ambos os headers EscalePay por robustez.
- Ignorar `test: true` em producao.
