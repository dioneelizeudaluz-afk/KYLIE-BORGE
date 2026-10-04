# SUMMARY — KYLIE BORGE

## 1. Visao geral

Plataforma web privada de conteudo premium. Area publica + cliente + admin.

## 2. Stack

- React + TypeScript + Vite
- Tailwind CSS v3
- React Router v6
- Supabase (auth, DB, storage)

## 3. Estado

- FASE 1, 2, 3, 3.5, 5, 8.1, 8.5, 9 concluidas.
- FASE 5 concluida:
  - `src/services/storageService.ts` (validateFile, uploadToBucket, removeFromBucket, createSignedUrl).
  - `src/services/contentService.ts` (listContents, createContent, updateContent, deleteContent).
  - `src/pages/admin/AdminContents.tsx` (upload com modal, filtros, publicar/despublicar/apagar, preview via signed URL).
  - Menu admin com "Conteudos".
  - Rota `/admin/contents`.

## 4. Decisoes tecnicas

- Storage: nome UUID (nunca nome original).
- Buckets privados; preview via signed URL.
- Upload limitado a 50 MB por ficheiro (plano gratuito Supabase).
- Upload restrito a admins (policies de Storage ja existentes).
- Limpeza automatica de ficheiros em caso de erro.

## 5. Pendencias

- FASE 7: Biblioteca do cliente.
- FASE 4: Landing dinamica, teaser, paywall.
- FASE 10: Webhook EscalePay.
- Envio de email.

## 6. Regras

- Nao inventar APIs.
- Autorizacao real: RLS + policies de Storage.
- Mobile-first. Sem roxo.
- Aceitar ambos os headers EscalePay.
- Ignorar `test: true` em producao.
