-- Saudi Work Connect — candidate application schema
-- Apply only to the dedicated Saudi Work Supabase project.

create extension if not exists pgcrypto;

create table if not exists public.candidates (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new','reviewed','suitable','employer_review','interview','selected','documents_requested','processing','placed','rejected')),
  full_name text not null check (char_length(full_name) between 2 and 120),
  email text not null check (char_length(email) <= 254),
  phone text not null check (char_length(phone) between 6 and 40),
  nationality text,
  country_of_residence text,
  occupation text not null,
  years_experience integer check (years_experience between 0 and 60),
  skills text,
  languages text,
  preferred_role text,
  passport_status text check (passport_status in ('valid','expired','none','other')),
  relocation_ready boolean not null default false,
  consent_to_share boolean not null default false,
  consent_version text not null default 'candidate-consent-v1-2026-09-02',
  cv_storage_path text,
  source text not null default 'website',
  notes text
);

create index if not exists candidates_status_idx on public.candidates(status);
create index if not exists candidates_created_at_idx on public.candidates(created_at desc);
create index if not exists candidates_occupation_idx on public.candidates(occupation);

alter table public.candidates enable row level security;

-- No direct public table access. Applications are submitted through an Edge Function.
revoke all on table public.candidates from anon, authenticated;

-- Private CV bucket. Files are written server-side by the application Edge Function.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'candidate-cvs',
  'candidate-cvs',
  false,
  5242880,
  array['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Keep browser clients from directly reading/writing CVs.
revoke all on table storage.objects from anon, authenticated;

comment on table public.candidates is 'Private Saudi Work Connect candidate applications. Public browser access is disabled; use the application Edge Function.';
