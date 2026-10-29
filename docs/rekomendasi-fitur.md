# Cetak Biru Rekomendasi Fitur Unggulan Rumah Literasi
**Dokumen Spesifikasi Fitur, Strategi Pertumbuhan & Roadmap Pengembangan**

- **Target Platform**: [Rumah Literasi](https://www.rumahliterasi.web.id)
- **Fondasi Teknologi**: Next.js 16 (App Router) • Tailwind CSS • Supabase (PostgreSQL, Storage, Auth, RLS) • Turbopack
- **Dokumen Dibuat**: 29 Oktober 2026
- **Status**: *Roadmap Backlog / Ready for Phased Execution*

---

## Daftar Isi
1. [Visi & Latar Belakang Pengembangan](#1-visi--latar-belakang-pengembangan)
2. [Fitur Powerfull untuk User (Pembaca & Member)](#2-fitur-powerfull-untuk-user-pembaca--member)
   - [2.1 Sertifikat Kelulusan Tantangan & Social Sharing Card](#21-sertifikat-kelulusan-tantangan--social-sharing-card)
   - [2.2 Mode Membaca Fokus (Zen Mode) & Kustomisasi Tipografi](#22-mode-membaca-fokus-zen-mode--kustomisasi-tipografi)
   - [2.3 Pemutar Audio Esai (Text-to-Speech Audio Reader)](#23-pemutar-audio-esai-text-to-speech-audio-reader)
   - [2.4 Ruang Refleksi Pembaca (Contextual Reader Reflections)](#24-ruang-refleksi-pembaca-contextual-reader-reflections)
   - [2.5 Lemari Baca Pribadi (Reading List, Bookmark & Habit Tracker)](#25-lemari-baca-pribadi-reading-list-bookmark--habit-tracker)
3. [Fitur Powerfull untuk Administrator & Tim Redaksi](#3-fitur-powerfull-untuk-administrator--tim-redaksi)
   - [3.1 AI Editorial Assistant (Integrasi Google Gemini)](#31-ai-editorial-assistant-integrasi-google-gemini)
   - [3.2 WhatsApp Two-Way Interactive Automation](#32-whatsapp-two-way-interactive-automation)
   - [3.3 Pipeline Pengajuan Naskah Penulis Tamu (Guest Contributor Workflow)](#33-pipeline-pengajuan-naskah-penulis-tamu-guest-contributor-workflow)
   - [3.4 Analitik Perilaku Membaca Mendalam (Reading Drop-off Analytics)](#34-analitik-perilaku-membaca-mendalam-reading-drop-off-analytics)
   - [3.5 Modul Cadangan & Ekspor Sekali Klik (Disaster Recovery Engine)](#35-modul-cadangan--ekspor-sekali-klik-disaster-recovery-engine)
4. [Matriks Prioritas: Dampak vs Kompleksitas](#4-matriks-prioritas-dampak-vs-kompleksitas)
5. [Skema Database Pendukung](#5-skema-database-pendukung)

---

## 1. Visi & Latar Belakang Pengembangan

Rumah Literasi dirancang bukan sekadar sebagai media publikasi statis, melainkan **gerakan intelektual dan pembiasaan nalar kritis** bagi masyarakat Indonesia. Untuk meningkatkan keterlibatan (*user engagement*), retensi pembaca, dan efisiensi operasional redaksi, diperlukan inovasi fitur yang:
1. **Mengurangi Hambatan Membaca**: Menjawab alasan klasik keterbatasan waktu melalui format audio dan antarmuka ramah mata.
2. **Mendorong Pertumbuhan Alami (*Organic Growth*)**: Menghadirkan penghargaan digital bernilai sosial (*shareable credential*) yang memicu efek viral di WhatsApp dan media sosial.
3. **Memperluas Partisipasi Komunitas**: Memfasilitasi kontributor luar untuk menulis dengan kurasi ketat tim redaksi.
4. **Memberdayakan Redaksi Melalui Otomatisasi & AI**: Mempercepat alur penyuntingan dan manajemen audiens tanpa kehilangan sentuhan humanis.

---

## 2. Fitur Powerfull untuk User (Pembaca & Member)

### 2.1 Sertifikat Kelulusan Tantangan & Social Sharing Card
* **Kebutuhan**: Member yang berhasil menyelesaikan tantangan membaca (misal: Tantangan 7 Hari atau 30 Hari Membaca) membutuhkan pengakuan psikologis atas konsistensi mereka.
* **Mekanisme Fitur**:
  - Saat hari terakhir tantangan di-*check-in*, tombol *"Klaim Sertifikat Pencapaian"* otomatis aktif di dashboard.
  - Sistem men-generate **Sertifikat Digital PDF** berkualitas cetak dengan nomor seri unik, stempel resmi Rumah Literasi, dan nama member.
  - Sistem membuat gambar kartu vertikal (rasio 9:16) beresolusi tinggi menggunakan `@vercel/og` untuk diunggah ke Instagram Story atau WhatsApp Status dengan tombol satu klik: *"Bagikan ke Status WhatsApp"*.
* **Manfaat**:
  - Membangun kebanggaan pribadi member (*dopamine reward* positif).
  - Menjadi mesin akuisisi pengguna baru (*growth viral loop*) tanpa biaya iklan sama sekali.

---

### 2.2 Mode Membaca Fokus (*Zen Mode*) & Kustomisasi Tipografi
* **Kebutuhan**: Artikel berbobot 1.000–2.000 kata membutuhkan kenyamanan visual ekstra agar mata pembaca tidak lelah.
* **Mekanisme Fitur**:
  - Tombol floating di halaman artikel: `Aa` (Pengaturan Tipografi) dan `Zen Mode` (Mode Hening).
  - **Pilihan Tema Warna Latar**:
    - *Paper Warm* (#FBF9F5) — Nuansa buku kertas klasik bernuansa hangat.
    - *Pure Light* (#FFFFFF) — Putih bersih modern.
    - *Dark OLED* (#0F172A) — Mode malam dengan kontras lembut untuk membaca sebelum tidur.
  - **Pilihan Jenis Font**: Serif Klasik (Literata / Merriweather) vs Sans-serif Modern (Inter / Plus Jakarta Sans).
  - **Skala Ukuran Teks**: Slider pengatur ukuran teks dari 14px hingga 22px serta jarak baris (*line-height*).
  - Dalam *Zen Mode*, navbar atas, footer, dan seluruh elemen navigasi disembunyikan sementara hingga kursor digerakkan ke tepi atas.

---

### 2.3 Pemutar Audio Esai (*Text-to-Speech Audio Reader*)
* **Kebutuhan**: Banyak masyarakat urban ingin menikmati esai Rumah Literasi saat berkendara, berada di transportasi umum, atau sebelum beristirahat.
* **Mekanisme Fitur**:
  - Di bawah judul artikel, terdapat bilah pemutar audio minimalis: Tombol Play/Pause, Durasi, Pengatur Kecepatan (1x, 1.25x, 1.5x, 2x), dan Penanda Progres.
  - Implementasi tahap 1 menggunakan **Web Speech API** bawaan peramban (ringan, instan, tanpa biaya API tambahan).
  - Implementasi tahap 2 (opsional) menggunakan sintesis audio resolusi tinggi berbasis AI (Edge TTS / ElevenLabs / Gemini Audio) yang di-cache di Supabase Storage.
* **Manfaat**: Membuka segmen audiens baru yang lebih dominan menyerap informasi melalui pendengaran (*auditory learners*).

---

### 2.4 Ruang Refleksi Pembaca (*Contextual Reader Reflections*)
* **Kebutuhan**: Kolom komentar konvensional di internet sering kali dipenuhi perdebatan kusir, ujaran emosional, atau spam link.
* **Mekanisme Fitur**:
  - Alih-alih kotak komentar bebas, sistem menyematkan **3 Pertanyaan Reflektif Pilihan Kurator** di akhir artikel, contoh:
    1. *"Perspektif baru apa yang Anda dapatkan dari esai ini?"*
    2. *"Bagaimana Anda akan menerapkan gagasan ini dalam kehidupan sehari-hari?"*
  - Pembaca menulis tanggapan terstruktur (minimal 40 kata untuk mendorong nalar yang matang).
  - Tombol apresiasi berupa lencana intelektual: *"Bernalar Logis"* (💡), *"Memantik Empati"* (🤝), *"Gagasan Segar"* (🌱).
  - Filter otomatis kata kasar (*moderation layer*) sebelum komentar tayang publik.

---

### 2.5 Lemari Baca Pribadi (*Reading List, Bookmark & Habit Tracker*)
* **Kebutuhan**: Member membutuhkan tempat terpusat untuk menyimpan esai yang belum sempat dibaca dan melihat rekam jejak literasi mereka.
* **Mekanisme Fitur**:
  - Ikon bookmark di setiap kartu dan detail artikel untuk memasukkannya ke *"Baca Nanti"*.
  - Riwayat artikel yang telah selesai dibaca (*Reading History*).
  - Statistik personal di Dashboard Member:
    - *Total Waktu Membaca*: misal *"3,5 jam bulan ini"*.
    - *Total Kata Diserap*: misal *"52.000 kata"*.
    - *Streak Membaca*: jumlah hari berturut-turut membaca artikel atau menyelesaikan tantangan.

---

## 3. Fitur Powerfull untuk Administrator & Tim Redaksi

### 3.1 AI Editorial Assistant (Integrasi Google Gemini)
* **Kebutuhan**: Kurator redaksi membutuhkan kecepatan dalam memoles naskah, menyusun ringkasan, dan menyiapkan materi promosi.
* **Mekanisme Fitur (Tombol Cerdas di Halaman Form Artikel)**:
  - **⚡ Buat Excerpt Otomatis**: Sekali klik, AI menganalisis naskah lengkap dan menghasilkan ringkasan pembuka 2 kalimat yang menggugah rasa ingin tahu.
  - **🔍 Evaluasi Tingkat Keterbacaan**: AI menganalisis skor keterbacaan (*Readability Score*) bahasa Indonesia, menandai kalimat pasif berlebihan atau paragraf yang terlalu padat, lalu memberikan alternatif kalimat yang lebih membumi.
  - **🎯 Generator SEO & Open Graph**: Otomatis menghasilkan meta title, meta description 155 karakter, dan 5 rekomendasi tagar relevan.
  - **💬 Format Pesan WhatsApp Blast**: Mengubah inti esai menjadi format pesan WhatsApp yang ramah, dilengkapi format tebal (*bold*), bullet points, dan ajakan membaca (*Call to Action*).

---

### 3.2 WhatsApp Two-Way Interactive Automation
* **Kebutuhan**: Meningkatkan responsivitas anggota tanpa memaksa mereka selalu membuka antarmuka website.
* **Mekanisme Fitur**:
  - **Check-in Tantangan via Balas Pesan**: Pengingat harian dikirim via WhatsApp Gateway. Member cukup membalas angka `"1"` atau kata `"SELESAI"`, webhook Supabase otomatis memverifikasi dan menandai progres hari tersebut selesai.
  - **Bot Pencarian Bahan Bacaan**: Jika nomor gateway menerima pesan seperti *"buku kritis"* atau *"tips fokus"*, bot otomatis membalas dengan 3 rekomendasi artikel atau resource gratis yang relevan.
  - **Broadcast Segmentasi**: Redaksi dapat mengirim buletin WhatsApp yang disaring berdasarkan preferensi kategori pembaca (misal: hanya anggota yang tertarik dengan *Literasi Anak*).

---

### 3.3 Pipeline Pengajuan Naskah Penulis Tamu (*Guest Contributor Workflow*)
* **Kebutuhan**: Menampung kiriman tulisan dari para guru, akademisi, dan pegiat literasi daerah agar Rumah Literasi menjadi lumbung pemikiran inklusif.
* **Mekanisme Fitur**:
  - Member memiliki menu *"Kirim Naskah Esai"* di dashboard mereka.
  - Form pengiriman naskah mencakup: Judul, Kategori yang Dituju, Naskah Lengkap, Sumber Pustaka Primer, dan Bio Singkat Penulis.
  - **Papan Kanban Redaksi di Panel Admin**:
    $$\text{Naskah Baru} \xrightarrow{} \text{Dalam Kurasi} \xrightarrow{} \text{Permintaan Revisi} \xrightarrow{} \text{Disetujui} \xrightarrow{} \text{Terbit}$$
  - Catatan revisi internal dapat dikirimkan langsung ke dashboard penulis tamu dan email/WhatsApp mereka.
  - Saat naskah terbit, nama dan foto profil penulis tamu otomatis terpasang sebagai penulis resmi di rute `/artikel/[slug]`.

---

### 3.4 Analitik Perilaku Membaca Mendalam (*Reading Drop-off Analytics*)
* **Kebutuhan**: Mengetahui apakah artikel benar-benar dibaca sampai tuntas atau hanya diklik lalu ditinggalkan.
* **Mekanisme Fitur**:
  - Beacon event ringan yang mencatat milestone kedalaman gulir (*scroll depth*: 25%, 50%, 75%, 100%).
  - Metrik di Panel Admin:
    - **Completion Rate (%)**: Persentase pembaca yang berhasil mencapai paragraf kesimpulan.
    - **Waktu Baca Aktual vs Estimasi**: Membandingkan apakah artikel 5 menit benar-benar dibaca selama ~5 menit.
    - **Poin Titik Putus (*Drop-off Point*)**: Mengetahui di subjudul atau paragraf mana pembaca paling sering keluar, sehingga redaksi dapat memperbaiki ritme penulisan berikutnya.

---

### 3.5 Modul Cadangan & Ekspor Sekali Klik (*Disaster Recovery Engine*)
* **Kebutuhan**: Keamanan data jangka panjang dan kedaulatan arsip intelektual organisasi.
* **Mekanisme Fitur**:
  - Di halaman admin terdapat tombol *"Unduh Cadangan Lengkap (.zip)"*.
  - File ZIP yang dihasilkan berisi:
    1. Seluruh artikel dalam format file Markdown (`.md`) dengan frontmatter metadata lengkap.
    2. Data tabular (kategori, pengguna, kontak, nilai, FAQ, pengaturan situs) dalam format `.json` dan `.csv`.
  - Opsi sinkronisasi otomatis mingguan ke Google Drive atau penyimpanan cloud cadangan.

---

## 4. Matriks Prioritas: Dampak vs Kompleksitas

| Inisiatif Fitur | Dampak Bisnis / Komunitas | Kompleksitas Teknis | Rekomendasi Fase |
| :--- | :---: | :---: | :---: |
| **Mode Baca Zen & Kustomisasi Tipografi** | Tinggi (User Experience) | Ringan (1-2 jam) | **Fase 1 (Quick Win)** |
| **AI Editorial Assistant di Admin** | Tinggi (Produktivitas Redaksi) | Ringan - Sedang (2-3 jam) | **Fase 1 (Quick Win)** |
| **Sertifikat Kelulusan & Shareable Card** | Sangat Tinggi (Viral Growth) | Sedang (3-4 jam) | **Fase 2 (Prioritas Tinggi)** |
| **Ruang Refleksi Pembaca (Komentar Edukatif)** | Sedang - Tinggi (Keterikatan) | Sedang (3-4 jam) | **Fase 2 (Prioritas Tinggi)** |
| **Lemari Baca & Habit Tracker Personal** | Tinggi (Retensi Pengguna) | Sedang (3-5 jam) | **Fase 2 (Prioritas Tinggi)** |
| **Pemutar Audio Esai (Text-to-Speech)** | Sedang (Inklusivitas Akses) | Ringan (Web Speech API) | **Fase 2 (Prioritas Tinggi)** |
| **Pipeline Penulis Tamu (Guest Submission)** | Sangat Tinggi (Pasokan Konten) | Sedang - Menengah | **Fase 3 (Skalabilitas)** |
| **Two-Way WhatsApp Webhook Check-in** | Tinggi (Kenyamanan Member) | Menengah (Integrasi Webhook) | **Fase 3 (Skalabilitas)** |
| **Reading Drop-off Heatmap Analytics** | Sedang (Optimasi Editorial) | Menengah | **Fase 3 (Skalabilitas)** |
| **One-Click Backup & Export Engine** | Sangat Penting (Keamanan Data) | Ringan - Sedang | **Fase 3 (Skalabilitas)** |

---

## 5. Skema Database Pendukung (Draf SQL untuk Eksekusi Nanti)

Saat fitur-fitur di atas siap dieksekusi, berikut adalah draf skema tabel baru yang dapat langsung dipasang:

```sql
-- 1. Tabel Lemari Baca & Bookmark Pengguna
CREATE TABLE IF NOT EXISTS public.user_reading_list (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'saved', -- 'saved', 'reading', 'completed'
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, article_id)
);

-- 2. Tabel Sertifikat Digital Kelulusan Tantangan
CREATE TABLE IF NOT EXISTS public.challenge_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_code TEXT UNIQUE NOT NULL, -- Contoh: RL-2026-CH7-00123
    participation_id UUID NOT NULL REFERENCES public.challenge_participations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    challenge_title TEXT NOT NULL,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    pdf_url TEXT,
    og_image_url TEXT
);

-- 3. Tabel Refleksi Pembaca (Diskusi Kontekstual Berbobot)
CREATE TABLE IF NOT EXISTS public.article_reflections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    intellectual_badge TEXT, -- 'logical', 'empathy', 'fresh_insight'
    is_moderated BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Tabel Naskah Penulis Tamu (Guest Submission Pipeline)
CREATE TABLE IF NOT EXISTS public.guest_article_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    primary_sources TEXT,
    author_bio TEXT,
    status TEXT NOT NULL DEFAULT 'submitted', -- 'submitted', 'in_review', 'revision_needed', 'approved', 'rejected'
    editorial_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

*Dokumen ini tersimpan secara aman di repositori proyek (`docs/rekomendasi-fitur.md`) dan dapat dijadikan acuan kapan saja saat tim memutuskan untuk mengeksekusi fase pengembangan berikutnya.*

