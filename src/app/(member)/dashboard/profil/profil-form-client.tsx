"use client";

import * as React from "react";
import {
  User,
  Mail,
  Phone,
  Bell,
  Lock,
  Save,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { updateProfileAction, updatePasswordAction } from "@/app/actions/auth";
import { toast } from "sonner";

interface InitialProfile {
  id?: string;
  full_name: string;
  email: string;
  whatsapp?: string;
  avatar_url: string;
  reminder_enabled?: boolean;
}

export function MemberProfilClientForm({ initialProfile }: { initialProfile: InitialProfile }) {
  const [fullName, setFullName] = React.useState(initialProfile.full_name);
  const [email] = React.useState(initialProfile.email);
  const [whatsapp, setWhatsapp] = React.useState(initialProfile.whatsapp || "");
  const [reminderEnabled, setReminderEnabled] = React.useState(
    !!initialProfile.reminder_enabled
  );

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isSavingProfile, setIsSavingProfile] = React.useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = React.useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const res = await updateProfileAction({
        fullName,
        whatsapp,
        reminderEnabled: !!reminderEnabled,
      });

      if (res && !res.success) {
        toast.error(res.error || "Gagal memperbarui profil.");
        return;
      }
      toast.success("Informasi profil dan preferensi pengingat berhasil disimpan!");
    } catch {
      toast.error("Terjadi kendala saat menyimpan profil.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      toast.error("Mohon masukkan kata sandi baru.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Kata sandi baru minimal 8 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi kata sandi baru tidak sesuai.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const formData = new FormData();
      formData.append("newPassword", newPassword);
      formData.append("confirmPassword", confirmPassword);

      const res = await updatePasswordAction(formData);
      if (res && !res.success) {
        toast.error(res.error || "Gagal mengubah kata sandi.");
        return;
      }

      toast.success("Kata sandi akun Anda berhasil diperbarui!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Terjadi kendala saat memperbarui kata sandi.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          Pengaturan Akun
        </span>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
          Profil & Preferensi Notifikasi
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kelola identitas, nomor WhatsApp untuk pengingat tantangan, dan keamanan akun.
        </p>
      </div>

      {/* Main Profile Form */}
      <Card className="border-border shadow-xs">
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="font-serif text-lg font-bold text-foreground">
            Data Diri & Pengingat WhatsApp
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Nomor WhatsApp Anda hanya digunakan untuk pengingat jadwal check-in harian.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div className="flex items-center gap-4 pb-4 border-b border-border">
              <img
                src={initialProfile.avatar_url}
                alt={fullName}
                className="h-16 w-16 rounded-full object-cover border-2 border-border"
              />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">{fullName}</p>
                <p className="text-xs text-muted-foreground">{email}</p>
                <Badge variant="outline" className="text-[10px]">
                  Role: Anggota Terverifikasi
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Nama Lengkap</span>
                </label>
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Alamat Email</span>
                </label>
                <Input
                  type="email"
                  value={email}
                  disabled
                  className="text-xs bg-muted text-muted-foreground cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Nomor WhatsApp (Awali 08 atau 62)</span>
              </label>
              <Input
                type="tel"
                placeholder="Contoh: 081234567890"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="text-xs"
              />
              <p className="text-[11px] text-muted-foreground">
                Diperlukan bila Anda ingin menerima notifikasi otomatis jadwal membaca harian.
              </p>
            </div>

            <div className="rounded-md border border-border bg-surface p-4 flex items-start gap-3">
              <Checkbox
                id="reminder"
                checked={reminderEnabled}
                onCheckedChange={(checked) => setReminderEnabled(!!checked)}
                className="mt-0.5"
              />
              <div className="space-y-0.5">
                <label
                  htmlFor="reminder"
                  className="text-xs font-semibold text-foreground cursor-pointer flex items-center gap-1.5"
                >
                  <Bell className="h-3.5 w-3.5 text-amber-600" />
                  <span>Kirim Pengingat Membaca Harian via WhatsApp</span>
                </label>
                <p className="text-[11px] text-muted-foreground">
                  Sistem akan mengirimkan pesan singkat ramah setiap pukul 07:00 WIB untuk
                  menyemangati sesi membaca Anda.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isSavingProfile} className="gap-2 shadow-xs">
                <Save className="h-4 w-4" />
                <span>{isSavingProfile ? "Menyimpan..." : "Simpan Perubahan Profil"}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Security & Password Form */}
      <Card className="border-border shadow-xs">
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="font-serif text-lg font-bold text-foreground">
            Keamanan & Kata Sandi
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Perbarui kata sandi akun secara berkala untuk menjaga kerahasiaan catatan bacaan Anda.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Kata Sandi Baru</span>
                </label>
                <Input
                  type="password"
                  placeholder="Minimal 8 karakter"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Konfirmasi Kata Sandi Baru</span>
                </label>
                <Input
                  type="password"
                  placeholder="Ulangi kata sandi baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="outline"
                disabled={isUpdatingPassword}
                className="gap-2 shadow-xs"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>
                  {isUpdatingPassword ? "Memperbarui..." : "Ubah Kata Sandi Akun"}
                </span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
