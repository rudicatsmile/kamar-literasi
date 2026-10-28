import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  Compass,
  Flame,
  Layers,
  Sparkles,
  TrendingUp,
  Download,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  getArticles,
  getResources,
  getStatistics,
  getChallenges,
} from "@/lib/data";

export default async function HomePage() {
  const articles = await getArticles();
  const resources = await getResources();
  const statistics = await getStatistics();
  const challenges = await getChallenges();

  const latestArticles = articles.slice(0, 3);
  const featuredResources = resources.slice(0, 3);
  const topMetrics = statistics.filter((s) => s.type === "metric");

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-surface via-surface/60 to-white py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
            <Badge
              variant="accent"
              className="px-3 py-1 text-xs gap-1.5 font-medium border border-amber-300"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-700" />
              <span>Gerakan Literasi & Bernalar Kritis Indonesia</span>
            </Badge>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.15]">
              Membaca Membuka Cakrawala, <br className="hidden sm:inline" />
              <span className="text-primary italic">Bernalar Kritis</span> Menjaga Martabat.
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Indonesia tidak kekurangan orang yang bisa mengeja, tetapi kita
              membutuhkan lebih banyak pembaca yang tekun, pemikir yang jernih,
              dan masyarakat yang kebal dari manipulasi informasi.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full sm:w-auto">
              <Link href="/mulai-sekarang" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-2 text-base">
                  <span>Ikuti Tantangan 7 Hari</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/resource" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto gap-2 text-base"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Ambil Materi Belajar Gratis</span>
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 pt-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-primary" />
                100% Akses Terbuka
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-primary" />
                Kurasi Ilmiah Tepercaya
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-primary" />
                Bebas Iklan Komersial
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Statistics Bar */}
      <section className="border-b border-border bg-white py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {topMetrics.map((metric) => (
              <div
                key={metric.id}
                className="flex flex-col rounded-md border border-border bg-surface/40 p-6 transition-all hover:border-primary/40 hover:bg-white hover:shadow-xs"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {metric.label}
                </span>
                <span className="mt-2 font-serif text-3xl font-bold text-foreground">
                  {metric.value}
                </span>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {metric.description}
                </p>
                <div className="mt-4 pt-3 border-t border-border/60 text-[10px] text-muted-foreground flex items-center justify-between">
                  <span>Sumber: {metric.source_name}</span>
                  <span className="font-medium text-foreground">{metric.year}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/statistik"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <span>Lihat Seluruh Data Statistik & Fakta Literasi Nasional</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="py-20 md:py-24 border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                Wawasan Pilihan
              </span>
              <h2 className="mt-1 font-serif text-3xl font-bold text-foreground">
                Esai & Panduan Literasi Terkini
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-lg">
                Tulisan mendalam yang dirancang untuk mengasah rasa ingin tahu,
                ketahanan mental membaca, dan kejernihan logika.
              </p>
            </div>
            <Link href="/artikel">
              <Button variant="outline" size="sm" className="gap-1.5">
                <span>Semua Artikel</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {latestArticles.map((article) => (
              <article
                key={article.id}
                className="group flex flex-col overflow-hidden rounded-md border border-border bg-white transition-all hover:border-primary/40 hover:shadow-xs"
              >
                <Link
                  href={`/artikel/${article.slug}`}
                  className="relative aspect-16/10 overflow-hidden bg-muted"
                >
                  <img
                    src={article.cover_url}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-xs font-medium">
                      {article.category_name}
                    </Badge>
                  </div>
                </Link>

                <div className="flex flex-1 flex-col p-6">
                  <div className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                    <span>{article.reading_time} menit baca</span>
                    <span>•</span>
                    <span>
                      {new Date(article.published_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <Link href={`/artikel/${article.slug}`}>
                    <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h3>
                  </Link>

                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="mt-auto pt-6 flex items-center justify-between border-t border-border">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={article.author_avatar}
                        alt={article.author_name}
                        className="h-7 w-7 rounded-full object-cover"
                      />
                      <span className="text-xs font-medium text-foreground">
                        {article.author_name}
                      </span>
                    </div>
                    <Link
                      href={`/artikel/${article.slug}`}
                      className="text-xs font-semibold text-primary group-hover:underline flex items-center gap-1"
                    >
                      <span>Baca</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Resource Hub Highlights */}
      <section className="py-20 md:py-24 border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                Repositori Terbuka
              </span>
              <h2 className="mt-1 font-serif text-3xl font-bold text-foreground">
                Materi Belajar & Sumber Daya Pilihan
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-lg">
                Ebook panduan, perangkat pemverifikasi informasi, dan referensi bacaan
                yang dapat diakses gratis oleh pendidik dan masyarakat.
              </p>
            </div>
            <Link href="/resource">
              <Button variant="outline" size="sm" className="gap-1.5">
                <span>Jelajahi Resource Hub</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {featuredResources.map((res) => (
              <Card key={res.id} className="flex flex-col justify-between hover:border-primary/40">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="uppercase text-[10px] tracking-wider font-semibold">
                      {res.type === "pdf" ? "Dokumen PDF" : res.type === "tool" ? "Perangkat / Alat" : "Buku Rekomendasi"}
                    </Badge>
                    <Badge variant="secondary" className="capitalize text-[10px]">
                      Usia: {res.age_category}
                    </Badge>
                  </div>

                  <Link href={`/resource/${res.slug}`}>
                    <h3 className="font-serif text-lg font-bold text-foreground hover:text-primary transition-colors line-clamp-2">
                      {res.title}
                    </h3>
                  </Link>

                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {res.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                    <span>{res.publisher}</span>
                    <span className="flex items-center gap-1 font-medium text-foreground">
                      <Download className="h-3 w-3" />
                      {res.download_count.toLocaleString("id-ID")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Challenges Callout Section */}
      <section className="py-20 md:py-24 border-b border-border bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-8 sm:p-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-12 items-center">
              <div className="md:col-span-7 space-y-4">
                <Badge variant="accent" className="text-xs gap-1 font-semibold">
                  <Flame className="h-3.5 w-3.5 text-amber-700 fill-amber-500" />
                  <span>Program Pembiasaan Kebiasaan</span>
                </Badge>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                  Mulai Tantangan Membaca 7, 21, atau 30 Hari
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Bangun konsistensi dengan panduan tugas harian bertahap.
                  Simpan catatan refleksi harian Anda, raih streak kebiasaan,
                  dan dapatkan pengingat ramah via WhatsApp.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link href="/mulai-sekarang">
                    <Button size="lg" className="gap-2">
                      <span>Pilih Tantangan Anda</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="outline" size="lg">
                      Lihat Progres Saya
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="md:col-span-5 space-y-3">
                {challenges.map((ch) => (
                  <Link
                    key={ch.id}
                    href={`/mulai-sekarang/tantangan/${ch.slug}`}
                    className="block group"
                  >
                    <div className="flex items-center justify-between rounded-md border border-border bg-white p-4 transition-all group-hover:border-primary group-hover:shadow-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                            {ch.title}
                          </span>
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          {ch.participants_count} peserta aktif bergabung
                        </span>
                      </div>
                      <Badge variant="outline" className="font-medium shrink-0">
                        {ch.duration_days} Hari
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
