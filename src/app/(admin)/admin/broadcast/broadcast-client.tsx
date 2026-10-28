"use client";

import * as React from "react";
import {
  Send,
  Users,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Broadcast } from "@/lib/dummy-data";
import { sendBroadcastAction } from "@/app/actions/broadcasts";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AdminBroadcastClientProps {
  initialBroadcasts: Broadcast[];
  activeSubscribersCount: number;
}

export function AdminBroadcastClient({
  initialBroadcasts,
  activeSubscribersCount,
}: AdminBroadcastClientProps) {
  const router = useRouter();
  const [broadcasts, setBroadcasts] = React.useState<Broadcast[]>(initialBroadcasts);
  const [title, setTitle] = React.useState("");
  const [message, setMessage] = React.useState(
    "Halo Sahabat Literasi! Jangan lewatkan esai pilihan pekan ini tentang membangun nalar kritis keluarga di era informasi cepat. Baca selengkapnya di https://masyarakatliterasi.id"
  );
  const [isSending, setIsSending] = React.useState(false);

  React.useEffect(() => {
    setBroadcasts(initialBroadcasts);
  }, [initialBroadcasts]);

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.error("Judul dan isi pesan broadcast wajib diisi.");
      return;
    }

    setIsSending(true);
    try {
      const res = await sendBroadcastAction(title.trim(), message.trim());
      if (res && !res.success) {
        toast.error(res.error || "Gagal mengirimkan broadcast.");
        return;
      }

      toast.success(
        res?.message ||
          `Siaran WhatsApp "${title}" berhasil dikirim ke nomor subscriber aktif!`
      );
      setTitle("");
      router.refresh();
    } catch {
      toast.error("Terjadi kendala saat mengirimkan broadcast.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          WhatsApp Gateway
        </span>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
          Kirim Broadcast WhatsApp Massal
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kirim pesan buletin, kurasi esai terbaru, atau pengumuman tantangan ke seluruh subscriber aktif.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Form: Compose Message */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-border shadow-xs">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="font-serif text-lg font-bold">
                Tulis Pesan Siaran
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Pesan akan dikirim menggunakan jeda antrean (rate-limiting) untuk mencegah pemblokiran.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleSendBroadcast} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Judul Kampanye / Subjek Internal <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Contoh: Buletin Literasi Pekan ke-4 Oktober"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground">
                      Isi Pesan WhatsApp <span className="text-destructive">*</span>
                    </label>
                    <span className="text-[11px] text-muted-foreground">
                      {message.length} Karakter
                    </span>
                  </div>
                  <Textarea
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="font-mono text-xs leading-relaxed"
                  />
                  <div className="rounded-md border border-amber-200 bg-amber-50/70 p-2.5 text-[11px] text-amber-900 leading-relaxed">
                    Sistem otomatis menambahkan catatan footer:{" "}
                    <em>&ldquo;Ketik STOP untuk berhenti berlangganan&rdquo;</em> di akhir setiap pesan.
                  </div>
                </div>

                {/* Target Audience Summary */}
                <div className="rounded-md border border-border bg-surface p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold text-foreground">
                      Estimasi Penerima Aktif:
                    </span>
                  </div>
                  <Badge variant="accent" className="font-bold text-xs">
                    {activeSubscribersCount} Nomor Terverifikasi
                  </Badge>
                </div>

                <Button
                  type="submit"
                  disabled={isSending || activeSubscribersCount === 0}
                  className="w-full gap-2 font-semibold"
                >
                  <Send className="h-4 w-4" />
                  <span>
                    {isSending
                      ? "Mengantrekan Siaran..."
                      : `Kirim Broadcast ke ${activeSubscribersCount} Penerima`}
                  </span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Info: WhatsApp Live Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-lg border border-border bg-white p-5 shadow-xs space-y-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
              Pratinjau Tampilan Pesan WhatsApp
            </span>
            <div className="rounded-md bg-emerald-50 border border-emerald-200 p-4 space-y-2 text-xs text-foreground shadow-xs">
              <div className="font-semibold text-emerald-900 border-b border-emerald-200 pb-1 flex items-center justify-between">
                <span>Masyarakat Literasi Official</span>
                <span className="text-[10px] text-muted-foreground">Sekarang</span>
              </div>
              <p className="whitespace-pre-wrap leading-relaxed text-[12px]">
                {message || "Pratinjau pesan Anda akan tampil di sini..."}
              </p>
              <p className="text-[10px] text-muted-foreground italic pt-2 border-t border-emerald-200">
                Balas STOP untuk berhenti berlangganan
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast History Table */}
      <div className="space-y-4 pt-6 border-t border-border">
        <h3 className="font-serif text-xl font-bold text-foreground">
          Riwayat Siaran WhatsApp Sebelumnya
        </h3>

        <div className="rounded-md border border-border bg-white shadow-xs overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-surface/50">
                <TableHead className="font-serif font-bold text-foreground">
                  Judul Broadcast
                </TableHead>
                <TableHead className="font-serif font-bold text-foreground">
                  Total Penerima
                </TableHead>
                <TableHead className="font-serif font-bold text-foreground">
                  Status Antrean
                </TableHead>
                <TableHead className="font-serif font-bold text-foreground">
                  Waktu Kirim
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {broadcasts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-sm text-muted-foreground">
                    Belum ada riwayat broadcast yang dikirim.
                  </TableCell>
                </TableRow>
              ) : (
                broadcasts.map((bc) => (
                  <TableRow key={bc.id}>
                    <TableCell>
                      <p className="font-serif font-semibold text-foreground text-sm">
                        {bc.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-sm">
                        {bc.message}
                      </p>
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-foreground">
                      {bc.total_recipients?.toLocaleString("id-ID") || 0} Nomor
                    </TableCell>
                    <TableCell>
                      <Badge variant="success" className="text-[10px] gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Terkirim Selesai
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {bc.sent_at
                        ? new Date(bc.sent_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
