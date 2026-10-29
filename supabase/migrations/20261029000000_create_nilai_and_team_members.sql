-- ==============================================================================
-- 1. TABEL NILAI-NILAI ORGANISASI (nilai)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.nilai (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index urutan
CREATE INDEX IF NOT EXISTS idx_nilai_sort_order ON public.nilai (sort_order ASC);

-- Enable RLS
ALTER TABLE public.nilai ENABLE ROW LEVEL SECURITY;

-- Policy RLS: Publik dapat membaca data yang aktif
CREATE POLICY "Public read active values"
ON public.nilai
FOR SELECT
USING (is_active = true);

-- Policy RLS: Administrator memiliki hak akses penuh (CRUD)
CREATE POLICY "Admin manage values"
ON public.nilai
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- ==============================================================================
-- 2. TABEL TIM PENGGERAK & REDAKSI (team_members)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    photo_url TEXT,
    bio TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index urutan
CREATE INDEX IF NOT EXISTS idx_team_members_sort_order ON public.team_members (sort_order ASC);

-- Enable RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Policy RLS: Publik dapat membaca tim yang aktif
CREATE POLICY "Public read active team members"
ON public.team_members
FOR SELECT
USING (is_active = true);

-- Policy RLS: Administrator memiliki hak akses penuh (CRUD)
CREATE POLICY "Admin manage team members"
ON public.team_members
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- ==============================================================================
-- 3. SEED DATA AWAL (NILAI & TIM REDAKSI)
-- ==============================================================================
INSERT INTO public.nilai (title, description, sort_order, is_active)
VALUES
(
    'Integritas & Fakta',
    'Setiap data dan rujukan artikel diteliti dari sumber ilmiah dan primer yang dapat dipertanggungjawabkan.',
    1,
    true
),
(
    'Keterbukaan & Inklusivitas',
    'Materi belajar dapat diakses gratis oleh siapa saja, dari Sabang sampai Merauke, tanpa memandang latar belakang.',
    2,
    true
),
(
    'Kemandirian Bernalar',
    'Kami tidak mendikte apa yang harus Anda pikirkan, melainkan melatih Anda bagaimana cara berpikir logis dan kritis.',
    3,
    true
)
ON CONFLICT DO NOTHING;

INSERT INTO public.team_members (name, position, photo_url, bio, sort_order, is_active)
VALUES
(
    'Dewi Lestari',
    'Direktur Konten & Kurator Bacaan',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    'Penulis dan pemerhati kurikulum literasi anak dengan pengalaman lebih dari 12 tahun.',
    1,
    true
),
(
    'Budi Santoso',
    'Kepala Litbang & Literasi Digital',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    'Pakar literasi digital dan pengembang modul verifikasi informasi bagi komunitas guru.',
    2,
    true
),
(
    'Siti Rahmawati',
    'Koordinator Program Edukasi & Anak',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
    'Fasilitator pendampingan membaca anak usia dini dan inisiator pojok baca keluarga.',
    3,
    true
),
(
    'Andi Pratama',
    'Fasilitator Komunitas & Penulisan',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    'Editor dan mentor kepenulisan kreatif yang telah mendampingi ribuan penulis pemula.',
    4,
    true
)
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- 4. STORAGE POLICY (Bucket team-photos)
-- ==============================================================================
CREATE POLICY "Public read team photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'team-photos');

CREATE POLICY "Admin upload team photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'team-photos'
    AND EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

CREATE POLICY "Admin delete team photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'team-photos'
    AND EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);
