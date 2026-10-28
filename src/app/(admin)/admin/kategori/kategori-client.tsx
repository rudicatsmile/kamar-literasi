"use client";

import * as React from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Category } from "@/lib/dummy-data";
import { saveCategoryAction, deleteCategoryAction } from "@/app/actions/categories";
import { toast } from "sonner";

export interface CategoryWithCount extends Category {
  article_count?: number;
}

export function AdminKategoriClient({
  initialCategories,
}: {
  initialCategories: CategoryWithCount[];
}) {
  const [categories, setCategories] =
    React.useState<CategoryWithCount[]>(initialCategories);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] =
    React.useState<CategoryWithCount | null>(null);

  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryWithCount) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
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
    if (!name || !slug) {
      toast.error("Nama dan slug kategori wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await saveCategoryAction({
        id: editingCategory?.id,
        name,
        slug,
        description,
      });

      if (res && !res.success) {
        toast.error(res.error || "Gagal menyimpan kategori.");
        return;
      }

      if (editingCategory) {
        setCategories(
          categories.map((c) =>
            c.id === editingCategory.id ? { ...c, name, slug, description } : c
          )
        );
        toast.success(`Kategori "${name}" berhasil diperbarui!`);
      } else {
        const newCat: CategoryWithCount = {
          id: `cat-${Date.now()}`,
          name,
          slug,
          description,
          article_count: 0,
        };
        setCategories([...categories, newCat]);
        toast.success(`Kategori baru "${name}" berhasil ditambahkan!`);
      }

      setModalOpen(false);
    } catch {
      toast.error("Terjadi kendala saat menyimpan kategori.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (cat: CategoryWithCount) => {
    const attachedCount = cat.article_count || 0;

    if (attachedCount > 0) {
      toast.error(
        `Kategori "${cat.name}" tidak dapat dihapus karena masih digunakan oleh ${attachedCount} artikel terbit!`
      );
      return;
    }

    if (confirm(`Yakin ingin menghapus kategori "${cat.name}"?`)) {
      try {
        const res = await deleteCategoryAction(cat.id);
        if (res && !res.success) {
          toast.error(res.error || "Gagal menghapus kategori.");
          return;
        }

        setCategories(categories.filter((c) => c.id !== cat.id));
        toast.success(`Kategori "${cat.name}" berhasil dihapus.`);
      } catch {
        toast.error("Terjadi kendala saat menghapus kategori.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Taksonomi Konten
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
            Kelola Kategori Artikel
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Atur klasifikasi tema artikel agar mudah ditemukan oleh pengunjung.
          </p>
        </div>

        <Button onClick={handleOpenAdd} className="gap-2 shadow-xs">
          <Plus className="h-4 w-4" />
          <span>Tambah Kategori Baru</span>
        </Button>
      </div>

      {/* Categories Table */}
      <div className="rounded-md border border-border bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface/50">
              <TableHead className="font-serif font-bold text-foreground">
                Nama Kategori
              </TableHead>
              <TableHead className="font-serif font-bold text-foreground">
                Slug URL
              </TableHead>
              <TableHead className="font-serif font-bold text-foreground">
                Deskripsi
              </TableHead>
              <TableHead className="font-serif font-bold text-foreground">
                Artikel Terkait
              </TableHead>
              <TableHead className="text-right font-serif font-bold text-foreground">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell className="font-semibold text-foreground text-sm">
                  {cat.name}
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  /{cat.slug}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                  {cat.description || "-"}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {cat.article_count || 0} Artikel
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenEdit(cat)}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(cat)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal Dialog Add/Edit */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-bold">
              {editingCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Masukkan nama, slug unik, dan deskripsi singkat untuk kategori artikel.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Nama Kategori
              </label>
              <Input
                type="text"
                placeholder="Contoh: Literasi Digital"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Slug URL
              </label>
              <Input
                type="text"
                placeholder="literasi-digital"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="text-xs font-mono"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Deskripsi
              </label>
              <Textarea
                rows={3}
                placeholder="Penjelasan ringkas tentang cakupan tema kategori..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setModalOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan Kategori"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
