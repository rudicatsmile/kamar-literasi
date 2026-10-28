import { Metadata } from "next";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  ExternalLink,
  Info,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getStatistics } from "@/lib/data";
import { LiteracyTrendChart } from "@/components/charts/literacy-trend-chart";

export const metadata: Metadata = {
  title: "Statistik & Fakta Literasi Indonesia",
  description:
    "Data indikator kunci, deret tren grafik membaca nasional, dan fakta terverifikasi mengenai potret literasi di Indonesia.",
  openGraph: {
    title: "Statistik & Fakta Literasi Indonesia - Masyarakat Literasi",
    description:
      "Data indikator kunci, deret tren grafik membaca nasional, dan fakta terverifikasi mengenai potret literasi di Indonesia.",
  },
};

export default async function StatistikPage() {
  const statistics = await getStatistics();
  const metrics = statistics.filter((s) => s.type === "metric");
  const chartStat = statistics.find((s) => s.type === "chart");
  const facts = statistics.filter((s) => s.type === "fact");

  return (
    <div className="py-12 md:py-20 bg-background min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-12">
        {/* Header Section */}
        <div className="max-w-3xl">
          <Badge variant="outline" className="text-xs uppercase tracking-wider mb-2 font-semibold">
            Data & Riset
          </Badge>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Statistik & Fakta Literasi Indonesia
          </h1>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            Menyajikan data terverifikasi seputar kebiasaan membaca, kesenjangan akses
            buku antardaerah, dan perkembangan nalar kritis bangsa berdasarkan laporan
            resmi lembaga pendidikan dan riset nasional.
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {metrics.map((metric) => (
            <Card key={metric.id} className="hover:border-primary/40 transition-all">
              <CardHeader className="pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {metric.label}
                </span>
                <CardTitle className="font-serif text-3xl font-bold text-foreground pt-1">
                  {metric.value}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                  {metric.description}
                </CardDescription>
                <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Sumber: {metric.source_name}</span>
                  <span className="font-semibold text-foreground">Tahun {metric.year}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Interactive Chart Section */}
        {chartStat && chartStat.chart_data && (
          <Card className="border-border">
            <CardHeader className="border-b border-border/60 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <Badge variant="accent" className="text-[10px] uppercase font-semibold mb-1">
                    Grafik Tren Nasional
                  </Badge>
                  <CardTitle className="font-serif text-2xl font-bold text-foreground">
                    {chartStat.label}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-1">
                    {chartStat.description}
                  </CardDescription>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <span>Sumber: {chartStat.source_name} ({chartStat.year})</span>
                  {chartStat.source_url && (
                    <a
                      href={chartStat.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-0.5"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <LiteracyTrendChart data={chartStat.chart_data} />
              <div className="mt-4 flex items-center justify-center gap-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                  Skor Indeks Kegemaran Membaca (Skala 0 - 100)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                  Titik Evaluasi Tahunan
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Facts List Section */}
        <div className="space-y-6">
          <div className="border-b border-border pb-4">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Fakta & Temuan Kunci Lapangan
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Catatan penting mengenai tantangan struktural dan perubahan lanskap bacaan di era digital.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {facts.map((fact) => (
              <div
                key={fact.id}
                className="flex flex-col justify-between rounded-md border border-border bg-white p-6 shadow-xs hover:border-primary/40 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 text-primary font-semibold text-xs mb-2">
                    <Info className="h-4 w-4" />
                    <span>{fact.label}</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {fact.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Rujukan: {fact.source_name}</span>
                  <span>{fact.year}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Note on data transparency */}
        <div className="rounded-md border border-border bg-surface p-6 text-center text-xs text-muted-foreground">
          <p>
            Masyarakat Literasi berkomitmen menyajikan data berbasis bukti.
            Seluruh angka dikompilasi dari publikasi resmi pemerintah, asosiasi penerbit,
            dan riset independen yang dapat diverifikasi secara publik.
          </p>
        </div>
      </div>
    </div>
  );
}
