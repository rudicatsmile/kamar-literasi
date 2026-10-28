import * as React from "react";
import Link from "next/link";
import {
  Flame,
  Trophy,
  BookOpen,
  Bookmark,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Compass,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  getCurrentUserProfile,
  getUserActiveChallengeProgress,
  getUserFavoriteResourcesList,
  getArticles,
} from "@/lib/data";

export default async function MemberDashboardPage() {
  const [userProfile, activeChallenge, favoriteResources, articles] =
    await Promise.all([
      getCurrentUserProfile(),
      getUserActiveChallengeProgress(),
      getUserFavoriteResourcesList(),
      getArticles(),
    ]);

  const recommendedArticle = articles[0] || null;
  const progressPercent = activeChallenge
    ? Math.round(
        (activeChallenge.completed_days.length / activeChallenge.duration_days) *
          100
      )
    : 0;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Ruang Belajar Anggota
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
            Selamat Datang, {userProfile.full_name}!
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Konsistensi kecil hari ini membentuk kedalaman berpikir Anda di masa depan.
          </p>
        </div>

        {activeChallenge ? (
          <div className="flex items-center gap-3">
            <Link href={`/dashboard/tantangan/${activeChallenge.challenge_id}`}>
              <Button className="gap-2 shadow-xs">
                <CheckCircle2 className="h-4 w-4" />
                <span>Check-in Hari Ini</span>
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/mulai-sekarang">
              <Button className="gap-2 shadow-xs">
                <Compass className="h-4 w-4" />
                <span>Pilih Tantangan Membaca</span>
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:border-primary/40 transition-colors">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-amber-100 text-amber-600">
              <Flame className="h-6 w-6 fill-amber-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Streak Kebiasaan</p>
              <h3 className="font-serif text-2xl font-bold text-foreground">
                {userProfile.streak} Hari
              </h3>
              <p className="text-[10px] text-amber-700">
                {userProfile.streak > 0 ? "Aktif & konsisten" : "Mulai hari ini"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/40 transition-colors">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Tantangan Aktif</p>
              <h3 className="font-serif text-2xl font-bold text-foreground">
                {activeChallenge ? "1 Program" : "0 Program"}
              </h3>
              <p className="text-[10px] text-emerald-700 truncate max-w-[140px]">
                {activeChallenge ? activeChallenge.challenge_title : "Belum bergabung"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/40 transition-colors">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-sky-100 text-sky-700">
              <Bookmark className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Resource Tersimpan</p>
              <h3 className="font-serif text-2xl font-bold text-foreground">
                {favoriteResources.length} Materi
              </h3>
              <p className="text-[10px] text-muted-foreground">Koleksi favorit</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/40 transition-colors">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-purple-100 text-purple-700">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Check-in Selesai</p>
              <h3 className="font-serif text-2xl font-bold text-foreground">
                {activeChallenge?.completed_days.length || 0} Kali
              </h3>
              <p className="text-[10px] text-purple-700">Pencapaian pribadi</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Challenge Progress Card or Empty State */}
      {activeChallenge ? (
        <Card className="border-border shadow-xs">
          <CardHeader className="border-b border-border pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <Badge variant="accent" className="text-[10px] font-semibold mb-1">
                  Tantangan Sedang Berjalan
                </Badge>
                <CardTitle className="font-serif text-xl font-bold text-foreground">
                  {activeChallenge.challenge_title}
                </CardTitle>
              </div>
              <Link href={`/dashboard/tantangan/${activeChallenge.challenge_id}`}>
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <span>Buka Kalender Check-in</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">
                  Progres: Hari ke-{activeChallenge.completed_days.length} dari{" "}
                  {activeChallenge.duration_days} Hari
                </span>
                <span className="font-bold text-primary">{progressPercent}% Selesai</span>
              </div>
              <Progress value={progressPercent} max={100} className="h-2.5" />
            </div>

            <div className="grid grid-cols-7 gap-2 pt-2">
              {Array.from({ length: activeChallenge.duration_days }, (_, i) => {
                const day = i + 1;
                const isDone = activeChallenge.completed_days.includes(day);
                const isNext = day === activeChallenge.completed_days.length + 1;

                return (
                  <div
                    key={day}
                    className={`flex flex-col items-center justify-center rounded-md p-3 border text-center transition-all ${
                      isDone
                        ? "bg-primary/10 border-primary text-primary"
                        : isNext
                        ? "bg-amber-50 border-amber-300 text-amber-800 ring-2 ring-amber-400/50"
                        : "bg-surface border-border text-muted-foreground opacity-60"
                    }`}
                  >
                    <span className="text-[10px] font-medium">Hari</span>
                    <span className="font-serif text-base font-bold">{day}</span>
                    {isDone ? (
                      <CheckCircle2 className="h-3.5 w-3.5 mt-1 text-primary" />
                    ) : isNext ? (
                      <span className="text-[9px] font-bold text-amber-700 mt-1">Hari Ini</span>
                    ) : (
                      <span className="text-[9px] text-muted-foreground mt-1">-</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="rounded-md border border-border bg-surface p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <p className="font-semibold text-foreground">
                  Tugas Hari Ini: Selesaikan Bacaan & Catat Refleksi Singkat
                </p>
                <p className="text-muted-foreground text-[11px]">
                  Sudah selesai membaca 10-15 menit? Catat satu kalimat refleksi Anda untuk
                  memvalidasi streak hari ini.
                </p>
              </div>
              <Link href={`/dashboard/tantangan/${activeChallenge.challenge_id}`}>
                <Button size="sm" className="shrink-0 text-xs gap-1">
                  <span>Tulis Refleksi</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border bg-surface/40 p-8 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Trophy className="h-7 w-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="font-serif text-xl font-bold text-foreground">
              Belum Ada Tantangan yang Diikuti
            </h3>
            <p className="text-sm text-muted-foreground">
              Bangun kebiasaan membaca rutin Anda hari ini. Mulai dari tantangan 7 hari membaca 10
              halaman dan raih streak pertama Anda!
            </p>
          </div>
          <Link href="/mulai-sekarang">
            <Button className="gap-2">
              <Compass className="h-4 w-4" />
              <span>Lihat Katalog Tantangan Membaca</span>
            </Button>
          </Link>
        </Card>
      )}

      {/* Split Section: Saved Favorites & Recommended Reading */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Saved Favorites */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-foreground">
              Materi Tersimpan di Favorit
            </h3>
            <Link
              href="/dashboard/favorit"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Lihat Semua ({favoriteResources.length})
            </Link>
          </div>

          {favoriteResources.length > 0 ? (
            <div className="space-y-3">
              {favoriteResources.slice(0, 3).map((res) => (
                <div
                  key={res.id}
                  className="flex items-center justify-between rounded-md border border-border bg-white p-4 hover:border-primary/40 transition-colors shadow-xs"
                >
                  <div className="space-y-1 pr-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                        {res.type}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {res.publisher}
                      </span>
                    </div>
                    <Link href={`/resource/${res.slug}`}>
                      <h4 className="font-serif text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
                        {res.title}
                      </h4>
                    </Link>
                  </div>
                  <Link href={`/resource/${res.slug}`}>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
              Belum ada materi atau buku yang disimpan di favorit. Jelajahi{" "}
              <Link href="/resource" className="text-primary font-semibold hover:underline">
                Resource Hub
              </Link>{" "}
              untuk menyimpan buku dan panduan bermanfaat.
            </div>
          )}
        </div>

        {/* Recommended Reading */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-foreground">
              Rekomendasi Pekan Ini
            </h3>
            <Link
              href="/artikel"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Katalog
            </Link>
          </div>

          {recommendedArticle && (
            <div className="rounded-md border border-border bg-white p-5 space-y-3 shadow-xs">
              <Badge variant="secondary" className="text-[10px]">
                {recommendedArticle.category_name}
              </Badge>
              <Link href={`/artikel/${recommendedArticle.slug}`}>
                <h4 className="font-serif text-base font-bold text-foreground hover:text-primary transition-colors leading-snug">
                  {recommendedArticle.title}
                </h4>
              </Link>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {recommendedArticle.excerpt}
              </p>
              <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <span>{recommendedArticle.reading_time} menit baca</span>
                <Link
                  href={`/artikel/${recommendedArticle.slug}`}
                  className="font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <span>Baca Sekarang</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
