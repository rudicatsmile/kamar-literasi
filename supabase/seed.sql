-- ==========================================================
-- Rumah Literasi - INITIAL SEED DATA (VALID HEX UUIDs)
-- ==========================================================

-- 1. KATEGORI (c0000000-...)
insert into categories (id, name, slug, description) values
  ('c0000000-0000-0000-0000-000000000001', 'Literasi Membaca', 'literasi-membaca', 'Teknik membaca mendalam, membangun kebiasaan membaca rutin, dan memilih bahan bacaan berkualitas.'),
  ('c0000000-0000-0000-0000-000000000002', 'Literasi Digital', 'literasi-digital', 'Kecakapan menyaring informasi, keamanan berselancar di dunia maya, dan etika komunikasi digital.'),
  ('c0000000-0000-0000-0000-000000000003', 'Literasi Anak', 'literasi-anak', 'Panduan untuk orang tua dan guru dalam menanamkan kecintaan buku sejak usia dini.'),
  ('c0000000-0000-0000-0000-000000000004', 'Literasi Menulis', 'literasi-menulis', 'Menyusun gagasan, jurnal harian reflektif, esai argumentatif, hingga penulisan kreatif.'),
  ('c0000000-0000-0000-0000-000000000005', 'Berpikir Kritis', 'berpikir-kritis', 'Menghindari bias kognitif, menganalisis klaim logis, dan mengenali manipulasi opini publik.'),
  ('c0000000-0000-0000-0000-000000000006', 'Literasi Informasi', 'literasi-informasi', 'Verifikasi sumber berita, penelusuran data primer, dan menangkal misinformasi di media massa.')
on conflict (id) do nothing;

-- 2. STATISTIK & FAKTA (b0000000-...)
insert into statistics (id, type, label, value, description, chart_data, source_name, source_url, year, sort_order, is_active) values
  ('b0000000-0000-0000-0000-000000000001', 'metric', 'Rata-rata Waktu Membaca Harian', '1 Jam 12 Menit', 'Durasi rata-rata yang dihabiskan masyarakat Indonesia per hari untuk membaca bahan bacaan (digital dan cetak).', null, 'Kajian Indeks Kegemaran Membaca Perpusnas', 'https://perpusnas.go.id', 2024, 1, true),
  ('b0000000-0000-0000-0000-000000000002', 'metric', 'Jumlah Bahan Bacaan Per Orang', '4-5 Buku/Tahun', 'Rata-rata buku yang dituntaskan oleh pembaca aktif di wilayah perkotaan Indonesia.', null, 'Survei Minat Baca Nasional', 'https://kemdikbud.go.id', 2024, 2, true),
  ('b0000000-0000-0000-0000-000000000003', 'metric', 'Perpustakaan Desa & Komunitas', '42.500+', 'Taman Bacaan Masyarakat (TBM) dan perpustakaan desa yang beroperasi di seluruh nusantara.', null, 'Forum Sudut Baca Indonesia', null, 2025, 3, true),
  ('b0000000-0000-0000-0000-000000000004', 'chart', 'Tren Peningkatan Indeks Kegemaran Membaca (IKM)', null, 'Pertumbuhan skor indeks kegemaran membaca tingkat nasional dari tahun ke tahun dalam skala 100.', '[{"name":"2020","nilai":55.7},{"name":"2021","nilai":59.5},{"name":"2022","nilai":63.9},{"name":"2023","nilai":66.7},{"name":"2024","nilai":71.2},{"name":"2025","nilai":75.8}]'::jsonb, 'Laporan Evaluasi Perpusnas RI', 'https://perpusnas.go.id', 2025, 4, true),
  ('b0000000-0000-0000-0000-000000000005', 'fact', 'Aksesibilitas Buku di Pelosok', null, 'Rasio buku fisik di Indonesia timur masih berkisar 1 buku untuk 9 orang, sementara standar UNESCO menyarankan minimal 3 buku baru per orang per tahun.', null, 'Laporan Ketimpangan Distribusi Buku Nasional', null, 2024, 5, true),
  ('b0000000-0000-0000-0000-000000000006', 'fact', 'Lonjakan Konsumsi Buku Digital', null, 'Lebih dari 68% generasi muda (usia 15-28 tahun) kini lebih banyak membaca artikel panjang dan novel grafis melalui smartphone daripada kertas cetak.', null, 'Asosiasi Penerbit Indonesia (IKAPI)', null, 2024, 6, true)
