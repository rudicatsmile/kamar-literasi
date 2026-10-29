export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_url: string;
  category_id: string;
  category_name?: string;
  category_slug?: string;
  author_id?: string;
  author_name: string;
  author_role: string;
  author_avatar: string;
  status: "draft" | "published";
  reading_time: number;
  published_at: string;
  created_at: string;
}

export interface Resource {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: "book" | "tool" | "pdf";
  age_category: "anak" | "remaja" | "dewasa" | "semua";
  external_url?: string;
  file_path?: string;
  cover_url: string;
  download_count: number;
  status: "draft" | "published";
  publisher: string;
  rating?: number;
  created_at?: string;
}

export interface StatisticItem {
  id: string;
  type: "metric" | "fact" | "chart";
  label: string;
  value?: string;
  description?: string;
  chart_data?: { name: string; nilai: number }[];
  source_name: string;
  source_url?: string;
  year: number;
  sort_order: number;
  is_active: boolean;
}

export interface Tip {
  id: string;
  title: string;
  content: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
}

export interface ChallengeDay {
  id: string;
  challenge_id: string;
  day_number: number;
  task_title: string;
  task_description: string;
}

export interface Challenge {
  id: string;
  title: string;
  slug: string;
  description: string;
  duration_days: 7 | 21 | 30;
  cover_url: string;
  status: "draft" | "published";
  participants_count: number;
  days: ChallengeDay[];
}

export interface UserChallengeProgress {
  id: string;
  challenge_id: string;
  challenge_title: string;
  duration_days: number;
  status: "active" | "completed" | "abandoned";
  current_streak: number;
  completed_days: number[];
  checkins: {
    day_number: number;
    date: string;
    reflection: string;
  }[];
  started_at: string;
}

export interface Subscriber {
  id: string;
  whatsapp: string;
  name?: string;
  email?: string;
  status: "pending" | "active" | "unsubscribed";
  created_at: string;
  confirmed_at?: string;
}

