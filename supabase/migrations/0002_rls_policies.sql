-- KYLIE BORGE - FASE 2 - 0002 RLS policies

-- Helpers
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.user_max_plan_level()
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(max(p.level), 0)
  from public.subscriptions s
  join public.plans p on p.id = s.plan_id
  where s.user_id = auth.uid()
    and s.status = 'active'
    and s.expires_at > now();
$$;

create or replace function public.user_can_access_plan(required_plan_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select case
    when required_plan_id is null then true
    else exists (
      select 1
      from public.plans req
      where req.id = required_plan_id
        and req.level <= public.user_max_plan_level()
    )
  end;
$$;

grant execute on function public.is_admin() to authenticated, anon;
grant execute on function public.user_max_plan_level() to authenticated;
grant execute on function public.user_can_access_plan(uuid) to authenticated;

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.contents enable row level security;
alter table public.videos enable row level security;
alter table public.photos enable row level security;
alter table public.audios enable row level security;
alter table public.payments enable row level security;
alter table public.access_codes enable row level security;
alter table public.platform_settings enable row level security;

-- profiles
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check (user_id = auth.uid() and role = 'user');

create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (user_id = auth.uid() or public.is_admin())
with check (
  public.is_admin()
  or (user_id = auth.uid() and role = (select role from public.profiles p2 where p2.user_id = auth.uid()))
);

create policy "profiles_admin_all"
on public.profiles for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- plans: leitura publica dos ativos; admin faz tudo
create policy "plans_select_public_active"
on public.plans for select
to anon, authenticated
using (active = true or public.is_admin());

create policy "plans_admin_write"
on public.plans for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- subscriptions: user ve as suas; admin tudo
create policy "subscriptions_select_own"
on public.subscriptions for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

create policy "subscriptions_admin_write"
on public.subscriptions for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- contents: leitura so com acesso ao plano (ou admin); admin escreve
create policy "contents_select_authorized"
on public.contents for select
to authenticated
using (
  public.is_admin()
  or (published = true and public.user_can_access_plan(required_plan_id))
);

create policy "contents_admin_write"
on public.contents for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- videos
create policy "videos_select_authorized"
on public.videos for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1 from public.contents c
    where c.id = videos.content_id
      and c.published = true
      and public.user_can_access_plan(c.required_plan_id)
  )
);

create policy "videos_admin_write"
on public.videos for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- photos
create policy "photos_select_authorized"
on public.photos for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1 from public.contents c
    where c.id = photos.content_id
      and c.published = true
      and public.user_can_access_plan(c.required_plan_id)
  )
);

create policy "photos_admin_write"
on public.photos for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- audios
create policy "audios_select_authorized"
on public.audios for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1 from public.contents c
    where c.id = audios.content_id
      and c.published = true
      and public.user_can_access_plan(c.required_plan_id)
  )
);

create policy "audios_admin_write"
on public.audios for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- payments: user ve os seus; admin tudo
create policy "payments_select_own"
on public.payments for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

create policy "payments_admin_write"
on public.payments for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- access_codes: user ve os que lhe pertencem; admin tudo
create policy "access_codes_select_own"
on public.access_codes for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

create policy "access_codes_admin_write"
on public.access_codes for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- platform_settings: leitura publica; escrita so admin
create policy "platform_settings_select_public"
on public.platform_settings for select
to anon, authenticated
using (true);

create policy "platform_settings_admin_write"
on public.platform_settings for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
