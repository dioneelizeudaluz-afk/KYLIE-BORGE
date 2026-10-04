# KYLIE BORGE

Plataforma web privada de conteudo premium.

## Estado

- FASE 1 a 9 concluidas.
- FASE 8.5 concluida (atribuicao automatica de codigos).
- FASE 5 concluida: Upload de conteudos (video, foto, audio) no admin.
- FASE 7 pendente: Biblioteca do cliente (ver conteudos).
- FASE 4 pendente: Landing dinamica, teaser, paywall.
- FASE 10 pendente: Webhook EscalePay.

## Stack

- React + TypeScript + Vite
- Tailwind CSS v3
- React Router v6
- Supabase (auth, DB, storage)

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

Migrations em `supabase/migrations/` (0001 a 0009).

## Admin

- `/admin` — Dashboard
- `/admin/contents` — Upload e gestao de conteudos
- `/admin/codes` — Codigos de acesso
- `/admin/clients` — Clientes
- `/admin/payments` — Pagamentos
- `/admin/plans` — Planos

## Upload de conteudos

- Buckets: `videos`, `photos`, `audios`, `thumbnails` (todos privados).
- Nome do ficheiro no Storage = UUID (nunca o nome original).
- Limites: video 50 MB, foto 10 MB, audio 50 MB, thumbnail 2 MB.
- Tipos aceitos: `video/mp4|webm|quicktime`, `image/jpeg|png|webp`, `audio/mpeg|mp4|wav|ogg`.
- `storage_path` guardado em `contents`.
- Pre-visualizacao via signed URL (10 min).

## Seguranca

- RLS em todas as tabelas.
- Upload restrito a admins (storage policies).
- `service_role key` nunca no frontend.

## Build

```bash
npm run build
```
