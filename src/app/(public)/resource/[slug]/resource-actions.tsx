"use client";

import * as React from "react";
import { Download, ExternalLink, Bookmark, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Resource } from "@/lib/dummy-data";

export function ResourceActionButtons({ resource }: { resource: Resource }) {
  const [isSaved, setIsSaved] = React.useState(false);

  const handleAction = () => {
    if (resource.type === "pdf") {
      toast.success("Memulai unduhan dokumen PDF...");
      // In dummy mode, notify user
    } else {
      if (resource.external_url) {
        window.open(resource.external_url, "_blank");
      } else {
        toast.info("Tautan eksternal sedang dipersiapkan.");
      }
    }
  };

  const [loading, setLoading] = React.useState(false);

  const toggleSave = async () => {
    setLoading(true);
    try {
      const { toggleFavoriteResourceAction } = await import("@/app/actions/resources");
      const res = await toggleFavoriteResourceAction(resource.id);
      if (res && !res.success) {
        toast.error(res.error || "Gagal menyimpan favorit.");
        return;
      }
      setIsSaved(res.isFavorited ?? !isSaved);
      if (res.isFavorited) {
        toast.success(`"${resource.title}" berhasil disimpan ke koleksi favorit!`);
      } else {
        toast.info(`"${resource.title}" dihapus dari favorit.`);
      }
    } catch {
      toast.error("Terjadi kendala saat menyimpan favorit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 pt-2">
      <Button onClick={handleAction} size="default" className="gap-2">
        {resource.type === "pdf" ? (
          <>
            <Download className="h-4 w-4" />
            <span>Unduh Dokumen PDF Gratis</span>
          </>
        ) : (
          <>
            <ExternalLink className="h-4 w-4" />
            <span>Kunjungi Situs Sumber</span>
          </>
        )}
      </Button>

      <Button
        variant="outline"
        size="default"
        onClick={toggleSave}
        className="gap-2"
      >
        <Bookmark className={isSaved ? "h-4 w-4 fill-amber-500 text-amber-500" : "h-4 w-4"} />
        <span>{isSaved ? "Tersimpan di Favorit" : "Simpan ke Favorit"}</span>
      </Button>
    </div>
  );
}
