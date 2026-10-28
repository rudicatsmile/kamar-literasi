"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, User, Phone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

export default function DaftarPage() {
  const router = useRouter();
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [whatsapp, setWhatsapp] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [agreeTerms, setAgreeTerms] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast.error("Mohon lengkapi semua bidang wajib.");
      return;
    }
    if (password.length < 8) {
      toast.error("Kata sandi minimal 8 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Konfirmasi kata sandi tidak cocok.");
      return;
    }
    if (!agreeTerms) {
      toast.error("Anda harus menyetujui syarat & ketentuan.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("whatsapp", whatsapp);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);

    const { registerAction } = await import("@/app/actions/auth");
    const result = await registerAction(formData);

    setIsLoading(false);
    if (!result.success && result.error) {
      toast.error(result.error);
    } else {
      toast.success("Pendaftaran berhasil! Akun Anda telah aktif.");
      router.push("/dashboard");
    }
  };

  return (
    <Card className="border-border shadow-md">
      <CardHeader className="space-y-1.5 text-center pb-4">
        <CardTitle className="font-serif text-2xl font-bold text-foreground">
          Daftar Anggota Literasi
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Bergabung gratis untuk mengikuti tantangan 7/21/30 hari dan mencatat progres harian.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleRegister} className="space-y-3.5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Nama Lengkap <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Contoh: Budi Santoso"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pl-9 text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Alamat Email <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="budi@contoh.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Nomor WhatsApp (Untuk Pengingat Tantangan)
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="tel"
                placeholder="081234567890"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Kata Sandi <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Minimal 8 karakter (huruf & angka)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Konfirmasi Kata Sandi <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Ulangi kata sandi Anda"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-9 text-sm"
                required
              />
            </div>
          </div>

          <div className="flex items-start gap-2 pt-1">
            <Checkbox
              id="terms"
              checked={agreeTerms}
              onCheckedChange={(checked) => setAgreeTerms(checked)}
              className="mt-0.5"
            />
            <label htmlFor="terms" className="text-xs text-muted-foreground leading-snug cursor-pointer">
              Saya menyetujui Pedoman Komunitas dan Kebijakan Privasi Masyarakat Literasi.
            </label>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full gap-2 font-semibold mt-2">
            <span>{isLoading ? "Mendaftarkan Akun..." : "Buat Akun Sekarang"}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <div className="pt-2 text-center text-xs text-muted-foreground border-t border-border">
          Sudah memiliki akun terdaftar?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Masuk di Sini
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
