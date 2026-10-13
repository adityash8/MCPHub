create table if not exists public.mcphub_email_subscribers (
  email text primary key,
  created_at timestamptz not null default now()
);
create table if not exists public.mcphub_email_attempts (
  ip_hash text not null,
  attempted_at timestamptz not null default now()
);
create index if not exists mcphub_email_attempts_ip_time on public.mcphub_email_attempts (ip_hash, attempted_at);
alter table public.mcphub_email_subscribers enable row level security;
alter table public.mcphub_email_attempts enable row level security;
revoke all on public.mcphub_email_subscribers from anon, authenticated;
revoke all on public.mcphub_email_attempts from anon, authenticated;
create or replace function public.mcphub_capture_email(p_email text, p_ip_hash text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if length(p_email) > 254 or p_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' or p_ip_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'invalid input' using errcode = '22023';
  end if;
  delete from public.mcphub_email_attempts where attempted_at < now() - interval '1 day';
  perform pg_advisory_xact_lock(hashtext(p_ip_hash));
  if (select count(*) from public.mcphub_email_attempts where ip_hash = p_ip_hash and attempted_at > now() - interval '1 day') >= 5 then
    raise exception 'rate limit' using errcode = 'P0001';
  end if;
  insert into public.mcphub_email_attempts (ip_hash) values (p_ip_hash);
  insert into public.mcphub_email_subscribers (email) values (p_email) on conflict do nothing;
end; $$;
revoke all on function public.mcphub_capture_email(text, text) from public, anon, authenticated;
grant execute on function public.mcphub_capture_email(text, text) to service_role;
