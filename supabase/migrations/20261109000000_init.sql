-- Budgeto schema. RLS on every table: a user only sees and changes their own rows.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  name text,
  kwop_k text,
  intended_plan text,
  source jsonb,
  answers jsonb not null default '{}'::jsonb,
  goal_monthly numeric(10, 2),
  goal_started_at timestamptz,
  last_plan jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  device_id text,
  file_name text,
  result jsonb,
  shared boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists reports_user_idx on public.reports (user_id, created_at desc);
create index if not exists reports_device_idx on public.reports (device_id, created_at desc);

create table if not exists public.leak_actions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  merchant_key text not null,
  merchant text not null,
  monthly numeric(10, 2) not null default 0,
  status text not null check (status in ('keep', 'cancelled')),
  updated_at timestamptz not null default now(),
  unique (user_id, merchant_key)
);

create table if not exists public.rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('flag_over', 'ignore_merchant', 'watch_category')),
  value text not null check (char_length(value) between 1 and 80),
  created_at timestamptz not null default now()
);

-- Anonymous tries, for the server-side limit (3 a day per device and per IP). Server only.
create table if not exists public.tries (
  id bigint generated always as identity primary key,
  device_id text,
  ip text,
  user_id uuid,
  created_at timestamptz not null default now()
);
create index if not exists tries_device_idx on public.tries (device_id, created_at);
create index if not exists tries_ip_idx on public.tries (ip, created_at);

alter table public.profiles enable row level security;
alter table public.reports enable row level security;
alter table public.leak_actions enable row level security;
alter table public.rules enable row level security;
alter table public.tries enable row level security;

drop policy if exists "own profile read" on public.profiles;
create policy "own profile read" on public.profiles for select using (auth.uid() = id);
drop policy if exists "own profile update" on public.profiles;
create policy "own profile update" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "own reports read" on public.reports;
create policy "own reports read" on public.reports for select using (auth.uid() = user_id);
drop policy if exists "own reports delete" on public.reports;
create policy "own reports delete" on public.reports for delete using (auth.uid() = user_id);

drop policy if exists "own leak actions" on public.leak_actions;
create policy "own leak actions" on public.leak_actions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own rules" on public.rules;
create policy "own rules" on public.rules for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- tries: no policy = no access except the service role.

-- Profile row created with every new account.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
