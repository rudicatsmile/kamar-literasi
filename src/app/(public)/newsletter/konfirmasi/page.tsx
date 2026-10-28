import * as React from "react";
import Link from "next/link";
import { CheckCircle2, AlertCircle, ArrowRight, BookOpen, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { confirmSubscriptionAction } from "@/app/actions/subscribers";

export const dynamic = "force-dynamic";

export default async function KonfirmasiNewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  let isSuccess = false;
  let errorMessage = "";
  let subscriberInfo: { whatsapp?: string; name?: string } | null = null;

  if (!token) {
    isSuccess = false;
    errorMessage = "Token verifikasi tidak ditemukan pada tautan ini.";
  } else {
    const res = await confirmSubscriptionAction(token);
    if (res.success) {
      isSuccess = true;
      subscriberInfo = res.subscriber || null;
    } else {
      isSuccess = false;
      errorMessage = res.error || "Gagal memverifikasi langganan.";
    }
  }

  return (
    <div className="py-16 md:py-24 bg-background min-h-screen flex items-center justify-center">
      <div className="mx-auto max-w-lg px-4 sm:px-6 w-full">
        {isSuccess ? (
          <div className="rounded-xl border border-primary/20 bg-white p-8 sm:p-10 text-center shadow-sm space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <div className="space-y-2">
              <Badge variant="success" className="text-xs uppercase font-semibold">
                Double Opt-in Terverifikasi
              </Badge>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Selamat Datang di Buletin Masyarakat Literasi!
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Nomor WhatsApp Anda ({subscriberInfo?.whatsapp ? `+${subscriberInfo.whatsapp}` : "terdaftar"}) telah aktif dan diverifikasi secara resmi.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-surface p-4 text-left text-xs space-y-2 text-muted-foreground leading-relaxed">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Apa yang Akan Anda Terima?</span>
              </div>
              <ul className="space-y-1.5 list-disc list-inside">
                <li>Kurasi 1 esai mendalam setiap Sabtu pagi pukul 08.00 WIB.</li>
                <li>Rekomendasi lembar kerja & perkakas nalar kritis bebas biaya.</li>
                <li>Bebas spam: Anda dapat berhenti berlangganan kapan saja cukup dengan mengetik <strong>STOP</strong>.</li>
              </ul>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link href="/artikel" className="flex-1">
                <Button className="w-full gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Jelajahi Artikel Pilihan</span>
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  Ke Beranda
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-rose-200 bg-white p-8 sm:p-10 text-center shadow-sm space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <AlertCircle className="h-9 w-9" />
            </div>

            <div className="space-y-2">
              <Badge variant="destructive" className="text-xs uppercase font-semibold">
                Verifikasi Gagal
              </Badge>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Tautan Tidak Valid atau Kedaluwarsa
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {errorMessage}
              </p>
            </div>

            <p className="text-xs text-muted-foreground">
              Jika Anda ingin mendaftar ulang, silakan masukkan kembali nomor WhatsApp Anda di halaman pendaftaran buletin.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link href="/newsletter" className="flex-1">
                <Button className="w-full gap-2">
                  <span>Daftar Ulang Buletin</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  Kembali ke Beranda
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
