-- ==========================================================
-- MASYARAKAT LITERASI - COMPLETE DATABASE SCHEMA MIGRATION
-- Based on PRD Chapter 10
-- ==========================================================

-- 1. ENUMS
create type user_role as enum ('member', 'admin');
create type content_status as enum ('draft', 'published');
create type resource_type as enum ('book', 'tool', 'pdf');
create type age_category as enum ('anak', 'remaja', 'dewasa', 'semua');
create type stat_type as enum ('metric', 'fact', 'chart');
create type subscriber_status as enum ('pending', 'active', 'unsubscribed');
create type participation_status as enum ('active', 'completed', 'abandoned');
create type notif_status as enum ('queued', 'sent', 'failed');

-- 2. PROFILES (Terhubung ke auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  whatsapp text,
  avatar_url text,
  role user_role not null default 'member',
  reminder_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger auto create profile on signup
create or replace function handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, full_name, whatsapp, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'whatsapp',
    'member'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Helper function is_admin()
create or replace function is_admin() returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- 3. KATEGORI & ARTIKEL
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  cover_url text,
  category_id uuid not null references categories(id) on delete restrict,
  author_id uuid references profiles(id) on delete set null,
  status content_status not null default 'draft',
  reading_time int not null default 1,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_articles_status_published on articles (status, published_at desc);
create index if not exists idx_articles_category on articles (category_id);
create index if not exists idx_articles_slug on articles (slug);

-- 4. RESOURCE HUB
create table if not exists resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  type resource_type not null,
  age_category age_category not null default 'semua',
  external_url text,
  file_path text,
  cover_url text,
  publisher text not null default 'Masyarakat Literasi',
  rating numeric(3,2) default 4.8,
  download_count int not null default 0,
  status content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_vector tsvector generated always as (
    to_tsvector('indonesian', coalesce(title,'') || ' ' || coalesce(description,''))
  ) stored
);
create index if not exists idx_resources_filter on resources (status, type, age_category);
create index if not exists idx_resources_search on resources using gin (search_vector);
create index if not exists idx_resources_slug on resources (slug);

create table if not exists resource_favorites (
  user_id uuid not null references profiles(id) on delete cascade,
  resource_id uuid not null references resources(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, resource_id)
);

-- 5. STATISTIK & FAKTA
create table if not exists statistics (
  id uuid primary key default gen_random_uuid(),
  type stat_type not null,
  label text not null,
  value text,
  description text,
  chart_data jsonb,
  source_name text not null,
  source_url text,
  year int,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists idx_statistics_active on statistics (is_active, sort_order asc);

-- 6. TIPS & TANTANGAN
create table if not exists tips (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  icon text default 'BookOpen',
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists idx_tips_active on tips (is_active, sort_order asc);

create table if not exists challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  duration_days int not null check (duration_days in (7, 21, 30)),
  cover_url text,
  status content_status not null default 'draft',
  participants_count int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_challenges_slug on challenges (slug);

create table if not exists challenge_days (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references challenges(id) on delete cascade,
  day_number int not null check (day_number between 1 and 30),
  task_title text not null,
  task_description text,
  unique (challenge_id, day_number)
);

create table if not exists challenge_participations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  challenge_id uuid not null references challenges(id) on delete cascade,
  status participation_status not null default 'active',
  current_streak int not null default 0,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (user_id, challenge_id)
);

create table if not exists challenge_checkins (
  id uuid primary key default gen_random_uuid(),
  participation_id uuid not null references challenge_participations(id) on delete cascade,
  day_number int not null,
  checkin_date date not null,
  reflection text,
  created_at timestamptz not null default now(),
  unique (participation_id, day_number),
  unique (participation_id, checkin_date)
);

-- 7. HALAMAN STATIS
create table if not exists static_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique, -- 'tentang', 'visi-misi'
  title text not null,
  content text not null,
  updated_at timestamptz not null default now()
);

-- 8. NEWSLETTER, BROADCAST, NOTIFIKASI, KONTAK
create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  whatsapp text not null unique,
  email text,
  name text,
  status subscriber_status not null default 'pending',
  confirm_token text not null default encode(gen_random_bytes(16), 'hex'),
  confirmed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists idx_subscribers_status on subscribers (status);

create table if not exists broadcasts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  created_by uuid references profiles(id) on delete set null,
  sent_at timestamptz,
  total_recipients int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists notification_logs (
  id uuid primary key default gen_random_uuid(),
  recipient_whatsapp text not null,
  kind text not null, -- 'confirmation' | 'broadcast' | 'challenge_reminder'
  broadcast_id uuid references broadcasts(id) on delete set null,
  status notif_status not null default 'queued',
  provider_response jsonb,
  created_at timestamptz not null default now()
);

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================

