# KYLIE BORGE

Plataforma web privada de conteudo premium.

## Estado

- FASE 1 concluida: base tecnica, design system, rotas base, Landing, Age Gate, Planos (estrutura), 404.
- FASE 2 pendente: Supabase (cliente, tipos, migrations, RLS, Storage).

## Stack

- React + TypeScript + Vite
- Tailwind CSS v3
- React Router v6
- Supabase (a partir da FASE 2)
- PostgreSQL
- Supabase Auth / Storage

## Requisitos

- Node.js 18+
- npm

## Instalacao

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` — servidor de desenvolvimento (porta 5173)
- `npm run build` — build de producao via Vite (`vite build`)
- `npm run preview` — pre-visualizacao do build

Nota: o build usa apenas `vite build`. Nao usamos `tsc -b` nem `tsconfig.node.json`.

## Variaveis de ambiente

Copiar `.env.example` para `.env`.

Variaveis publicas (frontend):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Secrets (EscalePay, service role keys, etc.) nunca em variaveis `VITE_`. Apenas server-side.

## Estrutura

```
src/
  components/
    ui/
  layouts/
  pages/
  routes/
  lib/
  types/
```

## Design

- Preto profundo + rosa premium como destaque.
- Sem roxo. Sem azul como cor principal.
- Cards arredondados, glassmorphism discreto, microanimacoes suaves.
- Mobile-first.

## Rotas (FASE 1)

- `/` — Landing
- `/age-gate` — Confirmacao +18
- `/plans` — Estrutura de planos (dados virão da DB)
- `*` — 404

## Seguranca (notas)

- O Age Gate e barreira de UX, nao seguranca.
- Toda a autorizacao real sera feita no Supabase (RLS) a partir da FASE 2.
- Nunca confiar em estado de frontend ou localStorage para autorizacao.

## Pagamentos

Integracao EscalePay sera implementada como camada arquitetural na FASE 10.
Nenhuma API/endpoint/webhook sera inventado. Requer documentacao e credenciais oficiais.

## Build

```bash
npm run build
```
