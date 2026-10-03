-- KYLIE BORGE - FASE 2 - 0001 init schema
-- Extensoes
create extension if not exists "pgcrypto";

-- Funcao updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- profiles
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_user_id_idx on public.profiles(user_id);
create index if not exists profiles_role_idx on public.profiles(role);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- plans
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  price numeric(10,2) not null default 0,
  currency text not null default 'BRL',
  duration_hours integer not null default 0,
  description text,
  permissions jsonb not null default '{}'::jsonb,
  level integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists plans_active_idx on public.plans(active);
create index if not exists plans_level_idx on public.plans(level);

create trigger plans_set_updated_at
before update on public.plans
for each row execute function public.set_updated_at();

-- subscriptions
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid not null references public.plans(id) on delete restrict,
  status text not null default 'pending' check (status in ('active','expired','cancelled','pending')),
  started_at timestamptz not null default now(),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);
create index if not exists subscriptions_status_idx on public.subscriptions(status);
create index if not exists subscriptions_expires_at_idx on public.subscriptions(expires_at);

create trigger subscriptions_set_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

-- contents
create table if not exists public.contents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  content_type text not null check (content_type in ('video','photo','audio')),
  storage_path text not null,
  thumbnail_path text,
  required_plan_id uuid references public.plans(id) on delete set null,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contents_content_type_idx on public.contents(content_type);
create index if not exists contents_published_idx on public.contents(published);
create index if not exists contents_required_plan_id_idx on public.contents(required_plan_id);

create trigger contents_set_updated_at
before update on public.contents
for each row execute function public.set_updated_at();

-- videos
create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  content_id uuid not null unique references public.contents(id) on delete cascade,
  duration integer,
  metadata jsonb
);

create index if not exists videos_content_id_idx on public.videos(content_id);

-- photos
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  content_id uuid not null unique references public.contents(id) on delete cascade,
  metadata jsonb
);

create index if not exists photos_content_id_idx on public.photos(content_id);

-- audios
create table if not exists public.audios (
  id uuid primary key default gen_random_uuid(),
  content_id uuid not null unique references public.contents(id) on delete cascade,
  duration integer,
  metadata jsonb
);

create index if not exists audios_content_id_idx on public.audios(content_id);

-- payments (criada antes de access_codes devido a FK)
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid not null references public.plans(id) on delete restrict,
  amount numeric(10,2) not null,
  currency text not null default 'BRL',
  status text not null default 'pending' check (status in ('pending','approved','rejected','refunded')),
  external_payment_id text,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payments_user_id_idx on public.payments(user_id);
create index if not exists payments_status_idx on public.payments(status);
create unique index if not exists payments_external_payment_id_idx on public.payments(external_payment_id) where external_payment_id is not null;

create trigger payments_set_updated_at
before update on public.payments
for each row execute function public.set_updated_at();

-- access_codes
create table if not exists public.access_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  plan_id uuid not null references public.plans(id) on delete restrict,
  user_id uuid references auth.users(id) on delete set null,
  payment_id uuid references public.payments(id) on delete set null,
  status text not null default 'available' check (status in ('available','used','disabled','expired')),
  created_at timestamptz not null default now(),
  activated_at timestamptz,
  expires_at timestamptz
);

create index if not exists access_codes_code_idx on public.access_codes(code);
create index if not exists access_codes_status_idx on public.access_codes(status);
create index if not exists access_codes_user_id_idx on public.access_codes(user_id);
create index if not exists access_codes_plan_id_idx on public.access_codes(plan_id);

-- platform_settings
create table if not exists public.platform_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create trigger platform_settings_set_updated_at
before update on public.platform_settings
for each row execute function public.set_updated_at();

-- Trigger: criar profile automaticamente ao registar user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    'user'
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
