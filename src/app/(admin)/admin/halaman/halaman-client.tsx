"use client";

import * as React from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { updateStaticPageAction } from "@/app/actions/pages";
import { useRouter } from "next/navigation";
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

export function AdminHalamanClient({ initialData }: { initialData: InitialPageData }) {
  const router = useRouter();
  const [tentangTitle, setTentangTitle] = React.useState(initialData.title);
  const [tentangSubtitle, setTentangSubtitle] = React.useState(initialData.subtitle);
  const [tentangStory, setTentangStory] = React.useState(initialData.story);
  const [tentangVisi, setTentangVisi] = React.useState(initialData.visi);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    setTentangTitle(initialData.title);
    setTentangSubtitle(initialData.subtitle);
    setTentangStory(initialData.story);
    setTentangVisi(initialData.visi);
  }, [initialData]);

  const handleSave = async (section: string) => {
    setIsSaving(true);
    try {
      const res = await updateStaticPageAction(
        "tentang",
        tentangTitle,
        JSON.stringify({
          subtitle: tentangSubtitle,
          story: tentangStory,
          visi: tentangVisi,
          misi: initialData.misi || [],
          values: initialData.values || [],
          team: initialData.team || [],
        })
      );

      if (res && !res.success) {
        toast.error(res.error || "Gagal menyimpan konten halaman.");
        return;
      }

      router.refresh();
      toast.success(`Halaman statis "${section}" berhasil disimpan ke database!`);
    } catch {
      toast.error("Terjadi kendala saat menyimpan halaman.");
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
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
          Kelola Konten Halaman Statis
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sunting naskah profil organisasi, visi, misi, dan narasi gerakan Masyarakat Literasi di database.
        </p>
      </div>

      <Tabs defaultValue="tentang" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tentang">Halaman Tentang Kami</TabsTrigger>
          <TabsTrigger value="visi">Visi & Misi Organisasi</TabsTrigger>
        </TabsList>

        {/* Tentang Kami Editor */}
        <TabsContent value="tentang">
          <Card className="border-border shadow-xs">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="font-serif text-lg font-bold">
                Sunting Narasi & Cerita Latar Belakang
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Teks ini tampil langsung pada rute publik /tentang.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Judul Halaman
                </label>
                <Input
                  type="text"
                  value={tentangTitle}
                  onChange={(e) => setTentangTitle(e.target.value)}
                  className="text-sm font-semibold"
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
                />
              </div>

              <Button
                onClick={() => handleSave("Tentang Kami")}
                disabled={isSaving}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                <span>{isSaving ? "Menyimpan ke Database..." : "Simpan Perubahan Cerita"}</span>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Visi Misi Editor */}
        <TabsContent value="visi">
          <Card className="border-border shadow-xs">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="font-serif text-lg font-bold">
                Pernyataan Visi & Arah Strategis
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Rumusan visi resmi gerakan Masyarakat Literasi yang tersimpan di PostgreSQL.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Pernyataan Visi
                </label>
                <Textarea
                  rows={4}
                  value={tentangVisi}
                  onChange={(e) => setTentangVisi(e.target.value)}
                  className="text-sm leading-relaxed"
                />
              </div>

              <Button
                onClick={() => handleSave("Visi & Misi")}
                disabled={isSaving}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                <span>{isSaving ? "Menyimpan..." : "Simpan Perubahan Visi"}</span>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
