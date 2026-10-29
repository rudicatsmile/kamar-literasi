-- ==============================================================================
-- Rumah Literasi - COMPLETE SETUP & SEED SCRIPT (IDEMPOTENT & VALID HEX UUIDs)
-- ==============================================================================

-- 1. SEARCH CONFIGURATION COMPATIBILITY
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_ts_config WHERE cfgname = 'indonesian') THEN
    CREATE TEXT SEARCH CONFIGURATION indonesian (COPY = simple);
  END IF;
END $$;

-- 2. ENUMS
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('member', 'admin');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_status') THEN
    CREATE TYPE content_status AS ENUM ('draft', 'published');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'resource_type') THEN
    CREATE TYPE resource_type AS ENUM ('book', 'tool', 'pdf');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'age_category') THEN
    CREATE TYPE age_category AS ENUM ('anak', 'remaja', 'dewasa', 'semua');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'stat_type') THEN
    CREATE TYPE stat_type AS ENUM ('metric', 'fact', 'chart');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscriber_status') THEN
    CREATE TYPE subscriber_status AS ENUM ('pending', 'active', 'unsubscribed');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'participation_status') THEN
    CREATE TYPE participation_status AS ENUM ('active', 'completed', 'abandoned');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notif_status') THEN
    CREATE TYPE notif_status AS ENUM ('queued', 'sent', 'failed');
  END IF;
END $$;

-- 3. PROFILES (Terhubung ke auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  whatsapp text,
  avatar_url text,
  role user_role NOT NULL DEFAULT 'member',
  reminder_enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Trigger auto create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user() RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, whatsapp, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'whatsapp',
    'member'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    whatsapp = COALESCE(EXCLUDED.whatsapp, public.profiles.whatsapp);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Helper function is_admin()
CREATE OR REPLACE FUNCTION is_admin() RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 4. KATEGORI & ARTIKEL
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text NOT NULL,
  cover_url text,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  status content_status NOT NULL DEFAULT 'draft',
  reading_time int NOT NULL DEFAULT 1,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_articles_status_published ON articles (status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles (category_id);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles (slug);

-- 5. RESOURCE HUB
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL,
  type resource_type NOT NULL,
  age_category age_category NOT NULL DEFAULT 'semua',
  external_url text,
  file_path text,
  cover_url text,
  publisher text NOT NULL DEFAULT 'Rumah Literasi',
  rating numeric(3,2) DEFAULT 4.8,
  download_count int NOT NULL DEFAULT 0,
  status content_status NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('indonesian', coalesce(title,'') || ' ' || coalesce(description,''))
  ) STORED
);
CREATE INDEX IF NOT EXISTS idx_resources_filter ON resources (status, type, age_category);
CREATE INDEX IF NOT EXISTS idx_resources_search ON resources USING gin (search_vector);
CREATE INDEX IF NOT EXISTS idx_resources_slug ON resources (slug);

CREATE TABLE IF NOT EXISTS resource_favorites (
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  resource_id uuid NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, resource_id)
);

-- 6. STATISTIK & FAKTA
CREATE TABLE IF NOT EXISTS statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type stat_type NOT NULL,
  label text NOT NULL,
  value text,
  description text,
  chart_data jsonb,
  source_name text NOT NULL,
  source_url text,
  year int,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_statistics_active ON statistics (is_active, sort_order ASC);

-- 7. TIPS & TANTANGAN
CREATE TABLE IF NOT EXISTS tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  icon text DEFAULT 'BookOpen',
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tips_active ON tips (is_active, sort_order ASC);

CREATE TABLE IF NOT EXISTS challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL,
  duration_days int NOT NULL CHECK (duration_days IN (7, 21, 30)),
  cover_url text,
  status content_status NOT NULL DEFAULT 'draft',
  participants_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_challenges_slug ON challenges (slug);

CREATE TABLE IF NOT EXISTS challenge_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  day_number int NOT NULL CHECK (day_number BETWEEN 1 AND 30),
  task_title text NOT NULL,
  task_description text,
  UNIQUE (challenge_id, day_number)
);

CREATE TABLE IF NOT EXISTS challenge_participations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_id uuid NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  status participation_status NOT NULL DEFAULT 'active',
  current_streak int NOT NULL DEFAULT 0,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  UNIQUE (user_id, challenge_id)
);

