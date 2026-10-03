-- KYLIE BORGE - FASE 2 - 0004 seed defaults
-- Idempotente via on conflict.

insert into public.plans (name, slug, price, currency, duration_hours, description, permissions, level, active)
values
  ('Free', 'free', 0.00, 'BRL', 0, 'Acesso limitado ao teaser.', '{}'::jsonb, 0, true),
  ('Teste', 'teste', 5.00, 'BRL', 6, 'Acesso de teste por 6 horas.', '{"contents":["video","photo","audio"]}'::jsonb, 1, true),
  ('Pro', 'pro', 19.90, 'BRL', 360, 'Acesso a videos, fotos e audios.', '{"contents":["video","photo","audio"]}'::jsonb, 2, true),
  ('Premium', 'premium', 39.90, 'BRL', 720, 'Acesso completo incluindo videochamadas.', '{"contents":["video","photo","audio"],"video_calls":true}'::jsonb, 3, true)
on conflict (slug) do nothing;

insert into public.platform_settings (key, value)
values
  ('hero_title', '"Kylie Borge"'::jsonb),
  ('hero_subtitle', '"Uma experiencia privada com conteudo exclusivo."'::jsonb),
  ('hero_cta', '"Descobrir conteudo"'::jsonb),
  ('age_gate_text', '"Este conteudo e destinado exclusivamente a maiores de 18 anos."'::jsonb),
  ('teaser_seconds', '30'::jsonb)
on conflict (key) do nothing;
