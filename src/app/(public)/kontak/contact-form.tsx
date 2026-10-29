"use client";

import * as React from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { submitContactMessageAction } from "@/app/actions/contact";

export function ContactForm() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [isSent, setIsSent] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Mohon lengkapi nama, email, dan isi pesan Anda.");
      return;
    }

    setIsSubmitting(true);
    try {
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
        toast.success(
          "Pesan Anda telah diterima oleh Tim Redaksi. Kami akan membalas via email dalam 1x24 jam."
        );
      }
    } catch {
      toast.error("Terjadi kendala saat mengirim pesan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
            Terima kasih telah menghubungi kami. Pesan Anda telah kami teruskan ke
            tim kurator dan akan dibalas secepatnya.
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
                placeholder="Contoh: Rudi Kurniawan"
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
            <input
              type="text"
              name="_hp_check"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Mengirim Pesan...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Kirim Pesan Sekarang</span>
              </>
            )}
          </Button>

          <p className="text-[11px] text-muted-foreground text-center">
            Kami menghormati privasi Anda. Data Anda tidak akan dibagikan ke pihak ketiga.
          </p>
        </form>
      )}
    </div>
  );
}