CREATE TABLE IF NOT EXISTS challenge_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participation_id uuid NOT NULL REFERENCES challenge_participations(id) ON DELETE CASCADE,
  day_number int NOT NULL,
  checkin_date date NOT NULL,
  reflection text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (participation_id, day_number),
  UNIQUE (participation_id, checkin_date)
);

-- 8. HALAMAN STATIS
CREATE TABLE IF NOT EXISTS static_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  content text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 9. NEWSLETTER, BROADCAST, NOTIFIKASI, KONTAK
CREATE TABLE IF NOT EXISTS subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp text NOT NULL UNIQUE,
  email text,
  name text,
  status subscriber_status NOT NULL DEFAULT 'pending',
  confirm_token text NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
  confirmed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_subscribers_status ON subscribers (status);

CREATE TABLE IF NOT EXISTS broadcasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  sent_at timestamptz,
  total_recipients int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notification_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_whatsapp text NOT NULL,
  kind text NOT NULL,
  broadcast_id uuid REFERENCES broadcasts(id) ON DELETE SET NULL,
  status notif_status NOT NULL DEFAULT 'queued',
  provider_response jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Profiles RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Profil dapat dilihat oleh pemilik atau admin" ON profiles;
CREATE POLICY "Profil dapat dilihat oleh pemilik atau admin" ON profiles
  FOR SELECT USING (auth.uid() = id OR is_admin());

DROP POLICY IF EXISTS "Profil dapat diupdate oleh pemilik atau admin" ON profiles;
CREATE POLICY "Profil dapat diupdate oleh pemilik atau admin" ON profiles
  FOR UPDATE USING (auth.uid() = id OR is_admin());

-- Categories RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Kategori dapat dibaca publik" ON categories;
CREATE POLICY "Kategori dapat dibaca publik" ON categories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin kelola kategori" ON categories;
CREATE POLICY "Admin kelola kategori" ON categories
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Articles RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Artikel terbit dapat dibaca publik" ON articles;
CREATE POLICY "Artikel terbit dapat dibaca publik" ON articles
  FOR SELECT USING (status = 'published' OR is_admin());

DROP POLICY IF EXISTS "Admin kelola artikel" ON articles;
CREATE POLICY "Admin kelola artikel" ON articles
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Resources RLS
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Resource terbit dapat dibaca publik" ON resources;
CREATE POLICY "Resource terbit dapat dibaca publik" ON resources
  FOR SELECT USING (status = 'published' OR is_admin());

DROP POLICY IF EXISTS "Admin kelola resource" ON resources;
CREATE POLICY "Admin kelola resource" ON resources
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Resource Favorites RLS
ALTER TABLE resource_favorites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Favorit milik pengguna sendiri" ON resource_favorites;
CREATE POLICY "Favorit milik pengguna sendiri" ON resource_favorites
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Statistics RLS
ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Statistik aktif dapat dibaca publik" ON statistics;
CREATE POLICY "Statistik aktif dapat dibaca publik" ON statistics
  FOR SELECT USING (is_active = true OR is_admin());

DROP POLICY IF EXISTS "Admin kelola statistik" ON statistics;
CREATE POLICY "Admin kelola statistik" ON statistics
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Tips RLS
ALTER TABLE tips ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tips aktif dapat dibaca publik" ON tips;
CREATE POLICY "Tips aktif dapat dibaca publik" ON tips
  FOR SELECT USING (is_active = true OR is_admin());

DROP POLICY IF EXISTS "Admin kelola tips" ON tips;
CREATE POLICY "Admin kelola tips" ON tips
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Challenges & Days RLS
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tantangan terbit dapat dibaca publik" ON challenges;
CREATE POLICY "Tantangan terbit dapat dibaca publik" ON challenges
  FOR SELECT USING (status = 'published' OR is_admin());

DROP POLICY IF EXISTS "Admin kelola tantangan" ON challenges;
CREATE POLICY "Admin kelola tantangan" ON challenges
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

ALTER TABLE challenge_days ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Silabus tantangan dapat dibaca publik" ON challenge_days;
CREATE POLICY "Silabus tantangan dapat dibaca publik" ON challenge_days
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin kelola silabus" ON challenge_days;
CREATE POLICY "Admin kelola silabus" ON challenge_days
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Participations & Checkins RLS
ALTER TABLE challenge_participations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Partisipasi milik pengguna sendiri" ON challenge_participations;
CREATE POLICY "Partisipasi milik pengguna sendiri" ON challenge_participations
  FOR ALL USING (auth.uid() = user_id OR is_admin())
  WITH CHECK (auth.uid() = user_id OR is_admin());

