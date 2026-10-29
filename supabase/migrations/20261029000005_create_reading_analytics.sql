-- ==============================================================================
-- MIGRATION: Tabel article_reading_sessions untuk Reading Drop-off Analytics
-- Tanggal: 2026-10-29
-- Berdasarkan Dokumen Rekomendasi Fitur 3.4
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.article_reading_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    scroll_depth SMALLINT NOT NULL DEFAULT 0, -- Nilai milestone: 0, 25, 50, 75, 100
    reading_duration_seconds INTEGER NOT NULL DEFAULT 0, -- Waktu aktif membaca dalam detik
    is_completed BOOLEAN NOT NULL DEFAULT FALSE, -- Apakah mencapai kesimpulan (100% scroll & durasi memadai)
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT uq_article_session UNIQUE (article_id, session_id)
);

-- Indexing untuk query analitik cepat
CREATE INDEX IF NOT EXISTS idx_reading_sessions_article_id ON public.article_reading_sessions (article_id);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_created_at ON public.article_reading_sessions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_scroll_depth ON public.article_reading_sessions (scroll_depth);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_is_completed ON public.article_reading_sessions (is_completed);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE public.article_reading_sessions ENABLE ROW LEVEL SECURITY;

-- Policy RLS: Publik dapat merekam sesi membaca baru
DROP POLICY IF EXISTS "Publik dapat merekam sesi membaca" ON public.article_reading_sessions;
CREATE POLICY "Publik dapat merekam sesi membaca"
ON public.article_reading_sessions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy RLS: Publik dapat memperbarui progres sesi membacanya sendiri
DROP POLICY IF EXISTS "Publik dapat memperbarui sesi membacanya" ON public.article_reading_sessions;
CREATE POLICY "Publik dapat memperbarui sesi membacanya"
ON public.article_reading_sessions
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Policy RLS: Hanya Administrator yang dapat melihat dan mengekspor seluruh rekaman analitik
DROP POLICY IF EXISTS "Admin dapat melihat data sesi membaca" ON public.article_reading_sessions;
CREATE POLICY "Admin dapat melihat data sesi membaca"
ON public.article_reading_sessions
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Policy RLS: Admin dapat menghapus data rekaman jika diperlukan
DROP POLICY IF EXISTS "Admin dapat menghapus sesi membaca" ON public.article_reading_sessions;
CREATE POLICY "Admin dapat menghapus sesi membaca"
ON public.article_reading_sessions
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);
