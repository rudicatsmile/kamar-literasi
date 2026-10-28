"use client";

import * as React from "react";
import {
  Trash2,
  Search,
  Eye,
  Reply,
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AdminPesanClient({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const router = useRouter();
  const [messages, setMessages] = React.useState<ContactMessage[]>(initialMessages);
  const [search, setSearch] = React.useState("");
  const [selectedMessage, setSelectedMessage] = React.useState<ContactMessage | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  React.useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const filteredMessages = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setMessages(
      messages.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m))
    );
    setModalOpen(true);

    if (!msg.is_read) {
      await markContactMessageReadAction(msg.id, true);
      router.refresh();
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Hapus pesan dari "${name}"?`)) {
      try {
        const res = await deleteContactMessageAction(id);
        if (res && !res.success) {
          toast.error(res.error || "Gagal menghapus pesan.");
          return;
        }

        setMessages(messages.filter((m) => m.id !== id));
        router.refresh();
        toast.success(`Pesan dari ${name} telah dihapus.`);
      } catch {
        toast.error("Terjadi kendala saat menghapus pesan.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Kotak Masuk
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
            Pesan & Aspirasi Kontak Masuk
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pesan pertanyaan, tawaran kolaborasi, dan donasi buku dari formulir kontak publik.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {messages.filter((m) => !m.is_read).length} Belum Dibaca
          </Badge>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Cari nama, email, atau subjek..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 text-xs"
        />
      </div>

      {/* Messages Table */}
      <div className="rounded-md border border-border bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface/50">
              <TableHead className="font-serif font-bold text-foreground">
                Pengirim & Email
              </TableHead>
              <TableHead className="font-serif font-bold text-foreground">
                Subjek & Cuplikan Pesan
              </TableHead>
              <TableHead className="font-serif font-bold text-foreground">
                Status
              </TableHead>
              <TableHead className="font-serif font-bold text-foreground">
                Tanggal
              </TableHead>
              <TableHead className="text-right font-serif font-bold text-foreground">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMessages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  Tidak ada pesan yang sesuai.
                </TableCell>
              </TableRow>
            ) : (
              filteredMessages.map((msg) => (
                <TableRow
                  key={msg.id}
                  className={!msg.is_read ? "bg-amber-50/20 font-medium" : ""}
                >
                  <TableCell>
                    <p className="text-xs font-semibold text-foreground">
                      {msg.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {msg.email}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="font-serif font-semibold text-foreground text-sm">
                      {msg.subject}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1 max-w-md">
                      {msg.message}
                    </p>
                  </TableCell>
                  <TableCell>
                    {msg.is_read ? (
                      <Badge variant="outline" className="text-[10px] text-muted-foreground">
                        Sudah Dibaca
                      </Badge>
                    ) : (
                      <Badge variant="accent" className="text-[10px] font-bold">
                        Pesan Baru
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(msg.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenMessage(msg)}
                        className="h-8 w-8 p-0"
                        title="Buka Pesan"
                      >
                        <Eye className="h-4 w-4 text-primary" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(msg.id, msg.name)}
                        className="h-8 w-8 p-0 text-destructive hover:bg-red-50"
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
            <DialogTitle className="text-xl">
              {selectedMessage?.subject}
            </DialogTitle>
            <DialogDescription>
              Dari: <strong>{selectedMessage?.name}</strong> ({selectedMessage?.email})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="rounded-md border border-border bg-surface p-4 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
              {selectedMessage?.message}
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
              <span>
                Diterima:{" "}
                {selectedMessage &&
                  new Date(selectedMessage.created_at).toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <DialogFooter>
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
              className="gap-1.5"
            >
              <Reply className="h-3.5 w-3.5" />
              <span>Balas via Email</span>
            </Button>
            <Button size="sm" onClick={() => setModalOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