-- Profiles RLS
alter table profiles enable row level security;
create policy "Profil dapat dilihat oleh pemilik atau admin" on profiles
  for select using (auth.uid() = id or is_admin());
create policy "Profil dapat diupdate oleh pemilik atau admin" on profiles
  for update using (auth.uid() = id or is_admin());

-- Categories RLS
alter table categories enable row level security;
create policy "Kategori dapat dibaca publik" on categories
  for select using (true);
create policy "Admin kelola kategori" on categories
  for all using (is_admin()) with check (is_admin());

-- Articles RLS
alter table articles enable row level security;
create policy "Artikel terbit dapat dibaca publik" on articles
  for select using (status = 'published' or is_admin());
create policy "Admin kelola artikel" on articles
  for all using (is_admin()) with check (is_admin());

-- Resources RLS
alter table resources enable row level security;
create policy "Resource terbit dapat dibaca publik" on resources
  for select using (status = 'published' or is_admin());
create policy "Admin kelola resource" on resources
  for all using (is_admin()) with check (is_admin());

-- Resource Favorites RLS
alter table resource_favorites enable row level security;
create policy "Favorit milik pengguna sendiri" on resource_favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Statistics RLS
alter table statistics enable row level security;
create policy "Statistik aktif dapat dibaca publik" on statistics
  for select using (is_active = true or is_admin());
create policy "Admin kelola statistik" on statistics
  for all using (is_admin()) with check (is_admin());

-- Tips RLS
alter table tips enable row level security;
create policy "Tips aktif dapat dibaca publik" on tips
  for select using (is_active = true or is_admin());
create policy "Admin kelola tips" on tips
  for all using (is_admin()) with check (is_admin());

-- Challenges & Days RLS
alter table challenges enable row level security;
create policy "Tantangan terbit dapat dibaca publik" on challenges
  for select using (status = 'published' or is_admin());
create policy "Admin kelola tantangan" on challenges
  for all using (is_admin()) with check (is_admin());

alter table challenge_days enable row level security;
create policy "Silabus tantangan dapat dibaca publik" on challenge_days
  for select using (true);
create policy "Admin kelola silabus" on challenge_days
  for all using (is_admin()) with check (is_admin());

-- Participations & Checkins RLS
alter table challenge_participations enable row level security;
create policy "Partisipasi milik pengguna sendiri" on challenge_participations
  for all using (auth.uid() = user_id or is_admin())
  with check (auth.uid() = user_id or is_admin());

alter table challenge_checkins enable row level security;
create policy "Checkin milik partisipan sendiri" on challenge_checkins
  for all using (
    exists (
      select 1 from challenge_participations p
      where p.id = participation_id and (p.user_id = auth.uid() or is_admin())
    )
  )
  with check (
    exists (
      select 1 from challenge_participations p
      where p.id = participation_id and (p.user_id = auth.uid() or is_admin())
    )
  );

-- Static Pages RLS
alter table static_pages enable row level security;
create policy "Halaman statis dibaca publik" on static_pages
  for select using (true);
create policy "Admin kelola halaman statis" on static_pages
  for all using (is_admin()) with check (is_admin());

-- Subscribers RLS
alter table subscribers enable row level security;
create policy "Admin kelola subscriber" on subscribers
  for all using (is_admin()) with check (is_admin());

-- Broadcasts & Notification Logs RLS
alter table broadcasts enable row level security;
create policy "Admin kelola broadcast" on broadcasts
  for all using (is_admin()) with check (is_admin());

alter table notification_logs enable row level security;
create policy "Admin lihat notification logs" on notification_logs
  for all using (is_admin()) with check (is_admin());

-- Contact Messages RLS
alter table contact_messages enable row level security;
create policy "Publik kirim pesan kontak" on contact_messages
  for insert with check (true);
create policy "Admin kelola pesan kontak" on contact_messages
  for all using (is_admin()) with check (is_admin());

-- ==========================================================
-- STORAGE BUCKETS CONFIGURATION (SQL)
-- ==========================================================
insert into storage.buckets (id, name, public)
values 
  ('covers', 'covers', true),
  ('resources', 'resources', true),
  ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Storage policies: Public read for covers, resources, avatars
create policy "Public read covers" on storage.objects
  for select using (bucket_id in ('covers', 'resources', 'avatars'));

create policy "Admin upload covers & resources" on storage.objects
  for insert with check (bucket_id in ('covers', 'resources') and is_admin());

create policy "User upload avatar" on storage.objects
  for insert with check (bucket_id = 'avatars' and auth.uid() is not null);
