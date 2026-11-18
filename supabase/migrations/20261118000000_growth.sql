-- Growth machine (Kwop Pro): invites + rewards, creator program, retention offer, emails, cancel reasons, owner numbers.
-- Additive only: no existing row is changed or removed. RLS on every new table.

alter table public.profiles add column if not exists invite_code text unique;
alter table public.profiles add column if not exists invited_by uuid references auth.users (id) on delete set null;
alter table public.profiles add column if not exists bonus_used integer not null default 0;
alter table public.profiles add column if not exists paywall_seen_at timestamptz;
alter table public.profiles add column if not exists offer_until timestamptz;
alter table public.profiles add column if not exists offer_ref text;
alter table public.profiles add column if not exists cancelled_at timestamptz;
alter table public.profiles add column if not exists email_opt_out boolean not null default false;

-- Rewards in Budgeto's units (extra statement scans). Written by the server only.
create table if not exists public.rewards (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('invite_signup', 'invited_welcome', 'invite_paid')),
  scans integer not null check (scans > 0),
  friend_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (user_id, kind, friend_id)
);
create index if not exists rewards_user_idx on public.rewards (user_id);

-- Creator program applications: anyone can apply (through the server, rate-limited); only the owner reads (/admin).
create table if not exists public.creator_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  email text not null check (char_length(email) between 3 and 120),
  handle text not null check (char_length(handle) between 1 and 80),
  platform text not null check (platform in ('tiktok', 'instagram', 'both')),
  avg_views integer not null default 0 check (avg_views >= 0),
  country text not null check (char_length(country) between 1 and 60),
  status text not null default 'new' check (status in ('new', 'accepted', 'active', 'stopped')),
  code text check (code is null or code ~ '^[A-Za-z0-9_-]{1,24}$'),
  ip text,
  created_at timestamptz not null default now()
);
create index if not exists creator_ip_idx on public.creator_applications (ip, created_at);

-- "Before you go": the reason someone cancels (read by the owner in /admin).
create table if not exists public.cancel_feedback (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users (id) on delete set null,
  reason text not null check (reason in ('too_expensive', 'not_using', 'missing', 'other')),
  detail text check (detail is null or char_length(detail) <= 600),
  created_at timestamptz not null default now()
);

-- Each email goes once: (user, kind, key) is unique.
create table if not exists public.email_log (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null,
  key text not null default '',
  created_at timestamptz not null default now(),
  unique (user_id, kind, key)
);

-- Funnel numbers for /admin (paywall views, payments). Server only.
create table if not exists public.events (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users (id) on delete set null,
  type text not null,
  detail text,
  amount_cents integer,
  created_at timestamptz not null default now()
);
create index if not exists events_type_idx on public.events (type, created_at);

alter table public.rewards enable row level security;
alter table public.creator_applications enable row level security;
alter table public.cancel_feedback enable row level security;
alter table public.email_log enable row level security;
alter table public.events enable row level security;

drop policy if exists "own rewards read" on public.rewards;
create policy "own rewards read" on public.rewards for select using (auth.uid() = user_id);
-- creator_applications, cancel_feedback, email_log, events: no policy = service role only.

-- Users may edit only their own name, answers and goal: rewards, offer window, invite and plan fields are server-only.
revoke update on public.profiles from authenticated, anon;
grant update (name, answers, goal_monthly, goal_started_at) on public.profiles to authenticated;
