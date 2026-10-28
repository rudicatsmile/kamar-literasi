"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bookmark,
  Trash2,
  ExternalLink,
  BookOpen,
  ArrowRight,
  FileText,
  Wrench,
  Book,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Resource } from "@/lib/dummy-data";
import { toggleFavoriteResourceAction } from "@/app/actions/resources";
import { toast } from "sonner";

export function MemberFavoritClientList({
  initialResources,
}: {
  initialResources: Resource[];
}) {
  const [resources, setResources] = React.useState<Resource[]>(initialResources);

  const handleRemove = async (id: string, title: string) => {
    try {
      const res = await toggleFavoriteResourceAction(id);
      if (res && !res.success) {
        toast.error(res.error || "Gagal menghapus favorit.");
        return;
      }
      setResources((prev) => prev.filter((item) => item.id !== id));
      toast.info(`"${title}" telah dihapus dari koleksi favorit.`);
    } catch {
      toast.error("Terjadi kendala saat menghapus favorit.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Koleksi Pribadi
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
            Resource & Materi Favorit
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Materi belajar, panduan PDF, dan perangkat yang Anda simpan untuk dibaca kembali.
          </p>
        </div>

        <Link href="/resource">
          <Button variant="outline" className="gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Jelajahi Resource Lain</span>
          </Button>
        </Link>
      </div>

      {/* Grid of Saved Resources */}
      {resources.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-white p-12 text-center space-y-4">
          <Bookmark className="mx-auto h-10 w-10 text-muted-foreground opacity-40" />
          <h3 className="font-serif text-xl font-bold text-foreground">
            Belum Ada Materi yang Disimpan
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Anda dapat menyimpan buku, panduan PDF, atau alat cek fakta dari Resource Hub
            untuk akses cepat kapan saja.
          </p>
          <Link href="/resource">
            <Button size="sm" className="mt-2 gap-2">
              <span>Buka Katalog Resource Hub</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((res) => (
            <Card
              key={res.id}
              className="flex flex-col justify-between hover:border-primary/40 transition-colors shadow-xs"
            >
              <CardContent className="p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                    {res.type === "pdf" && <FileText className="h-3 w-3 mr-1 text-rose-600" />}
                    {res.type === "tool" && <Wrench className="h-3 w-3 mr-1 text-sky-600" />}
                    {res.type === "book" && <Book className="h-3 w-3 mr-1 text-emerald-600" />}
                    {res.type}
                  </Badge>
                  <Badge variant="secondary" className="capitalize text-[10px]">
                    {res.age_category}
                  </Badge>
                </div>

                <Link href={`/resource/${res.slug}`}>
                  <h3 className="font-serif text-lg font-bold text-foreground hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {res.title}
                  </h3>
                </Link>

                <p className="mt-2 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {res.description}
                </p>

                <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
                  <Link href={`/resource/${res.slug}`}>
                    <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                      <span>Buka Materi</span>
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </Link>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(res.id, res.title)}
                    className="h-8 text-xs text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="sr-only">Hapus</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
