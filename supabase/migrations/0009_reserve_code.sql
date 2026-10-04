-- KYLIE BORGE - FASE 8.5 - 0009 reserve code by plan

create or replace function public.reserve_code_by_plan(plan_slug_input text)
returns json
language plpgsql
security definer
set search_path = public
as $func$
declare
  v_plan record;
  v_code record;
  v_recent integer;
begin
  if auth.uid() is null then
    return json_build_object('ok', false, 'error', 'NAO_AUTENTICADO');
  end if;

  select count(*) into v_recent
  from public.access_codes
  where user_id = auth.uid()
    and activated_at > now() - interval '24 hours';

  if v_recent > 0 then
    return json_build_object('ok', false, 'error', 'JA_RECLAMOU_RECENTEMENTE');
  end if;

  select * into v_plan
  from public.plans
  where slug = lower(trim(plan_slug_input)) and active = true
  limit 1;

  if not found then
    return json_build_object('ok', false, 'error', 'PLANO_NAO_ENCONTRADO');
  end if;

  select * into v_code
  from public.access_codes
  where plan_id = v_plan.id and status = 'available'
  order by created_at asc
  limit 1
  for update skip locked;

  if not found then
    return json_build_object('ok', false, 'error', 'SEM_CODIGOS_DISPONIVEIS');
  end if;

  update public.access_codes
  set user_id = auth.uid()
  where id = v_code.id;

  return json_build_object(
    'ok', true,
    'code', v_code.code,
    'plan_name', v_plan.name,
    'plan_slug', v_plan.slug
  );
end;
$func$;

grant execute on function public.reserve_code_by_plan(text) to authenticated;
