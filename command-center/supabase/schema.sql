-- VULT LABEL command center. Run once in Supabase: SQL Editor > New query > paste > Run.
-- Every table has row level security on and no policies, so the public (anon) key can
-- read or write nothing. The command center talks to the database from its server with
-- the service role key, which bypasses row level security.

create extension if not exists pgcrypto;

-- People waiting for the launch
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(email) and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' and length(email) <= 254),
  source text not null default 'landing' check (length(source) <= 40),
  created_at timestamptz not null default now()
);

-- One row: the launch the countdown points at
create table if not exists public.launch (
  id int primary key default 1 check (id = 1),
  name text not null default 'Drop 04' check (length(name) <= 60),
  launch_at timestamptz,
  updated_at timestamptz not null default now()
);
insert into public.launch (id) values (1) on conflict (id) do nothing;

-- Content calendar. A post without a date sits in the idea bank.
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  post_date date,
  platform text not null default 'instagram' check (platform in ('instagram', 'tiktok', 'x', 'other')),
  idea text not null check (length(idea) between 1 and 500),
  status text not null default 'idea' check (status in ('idea', 'draft', 'scheduled', 'posted')),
  created_at timestamptz not null default now()
);

-- Supplier and sample board
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(title) between 1 and 200),
  category text not null default 'other' check (category in ('supplier', 'sample', 'other')),
  status text not null default 'todo' check (status in ('todo', 'waiting', 'done')),
  contact text check (length(contact) <= 200),
  due_on date,
  notes text check (length(notes) <= 2000),
  created_at timestamptz not null default now()
);

-- The store's editable text and layout, one JSON document read by the site
create table if not exists public.site_content (
  id int primary key default 1 check (id = 1),
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
insert into public.site_content (id) values (1) on conflict (id) do nothing;

alter table public.waitlist enable row level security;
alter table public.launch enable row level security;
alter table public.posts enable row level security;
alter table public.tasks enable row level security;
alter table public.site_content enable row level security;

-- Starting points. Edit or delete them in the command center.
insert into public.posts (idea, platform)
select * from (values
  ('Film the vault dial turning to 12, 47, 83 and the door opening. Caption: the combination is on the door.', 'tiktok'),
  ('Drop 03 piece by piece: one post per camera, CAM 02 to CAM 09, price and run size on screen.', 'instagram'),
  ('Close-up of the Vault Hoodie fleece: 450 GSM, boxy fit.', 'instagram'),
  ('The run counter: show how many of a piece are left as the drop sells.', 'x'),
  ('Countdown post for the next drop with the date and the waitlist link.', 'instagram')
) as seed(idea, platform)
where not exists (select 1 from public.posts);

insert into public.tasks (title, category, notes)
select * from (values
  ('Order fit samples for the next drop', 'sample', null),
  ('Confirm fabric weights and lead times with the supplier', 'supplier', null),
  ('Photograph every piece for the store', 'other', 'The store still shows drawings; send the photos to replace them.'),
  ('Connect card payments (Stripe)', 'other', 'Checkout is in test mode until this is done.'),
  ('Set up order confirmation emails', 'other', null)
) as seed(title, category, notes)
where not exists (select 1 from public.tasks);
