-- Gemini AI Question Bank schema
-- Execute inside Supabase SQL Editor (PostgreSQL 15)

create extension if not exists "pgcrypto";

-- Shadow profile table (linked to auth.users UID)
create table if not exists public.users (
  id uuid primary key,
  email text not null unique,
  display_name text,
  role text not null default 'user',
  credits integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.question_sets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  tags text[] not null default '{}',
  is_private boolean not null default true,
  creator_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  question_set_id uuid references public.question_sets(id) on delete set null,
  creator_id uuid references public.users(id) on delete set null,
  title text not null,
  body text not null,
  explanation text,
  answer text,
  options jsonb,
  tags text[] not null default '{}',
  difficulty text not null default 'Medium',
  category text not null default 'General',
  "references" text,
  is_private boolean not null default true,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  file_path text,
  status text,
  latency_ms integer,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.credits_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  amount integer not null,
  reason text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.question_set_shares (
  id uuid primary key default gen_random_uuid(),
  question_set_id uuid references public.question_sets(id) on delete cascade,
  owner_id uuid references public.users(id) on delete set null,
  recipient_email text not null,
  recipient_user_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Utility function to keep updated_at current
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Attach triggers
create trigger users_updated_at
  before update on public.users
  for each row execute function public.touch_updated_at();

create trigger question_sets_updated_at
  before update on public.question_sets
  for each row execute function public.touch_updated_at();

create trigger questions_updated_at
  before update on public.questions
  for each row execute function public.touch_updated_at();

-- Helpful indexes
create index if not exists questions_creator_idx on public.questions (creator_id);
create index if not exists questions_set_idx on public.questions (question_set_id);
create index if not exists questions_visibility_idx on public.questions (is_private);
create index if not exists question_sets_creator_idx on public.question_sets (creator_id);
create index if not exists ai_logs_user_created_idx on public.ai_logs (user_id, created_at desc);
create index if not exists credits_ledger_user_created_idx on public.credits_ledger (user_id, created_at desc);
create index if not exists question_set_shares_recipient_idx on public.question_set_shares (recipient_email);

-- Recommended Row Level Security (optional if all access is via service role)
alter table public.users enable row level security;
alter table public.question_sets enable row level security;
alter table public.questions enable row level security;
alter table public.ai_logs enable row level security;
alter table public.credits_ledger enable row level security;
alter table public.question_set_shares enable row level security;

create policy "Service role full access" on public.users
  for all
  using (true)
  with check (true);

create policy "Service role full access" on public.question_sets
  for all
  using (true)
  with check (true);

create policy "Service role full access" on public.questions
  for all
  using (true)
  with check (true);

create policy "Service role full access" on public.ai_logs
  for all
  using (true)
  with check (true);

create policy "Service role full access" on public.credits_ledger
  for all
  using (true)
  with check (true);

create policy "Service role full access" on public.question_set_shares
  for all
  using (true)
  with check (true);
