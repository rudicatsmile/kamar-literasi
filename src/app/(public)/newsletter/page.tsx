"use client";

import * as React from "react";
import Link from "next/link";
import {
  Send,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Lock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function NewsletterPage() {
  const [whatsapp, setWhatsapp] = React.useState("");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsapp.trim()) {
      toast.error("Nomor WhatsApp wajib diisi.");
      return;
    }

    const { subscribeNewsletterAction } = await import("@/app/actions/subscribers");
    const result = await subscribeNewsletterAction(whatsapp, name, email);

    if (!result.success && result.error) {
      toast.error(result.error);
    } else {
      setIsSubmitted(true);
      toast.success("Pendaftaran berhasil! Pesan konfirmasi telah dikirim ke WhatsApp Anda.");
    }
  };

  return (
    <div className="py-12 md:py-20 bg-background min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <Badge variant="accent" className="text-xs uppercase tracking-wider font-semibold">
            Saluran Edukasi WhatsApp
          </Badge>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Buletin Literasi Mingguan Langsung di Ponsel Anda
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Dapatkan sari pati bacaan berkualitas, rangkuman rilis buku terbaru, serta
            panduan mendidik anak gemar membaca—dikirim santai tanpa membebani memori ponsel.
          </p>
        </div>

        {/* Subscription Form Card */}
        <div className="max-w-xl mx-auto">
          <div className="rounded-xl border border-border bg-white p-6 sm:p-10 shadow-sm">
            {isSubmitted ? (
              <div className="text-center space-y-4 py-4">
                <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground">
                  Satu Langkah Lagi!
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Kami telah mengirim pesan konfirmasi (Double Opt-In) ke nomor WhatsApp{" "}
                  <strong className="text-foreground">{whatsapp}</strong>.
                  Silakan buka WhatsApp Anda dan klik tautan konfirmasi untuk mengaktifkan langganan buletin.
                </p>
                <div className="pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsSubmitted(false);
                      setWhatsapp("");
                      setName("");
                      setEmail("");
                    }}
                    className="text-xs"
                  >
                    Daftarkan Nomor Lain
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Nomor WhatsApp Aktif <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="tel"
                    placeholder="Contoh: 081234567890 atau +62812..."
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    required
                    className="h-11 text-sm"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Format Indonesia (diawali 08... atau +62...).
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Nama Lengkap / Panggilan
                  </label>
                  <Input
                    type="text"
                    placeholder="Contoh: Siti"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Alamat Email (Opsional)
                  </label>
                  <Input
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 text-sm"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full gap-2 text-base font-semibold">
                  <Send className="h-4 w-4" />
                  <span>Daftar Buletin Sekarang</span>
                </Button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground pt-2">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Privasi dijamin. Berhenti kapan saja cukup balas &ldquo;STOP&rdquo;.</span>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Step-by-Step Flow Explanation (Bab 6 Bagian F) */}
        <div className="space-y-8 pt-8 border-t border-border">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Alur Verifikasi Aman (Double Opt-In)
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Menjaga kenyamanan nomor Anda dan memastikan Anda hanya menerima pesan yang Anda inginkan.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
            <div className="rounded-md border border-border bg-white p-5 space-y-2 text-center shadow-xs">
              <span className="flex h-8 w-8 mx-auto items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                1
              </span>
              <h4 className="font-serif text-sm font-bold text-foreground">Isi Nomor WhatsApp</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Masukkan nomor Anda pada formulir di atas.
              </p>
            </div>

            <div className="rounded-md border border-border bg-white p-5 space-y-2 text-center shadow-xs">
              <span className="flex h-8 w-8 mx-auto items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                2
              </span>
              <h4 className="font-serif text-sm font-bold text-foreground">Terima Konfirmasi</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Sistem mengirimkan pesan sambutan dan tautan validasi.
              </p>
            </div>

            <div className="rounded-md border border-border bg-white p-5 space-y-2 text-center shadow-xs">
              <span className="flex h-8 w-8 mx-auto items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                3
              </span>
              <h4 className="font-serif text-sm font-bold text-foreground">Klik Verifikasi</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Konfirmasi nomor Anda agar status menjadi aktif.
              </p>
            </div>

            <div className="rounded-md border border-border bg-white p-5 space-y-2 text-center shadow-xs">
              <span className="flex h-8 w-8 mx-auto items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                4
              </span>
              <h4 className="font-serif text-sm font-bold text-foreground">Menerima Buletin</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Nikmati buletin bergizi setiap pekan langsung di genggaman.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