on conflict (id) do nothing;

-- 3. TIPS PRAKTIS (e0000000-...)
insert into tips (id, title, content, icon, sort_order, is_active) values
  ('e0000000-0000-0000-0000-000000000001', 'Aturan 2 Menit untuk Membaca', 'Bila merasa malas, berjanjilah hanya membaca 2 menit atau 1 halaman saja. Sering kali setelah memulainya, Anda akan terus melanjutkan membaca tanpa beban.', 'Clock', 1, true),
  ('e0000000-0000-0000-0000-000000000002', 'Bawa Buku Ke Mana Pun Anda Pergi', 'Simpan buku saku di dalam tas atau pasang aplikasi bacaan di ponsel utama. Gantilah waktu melamun di antrean dengan membaca dua lembar.', 'BookOpen', 2, true),
  ('e0000000-0000-0000-0000-000000000003', 'Berhenti Membaca Buku yang Membosankan', 'Jangan merasa bersalah meninggalkan buku yang tidak membuat Anda tertarik setelah 50 halaman. Waktu Anda terlalu berharga untuk bacaan yang tidak bermakna bagi Anda.', 'ThumbsDown', 3, true),
  ('e0000000-0000-0000-0000-000000000004', 'Bahas Buku yang Baru Dibaca dengan Teman', 'Menceritakan kembali intisari buku kepada teman atau keluarga memperkuat pemahaman konsep hingga 85% lebih tahan lama di memori jangka panjang.', 'MessageCircle', 4, true)
on conflict (id) do nothing;