ALTER TABLE challenge_checkins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Checkin milik partisipan sendiri" ON challenge_checkins;
CREATE POLICY "Checkin milik partisipan sendiri" ON challenge_checkins
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM challenge_participations p
      WHERE p.id = participation_id AND (p.user_id = auth.uid() OR is_admin())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM challenge_participations p
      WHERE p.id = participation_id AND (p.user_id = auth.uid() OR is_admin())
    )
  );

-- Static Pages RLS
ALTER TABLE static_pages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Halaman statis dibaca publik" ON static_pages;
CREATE POLICY "Halaman statis dibaca publik" ON static_pages
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin kelola halaman statis" ON static_pages;
CREATE POLICY "Admin kelola halaman statis" ON static_pages
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Subscribers RLS
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin kelola subscriber" ON subscribers;
CREATE POLICY "Admin kelola subscriber" ON subscribers
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Broadcasts & Notification Logs RLS
ALTER TABLE broadcasts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin kelola broadcast" ON broadcasts;
CREATE POLICY "Admin kelola broadcast" ON broadcasts
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin lihat notification logs" ON notification_logs;
CREATE POLICY "Admin lihat notification logs" ON notification_logs
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Contact Messages RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Publik kirim pesan kontak" ON contact_messages;
CREATE POLICY "Publik kirim pesan kontak" ON contact_messages
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin kelola pesan kontak" ON contact_messages;
CREATE POLICY "Admin kelola pesan kontak" ON contact_messages
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- ==============================================================================
-- STORAGE BUCKETS CONFIGURATION (SAFE EXCEPTION HANDLING)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('covers', 'covers', true),
  ('resources', 'resources', true),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  BEGIN
    DROP POLICY IF EXISTS "Public read covers" ON storage.objects;
    CREATE POLICY "Public read covers" ON storage.objects
      FOR SELECT USING (bucket_id IN ('covers', 'resources', 'avatars'));
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Notice: storage policy handled by Supabase Storage: %', SQLERRM;
  END;

  BEGIN
    DROP POLICY IF EXISTS "Admin upload covers & resources" ON storage.objects;
    CREATE POLICY "Admin upload covers & resources" ON storage.objects
      FOR INSERT WITH CHECK (bucket_id IN ('covers', 'resources') AND is_admin());
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Notice: storage policy handled by Supabase Storage: %', SQLERRM;
  END;

  BEGIN
    DROP POLICY IF EXISTS "User upload avatar" ON storage.objects;
    CREATE POLICY "User upload avatar" ON storage.objects
      FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Notice: storage policy handled by Supabase Storage: %', SQLERRM;
  END;
END $$;

-- ==============================================================================
-- SEED DATA (ALL IDS USE VALID 128-BIT HEX UUIDs: 0-9, a-f)
-- ==============================================================================

-- 1. KATEGORI (Prefix: c0000000-...)
INSERT INTO categories (id, name, slug, description) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Literasi Membaca', 'literasi-membaca', 'Teknik membaca mendalam, membangun kebiasaan membaca rutin, dan memilih bahan bacaan berkualitas.'),
  ('c0000000-0000-0000-0000-000000000002', 'Literasi Digital', 'literasi-digital', 'Kecakapan menyaring informasi, keamanan berselancar di dunia maya, dan etika komunikasi digital.'),
  ('c0000000-0000-0000-0000-000000000003', 'Literasi Anak', 'literasi-anak', 'Panduan untuk orang tua dan guru dalam menanamkan kecintaan buku sejak usia dini.'),
  ('c0000000-0000-0000-0000-000000000004', 'Literasi Menulis', 'literasi-menulis', 'Menyusun gagasan, jurnal harian reflektif, esai argumentatif, hingga penulisan kreatif.'),
  ('c0000000-0000-0000-0000-000000000005', 'Berpikir Kritis', 'berpikir-kritis', 'Menghindari bias kognitif, menganalisis klaim logis, dan mengenali manipulasi opini publik.'),
  ('c0000000-0000-0000-0000-000000000006', 'Literasi Informasi', 'literasi-informasi', 'Verifikasi sumber berita, penelusuran data primer, dan menangkal misinformasi di media massa.')
ON CONFLICT (id) DO NOTHING;

