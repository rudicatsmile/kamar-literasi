-- ==============================================================================
-- MIGRATION: Tabel contact_info dan faqs untuk Halaman /kontak
-- Tanggal: 2026-10-29
-- ==============================================================================

-- 1. TABEL INFORMASI KONTAK RESMI (contact_info)
CREATE TABLE IF NOT EXISTS public.contact_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    icon TEXT DEFAULT 'Mail',
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index untuk performa pengurutan
CREATE INDEX IF NOT EXISTS idx_contact_info_sort_order ON public.contact_info (sort_order ASC);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

-- Policy RLS: Publik dapat membaca data kontak yang aktif
DROP POLICY IF EXISTS "Public read active contact_info" ON public.contact_info;
CREATE POLICY "Public read active contact_info"
ON public.contact_info
FOR SELECT
USING (is_active = true);

-- Policy RLS: Administrator memiliki hak akses penuh (CRUD)
DROP POLICY IF EXISTS "Admin manage contact_info" ON public.contact_info;
CREATE POLICY "Admin manage contact_info"
ON public.contact_info
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

-- ==============================================================================
-- 2. TABEL PERTANYAAN UMUM / FAQ (faqs)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index urutan FAQ
CREATE INDEX IF NOT EXISTS idx_faqs_sort_order ON public.faqs (sort_order ASC);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Policy RLS: Publik dapat membaca FAQ yang aktif
DROP POLICY IF EXISTS "Public read active faqs" ON public.faqs;
CREATE POLICY "Public read active faqs"
ON public.faqs
FOR SELECT
USING (is_active = true);

-- Policy RLS: Administrator memiliki hak akses penuh (CRUD)
DROP POLICY IF EXISTS "Admin manage faqs" ON public.faqs;
CREATE POLICY "Admin manage faqs"
ON public.faqs
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

-- ==============================================================================
-- 3. SEED DATA AWAL (INFORMASI KONTAK & FAQ RESMI)
-- ==============================================================================
INSERT INTO public.contact_info (key, label, value, icon, sort_order, is_active)
VALUES
(
    'email',
    'Surel Resmi',
    'rudi.catsmile@gmail.com',
    'Mail',
    1,
    true
),
(
    'whatsapp',
    'WhatsApp Gateway Info',
    '+62 813-6715-5656 (Hanya pesan)',
    'MessageSquare',
    2,
    true
),
(
    'address',
    'Sekretariat Gerakan',
    'Jl. Kurnia No.16 RT 007/17 Tugu Utara - Koja Jakarta Utara',
    'MapPin',
    3,
    true
),
(
    'response_time',
    'Waktu Respon',
    'Senin - Jumat: 09.00 - 17.00 WIB',
    'Clock',
    4,
    true
)
ON CONFLICT (key) DO UPDATE
SET
    label = EXCLUDED.label,
    value = EXCLUDED.value,
    icon = EXCLUDED.icon,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active,
    updated_at = now();

INSERT INTO public.faqs (question, answer, sort_order, is_active)
VALUES
(
    'Apakah seluruh materi di website ini gratis?',
    'Ya, 100% materi dan tantangan di Rumah Literasi bebas diakses tanpa pungutan biaya.',
    1,
    true
),
(
    'Bagaimana cara mengirim tulisan saya?',
    'Kirimkan naskah esai berbobot (600-1.200 kata) ke surel redaksi kami dengan subjek "Pengajuan Esai Tamu".',
    2,
    true
)
ON CONFLICT DO NOTHING;