-- 4. RESOURCE HUB (f0000000-...)
insert into resources (id, title, slug, description, type, age_category, file_path, external_url, cover_url, publisher, download_count, status) values
  ('f0000000-0000-0000-0000-000000000001', 'Panduan Memilih Buku Cerita untuk Balita', 'panduan-memilih-buku-cerita-untuk-balita', 'Ebook panduan praktis bagi orang tua berisi daftar 50 buku bergambar terbaik Indonesia, tahapan usia perkembangan bahasa, dan tips membacakan cerita yang menstimulasi rasa ingin tahu anak.', 'pdf', 'anak', '/docs/panduan-buku-balita.pdf', null, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop', 'Pusat Literasi Anak Indonesia', 1420, 'published'),
  ('f0000000-0000-0000-0000-000000000002', 'Perpustakaan Digital Nasional (iPusnas)', 'perpustakaan-digital-nasional-ipusnas', 'Aplikasi resmi Perpustakaan Nasional Republik Indonesia yang menyediakan akses peminjaman puluhan ribu judul ebook, majalah, dan koran digital legal secara gratis untuk seluruh warga Indonesia.', 'tool', 'semua', null, 'https://ipusnas.id', 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600&auto=format&fit=crop', 'Perpustakaan Nasional RI', 3890, 'published'),
  ('f0000000-0000-0000-0000-000000000003', 'Laskar Pelangi - Karya Andrea Hirata', 'laskar-pelangi-andrea-hirata', 'Kisah inspiratif sepuluh anak Belitong yang memperjuangkan hak belajar di tengah keterbatasan fasilitas sekolah. Sebuah bacaan wajib remaja yang membakar semangat menuntut ilmu dan kecintaan pada sastra.', 'book', 'remaja', null, 'https://perpustakaan.kemdikbud.go.id', 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop', 'Bentang Pustaka', 2150, 'published'),
  ('f0000000-0000-0000-0000-000000000004', 'Lembar Kerja Analisis Logika & Bias Kognitif', 'lembar-kerja-analisis-logika-dan-bias-kognitif', 'Template latihan berpikir kritis berformat PDF yang membantu Anda membedah artikel opini, klaim di media sosial, dan menemukan celah sesat pikir (logical fallacies) secara sistematis.', 'pdf', 'dewasa', '/docs/lembar-kerja-berpikir-kritis.pdf', null, 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop', 'Akademi Nalar Indonesia', 890, 'published'),
  ('f0000000-0000-0000-0000-000000000005', 'CekFakta.com - Mesin Pemeriksa Hoaks', 'cekfakta-pemeriksa-hoaks', 'Kolaborasi pemeriksa fakta independen AJI, Mafindo, dan puluhan media terkemuka di Indonesia untuk melacak kebenaran kabar viral, foto manipulasi, dan klaim politik.', 'tool', 'semua', null, 'https://cekfakta.com', 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=600&auto=format&fit=crop', 'Koalisi Cek Fakta', 1740, 'published'),
  ('f0000000-0000-0000-0000-000000000006', 'Kitab Menulis: Panduan Mengalirkan Ide Menjadi Esai', 'kitab-menulis-panduan-esai', 'Buku pegangan bagi mahasiswa dan pegiat komunitas dalam merangkai tulisan persuasif, menyusun struktur argumen piramida terbalik, dan mengedit naskah mandiri.', 'book', 'dewasa', null, 'https://gramedia.com', 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=600&auto=format&fit=crop', 'Pustaka Aksara', 620, 'published')
on conflict (id) do nothing;

-- 5. TANTANGAN & JADWAL HARIAN (d0000000-...)
insert into challenges (id, title, slug, description, duration_days, cover_url, participants_count, status) values
  ('d0000000-0000-0000-0000-000000000001', '7 Hari Membaca 10 Halaman', '7-hari-membaca-10-halaman', 'Tantangan ramah pemula untuk mendobrak rasa malas. Luangkan waktu membaca 10 halaman setiap hari dan tulis satu kalimat yang paling berkesan bagi Anda.', 7, 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=600&auto=format&fit=crop', 842, 'published'),
  ('d0000000-0000-0000-0000-000000000002', '21 Hari Jurnal Refleksi Bacaan', '21-hari-jurnal-refleksi-bacaan', 'Tantangan tingkat menengah untuk membentuk kebiasaan neuroplastisitas baru. Baca minimal 15 menit dan tulis satu paragraf refleksi kritis setiap hari.', 21, 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop', 512, 'published'),
  ('d0000000-0000-0000-0000-000000000003', '30 Hari Satu Buku Selesai', '30-hari-satu-buku-selesai', 'Tuntaskan satu buku berbobot dalam sebulan penuh secara bertahap bersama komunitas pembaca dari seluruh pelosok nusantara.', 30, 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?q=80&w=600&auto=format&fit=crop', 380, 'published')
on conflict (id) do nothing;

-- Silabus 7 Hari
insert into challenge_days (challenge_id, day_number, task_title, task_description) values
  ('d0000000-0000-0000-0000-000000000001', 1, 'Pilih 1 Buku dan Baca 10 Halaman Pertama', 'Pilih buku non-fiksi atau fiksi favorit Anda. Cari sudut tenang, pasang mode hening di ponsel, dan baca 10 halaman tanpa jeda.'),
  ('d0000000-0000-0000-0000-000000000001', 2, 'Catat Satu Kutipan Menarik', 'Saat membaca halaman 11-20, garis bawahi satu kutipan atau kalimat yang paling menyentuh hati Anda.'),
  ('d0000000-0000-0000-0000-000000000001', 3, 'Membaca di Pagi Hari', 'Selesaikan 10 halaman (halaman 21-30) tepat sebelum memulai aktivitas kerja atau belajar Anda.'),
  ('d0000000-0000-0000-0000-000000000001', 4, 'Jelajahi Sudut Baru di Rumah', 'Cobalah membaca 10 halaman berikutnya di teras, balkon, atau dekat jendela yang terang dengan sirkulasi udara segar.'),
  ('d0000000-0000-0000-0000-000000000001', 5, 'Bagikan Rekomendasi kepada Sahabat', 'Ceritakan topik menarik dari halaman 41-50 kepada salah satu kawan Anda lewat pesan singkat.'),
  ('d0000000-0000-0000-0000-000000000001', 6, 'Membaca Sambil Menikmati Teh Hangat', 'Jadikan membaca sebagai momen relaksasi pikiran Anda di sore hari.'),
  ('d0000000-0000-0000-0000-000000000001', 7, 'Tulis Refleksi Keseluruhan 7 Hari', 'Selamat! Anda telah membaca 70 halaman. Tuliskan apa perubahan fokus pikiran yang Anda rasakan selama sepekan ini.')
on conflict (challenge_id, day_number) do nothing;

-- 6. HALAMAN STATIS
insert into static_pages (slug, title, content) values
  ('tentang', 'Tentang Kami - Rumah Literasi', 'Rumah Literasi lahir dari kegelisahan sederhana seputar banjir informasi dan dangkalnya nalar kritis di ruang publik Indonesia.'),
  ('visi-misi', 'Visi & Misi Organisasi', 'Terwujudnya masyarakat Indonesia yang cerdas bernalar, berwawasan luas, serta gemar membaca dan berkarya secara kritis.')
on conflict (slug) do nothing;
