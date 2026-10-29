# Dokumentasi Kredensial Aplikasi — Rumah Literasi

Dokumen ini memuat seluruh akun pengguna resmi, kunci otorisasi database Supabase, dan parameter integrasi layanan pihak ketiga yang aktif digunakan dalam sistem aplikasi **Rumah Literasi**.

---

## 1. Akun Autentikasi Pengguna (Email & Password)

Digunakan untuk masuk ke sistem melalui halaman: [`http://localhost:3000/login`](http://localhost:3000/login)

### 👑 Akun Administrator (Super Admin Redaksi)
- **Email**: `admin@rumahliterasi.web.id`
- **Kata Sandi**: `Password123!`
- **Role**: `admin`
- **Nama Profil**: Administrator Redaksi
- **User ID (Supabase)**: `8f536a9d-4fea-4cb8-81e1-bb8b1352afdb`
- **Akses Rute**: [`/admin`](http://localhost:3000/admin) dan seluruh sub-modul:
  - Ringkasan Metrik: `/admin`
  - Manajemen Pengguna & Hak Akses: `/admin/pengguna` (tambah/edit profil/reset kata sandi/hapus)
  - Manajemen Artikel & Publikasi: `/admin/artikel` (tambah/edit/hapus)
  - Kategori Artikel: `/admin/kategori`
  - Resource Hub & Modul PDF/Buku: `/admin/resource`
  - Data Statistik & Riset Nasional: `/admin/statistik`
  - Kurikulum & Silabus Tantangan: `/admin/tantangan`
  - Edukasi Tips Praktis: `/admin/tips`
  - Konten Halaman Statis (Tentang & Visi-Misi): `/admin/halaman`
  - Database Kontak Subscriber WhatsApp: `/admin/subscriber` (ekspor CSV)
  - Broadcast Pesan Massal: `/admin/broadcast`
  - Kotak Masuk Formulir Kontak: `/admin/pesan`

---

### 👤 Akun Member / Anggota Komunitas (Demo)
- **Email**: `member@rumahliterasi.web.id`
- **Kata Sandi**: `Password123!`
- **Role**: `member`
- **Nama Profil**: Siti Rahmawati
- **User ID (Supabase)**: `ed537693-a951-47d8-8aa2-5acb5ab29b90`
- **Akses Rute**: [`/dashboard`](http://localhost:3000/dashboard)
  - Dasbor Utama Progres: `/dashboard`
  - Riwayat Tantangan Membaca: `/dashboard/tantangan`
  - Halaman Check-in & Jurnal Refleksi: `/dashboard/tantangan/[id]`
  - Materi & Resource Favorit: `/dashboard/favorit`
  - Pengaturan Akun & Kata Sandi: `/dashboard/profil`

---

## 2. Kredensial Basis Data Supabase

Tersambung langsung ke instance PostgreSQL dan Supabase Auth aktif:

| Parameter | Nilai Konfigurasi | Keterangan |
| :--- | :--- | :--- |
| **Project URL** | `https://wixksduiacaslpgnpzua.supabase.co` | Endpoint REST, Auth, & Storage |
| **Anon Public Key** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpeGtzZHVpYWNhc2xwZ25wenVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxNjk2OTUsImV4cCI6MjEwODc0NTY5NX0.dFDNz7a1xyogquDBbUtedaZeZP9UHTmSQdaR1o8fPeI` | Kunci akses publik untuk Client Component & SSR |
| **Service Role Key** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpeGtzZHVpYWNhc2xwZ25wenVhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzE2OTY5NSwiZXhwIjoyMTA4NzQ1Njk1fQ.C8pQaT1KQe-mYiM_hEt4XSN7BCJPns4_RPcTjSgWiFY` | Hak akses penuh server-side (bypass RLS) untuk admin |

---

## 3. Integrasi WhatsApp Gateway (Fonnte)

Konfigurasi untuk pengiriman verifikasi *Double Opt-In*, pengingat harian, dan *broadcast newsletter*:

- **Provider**: `fonnte`
- **API URL**: `https://api.fonnte.com/send`
- **API Token**: `dummy-token-abc` *(ganti dengan token akun Fonnte aktif Anda)*
- **Jeda Antrean (Rate Limiting)**: `3` detik per pesan

---

## 4. Keamanan Cron Job (Daily Reminder & Scheduler)

Endpoint untuk menjalankan cron otomatis pemeriksaan streak dan pengingat:
- **Endpoint**: [`/api/cron/challenge-reminder`](http://localhost:3000/api/cron/challenge-reminder)
- **Metode**: `GET`
- **Header Otorisasi**: `Authorization: Bearer super-secret-cron-key-12345`
- **Cron Secret**: `super-secret-cron-key-12345`

---

## 5. Ringkasan File Konfigurasi Lokal

Berkas lokal [`.env.local`](file:///d:/project/web/energies/kamar-literasi/.env.local) memiliki struktur berikut:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://wixksduiacaslpgnpzua.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpeGtzZHVpYWNhc2xwZ25wenVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxNjk2OTUsImV4cCI6MjEwODc0NTY5NX0.dFDNz7a1xyogquDBbUtedaZeZP9UHTmSQdaR1o8fPeI
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpeGtzZHVpYWNhc2xwZ25wenVhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzE2OTY5NSwiZXhwIjoyMTA4NzQ1Njk1fQ.C8pQaT1KQe-mYiM_hEt4XSN7BCJPns4_RPcTjSgWiFY

# WhatsApp Gateway
WHATSAPP_GATEWAY_PROVIDER=fonnte
WHATSAPP_API_URL=https://api.fonnte.com/send
WHATSAPP_API_TOKEN=dummy-token-abc
WHATSAPP_SEND_DELAY_SECONDS=3

# Cron
CRON_SECRET=super-secret-cron-key-12345

# Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=rumahliterasi.web.id
```

---

> [!CAUTION]
> Jangan membagikan token `SUPABASE_SERVICE_ROLE_KEY` atau kata sandi admin ke repositori publik untuk menjaga keamanan penuh basis data.
