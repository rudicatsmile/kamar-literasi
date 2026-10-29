"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  ExternalLink,
  Eye,
  Filter,
  Flame,
  HelpCircle,
  Info,
  Layers,
  Lightbulb,
  LineChart,
  RefreshCw,
  Search,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ReadingAnalyticsSummary,
  ArticleReadingPerformance,
  ReadingFunnelStage,
} from "@/lib/reading-analytics-types";
import {
  getReadingAnalyticsSummary,
  clearAllReadingSessionsAction,
} from "@/app/actions/reading-analytics";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AnalitikBacaanClientProps {
  initialData: ReadingAnalyticsSummary;
}

export function AnalitikBacaanClient({
  initialData,
}: AnalitikBacaanClientProps) {
  const router = useRouter();
  const [data, setData] = React.useState<ReadingAnalyticsSummary>(initialData);
  const [timeRange, setTimeRange] = React.useState<"7d" | "30d" | "all">("30d");
  const [loading, setLoading] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [selectedArticle, setSelectedArticle] =
    React.useState<ArticleReadingPerformance | null>(null);

  const handleTimeRangeChange = async (newRange: "7d" | "30d" | "all") => {
    setTimeRange(newRange);
    setLoading(true);
    try {
      const refreshed = await getReadingAnalyticsSummary(newRange);
      setData(refreshed);
      toast.success(
        `Rentang data berhasil dialihkan ke ${
          newRange === "7d"
            ? "7 Hari Terakhir"
            : newRange === "30d"
            ? "30 Hari Terakhir"
            : "Semua Waktu"
        }`
      );
    } catch {
      toast.error("Gagal memuat ulang data analitik.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const refreshed = await getReadingAnalyticsSummary(timeRange);
      setData(refreshed);
      router.refresh();
      toast.success("Data analitik membaca berhasil disinkronkan langsung dari database.");
    } catch {
      toast.error("Gagal menyegarkan data.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearSessions = async () => {
    if (
      !confirm(
        "Apakah Anda yakin ingin mengosongkan seluruh rekaman data sesi membaca di Supabase?\n\nPerhatian: Pastikan tab artikel di browser sudah ditutup agar tab yang sedang aktif tidak mengirimkan beacon ulang."
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const res = await clearAllReadingSessionsAction();
      if (res.success) {
        toast.success("Seluruh sesi membaca berhasil dikosongkan (Total Sesi = 0).");
        const refreshed = await getReadingAnalyticsSummary(timeRange);
        setData(refreshed);
        router.refresh();
      } else {
        toast.error(res.error || "Gagal mengosongkan data sesi.");
      }
    } catch {
      toast.error("Terjadi kendala saat mengosongkan data.");
    } finally {
      setLoading(false);
    }
  };

  // Filter daftar artikel
  const filteredArticles = (data.articles || []).filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(search.toLowerCase()) ||
      art.authorName.toLowerCase().includes(search.toLowerCase()) ||
      art.categoryName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || art.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header Halaman */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Modul Analitik Redaksi
            </span>
            <Badge variant="outline" className="text-[10px] py-0 px-2 bg-primary/5 text-primary border-primary/20">
              Fitur 3.4 • Reading Drop-off
            </Badge>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              100% Data Riil Supabase ({data.totalSessions} Sesi)
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground mt-1">
            Analitik Perilaku Membaca Mendalam
          </h1>
          <p className="mt-1 text-sm text-muted-foreground max-w-3xl">
            Lacak keterbacaan artikel sesungguhnya: apakah esai dibaca sampai
            tuntas (*completion rate*), berapa durasi baca aktual, serta di
            bagian paragraf mana pembaca paling sering keluar (*drop-off point*).
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Time Range Pills */}
          <div className="inline-flex rounded-lg border border-border bg-muted/40 p-1 text-xs">
            <button
              type="button"
              onClick={() => handleTimeRangeChange("7d")}
              disabled={loading}
              className={cn(
                "rounded-md px-3 py-1 font-medium transition-colors",
                timeRange === "7d"
                  ? "bg-white text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              7 Hari
            </button>
            <button
              type="button"
              onClick={() => handleTimeRangeChange("30d")}
              disabled={loading}
              className={cn(
                "rounded-md px-3 py-1 font-medium transition-colors",
                timeRange === "30d"
                  ? "bg-white text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              30 Hari
            </button>
            <button
              type="button"
              onClick={() => handleTimeRangeChange("all")}
              disabled={loading}
              className={cn(
                "rounded-md px-3 py-1 font-medium transition-colors",
                timeRange === "all"
                  ? "bg-white text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Semua
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="gap-1.5 text-xs"
          >
            <RefreshCw
              className={cn("h-3.5 w-3.5", loading && "animate-spin")}
            />
            <span>Segarkan</span>
          </Button>

          {data.totalSessions > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearSessions}
              disabled={loading}
              className="gap-1.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
              title="Kosongkan seluruh data sesi membaca di Supabase"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Kosongkan Sesi</span>
            </Button>
          )}

          <Link href="/admin/artikel">
            <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Kelola Artikel</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Kartu KPI Metrik Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Sesi Membaca */}
        <Card className="hover:border-primary/40 transition-colors shadow-xs">
          <CardContent className="p-5 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">
                Total Sesi Membaca
              </span>
              <h3 className="font-serif text-3xl font-bold tracking-tight text-foreground">
                {data.totalSessions.toLocaleString("id-ID")}
              </h3>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-600 inline" />
                <span className="font-medium text-foreground">
                  {data.completedSessions.toLocaleString("id-ID")}
                </span>{" "}
                sesi baca tuntas
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Completion Rate */}
        <Card className="hover:border-primary/40 transition-colors shadow-xs">
          <CardContent className="p-5 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">
                Rata-rata Keterbacaan Tuntas
              </span>
              <h3 className="font-serif text-3xl font-bold tracking-tight text-emerald-700">
                {data.averageCompletionRate}%
              </h3>
              <div className="w-36 pt-1">
                <Progress
                  value={data.averageCompletionRate}
                  className="h-1.5 bg-emerald-100 [&>div]:bg-emerald-600"
                />
              </div>
              <p className="text-[10px] text-muted-foreground pt-0.5">
                Target sehat publikasi: &gt; 45%
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Actual vs Estimated Time */}
        <Card className="hover:border-primary/40 transition-colors shadow-xs">
          <CardContent className="p-5 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">
                Waktu Baca Aktual vs Estimasi
              </span>
              <h3 className="font-serif text-3xl font-bold tracking-tight text-foreground">
                {data.averageActualDurationFormatted}
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Estimasi redaksi: ~{data.averageEstimatedMinutes} menit
              </p>
              <p className="text-[10px] text-primary font-medium">
                Pace Ratio: {data.readingPaceRatio}x (
                {data.readingPaceRatio >= 0.8 && data.readingPaceRatio <= 1.2
                  ? "Sangat Akurat"
                  : data.readingPaceRatio > 1.2
                  ? "Pembaca Menikmati / Lambat"
                  : "Membaca Cepat"}
                )
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 4: Top Drop-off Point */}
        <Card className="hover:border-primary/40 transition-colors shadow-xs">
          <CardContent className="p-5 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">
                Titik Lepas Baca Terkritis
              </span>
              <h3 className="font-serif text-xl font-bold tracking-tight text-destructive">
                {data.topDropoffPoint.label}
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Penurunan tajam:{" "}
                <span className="font-semibold text-destructive">
                  -{data.topDropoffPoint.dropPercentage}%
                </span>{" "}
                pembaca
              </p>
              <p className="text-[10px] text-muted-foreground line-clamp-1">
                Fokuskan revisi di bagian tengah esai
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-rose-50 text-destructive">
              <TrendingDown className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visualisasi Funnel Drop-off Membaca & Panduan Redaksi */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Funnel Box (2 Columns on Large) */}
        <Card className="lg:col-span-2 shadow-xs">
          <CardHeader className="border-b border-border/60 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  <span>Funnel Kedalaman Membaca Keseluruhan</span>
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Distribusi persentase pembaca yang berhasil melewati setiap
                  tahapan struktur naskah.
                </p>
              </div>
              <Badge variant="secondary" className="text-[11px]">
                {data.totalSessions} Total Sesi
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            {data.globalFunnel.map((stage, idx) => {
              // Menghitung lebar visual bar yang mencerminkan retensi
              const barWidth = Math.max(12, stage.percentage);

              return (
                <div key={stage.milestone} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-foreground">
                        {stage.label}
                      </span>
                      <span className="text-muted-foreground hidden sm:inline">
                        — {stage.description}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {idx > 0 && stage.dropoffRate > 0 && (
                        <span className="text-[11px] text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
                          <TrendingDown className="h-3 w-3 inline" />
                          <span>-{stage.dropoffRate}% drop</span>
                        </span>
                      )}
                      <span className="font-mono font-bold text-foreground">
                        {stage.percentage}%
                      </span>
                      <span className="text-[11px] text-muted-foreground w-16 text-right">
                        ({stage.count.toLocaleString("id-ID")})
                      </span>
                    </div>
                  </div>

                  {/* Visual Stepped Funnel Bar */}
                  <div className="relative h-7 w-full overflow-hidden rounded-md bg-muted/50 p-1">
                    <div
                      className={cn(
                        "h-full rounded transition-all duration-500 ease-out flex items-center px-2 text-[10px] font-semibold text-white",
                        idx === 0
                          ? "bg-sky-600"
                          : idx === 1
                          ? "bg-blue-600"
                          : idx === 2
                          ? "bg-indigo-600"
                          : idx === 3
                          ? "bg-emerald-600"
                          : "bg-teal-600"
                      )}
                      style={{ width: `${barWidth}%` }}
                    >
                      {stage.percentage >= 20 && (
                        <span>{stage.percentage}% Bertahan</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Editorial Actionable Insights Box */}
        <Card className="shadow-xs flex flex-col">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-600" />
              <span>Wawasan Redaksi & Rekomendasi</span>
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tindakan praktis untuk meningkatkan retensi pembaca.
            </p>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-xs text-muted-foreground flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="rounded-lg border border-amber-200/80 bg-amber-50/60 p-3.5 space-y-1.5">
                <p className="font-semibold text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                  <span>Titik Penurunan Utama: {data.topDropoffPoint.label}</span>
                </p>
                <p className="text-amber-800/90 leading-relaxed">
                  {data.topDropoffPoint.description}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2.5 items-start">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/10 text-primary font-bold text-[10px] mt-0.5">
                    1
                  </div>
                  <div>
                    <strong className="text-foreground">Trik Subjudul Dinamis</strong>
                    <p className="mt-0.5 leading-relaxed">
                      Gunakan format subjudul bernada pertanyaan atau paradoks
                      pada pergantian babak (milestone 50%) agar pembaca penasaran
                      akan solusinya.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/10 text-primary font-bold text-[10px] mt-0.5">
                    2
                  </div>
                  <div>
                    <strong className="text-foreground">Pecah Dinding Paragraf</strong>
                    <p className="mt-0.5 leading-relaxed">
                      Bila paragraf memiliki lebih dari 5 baris di layar seluler,
                      pecah menjadi kutipan blok (*blockquote*) atau daftar berbutir.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/10 text-primary font-bold text-[10px] mt-0.5">
                    3
                  </div>
                  <div>
                    <strong className="text-foreground">Pertahankan Kesimpulan Ringkas</strong>
                    <p className="mt-0.5 leading-relaxed">
                      Sajikan kesimpulan dalam 2-3 poin aksi (*Actionable Takeaways*)
                      sehingga pembaca yang mencapai 75% termotivasi menyelesaikan hingga kata penutup.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <span className="text-[11px] text-muted-foreground block text-center italic">
                Data otomatis diperbarui dari pembaca publik secara real-time.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabel Kinerja Membaca Per Artikel */}
      <Card className="shadow-xs">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="font-serif text-lg font-bold text-foreground">
                Kinerja Membaca Seluruh Artikel
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Evaluasi tingkat keterbacaan dan titik lepas baca untuk masing-masing esai.
              </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Cari judul atau penulis..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 text-xs h-8"
                />
              </div>

              {/* Status Filter */}
              <select
                aria-label="Filter status performa"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-8 rounded-md border border-input bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">Semua Status</option>
                <option value="excellent">Sangat Baik (≥ 60%)</option>
                <option value="good">Cukup Baik (40 - 59%)</option>
                <option value="needs_attention">Perlu Optimasi (&lt; 40%)</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="text-xs font-semibold">Artikel & Penulis</TableHead>
                  <TableHead className="text-xs font-semibold text-center">Waktu Baca (Aktual vs Est.)</TableHead>
                  <TableHead className="text-xs font-semibold text-center">Total Pembaca</TableHead>
                  <TableHead className="text-xs font-semibold">Tingkat Tuntas (Completion)</TableHead>
                  <TableHead className="text-xs font-semibold">Titik Lepas Terbanyak</TableHead>
                  <TableHead className="text-xs font-semibold text-center">Status</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-10 text-center text-xs text-muted-foreground"
                    >
                      Tidak ada artikel yang sesuai dengan filter pencarian.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredArticles.map((art) => (
                    <TableRow
                      key={art.articleId}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      {/* Judul & Penulis */}
                      <TableCell className="max-w-[280px]">
                        <div className="space-y-1">
                          <Badge
                            variant="secondary"
                            className="text-[10px] py-0 px-1.5 font-normal"
                          >
                            {art.categoryName}
                          </Badge>
                          <p className="font-serif font-semibold text-foreground text-xs line-clamp-2 leading-snug">
                            {art.title}
                          </p>
                          <div className="flex items-center gap-1.5 pt-0.5">
                            {art.authorAvatar ? (
                              <div className="relative h-4 w-4 shrink-0 rounded-full overflow-hidden border border-border">
                                <Image
                                  src={art.authorAvatar}
                                  alt={art.authorName}
                                  fill
                                  sizes="16px"
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-4 w-4 shrink-0 rounded-full bg-primary/10 text-primary font-bold text-[8px] flex items-center justify-center uppercase">
                                {art.authorName.charAt(0)}
                              </div>
                            )}
                            <span className="text-[10px] text-muted-foreground truncate">
                              {art.authorName}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Waktu Baca */}
                      <TableCell className="text-center whitespace-nowrap">
                        <div className="space-y-0.5">
                          <span className="font-mono font-bold text-xs text-foreground">
                            {art.actualDurationFormatted}
                          </span>
                          <p className="text-[10px] text-muted-foreground">
                            Est. {art.estimatedTimeMinutes}m
                          </p>
                        </div>
                      </TableCell>

                      {/* Total Pembaca */}
                      <TableCell className="text-center whitespace-nowrap">
                        <div className="space-y-0.5">
                          <span className="font-bold text-xs text-foreground">
                            {art.totalSessions.toLocaleString("id-ID")}
                          </span>
                          <p className="text-[10px] text-emerald-700">
                            {art.completedSessions} tuntas
                          </p>
                        </div>
                      </TableCell>

                      {/* Completion Rate Bar */}
                      <TableCell className="min-w-[150px]">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span
                              className={cn(
                                art.completionRate >= 60
                                  ? "text-emerald-700"
                                  : art.completionRate >= 40
                                  ? "text-amber-700"
                                  : "text-rose-700"
                              )}
                            >
                              {art.completionRate}%
                            </span>
                            <span className="text-[10px] text-muted-foreground font-normal">
                              {art.completedSessions}/{art.totalSessions}
                            </span>
                          </div>
                          <Progress
                            value={art.completionRate}
                            className={cn(
                              "h-1.5",
                              art.completionRate >= 60
                                ? "bg-emerald-100 [&>div]:bg-emerald-600"
                                : art.completionRate >= 40
                                ? "bg-amber-100 [&>div]:bg-amber-600"
                                : "bg-rose-100 [&>div]:bg-rose-600"
                            )}
                          />
                        </div>
                      </TableCell>

                      {/* Titik Lepas Terbanyak */}
                      <TableCell className="whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground bg-muted/60 px-2 py-1 rounded">
                          <TrendingDown className="h-3 w-3 text-muted-foreground" />
                          <span>{art.dropoffLabel}</span>
                        </span>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="text-center whitespace-nowrap">
                        {art.status === "excellent" ? (
                          <Badge variant="success" className="text-[10px] py-0">
                            Sangat Baik
                          </Badge>
                        ) : art.status === "good" ? (
                          <Badge variant="secondary" className="text-[10px] py-0 text-amber-800 bg-amber-50 border-amber-200">
                            Cukup Baik
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="text-[10px] py-0">
                            Perlu Optimasi
                          </Badge>
                        )}
                      </TableCell>

                      {/* Aksi */}
                      <TableCell className="text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedArticle(art)}
                            className="h-7 text-[11px] gap-1 px-2.5"
                          >
                            <LineChart className="h-3 w-3" />
                            <span>Funnel</span>
                          </Button>
                          <Link
                            href={`/artikel/${art.slug}`}
                            target="_blank"
                            title="Buka artikel publik"
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                            >
                              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog Detail Funnel Spesifik Artikel */}
      <Dialog
        open={Boolean(selectedArticle)}
        onOpenChange={(open) => {
          if (!open) setSelectedArticle(null);
        }}
      >
        <DialogContent className="max-w-2xl">
          {selectedArticle && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-[10px]">
                    {selectedArticle.categoryName}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Penulis: {selectedArticle.authorName}
                  </span>
                </div>
                <DialogTitle className="font-serif text-xl leading-snug">
                  {selectedArticle.title}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Analisis struktur pembaca dan rincian waktu baca aktual.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 pt-2">
                {/* Ringkasan Cepat */}
                <div className="grid grid-cols-3 gap-3 rounded-lg border border-border bg-muted/20 p-3 text-center">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">
                      Total Sesi
                    </span>
                    <strong className="text-sm font-bold text-foreground">
                      {selectedArticle.totalSessions}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">
                      Waktu Aktual vs Est.
                    </span>
                    <strong className="text-sm font-bold text-foreground">
                      {selectedArticle.actualDurationFormatted}{" "}
                      <span className="text-[10px] font-normal text-muted-foreground">
                        / {selectedArticle.estimatedTimeMinutes}m
                      </span>
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">
                      Completion Rate
                    </span>
                    <strong
                      className={cn(
                        "text-sm font-bold",
                        selectedArticle.completionRate >= 60
                          ? "text-emerald-700"
                          : "text-amber-700"
                      )}
                    >
                      {selectedArticle.completionRate}%
                    </strong>
                  </div>
                </div>

                {/* Funnel Breakdown per Tahap */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Tahapan Keterbacaan Naskah
                  </h4>
                  <div className="space-y-3">
                    {selectedArticle.funnel.map((stage, idx) => (
                      <div key={stage.milestone} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-foreground">
                            {stage.label}
                          </span>
                          <div className="flex items-center gap-2">
                            {idx > 0 && stage.dropoffRate > 0 && (
                              <span className="text-[10px] text-destructive bg-destructive/10 px-1 rounded">
                                -{stage.dropoffRate}% drop
                              </span>
                            )}
                            <span className="font-mono font-bold text-foreground">
                              {stage.percentage}%
                            </span>
                            <span className="text-muted-foreground text-[10px]">
                              ({stage.count} sesi)
                            </span>
                          </div>
                        </div>
                        <Progress
                          value={stage.percentage}
                          className={cn(
                            "h-2",
                            idx === 4
                              ? "[&>div]:bg-teal-600"
                              : idx === 3
                              ? "[&>div]:bg-emerald-600"
                              : idx === 2
                              ? "[&>div]:bg-indigo-600"
                              : "[&>div]:bg-blue-600"
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Saran Spesifik untuk Naskah Ini */}
                <div className="rounded-md border border-primary/20 bg-primary/5 p-3.5 space-y-1 text-xs">
                  <p className="font-semibold text-primary flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Catatan Redaksi untuk Artikel Ini</span>
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Titik putus tertinggi berada di{" "}
                    <strong className="text-foreground">
                      {selectedArticle.dropoffLabel}
                    </strong>
                    . Bila Anda menyunting esai ini, periksa bagian tersebut
                    untuk memastikan alur pemikiran tetap mengalir lancar dan tidak
                    terlalu berbelit.
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