export interface Broadcast {
  id: string;
  title: string;
  message: string;
  created_by_name: string;
  sent_at?: string;
  total_recipients: number;
  status: "draft" | "sent";
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

/* ==========================================================
   DUMMY DATA STORAGE & INITIAL STATE
   ========================================================== */

export const dummyCategories: Category[] = [
  {
    id: "cat-1",
    name: "Literasi Membaca",
    slug: "literasi-membaca",
    description: "Teknik membaca mendalam, membangun kebiasaan membaca rutin, dan memilih bahan bacaan berkualitas.",
  },
  {
    id: "cat-2",
    name: "Literasi Digital",
    slug: "literasi-digital",
    description: "Kecakapan menyaring informasi, keamanan berselancar di dunia maya, dan etika komunikasi digital.",
  },
  {
    id: "cat-3",
    name: "Literasi Anak",
    slug: "literasi-anak",
    description: "Panduan untuk orang tua dan guru dalam menanamkan kecintaan buku sejak usia dini.",
  },
  {
    id: "cat-4",
    name: "Literasi Menulis",
    slug: "literasi-menulis",
    description: "Menyusun gagasan, jurnal harian reflektif, esai argumentatif, hingga penulisan kreatif.",
  },
  {
    id: "cat-5",
    name: "Berpikir Kritis",
    slug: "berpikir-kritis",
    description: "Menghindari bias kognitif, menganalisis klaim logis, dan mengenali manipulasi opini publik.",
  },
  {
    id: "cat-6",
    name: "Literasi Informasi",
    slug: "literasi-informasi",
    description: "Verifikasi sumber berita, penelusuran data primer, dan menangkal misinformasi di media massa.",
  },
];

export const dummyArticles: Article[] = [
  {
    id: "art-1",
    title: "Mengapa 15 Menit Membaca Setiap Hari Mengubah Cara Berpikir Anda",
    slug: "mengapa-15-menit-membaca-setiap-hari-mengubah-cara-berpikir",
    excerpt:
      "Banyak orang merasa tak punya waktu membaca buku. Padahal, konsistensi seperempat jam sehari mampu mengakumulasi puluhan buku setahun dan merevolusi neuroplastisitas otak.",
    content: `
Membaca bukan sekadar aktivitas mengisi waktu luang; ia adalah latihan kebugaran bagi pikiran. Ketika Anda membaca teks panjang tanpa terganggu notifikasi ponsel, otak Anda melatih sirkuit konsentrasi mendalam (deep reading circuit) yang semakin langka di era linimasa instan.

### Kekuatan Efek Majemuk 15 Menit
Jika Anda membaca dengan kecepatan rata-rata 250 kata per menit, dalam 15 menit Anda dapat menyelesaikan sekitar 3.750 kata. Sebuah buku nonfiksi standar biasanya berisi 60.000 kata. Artinya, hanya dengan 15 menit setiap pagi sebelum membuka media sosial, Anda dapat menyelesaikan satu buku utuh dalam 16 hari, atau sekitar 20 hingga 25 buku berkualitas dalam setahun.

### Melatih Empati dan Perspektif Baru
Penelitian ilmu kognitif menunjukkan bahwa membaca narasi memperluas pemahaman kita terhadap sudut pandang manusia lain. Kita diajak memasuki pergulatan batin tokoh, memahami konteks sosial yang rumit, dan melatih kesabaran dalam mencerna gagasan yang tidak kita setujui.

> *"Buku adalah mesin waktu dan portal empati paling murah yang pernah diciptakan peradaban manusia."*

### Langkah Memulai Kebiasaan Ini:
1. **Tentukan Waktu Tetap**: Pilih waktu tenang, misalnya tepat setelah menyeduh kopi pagi atau 20 menit sebelum tidur malam.
2. **Jauhkan Ponsel**: Letakkan gawai di ruangan berbeda agar tidak tergoda memeriksa notifikasi pesan instan.
3. **Pilih Bahan Bacaan yang Anda Sukai**: Jangan merasa bersalah bila buku klasik terasa berat. Mulailah dari topik yang benar-benar memantik rasa penasaran Anda.
4. **Catat 1 Kalimat Intisari**: Setelah 15 menit selesai, tuliskan satu kalimat refleksi di buku catatan atau aplikasi jurnal Anda.
    `,
    cover_url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200&auto=format&fit=crop",
    category_id: "cat-1",
    category_name: "Literasi Membaca",
    category_slug: "literasi-membaca",
    author_name: "Dewi Lestari",
    author_role: "Kurator Bacaan & Penulis",
    author_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    status: "published",
    reading_time: 4,
    published_at: "2026-10-15T08:00:00Z",
    created_at: "2026-10-14T10:00:00Z",
  },
  {
    id: "art-2",
    title: "Mengenali Hoaks: 5 Langkah Cepat Sebelum Membagikan Berita",
    slug: "mengenali-hoaks-5-langkah-cepat-sebelum-membagikan-berita",
    excerpt:
      "Di grup percakapan keluarga dan media sosial, arus informasi mengalir deras tanpa saringan. Terapkan lima prinsip verifikasi mandiri ini agar tidak menjadi perantara kebohongan.",
    content: `
Kecemasan, kemarahan, dan rasa terkejut adalah pemicu utama seseorang terdorong segera membagikan pesan (forward message). Pembuat hoaks memahami psikologi ini dengan sangat baik.

### 1. Waspadai Judul yang Provokatif
Judul yang memakai huruf kapital berlebihan, tanda seru ganda, atau klaim sensasional ("Wajib Sebarkan!", "Kabar Mengejutkan!") patut dicurigai sejak awal.

### 2. Cek Siapa Sumber Aslinya
Apakah artikel berasal dari media kredibel yang memiliki penanggung jawab redaksi jelas dan terdaftar di Dewan Pers? Jika sumbernya hanya blog gratisan atau pesan berantai tanpa nama, jangan teruskan pesan tersebut.

### 3. Periksa Tanggal dan Konteks Waktu
Sering kali video bencana alam atau peristiwa politik bertahun-tahun silam diunggah kembali seolah-olah baru saja terjadi kemarin sore untuk memantik kegaduhan.

### 4. Lakukan Pencarian Gambar Terbalik (Reverse Image Search)
Gunakan Google Lens atau TinEye untuk memverifikasi foto viral. Seringkali foto yang diklaim sebagai korban kerusuhan ternyata adalah foto kejadian di negara lain atau potongan film dokumenter.

### 5. Tunda 60 Detik Sebelum Klik 'Bagi'
Waktu jeda 60 detik memberi kesempatan bagi korteks prefrontal Anda untuk mengambil alih kendali emosi dari amigdala. Tanyakan pada diri sendiri: "Apakah informasi ini bermanfaat, akurat, dan dapat dipertanggungjawabkan?"
    `,
    cover_url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop",
    category_id: "cat-2",
    category_name: "Literasi Digital",
    category_slug: "literasi-digital",
    author_name: "Budi Santoso",
    author_role: "Spesialis Keamanan Siber",
    author_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    status: "published",
    reading_time: 5,
    published_at: "2026-10-18T10:30:00Z",
    created_at: "2026-10-17T12:00:00Z",
  },
  {
    id: "art-3",
    title: "Cara Membacakan Dongeng agar Anak Ketagihan Buku",
    slug: "cara-membacakan-dongeng-agar-anak-ketagihan-buku",
    excerpt:
      "Bukan sekadar membaca kata per kata, intonasi, kontak mata, dan dialog interaktif mampu mengubah buku cerita menjadi petualangan magis yang paling dirindukan anak sebelum tidur.",
    content: `
Kunci utama agar anak mencintai buku bukanlah dengan memaksa mereka belajar mengeja terlalu dini, melainkan dengan mengasosiasikan buku dengan rasa aman, kehangatan keluarga, dan keseruan bermain.

### Mengubah Membaca Menjadi Dialog Interaktif
Ketika membacakan buku untuk balita atau usia sekolah dasar awal, gunakan teknik *dialogic reading*:
- Berikan pertanyaan terbuka: "Kira-kira apa yang akan dilakukan si Kancil setelah melihat sungai yang deras ini?"
- Hubungkan cerita dengan dunia nyata anak: "Kucing belang di buku ini mirip dengan kucing tetangga kita ya?"
- Biarkan anak membalik halaman dan memegang buku sendiri.

### Kekuatan Rutinitas Sebelum Tidur
Membaca buku 15 menit menjelang tidur membantu menenangkan saraf anak setelah seharian aktif. Jadikan waktu ini bebas dari layar televisi maupun ponsel pintar.
    `,
    cover_url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1200&auto=format&fit=crop",
    category_id: "cat-3",
    category_name: "Literasi Anak",
    category_slug: "literasi-anak",
    author_name: "Siti Rahmawati",
    author_role: "Pendidik PAUD & Pegiat Literasi",
    author_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    status: "published",
    reading_time: 4,
    published_at: "2026-10-21T09:15:00Z",
    created_at: "2026-10-20T11:00:00Z",
  },
  {
    id: "art-4",
    title: "Menulis Jurnal Harian: Terapi Pikiran dan Penjernih Gagasan",
    slug: "menulis-jurnal-harian-terapi-pikiran-dan-penjernih-gagasan",
    excerpt:
      "Menulis bukan hanya hak milik novelis atau wartawan. Siapa pun yang meluangkan waktu menumpahkan pikiran ke atas kertas akan menemukan kejernihan batin dan ketajaman berpikir.",
    content: `
Otak manusia dirancang untuk melahirkan gagasan, bukan menyimpannya tanpa batas. Ketika pikiran Anda terasa penuh, cemas, atau kacau, menulis jurnal (journaling) berfungsi layaknya pelepasan beban memori kerja.

### Tiga Gaya Menulis Jurnal yang Praktis
1. **Morning Pages (Halaman Pagi)**: Tuliskan tiga halaman apa pun yang melintas di benak Anda sesaat setelah bangun tidur tanpa menyunting tata bahasa.
2. **Jurnal Syukur (Gratitude Journal)**: Sebutkan 3 hal spesifik yang Anda syukuri setiap petang.
3. **Catatan Refleksi Keputusan**: Tuliskan mengapa Anda mengambil keputusan penting hari ini dan ekspektasi Anda terhadap hasilnya.
    `,
    cover_url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop",
    category_id: "cat-4",
    category_name: "Literasi Menulis",
    category_slug: "literasi-menulis",
    author_name: "Andi Pratama",
    author_role: "Penulis & Fasilitator Menulis",
    author_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    status: "published",
    reading_time: 3,
    published_at: "2026-10-24T14:00:00Z",
    created_at: "2026-10-23T15:00:00Z",
  },
  {
    id: "art-5",
    title: "Mengenal 'Confirmation Bias': Jebakan Mental yang Membutakan Fakta",
    slug: "mengenal-confirmation-bias-jebakan-mental-yang-membutakan-fakta",
    excerpt:
      "Kita cenderung hanya mencari, memercayai, dan mengingat bukti yang mendukung keyakinan awal kita. Inilah fondasi bagaimana polarisasi sosial dan fanatisme mengakar.",
    content: `
Pernahkah Anda berdebat dengan seseorang di media sosial dan menyadari bahwa sebanyak apa pun bukti ilmiah yang Anda sajikan, mereka tetap tidak bergeming? Anda mungkin sedang berhadapan dengan *confirmation bias* (bias konfirmasi)—atau mungkin, Anda sendiri yang sedang terjebak di dalamnya.

### Cara Kerja Bias Konfirmasi
Ketika kita memiliki prasangka bahwa "kelompok X tidak bisa dipercaya", algoritma media sosial akan mencatat klik kita pada berita yang menjelekkan kelompok X. Lambat laun, seluruh linimasa kita hanya berisi konten yang mengonfirmasi kecurigaan tersebut.

### Langkah Membongkar Kacamata Kuda:
- Carilah argumen terbaik dari pihak lawan (*steelmanning*), bukan versi terlemahnya.
- Beranilah bertanya: "Bukti apa yang kira-kira bisa membuat saya mengubah pandangan ini?"
- Sadari bahwa mengakui kesalahan bukanlah tanda kelemahan, melainkan bukti kecerdasan intelektual yang terus bertumbuh.
    `,
    cover_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    category_id: "cat-5",
    category_name: "Berpikir Kritis",
    category_slug: "berpikir-kritis",
    author_name: "Dewi Lestari",
    author_role: "Kurator Bacaan & Penulis",
    author_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    status: "published",
    reading_time: 4,
    published_at: "2026-10-26T11:00:00Z",
    created_at: "2026-10-25T09:00:00Z",
  },
];

export const dummyResources: Resource[] = [
  {
    id: "res-1",
    title: "Panduan Memilih Buku Cerita untuk Balita",
    slug: "panduan-memilih-buku-cerita-untuk-balita",
    description:
      "Ebook panduan praktis bagi orang tua berisi daftar 50 buku bergambar terbaik Indonesia, tahapan usia perkembangan bahasa, dan tips membacakan cerita yang menstimulasi rasa ingin tahu anak.",
    type: "pdf",
    age_category: "anak",
    file_path: "/docs/panduan-buku-balita.pdf",
    cover_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop",
    download_count: 1420,
    status: "published",
    publisher: "Pusat Literasi Anak Indonesia",
    rating: 4.9,
  },
  {
    id: "res-2",
    title: "Perpustakaan Digital Nasional (iPusnas)",
    slug: "perpustakaan-digital-nasional-ipusnas",
    description:
      "Aplikasi resmi Perpustakaan Nasional Republik Indonesia yang menyediakan akses peminjaman puluhan ribu judul ebook, majalah, dan koran digital legal secara gratis untuk seluruh warga Indonesia.",
    type: "tool",
    age_category: "semua",
    external_url: "https://ipusnas.id",
    cover_url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600&auto=format&fit=crop",
    download_count: 3890,
    status: "published",
    publisher: "Perpustakaan Nasional RI",
    rating: 4.8,
  },
  {
    id: "res-3",
    title: "Laskar Pelangi - Karya Andrea Hirata",
    slug: "laskar-pelangi-andrea-hirata",
    description:
      "Kisah inspiratif sepuluh anak Belitong yang memperjuangkan hak belajar di tengah keterbatasan fasilitas sekolah. Sebuah bacaan wajib remaja yang membakar semangat menuntut ilmu dan kecintaan pada sastra.",
    type: "book",
    age_category: "remaja",
    external_url: "https://perpustakaan.kemdikbud.go.id",
    cover_url: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop",
    download_count: 2150,
    status: "published",
    publisher: "Bentang Pustaka",
    rating: 4.95,
  },
  {
    id: "res-4",
    title: "Lembar Kerja Analisis Logika & Bias Kognitif",
    slug: "lembar-kerja-analisis-logika-dan-bias-kognitif",
    description:
      "Template latihan berpikir kritis berformat PDF yang membantu Anda membedah artikel opini, klaim di media sosial, dan menemukan celah sesat pikir (logical fallacies) secara sistematis.",
    type: "pdf",
    age_category: "dewasa",
    file_path: "/docs/lembar-kerja-berpikir-kritis.pdf",
    cover_url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop",
    download_count: 890,
    status: "published",
    publisher: "Akademi Nalar Indonesia",
    rating: 4.7,
  },
  {
    id: "res-5",
    title: "CekFakta.com - Mesin Pemeriksa Hoaks",
    slug: "cekfakta-pemeriksa-hoaks",
    description:
      "Kolaborasi pemeriksa fakta independen AJI, Mafindo, dan puluhan media terkemuka di Indonesia untuk melacak kebenaran kabar viral, foto manipulasi, dan klaim politik.",
    type: "tool",
    age_category: "semua",
    external_url: "https://cekfakta.com",
    cover_url: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=600&auto=format&fit=crop",
    download_count: 1740,
    status: "published",
    publisher: "Koalisi Cek Fakta",
    rating: 4.85,
  },
  {
    id: "res-6",
    title: "Kitab Menulis: Panduan Mengalirkan Ide Menjadi Esai",
    slug: "kitab-menulis-panduan-esai",
    description:
      "Buku pegangan bagi mahasiswa dan pegiat komunitas dalam merangkai tulisan persuasif, menyusun struktur argumen piramida terbalik, dan mengedit naskah mandiri.",
    type: "book",
    age_category: "dewasa",
    external_url: "https://gramedia.com",
    cover_url: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=600&auto=format&fit=crop",
    download_count: 620,
    status: "published",
    publisher: "Pustaka Aksara",
    rating: 4.6,
  },
];

export const dummyStatistics: StatisticItem[] = [
  {
    id: "stat-1",
    type: "metric",
    label: "Rata-rata Waktu Membaca Harian",
    value: "1 Jam 12 Menit",
    description:
      "Durasi rata-rata yang dihabiskan masyarakat Indonesia per hari untuk membaca bahan bacaan (digital dan cetak).",
    source_name: "Kajian Indeks Kegemaran Membaca Perpusnas",
    source_url: "https://perpusnas.go.id",
    year: 2024,
    sort_order: 1,
    is_active: true,
  },
  {
    id: "stat-2",
    type: "metric",
    label: "Jumlah Bahan Bacaan Per Orang",
    value: "4-5 Buku/Tahun",
    description:
      "Rata-rata buku yang dituntaskan oleh pembaca aktif di wilayah perkotaan Indonesia.",
    source_name: "Survei Minat Baca Nasional",
    source_url: "https://kemdikbud.go.id",
    year: 2024,
    sort_order: 2,
    is_active: true,
  },
  {
    id: "stat-3",
    type: "metric",
    label: "Perpustakaan Desa & Komunitas",
    value: "42.500+",
    description:
      "Taman Bacaan Masyarakat (TBM) dan perpustakaan desa yang beroperasi di seluruh nusantara.",
    source_name: "Forum Sudut Baca Indonesia",
    year: 2025,
    sort_order: 3,
    is_active: true,
  },
  {
    id: "stat-4",
    type: "chart",
    label: "Tren Peningkatan Indeks Kegemaran Membaca (IKM)",
    description:
      "Pertumbuhan skor indeks kegemaran membaca tingkat nasional dari tahun ke tahun dalam skala 100.",
    chart_data: [
      { name: "2020", nilai: 55.7 },
      { name: "2021", nilai: 59.5 },
      { name: "2022", nilai: 63.9 },
      { name: "2023", nilai: 66.7 },
      { name: "2024", nilai: 71.2 },
      { name: "2025", nilai: 75.8 },
    ],
    source_name: "Laporan Evaluasi Perpusnas RI",
    source_url: "https://perpusnas.go.id",
    year: 2025,
    sort_order: 4,
    is_active: true,
  },
  {
    id: "stat-5",
    type: "fact",
    label: "Aksesibilitas Buku di Pelosok",
    description:
      "Rasio buku fisik di Indonesia timur masih berkisar 1 buku untuk 9 orang, sementara standar UNESCO menyarankan minimal 3 buku baru per orang per tahun.",
    source_name: "Laporan Ketimpangan Distribusi Buku Nasional",
    year: 2024,
    sort_order: 5,
    is_active: true,
  },
  {
    id: "stat-6",
    type: "fact",
    label: "Lonjakan Konsumsi Buku Digital",
    description:
      "Lebih dari 68% generasi muda (usia 15-28 tahun) kini lebih banyak membaca artikel panjang dan novel grafis melalui smartphone daripada kertas cetak.",
    source_name: "Asosiasi Penerbit Indonesia (IKAPI)",
    year: 2024,
    sort_order: 6,
    is_active: true,
  },
];

export const dummyTips: Tip[] = [
  {
    id: "tip-1",
    title: "Aturan 2 Menit untuk Membaca",
    content: "Bila merasa malas, berjanjilah hanya membaca 2 menit atau 1 halaman saja. Sering kali setelah memulainya, Anda akan terus melanjutkan membaca tanpa beban.",
    icon: "Clock",
    sort_order: 1,
    is_active: true,
  },
  {
    id: "tip-2",
    title: "Bawa Buku Ke Mana Pun Anda Pergi",
    content: "Simpan buku saku di dalam tas atau pasang aplikasi bacaan di ponsel utama. Gantilah waktu melamun di antrean dengan membaca dua lembar.",
    icon: "BookOpen",
    sort_order: 2,
    is_active: true,
  },
  {
    id: "tip-3",
    title: "Berhenti Membaca Buku yang Membosankan",
    content: "Jangan merasa bersalah meninggalkan buku yang tidak membuat Anda tertarik setelah 50 halaman. Waktu Anda terlalu berharga untuk bacaan yang tidak bermakna bagi Anda.",
    icon: "ThumbsDown",
    sort_order: 3,
    is_active: true,
  },
  {
    id: "tip-4",
    title: "Bahas Buku yang Baru Dibaca dengan Teman",
    content: "Menceritakan kembali intisari buku kepada teman atau keluarga memperkuat pemahaman konsep hingga 85% lebih tahan lama di memori jangka panjang.",
    icon: "MessageCircle",
    sort_order: 4,
    is_active: true,
  },
];

export const dummyChallenges: Challenge[] = [
  {
    id: "ch-1",
    title: "7 Hari Membaca 10 Halaman",
    slug: "7-hari-membaca-10-halaman",
    description:
      "Tantangan ramah pemula untuk mendobrak rasa malas. Luangkan waktu membaca 10 halaman setiap hari dan tulis satu kalimat yang paling berkesan bagi Anda.",
    duration_days: 7,
    cover_url: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=600&auto=format&fit=crop",
    status: "published",
    participants_count: 842,
    days: [
      {
        id: "ch1-d1",
        challenge_id: "ch-1",
        day_number: 1,
        task_title: "Pilih 1 Buku dan Baca 10 Halaman Pertama",
        task_description: "Pilih buku non-fiksi atau fiksi favorit Anda. Cari sudut tenang, pasang mode hening di ponsel, dan baca 10 halaman tanpa jeda.",
      },
      {
        id: "ch1-d2",
        challenge_id: "ch-1",
        day_number: 2,
        task_title: "Catat Satu Kutipan Menarik",
        task_description: "Saat membaca halaman 11-20, garis bawahi satu kutipan atau kalimat yang paling menyentuh hati Anda.",
      },
      {
        id: "ch1-d3",
        challenge_id: "ch-1",
        day_number: 3,
        task_title: "Membaca di Pagi Hari",
        task_description: "Selesaikan 10 halaman (halaman 21-30) tepat sebelum memulai aktivitas kerja atau belajar Anda.",
      },
      {
        id: "ch1-d4",
        challenge_id: "ch-1",
        day_number: 4,
        task_title: "Jelajahi Sudut Baru di Rumah",
        task_description: "Cobalah membaca 10 halaman berikutnya di teras, balkon, atau dekat jendela yang terang dengan sirkulasi udara segar.",
      },
      {
        id: "ch1-d5",
        challenge_id: "ch-1",
        day_number: 5,
        task_title: "Bagikan Rekomendasi kepada Sahabat",
        task_description: "Ceritakan topik menarik dari halaman 41-50 kepada salah satu kawan Anda lewat pesan singkat.",
      },
      {
        id: "ch1-d6",
        challenge_id: "ch-1",
        day_number: 6,
        task_title: "Membaca Sambil Menikmati Teh Hangat",
        task_description: "Jadikan membaca sebagai momen relaksasi pikiran Anda di sore hari.",
      },
      {
        id: "ch1-d7",
        challenge_id: "ch-1",
        day_number: 7,
        task_title: "Tulis Refleksi Keseluruhan 7 Hari",
        task_description: "Selamat! Anda telah membaca 70 halaman. Tuliskan apa perubahan fokus pikiran yang Anda rasakan selama sepekan ini.",
      },
    ],
  },
  {
    id: "ch-2",
    title: "21 Hari Jurnal Refleksi Bacaan",
    slug: "21-hari-jurnal-refleksi-bacaan",
    description:
      "Tantangan tingkat menengah untuk membentuk kebiasaan neuroplastisitas baru. Baca minimal 15 menit dan tulis satu paragraf refleksi kritis setiap hari.",
    duration_days: 21,
    cover_url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop",
    status: "published",
    participants_count: 512,
    days: Array.from({ length: 21 }, (_, i) => ({
      id: `ch2-d${i + 1}`,
      challenge_id: "ch-2",
      day_number: i + 1,
      task_title: `Hari ke-${i + 1}: Baca 15 Menit & Refleksi Tematik`,
      task_description: `Fokus membaca dan dokumentasikan 3 gagasan utama yang Anda pelajari pada hari ke-${i + 1}.`,
    })),
  },
  {
    id: "ch-3",
    title: "30 Hari Satu Buku Selesai",
    slug: "30-hari-satu-buku-selesai",
    description:
      "Tuntaskan satu buku berbobot dalam sebulan penuh secara bertahap bersama komunitas pembaca dari seluruh pelosok nusantara.",
    duration_days: 30,
    cover_url: "https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?q=80&w=600&auto=format&fit=crop",
    status: "published",
    participants_count: 380,
    days: Array.from({ length: 30 }, (_, i) => ({
      id: `ch3-d${i + 1}`,
      challenge_id: "ch-3",
      day_number: i + 1,
      task_title: `Hari ke-${i + 1}: Progres Bab Harian`,
      task_description: `Tuntaskan alokasi halaman harian untuk bab aktif hari ke-${i + 1} dan catat kata kunci terpenting.`,
    })),
  },
];

export const dummyUserProgress: UserChallengeProgress = {
  id: "prog-1",
  challenge_id: "ch-1",
  challenge_title: "7 Hari Membaca 10 Halaman",
  duration_days: 7,
  status: "active",
  current_streak: 4,
  completed_days: [1, 2, 3, 4],
  checkins: [
    {
      day_number: 1,
      date: "2026-10-24",
      reflection: "Berhasil membaca 12 halaman buku Atomic Habits. Penjelasan tentang 1% perbaikan harian sangat masuk akal.",
    },
    {
      day_number: 2,
      date: "2026-10-25",
      reflection: "Kutipan favorit: 'You do not rise to the level of your goals. You fall to the level of your systems.'",
    },
    {
      day_number: 3,
      date: "2026-10-26",
      reflection: "Membaca jam 06.30 pagi sambil menikmati teh tawar. Pikiran jauh lebih segar dan tidak ngantuk.",
    },
    {
      day_number: 4,
      date: "2026-10-27",
      reflection: "Membaca di balkon luar. Berhasil menyelesaikan bab tentang cues dan triggers kebiasaan.",
    },
  ],
  started_at: "2026-10-24T00:00:00Z",
};

export const dummyUserProfile = {
  id: "usr-1",
  full_name: "Siti Rahmawati",
  email: "siti.rahmawati@contoh.id",
  whatsapp: "081234567890",
  avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
  role: "member" as const,
  reminder_enabled: true,
  streak: 4,
  books_read: 8,
  points: 420,
  favorite_resource_ids: ["res-1", "res-2"],
};

export const dummySubscribers: Subscriber[] = [
  {
    id: "a0000000-0000-0000-0000-000000000001",
    whatsapp: "6281234567890",
    name: "Siti Rahmawati",
    email: "siti@contoh.id",
    status: "active",
    created_at: "2026-10-01T10:00:00Z",
    confirmed_at: "2026-10-01T10:05:00Z",
  },
  {
    id: "a0000000-0000-0000-0000-000000000002",
    whatsapp: "6281398765432",
    name: "Budi Santoso",
    email: "budi.s@contoh.id",
    status: "active",
    created_at: "2026-10-03T14:20:00Z",
    confirmed_at: "2026-10-03T14:22:00Z",
  },
  {
    id: "a0000000-0000-0000-0000-000000000003",
    whatsapp: "6285712344321",
    name: "Dewi Lestari",
    status: "pending",
    created_at: "2026-10-26T08:10:00Z",
  },
  {
    id: "a0000000-0000-0000-0000-000000000004",
    whatsapp: "6287811223344",
    name: "Andi Pratama",
    email: "andi@contoh.id",
    status: "unsubscribed",
    created_at: "2026-09-15T09:00:00Z",
    confirmed_at: "2026-09-15T09:02:00Z",
  },
  {
    id: "a0000000-0000-0000-0000-000000000005",
    whatsapp: "6282199887766",
    name: "Nur Hidayah",
    status: "active",
    created_at: "2026-10-20T17:30:00Z",
    confirmed_at: "2026-10-20T17:35:00Z",
  },
];

export const dummyBroadcasts: Broadcast[] = [
  {
    id: "a1000000-0000-0000-0000-000000000001",
    title: "Buletin Literasi Edisi Oktober 2026",
    message: "Halo Sahabat Literasi! Edisi kali ini membahas 5 langkah jitu mengenali hoaks di linimasa keluarga dan pengumuman tantangan 7 hari membaca edisi November. Simak ulasan lengkapnya di website!",
    created_by_name: "Admin Rumah Literasi",
    sent_at: "2026-10-20T09:00:00Z",
    total_recipients: 1420,
    status: "sent",
    created_at: "2026-10-20T08:30:00Z",
  },
  {
    id: "a1000000-0000-0000-0000-000000000002",
    title: "Pengingat: Evaluasi Pekan Membaca Nasional",
    message: "Sudahkah Anda membaca 10 halaman hari ini? Jangan biarkan streak tantangan Anda terputus. Klik tautan berikut untuk check-in sekarang!",
    created_by_name: "Admin Rumah Literasi",
    sent_at: "2026-10-25T19:00:00Z",
    total_recipients: 980,
    status: "sent",
    created_at: "2026-10-25T18:00:00Z",
  },
];

export const dummyContactMessages: ContactMessage[] = [
  {
    id: "a2000000-0000-0000-0000-000000000001",
    name: "Farhan Hakim",
    email: "farhan.hakim@sekolahkita.sch.id",
    subject: "Kolaborasi Pelatihan Literasi Guru",
    message: "Halo Tim Rumah Literasi, kami dari yayasan pendidikan ingin mengundang narasumber untuk workshop literasi digital dan berpikir kritis bagi 60 guru SMP kami.",
    is_read: false,
    created_at: "2026-10-27T10:15:00Z",
  },
  {
    id: "a2000000-0000-0000-0000-000000000002",
    name: "Ratna Sari",
    email: "ratna.sari@komunitasbaca.org",
    subject: "Donasi Buku untuk Taman Bacaan Desa",
    message: "Selamat siang. Apakah Rumah Literasi membuka penyaluran buku fisik atau panduan kurikulum untuk perpustakaan desa kami di Wonosobo?",
    is_read: true,
    created_at: "2026-10-25T14:40:00Z",
  },
];

export const dummyStaticPages = {
  tentang: {
    title: "Tentang Kami - Rumah Literasi",
    subtitle: "Membangun Gerakan Membaca, Menulis, dan Bernalar Kritis untuk Generasi Emas Indonesia",
    story: `
Rumah Literasi lahir dari kegelisahan sederhana: mengapa di tengah banjir informasi digital dan kepemilikan smartphone yang masif di Indonesia, kemampuan menyerap bacaan mendalam dan bernalar kritis justru terasa kian tergerus?

Data menunjukkan bahwa orang Indonesia menghabiskan berjam-jam menatap layar setiap hari, namun sering kali terseret arus judul sensasional, potongan video tanpa konteks, dan perdebatan kusir yang melelahkan. Kami percaya bahwa literasi sejati bukan hanya tentang kemampuan mengeja aksara, melainkan kecakapan menyaring makna, menguji kebenaran, dan berempati terhadap perspektif yang berbeda.

Didirikan pada tahun 2025 oleh sekelompok pendidik, penulis, dan pemerhati teknologi, Rumah Literasi hadir sebagai ruang singgah yang meneduhkan: menyajikan artikel pilihan bergaya majalah, repositori bahan ajar gratis, serta tantangan kebiasaan membaca harian yang terukur dan membumi.
    `,
    visi: "Terwujudnya masyarakat Indonesia yang cerdas bernalar, berwawasan luas, serta gemar membaca dan berkarya secara kritis dan beradab.",
    misi: [
      "Menyediakan konten edukatif berkualitas tinggi yang mudah dipahami oleh seluruh lapisan masyarakat.",
      "Membantu individu dan keluarga membangun kebiasaan membaca konsisten melalui tantangan bertahap dan pendampingan.",
      "Mengkurasi dan mendistribusikan materi belajar, buku, dan perangkat verifikasi informasi secara gratis.",
      "Menghubungkan pegiat literasi, guru, relawan taman bacaan, dan orang tua dalam ekosistem belajar yang suportif.",
    ],
    values: [
      {
        title: "Integritas & Fakta",
        desc: "Setiap data dan rujukan artikel diteliti dari sumber ilmiah dan primer yang dapat dipertanggungjawabkan.",
      },
      {
        title: "Keterbukaan & Inklusivitas",
        desc: "Materi belajar dapat diakses gratis oleh siapa saja, dari Sabang sampai Merauke, tanpa memandang latar belakang.",
      },
      {
        title: "Kemandirian Bernalar",
        desc: "Kami tidak mendikte apa yang harus Anda pikirkan, melainkan melatih Anda bagaimana cara berpikir logis dan kritis.",
      },
    ],
    team: [
      {
        name: "Dewi Lestari",
        role: "Direktur Konten & Kurator Bacaan",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
      },
      {
        name: "Budi Santoso",
        role: "Kepala Litbang & Literasi Digital",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
      },
      {
        name: "Siti Rahmawati",
        role: "Koordinator Program Edukasi & Anak",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
      },
      {
        name: "Andi Pratama",
        role: "Fasilitator Komunitas & Penulisan",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
      },
    ],
  },
};
