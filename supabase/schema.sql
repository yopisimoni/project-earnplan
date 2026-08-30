-- Project EarnPlan pilot schema
-- Apply to a dedicated EarnPlan Supabase project only.

create extension if not exists pgcrypto;

create table if not exists public.pilot_signups (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('earner','business')),
  name text not null,
  email text not null,
  area text,
  source text not null default 'project-earnplan',
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.project_requests (
  id uuid primary key default gen_random_uuid(),
  problem_type text not null,
  problem text not null,
  deadline text,
  recommended_package text,
  estimated_price text,
  source text not null default 'project-earnplan',
  status text not null default 'submitted',
  created_at timestamptz not null default now()
);

alter table public.pilot_signups enable row level security;
alter table public.project_requests enable row level security;

grant insert on table public.pilot_signups to anon, authenticated;
grant insert on table public.project_requests to anon, authenticated;

create policy "public may submit pilot signups"
on public.pilot_signups
for insert
to anon, authenticated
with check (
  char_length(name) between 1 and 120
  and char_length(email) between 3 and 320
  and type in ('earner','business')
);

create policy "public may submit project requests"
on public.project_requests
for insert
to anon, authenticated
with check (
  problem_type in ('content','presence','website','admin','data')
  and char_length(problem) between 5 and 4000
);

-- No SELECT/UPDATE/DELETE policy is granted to public clients.
-- Public browser users can submit records but cannot read stored leads.

create index if not exists pilot_signups_created_at_idx
  on public.pilot_signups (created_at desc);

create index if not exists project_requests_created_at_idx
  on public.project_requests (created_at desc);
