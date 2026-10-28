"use client";

import * as React from "react";
import {
  Mail,
  MapPin,
  MessageSquare,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function KontakPage() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [isSent, setIsSent] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Mohon lengkapi nama, email, dan isi pesan Anda.");
      return;
    }

    const { submitContactMessageAction } = await import("@/app/actions/contact");
    const result = await submitContactMessageAction({
      name,
      email,
      subject,
      message,
    });

    if (!result.success && result.error) {
      toast.error(result.error);
    } else {
      setIsSent(true);
      toast.success("Pesan Anda telah diterima oleh Tim Redaksi. Kami akan membalas via email dalam 1x24 jam.");
    }
  };

  return (
    <div className="py-12 md:py-20 bg-background min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-16">
        {/* Header */}
        <div className="max-w-2xl">
          <Badge variant="outline" className="text-xs uppercase tracking-wider mb-2 font-semibold">
            Hubungi Kami
          </Badge>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Mari Berkolaborasi untuk Nalar Bangsa
          </h1>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            Punya gagasan tulisan, ingin mendonasikan buku ke taman bacaan desa, atau
            mengundang fasilitator pelatihan berpikir kritis di sekolah Anda? Kami siap mendengar.
          </p>
        </div>

        {/* Main Grid: Form & Info */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-lg border border-border bg-white p-6 sm:p-8 shadow-xs">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                Kirim Pesan ke Redaksi
              </h2>

              {isSent ? (
                <div className="rounded-md border border-emerald-200 bg-emerald-50 p-6 text-center space-y-3">
                  <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
                  <h3 className="font-serif text-xl font-bold text-emerald-900">
                    Pesan Berhasil Terkirim!
                  </h3>
                  <p className="text-xs text-emerald-800 leading-relaxed max-w-sm mx-auto">
                    Terima kasih telah menghubungi kami. Pesan Anda telah kami teruskan
                    ke tim kurator dan akan dibalas secepatnya.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsSent(false);
                      setName("");
                      setEmail("");
                      setSubject("");
                      setMessage("");
                    }}
                    className="mt-2 text-xs"
                  >
                    Kirim Pesan Lain
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Nama Lengkap <span className="text-destructive">*</span>
                      </label>
                      <Input
                        type="text"
                        placeholder="Contoh: Siti Rahmawati"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Alamat Email <span className="text-destructive">*</span>
                      </label>
                      <Input
                        type="email"
                        placeholder="nama@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Subjek / Topik Kerjasama
                    </label>
                    <Input
                      type="text"
                      placeholder="Contoh: Undangan Workshop Literasi Digital"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Isi Pesan <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                      rows={5}
                      placeholder="Tuliskan secara ringkas kebutuhan atau gagasan kolaborasi Anda..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>

                  {/* Honeypot hidden input */}
                  <div className="hidden" aria-hidden="true">
                    <input type="text" name="_hp_check" tabIndex={-1} autoComplete="off" />
                  </div>

                  <Button type="submit" size="lg" className="w-full gap-2">
                    <Send className="h-4 w-4" />
                    <span>Kirim Pesan Sekarang</span>
                  </Button>

                  <p className="text-[11px] text-muted-foreground text-center">
                    Kami menghormati privasi Anda. Data Anda tidak akan dibagikan ke pihak ketiga.
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Contact Details Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-lg border border-border bg-white p-6 space-y-4">
              <h3 className="font-serif text-lg font-bold text-foreground">
                Informasi Kontak Resmi
              </h3>
              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Surel Resmi</p>
                    <p className="text-muted-foreground">redaksi@masyarakatliterasi.id</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageSquare className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">WhatsApp Gateway Info</p>
                    <p className="text-muted-foreground">+62 812-3456-7890 (Hanya pesan)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Sekretariat Gerakan</p>
                    <p className="text-muted-foreground">
                      Jl. Pustaka Aksara No. 42, Menteng, Jakarta Pusat 10310
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Waktu Respon</p>
                    <p className="text-muted-foreground">Senin - Jumat: 09.00 - 17.00 WIB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mini FAQ */}
            <div className="rounded-lg border border-border bg-surface p-6 space-y-3">
              <div className="flex items-center gap-2 font-serif text-base font-bold text-foreground">
                <HelpCircle className="h-4 w-4 text-primary" />
                <span>Pertanyaan Umum (FAQ)</span>
              </div>
              <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                <div>
                  <p className="font-semibold text-foreground">
                    Apakah seluruh materi di website ini gratis?
                  </p>
                  <p>
                    Ya, 100% materi dan tantangan di Masyarakat Literasi bebas diakses tanpa pungutan biaya.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    Bagaimana cara mengirim tulisan saya?
                  </p>
                  <p>
                    Kirimkan naskah esai berbobot (600-1.200 kata) ke surel redaksi kami dengan subjek &ldquo;Pengajuan Esai Tamu&rdquo;.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
