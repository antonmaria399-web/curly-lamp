-- Budgeto growth machine: invites, creators, offers, emails, cancel reasons, funnel events.
-- Additive only: never touches existing rows.

alter table public.profiles add column if not exists invite_code text unique;
alter table public.profiles add column if not exists invited_by uuid references auth.users (id) on delete set null;
alter table public.profiles add column if not exists ref_code text; -- creator link (?ref=)
alter table public.profiles add column if not exists bonus_scans int not null default 0;
alter table public.profiles add column if not exists invite_paid_rewarded boolean not null default false;
alter table public.profiles add column if not exists offer_until timestamptz;
alter table public.profiles add column if not exists offer_seen_at timestamptz;
alter table public.profiles add column if not exists email_opt_out boolean not null default false;
alter table public.profiles add column if not exists last_seen_news int not null default 0;

-- Funnel events kept locally for the owner's /admin numbers (Kwop gets them too). Server only.
create table if not exists public.events (
  id bigint generated always as identity primary key,
  type text not null,
  user_id uuid references auth.users (id) on delete cascade,
  detail text,
  created_at timestamptz not null default now()
);
create index if not exists events_type_idx on public.events (type, created_at desc);
create index if not exists events_user_idx on public.events (user_id, type, created_at desc);

-- Invite rewards ledger (counted on the server).
create table if not exists public.invite_rewards (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  friend_id uuid references auth.users (id) on delete set null,
  kind text not null check (kind in ('signup', 'friend_signup', 'friend_paid')),
  scans int not null,
  created_at timestamptz not null default now(),
  unique (user_id, friend_id, kind)
);

-- Creator applications: anyone can apply (through the server, rate-limited), only the owner reads (through /admin).
create table if not exists public.creator_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  email text not null check (char_length(email) between 3 and 160),
  handle text not null check (char_length(handle) between 1 and 80),
  platform text not null check (platform in ('tiktok', 'instagram', 'both')),
  avg_views int not null default 0,
  country text not null check (char_length(country) between 1 and 60),
  status text not null default 'new' check (status in ('new', 'accepted', 'active', 'stopped')),
  ref_code text,
  ip text,
  created_at timestamptz not null default now()
);

-- Monday payouts typed by the owner.
create table if not exists public.creator_payouts (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.creator_applications (id) on delete cascade,
  week date not null,
  video_url text,
  views int not null default 0,
  created_at timestamptz not null default now()
);

-- Why people cancel (one tap), for the owner.
create table if not exists public.cancel_feedback (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users (id) on delete set null,
  reason text not null check (reason in ('too_expensive', 'not_using', 'missing', 'other')),
  note text check (note is null or char_length(note) <= 500),
  cancelled boolean not null default false,
  created_at timestamptz not null default now()
);

-- Each email goes once.
create table if not exists public.email_log (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null,
  key text not null,
  created_at timestamptz not null default now(),
  unique (user_id, kind, key)
);

alter table public.events enable row level security;
alter table public.invite_rewards enable row level security;
alter table public.creator_applications enable row level security;
alter table public.creator_payouts enable row level security;
alter table public.cancel_feedback enable row level security;
alter table public.email_log enable row level security;

drop policy if exists "own invite rewards" on public.invite_rewards;
create policy "own invite rewards" on public.invite_rewards for select using (auth.uid() = user_id);
-- events, creator_applications, creator_payouts, cancel_feedback, email_log: no policy = service role only.

-- Users must not raise their own bonus or offer window: column-level update rights only for safe columns.
revoke update on public.profiles from authenticated, anon;
grant update (name, answers, goal_monthly, goal_started_at, last_seen_news) on public.profiles to authenticated;
