"use client";

import * as React from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
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
import { Tip } from "@/lib/dummy-data";
import { saveTipAction, deleteTipAction } from "@/app/actions/tips";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AdminTipsClient({ initialTips }: { initialTips: Tip[] }) {
  const router = useRouter();
  const [tips, setTips] = React.useState<Tip[]>(initialTips);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingTip, setEditingTip] = React.useState<Tip | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    setTips(initialTips);
  }, [initialTips]);

  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [icon, setIcon] = React.useState("BookOpen");
  const [sortOrder, setSortOrder] = React.useState<number>(1);
  const [isActive, setIsActive] = React.useState(true);

  const handleOpenAdd = () => {
    setEditingTip(null);
    setTitle("");
    setContent("");
    setIcon("BookOpen");
    setSortOrder(tips.length + 1);
    setIsActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (tip: Tip) => {
    setEditingTip(tip);
    setTitle(tip.title);
    setContent(tip.content);
    setIcon(tip.icon);
    setSortOrder(tip.sort_order);
    setIsActive(tip.is_active);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error("Judul dan isi tips wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await saveTipAction({
        id: editingTip?.id,
        title,
        content,
        icon,
        sort_order: sortOrder,
        is_active: isActive,
      });

      if (res && !res.success) {
        toast.error(res.error || "Gagal menyimpan tips.");
        return;
      }

      if (editingTip) {
        setTips(
          tips.map((t) =>
            t.id === editingTip.id
              ? { ...t, title, content, icon, sort_order: sortOrder, is_active: isActive }
              : t
          )
        );
        toast.success(`Tips "${title}" berhasil diperbarui!`);
      } else {
        toast.success(`Tips baru "${title}" berhasil ditambahkan!`);
      }

      router.refresh();
      setModalOpen(false);
    } catch {
      toast.error("Terjadi kendala saat menyimpan tips.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, ttl: string) => {
    if (confirm(`Hapus tips "${ttl}"?`)) {
      try {
        const res = await deleteTipAction(id);
        if (res && !res.success) {
          toast.error(res.error || "Gagal menghapus tips.");
          return;
        }

        setTips(tips.filter((t) => t.id !== id));
        router.refresh();
        toast.success(`Tips "${ttl}" berhasil dihapus.`);
      } catch {
        toast.error("Terjadi kendala saat menghapus tips.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Edukasi Praktis
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
            Kelola Tips Membaca Praktis
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tips mikro yang tampil di halaman Mulai Sekarang untuk membantu pembaca pemula.
          </p>
        </div>

        <Button onClick={handleOpenAdd} className="gap-2 shadow-xs">
          <Plus className="h-4 w-4" />
          <span>Tambah Tips Baru</span>
        </Button>
      </div>

      <div className="rounded-md border border-border bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface/50">
              <TableHead className="font-serif font-bold text-foreground">
                Judul Tips
              </TableHead>
              <TableHead className="font-serif font-bold text-foreground">
                Isi Tips Praktis
              </TableHead>
              <TableHead className="font-serif font-bold text-foreground">
                Ikon
              </TableHead>
              <TableHead className="font-serif font-bold text-foreground text-center">
                Urutan
              </TableHead>
              <TableHead className="text-right font-serif font-bold text-foreground">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tips.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-sm text-muted-foreground">
                  Belum ada tips membaca.
                </TableCell>
              </TableRow>
            ) : (
              tips.map((tip) => (
                <TableRow key={tip.id}>
                  <TableCell className="font-serif font-semibold text-foreground text-sm">
                    {tip.title}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-md line-clamp-2">
                    {tip.content}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {tip.icon}
                  </TableCell>
                  <TableCell className="text-center font-bold text-xs text-foreground">
                    #{tip.sort_order}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(tip)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="h-4 w-4 text-primary" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(tip.id, tip.title)}
                        className="h-8 w-8 p-0 text-destructive hover:bg-red-50"
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

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingTip ? "Edit Tips" : "Tambah Tips Baru"}</DialogTitle>
            <DialogDescription>
              Tuliskan instruksi praktis yang mudah diaplikasikan sehari-hari.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Judul Tips <span className="text-destructive">*</span>
              </label>
              <Input
                type="text"
                placeholder="Contoh: Aturan 2 Menit Membaca"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Isi Tips <span className="text-destructive">*</span>
              </label>
              <Textarea
                rows={4}
                placeholder="Penjelasan strategi dan cara melakukannya..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Nama Ikon
                </label>
                <Select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                >
                  <option value="Clock">Jam / Waktu (Clock)</option>
                  <option value="BookOpen">Buku (BookOpen)</option>
                  <option value="ThumbsDown">Tinggalkan (ThumbsDown)</option>
                  <option value="MessageCircle">Diskusi (MessageCircle)</option>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Nomor Urut Tampil
                </label>
                <Input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                />
              </div>
            </div>

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
                {isSubmitting ? "Menyimpan..." : "Simpan Tips"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
