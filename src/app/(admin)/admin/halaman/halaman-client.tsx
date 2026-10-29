"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  Compass,
  FileText,
  Loader2,
  Info,
  Users,
  ShieldCheck,
  Edit3,
  Upload,
  X,
  Eye,
  EyeOff,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  updateAboutPageAction,
  updateSectionHeadersAction,
} from "@/app/actions/pages";
import {
  OrganizationValue,
  TeamMember,
  createOrganizationValueAction,
  updateOrganizationValueAction,
  deleteOrganizationValueAction,
  createTeamMemberAction,
  updateTeamMemberAction,
  deleteTeamMemberAction,
  uploadTeamPhotoAction,
} from "@/app/actions/team-and-values";
import { toast } from "sonner";

interface InitialPageData {
  title: string;
  subtitle: string;
  story: string;
  visi: string;
  misi?: string[];
  team_title?: string;
  team_subtitle?: string;
  values_title?: string;
  values_subtitle?: string;
  values?: Array<{ title: string; desc: string }>;
  team?: Array<{ name: string; role: string; avatar: string }>;
}

export function AdminHalamanClient({
  initialData,
  initialValues = [],
  initialTeam = [],
}: {
  initialData: InitialPageData;
  initialValues?: OrganizationValue[];
  initialTeam?: TeamMember[];
}) {
  const router = useRouter();

  // Tab 1 & 2 Form states
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
  const [isSavingBasic, setIsSavingBasic] = React.useState(false);

  // Tab 3: Organization Values State
  const [valuesList, setValuesList] = React.useState<OrganizationValue[]>(initialValues);
  const [valueDialogOpen, setValueDialogOpen] = React.useState(false);
  const [editingValue, setEditingValue] = React.useState<OrganizationValue | null>(null);
  const [valueForm, setValueForm] = React.useState({
    title: "",
    description: "",
    sort_order: 1,
    is_active: true,
  });
  const [isSavingValue, setIsSavingValue] = React.useState(false);

  // Tab 4: Team Members State
  const [teamList, setTeamList] = React.useState<TeamMember[]>(initialTeam);
  const [teamDialogOpen, setTeamDialogOpen] = React.useState(false);
  const [editingTeam, setEditingTeam] = React.useState<TeamMember | null>(null);
  const [teamForm, setTeamForm] = React.useState({
    name: "",
    position: "",
    photo_url: "",
    bio: "",
    sort_order: 1,
    is_active: true,
  });
  const [isUploadingPhoto, setIsUploadingPhoto] = React.useState(false);
  const [isSavingTeam, setIsSavingTeam] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Section Headers State
  const [teamSectionTitle, setTeamSectionTitle] = React.useState(
    initialData.team_title || "Pengurus Tim Penggerak & Redaksi"
  );
  const [teamSectionSubtitle, setTeamSectionSubtitle] = React.useState(
    initialData.team_subtitle ||
      "Daftar profil dan foto kurator/redaksi yang tampil di rute publik /tentang (tabel: team_members)"
  );
  const [isSavingTeamHeader, setIsSavingTeamHeader] = React.useState(false);

  const [valuesSectionTitle, setValuesSectionTitle] = React.useState(
    initialData.values_title || "Nilai-Nilai yang Kami Pegang Teguh"
  );
  const [valuesSectionSubtitle, setValuesSectionSubtitle] = React.useState(
    initialData.values_subtitle ||
      "Prinsip dan nilai luhur yang tampil di rute publik /tentang (tabel: nilai)"
  );
  const [isSavingValuesHeader, setIsSavingValuesHeader] = React.useState(false);

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
    setTeamSectionTitle(initialData.team_title || "Pengurus Tim Penggerak & Redaksi");
    setTeamSectionSubtitle(
      initialData.team_subtitle ||
        "Daftar profil dan foto kurator/redaksi yang tampil di rute publik /tentang (tabel: team_members)"
    );
    setValuesSectionTitle(initialData.values_title || "Nilai-Nilai yang Kami Pegang Teguh");
    setValuesSectionSubtitle(
      initialData.values_subtitle ||
        "Prinsip dan nilai luhur yang tampil di rute publik /tentang (tabel: nilai)"
    );
  }, [initialData]);

  React.useEffect(() => {
    setValuesList(initialValues);
  }, [initialValues]);

  React.useEffect(() => {
    setTeamList(initialTeam);
  }, [initialTeam]);

  const handleSaveTeamHeader = async () => {
    setIsSavingTeamHeader(true);
    try {
      const res = await updateSectionHeadersAction({
        team_title: teamSectionTitle,
        team_subtitle: teamSectionSubtitle,
      });
      if (!res.success) {
        toast.error(res.error || "Gagal menyimpan judul bagian tim.");
        return;
      }
      toast.success("Pengaturan judul dan deskripsi bagian Tim Redaksi berhasil disimpan ke database!");
      router.refresh();
    } catch {
      toast.error("Terjadi kendala saat menyimpan judul bagian tim.");
    } finally {
      setIsSavingTeamHeader(false);
    }
  };

  const handleSaveValuesHeader = async () => {
    setIsSavingValuesHeader(true);
    try {
      const res = await updateSectionHeadersAction({
        values_title: valuesSectionTitle,
        values_subtitle: valuesSectionSubtitle,
      });
      if (!res.success) {
        toast.error(res.error || "Gagal menyimpan judul bagian nilai.");
        return;
      }
      toast.success("Pengaturan judul dan deskripsi bagian Nilai-Nilai berhasil disimpan ke database!");
      router.refresh();
    } catch {
      toast.error("Terjadi kendala saat menyimpan judul bagian nilai.");
    } finally {
      setIsSavingValuesHeader(false);
    }
  };

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

  const handleSaveBasic = async (sectionName: string) => {
    if (!tentangTitle.trim()) {
      toast.error("Judul halaman tidak boleh kosong.");
      return;
    }
    if (!tentangVisi.trim()) {
      toast.error("Pernyataan Visi tidak boleh kosong.");
      return;
    }

    setIsSavingBasic(true);
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
      toast.error("Terjadi kendala saat menyimpan halaman.");
    } finally {
      setIsSavingBasic(false);
    }
  };

  // ==============================================================================
  // VALUES (NILAI-NILAI) HANDLERS
  // ==============================================================================
  const openCreateValue = () => {
    setEditingValue(null);
    setValueForm({
      title: "",
      description: "",
      sort_order: valuesList.length + 1,
      is_active: true,
    });
    setValueDialogOpen(true);
  };

  const openEditValue = (val: OrganizationValue) => {
    setEditingValue(val);
    setValueForm({
      title: val.title,
      description: val.description,
      sort_order: val.sort_order,
      is_active: val.is_active,
    });
    setValueDialogOpen(true);
  };

  const handleSaveValue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valueForm.title.trim() || !valueForm.description.trim()) {
      toast.error("Judul dan deskripsi nilai wajib diisi.");
      return;
    }

    setIsSavingValue(true);
    try {
      if (editingValue && !editingValue.id.startsWith("temp-")) {
        const res = await updateOrganizationValueAction({
          id: editingValue.id,
          title: valueForm.title,
          description: valueForm.description,
          sort_order: valueForm.sort_order,
          is_active: valueForm.is_active,
        });
        if (!res.success) {
          toast.error(res.error || "Gagal memperbarui nilai.");
          return;
        }
        toast.success(`Nilai "${valueForm.title}" berhasil diperbarui.`);
      } else {
        const res = await createOrganizationValueAction(valueForm);
        if (!res.success) {
          toast.error(res.error || "Gagal menambahkan nilai.");
          return;
        }
        toast.success(`Nilai "${valueForm.title}" berhasil ditambahkan.`);
      }

      setValueDialogOpen(false);
      router.refresh();
    } catch {
      toast.error("Terjadi kesalahan sistem saat menyimpan nilai.");
    } finally {
      setIsSavingValue(false);
    }
  };

  const handleDeleteValue = async (val: OrganizationValue) => {
    if (confirm(`Apakah Anda yakin ingin menghapus nilai "${val.title}"?`)) {
      if (val.id.startsWith("temp-")) {
        setValuesList(valuesList.filter((v) => v.id !== val.id));
        toast.success("Nilai berhasil dihapus dari daftar.");
        return;
      }

      try {
        const res = await deleteOrganizationValueAction(val.id);
        if (!res.success) {
          toast.error(res.error || "Gagal menghapus nilai.");
          return;
        }
        toast.success(`Nilai "${val.title}" berhasil dihapus.`);
        setValuesList(valuesList.filter((v) => v.id !== val.id));
        router.refresh();
      } catch {
        toast.error("Terjadi kendala saat menghapus nilai.");
      }
    }
  };

  // ==============================================================================
  // TEAM MEMBERS HANDLERS
  // ==============================================================================
  const openCreateTeam = () => {
    setEditingTeam(null);
    setTeamForm({
      name: "",
      position: "",
      photo_url: "",
      bio: "",
      sort_order: teamList.length + 1,
      is_active: true,
    });
    setTeamDialogOpen(true);
  };

  const openEditTeam = (tm: TeamMember) => {
    setEditingTeam(tm);
    setTeamForm({
      name: tm.name,
      position: tm.position,
      photo_url: tm.photo_url || "",
      bio: tm.bio || "",
      sort_order: tm.sort_order,
      is_active: tm.is_active,
    });
    setTeamDialogOpen(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadTeamPhotoAction(formData);
      if (!res.success || !res.url) {
        toast.error(res.error || "Gagal mengunggah foto.");
        return;
      }

      setTeamForm((prev) => ({ ...prev, photo_url: res.url! }));
      toast.success("Foto anggota tim berhasil diunggah ke Supabase Storage!");
    } catch {
      toast.error("Terjadi kendala saat mengunggah foto.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSaveTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamForm.name.trim() || !teamForm.position.trim()) {
      toast.error("Nama dan jabatan anggota tim wajib diisi.");
      return;
    }

    setIsSavingTeam(true);
    try {
      if (editingTeam && !editingTeam.id.startsWith("temp-")) {
        const res = await updateTeamMemberAction({
          id: editingTeam.id,
          name: teamForm.name,
          position: teamForm.position,
          photo_url: teamForm.photo_url || null,
          bio: teamForm.bio || null,
          sort_order: teamForm.sort_order,
          is_active: teamForm.is_active,
          old_photo_url: editingTeam.photo_url,
        });

        if (!res.success) {
          toast.error(res.error || "Gagal memperbarui data tim.");
          return;
        }
        toast.success(`Data ${teamForm.name} berhasil diperbarui.`);
      } else {
        const res = await createTeamMemberAction({
          name: teamForm.name,
          position: teamForm.position,
          photo_url: teamForm.photo_url || null,
          bio: teamForm.bio || null,
          sort_order: teamForm.sort_order,
          is_active: teamForm.is_active,
        });

        if (!res.success) {
          toast.error(res.error || "Gagal menambahkan anggota tim.");
          return;
        }
        toast.success(`Anggota tim ${teamForm.name} berhasil ditambahkan.`);
      }

      setTeamDialogOpen(false);
      router.refresh();
    } catch {
      toast.error("Terjadi kesalahan sistem saat menyimpan data tim.");
    } finally {
      setIsSavingTeam(false);
    }
  };

  const handleDeleteTeam = async (tm: TeamMember) => {
    if (confirm(`Apakah Anda yakin ingin menghapus "${tm.name}" dari tim?`)) {
      if (tm.id.startsWith("temp-")) {
        setTeamList(teamList.filter((t) => t.id !== tm.id));
        toast.success("Anggota tim dihapus dari daftar.");
        return;
      }

      try {
        const res = await deleteTeamMemberAction(tm.id, tm.photo_url);
        if (!res.success) {
          toast.error(res.error || "Gagal menghapus anggota tim.");
          return;
        }
        toast.success(`Anggota tim "${tm.name}" berhasil dihapus.`);
        setTeamList(teamList.filter((t) => t.id !== tm.id));
        router.refresh();
      } catch {
        toast.error("Terjadi kendala saat menghapus data tim.");
      }
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          Manajemen Konten Publik
        </span>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground mt-1">
          Kelola Halaman Statis & Tim
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sunting naskah profil organisasi, visi, misi, nilai-nilai, dan pengurus tim redaksi Rumah Literasi di PostgreSQL Supabase.
        </p>
      </div>

      <Tabs defaultValue="visi" className="space-y-6">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full">
          <TabsTrigger value="visi" className="gap-2 text-xs">
            <Compass className="h-4 w-4" />
            <span>Visi & Misi</span>
          </TabsTrigger>
          <TabsTrigger value="tentang" className="gap-2 text-xs">
            <FileText className="h-4 w-4" />
            <span>Cerita & Profil</span>
          </TabsTrigger>
          <TabsTrigger value="nilai" className="gap-2 text-xs">
            <ShieldCheck className="h-4 w-4" />
            <span>Nilai-Nilai ({valuesList.length})</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-2 text-xs">
            <Users className="h-4 w-4" />
            <span>Tim Redaksi ({teamList.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* ================================================================== */}
        {/* TAB 1: VISI & MISI */}
        {/* ================================================================== */}
        <TabsContent value="visi">
          <Card className="border-border shadow-xs">
            <CardHeader className="border-b border-border pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-serif text-lg font-bold">
                    Pernyataan Visi & Arah Strategis
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-0.5">
                    Rumusan visi dan butir-butir misi resmi gerakan Rumah Literasi yang langsung tampil di rute publik /tentang.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span className="font-medium">Tersinkron Database</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
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
                  disabled={isSavingBasic}
                />
              </div>

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
                    disabled={isSavingBasic}
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
                          disabled={isSavingBasic}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMisi(idx)}
                        disabled={isSavingBasic || tentangMisi.length <= 1}
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
                  onClick={() => handleSaveBasic("Visi & Misi")}
                  disabled={isSavingBasic}
                  className="gap-2 shadow-xs"
                >
                  {isSavingBasic ? (
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

        {/* ================================================================== */}
        {/* TAB 2: TENTANG KAMI */}
        {/* ================================================================== */}
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
                  disabled={isSavingBasic}
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
                  disabled={isSavingBasic}
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
                  disabled={isSavingBasic}
                />
                <p className="text-[11px] text-muted-foreground">
                  Pisahkan paragraf cerita dengan menekan Enter dua kali (baris kosong).
                </p>
              </div>

              <div className="pt-2 flex justify-end border-t border-border">
                <Button
                  onClick={() => handleSaveBasic("Tentang Kami")}
                  disabled={isSavingBasic}
                  className="gap-2"
                >
                  {isSavingBasic ? (
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

        {/* ================================================================== */}
        {/* TAB 3: NILAI-NILAI ORGANISASI */}
        {/* ================================================================== */}
        <TabsContent value="nilai" className="space-y-6">
          {/* Card Pengaturan Judul & Keterangan Bagian Nilai */}
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-base font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Pengaturan Judul & Keterangan Bagian Nilai-Nilai</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Kustomisasi judul dan kalimat pengantar yang tampil di atas daftar nilai pada halaman publik <code>/tentang</code>.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Judul Bagian Nilai
                  </label>
                  <Input
                    value={valuesSectionTitle}
                    onChange={(e) => setValuesSectionTitle(e.target.value)}
                    placeholder="Contoh: Nilai-Nilai yang Kami Pegang Teguh"
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Keterangan / Subjudul Bagian Nilai
                  </label>
                  <Input
                    value={valuesSectionSubtitle}
                    onChange={(e) => setValuesSectionSubtitle(e.target.value)}
                    placeholder="Contoh: Prinsip dan nilai luhur yang tampil di rute publik /tentang"
                    className="text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <Button
                  onClick={handleSaveValuesHeader}
                  disabled={isSavingValuesHeader}
                  size="sm"
                  className="gap-2"
                >
                  {isSavingValuesHeader ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Menyimpan Judul...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Simpan Judul & Keterangan Nilai</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Section Daftar Nilai */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-md border border-border shadow-xs">
            <div>
              <h3 className="font-serif text-base font-bold text-foreground flex items-center gap-2">
                <span>Daftar Nilai-Nilai Inti Organisasi</span>
                <Badge variant="outline" className="text-xs font-sans">
                  {valuesList.length} Nilai
                </Badge>
              </h3>
              <p className="text-xs text-muted-foreground">
                Prinsip dan nilai luhur yang tampil di rute publik /tentang (tabel: <code>nilai</code>).
              </p>
            </div>
            <Button onClick={openCreateValue} size="sm" className="gap-2 shrink-0">
              <Plus className="h-4 w-4" />
              <span>Tambah Nilai Baru</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {valuesList.map((val) => (
              <Card key={val.id} className="border-border shadow-xs flex flex-col justify-between">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="outline" className="text-[10px] font-mono">
                      Urutan #{val.sort_order}
                    </Badge>
                    <Badge
                      variant={val.is_active ? "success" : "secondary"}
                      className="text-[10px]"
                    >
                      {val.is_active ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </div>
                  <CardTitle className="font-serif text-base font-bold text-foreground">
                    {val.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">
                    {val.description}
                  </p>
                  <div className="flex items-center justify-end gap-1 pt-2 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditValue(val)}
                      className="h-8 px-2 text-xs gap-1"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteValue(val)}
                      className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ================================================================== */}
        {/* TAB 4: TIM PENGGERAK & REDAKSI */}
        {/* ================================================================== */}
        <TabsContent value="team" className="space-y-6">
          {/* Card Pengaturan Judul & Keterangan Bagian Tim */}
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-base font-bold text-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>Pengaturan Judul & Keterangan Bagian Tim Redaksi</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Kustomisasi judul dan kalimat pengantar yang tampil di atas daftar tim pada halaman publik <code>/tentang</code>.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Judul Bagian Tim
                  </label>
                  <Input
                    value={teamSectionTitle}
                    onChange={(e) => setTeamSectionTitle(e.target.value)}
                    placeholder="Contoh: Pengurus Tim Penggerak & Redaksi"
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Keterangan / Subjudul Bagian Tim
                  </label>
                  <Input
                    value={teamSectionSubtitle}
                    onChange={(e) => setTeamSectionSubtitle(e.target.value)}
                    placeholder="Contoh: Daftar profil dan foto kurator/redaksi yang tampil di rute publik /tentang"
                    className="text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <Button
                  onClick={handleSaveTeamHeader}
                  disabled={isSavingTeamHeader}
                  size="sm"
                  className="gap-2"
                >
                  {isSavingTeamHeader ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Menyimpan Judul...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Simpan Judul & Keterangan Tim</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Section Daftar Anggota Tim */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-md border border-border shadow-xs">
            <div>
              <h3 className="font-serif text-base font-bold text-foreground flex items-center gap-2">
                <span>Daftar Anggota Tim Redaksi</span>
                <Badge variant="outline" className="text-xs font-sans">
                  {teamList.length} Orang
                </Badge>
              </h3>
              <p className="text-xs text-muted-foreground">
                Data anggota, jabatan, bio, dan foto kurator/redaksi (tabel: <code>team_members</code>).
              </p>
            </div>
            <Button onClick={openCreateTeam} size="sm" className="gap-2 shrink-0">
              <Plus className="h-4 w-4" />
              <span>Tambah Anggota Tim</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {teamList.map((tm) => (
              <Card key={tm.id} className="border-border shadow-xs flex flex-col items-center text-center p-4">
                <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-border mb-3 bg-muted flex items-center justify-center">
                  {tm.photo_url ? (
                    <Image
                      src={tm.photo_url}
                      alt={tm.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-bold text-base">
                      {tm.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="w-full space-y-1">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Badge variant="outline" className="text-[10px] font-mono">
                      #{tm.sort_order}
                    </Badge>
                    <Badge
                      variant={tm.is_active ? "success" : "secondary"}
                      className="text-[10px]"
                    >
                      {tm.is_active ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </div>
                  <h4 className="font-serif text-sm font-bold text-foreground truncate">
                    {tm.name}
                  </h4>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">
                    {tm.position}
                  </p>
                  {tm.bio && (
                    <p className="text-[10px] text-muted-foreground/80 line-clamp-2 mt-1">
                      {tm.bio}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-center gap-1.5 mt-4 pt-3 border-t border-border w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditTeam(tm)}
                    className="h-7 px-2 text-xs gap-1"
                  >
                    <Edit3 className="h-3 w-3" />
                    <span>Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTeam(tm)}
                    className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* ================================================================== */}
      {/* MODAL: CREATE / EDIT NILAI ORGANISASI */}
      {/* ================================================================== */}
      <Dialog open={valueDialogOpen} onOpenChange={setValueDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span>{editingValue ? "Edit Nilai Organisasi" : "Tambah Nilai Organisasi"}</span>
            </DialogTitle>
            <DialogDescription>
              Prinsip integritas dan pedoman nilai yang dipegang teguh oleh Rumah Literasi.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveValue} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Judul Nilai <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="Contoh: Integritas & Fakta"
                value={valueForm.title}
                onChange={(e) => setValueForm({ ...valueForm, title: e.target.value })}
                required
                disabled={isSavingValue}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Deskripsi Nilai <span className="text-destructive">*</span>
              </label>
              <Textarea
                rows={3}
                placeholder="Jelaskan makna nilai ini bagi gerakan literasi..."
                value={valueForm.description}
                onChange={(e) => setValueForm({ ...valueForm, description: e.target.value })}
                required
                disabled={isSavingValue}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Nomor Urutan Tampil
                </label>
                <Input
                  type="number"
                  min={1}
                  value={valueForm.sort_order}
                  onChange={(e) =>
                    setValueForm({ ...valueForm, sort_order: Number(e.target.value) })
                  }
                  disabled={isSavingValue}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Status Publikasi
                </label>
                <div className="pt-2">
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={valueForm.is_active}
                      onChange={(e) =>
                        setValueForm({ ...valueForm, is_active: e.target.checked })
                      }
                      className="rounded border-input text-primary focus:ring-primary"
                    />
                    <span>Tampilkan di web publik</span>
                  </label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setValueDialogOpen(false)}
                disabled={isSavingValue}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSavingValue} className="gap-2">
                {isSavingValue ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <span>Simpan Nilai</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================================================================== */}
      {/* MODAL: CREATE / EDIT ANGGOTA TIM */}
      {/* ================================================================== */}
      <Dialog open={teamDialogOpen} onOpenChange={setTeamDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span>{editingTeam ? "Edit Anggota Tim" : "Tambah Anggota Tim"}</span>
            </DialogTitle>
            <DialogDescription>
              Profil kurator, pengurus redaksi, dan fasilitator Rumah Literasi.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveTeam} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Nama Lengkap <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="Contoh: Dewi Lestari"
                  value={teamForm.name}
                  onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                  required
                  disabled={isSavingTeam}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Jabatan / Posisi <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="Contoh: Direktur Konten"
                  value={teamForm.position}
                  onChange={(e) => setTeamForm({ ...teamForm, position: e.target.value })}
                  required
                  disabled={isSavingTeam}
                />
              </div>
            </div>

            {/* Foto Tim & Upload ke Storage */}
            <div className="space-y-2 p-3 bg-muted/40 rounded-md border border-border">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>Foto Profil Tim</span>
                <span className="text-[11px] text-muted-foreground font-normal">
                  Bucket: <code>team-photos</code>
                </span>
              </label>

              <div className="flex items-center gap-3">
                <div className="relative h-16 w-16 rounded-full overflow-hidden border border-border bg-white shrink-0 flex items-center justify-center">
                  {teamForm.photo_url ? (
                    <Image
                      src={teamForm.photo_url}
                      alt="Preview"
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-muted-foreground/60" />
                  )}
                </div>

                <div className="flex-1 space-y-1.5">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingPhoto || isSavingTeam}
                    className="w-full gap-2 text-xs h-8"
                  >
                    {isUploadingPhoto ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Mengunggah Foto...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-3.5 w-3.5" />
                        <span>Pilih & Unggah Foto Baru</span>
                      </>
                    )}
                  </Button>
                  <Input
                    placeholder="Atau tempel URL gambar eksternal di sini..."
                    value={teamForm.photo_url}
                    onChange={(e) => setTeamForm({ ...teamForm, photo_url: e.target.value })}
                    className="text-[11px] h-7"
                    disabled={isSavingTeam}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Biografi Singkat (Opsional)
              </label>
              <Textarea
                rows={2}
                placeholder="Ringkasan pengalaman atau latar belakang keahlian..."
                value={teamForm.bio}
                onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}
                disabled={isSavingTeam}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Nomor Urutan Tampil
                </label>
                <Input
                  type="number"
                  min={1}
                  value={teamForm.sort_order}
                  onChange={(e) =>
                    setTeamForm({ ...teamForm, sort_order: Number(e.target.value) })
                  }
                  disabled={isSavingTeam}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Status Keaktifan
                </label>
                <div className="pt-2">
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={teamForm.is_active}
                      onChange={(e) =>
                        setTeamForm({ ...teamForm, is_active: e.target.checked })
                      }
                      className="rounded border-input text-primary focus:ring-primary"
                    />
                    <span>Tampilkan di halaman publik</span>
                  </label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setTeamDialogOpen(false)}
                disabled={isSavingTeam}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSavingTeam} className="gap-2">
                {isSavingTeam ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <span>Simpan Anggota Tim</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
