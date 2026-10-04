-- KYLIE BORGE - FASE 3.5 - 0006 redeem function

create or replace function public.redeem_access_code(code_input text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code record;
  v_plan record;
  v_sub_id uuid;
  v_expires_at timestamptz;
  v_normalized text;
begin
  if auth.uid() is null then
    return json_build_object('ok', false, 'error', 'NAO_AUTENTICADO');
  end if;

  v_normalized := upper(replace(trim(code_input), '-', ''));

  if length(v_normalized) = 0 then
    return json_build_object('ok', false, 'error', 'CHAVE_INVALIDA');
  end if;

  select * into v_code
  from public.access_codes
  where code = v_normalized
  for update;

  if not found then
    return json_build_object('ok', false, 'error', 'CHAVE_INVALIDA');
  end if;

  if v_code.status <> 'available' then
    return json_build_object('ok', false, 'error', 'CHAVE_INDISPONIVEL');
  end if;

  if v_code.expires_at is not null and v_code.expires_at <= now() then
    return json_build_object('ok', false, 'error', 'CHAVE_EXPIRADA');
  end if;

  if v_code.user_id is not null and v_code.user_id <> auth.uid() then
    return json_build_object('ok', false, 'error', 'CHAVE_DE_OUTRO_UTILIZADOR');
  end if;

  select * into v_plan from public.plans where id = v_code.plan_id;
  if not found then
    return json_build_object('ok', false, 'error', 'PLANO_INEXISTENTE');
  end if;

  v_expires_at := now() + (v_plan.duration_hours || ' hours')::interval;

  insert into public.subscriptions (user_id, plan_id, status, started_at, expires_at)
  values (auth.uid(), v_plan.id, 'active', now(), v_expires_at)
  returning id into v_sub_id;

  update public.access_codes
  set status = 'used',
      user_id = auth.uid(),
      activated_at = now(),
      expires_at = v_expires_at
  where id = v_code.id;

  return json_build_object(
    'ok', true,
    'plan_name', v_plan.name,
    'plan_slug', v_plan.slug,
    'expires_at', v_expires_at,
    'subscription_id', v_sub_id
  );
end;
$$;

grant execute on function public.redeem_access_code(text) to authenticated;