-- 2. ARTIKEL (Prefix: a0000000-...)
INSERT INTO articles (id, title, slug, excerpt, content, cover_url, category_id, status, reading_time, published_at) VALUES
  (
    'a0000000-0000-0000-0000-000000000001',
    'Mengapa 15 Menit Membaca Setiap Hari Mengubah Cara Berpikir Anda',
    'mengapa-15-menit-membaca-setiap-hari-mengubah-cara-berpikir',
    'Banyak orang merasa tak punya waktu membaca buku. Padahal, konsistensi seperempat jam sehari mampu mengakumulasi puluhan buku setahun dan merevolusi neuroplastisitas otak.',
    'Membaca bukan sekadar aktivitas mengisi waktu luang; ia adalah latihan kebugaran bagi pikiran. Ketika Anda membaca teks panjang tanpa terganggu notifikasi ponsel, otak Anda melatih sirkuit konsentrasi mendalam (deep reading circuit) yang semakin langka di era linimasa instan.

### Kekuatan Efek Majemuk 15 Menit
Jika Anda membaca dengan kecepatan rata-rata 250 kata per menit, dalam 15 menit Anda dapat menyelesaikan sekitar 3.750 kata. Sebuah buku nonfiksi standar biasanya berisi 60.000 kata. Artinya, hanya dengan 15 menit setiap pagi sebelum membuka media sosial, Anda dapat menyelesaikan satu buku utuh dalam 16 hari, atau sekitar 20 hingga 25 buku berkualitas dalam setahun.

### Melatih Empati dan Perspektif Baru
Penelitian ilmu kognitif menunjukkan bahwa membaca narasi memperluas pemahaman kita terhadap sudut pandang manusia lain. Kita diajak memasuki pergulatan batin tokoh, memahami konteks sosial yang rumit, dan melatih kesabaran dalam mencerna gagasan yang tidak kita setujui.

> *"Buku adalah mesin waktu dan portal empati paling murah yang pernah diciptakan peradaban manusia."*

### Langkah Memulai Kebiasaan Ini:
1. **Tentukan Waktu Tetap**: Pilih waktu tenang, misalnya tepat setelah menyeduh kopi pagi atau 20 menit sebelum tidur malam.
2. **Jauhkan Ponsel**: Letakkan gawai di ruangan berbeda agar tidak tergoda memeriksa notifikasi pesan instan.
3. **Pilih Bahan Bacaan yang Anda Sukai**: Jangan merasa bersalah bila buku klasik terasa berat. Mulailah dari topik yang benar-benar memantik rasa penasaran Anda.
4. **Catat 1 Kalimat Intisari**: Setelah 15 menit selesai, tuliskan satu kalimat refleksi di buku catatan atau aplikasi jurnal Anda.',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200&auto=format&fit=crop',
    'c0000000-0000-0000-0000-000000000001',
    'published',
    4,
    '2026-10-15T08:00:00Z'
  ),
  (
    'a0000000-0000-0000-0000-000000000002',
    'Mengenali Hoaks: 5 Langkah Cepat Sebelum Membagikan Berita',
    'mengenali-hoaks-5-langkah-cepat-sebelum-membagikan-berita',
    'Di grup percakapan keluarga dan media sosial, arus informasi mengalir deras tanpa saringan. Terapkan lima prinsip verifikasi mandiri ini agar tidak menjadi perantara kebohongan.',
    'Kecemasan, kemarahan, dan rasa terkejut adalah pemicu utama seseorang terdorong segera membagikan pesan (forward message). Pembuat hoaks memahami psikologi ini dengan sangat baik.

### 1. Waspadai Judul yang Provokatif
Judul yang memakai huruf kapital berlebihan, tanda seru ganda, atau klaim sensasional ("Wajib Sebarkan!", "Kabar Mengejutkan!") patut dicurigai sejak awal.

### 2. Cek Siapa Sumber Aslinya
Apakah artikel berasal dari media kredibel yang memiliki penanggung jawab redaksi jelas dan terdaftar di Dewan Pers? Jika sumbernya hanya blog gratisan atau pesan berantai tanpa nama, jangan teruskan pesan tersebut.

### 3. Periksa Tanggal dan Konteks Waktu
Sering kali video bencana alam atau peristiwa politik bertahun-tahun silam diunggah kembali seolah-olah baru saja terjadi kemarin sore untuk memantik kegaduhan.

### 4. Lakukan Pencarian Gambar Terbalik (Reverse Image Search)
Gunakan Google Lens atau TinEye untuk memverifikasi foto viral. Seringkali foto yang diklaim sebagai korban kerusuhan ternyata adalah foto kejadian di negara lain atau potongan film dokumenter.

### 5. Tunda 60 Detik Sebelum Klik "Bagi"
Waktu jeda 60 detik memberi kesempatan bagi korteks prefrontal Anda untuk mengambil alih kendali emosi dari amigdala. Tanyakan pada diri sendiri: "Apakah informasi ini bermanfaat, akurat, dan dapat dipertanggungjawabkan?"',
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop',
    'c0000000-0000-0000-0000-000000000002',
    'published',
    5,
    '2026-10-18T10:30:00Z'
  ),
  (
    'a0000000-0000-0000-0000-000000000003',
    'Cara Membacakan Dongeng agar Anak Ketagihan Buku',
    'cara-membacakan-dongeng-agar-anak-ketagihan-buku',
    'Bukan sekadar membaca kata per kata, intonasi, kontak mata, dan dialog interaktif mampu mengubah buku cerita menjadi petualangan magis yang paling dirindukan anak sebelum tidur.',
    'Kunci utama agar anak mencintai buku bukanlah dengan memaksa mereka belajar mengeja terlalu dini, melainkan dengan mengasosiasikan buku dengan rasa aman, kehangatan keluarga, dan keseruan bermain.

### Mengubah Membaca Menjadi Dialog Interaktif
Ketika membacakan buku untuk balita atau usia sekolah dasar awal, gunakan teknik *dialogic reading*:
- Berikan pertanyaan terbuka: "Kira-kira apa yang akan dilakukan si Kancil setelah melihat sungai yang deras ini?"
- Hubungkan cerita dengan dunia nyata anak: "Kucing belang di buku ini mirip dengan kucing tetangga kita ya?"
- Biarkan anak membalik halaman dan memegang buku sendiri.

### Kekuatan Rutinitas Sebelum Tidur
Membaca buku 15 menit menjelang tidur membantu menenangkan saraf anak setelah seharian aktif. Jadikan waktu ini bebas dari layar televisi maupun ponsel pintar.',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1200&auto=format&fit=crop',
    'c0000000-0000-0000-0000-000000000003',
    'published',
    4,
    '2026-10-21T09:15:00Z'
  ),
  (
    'a0000000-0000-0000-0000-000000000004',
    'Menulis Jurnal Harian: Terapi Pikiran dan Penjernih Gagasan',
    'menulis-jurnal-harian-terapi-pikiran-dan-penjernih-gagasan',
    'Menulis bukan hanya hak milik novelis atau wartawan. Siapa pun yang meluangkan waktu menumpahkan pikiran ke atas kertas akan menemukan kejernihan batin dan ketajaman berpikir.',
    'Otak manusia dirancang untuk melahirkan gagasan, bukan menyimpannya tanpa batas. Ketika pikiran Anda terasa penuh, cemas, atau kacau, menulis jurnal (journaling) berfungsi layaknya pelepasan beban memori kerja.

### Tiga Gaya Menulis Jurnal yang Praktis
1. **Morning Pages (Halaman Pagi)**: Tuliskan tiga halaman apa pun yang melintas di benak Anda sesaat setelah bangun tidur tanpa menyunting tata bahasa.
2. **Jurnal Syukur (Gratitude Journal)**: Sebutkan 3 hal spesifik yang Anda syukuri setiap petang.
3. **Catatan Refleksi Keputusan**: Tuliskan mengapa Anda mengambil keputusan penting hari ini dan ekspektasi Anda terhadap hasilnya.',
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop',
    'c0000000-0000-0000-0000-000000000004',
    'published',
    3,
    '2026-10-24T14:00:00Z'
  ),
  (
    'a0000000-0000-0000-0000-000000000005',
    'Mengenal "Confirmation Bias": Jebakan Mental yang Membutakan Fakta',
    'mengenal-confirmation-bias-jebakan-mental-yang-membutakan-fakta',
    'Kita cenderung hanya mencari, memercayai, dan mengingat bukti yang mendukung keyakinan awal kita. Inilah fondasi bagaimana polarisasi sosial dan fanatisme mengakar.',
    'Pernahkah Anda berdebat dengan seseorang di media sosial dan menyadari bahwa sebanyak apa pun bukti ilmiah yang Anda sajikan, mereka tetap tidak bergeming? Anda mungkin sedang berhadapan dengan confirmation bias (bias konfirmasi)—atau mungkin, Anda sendiri yang sedang terjebak di dalamnya.

### Cara Kerja Bias Konfirmasi
Ketika kita memiliki prasangka bahwa "kelompok X tidak bisa dipercaya", algoritma media sosial akan mencatat klik kita pada berita yang menjelekkan kelompok X. Lambat laun, seluruh linimasa kita hanya berisi konten yang mengonfirmasi kecurigaan tersebut.

### Langkah Membongkar Kacamata Kuda:
- Carilah argumen terbaik dari pihak lawan (steelmanning), bukan versi terlemahnya.
- Beranilah bertanya: "Bukti apa yang kira-kira bisa membuat saya mengubah pandangan ini?"
- Sadari bahwa mengakui kesalahan bukanlah tanda kelemahan, melainkan bukti kecerdasan intelektual yang terus bertumbuh.',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
    'c0000000-0000-0000-0000-000000000005',
    'published',
    4,
    '2026-10-26T11:00:00Z'
  )
