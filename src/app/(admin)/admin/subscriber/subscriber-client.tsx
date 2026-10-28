"use client";

import * as React from "react";
import {
  Search,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  FileSpreadsheet,
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
import { Subscriber } from "@/lib/dummy-data";
import { deleteSubscriberAction } from "@/app/actions/subscribers";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AdminSubscriberClient({ initialSubscribers }: { initialSubscribers: Subscriber[] }) {
  const router = useRouter();
  const [subscribers, setSubscribers] = React.useState<Subscriber[]>(initialSubscribers);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  React.useEffect(() => {
    setSubscribers(initialSubscribers);
  }, [initialSubscribers]);

  const filteredSubs = subscribers.filter((sub) => {
    const matchesStatus =
      statusFilter === "all" || sub.status === statusFilter;
    const matchesSearch =
      sub.whatsapp.includes(search) ||
      (sub.name && sub.name.toLowerCase().includes(search.toLowerCase())) ||
      (sub.email && sub.email.toLowerCase().includes(search.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  const handleDelete = async (id: string, wa: string) => {
    if (confirm(`Hapus subscriber dengan nomor ${wa}?`)) {
      try {
        const res = await deleteSubscriberAction(id);
        if (res && !res.success) {
          toast.error(res.error || "Gagal menghapus subscriber.");
          return;
        }

        setSubscribers(subscribers.filter((s) => s.id !== id));
        router.refresh();
        toast.success(`Subscriber ${wa} berhasil dihapus.`);
      } catch {
        toast.error("Terjadi kendala saat menghapus subscriber.");
      }
    }
  };

  const handleExportCSV = () => {
    if (filteredSubs.length === 0) {
      toast.error("Tidak ada data untuk diekspor.");
      return;
    }

    const headers = ["ID", "WhatsApp", "Nama", "Email", "Status", "Tanggal Daftar"];
    const rows = filteredSubs.map((s) => [
      `"${s.id}"`,
      `"+${s.whatsapp}"`,
      `"${s.name || ""}"`,
      `"${s.email || ""}"`,
      `"${s.status}"`,
      `"${s.created_at}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `subscribers_literasi_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Berhasil mengekspor ${filteredSubs.length} kontak subscriber.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Audiens Buletin
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
            Subscriber Newsletter WhatsApp
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Daftar kontak terverifikasi Double Opt-In yang berhak menerima siaran pesan berkala.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={handleExportCSV}
          className="gap-2 shadow-xs text-xs"
        >
          <FileSpreadsheet className="h-4 w-4 text-emerald-700" />
          <span>Ekspor CSV</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari nomor WA, nama, atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <span className="text-xs text-muted-foreground mr-1">Status:</span>
          {[
            { id: "all", label: "Semua" },
            { id: "active", label: "Aktif" },
            { id: "pending", label: "Pending" },
            { id: "unsubscribed", label: "Berhenti" },
          ].map((st) => (
            <Button
              key={st.id}
              variant={statusFilter === st.id ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(st.id)}
              className="text-xs h-8"
            >
              {st.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border border-border bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface/50">
              <TableHead className="font-serif font-bold text-foreground">
                Nomor WhatsApp
              </TableHead>
              <TableHead className="font-serif font-bold text-foreground">
                Nama & Email
              </TableHead>
              <TableHead className="font-serif font-bold text-foreground">
                Status Verifikasi
              </TableHead>
              <TableHead className="font-serif font-bold text-foreground">
                Waktu Pendaftaran
              </TableHead>
              <TableHead className="text-right font-serif font-bold text-foreground">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-sm text-muted-foreground">
                  Belum ada data subscriber terdaftar.
                </TableCell>
              </TableRow>
            ) : (
              filteredSubs.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-mono text-xs font-semibold text-foreground">
                    +{sub.whatsapp}
                  </TableCell>
                  <TableCell>
                    <p className="text-xs font-medium text-foreground">
                      {sub.name || "(Tanpa Nama)"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {sub.email || "-"}
                    </p>
                  </TableCell>
                  <TableCell>
                    {sub.status === "active" && (
                      <Badge variant="success" className="text-[10px] gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Aktif Terverifikasi
                      </Badge>
                    )}
                    {sub.status === "pending" && (
                      <Badge variant="accent" className="text-[10px] gap-1">
                        <Clock className="h-3 w-3" />
                        Menunggu Double Opt-in
                      </Badge>
                    )}
                    {sub.status === "unsubscribed" && (
                      <Badge variant="destructive" className="text-[10px] gap-1">
                        <XCircle className="h-3 w-3" />
                        Berhenti (STOP)
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(sub.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(sub.id, sub.whatsapp)}
                      className="h-8 w-8 p-0 text-destructive hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
