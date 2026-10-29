"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Phone, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { unsubscribeAction } from "@/app/actions/subscribers";
import { toast } from "sonner";

export default function BerhentiLanggananPage() {
  const [whatsapp, setWhatsapp] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [unsubscribed, setUnsubscribed] = React.useState(false);

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsapp.trim()) {
      toast.error("Mohon masukkan nomor WhatsApp yang ingin berhenti berlangganan.");
      return;
    }

    setLoading(true);
    try {
      const res = await unsubscribeAction(whatsapp.trim());
      if (res && !res.success) {
        toast.error(res.error || "Gagal memproses permohonan berhenti langganan.");
        return;
      }

      setUnsubscribed(true);
      toast.success("Nomor WhatsApp Anda berhasil dihentikan dari penerimaan siaran buletin.");
    } catch {
      toast.error("Terjadi kendala jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 md:py-24 bg-background min-h-screen flex items-center justify-center">
      <div className="mx-auto max-w-md px-4 sm:px-6 w-full">
        <div className="rounded-xl border border-border bg-white p-8 text-center shadow-xs space-y-6">
          {unsubscribed ? (
            <div className="space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-primary">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-foreground">
                Berhenti Berlangganan Berhasil
              </h1>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Nomor Anda tidak akan lagi menerima pesan siaran buletin berkala dari Rumah Literasi. Terima kasih telah sempat menjadi bagian dari kami.
              </p>
              <div className="pt-2">
                <Link href="/">
                  <Button variant="outline" className="w-full gap-2 text-xs">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Kembali ke Beranda</span>
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUnsubscribe} className="space-y-4 text-left">
              <div className="text-center space-y-2">
                <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                  Privasi & Hak Pengguna
                </Badge>
                <h1 className="font-serif text-2xl font-bold text-foreground">
                  Berhenti Berlangganan WhatsApp
                </h1>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Masukkan nomor WhatsApp yang terdaftar untuk mencabut izin pengiriman pesan buletin kami kapan saja.
                </p>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-foreground">
                  Nomor WhatsApp Terdaftar
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="081234567890"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="pl-9 text-sm"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                variant="destructive"
                className="w-full gap-2 text-xs font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <span>Konfirmasi Berhenti Berlangganan</span>
                )}
              </Button>

              <div className="text-center pt-2">
                <Link
                  href="/"
                  className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                >
                  <ArrowLeft className="h-3 w-3" />
                  <span>Batal dan Kembali</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
