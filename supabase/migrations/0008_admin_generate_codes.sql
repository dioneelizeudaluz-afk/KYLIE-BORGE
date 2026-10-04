-- KYLIE BORGE - FASE 9.1 - 0008 admin generate codes

create or replace function public.admin_generate_codes(
  plan_slug_input text,
  quantity_input integer
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_plan record;
  v_code text;
  v_created text[] := array[]::text[];
  v_alphabet text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  v_raw text;
  i integer;
  j integer;
  attempt integer;
  v_char text;
begin
  if not public.is_admin() then
    return json_build_object('ok', false, 'error', 'NAO_ADMIN');
  end if;

  if quantity_input is null or quantity_input < 1 or quantity_input > 200 then
    return json_build_object('ok', false, 'error', 'QUANTITY_INVALIDA');
  end if;

  select * into v_plan
  from public.plans
  where slug = lower(trim(plan_slug_input))
  limit 1;

  if not found then
    return json_build_object('ok', false, 'error', 'PLANO_NAO_ENCONTRADO');
  end if;

  if not v_plan.active then
    return json_build_object('ok', false, 'error', 'PLANO_INACTIVO');
  end if;

  for i in 1..quantity_input loop
    attempt := 0;
    loop
      attempt := attempt + 1;
      if attempt > 10 then
        return json_build_object('ok', false, 'error', 'NAO_FOI_POSSIVEL_GERAR_CODIGO_UNICO');
      end if;

      v_raw := '';
      for j in 1..12 loop
        v_char := substr(v_alphabet, 1 + floor(random() * length(v_alphabet))::int, 1);
        v_raw := v_raw || v_char;
      end loop;

      begin
        insert into public.access_codes (code, plan_id, status)
        values (v_raw, v_plan.id, 'available');
        exit;
      exception when unique_violation then
        -- tenta outra vez
      end;
    end loop;

    v_created := array_append(
      v_created,
      substr(v_raw, 1, 4) || '-' || substr(v_raw, 5, 4) || '-' || substr(v_raw, 9, 4)
    );
  end loop;

  return json_build_object(
    'ok', true,
    'plan', v_plan.name,
    'plan_slug', v_plan.slug,
    'quantity', array_length(v_created, 1),
    'codes', to_json(v_created)
  );
end;
$$;

grant execute on function public.admin_generate_codes(text, integer) to authenticated;