ON CONFLICT (id) DO NOTHING;

-- 3. STATISTIK & FAKTA (Prefix: b0000000-... : 'b' is valid hex)
INSERT INTO statistics (id, type, label, value, description, chart_data, source_name, source_url, year, sort_order, is_active) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'metric', 'Rata-rata Waktu Membaca Harian', '1 Jam 12 Menit', 'Durasi rata-rata yang dihabiskan masyarakat Indonesia per hari untuk membaca bahan bacaan (digital dan cetak).', null, 'Kajian Indeks Kegemaran Membaca Perpusnas', 'https://perpusnas.go.id', 2024, 1, true),
  ('b0000000-0000-0000-0000-000000000002', 'metric', 'Jumlah Bahan Bacaan Per Orang', '4-5 Buku/Tahun', 'Rata-rata buku yang dituntaskan oleh pembaca aktif di wilayah perkotaan Indonesia.', null, 'Survei Minat Baca Nasional', 'https://kemdikbud.go.id', 2024, 2, true),
  ('b0000000-0000-0000-0000-000000000003', 'metric', 'Perpustakaan Desa & Komunitas', '42.500+', 'Taman Bacaan Masyarakat (TBM) dan perpustakaan desa yang beroperasi di seluruh nusantara.', null, 'Forum Sudut Baca Indonesia', null, 2025, 3, true),
  ('b0000000-0000-0000-0000-000000000004', 'chart', 'Tren Peningkatan Indeks Kegemaran Membaca (IKM)', null, 'Pertumbuhan skor indeks kegemaran membaca tingkat nasional dari tahun ke tahun dalam skala 100.', '[{"name":"2020","nilai":55.7},{"name":"2021","nilai":59.5},{"name":"2022","nilai":63.9},{"name":"2023","nilai":66.7},{"name":"2024","nilai":71.2},{"name":"2025","nilai":75.8}]'::jsonb, 'Laporan Evaluasi Perpusnas RI', 'https://perpusnas.go.id', 2025, 4, true),
  ('b0000000-0000-0000-0000-000000000005', 'fact', 'Aksesibilitas Buku di Pelosok', null, 'Rasio buku fisik di Indonesia timur masih berkisar 1 buku untuk 9 orang, sementara standar UNESCO menyarankan minimal 3 buku baru per orang per tahun.', null, 'Laporan Ketimpangan Distribusi Buku Nasional', null, 2024, 5, true),
  ('b0000000-0000-0000-0000-000000000006', 'fact', 'Lonjakan Konsumsi Buku Digital', null, 'Lebih dari 68% generasi muda (usia 15-28 tahun) kini lebih banyak membaca artikel panjang dan novel grafis melalui smartphone daripada kertas cetak.', null, 'Asosiasi Penerbit Indonesia (IKAPI)', null, 2024, 6, true)
