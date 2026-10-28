import * as React from "react";
import Link from "next/link";
import {
  Trophy,
  Flame,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Compass,
  Clock,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getUserAllParticipations } from "@/lib/data";

export default async function MemberTantanganPage() {
  const participations = await getUserAllParticipations();
  const activeChallenges = participations.filter((p) => p.status === "active");
  const completedChallenges = participations.filter((p) => p.status === "completed");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Aktivitas Pembiasaan
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
            Tantangan Literasi Saya
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pantau konsistensi membaca harian, streak, dan evaluasi hasil refleksi Anda.
          </p>
        </div>

        <Link href="/mulai-sekarang">
          <Button variant="outline" className="gap-2">
            <Compass className="h-4 w-4" />
            <span>Jelajahi Program Lain</span>
          </Button>
        </Link>
      </div>

      {/* Active Challenge Section */}
      <div className="space-y-4">
        <h2 className="font-serif text-xl font-bold text-foreground">
          Program yang Sedang Berjalan
        </h2>

        {activeChallenges.length > 0 ? (
          <div className="space-y-4">
            {activeChallenges.map((activeProg) => {
              const progressPercent = Math.round(
                (activeProg.completed_days.length / activeProg.duration_days) * 100
              );

              return (
                <Card
                  key={activeProg.id}
                  className="border-border shadow-xs overflow-hidden"
                >
                  <div className="bg-primary/5 p-6 border-b border-border">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="accent" className="font-bold text-xs">
                            {activeProg.duration_days} Hari
                          </Badge>
                          <Badge variant="success" className="text-xs">
                            Status: Aktif
                          </Badge>
                        </div>
                        <h3 className="font-serif text-2xl font-bold text-foreground">
                          {activeProg.challenge_title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Dimulai:{" "}
                          {new Date(activeProg.started_at).toLocaleDateString(
                            "id-ID",
                            { day: "numeric", month: "long", year: "numeric" }
                          )}{" "}
                          • Zona Waktu: Asia/Jakarta (WIB)
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800">
                          <Flame className="h-4 w-4 fill-amber-500 text-amber-600" />
                          <span>Streak: {activeProg.current_streak} Hari</span>
                        </div>

                        <Link
                          href={`/dashboard/tantangan/${activeProg.challenge_id}`}
                        >
                          <Button className="gap-1.5">
                            <span>Buka Check-in</span>
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground">
                          Capaian: {activeProg.completed_days.length} dari{" "}
                          {activeProg.duration_days} Hari Selesai
                        </span>
                        <span className="font-bold text-primary">
                          {progressPercent}%
                        </span>
                      </div>
                      <Progress
                        value={progressPercent}
                        max={100}
                        className="h-2.5"
                      />
                    </div>

                    <div className="rounded-md border border-border bg-surface p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                      <span className="text-muted-foreground">
                        {activeProg.checkins.length > 0
                          ? `Check-in terakhir: ${activeProg.checkins[activeProg.checkins.length - 1].date}`
                          : "Belum ada check-in yang dicatat."}
                      </span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Lanjutkan tugas Hari ke-
                        {activeProg.completed_days.length + 1}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-border p-8 text-center space-y-3">
            <Trophy className="mx-auto h-8 w-8 text-muted-foreground opacity-50" />
            <h3 className="font-serif text-base font-bold text-foreground">
              Belum Ada Tantangan Aktif
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Anda belum mengikuti program tantangan membaca. Pilih program yang sesuai
              dengan target harian Anda.
            </p>
            <Link href="/mulai-sekarang">
              <Button size="sm" className="gap-2 mt-2">
                <Compass className="h-4 w-4" />
                <span>Pilih Tantangan Membaca</span>
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Completed Challenges Section */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h2 className="font-serif text-xl font-bold text-foreground">
          Riwayat Tantangan Terselesaikan
        </h2>

        {completedChallenges.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {completedChallenges.map((comp) => (
              <Card key={comp.id} className="border-border p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-foreground">
                      {comp.challenge_title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Tuntas {comp.duration_days} Hari • Streak Maksimal:{" "}
                      {comp.current_streak} Hari
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-border bg-white p-6 text-center space-y-3">
            <Trophy className="mx-auto h-8 w-8 text-amber-500" />
            <h4 className="font-serif text-base font-bold text-foreground">
              Raih Lencana Literasi Pertama Anda!
            </h4>
            <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
              Tuntaskan seluruh hari pada program yang Anda ikuti untuk membuka rekam jejak
              pembaca konsisten dan mencatat pencapaian kebiasaan baru.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
