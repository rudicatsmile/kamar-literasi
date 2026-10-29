"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Trash2,
  Search,
  Eye,
  Reply,
  Mail,
  MailOpen,
  MailCheck,
  CheckCircle2,
  Clock,
  Inbox,
  AlertCircle,
  ExternalLink,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ContactMessage } from "@/lib/dummy-data";
import {
  markContactMessageReadAction,
  deleteContactMessageAction,
} from "@/app/actions/contact";
import { toast } from "sonner";

export function AdminPesanClient({
  initialMessages,
}: {
  initialMessages: ContactMessage[];
}) {
  const router = useRouter();
  const [messages, setMessages] = React.useState<ContactMessage[]>(initialMessages);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "unread" | "read">("all");
  const [selectedMessage, setSelectedMessage] = React.useState<ContactMessage | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);

  React.useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const totalMessages = messages.length;
  const unreadCount = messages.filter((m) => !m.is_read).length;
  const readCount = messages.filter((m) => m.is_read).length;

  const filteredMessages = messages.filter((m) => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "unread" && !m.is_read) ||
      (statusFilter === "read" && m.is_read);

    const query = search.toLowerCase().trim();
    const matchesSearch =
      !query ||
      m.name.toLowerCase().includes(query) ||
      m.email.toLowerCase().includes(query) ||
      m.subject.toLowerCase().includes(query) ||
      m.message.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  const handleOpenMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setModalOpen(true);

    if (!msg.is_read) {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m))
      );
      try {
        await markContactMessageReadAction(msg.id, true);
        router.refresh();
      } catch (err) {
        console.error("Gagal memperbarui status baca:", err);
      }
    }
  };

  const handleToggleRead = async (msg: ContactMessage, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = !msg.is_read;
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, is_read: newStatus } : m))
    );

    try {
      const res = await markContactMessageReadAction(msg.id, newStatus);
      if (res && !res.success) {
        toast.error(res.error || "Gagal mengubah status pesan.");
        return;
      }
      toast.success(
        newStatus
          ? "Pesan ditandai sebagai sudah dibaca."
          : "Pesan ditandai sebagai belum dibaca."
      );
      router.refresh();
    } catch {
      toast.error("Terjadi kendala saat mengubah status pesan.");
    }
  };

  const handleDelete = async (id: string, name: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (confirm(`Apakah Anda yakin ingin menghapus pesan dari "${name}"?`)) {
      setIsDeleting(id);
      try {
        const res = await deleteContactMessageAction(id);
        if (res && !res.success) {
          toast.error(res.error || "Gagal menghapus pesan.");
          return;
        }

        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selectedMessage?.id === id) {
          setModalOpen(false);
          setSelectedMessage(null);
        }
        toast.success(`Pesan dari ${name} telah berhasil dihapus.`);
        router.refresh();
      } catch {
        toast.error("Terjadi kendala saat menghapus pesan.");
      } finally {
        setIsDeleting(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Kotak Masuk
            </span>
            <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-800 text-[10px]">
              Supabase Live
            </Badge>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1">
            Pesan & Aspirasi Kontak Masuk
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pesan pertanyaan, tawaran kolaborasi, dan donasi buku dari formulir kontak publik website.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/kontak"
            target="_blank"
            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1.5 bg-white border border-border px-3 py-1.5 rounded-md"
          >
            <span>Buka Formulir Kontak</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-md border border-border bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Pesan Masuk
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <Mail className="h-4 w-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-foreground mt-2">
            {totalMessages}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pesan dari formulir publik
          </p>
        </div>

        <div className="rounded-md border border-border bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Belum Dibaca (Baru)
            </span>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-md ${
                unreadCount > 0
                  ? "bg-amber-100 text-amber-800 animate-pulse"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p
            className={`font-serif text-2xl font-bold mt-2 ${
              unreadCount > 0 ? "text-amber-800" : "text-foreground"
            }`}
          >
            {unreadCount}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Menunggu respons atau tindak lanjut
          </p>
        </div>

        <div className="rounded-md border border-border bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Sudah Dibaca
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-foreground mt-2">
            {readCount}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pesan telah ditinjau redaksi
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-md border border-border">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari nama, email, subjek, isi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <Button
            size="sm"
            variant={statusFilter === "all" ? "default" : "outline"}
            onClick={() => setStatusFilter("all")}
            className="text-xs h-8 flex-1 sm:flex-none"
          >
            Semua ({totalMessages})
          </Button>
          <Button
            size="sm"
            variant={statusFilter === "unread" ? "default" : "outline"}
            onClick={() => setStatusFilter("unread")}
            className="text-xs h-8 flex-1 sm:flex-none"
          >
            Belum Dibaca ({unreadCount})
          </Button>
          <Button
            size="sm"
            variant={statusFilter === "read" ? "default" : "outline"}
            onClick={() => setStatusFilter("read")}
            className="text-xs h-8 flex-1 sm:flex-none"
          >
            Sudah Dibaca ({readCount})
          </Button>
        </div>
      </div>

      {/* Messages Table */}
      <div className="rounded-md border border-border bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-[260px] font-serif font-bold text-foreground">
                Pengirim & Email
              </TableHead>
              <TableHead className="font-serif font-bold text-foreground">
                Subjek & Cuplikan Pesan
              </TableHead>
              <TableHead className="w-[130px] font-serif font-bold text-foreground">
                Status
              </TableHead>
              <TableHead className="w-[150px] font-serif font-bold text-foreground">
                Tanggal Masuk
              </TableHead>
              <TableHead className="w-[140px] text-right font-serif font-bold text-foreground">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMessages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-44 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground space-y-2">
                    <Inbox className="h-10 w-10 text-muted-foreground/50" />
                    <p className="text-sm font-semibold text-foreground">
                      {search || statusFilter !== "all"
                        ? "Tidak ada pesan yang sesuai dengan filter."
                        : "Belum ada pesan kontak masuk."}
                    </p>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      {search || statusFilter !== "all"
                        ? "Coba ubah kata kunci pencarian atau ganti filter status."
                        : "Pesan yang dikirimkan oleh pengunjung melalui formulir kontak publik akan langsung muncul di sini."}
                    </p>
                    {(search || statusFilter !== "all") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearch("");
                          setStatusFilter("all");
                        }}
                        className="text-xs mt-2"
                      >
                        Reset Filter
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredMessages.map((msg) => (
                <TableRow
                  key={msg.id}
                  onClick={() => handleOpenMessage(msg)}
                  className={`cursor-pointer transition-colors ${
                    !msg.is_read
                      ? "bg-amber-50/40 hover:bg-amber-50/70 font-medium"
                      : "hover:bg-muted/30"
                  }`}
                >
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          !msg.is_read
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {msg.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-foreground truncate">
                          {msg.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground truncate">
                          {msg.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col max-w-md">
                      <span className="font-serif font-semibold text-foreground text-sm truncate">
                        {msg.subject}
                      </span>
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {msg.message}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    {msg.is_read ? (
                      <Badge
                        variant="outline"
                        className="text-[10px] text-muted-foreground bg-muted/30 border-border gap-1"
                      >
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        <span>Dibaca</span>
                      </Badge>
                    ) : (
                      <Badge
                        variant="accent"
                        className="text-[10px] font-bold bg-amber-100 text-amber-800 border-amber-200 gap-1"
                      >
                        <Clock className="h-3 w-3 text-amber-700" />
                        <span>Baru</span>
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground">
                    {msg.created_at
                      ? new Date(msg.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </TableCell>

                  <TableCell className="text-right">
                    <div
                      className="flex items-center justify-end gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Toggle Read/Unread */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleToggleRead(msg, e)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                        title={
                          msg.is_read
                            ? "Tandai sebagai belum dibaca"
                            : "Tandai sebagai sudah dibaca"
                        }
                      >
                        {msg.is_read ? (
                          <Mail className="h-4 w-4" />
                        ) : (
                          <MailCheck className="h-4 w-4 text-emerald-600" />
                        )}
                      </Button>

                      {/* View Message */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenMessage(msg)}
                        className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
                        title="Buka Pesan"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {/* Delete */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDelete(msg.id, msg.name, e)}
                        disabled={isDeleting === msg.id}
                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                        title="Hapus Pesan"
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

      {/* Message Reader Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-[10px]">
                {selectedMessage?.subject || "Pesan Kontak"}
              </Badge>
              {selectedMessage && (
                <span className="text-[11px] text-muted-foreground">
                  {new Date(selectedMessage.created_at).toLocaleString("id-ID")}
                </span>
              )}
            </div>
            <DialogTitle className="text-lg font-serif font-bold text-foreground">
              {selectedMessage?.subject}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Dari: <strong>{selectedMessage?.name}</strong> ({selectedMessage?.email})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="rounded-md border border-border bg-surface p-4 text-sm leading-relaxed text-foreground whitespace-pre-wrap font-sans">
              {selectedMessage?.message}
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-border">
            {selectedMessage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => handleDelete(selectedMessage.id, selectedMessage.name, e)}
                className="text-xs text-destructive hover:bg-destructive/10 gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Hapus Pesan</span>
              </Button>
            )}

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (selectedMessage) {
                    window.location.href = `mailto:${selectedMessage.email}?subject=Balasan: ${encodeURIComponent(
                      selectedMessage.subject
                    )}`;
                  }
                }}
                className="gap-1.5 text-xs"
              >
                <Reply className="h-3.5 w-3.5" />
                <span>Balas via Email</span>
              </Button>
              <Button size="sm" onClick={() => setModalOpen(false)} className="text-xs">
                Tutup
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
