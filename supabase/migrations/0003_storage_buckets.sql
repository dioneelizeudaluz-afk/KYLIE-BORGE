-- KYLIE BORGE - FASE 2 - 0003 Storage buckets e policies
-- Buckets privados para conteudo protegido; covers publico.

insert into storage.buckets (id, name, public)
values
  ('videos', 'videos', false),
  ('photos', 'photos', false),
  ('audios', 'audios', false),
  ('thumbnails', 'thumbnails', false),
  ('covers', 'covers', true)
on conflict (id) do nothing;

-- Policies em storage.objects
-- Somente admin faz upload/delete nos buckets privados e covers.

create policy "storage_admin_all_videos"
on storage.objects for all
to authenticated
using (bucket_id = 'videos' and public.is_admin())
with check (bucket_id = 'videos' and public.is_admin());

create policy "storage_admin_all_photos"
on storage.objects for all
to authenticated
using (bucket_id = 'photos' and public.is_admin())
with check (bucket_id = 'photos' and public.is_admin());

create policy "storage_admin_all_audios"
on storage.objects for all
to authenticated
using (bucket_id = 'audios' and public.is_admin())
with check (bucket_id = 'audios' and public.is_admin());

create policy "storage_admin_all_thumbnails"
on storage.objects for all
to authenticated
using (bucket_id = 'thumbnails' and public.is_admin())
with check (bucket_id = 'thumbnails' and public.is_admin());

create policy "storage_admin_all_covers"
on storage.objects for all
to authenticated
using (bucket_id = 'covers' and public.is_admin())
with check (bucket_id = 'covers' and public.is_admin());

-- covers: leitura publica
create policy "storage_public_read_covers"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'covers');

-- NOTA DE SEGURANCA:
-- A leitura de videos/photos/audios/thumbnails NAO esta exposta aqui.
-- A entrega ao utilizador final sera feita via Edge Function (fase futura)
-- que valida a subscription e devolve signed URL de curta duracao.
-- Isto evita replicar logica de subscription nas policies de storage.
