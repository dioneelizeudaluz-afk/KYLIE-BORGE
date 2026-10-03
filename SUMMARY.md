# SUMMARY — KYLIE BORGE

Documento para continuidade por outra sessao de IA.

## 1. Visao geral

Plataforma web privada de conteudo premium, com area publica/cliente e area administrativa.

## 2. Stack

- React + TypeScript + Vite
- Tailwind CSS v3
- React Router v6
- Supabase (FASE 2+)
- PostgreSQL

## 3. Estado atual

- FASE 1 concluida.
- Ficheiros criados:
  - `package.json`, `vite.config.ts`, `tsconfig.json`
  - `tailwind.config.js`, `postcss.config.js`
  - `index.html`, `public/favicon.svg`, `public/og-image.svg`
  - `.env.example`, `.gitignore`
  - `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/vite-env.d.ts`
  - `src/lib/constants.ts`
  - `src/types/index.ts`
  - `src/components/Logo.tsx`
  - `src/components/ui/Container.tsx`, `src/components/ui/Button.tsx`
  - `src/layouts/PublicLayout.tsx`
  - `src/pages/Landing.tsx`, `src/pages/AgeGate.tsx`, `src/pages/Plans.tsx`, `src/pages/NotFound.tsx`
  - `src/routes/AppRoutes.tsx`

## 4. Decisoes tecnicas

- Tailwind v3 (nao v4) para estabilidade e config previsivel.
- Sem aliases de import (`@/`). Importacoes relativas. Evita `@types/node`.
- Sem `tsconfig.node.json`.
- `vite.config.ts` nao usa APIs Node.
- `build`: `vite build` (sem `tsc -b`).
- Sem `@supabase/supabase-js` na FASE 1: nenhum ficheiro o importa.
- Sem `@types/node`.
- Logo em SVG com `<text>` usando Google Fonts (Great Vibes + Bebas Neue) e fallback cursive/sans.
- `Plans.tsx` mostra estrutura vazia (skeleton) para nao hardcode de precos.
- Textos de Landing e Age Gate centralizados em `src/lib/constants.ts`.

## 5. Rotas existentes

- `/`
- `/age-gate`
- `/plans`
- `*` (404)

## 6. Design tokens

Em `tailwind.config.js`: cores `kb-*`, fontes `sans`/`display`/`script`, sombras `glow`/`soft`, gradientes `kb-radial`/`kb-fade`, animacoes `fade-up`/`fade-in`.

## 7. Proximos passos (FASE 2)

- Adicionar `@supabase/supabase-js`.
- Criar `src/lib/supabase.ts`.
- Criar tipos Supabase (`src/types/database.ts`).
- Migrations SQL: `profiles`, `plans`, `subscriptions`, `contents`, `videos`, `photos`, `audios`, `access_codes`, `payments`, `platform_settings`.
- RLS.
- Buckets Storage: `videos`, `photos`, `audios`, `thumbnails`, `covers`.
- Servicos de Storage em `src/services/`.

## 8. Pendencias conhecidas

- EscalePay: nenhuma API definida. Requer documentacao oficial.
- Videochamadas: arquitetura futura (WebRTC ou servico externo).
- `platform_settings`: ainda nao usada; textos vivem em `constants.ts`.

## 9. Regras a respeitar

- Nao inventar APIs, endpoints, webhooks, credenciais.
- Nao hardcode de precos nos componentes.
- Autorizacao real apenas no Supabase (RLS).
- Mobile-first.
- Nao usar roxo; azul nao e cor principal.
- Conteudo protegido: sempre via signed URLs, nunca URLs publicas permanentes.