ON CONFLICT (id) DO NOTHING;

-- 4. TIPS PRAKTIS (Prefix: e0000000-... : 'e' is valid hex)
INSERT INTO tips (id, title, content, icon, sort_order, is_active) VALUES
  ('e0000000-0000-0000-0000-000000000001', 'Aturan 2 Menit untuk Membaca', 'Bila merasa malas, berjanjilah hanya membaca 2 menit atau 1 halaman saja. Sering kali setelah memulainya, Anda akan terus melanjutkan membaca tanpa beban.', 'Clock', 1, true),
  ('e0000000-0000-0000-0000-000000000002', 'Bawa Buku Ke Mana Pun Anda Pergi', 'Simpan buku saku di dalam tas atau pasang aplikasi bacaan di ponsel utama. Gantilah waktu melamun di antrean dengan membaca dua lembar.', 'BookOpen', 2, true),
  ('e0000000-0000-0000-0000-000000000003', 'Berhenti Membaca Buku yang Membosankan', 'Jangan merasa bersalah meninggalkan buku yang tidak membuat Anda tertarik setelah 50 halaman. Waktu Anda terlalu berharga untuk bacaan yang tidak bermakna bagi Anda.', 'ThumbsDown', 3, true),
  ('e0000000-0000-0000-0000-000000000004', 'Bahas Buku yang Baru Dibaca dengan Teman', 'Menceritakan kembali intisari buku kepada teman atau keluarga memperkuat pemahaman konsep hingga 85% lebih tahan lama di memori jangka panjang.', 'MessageCircle', 4, true)
