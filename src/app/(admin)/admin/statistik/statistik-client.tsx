"use client";

import * as React from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
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
import { StatisticItem } from "@/lib/dummy-data";
import {
  saveStatisticAction,
  deleteStatisticAction,
  toggleStatisticActiveAction,
} from "@/app/actions/statistics";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AdminStatistikClient({ initialStatistics }: { initialStatistics: StatisticItem[] }) {
  const router = useRouter();
  const [statistics, setStatistics] = React.useState<StatisticItem[]>(initialStatistics);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingStat, setEditingStat] = React.useState<StatisticItem | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    setStatistics(initialStatistics);
  }, [initialStatistics]);

  const [label, setLabel] = React.useState("");
  const [type, setType] = React.useState<"metric" | "fact" | "chart">("metric");
  const [value, setValue] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [sourceName, setSourceName] = React.useState("");
  const [sourceUrl, setSourceUrl] = React.useState("");
  const [year, setYear] = React.useState<number>(2025);
  const [sortOrder, setSortOrder] = React.useState<number>(1);
  const [isActive, setIsActive] = React.useState(true);

  const handleOpenAdd = () => {
    setEditingStat(null);
    setLabel("");
    setType("metric");
    setValue("");
    setDescription("");
    setSourceName("");
    setSourceUrl("");
    setYear(new Date().getFullYear());
    setSortOrder(statistics.length + 1);
    setIsActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (st: StatisticItem) => {
    setEditingStat(st);
    setLabel(st.label);
    setType(st.type);
    setValue(st.value || "");
    setDescription(st.description || "");
    setSourceName(st.source_name);
    setSourceUrl(st.source_url || "");
    setYear(st.year);
    setSortOrder(st.sort_order);
    setIsActive(st.is_active);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label || !sourceName) {
      toast.error("Label dan nama sumber wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await saveStatisticAction({
        id: editingStat?.id,
        label,
        type,
        value: value || undefined,
        description,
        source_name: sourceName,
        source_url: sourceUrl || undefined,
        year,
        sort_order: sortOrder,
        is_active: isActive,
      });

      if (res && !res.success) {
        toast.error(res.error || "Gagal menyimpan statistik.");
        return;
      }

      if (editingStat) {
        setStatistics(
          statistics.map((s) =>
            s.id === editingStat.id
              ? {
                  ...s,
                  label,
                  type,
                  value: value || undefined,
                  description,
                  source_name: sourceName,
                  source_url: sourceUrl || undefined,
                  year,
                  sort_order: sortOrder,
                  is_active: isActive,
                }
              : s
          )
        );
        toast.success(`Data statistik "${label}" berhasil diperbarui!`);
      } else {
        toast.success(`Data statistik baru "${label}" berhasil ditambahkan!`);
      }

      router.refresh();
      setModalOpen(false);
    } catch {
      toast.error("Terjadi kendala saat menyimpan statistik.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, lbl: string) => {
    if (confirm(`Hapus data statistik "${lbl}"?`)) {
      try {
        const res = await deleteStatisticAction(id);
        if (res && !res.success) {
          toast.error(res.error || "Gagal menghapus data statistik.");
          return;
        }

        setStatistics(statistics.filter((s) => s.id !== id));
        router.refresh();
        toast.success(`Data statistik "${lbl}" berhasil dihapus.`);
      } catch {
        toast.error("Terjadi kendala saat menghapus statistik.");
      }
    }
  };

  const toggleActive = async (id: string) => {
    const item = statistics.find((s) => s.id === id);
    if (!item) return;

    try {
      await toggleStatisticActiveAction(id, item.is_active);
      setStatistics(
        statistics.map((s) =>
          s.id === id ? { ...s, is_active: !s.is_active } : s
        )
      );
      router.refresh();
      toast.info("Status tampil statistik berhasil diubah.");
    } catch {
      toast.error("Gagal mengubah status statistik.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Riset & Data
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
            Kelola Statistik & Fakta Literasi
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Data indikator kunci, deret tren grafik Recharts, dan fakta terverifikasi nasional.
          </p>
        </div>

        <Button onClick={handleOpenAdd} className="gap-2 shadow-xs">
          <Plus className="h-4 w-4" />
          <span>Tambah Data Baru</span>
        </Button>
      </div>

      <div className="rounded-md border border-border bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface/50">
              <TableHead className="font-serif font-bold text-foreground">
                Label Indikator
              </TableHead>
              <TableHead className="font-serif font-bold text-foreground">
                Tipe Data
              </TableHead>
              <TableHead className="font-serif font-bold text-foreground">
                Nilai Angka
              </TableHead>
              <TableHead className="font-serif font-bold text-foreground">
                Sumber & Tahun
              </TableHead>
              <TableHead className="font-serif font-bold text-foreground text-center">
                Aktif
              </TableHead>
              <TableHead className="text-right font-serif font-bold text-foreground">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statistics.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-sm text-muted-foreground">
                  Belum ada data statistik.
                </TableCell>
              </TableRow>
            ) : (
              statistics.map((st) => (
                <TableRow key={st.id}>
                  <TableCell>
                    <p className="font-serif font-semibold text-foreground text-sm">
                      {st.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-sm">
                      {st.description}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                      {st.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs font-bold text-foreground">
                    {st.value || "(Deret Grafik)"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {st.source_name} ({st.year})
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      type="button"
                      onClick={() => toggleActive(st.id)}
                      className="cursor-pointer"
                    >
                      {st.is_active ? (
                        <Badge variant="success" className="text-[10px]">
                          Aktif
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px]">
                          Nonaktif
                        </Badge>
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(st)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="h-4 w-4 text-primary" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(st.id, st.label)}
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

      {/* Modal Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingStat ? "Edit Data Statistik" : "Tambah Data Statistik Baru"}
            </DialogTitle>
            <DialogDescription>
              Wajib mencantumkan sumber dan tahun data untuk akuntabilitas.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Label / Judul Indikator <span className="text-destructive">*</span>
              </label>
              <Input
                type="text"
                placeholder="Contoh: Rata-rata Waktu Membaca Harian"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Tipe Indikator
                </label>
                <Select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                >
                  <option value="metric">Angka Kunci (Metric)</option>
                  <option value="fact">Fakta Teks (Fact)</option>
                  <option value="chart">Grafik Deret (Chart)</option>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Nilai Angka Singkat
                </label>
                <Input
                  type="text"
                  placeholder="Contoh: 1 Jam 12 Menit atau 42.500+"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Deskripsi / Penjelasan Konteks
              </label>
              <Textarea
                rows={2}
                placeholder="Penjelasan temuan riset..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Nama Sumber Lembaga <span className="text-destructive">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Contoh: Perpusnas RI"
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Tahun Terbit
                </label>
                <Input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
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
                {isSubmitting ? "Menyimpan..." : "Simpan Statistik"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
