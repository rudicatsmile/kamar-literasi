"use client";

import * as React from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  FileText,
  Clock,
  LineChart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Article } from "@/lib/dummy-data";
import { deleteArticleAction } from "@/app/actions/articles";
import { toast } from "sonner";

export function AdminArtikelListClient({
  initialArticles,
}: {
  initialArticles: Article[];
}) {
  const [articles, setArticles] = React.useState<Article[]>(initialArticles);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const filteredArticles = articles.filter((art) => {
    const matchesStatus =
      statusFilter === "all" || art.status === statusFilter;
    const matchesSearch =
      art.title.toLowerCase().includes(search.toLowerCase()) ||
      art.author_name.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Yakin ingin menghapus artikel "${title}"?`)) {
      try {
        const res = await deleteArticleAction(id);
        if (res && !res.success) {
          toast.error(res.error || "Gagal menghapus artikel.");
          return;
        }
        setArticles((prev) => prev.filter((a) => a.id !== id));
        toast.success(`Artikel "${title}" berhasil dihapus dari sistem.`);
      } catch {
        toast.error("Terjadi kendala saat menghapus artikel.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Manajemen Konten
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
            Kelola Artikel & Esai
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Daftar seluruh artikel terbit dan draf yang tersimpan di Supabase.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/analitik-bacaan">
            <Button variant="outline" className="gap-2 shadow-xs">
              <LineChart className="h-4 w-4 text-primary" />
              <span>Analitik Bacaan</span>
            </Button>
          </Link>
          <Link href="/admin/artikel/baru">
            <Button className="gap-2 shadow-xs">
              <Plus className="h-4 w-4" />
              <span>Tulis Artikel Baru</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari berdasarkan judul atau penulis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <span className="text-xs text-muted-foreground mr-1">Status:</span>
          {["all", "published", "draft"].map((st) => (
            <Button
              key={st}
              variant={statusFilter === st ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(st)}
              className="text-xs capitalize h-8"
            >
              {st === "all" ? "Semua Status" : st === "published" ? "Terbit" : "Draf"}
            </Button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-md border border-border bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-surface">
            <TableRow>
              <TableHead className="w-[45%] font-semibold text-xs text-foreground">
                Judul Artikel
              </TableHead>
              <TableHead className="font-semibold text-xs text-foreground">
                Kategori
              </TableHead>
              <TableHead className="font-semibold text-xs text-foreground">
                Status
              </TableHead>
              <TableHead className="font-semibold text-xs text-foreground">
                Waktu Baca
              </TableHead>
              <TableHead className="text-right font-semibold text-xs text-foreground">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredArticles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-xs text-muted-foreground">
                  Tidak ada artikel yang sesuai dengan kriteria pencarian.
                </TableCell>
              </TableRow>
            ) : (
              filteredArticles.map((art) => (
                <TableRow key={art.id} className="hover:bg-muted/40 transition-colors">
                  <TableCell className="py-4">
                    <div className="space-y-1">
                      <p className="font-serif font-bold text-sm text-foreground line-clamp-1">
                        {art.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Slug: /{art.slug} • Oleh: {art.author_name}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">
                      {art.category_name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={art.status === "published" ? "success" : "secondary"}
                      className="text-[10px] capitalize"
                    >
                      {art.status === "published" ? "Terbit" : "Draf"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{art.reading_time} menit</span>
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {art.status === "published" && (
                        <Link href="/admin/analitik-bacaan" title="Lihat Analitik Bacaan">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                            <LineChart className="h-3.5 w-3.5" />
                            <span className="sr-only">Analitik Bacaan</span>
                          </Button>
                        </Link>
                      )}
                      {art.status === "published" && (
                        <Link href={`/artikel/${art.slug}`} target="_blank">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <Eye className="h-3.5 w-3.5" />
                            <span className="sr-only">Pratinjau</span>
                          </Button>
                        </Link>
                      )}
                      <Link href={`/admin/artikel/${art.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                          <Edit2 className="h-3.5 w-3.5" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(art.id, art.title)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only">Hapus</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
