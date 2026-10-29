-- ==============================================================================
-- MIGRATION: Storage Policy dan Dukungan Avatar Pengguna
-- Tanggal: 2026-10-29
-- ==============================================================================

-- 1. Memastikan kolom avatar_url tersedia di tabel profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. Memastikan konfigurasi bucket 'avatars' publik di Supabase Storage
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars',
    'avatars',
    true,
    2097152, -- Maksimal 2 MB (2 * 1024 * 1024 bytes)
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
SET
    public = true,
    file_size_limit = 2097152,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- 3. Kebijakan RLS Storage untuk Bucket 'avatars'

-- A. Akses Publik: Membaca foto avatar
DROP POLICY IF EXISTS "Public read avatars" ON storage.objects;
CREATE POLICY "Public read avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- B. Administrator: Memiliki hak penuh (Upload, Update, Delete) seluruh foto di bucket avatars
DROP POLICY IF EXISTS "Admin manage avatars" ON storage.objects;
CREATE POLICY "Admin manage avatars"
ON storage.objects FOR ALL
TO authenticated
USING (
    bucket_id = 'avatars' AND
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
)
WITH CHECK (
    bucket_id = 'avatars' AND
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

-- C. Pengguna Terautentikasi: Dapat mengunggah foto miliknya sendiri
DROP POLICY IF EXISTS "Users upload their own avatar" ON storage.objects;
CREATE POLICY "Users upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'avatars' AND
    (
        auth.uid() IS NOT NULL OR
        (storage.foldername(name))[1] = auth.uid()::text
    )
);
