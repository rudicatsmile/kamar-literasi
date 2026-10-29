import * as React from "react";
import Link from "next/link";
import {
  FileText,
  Users,
  Trophy,
  Send,
  MessageSquare,
  UserCog,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAdminMetricsData } from "@/lib/data";

export default async function AdminDashboardPage() {
  const {
    totalArticles,
    publishedArticles,
    activeSubscribers,
    totalSubscribers,
    unreadMessages,
    totalParticipants,
    recentArticles,
    recentSubscribers,
  } = await getAdminMetricsData();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Ringkasan Sistem
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
            Dasbor Utama Redaksi
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pantau metrik publikasi artikel, audiens buletin WhatsApp, dan pesan masuk.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/pengguna">
            <Button variant="outline" size="sm" className="gap-1.5">
              <UserCog className="h-4 w-4" />
              <span>Kelola Pengguna</span>
            </Button>
          </Link>
          <Link href="/admin/artikel/baru">
            <Button size="sm" className="gap-1.5">
              <FileText className="h-4 w-4" />
              <span>Tulis Artikel Baru</span>
            </Button>
          </Link>
          <Link href="/admin/broadcast">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Send className="h-4 w-4" />
              <span>Kirim Broadcast</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:border-primary/40 transition-colors shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">Artikel Terbit</p>
              <h3 className="font-serif text-2xl font-bold text-foreground">
                {publishedArticles} / {totalArticles}
              </h3>
              <p className="text-[10px] text-emerald-700">Konten Database Supabase</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
              <FileText className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/40 transition-colors shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">Subscriber WhatsApp</p>
              <h3 className="font-serif text-2xl font-bold text-foreground">
                {activeSubscribers} Aktif
              </h3>
              <p className="text-[10px] text-muted-foreground">
                Total {totalSubscribers} pendaftar
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-sky-50 text-sky-700">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/40 transition-colors shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">Peserta Tantangan</p>
              <h3 className="font-serif text-2xl font-bold text-foreground">
                {totalParticipants.toLocaleString("id-ID")}
              </h3>
              <p className="text-[10px] text-amber-700">Program Terbuka</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-amber-50 text-amber-700">
              <Trophy className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/40 transition-colors shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">Pesan Masuk Belum Dibaca</p>
              <h3 className="font-serif text-2xl font-bold text-foreground">
                {unreadMessages} Pesan
              </h3>
              <p className="text-[10px] text-purple-700">Formulir Kontak Publik</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-purple-50 text-purple-700">
              <MessageSquare className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Navigation */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Recent Articles Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-foreground">
              Artikel Terbaru di Sistem
            </h3>
            <Link
              href="/admin/artikel"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Kelola Semua ({totalArticles})
            </Link>
          </div>

          <div className="rounded-md border border-border bg-white divide-y divide-border shadow-xs">
            {recentArticles.length > 0 ? (
              recentArticles.map((art: any) => (
                <div key={art.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">
                        {art.category_name}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {art.reading_time} mnt baca
                      </span>
                      <Badge
                        variant={art.status === "published" ? "success" : "secondary"}
                        className="text-[10px]"
                      >
                        {art.status === "published" ? "Terbit" : "Draf"}
                      </Badge>
                    </div>
                    <h4 className="font-serif text-sm font-semibold text-foreground truncate">
                      {art.title}
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      Dibuat: {new Date(art.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <Link href={`/admin/artikel/${art.id}/edit`}>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      Edit
                    </Button>
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-muted-foreground">
                Belum ada artikel. Klik &quot;Tulis Artikel Baru&quot; untuk menambahkan.
              </div>
            )}
          </div>
        </div>

        {/* Recent Subscribers Log */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-foreground">
              Pendaftar Newsletter Terbaru
            </h3>
            <Link
              href="/admin/subscriber"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Kelola Semua ({totalSubscribers})
            </Link>
          </div>

          <div className="space-y-3">
            {recentSubscribers.length > 0 ? (
              recentSubscribers.map((sub: any) => (
                <div
                  key={sub.id}
                  className="rounded-md border border-border bg-white p-4 space-y-2 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={sub.status === "active" ? "success" : "secondary"}
                      className="text-[10px]"
                    >
                      {sub.status === "active" ? "Aktif" : "Menunggu"}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(sub.created_at).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                  <h4 className="font-serif text-sm font-bold text-foreground">
                    {sub.name || "Anonim"}
                  </h4>
                  <p className="text-xs text-muted-foreground">{sub.whatsapp}</p>
                </div>
              ))
            ) : (
              <div className="rounded-md border border-dashed border-border bg-white p-6 text-center text-xs text-muted-foreground">
                Belum ada subscriber terdaftar.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
