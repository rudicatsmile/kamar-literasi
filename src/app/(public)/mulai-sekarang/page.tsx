import { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  Flame,
  ArrowRight,
  Clock,
  BookOpen,
  ThumbsDown,
  MessageCircle,
  Trophy,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getTips, getChallenges } from "@/lib/data";

export const metadata: Metadata = {
  title: "Mulai Sekarang - Tips Membaca & Tantangan Kebiasaan",
  description:
    "Bangun kebiasaan membaca terstruktur dengan tips praktis bebas hambatan dan program tantangan 7, 21, dan 30 hari.",
  openGraph: {
    title: "Mulai Sekarang - Tips Membaca & Tantangan Kebiasaan Literasi",
    description:
      "Bangun kebiasaan membaca terstruktur dengan tips praktis bebas hambatan dan program tantangan 7, 21, dan 30 hari.",
  },
};

export default async function MulaiSekarangPage() {
  const [tips, challenges] = await Promise.all([
    getTips(),
    getChallenges(),
  ]);
  const getTipIcon = (iconName: string) => {
    switch (iconName) {
      case "Clock":
        return <Clock className="h-5 w-5 text-primary" />;
      case "BookOpen":
        return <BookOpen className="h-5 w-5 text-primary" />;
      case "ThumbsDown":
        return <ThumbsDown className="h-5 w-5 text-primary" />;
      case "MessageCircle":
        return <MessageCircle className="h-5 w-5 text-primary" />;
      default:
        return <Sparkles className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="py-12 md:py-20 bg-background min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-16">
        {/* Header */}
        <div className="max-w-3xl">
          <Badge variant="outline" className="text-xs uppercase tracking-wider mb-2 font-semibold">
            Langkah Nyata
          </Badge>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Mulai Sekarang: Tips Praktis & Tantangan Kebiasaan
          </h1>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            Membangun kecintaan membaca tidak harus berat atau membebani.
            Mulailah dengan strategi mikro dan bergabunglah bersama ribuan pembaca
            lain dalam tantangan harian terstruktur.
          </p>
        </div>

        {/* Section 1: Practical Tips */}
        <div className="space-y-6">
          <div className="border-b border-border pb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Metode Bebas Hambatan
            </span>
            <h2 className="mt-1 font-serif text-2xl font-bold text-foreground">
              4 Tips Praktis Membangun Disiplin Membaca
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {tips.map((tip) => (
              <div
                key={tip.id}
                className="flex items-start gap-4 rounded-md border border-border bg-white p-6 shadow-xs transition-colors hover:border-primary/40"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  {getTipIcon(tip.icon)}
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-base font-bold text-foreground">
                    {tip.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tip.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Habit Challenges Grid */}
        <div className="space-y-6">
          <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Program Terarah
              </span>
              <h2 className="mt-1 font-serif text-2xl font-bold text-foreground">
                Pilih Program Tantangan Literasi
              </h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Tersedia pilihan 7, 21, dan 30 hari sesuai kesiapan Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {challenges.map((challenge) => (
              <Card
                key={challenge.id}
                className="flex flex-col justify-between overflow-hidden hover:border-primary/40 transition-all hover:shadow-xs group"
              >
                <div className="relative aspect-16/9 overflow-hidden bg-muted">
                  <img
                    src={challenge.cover_url}
                    alt={challenge.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="accent" className="font-bold shadow-xs">
                      {challenge.duration_days} Hari
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6 flex flex-1 flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                      {challenge.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {challenge.description}
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Flame className="h-3.5 w-3.5 text-amber-600 fill-amber-500" />
                        {challenge.participants_count} Peserta
                      </span>
                      <span className="flex items-center gap-1 font-medium text-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                        Check-in Harian
                      </span>
                    </div>

                    <Link href={`/mulai-sekarang/tantangan/${challenge.slug}`} className="block">
                      <Button className="w-full gap-2">
                        <span>Lihat Jadwal & Ikuti</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Info callout on how it works */}
        <div className="rounded-xl border border-border bg-surface p-8">
          <h3 className="font-serif text-xl font-bold text-foreground mb-4">
            Bagaimana Cara Kerja Tantangan Ini?
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-xs text-muted-foreground leading-relaxed">
            <div className="space-y-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white font-bold text-xs">
                1
              </span>
              <p className="font-semibold text-foreground text-sm">Pilih Tantangan</p>
              <p>
                Daftar akun gratis dan tekan tombol &ldquo;Ikuti Tantangan&rdquo;. Jadwal harian akan
                muncul otomatis di dasbor Anda.
              </p>
            </div>
            <div className="space-y-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white font-bold text-xs">
                2
              </span>
              <p className="font-semibold text-foreground text-sm">Selesaikan Tugas Harian</p>
              <p>
                Baca bahan bacaan sesuai instruksi, lalu tuliskan catatan refleksi singkat
                1-2 kalimat untuk mencatat check-in hari itu.
              </p>
            </div>
            <div className="space-y-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white font-bold text-xs">
                3
              </span>
              <p className="font-semibold text-foreground text-sm">Pertahankan Streak</p>
              <p>
                Dapatkan pengingat harian lewat WhatsApp agar streak kebiasaan Anda tidak
                terputus hingga seluruh hari terselesaikan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
