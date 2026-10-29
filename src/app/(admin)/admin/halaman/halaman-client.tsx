"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  Compass,
  FileText,
  Loader2,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { updateAboutPageAction } from "@/app/actions/pages";
import { toast } from "sonner";

interface InitialPageData {
  title: string;
  subtitle: string;
  story: string;
  visi: string;
  misi?: string[];
  values?: Array<{ title: string; desc: string }>;
  team?: Array<{ name: string; role: string; avatar: string }>;
}

export function AdminHalamanClient({
  initialData,
}: {
  initialData: InitialPageData;
}) {
  const router = useRouter();

  // Form states
  const [tentangTitle, setTentangTitle] = React.useState(initialData.title || "");
  const [tentangSubtitle, setTentangSubtitle] = React.useState(
    initialData.subtitle || ""
  );
  const [tentangStory, setTentangStory] = React.useState(initialData.story || "");
  const [tentangVisi, setTentangVisi] = React.useState(initialData.visi || "");
  const [tentangMisi, setTentangMisi] = React.useState<string[]>(
    initialData.misi && initialData.misi.length > 0
      ? initialData.misi
      : [""]
  );

  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    setTentangTitle(initialData.title || "");
    setTentangSubtitle(initialData.subtitle || "");
    setTentangStory(initialData.story || "");
    setTentangVisi(initialData.visi || "");
    setTentangMisi(
      initialData.misi && initialData.misi.length > 0
        ? initialData.misi
        : [""]
    );
  }, [initialData]);

  // Mission list handlers
  const handleMisiChange = (index: number, val: string) => {
    const next = [...tentangMisi];
    next[index] = val;
    setTentangMisi(next);
  };

  const handleAddMisi = () => {
    setTentangMisi([...tentangMisi, ""]);
  };

  const handleRemoveMisi = (index: number) => {
    if (tentangMisi.length <= 1) {
      setTentangMisi([""]);
      return;
    }
    const next = tentangMisi.filter((_, idx) => idx !== index);
    setTentangMisi(next);
  };

  const handleSave = async (sectionName: string) => {
    if (!tentangTitle.trim()) {
      toast.error("Judul halaman tidak boleh kosong.");
      return;
    }
    if (!tentangVisi.trim()) {
      toast.error("Pernyataan Visi tidak boleh kosong.");
      return;
    }

    setIsSaving(true);
    try {
      const filteredMisi = tentangMisi
        .map((m) => m.trim())
        .filter((m) => m.length > 0);

      const res = await updateAboutPageAction({
        title: tentangTitle.trim(),
        subtitle: tentangSubtitle.trim(),
        story: tentangStory.trim(),
        visi: tentangVisi.trim(),
        misi: filteredMisi,
        values: initialData.values,
        team: initialData.team,
      });

      if (!res.success) {
        toast.error(res.error || "Gagal menyimpan konten halaman.");
        return;
      }

      toast.success(
        `Konten "${sectionName}" berhasil disimpan ke database Supabase!`
      );
      router.refresh();
    } catch {
      toast.error("Terjadi kendala jaringan saat menyimpan halaman.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          Halaman Statis
        </span>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground mt-1">
          Kelola Konten Halaman Statis
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sunting naskah profil organisasi, visi, misi, dan narasi gerakan Masyarakat Literasi yang tersimpan di PostgreSQL Supabase.
        </p>
      </div>

      <Tabs defaultValue="visi" className="space-y-6">
        <TabsList>
          <TabsTrigger value="visi" className="gap-2">
            <Compass className="h-4 w-4" />
            <span>Visi & Misi Organisasi</span>
          </TabsTrigger>
          <TabsTrigger value="tentang" className="gap-2">
            <FileText className="h-4 w-4" />
            <span>Halaman Tentang Kami</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Visi & Misi Editor */}
        <TabsContent value="visi">
          <Card className="border-border shadow-xs">
            <CardHeader className="border-b border-border pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-serif text-lg font-bold">
                    Pernyataan Visi & Arah Strategis
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-0.5">
                    Rumusan visi dan butir-butir misi resmi gerakan Masyarakat Literasi yang langsung tampil di rute publik /tentang.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span className="font-medium">Tersinkron Database</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Pernyataan Visi */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Pernyataan Visi <span className="text-destructive">*</span>
                  </label>
                  <span className="text-[11px] text-muted-foreground">
                    Tujuan jangka panjang organisasi
                  </span>
                </div>
                <Textarea
                  rows={4}
                  value={tentangVisi}
                  onChange={(e) => setTentangVisi(e.target.value)}
                  placeholder="Masukkan pernyataan visi organisasi..."
                  className="text-sm leading-relaxed"
                  disabled={isSaving}
                />
              </div>

              {/* Daftar Butir Misi */}
              <div className="space-y-3 border-t border-border pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                      Butir-Butir Misi Kami
                    </label>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Langkah-langkah strategis untuk mewujudkan visi. Ditampilkan sebagai poin berbutir di rute publik.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddMisi}
                    disabled={isSaving}
                    className="gap-1.5 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Tambah Poin Misi</span>
                  </Button>
                </div>

                <div className="space-y-3">
                  {tentangMisi.map((misiItem, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="flex h-9 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-bold text-muted-foreground mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <Input
                          value={misiItem}
                          onChange={(e) => handleMisiChange(idx, e.target.value)}
                          placeholder={`Poin misi ke-${idx + 1}...`}
                          className="text-xs leading-relaxed"
                          disabled={isSaving}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMisi(idx)}
                        disabled={isSaving || tentangMisi.length <= 1}
                        className="h-9 px-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        title="Hapus butir misi"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Info className="h-4 w-4 text-primary" />
                  <span>Perubahan langsung tersimpan ke Supabase dan memperbarui halaman publik.</span>
                </div>

                <Button
                  onClick={() => handleSave("Visi & Misi")}
                  disabled={isSaving}
                  className="gap-2 shadow-xs"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Menyimpan ke Database...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Simpan Perubahan Visi & Misi</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Tentang Kami Editor */}
        <TabsContent value="tentang">
          <Card className="border-border shadow-xs">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="font-serif text-lg font-bold">
                Sunting Narasi & Cerita Latar Belakang
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Teks judul, tagline, dan cerita latar belakang yang tampil di header dan badan rute publik /tentang.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Judul Halaman <span className="text-destructive">*</span>
                </label>
                <Input
                  type="text"
                  value={tentangTitle}
                  onChange={(e) => setTentangTitle(e.target.value)}
                  className="text-sm font-semibold"
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Sub-judul / Kutipan Tagline
                </label>
                <Input
                  type="text"
                  value={tentangSubtitle}
                  onChange={(e) => setTentangSubtitle(e.target.value)}
                  className="text-sm italic"
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Cerita Latar Belakang Lengkap
                </label>
                <Textarea
                  rows={10}
                  value={tentangStory}
                  onChange={(e) => setTentangStory(e.target.value)}
                  className="text-xs leading-relaxed font-sans"
                  disabled={isSaving}
                />
                <p className="text-[11px] text-muted-foreground">
                  Pisahkan paragraf cerita dengan menekan Enter dua kali (baris kosong).
                </p>
              </div>

              <div className="pt-2 flex justify-end border-t border-border">
                <Button
                  onClick={() => handleSave("Tentang Kami")}
                  disabled={isSaving}
                  className="gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Menyimpan ke Database...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Simpan Perubahan Cerita</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
