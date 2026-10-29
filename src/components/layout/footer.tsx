"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function Footer() {
  const [whatsapp, setWhatsapp] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsapp.trim()) {
      toast.error("Mohon masukkan nomor WhatsApp yang valid.");
      return;
    }

    const { subscribeNewsletterAction } = await import("@/app/actions/subscribers");
    const result = await subscribeNewsletterAction(whatsapp);

    if (!result.success && result.error) {
      toast.error(result.error);
    } else {
      setSubscribed(true);
      toast.success("Tautan konfirmasi pendaftaran telah disiapkan untuk nomor WhatsApp Anda!");
    }
  };

  return (
    <footer className="mt-auto border-t border-border bg-surface text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand & Mission Statement */}
          <div className="space-y-4 md:col-span-5">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white">
                <BookOpen className="h-4 w-4 stroke-[1.8]" />
              </div>
              <span className="font-serif text-lg font-bold tracking-tight text-foreground">
                Rumah Literasi
              </span>
            </Link>
            <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
              Membangun budaya membaca, menulis, dan berpikir kritis di Indonesia.
              Menyediakan kurasi bahan bacaan berkualitas, panduan belajar gratis,
              dan tantangan kebiasaan membaca harian.
            </p>
            <div className="text-xs text-muted-foreground">
              Inisiatif independen nirlaba untuk kemajuan nalar bangsa.
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 md:col-span-3">
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-foreground">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/artikel" className="hover:text-primary transition-colors">
                  Artikel & Esai
                </Link>
              </li>
              <li>
                <Link href="/statistik" className="hover:text-primary transition-colors">
                  Statistik & Fakta Literasi
                </Link>
              </li>
              <li>
                <Link href="/resource" className="hover:text-primary transition-colors">
                  Resource Hub (Gratis)
                </Link>
              </li>
              <li>
                <Link href="/mulai-sekarang" className="hover:text-primary transition-colors">
                  Tantangan 7/21/30 Hari
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="hover:text-primary transition-colors">
                  Tentang & Visi Kami
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="hover:text-primary transition-colors">
                  Hubungi Tim Redaksi
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-3 md:col-span-4">
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-foreground">
              Buletin WhatsApp Literasi
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Dapatkan rangkuman artikel mingguan, tips membaca, dan rilis materi
              baru langsung di WhatsApp Anda.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>Terima kasih! Pesan verifikasi dikirim ke {whatsapp}.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="tel"
                    placeholder="Contoh: 081234567890"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="bg-white text-sm"
                  />
                  <Button type="submit" size="sm" className="shrink-0 gap-1.5">
                    <span>Daftar</span>
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Tanpa spam. Anda bisa berhenti berlangganan kapan saja dengan mengetik STOP.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row text-xs text-muted-foreground">
          <div>
            &copy; 2026 Rumah Literasi. Hak Cipta Dilindungi.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/tentang" className="hover:text-primary">
              Visi & Misi
            </Link>
            <Link href="/kontak" className="hover:text-primary">
              Kerja Sama
            </Link>
            <Link href="/admin" className="hover:text-primary font-medium">
              Akses Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
