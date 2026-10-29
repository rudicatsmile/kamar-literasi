"use client";

import * as React from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function FooterNewsletter() {
  const [whatsapp, setWhatsapp] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsapp.trim()) {
      toast.error("Mohon masukkan nomor WhatsApp yang valid.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { subscribeNewsletterAction } = await import("@/app/actions/subscribers");
      const result = await subscribeNewsletterAction(whatsapp);

      if (!result.success && result.error) {
        toast.error(result.error);
      } else {
        setSubscribed(true);
        toast.success("Tautan konfirmasi pendaftaran telah disiapkan untuk nomor WhatsApp Anda!");
      }
    } catch {
      toast.error("Terjadi kendala saat mendaftar buletin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
              disabled={isSubmitting}
              className="bg-white text-sm"
            />
            <Button type="submit" size="sm" disabled={isSubmitting} className="shrink-0 gap-1.5">
              <span>{isSubmitting ? "..." : "Daftar"}</span>
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Tanpa spam. Anda bisa berhenti berlangganan kapan saja dengan mengetik STOP.
          </p>
        </form>
      )}
    </div>
  );
}
