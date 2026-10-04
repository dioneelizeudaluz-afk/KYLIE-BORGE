-- KYLIE BORGE - FASE 3.5 - 0007 seed checkout urls

update public.plans set checkout_url = 'https://checkout.escalepay.com/9466304' where slug = 'teste' and checkout_url is null;
update public.plans set checkout_url = 'https://checkout.escalepay.com/5783441' where slug = 'pro' and checkout_url is null;
update public.plans set checkout_url = 'https://checkout.escalepay.com/4052897' where slug = 'premium' and checkout_url is null;