ON CONFLICT (id) DO NOTHING;

-- 5. RESOURCE HUB (Prefix: f0000000-... : 'f' is valid hex)
INSERT INTO resources (id, title, slug, description, type, age_category, file_path, external_url, cover_url, publisher, download_count, status) VALUES
  ('f0000000-0000-0000-0000-000000000001', 'Panduan Memilih Buku Cerita untuk Balita', 'panduan-memilih-buku-cerita-untuk-balita', 'Ebook panduan praktis bagi orang tua berisi daftar 50 buku bergambar terbaik Indonesia, tahapan usia perkembangan bahasa, dan tips membacakan cerita yang menstimulasi rasa ingin tahu anak.', 'pdf', 'anak', '/docs/panduan-buku-balita.pdf', null, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop', 'Pusat Literasi Anak Indonesia', 1420, 'published'),
  ('f0000000-0000-0000-0000-000000000002', 'Perpustakaan Digital Nasional (iPusnas)', 'perpustakaan-digital-nasional-ipusnas', 'Aplikasi resmi Perpustakaan Nasional Republik Indonesia yang menyediakan akses peminjaman puluhan ribu judul ebook, majalah, dan koran digital legal secara gratis untuk seluruh warga Indonesia.', 'tool', 'semua', null, 'https://ipusnas.id', 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600&auto=format&fit=crop', 'Perpustakaan Nasional RI', 3890, 'published'),
  ('f0000000-0000-0000-0000-000000000003', 'Laskar Pelangi - Karya Andrea Hirata', 'laskar-pelangi-andrea-hirata', 'Kisah inspiratif sepuluh anak Belitong yang memperjuangkan hak belajar di tengah keterbatasan fasilitas sekolah. Sebuah bacaan wajib remaja yang membakar semangat menuntut ilmu dan kecintaan pada sastra.', 'book', 'remaja', null, 'https://perpustakaan.kemdikbud.go.id', 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop', 'Bentang Pustaka', 2150, 'published'),
  ('f0000000-0000-0000-0000-000000000004', 'Lembar Kerja Analisis Logika & Bias Kognitif', 'lembar-kerja-analisis-logika-dan-bias-kognitif', 'Template latihan berpikir kritis berformat PDF yang membantu Anda membedah artikel opini, klaim di media sosial, dan menemukan celah sesat pikir (logical fallacies) secara sistematis.', 'pdf', 'dewasa', '/docs/lembar-kerja-berpikir-kritis.pdf', null, 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop', 'Akademi Nalar Indonesia', 890, 'published'),
  ('f0000000-0000-0000-0000-000000000005', 'CekFakta.com - Mesin Pemeriksa Hoaks', 'cekfakta-pemeriksa-hoaks', 'Kolaborasi pemeriksa fakta independen AJI, Mafindo, dan puluhan media terkemuka di Indonesia untuk melacak kebenaran kabar viral, foto manipulasi, dan klaim politik.', 'tool', 'semua', null, 'https://cekfakta.com', 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=600&auto=format&fit=crop', 'Koalisi Cek Fakta', 1740, 'published'),
  ('f0000000-0000-0000-0000-000000000006', 'Kitab Menulis: Panduan Mengalirkan Ide Menjadi Esai', 'kitab-menulis-panduan-esai', 'Buku pegangan bagi mahasiswa dan pegiat komunitas dalam merangkai tulisan persuasif, menyusun struktur argumen piramida terbalik, dan mengedit naskah mandiri.', 'book', 'dewasa', null, 'https://gramedia.com', 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=600&auto=format&fit=crop', 'Pustaka Aksara', 620, 'published')
ON CONFLICT (id) DO NOTHING;

-- 6. TANTANGAN & JADWAL HARIAN (Prefix: d0000000-... : 'd' is valid hex)
INSERT INTO challenges (id, title, slug, description, duration_days, cover_url, participants_count, status) VALUES
  ('d0000000-0000-0000-0000-000000000001', '7 Hari Membaca 10 Halaman', '7-hari-membaca-10-halaman', 'Tantangan ramah pemula untuk mendobrak rasa malas. Luangkan waktu membaca 10 halaman setiap hari dan tulis satu kalimat yang paling berkesan bagi Anda.', 7, 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=600&auto=format&fit=crop', 842, 'published'),
  ('d0000000-0000-0000-0000-000000000002', '21 Hari Jurnal Refleksi Bacaan', '21-hari-jurnal-refleksi-bacaan', 'Tantangan tingkat menengah untuk membentuk kebiasaan neuroplastisitas baru. Baca minimal 15 menit dan tulis satu paragraf refleksi kritis setiap hari.', 21, 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop', 512, 'published'),
  ('d0000000-0000-0000-0000-000000000003', '30 Hari Satu Buku Selesai', '30-hari-satu-buku-selesai', 'Tuntaskan satu buku berbobot dalam sebulan penuh secara bertahap bersama komunitas pembaca dari seluruh pelosok nusantara.', 30, 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?q=80&w=600&auto=format&fit=crop', 380, 'published')
ON CONFLICT (id) DO NOTHING;

INSERT INTO challenge_days (challenge_id, day_number, task_title, task_description) VALUES
  ('d0000000-0000-0000-0000-000000000001', 1, 'Pilih 1 Buku dan Baca 10 Halaman Pertama', 'Pilih buku non-fiksi atau fiksi favorit Anda. Cari sudut tenang, pasang mode hening di ponsel, dan baca 10 halaman tanpa jeda.'),
  ('d0000000-0000-0000-0000-000000000001', 2, 'Catat Satu Kutipan Menarik', 'Saat membaca halaman 11-20, garis bawahi satu kutipan atau kalimat yang paling menyentuh hati Anda.'),
  ('d0000000-0000-0000-0000-000000000001', 3, 'Membaca di Pagi Hari', 'Selesaikan 10 halaman (halaman 21-30) tepat sebelum memulai aktivitas kerja atau belajar Anda.'),
  ('d0000000-0000-0000-0000-000000000001', 4, 'Jelajahi Sudut Baru di Rumah', 'Cobalah membaca 10 halaman berikutnya di teras, balkon, atau dekat jendela yang terang dengan sirkulasi udara segar.'),
  ('d0000000-0000-0000-0000-000000000001', 5, 'Bagikan Rekomendasi kepada Sahabat', 'Ceritakan topik menarik dari halaman 41-50 kepada salah satu kawan Anda lewat pesan singkat.'),
  ('d0000000-0000-0000-0000-000000000001', 6, 'Membaca Sambil Menikmati Teh Hangat', 'Jadikan membaca sebagai momen relaksasi pikiran Anda di sore hari.'),
  ('d0000000-0000-0000-0000-000000000001', 7, 'Tulis Refleksi Keseluruhan 7 Hari', 'Selamat! Anda telah membaca 70 halaman. Tuliskan apa perubahan fokus pikiran yang Anda rasakan selama sepekan ini.')
ON CONFLICT (challenge_id, day_number) DO NOTHING;

-- 7. HALAMAN STATIS
INSERT INTO static_pages (slug, title, content) VALUES
  ('tentang', 'Tentang Kami - Rumah Literasi', 'Rumah Literasi lahir dari kegelisahan sederhana seputar banjir informasi dan dangkalnya nalar kritis di ruang publik Indonesia.'),
  ('visi-misi', 'Visi & Misi Organisasi', 'Terwujudnya masyarakat Indonesia yang cerdas bernalar, berwawasan luas, serta gemar membaca dan berkarya secara kritis.')
ON CONFLICT (slug) DO NOTHING;

-- Selesai!
