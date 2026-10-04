-- KYLIE BORGE - FASE 3.5 - 0005 plans checkout

alter table public.plans
  add column if not exists checkout_url text,
  add column if not exists escalepay_product_id text;

create index if not exists plans_escalepay_product_id_idx
  on public.plans(escalepay_product_id)
  where escalepay_product_id is not null;
