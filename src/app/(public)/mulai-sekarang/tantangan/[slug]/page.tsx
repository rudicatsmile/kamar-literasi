import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Flame,
  CheckCircle,
  Clock,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getChallengeBySlug, getChallenges } from "@/lib/data";
import { JoinChallengeButton } from "./join-challenge-button";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export async function generateStaticParams() {
  const challenges = await getChallenges();
  return challenges.map((challenge) => ({
    slug: challenge.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const challenge = await getChallengeBySlug(slug);

  if (!challenge) {
    return {
      title: "Tantangan Tidak Ditemukan - Masyarakat Literasi",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rumahliterasi.web.id";
  const url = `${baseUrl}/mulai-sekarang/tantangan/${challenge.slug}`;

  return {
    title: `${challenge.title} (${challenge.duration_days} Hari) - Masyarakat Literasi`,
    description: challenge.description,
    openGraph: {
      title: challenge.title,
      description: challenge.description,
      url,
      siteName: "Masyarakat Literasi",
      images: [
        {
          url: challenge.cover_url,
          width: 1200,
          height: 630,
          alt: challenge.title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: challenge.title,
      description: challenge.description,
      images: [challenge.cover_url],
    },
  };
}

export default async function DetailTantanganPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const challenge = await getChallengeBySlug(slug);

  if (!challenge) {
    return notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rumahliterasi.web.id";

  return (
    <div className="py-12 md:py-20 bg-background min-h-screen">
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", url: baseUrl },
          { name: "Mulai Sekarang", url: `${baseUrl}/mulai-sekarang` },
          { name: challenge.title, url: `${baseUrl}/mulai-sekarang/tantangan/${challenge.slug}` },
        ]}
      />
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/mulai-sekarang"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Daftar Tantangan</span>
          </Link>
        </div>

        {/* Hero Card */}
        <div className="rounded-xl border border-border bg-white overflow-hidden shadow-xs">
          <div className="relative aspect-21/9 overflow-hidden bg-muted">
            <img
              src={challenge.cover_url}
              alt={challenge.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <Badge variant="accent" className="font-bold text-sm shadow-sm">
                Program {challenge.duration_days} Hari
              </Badge>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                {challenge.title}
              </h1>
              <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                {challenge.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-border">
              <div className="flex items-center gap-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <Flame className="h-4 w-4 text-amber-600 fill-amber-500" />
                  {challenge.participants_count} Peserta Aktif
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary" />
                  {challenge.duration_days} Hari Berturut-turut
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Check-in Refleksi 1x Sehari
                </span>
              </div>

              <JoinChallengeButton challenge={challenge} />
            </div>
          </div>
        </div>

        {/* Daily Schedule Syllabus */}
        <div className="mt-12 space-y-6">
          <div className="border-b border-border pb-4">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Silabus Jadwal Harian ({challenge.days.length} Hari)
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Setiap hari memiliki target tugas bacaan yang terukur dan aplikatif.
            </p>
          </div>

          <div className="space-y-3">
            {challenge.days.map((day) => (
              <div
                key={day.id}
                className="flex items-start gap-4 rounded-md border border-border bg-white p-5 transition-all hover:border-primary/40 shadow-xs"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary text-primary font-bold text-xs border border-border">
                  H-{day.day_number}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-base font-semibold text-foreground">
                      {day.task_title}
                    </h3>
                    <Badge variant="outline" className="text-[10px]">
                      Hari ke-{day.day_number}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {day.task_description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 rounded-lg border border-primary/20 bg-primary/5 p-8 text-center space-y-4">
          <h3 className="font-serif text-2xl font-bold text-foreground">
            Siap Membangun Kebiasaan Baru Hari Ini?
          </h3>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Bergabunglah sekarang. Tanpa biaya, tanpa ikatan, cukup 10-15 menit komitmen
            waktu harian Anda untuk pikiran yang lebih merdeka.
          </p>
          <div className="pt-2">
            <JoinChallengeButton challenge={challenge} />
          </div>
        </div>
      </div>
    </div>
  );
}
