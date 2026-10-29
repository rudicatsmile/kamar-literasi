"use client";

import * as React from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Resource } from "@/lib/dummy-data";
import { saveResourceAction, deleteResourceAction } from "@/app/actions/resources";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AdminResourceClient({ initialResources }: { initialResources: Resource[] }) {
  const router = useRouter();
  const [resources, setResources] = React.useState<Resource[]>(initialResources);
  const [search, setSearch] = React.useState("");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingRes, setEditingRes] = React.useState<Resource | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    setResources(initialResources);
  }, [initialResources]);

  // Form State
  const [title, setTitle] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [type, setType] = React.useState<"book" | "tool" | "pdf">("pdf");
  const [ageCategory, setAgeCategory] = React.useState<
    "anak" | "remaja" | "dewasa" | "semua"
  >("semua");
  const [publisher, setPublisher] = React.useState("");
  const [coverUrl, setCoverUrl] = React.useState("");
  const [externalUrl, setExternalUrl] = React.useState("");
  const [filePath, setFilePath] = React.useState("");

  const filteredResources = resources.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.publisher.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingRes(null);
    setTitle("");
    setSlug("");
    setDescription("");
    setType("pdf");
    setAgeCategory("semua");
    setPublisher("");
    setCoverUrl(
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop"
    );
    setExternalUrl("");
    setFilePath("/docs/sample.pdf");
    setModalOpen(true);
  };

  const handleOpenEdit = (res: Resource) => {
    setEditingRes(res);
    setTitle(res.title);
    setSlug(res.slug);
    setDescription(res.description);
    setType(res.type);
    setAgeCategory(res.age_category);
    setPublisher(res.publisher);
    setCoverUrl(res.cover_url);
    setExternalUrl(res.external_url || "");
    setFilePath(res.file_path || "");
    setModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingRes) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !description) {
      toast.error("Mohon lengkapi judul, slug, dan deskripsi materi.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await saveResourceAction({
        id: editingRes?.id,
        title,
        slug,
        description,
        type,
        age_category: ageCategory,
        publisher: publisher || "Rumah Literasi",
        cover_url: coverUrl,
        external_url: externalUrl || undefined,
        file_path: filePath || undefined,
      });

      if (res && !res.success) {
        toast.error(res.error || "Gagal menyimpan resource.");
        return;
      }

      if (editingRes) {
        setResources(
          resources.map((r) =>
            r.id === editingRes.id
              ? {
                ...r,
                title,
                slug,
                description,
                type,
                age_category: ageCategory,
                publisher: publisher || "Rumah Literasi",
                cover_url: coverUrl,
                external_url: externalUrl || undefined,
                file_path: filePath || undefined,
              }
              : r
          )
        );
        toast.success(`Resource "${title}" berhasil diperbarui!`);
      } else {
        toast.success(`Resource baru "${title}" berhasil ditambahkan!`);
      }

      router.refresh();
      setModalOpen(false);
    } catch {
      toast.error("Terjadi kendala saat menyimpan resource.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Yakin ingin menghapus materi "${title}"?`)) {
      try {
        const res = await deleteResourceAction(id);
        if (res && !res.success) {
          toast.error(res.error || "Gagal menghapus resource.");
          return;
        }

        setResources(resources.filter((r) => r.id !== id));
        router.refresh();
        toast.success(`Materi "${title}" berhasil dihapus.`);
      } catch {
        toast.error("Terjadi kendala saat menghapus resource.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Repositori Publik
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
            Kelola Resource Hub
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Daftar buku rekomendasi, dokumen PDF edukatif, dan perkakas nalar terbuka.
          </p>
        </div>

        <Button onClick={handleOpenAdd} className="gap-2 shadow-xs">
          <Plus className="h-4 w-4" />
          <span>Tambah Resource Baru</span>
        </Button>
      </div>

      {/* Search Input */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Cari materi atau penerbit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 text-xs"
        />
      </div>

      {/* Table */}
      <div className="rounded-md border border-border bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface/50">
              <TableHead className="font-serif font-bold text-foreground">
                Judul & Penerbit
              </TableHead>
              <TableHead className="font-serif font-bold text-foreground">
                Format
              </TableHead>
              <TableHead className="font-serif font-bold text-foreground">
                Target Usia
              </TableHead>
              <TableHead className="font-serif font-bold text-foreground">
                Unduhan / Akses
              </TableHead>
              <TableHead className="text-right font-serif font-bold text-foreground">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResources.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-sm text-muted-foreground">
                  Belum ada resource yang ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filteredResources.map((res) => (
                <TableRow key={res.id}>
                  <TableCell>
                    <p className="font-serif font-semibold text-foreground text-sm">
                      {res.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Penerbit: {res.publisher}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                      {res.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize text-xs text-muted-foreground">
                    {res.age_category}
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-foreground">
                    {res.download_count?.toLocaleString("id-ID") || 0}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(res)}
                        className="h-8 w-8 p-0"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4 text-primary" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(res.id, res.title)}
                        className="h-8 w-8 p-0 text-destructive hover:bg-red-50"
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingRes ? "Edit Resource" : "Tambah Resource Baru"}
            </DialogTitle>
            <DialogDescription>
              Isi metadata materi belajar untuk katalog publik.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Judul Materi <span className="text-destructive">*</span>
              </label>
              <Input
                type="text"
                placeholder="Contoh: Panduan Literasi Anak Usia Dini"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Format Materi
                </label>
                <Select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                >
                  <option value="pdf">Dokumen PDF</option>
                  <option value="tool">Alat / Platform Web</option>
                  <option value="book">Buku Rekomendasi</option>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Kelompok Usia
                </label>
                <Select
                  value={ageCategory}
                  onChange={(e) => setAgeCategory(e.target.value as any)}
                >
                  <option value="semua">Semua Usia</option>
                  <option value="anak">Anak (PAUD - SD)</option>
                  <option value="remaja">Remaja (SMP - SMA)</option>
                  <option value="dewasa">Dewasa & Umum</option>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Penerbit / Sumber Institusi
              </label>
              <Input
                type="text"
                placeholder="Contoh: Pusat Kurikulum dan Perbukuan"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Deskripsi Lengkap
              </label>
              <Textarea
                rows={3}
                placeholder="Penjelasan manfaat dan cara memakai materi ini..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {type === "pdf" ? (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Path File PDF (Supabase Storage)
                </label>
                <Input
                  type="text"
                  placeholder="/docs/panduan.pdf"
                  value={filePath}
                  onChange={(e) => setFilePath(e.target.value)}
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  URL Tautan Eksternal
                </label>
                <Input
                  type="url"
                  placeholder="https://..."
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                />
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setModalOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan Resource"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
