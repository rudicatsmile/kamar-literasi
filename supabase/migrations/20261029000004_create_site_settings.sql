-- ==============================================================================
-- MIGRATION: Tabel site_settings untuk Pengaturan Global (Termasuk Footer)
-- Tanggal: 2026-10-29
-- ==============================================================================

-- 1. TABEL PENGATURAN SITUS (site_settings)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index pada kolom key untuk lookup secepat kilat
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON public.site_settings (key);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Policy RLS: Publik dapat membaca (SELECT) seluruh pengaturan publik
DROP POLICY IF EXISTS "Site settings dapat dibaca publik" ON public.site_settings;
CREATE POLICY "Site settings dapat dibaca publik"
ON public.site_settings
FOR SELECT
USING (true);

-- Policy RLS: Administrator memiliki hak akses penuh (CRUD)
DROP POLICY IF EXISTS "Admin dapat mengelola site settings" ON public.site_settings;
CREATE POLICY "Admin dapat mengelola site settings"
ON public.site_settings
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- 2. SEED DATA AWAL: KONTEN FOOTER "RUMAH LITERASI"
INSERT INTO public.site_settings (key, value, description)
VALUES
(
    'footer_title',
    'Rumah Literasi',
    'Nama dan judul brand di bagian kiri footer situs'
),
(
    'footer_description',
    'Membangun budaya membaca, menulis, dan berpikir kritis di Indonesia. Menyediakan kurasi bahan bacaan berkualitas, panduan belajar gratis, dan tantangan kebiasaan membaca harian.',
    'Deskripsi misi dan peran organisasi di footer situs'
),
(
    'footer_tagline',
    'Inisiatif independen nirlaba untuk kemajuan nalar bangsa.',
    'Catatan / tagline independen nirlaba di bawah deskripsi footer'
)
ON CONFLICT (key) DO UPDATE
SET
    value = EXCLUDED.value,
    description = EXCLUDED.description,
    updated_at = now();
