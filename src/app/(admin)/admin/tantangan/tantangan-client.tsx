"use client";

import * as React from "react";
import { Plus, Edit2, Trash2, ListOrdered } from "lucide-react";
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
import { Challenge, ChallengeDay } from "@/lib/dummy-data";
import { saveChallengeAction, deleteChallengeAction } from "@/app/actions/challenges";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AdminTantanganClient({ initialChallenges }: { initialChallenges: Challenge[] }) {
  const router = useRouter();
  const [challenges, setChallenges] = React.useState<Challenge[]>(initialChallenges);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [daysModalOpen, setDaysModalOpen] = React.useState(false);
  const [activeChallenge, setActiveChallenge] = React.useState<Challenge | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    setChallenges(initialChallenges);
  }, [initialChallenges]);

  // Form state
  const [title, setTitle] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [durationDays, setDurationDays] = React.useState<7 | 21 | 30>(7);
  const [coverUrl, setCoverUrl] = React.useState("");

  const handleOpenAdd = () => {
    setActiveChallenge(null);
    setTitle("");
    setSlug("");
    setDescription("");
    setDurationDays(7);
    setCoverUrl("https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=600&auto=format&fit=crop");
    setModalOpen(true);
  };

  const handleOpenEdit = (ch: Challenge) => {
    setActiveChallenge(ch);
    setTitle(ch.title);
    setSlug(ch.slug);
    setDescription(ch.description);
    setDurationDays(ch.duration_days);
    setCoverUrl(ch.cover_url);
    setModalOpen(true);
  };

  const handleOpenDays = (ch: Challenge) => {
    setActiveChallenge(ch);
    setDaysModalOpen(true);
  };

  const handleSaveChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error("Judul dan deskripsi program tantangan wajib diisi.");
      return;
    }

    const calculatedSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
        .replace(/--+/g, "-");

    setIsSubmitting(true);
    try {
      const res = await saveChallengeAction({
        id: activeChallenge?.id,
        title,
        slug: calculatedSlug,
        description,
        duration_days: durationDays,
        cover_url: coverUrl,
      });

      if (res && !res.success) {
        toast.error(res.error || "Gagal menyimpan program tantangan.");
        return;
      }

      if (activeChallenge) {
        setChallenges(
          challenges.map((c) =>
            c.id === activeChallenge.id
              ? {
                  ...c,
                  title,
                  slug: calculatedSlug,
                  description,
                  duration_days: durationDays,
                  cover_url: coverUrl,
                }
              : c
          )
        );
        toast.success(`Program tantangan "${title}" berhasil diperbarui!`);
      } else {
        toast.success(`Tantangan baru "${title}" berhasil dibuat!`);
      }

      router.refresh();
      setModalOpen(false);
    } catch {
      toast.error("Terjadi kendala saat menyimpan tantangan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, ttl: string) => {
    if (confirm(`Hapus program tantangan "${ttl}"?`)) {
      try {
        const res = await deleteChallengeAction(id);
        if (res && !res.success) {
          toast.error(res.error || "Gagal menghapus tantangan.");
          return;
        }

        setChallenges(challenges.filter((c) => c.id !== id));
        router.refresh();
        toast.success(`Tantangan "${ttl}" berhasil dihapus.`);
      } catch {
        toast.error("Terjadi kendala saat menghapus tantangan.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Program Pembiasaan
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
            Kelola Tantangan Literasi
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Atur kurikulum tantangan 7, 21, atau 30 hari serta tugas harian peserta.
          </p>
        </div>

        <Button onClick={handleOpenAdd} className="gap-2 shadow-xs">
          <Plus className="h-4 w-4" />
          <span>Tambah Tantangan Baru</span>
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border border-border bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface/50">
              <TableHead className="font-serif font-bold text-foreground">
                Judul Program
              </TableHead>
              <TableHead className="font-serif font-bold text-foreground">
                Durasi Hari
              </TableHead>
              <TableHead className="font-serif font-bold text-foreground">
                Peserta Aktif
              </TableHead>
              <TableHead className="font-serif font-bold text-foreground">
                Jadwal Tugas Harian
              </TableHead>
              <TableHead className="text-right font-serif font-bold text-foreground">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {challenges.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-sm text-muted-foreground">
                  Belum ada program tantangan yang dibuat.
                </TableCell>
              </TableRow>
            ) : (
              challenges.map((ch) => (
                <TableRow key={ch.id}>
                  <TableCell>
                    <p className="font-serif font-semibold text-foreground text-sm">
                      {ch.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-sm">
                      {ch.description}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="accent" className="font-bold text-xs">
                      {ch.duration_days} Hari
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-foreground">
                    {ch.participants_count?.toLocaleString("id-ID") || 0} Peserta
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDays(ch)}
                      className="h-8 text-xs gap-1.5"
                    >
                      <ListOrdered className="h-3.5 w-3.5 text-primary" />
                      <span>Lihat {ch.days?.length || 0} Hari Tugas</span>
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(ch)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="h-4 w-4 text-primary" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(ch.id, ch.title)}
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

      {/* Program Create / Edit Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {activeChallenge ? "Edit Tantangan" : "Buat Tantangan Baru"}
            </DialogTitle>
            <DialogDescription>
              Durasi tantangan dibatasi pada standar 7, 21, atau 30 hari.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveChallenge} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Judul Tantangan <span className="text-destructive">*</span>
              </label>
              <Input
                type="text"
                placeholder="Contoh: 14 Hari Membaca Buku Klasik"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!activeChallenge) {
                    setSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)+/g, "")
                    );
                  }
                }}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Durasi Program
                </label>
                <Select
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value) as any)}
                >
                  <option value={7}>7 Hari (Pemula)</option>
                  <option value={21}>21 Hari (Membangun Kebiasaan)</option>
                  <option value={30}>30 Hari (Penguasaan Penuh)</option>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Slug URL
                </label>
                <Input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Deskripsi Program
              </label>
              <Textarea
                rows={3}
                placeholder="Penjelasan tujuan dan target hasil dari tantangan ini..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                URL Gambar Sampul
              </label>
              <Input
                type="url"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
              />
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
                {isSubmitting ? "Menyimpan..." : "Simpan Program"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Daily Tasks Modal View */}
      <Dialog open={daysModalOpen} onOpenChange={setDaysModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>
              Kurikulum Harian: {activeChallenge?.title}
            </DialogTitle>
            <DialogDescription>
              Daftar instruksi tugas harian untuk program {activeChallenge?.duration_days} hari.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 overflow-y-auto max-h-[55vh] pr-2 pt-2">
            {activeChallenge?.days && activeChallenge.days.length > 0 ? (
              activeChallenge.days.map((day) => (
                <div
                  key={day.id}
                  className="rounded-md border border-border bg-surface/50 p-3.5 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-[10px]">
                        {day.day_number}
                      </span>
                      <span>{day.task_title}</span>
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      Hari ke-{day.day_number}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground pl-7 leading-relaxed">
                    {day.task_description}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground text-center py-6">
                Belum ada jadwal tugas harian.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button size="sm" onClick={() => setDaysModalOpen(false)}>
              Tutup Silabus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
